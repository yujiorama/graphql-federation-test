## app/new-service

後からフェデレーションに参加するつもりの新サービス。

### 1. 依存関係のインストール

```bash
cd app/new-service
go mod tidy
go get github.com/99designs/gqlgen
go run github.com/99designs/gqlgen init
go run github.com/99designs/gqlgen generate
```

### 2. サーバーの起動

```bash
docker build -t new-service .
docker run --rm -p 4002:4002 -e PORT=4002 -e ENDPOINT_PATH=/graphql new-service
```
