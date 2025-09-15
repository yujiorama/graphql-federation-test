package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/vektah/gqlparser/v2/ast"
	"yujiorama.github.io/graphql-federation-test/app/new-service/datasource"
	"yujiorama.github.io/graphql-federation-test/app/new-service/graph"
	"yujiorama.github.io/graphql-federation-test/app/new-service/graph/generated"
)

const defaultPort = "4002"
const defaultEndpoint = "/graphql"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	endpoint := os.Getenv("ENDPOINT_PATH")
	if endpoint == "" {
		endpoint = defaultEndpoint
	}

	db, err := datasource.NewDB()
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	srv := handler.New(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	// GraphQL オペレーション単位で Tx を開始するミドルウェア
	srv.AroundOperations(func(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
		start := time.Now()
		opCtx := graphql.GetOperationContext(ctx)
		// if opCtx != nil && opCtx.Operation != nil && opCtx.Operation.Operation == ast.Mutation { ... }
		log.Printf("Started %s %s", opCtx.Operation.Name, opCtx.Operation.Operation)
		log.Printf("Variables: %v", opCtx.Variables)
		defer func() {
			log.Printf("Completed %s %s in %v", opCtx.Operation.Name, opCtx.Operation.Operation, time.Since(start))
		}()

		tx := db.Begin()
		if tx.Error != nil {
			// Begin 失敗時はそのままエラー応答へ
			return func(ctx context.Context) *graphql.Response {
				return graphql.ErrorResponse(ctx, "failed to begin transaction")
			}
		}

		// ctx に Tx を載せる
		ctxWithTx := context.WithValue(ctx, datasource.DbContextKey, tx)

		// 後段を実行
		resp := next(ctxWithTx)

		// 実行結果後にコミット/ロールバック
		return func(ctx context.Context) *graphql.Response {
			r := resp(ctx)
			// gqlgen ではここに来た時点で resolver のエラーは opCtx.Stats などに集約済
			// 簡便のため、GraphQL エラー有無で判断
			if r != nil && len(r.Errors) > 0 {
				_ = tx.Rollback().Error
			} else {
				if err := tx.Commit().Error; err != nil {
					_ = tx.Rollback().Error
				}
			}
			return r
		}
	})

	http.Handle("/", playground.Handler("GraphQL playground", endpoint))
	http.Handle(endpoint, srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
