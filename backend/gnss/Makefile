SHELL := /bin/bash
GO ?= go

.PHONY: fmt lint test run migrate compose

fmt:
	@$(GO) fmt ./...

lint:
	@golangci-lint run ./...

test:
	@$(GO) test ./... -race -count=1

run:
	@$(GO) run ./cmd/server --config config.local.yaml

migrate:
	@$(GO) run ./cmd/migrate --config config.local.yaml

compose:
	@docker compose -f ../../docker-compose.gnss.yml up --build
