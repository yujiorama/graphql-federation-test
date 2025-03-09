FROM node:20-slim AS wgc

RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    DEBIAN_FRONTEND=noninteractive apt-get update -yq \
    && DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
    ca-certificates \
    libssl-dev \
    jq \
    && DEBIAN_FRONTEND=noninteractive apt-get clean -y

RUN npm install -g wgc@latest

ENTRYPOINT [ "npx", "wgc" ]


FROM wgc as builder
ARG CURRENT_SERVICE_URL=http://localhost:4001/graphql
WORKDIR /router
COPY config/*.yaml /router/config/
COPY config/*.json /router/config/
COPY config/graph/*.graphqls /router/config/graph/
RUN CURRENT_SERVICE_URL=${CURRENT_SERVICE_URL} \
    wgc router compose --input /router/config/supergraph-config.yaml --out /router/config/execution-config.json
RUN jq -r .engineConfig.graphqlSchema /router/config/execution-config.json > /router/config/graph/supergraph.graphqls


FROM ghcr.io/wundergraph/cosmo/router:0.189.0 as cosmo-router

FROM gcr.io/distroless/base-debian12 AS router
WORKDIR /router
COPY config/*.yaml /router/config/
COPY config/*.json /router/config/
COPY config/graph/*.graphqls /router/config/graph/
COPY --from=builder /router/config/execution-config.json /router/config/execution-config.json
COPY --from=builder /router/config/graph/supergraph.graphqls /router/config/graph/supergraph.graphqls
COPY --from=cosmo-router /router /usr/local/bin/router
CMD ["/usr/local/bin/router", "--config", "/router/config/router-config.yaml"]
