## app/current-service

フェデレーションに参加するつもりの現行サービス。

### 1. 依存関係のインストール

```bash
cd app/current-service
brew install pnpm
pnpm install
```

### 2. サーバーの起動

```bash
docker build -t current-service .
docker run --rm -p 4001:4001 -e PORT=4001 -e ENDPOINT_PATH=/graphql -e SCHEMA_PATH=/app/graph/schema.graphqls current-service
```
