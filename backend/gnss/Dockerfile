FROM golang:1.24 AS build
WORKDIR /src
COPY backend/gnss/go.mod backend/gnss/go.sum ./
RUN go mod download
COPY backend/gnss/. .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/server ./cmd/server

FROM gcr.io/distroless/base-debian12
WORKDIR /srv
COPY --from=build /out/server /srv/server
ENTRYPOINT ["/srv/server"]
