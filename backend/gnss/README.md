# CoastalPASS GNSS Backend

Go 1.24 service that mirrors the AgCore GNSS stack inside this repository. The service authenticates via WorkOS, persists telemetry and saved state in Supabase TimescaleDB, applies Redis sliding-window rate limiting, and exposes `/api/v1/gnss/**` endpoints for the marketing frontend.

## Quick Start

```bash
cp backend/gnss/config.local.example.yaml backend/gnss/config.local.yaml
# Fill in WorkOS, Supabase, Redis, and provider credentials or export env vars.

make migrate     # applies migrations to the Supabase database
make run         # starts the Gin API on :8080
```

### Required CLIs

Install the tooling referenced in the Phase 2 PRP before running the validation ladder:

| Tool | Purpose | Install |
| --- | --- | --- |
| `golangci-lint` | Go linting (`make lint`) | `brew install golangci-lint` |
| `vegeta` | Level 4 load test | `brew install vegeta` |
| `gosec` | Optional security scans | `brew install gosec` |
| `wos` | WorkOS test tokens | `brew tap workos/cli && brew install wos` |

### Config & Secrets

- `config.local.example.yaml` mirrors the YAML structure parsed by `internal/config`. Copy it to `config.local.yaml` and replace the `${ENV}` placeholders or rely entirely on environment variables (CI).
- `.env.example` lists every required secret: Supabase DSNs, Redis URL, WorkOS keys, anonymous API key (`GNSS_API_KEY_PUBLIC`), provider credentials, and SendGrid sender info.
- Anonymous key changes require updating both the config file and the seed in `gnss_api_keys`.

## Validation Commands

| Level | Command |
| --- | --- |
| Syntax | `golangci-lint run ./...` |
| Tests | `go test ./... -race -count=1` |
| Integration | `docker compose -f docker-compose.gnss.yml up --build` |
| Load | `vegeta attack -duration=30s -rate=20/1s -targets=perf/visibility.txt` |

### Validation Flow

1. **Level 1 (Syntax & Style)**: `make fmt` (or `npm run go:fmt`) followed by `make lint`.
2. **Level 2 (Unit tests)**: `make test` (race detector on) and `npm run test:coverage` for the frontend.
3. **Level 3 (Integration)**:
   - `docker compose -f docker-compose.gnss.yml up --build`
   - `make migrate` (targets the containerized Timescale instance)
   - `make run` + curl smokes + WorkOS bearer tests (`wos session mint` → `WORKOS_TEST_TOKEN`).
4. **Level 4 (Domain)**:
   - `go test ./internal/gnss/scheduler -run TestTLERefreshFlow -v`
   - `go test ./internal/redis -run TestSlidingWindowLimiter -v`
   - `vegeta attack -duration=30s -rate=20/1s -targets=perf/visibility.txt | vegeta report`
   - `curl -sf http://localhost:8080/metrics | rg gnss_provider_latency_seconds`

See `PRPs/phase-2-gnss-backend.md` for the complete specification and acceptance criteria.
