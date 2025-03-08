package main

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/vektah/gqlparser/v2/ast"
	"yujiorama.github.io/graphql-federation-test/app/new-service/graph"
	"yujiorama.github.io/graphql-federation-test/app/new-service/graph/generated"
)

const defaultPort = "4002"
const defaultEndpoint = "/graphql"

// LoggingMiddleware はリクエストとレスポンスをログに出力するためのミドルウェア
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// リクエストボディを読み取る
		var requestBody bytes.Buffer
		if r.Body != nil {
			// リクエストボディをコピーし、元のボディを再設定
			bodyBytes, _ := io.ReadAll(r.Body)
			requestBody.Write(bodyBytes)
			r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes)) // 読み取り後に再設定
		}
		log.Printf("Started %s %s\nRequest Body: %s", r.Method, r.URL.Path, requestBody.String())

		// レスポンスをキャプチャするためのラッパー
		recorder := &responseRecorder{ResponseWriter: w, Body: &bytes.Buffer{}}

		// 次のハンドラを呼び出す
		next.ServeHTTP(recorder, r)

		// レスポンスボディの内容をログに出力
		duration := time.Since(start)
		log.Printf("Completed %s %s in %v\nResponse Body: %s", r.Method, r.URL.Path, duration, recorder.Body.String())
	})
}

// responseRecorder はレスポンスのデータをキャプチャするためのレスポンスラッパー
type responseRecorder struct {
	http.ResponseWriter
	Body *bytes.Buffer
}

func (r *responseRecorder) Write(b []byte) (int, error) {
	r.Body.Write(b)                  // レスポンスボディをキャプチャ
	return r.ResponseWriter.Write(b) // 実際のレスポンスとしても書き込む
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	endpoint := os.Getenv("ENDPOINT_PATH")
	if endpoint == "" {
		endpoint = defaultEndpoint
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

	http.Handle("/", playground.Handler("GraphQL playground", endpoint))
	http.Handle(endpoint, LoggingMiddleware(srv))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
