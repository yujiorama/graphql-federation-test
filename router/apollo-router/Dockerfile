FROM node:20-slim AS rover

RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    DEBIAN_FRONTEND=noninteractive apt-get update -yq \
    && DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
    ca-certificates \
    libssl-dev \
    && DEBIAN_FRONTEND=noninteractive apt-get clean -y

RUN npm install -g @apollo/rover

ENTRYPOINT [ "npx", "rover" ]


FROM rover as builder
ARG CURRENT_SERVICE_URL=http://localhost:4001/graphql
ARG APOLLO_ELV2_LICENSE=accept
ARG APOLLO_TELEMETRY_DISABLED=true
WORKDIR /router
COPY config/*.yaml /router/config/
COPY config/graph/*.graphqls /router/config/graph/
RUN CURRENT_SERVICE_URL=${CURRENT_SERVICE_URL} \
    APOLLO_ELV2_LICENSE=${APOLLO_ELV2_LICENSE} \
    APOLLO_TELEMETRY_DISABLED=${APOLLO_TELEMETRY_DISABLED} \
    rover supergraph compose --config /router/config/supergraph-config.yaml --output /router/config/graph/supergraph.graphqls


FROM ghcr.io/apollographql/router:v2.0.0 as router

WORKDIR /router
COPY config/*.yaml /router/config/
COPY config/graph/*.graphqls /router/config/graph/
COPY --from=builder /router/config/graph/supergraph.graphqls /router/config/graph/supergraph.graphqls
