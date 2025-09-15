# performance test

## with wundergraph-cosmo

```shell
docker compose -f compose.yaml -f router/wundergraph-cosmo/compose.yaml up -d --build current-service router otelcollector
vegeta attack -targets test/getitem-with-router.txt -duration 30s -rate 20 | vegeta report | tee test/with-wundergraph-cosmo.log
vegeta attack -targets test/getitem-with-router.txt -duration 30s -rate 40 | vegeta report | tee test/with-wundergraph-cosmo.log
vegeta attack -targets test/getitem-with-router.txt -duration 30s -rate 60 | vegeta report | tee test/with-wundergraph-cosmo.log
```

## with apollo-router

```shell
docker compose -f compose.yaml -f router/apollo-router/compose.yaml up -d --build current-service router otelcollector
vegeta attack -targets test/getitem-with-router.txt -duration 30s -rate 20 | vegeta report | tee test/with-wundergraph-cosmo.log
vegeta attack -targets test/getitem-with-router.txt -duration 30s -rate 40 | vegeta report | tee test/with-wundergraph-cosmo.log
vegeta attack -targets test/getitem-with-router.txt -duration 30s -rate 60 | vegeta report | tee test/with-wundergraph-cosmo.log
```

## without router

```shell
docker compose -f compose.yaml -f router/apollo-router/compose.yaml up -d --build current-service router otelcollector
vegeta attack -targets test/getitem-without-router.txt -duration 30s -rate 20 | vegeta report | tee test/without-router.log
vegeta attack -targets test/getitem-without-router.txt -duration 30s -rate 40 | vegeta report | tee test/without-router.log
vegeta attack -targets test/getitem-without-router.txt -duration 30s -rate 60 | vegeta report | tee test/without-router.log
```
