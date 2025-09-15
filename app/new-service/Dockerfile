FROM golang:1.25

ARG GOARCH

COPY . /app
WORKDIR /app

RUN go mod tidy
RUN mkdir -p dist && go build -o dist/new-service .

EXPOSE 4002
ENTRYPOINT ["/app/dist/new-service"]
