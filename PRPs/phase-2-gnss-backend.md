name: "Phase 2 – CoastalPASS GNSS Go Backend"
description: |
  Build a first-party GNSS Go service inside this repo that mirrors AgCore’s GNSS stack,
  authenticates with WorkOS, persists telemetry in Supabase Timescale, and exposes parity
  `/api/v1/gnss/**` endpoints plus saved locations/alerts so the marketing shell can depend
  on a single codebase.

---

## Goal

**Feature Goal**: Stand up `backend/gnss` (Go 1.23) with config, migrations, provider engines, WorkOS-authenticated HTTP routes, schedulers, and observability so GNSS data no longer relies on external repos.

**Deliverable**: Go module (`cmd/server`, `cmd/migrate`, `internal/{config,gnss,providers,calculations,services}`, `pkg/{gnss,math,types}`), Supabase Timescale migrations, Redis-backed rate limiting, Docker Compose stack, OpenAPI spec, CI wiring, and README updates describing how the marketing Next.js app calls the service.

**Success Definition**: `go test ./backend/gnss/...`, `golangci-lint`, `gofmt`, `npm run validate`, and `docker compose -f docker-compose.gnss.yml up --build` all pass; `/api/v1/gnss/health`, `/api/v1/gnss/locations`, `/api/v1/gnss/alerts`, `/gnss/admin/batch/trigger/tle` respond as spec; WorkOS middleware enforces session/org scopes; Supabase hypertables store telemetry with retention policies; Redis limiter blocks anonymous floods; OpenAPI contract drives typed frontend clients.

## User Persona (if applicable)

**Target User**: CoastalPASS platform/GNSS engineers who need one repo to run both the marketing frontend and the production GNSS backend.

**Use Case**: They must port AgCore GNSS capabilities into this repo, keeping parity endpoints plus new saved-location and alert features tied to WorkOS organizations and Supabase persistence.

**User Journey**:
1. Bootstrap `backend/gnss` module, config, Docker Compose, and migrations; verify Timescale + Redis come online locally.
2. Port provider/calculation/scheduler code plus WorkOS middleware, redis rate limiting, and Supabase data access; validate via Go unit/integration tests.
3. Publish OpenAPI spec + API client scaffolding, wire CI tasks, and document how the Next.js app will call the backend once Phase 3 begins.

**Pain Points Addressed**:
- Removes dependency on `../AgCore/backend/internal/gnss`, enabling co-located backend/frontend work.
- Ensures GNSS data, saved states, and alerts share WorkOS auth + Supabase storage instead of ad-hoc scripts.
- Provides deterministic migrations, tests, and Docker orchestration so onboarding engineers have a single source of truth.

## Why

- Phase 2 of `docs/gnss-integration-plan.md` demands a Go backend inside this repo with provider parity, WorkOS auth, Supabase persistence, and admin hooks before Phase 3 UI work can land.
- The marketing shell already runs React 19 + TanStack Query (Phase 1 PRP); without a shared backend the GNSS dashboard cannot be embedded or exercised in CI.
- Supabase Timescale + Redis ensures telemetry + alert data remain performant and auditable, while WorkOS sessions keep enterprise auth consistent with CoastalPASS’ identity provider.

## What

Deliver a production-ready GNSS Go service (`backend/gnss`) that replicates AgCore’s manager/provider/calculation architecture, exposes `/api/v1/gnss/**` (satellite visibility, TEC/DOP analytics, agriculture intelligence, status/admin endpoints), and adds saved locations + alerts tied to WorkOS organizations. The service must read env via typed config, validate external data with Zod (frontend) / structs (backend), cache telemetry, rate-limit anonymous traffic through Redis sliding windows, and ship infra assets (Docker Compose, OpenAPI spec, CI workflows). Frontend work is limited to nav affordances (linking to `/gnss` CTA and WorkOS sign-in) plus env plumbing so Phase 3 can reuse the same API base URL.

### Success Criteria

- [ ] `backend/gnss/go.mod` declares Go ≥1.23, lists Gin, pgx/v5, go-redis/v9, WorkOS Go SDK ≥v5.2.0, SendGrid, prometheus, `github.com/joshuaferrara/go-satellite`.
- [ ] Migrations under `backend/gnss/migrations/*.sql` create Timescale hypertables for TLE, TEC, DOP, provider health, saved locations, alert rules, alert events, scheduler metadata, and add retention/compression policies.
- [ ] `cmd/server/main.go` wires config, logging, pgxpool, redis, provider manager, calculation engines, scheduler, and registers Gin routes with WorkOS + API-key middleware plus Redis sliding-window throttles.
- [ ] Provider clients (Space-Track, CelesTrak, N2YO, NASA/NOAA TEC) replicate failover order, credential handling, and health reporting, with integration tests hitting sandbox APIs or mocked HTTP servers.
- [ ] Saved locations/alerts handlers persist to Supabase tables scoped by WorkOS `org_id` claim, enforce Org-level RBAC, and expose CRUD + history endpoints.
- [ ] Background scheduler goroutines refresh TLE/TEC data, evaluate alerts, and expose `/api/v1/gnss/status` + `/providers/status`; admin routes trigger on-demand refresh via WorkOS role-enforced POSTs.
- [ ] Docker Compose file (`docker-compose.gnss.yml`) spins up Go API, Supabase-compatible Postgres+Timescale, Redis Stack, and optional Prometheus; `make gnss-up` alias documented in README.
- [ ] CI job runs Go formatting, linting, tests, migrations check, container build, and Next.js validation to keep repo quality gates consistent.

## All Needed Context

Context Completeness Check: ✅ — the following URLs, code files, and ai_docs cover architecture, auth, persistence, rate limiting, testing, and coding conventions so an engineer with no prior knowledge can execute Phase 2.

### Documentation & References

```yaml
# External references
- url: https://workos.com/docs/user-management/sessions/integrating-sessions/refresh-token#validate-session-tokens
  why: Details JWT claims, JWKS validation, refresh workflow for WorkOS sessions consumed by Gin middleware.
  critical: Enforce issuer/audience, handle access+refresh rotation, surface org_id and permissions for RBAC.
- url: https://workos.com/docs/sdks/go#installation
  why: Installation + usage of WorkOS Go SDK (v5.2.0) for session lookups and logout URLs.
  critical: Ensures Go module imports correct packages and handles context usage.
  access_note: |
    If the hosted doc is blocked, add the SDK with `go get github.com/workos/workos-go/v5`, initialize it via
    `workos.NewClient(workos.Config{APIKey: cfg.WorkOS.APIKey})`, and register the default HTTP client. Expose the
    authenticated client through an `internal/workos/client.go` helper and pass contexts from Gin handlers so session
    lookups respect cancellations.
- url: https://workos.com/changelog/sessions-api#sessions-api
  why: Sessions API release describing list/revoke endpoints needed for admin tooling.
  critical: Enables `/gnss/admin/sessions/purge` parity with AgCore.
- url: https://docs.supabase.com/guides/database/extensions/timescaledb#enable-the-extension
  why: Steps for enabling TimescaleDB inside Supabase and verifying extension state.
  critical: Without extension, hypertable migrations fail; doc shows GUI + SQL path.
- url: https://docs.timescale.com/use-timescale/latest/hypertables/about-hypertables/
  why: Reference for chunk intervals, compression, retention functions used in migrations.
  critical: Guides how to tune TLE/TEC tables for ingestion + query performance.
  access_note: |
    When the API reference is inaccessible, remember that `SELECT create_hypertable('table', 'timestamp', chunk_time_interval =>
    interval '6 hours')` is the pattern we follow. Pair it with `SELECT add_retention_policy('table', interval '45 days')` and
    `SELECT add_compression_policy('table', interval '7 days')` to keep telemetry manageable.
- url: https://supabase.com/docs/guides/database/supavisor#connection-pooling-and-limits
  why: Documents Supabase connection pool limits and direct-connection guidance.
  critical: Sets pgxpool `MaxConns` + direct DSN usage for long-running jobs.
  access_note: |
    Jump directly to the “Connection pooling and limits” heading (search that phrase if the anchor moves) to size Supavisor pools for HTTP handlers vs. migrations.
- url: https://pkg.go.dev/github.com/jackc/pgx/v5/pgxpool#hdr-Examples
  why: Official pgxpool usage for context-aware queries, ping, and health checks.
  critical: Ensures DB manager respects contexts + cleans up on shutdown.
- url: https://github.com/gin-gonic/gin#custom-middleware
  why: Shows how to add custom middleware (WorkOS auth, rate limiting, logging) with Gin.
  critical: Keeps middleware chain idiomatic and testable.
  access_note: |
    If the official example cannot be loaded, implement middleware as `func() gin.HandlerFunc` closures that capture required
    dependencies. Call `c.Next()` after injecting context, and remember to `c.AbortWithStatusJSON` when rejecting a request so
    handlers downstream do not execute.
- url: https://redis.io/learn/develop/dotnet/aspnetcore/rate-limiting/sliding-window#sliding-window-rate-limiter-lua-script
  why: Sliding-window algorithm to port into Lua script executed by go-redis for anonymous throttling.
  critical: Prevents duplicate implementation mistakes and ensures atomic increments.
- url: https://github.com/joshuaferrara/go-satellite#readme
  why: Provides SGP4 propagator API used for orbital predictions.
  critical: Maintains parity with AgCore calculations and reduces math rewrites.
- url: https://www.space-track.org/documentation#/api#general-information
  why: Governs Space-Track REST endpoints, authentication, and rate limits.
  critical: Provider clients must respect OAuth grant + TOS.
- url: https://www.n2yo.com/api/#intro
  why: Documents N2YO orbit/visibility API used for redundancy.
  critical: Clarifies required params, request quotas, acceptable use.
- url: https://www.swpc.noaa.gov/products/total-electron-content-tec#product-description
  why: Describes NOAA TEC datasets and update cadence for TEC ingestion pipeline.
  critical: Guides scheduler frequency + interpolation windows.

# Repo + AI docs
- docfile: PRPs/ai_docs/workos-go-auth.md
  why: Project-specific summary of WorkOS token handling, JWKS caching, middleware expectations.
  section: "Access & Refresh Tokens" + "Implementation Checklist"
- docfile: PRPs/ai_docs/supabase-timescale.md
  why: Playbook for hypertable migrations, retention policies, and connection string usage in this repo.
  section: Entire doc (enabling extension, migration pattern, connection handling).
- docfile: PRPs/ai_docs/redis-sliding-window.md
  why: Implementation details for Redis Lua limiter to reuse verbatim in middleware.
  section: "Envelope for Go/Gin Middleware"
- file: docs/gnss-integration-plan.md
  why: Source of Phase 2 requirements (Go backend, Supabase, WorkOS, saved data, admin hooks).
  pattern: Follow Key Tasks (1–8) verbatim; Phase 2 deliverable defines parity scope.
  gotcha: Do not modify AgCore repo; everything must live inside this repo under `backend/gnss`.
- file: AGENTS.md
  why: Global coding guardrails (React 19 return types, Zod validation, testing, no `any`, file size caps).
  pattern: Apply to any new frontend glue (env wiring, nav updates) and document TypeScript expectations for Phase 3.
  gotcha: All components must return `ReactElement`; tests live in `__tests__`; coverage ≥80%.
- file: package.json
  why: Scripts + dependency list; add Go helper scripts (via `npm run go:test`), WorkOS env placeholders, and ensure `npm run validate` still passes.
  pattern: Keep script naming consistent (colon-separated).
  gotcha: Lint command uses `--max-warnings=0`; updates must preserve this.
- file: src/app/layout.tsx
  why: Root layout that imports `ClientProviders`; new GNSS routes/features must remain compatible.
  pattern: Import Tailwind CSS once, wrap children with ClientProviders.
  gotcha: Metadata uses `env.NEXT_PUBLIC_APP_URL`; ensure new env vars do not break layout imports.
- file: src/components/providers/ClientProviders.tsx
  why: Shows provider composition (ThemeProvider, QueryClientProvider, ScrollToTop).
  pattern: Keep provider nesting stable; add future GNSS UI providers (TanStack Query already set).
  gotcha: Tests stub React Query Devtools—mirror pattern when adding GNSS-specific provider tests.
- file: src/components/marketing/Navbar.tsx
  why: Primary nav where GNSS CTA + WorkOS sign-in button will live (Phase 2 doc mentions update).
  pattern: Reuse `navLinks` array; update tests under `__tests__/navbar.test.tsx`.
  gotcha: Maintain accessibility labels for sheet trigger + nav sections.
- file: src/features/contact/components/ContactForm.tsx
  why: Example of `react-hook-form` + Zod + UI components; reference when building future GNSS forms or WorkOS flows.
  pattern: Keep `use client` boundary + typed `ContactFormData`.
  gotcha: Tests assert success message; follow same approach for GNSS UI forms later.
- file: src/test/setup.tsx
  why: Vitest global setup (jsdom, RTL cleanup, Next Image mock).
  pattern: Add GNSS UI component mocks/setup here once Phase 3 imports share libs.
  gotcha: Do not remove matchMedia polyfill—GNSS charts often check media queries.
- file: vitest.config.ts
  why: Coverage thresholds + alias config; informs where GNSS UI tests must live after backend lands.
  pattern: Keep `@` alias stable for new frontend modules.
  gotcha: Coverage include paths currently limited to components/features—add `src/features/gnss-ui` later.
```

### Configuration & Secrets How-To

- **Template vs. working copy**: Task 2 must add `backend/gnss/config.local.example.yaml` (committed) plus `.gitignore` coverage for `backend/gnss/config.local.yaml`. Engineers copy the example before Level 3 (`cp backend/gnss/config.local.example.yaml backend/gnss/config.local.yaml`) and fill in secrets locally.
- **Environment parity**: Each YAML value needs an env fallback documented in `.env.example` (WorkOS keys, Supabase DSNs, Redis URL, provider creds, SendGrid, `NEXT_PUBLIC_GNSS_API_URL`) so CI/CD can rely on environment variables if config files are unavailable.
- **Anonymous API key**: The template defines `api_keys.anonymous_public` (default `demo`). Task 3 migrations seed the same value into Supabase (or a `gnss_api_keys` table) so the Redis limiter + middleware can validate anonymous requests. Rotate via config + database seed updates, not by editing headers in validation commands.
- **README onboarding**: Task 10 documentation must reiterate where the config files live, how to generate `WORKOS_TEST_TOKEN`, and how to export `GNSS_API_KEY_PUBLIC` so engineers do not guess during the validation loop.

Sample snippet to embed in the template (tweak defaults as needed):

```yaml
# backend/gnss/config.local.example.yaml
env: development
server:
  port: 8080
  metrics_port: 9100
supabase:
  pooled_dsn: ${SUPABASE_DB_URL}
  direct_dsn: postgres://postgres:postgres@localhost:54322/postgres
redis:
  url: redis://localhost:6379/0
workos:
  api_key: ${WORKOS_API_KEY}
  client_id: ${WORKOS_CLIENT_ID}
  jwks_url: https://api.workos.com/sso/jwks
api_keys:
  anonymous_public: demo
providers:
  space_track:
    username: ${SPACE_TRACK_USER}
    password: ${SPACE_TRACK_PASS}
  n2yo:
    api_key: ${N2YO_API_KEY}
observability:
  sentry_dsn: ""
```

### Authoritative Database Schemas (Timescale + Supabase)

| Table | Purpose | Columns & Constraints | Policies |
| --- | --- | --- | --- |
| `gnss_tle_snapshots` (hypertable on `recorded_at`) | Stores canonical TLE pairs pulled from providers. | `id uuid PK default gen_random_uuid()`, `norad_id int NOT NULL INDEX`, `tle_line1 text NOT NULL` (trim to 69 chars), `tle_line2 text NOT NULL`, `source text NOT NULL CHECK (source IN ('space_track','celestrak','n2yo'))`, `recorded_at timestamptz NOT NULL time index`. | Retain 45 days via `add_retention_policy`; compress after 7 days via `add_compression_policy`. |
| `gnss_tec_samples` (hypertable on `sampled_at`) | TEC grid values for heatmaps. | `id uuid PK`, `latitude numeric(6,3) NOT NULL`, `longitude numeric(6,3) NOT NULL`, `tec_value numeric(8,3) NOT NULL`, `data_source text NOT NULL CHECK (data_source IN ('noaa_swpc','nasa_cddis'))`, `sampled_at timestamptz NOT NULL`. | Continuous aggregates `gnss_tec_samples_hourly` and `..._daily` (bucket 1h/24h) refreshed every 15 minutes. |
| `gnss_dop_metrics` (hypertable on `computed_at`) | PDOP/HDOP/VDOP results by location/time. | `id uuid PK`, `location geography(Point,4326) NOT NULL`, `pdop numeric(5,2) NOT NULL`, `hdop numeric(5,2) NOT NULL`, `vdop numeric(5,2) NOT NULL`, `satellite_count smallint NOT NULL`, `computed_at timestamptz NOT NULL`. | Retain 30 days, compress after 5 days. Index on `gist(location)`. |
| `gnss_provider_health` | Tracks provider uptime for `/providers/status`. | `provider text PK`, `status text NOT NULL CHECK (status IN ('healthy','degraded','down'))`, `last_success timestamptz`, `last_error text`, `updated_at timestamptz NOT NULL DEFAULT now()`. | None; row-per-provider. |
| `saved_locations` | User-saved AOIs scoped to WorkOS org. | `id uuid PK`, `org_id text NOT NULL INDEX`, `user_id text NOT NULL`, `name text NOT NULL`, `latitude numeric(6,3) NOT NULL`, `longitude numeric(6,3) NOT NULL`, `elevation_m numeric(6,2) DEFAULT 0`, `created_at timestamptz DEFAULT now()`, `updated_at timestamptz DEFAULT now()`. | `UNIQUE (org_id, name)`; RLS policy `org_id = current_setting('request.jwt.claim.org_id')`. |
| `alert_rules` | Stores PDOP/TEC alert configs. | `id uuid PK`, `org_id text NOT NULL INDEX`, `user_id text NOT NULL`, `name text NOT NULL`, `rule_type text NOT NULL CHECK (rule_type IN ('PDOP_THRESHOLD','TEC_SPIKE'))`, `threshold_value numeric(6,2) NOT NULL`, `schedule_cron text NOT NULL`, `notification_channel text DEFAULT 'email'`, `status text DEFAULT 'active'`, `created_at timestamptz DEFAULT now()`, `updated_at timestamptz DEFAULT now()`. | `UNIQUE (org_id, name)` plus org-level RLS. |
| `alert_events` | History of fired alerts. | `id uuid PK`, `alert_rule_id uuid REFERENCES alert_rules(id)`, `triggered_at timestamptz NOT NULL`, `payload jsonb NOT NULL`, `delivered boolean DEFAULT false`, `delivered_at timestamptz`. | Index on `(alert_rule_id, triggered_at DESC)`. |
| `scheduler_jobs` | Persists job run metadata. | `id text PK`, `last_run timestamptz`, `next_run timestamptz`, `status text NOT NULL CHECK (status IN ('idle','running','failed'))`, `last_error text`. | Used by `/api/v1/gnss/status` and admin dashboard. |
| `notification_queue` | Durable queue for alert notification fan-out. | `id uuid PK`, `alert_rule_id uuid REFERENCES alert_rules(id)`, `org_id text NOT NULL`, `payload jsonb NOT NULL`, `channel text NOT NULL CHECK (channel IN ('email','webhook'))`, `attempts smallint DEFAULT 0`, `next_retry timestamptz NOT NULL DEFAULT now()`, `created_at timestamptz DEFAULT now()`, `sent_at timestamptz`. | Partial index on `(channel, next_retry)` for worker polling; cleanup job deletes rows older than 30 days. |

Define each schema in `backend/gnss/migrations/*.sql` exactly as above; include helper comments describing chunk intervals plus grants for the Supabase service role.

### WorkOS Auth & RBAC Requirements

- **Claims required from JWT**: `session_id`, `organization_id`, `organization_slug`, `user_id` (from `sub`), `roles[]`, `permissions[]`, `email`, `expires_at`.
- **Authorization matrix**:
  - *Anonymous key (`x-api-key` only)* → header value must match `api_keys.anonymous_public` from config (default `demo`); allow GET `/api/v1/gnss/health|visibility|tec|dop|providers`; enforce Redis sliding window (60 req/min/IP) with `429` + `Retry-After` header on violation.
  - *Authenticated org member* → bearer token with `organization_id` claim matching Supabase rows; allowed to GET/POST/PUT `/api/v1/gnss/locations` and GET `/api/v1/gnss/alerts`.
  - *Authenticated org admin* → same as above plus `roles` contains `gnss.admin` or `permissions` contains `gnss:admin`; required for `/api/v1/gnss/alerts` mutations, `/api/v1/gnss/admin/**`, scheduler triggers, and provider purge endpoints.
- **Error contract**:
  - Missing bearer token → `401` `{ "code": "WORKOS_UNAUTHORIZED", "message": "Missing bearer token" }`
  - Expired/invalid token → `401` `{ "code": "WORKOS_TOKEN_INVALID" }`
  - Wrong org scope → `403` `{ "code": "ORG_SCOPE_REQUIRED", "org_id": "<expected>" }`
  - Missing admin role → `403` `{ "code": "INSUFFICIENT_PRIVILEGES", "required": ["gnss.admin"] }`
- **Local QA tokens**:
  1. In WorkOS Test Mode, create an organization and user.
  2. Generate a session via `wos sessions create --email tester@coastalpass.com --organization org_123`.
  3. Exchange for a JWT using the Sessions API (`POST https://api.workos.com/sessions/<id>/authenticate`); store the token both in `.env.local` for the Next.js shell **and** in a backend-focused env file (e.g., `.env.gnss`) so Go services can consume it as `WORKOS_TEST_TOKEN`.
  4. Before running Validation Loop Level 3, export the token for the active shell session (for example: `export WORKOS_TEST_TOKEN=$(rg --no-filename '^WORKOS_TEST_TOKEN=' .env.gnss | cut -d '=' -f2-)`), then run the curl commands documented below and capture the steps in README Task 10 deliverables.
- Middleware must cache JWKS responses for five minutes and force-refresh if the `kid` seen in a token is missing.

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase

```bash
.
├── docs/
│   ├── gnss-integration-plan.md
│   └── qa/
├── PRPs/
│   ├── ai_docs/
│   ├── templates/
│   └── phase-1-next15-tailwind-v2.md
├── src/
│   ├── app/ (Next.js App Router pages)
│   ├── components/
│   │   ├── marketing/
│   │   ├── providers/
│   │   └── ui/
│   ├── features/contact/
│   ├── helper/
│   ├── lib/
│   ├── scripts/
│   ├── styles/
│   └── test/setup.tsx
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

### Desired Codebase tree with files to be added and responsibility of file

```bash
backend/
└── gnss/
    ├── go.mod / go.sum                              # Go module scoped to backend service
    ├── cmd/
    │   ├── server/main.go                           # Boots HTTP server, wiring config/providers/scheduler
    │   └── migrate/main.go                          # Applies Timescale migrations against Supabase
    ├── internal/
    │   ├── config/config.go                         # Env parsing, WorkOS + Supabase secrets, structured logging knobs
    │   ├── database/timescale.go                    # pgxpool wrapper, hypertable helpers, migrate runner
    │   ├── redis/limiter.go                         # Lua sliding-window limiter via go-redis/v9
    │   ├── workos/middleware.go                     # Gin middleware verifying tokens, injecting org context
    │   ├── gnss/
    │   │   ├── manager.go                           # Initializes providers, engines, scheduler, and exposes lifecycle hooks
    │   │   ├── api/
    │   │   │   ├── router.go                        # Registers /api/v1/gnss routes + admin subroutes
    │   │   │   └── handlers/*.go                    # Satellite, TEC, DOP, agriculture, saved data, alerts handlers
    │   │   ├── providers/*.go                       # Space-Track, CelesTrak, N2YO, NASA/NOAA, fallback logic
    │   │   ├── calculations/*.go                    # SGP4 propagation, DOP matrix math, TEC interpolation
    │   │   ├── scheduler/*.go                       # Cron-like goroutines, alert evaluators, batch triggers
    │   │   ├── processors/*.go                      # Alert evaluators + notification fan-out helpers
    │   │   └── types/*.go                           # Shared request/response contracts mirrored from AgCore
    │   └── observability/metrics.go                 # Prometheus collectors, structured logging helpers
    ├── pkg/
    │   ├── gnss/sgp4.go                             # go-satellite wrappers + caching
    │   ├── math/matrix.go                           # Linear algebra helpers reused by DOP calculations
    │   └── types/api.go                             # JSON schema shared between handlers + OpenAPI
    ├── migrations/
    │   ├── 20250113_init_timescale.sql              # Base tables + hypertables
    │   ├── 20250113_saved_locations.sql             # Supabase tables for saved data
    │   └── 20250113_alert_rules.sql                 # Alert rules/events tables
    ├── openapi/
    │   └── gnss.yaml                                # Documented API contract consumed by frontend generator
    └── README.md                                    # Service-specific instructions

docker-compose.gnss.yml                              # Runs Go API + Supabase PG + Redis + Prometheus locally
Makefile (or npm scripts)                            # Targets: gnss-fmt, gnss-lint, gnss-test, gnss-up
.github/workflows/gnss.yml                           # CI pipeline for Go fmt/lint/test/migrations/build
src/lib/api-client.ts                                # (New) centralized `fetchJson` helper with GNSS base URL + WorkOS tokens
src/components/marketing/Navbar.tsx                  # Add GNSS nav link + WorkOS sign-in CTA
src/components/marketing/__tests__/navbar.test.tsx   # Update tests for new nav item/button
PRPs/ai_docs/workos-go-auth.md                       # Already created reference doc for WorkOS middleware
PRPs/ai_docs/supabase-timescale.md                   # Timescale migration reference (Phase 2)
PRPs/ai_docs/redis-sliding-window.md                 # Limiter reference
```

### Known Gotchas of our codebase & Library Quirks

```python
# React 19 + Next.js 15 rules (AGENTS.md): every component returns ReactElement, no JSX.Element, no `any`.
# Tests live alongside components in __tests__; Vitest coverage must stay ≥80% (`vitest.config.ts` thresholds).
# File limits: <500 LOC per file, <200 LOC per component; split providers/handlers accordingly.
# WorkOS JWTs expire quickly—cache JWKS for 5 minutes and refresh on rotation; always enforce `org_id`.
# Supabase (Supavisor) default pool max ≈100 connections; subtract background workers when sizing pgxpool.
# Timescale background jobs count toward connection quota; run migrations/maintenance sequentially.
# Redis sliding window must execute via Lua to keep increments atomic; otherwise throttling becomes inconsistent.
# SGP4 calcs via go-satellite require time in UTC and TLE lines trimmed to 69 chars; strip CRLF during ingestion.
```

### AgCore Parity Blueprint (Accessible Summary)

```go
// Mirrors the legacy AgCore structure so no private repo access is required.
type ProviderClient interface {
  Name() string
  Fetch(ctx context.Context, req ProviderRequest) (ProviderResponse, error)
  Health(ctx context.Context) ProviderHealth
}

type Manager struct {
  providers []ProviderClient
  cache     Cache
  logger    *slog.Logger
}

func (m *Manager) Visibility(ctx context.Context, query VisibilityQuery) (SatelliteVisibilityResponse, error)
func (m *Manager) Tec(ctx context.Context, query TecQuery) (TecHeatmapResponse, error)

// Scheduler invokes these jobs in AgCore and must be recreated here.
type Job interface {
  ID() string
  Interval() time.Duration
  Run(ctx context.Context, deps JobDeps) error
}

// Alert evaluation contract.
type AlertEvaluator interface {
  Evaluate(ctx context.Context, rule AlertRule) ([]AlertEvent, error)
}
```

- Provider failover order: `SpaceTrack → CelesTrak → N2YO → cached Timescale snapshot`.
- Calculations: PDOP/HDOP/VDOP derived from the SGP4 pass list by building a geometry matrix (G) and computing `(GᵀG)⁻¹`; reuse `pkg/math/matrix.go` helpers for determinate/inverse.
- Scheduler jobs that must exist: `refresh_tle`, `refresh_tec`, `evaluate_alerts`, `provider_health_ping`, `cleanup_events`.
- Each HTTP handler wraps the manager/service calls and returns the standard `api.Error` envelope described below; parity with AgCore simply means matching method names + payload shapes listed here, so no external repo browsing is necessary.

## Implementation Blueprint

### Data models and structure

- **Config structs**: `Config{Env, Server, Supabase, Redis, WorkOS, Providers, Observability}` read from `.env` / Supabase secrets with defaults + validation.
- **Database layer**:
  - Supabase Timescale hypertables: `gnss_tle_snapshots`, `gnss_tec_samples`, `gnss_dop_metrics`, `gnss_provider_health`, `saved_locations`, `alert_rules`, `alert_events`, `notification_queue`.
  - Continuous aggregates for TEC + DOP (daily/hourly buckets) plus retention policies (45 days for TLE, 30 days for TEC metrics).
  - Alert tables store WorkOS `org_id`, `user_id`, threshold config (PDOP, TEC risk), schedule metadata.
- **Provider/calc structs**:
  - `ProviderClient` interface with `Fetch(ctx, request) (Response, error)`; implementations for Space-Track, CelesTrak, N2YO, NASA/NOAA TEC.
  - `CalculationEngine` interface for SGP4, DOP, TEC; caching layer keyed by NORAD/time or grid coordinate.
- **HTTP models**:
  - Shared `types` package defining `SatelliteVisibilityResponse`, `TecHeatmapResponse`, `SavedLocation`, `AlertRule`, etc., matching AgCore JSON fields.
  - Middleware contexts: `WorkOSClaims{UserID, OrgID, Permissions, SessionID}`.
- **Scheduler models**:
  - `JobDefinition{ID, Frequency, Handler}` stored in Supabase `scheduler_jobs`; `JobRun` for history, accessible via admin endpoints.

### Implementation Tasks (ordered by dependencies)

```yaml
Task 1: CREATE backend/gnss module scaffolding
  - IMPLEMENT: `go.mod`, `.air.toml` (optional), base `cmd/server` + `cmd/migrate` structure, Makefile targets.
  - FOLLOW pattern: docs/gnss-integration-plan.md (Phase 2 Task 1) for folder layout.
  - NAMING: Module `github.com/Coastal-PASS/landing-page/backend/gnss` (matches the actual GitHub remote so `go test ./...` resolves correctly).
  - DEPENDENCIES: None; establishes skeleton for subsequent tasks.

Task 2: IMPLEMENT config + env validation
  - FILES: `internal/config/config.go`, `.env.example`, `README.md`.
  - FOLLOW pattern: `src/lib/env.ts` (Zod validation) but ported to Go using struct tags + `envconfig`.
  - INCLUDE: WorkOS (client ID, API key, JWKS url), Supabase DSNs (pooled + direct), Redis URL, provider credentials, alert thresholds.
  - ADD: Committed template `backend/gnss/config.local.example.yaml` plus `.gitignore` entry for `backend/gnss/config.local.yaml`; document copy instructions and embed the sample keys shown in Configuration & Secrets.
  - DEPENDENCIES: Task 1 completes module scaffolding so config wiring has a home.

Task 3: ADD Supabase Timescale migrations + CLI
  - FILES: `backend/gnss/migrations/*.sql`, `cmd/migrate/main.go`.
  - USE: Guidance from `PRPs/ai_docs/supabase-timescale.md` + Timescale docs.
  - ENSURE: Hypertables, retention/compression policies, saved data tables, indexes (org_id, location, schedule).
  - INCLUDE: Seed for anonymous API keys (`api_keys` or `gnss_api_keys` table) so the `demo` key from config templates validates `x-api-key` requests out of the box.
  - DEPENDENCIES: Tasks 1-2 establish module + config so migrations can bind to typed DSNs.

Task 4: BUILD database + redis packages
  - FILES: `internal/database/timescale.go`, `internal/redis/limiter.go`.
  - FOLLOW: pgxpool docs for context-aware queries; redis sliding-window doc for Lua script.
  - ADD: Health-check interfaces + instrumentation for Prometheus.
  - DEPENDENCIES: Tasks 1-3 ensure modules, config, and migrations exist before wiring connection pools.

Task 5: PORT provider clients + calculation engines
  - FILES: `internal/gnss/providers/*.go`, `pkg/gnss/sgp4.go`, `pkg/math/matrix.go`, `internal/gnss/calculations/*.go`.
  - REFERENCE: Space-Track, N2YO, NOAA TEC docs + go-satellite README.
  - INCLUDE: Rate limiting, circuit breakers, caching (Redis/Timescale), failover order identical to AgCore.
  - TESTS: `internal/gnss/providers/providers_test.go`, `internal/gnss/calculations/calculations_test.go`, `pkg/gnss/sgp4_test.go` — mock HTTP responses and ensure coverage stays ≥80%.
  - DEPENDENCIES: Tasks 1-4 provide config + infra layers required by providers/calculations.

Task 6: IMPLEMENT WorkOS + API key middleware
  - FILES: `internal/workos/middleware.go`, `internal/workos/client.go`, `internal/middleware/api_key.go`.
  - FOLLOW: `PRPs/ai_docs/workos-go-auth.md` for token validation, JWKS caching, session lookup.
  - ADD: Access tiers (anonymous API key + rate limit vs authenticated WorkOS org) and admin role enforcement.
  - TESTS: `internal/workos/middleware_test.go`, `internal/middleware/api_key_test.go` using JWKS fixtures + Redis test harness.
  - DEPENDENCIES: Tasks 1-5 so middleware can reuse config, redis limiter, and provider services.

Task 7: EXPOSE HTTP routes + OpenAPI
  - FILES: `internal/gnss/api/router.go`, `internal/gnss/api/handlers/*.go`, `openapi/gnss.yaml`.
  - ROUTES: `/api/v1/gnss/{visibility,tec,dop,recommendations,providers,status,agriculture,...}`, `/api/v1/gnss/locations`, `/api/v1/gnss/alerts`, `/api/v1/gnss/admin/batch/trigger/*`.
  - INSTRUMENT: Logging, metrics, validation (bind JSON → structs), consistent error payloads.
  - TESTS: Co-located Go tests such as `internal/gnss/api/router_test.go` / `handlers_test.go` (table-driven Gin tests) + OpenAPI lint via `npx @redocly/cli lint`.
  - DEPENDENCIES: Tasks 1-6 so routers can combine middleware, services, and calculations.

Task 8: CREATE saved data + alerts services
  - FILES: `internal/gnss/services/locations.go`, `alerts.go`, `notification.go`.
  - LOGIC: Full CRUD endpoints (GET/POST/PUT/DELETE) for saved locations and alerts, Supabase queries filtered by WorkOS org/user, scheduler integration for evaluating thresholds, and notification enqueue/dequeue backed by `notification_queue`.
  - ADD: Email notification stub via SendGrid (config-driven) and queue for future workers.
  - TESTS: Co-located Go tests (`internal/gnss/services/locations_test.go`, `alerts_test.go`, `notification_test.go`) hitting pgxpool test containers or pgxmock.
  - DEPENDENCIES: Tasks 1-7 because services rely on DB pools, middleware claims, and HTTP contracts.

Task 9: BUILD scheduler + batch processors
  - FILES: `internal/gnss/scheduler/*.go`, `internal/gnss/processors/*.go`.
  - FEATURES: Cron-style job registry, context cancellation, retry/backoff, manual triggers via admin endpoints.
  - USE: Timescale `scheduler_jobs` table to persist run history; expose `/gnss/status`.
  - TESTS: `internal/gnss/scheduler/scheduler_test.go`, `internal/gnss/processors/processors_test.go` with fake clock + mocked providers to assert retries/backoff.
  - DEPENDENCIES: Tasks 1-8 (scheduler consumes providers, services, and DB access).

Task 10: SHIP dev tooling, Docker, CI, docs, and frontend hooks
  - FILES: `docker-compose.gnss.yml`, `.github/workflows/gnss.yml`, `README.md`, `package.json` scripts, `src/components/marketing/Navbar.tsx` + tests, `src/lib/api-client.ts`.
  - CONTENT: Compose stack (Go API + Supabase PG + Redis + Prometheus), CI job running gofmt/golangci-lint/go test/migrations build, npm scripts (`go:fmt`, `go:lint`, `go:test`), nav update + CTA, env docs for `NEXT_PUBLIC_GNSS_API_URL`.
  - ONBOARDING: Add a “First-time setup” block in README reminding engineers to install `golangci-lint`, `vegeta`, `gosec`, and `wos` CLI tools plus the `cp backend/gnss/config.local.example.yaml backend/gnss/config.local.yaml` step before running the Validation Loop.
  - DEPENDENCIES: Tasks 1-9 so tooling references real binaries, services, and routes.
```

### HTTP Contract Snapshot (align OpenAPI with this table)

| Method & Path | Auth | Request Shape | Success Response | Error Codes |
| --- | --- | --- | --- | --- |
| `GET /api/v1/gnss/health` | None | N/A | `200 { "status": "ok", "timestamp": "<ISO8601>" }` | `503` when downstream health checks fail |
| `GET /api/v1/gnss/visibility` | API key (anonymous) or bearer | Query: `lat` `lon` (required), `elevation_m` (optional), `start`/`end` ISO8601 | `200 SatelliteVisibilityResponse` with `passes[]`, `satellite_count`, `updated_at` | `400` invalid params, `429` rate limit, `502` provider failure |
| `GET /api/v1/gnss/tec` | API key or bearer | Query: `lat`, `lon`, `radius_km`, `window_minutes` | `200 TecHeatmapResponse` containing `grid[][]`, `source`, `sampled_at` | `400`, `502`, `504` (upstream timeout) |
| `GET /api/v1/gnss/dop` | API key or bearer | Query: `lat`, `lon`, optional `elevation_m`, `window_minutes`, `start`/`end` ISO8601 | `200 DopResponse` containing `pdop`, `hdop`, `vdop`, `geometry_matrix`, `satellite_count`, `computed_at` | `400` invalid params, `429` throttled, `502` when upstream ephemeris unavailable |
| `GET /api/v1/gnss/providers` | API key or bearer | Optional query `provider` (string list) to filter | `200 { "providers": ProviderHealth[] }` sorted by provider name with `last_success`, `last_error`, `status` | `502` when provider health table unavailable |
| `GET /api/v1/gnss/agriculture` | Bearer with `organization_id` | Query: either `location_id uuid` or `lat`+`lon`, plus `window_minutes`, `crop_type` | `200 AgricultureInsightResponse` aggregating visibility + TEC windows, soil proxies, `recommendations[]` | `400` invalid payload, `401/403` auth or org mismatch, `404` unknown location |
| `POST /api/v1/gnss/recommendations` | Bearer | Body: `{ "location_id": "uuid" | { "lat": number, "lon": number }, "analysis_type": "irrigation"|"planting"|"fertility", "notes"?: string }` | `201 { "recommendation": RecommendationResponse }` including actionable steps + confidence percent | `400` invalid body, `403` org mismatch, `409` duplicate recommendation name |
| `GET /api/v1/gnss/locations` | Bearer with `organization_id` | Headers: `Authorization: Bearer <jwt>` | `200 { "data": SavedLocation[] }` sorted by `updated_at desc` | `401` missing/invalid token, `403` org mismatch |
| `POST /api/v1/gnss/locations` | Bearer | Body: `{ "name": string, "latitude": number, "longitude": number, "elevation_m"?: number }` | `201 { "location": SavedLocation }` | `400` validation error, `409` duplicate name, `401/403` auth issues |
| `PUT /api/v1/gnss/locations/:location_id` | Bearer | Path param: `location_id uuid`; Body: `{ "name"?: string, "latitude"?: number, "longitude"?: number, "elevation_m"?: number }` | `200 { "location": SavedLocation }` with optimistic `updated_at` | `400` invalid payload, `403` org mismatch, `404` unknown location |
| `DELETE /api/v1/gnss/locations/:location_id` | Bearer | Path param: `location_id uuid` | `204` with empty body | `403` org mismatch, `404` unknown location |
| `GET /api/v1/gnss/alerts` | Bearer | Query optional `status` filter | `200 { "data": AlertRule[] }` + pagination metadata | `401/403` auth failure |
| `POST /api/v1/gnss/alerts` | Bearer + admin | Body: `{ "rule_type": "PDOP_THRESHOLD"|"TEC_SPIKE", "threshold_value": number, "schedule_cron": string, "notification_channel": "email"|"webhook" }` | `201 { "rule": AlertRule }` | `400` invalid cron/threshold, `403` missing admin role |
| `PUT /api/v1/gnss/alerts/:alert_id` | Bearer + admin | Path param: `alert_id uuid`; Body: `{ "name"?: string, "rule_type"?: ..., "threshold_value"?: number, "schedule_cron"?: string, "notification_channel"?: string, "status"?: "active"|"paused" }` | `200 { "rule": AlertRule }` | `400` invalid cron/threshold, `403` missing admin role, `404` unknown alert |
| `DELETE /api/v1/gnss/alerts/:alert_id` | Bearer + admin | Path param: `alert_id uuid` | `204` empty body | `403` missing admin role, `404` unknown alert |
| `POST /api/v1/gnss/admin/batch/trigger/tle` | Bearer + admin | Body optional `{ "force": boolean }` | `202 { "job_id": "refresh_tle", "status": "queued" }` | `401/403`, `409` job already running |
| `GET /api/v1/gnss/status` | Bearer | N/A | `200 { "scheduler": SchedulerStatus, "providers": ProviderHealth[] }` | `503` when degraded |

Standard error envelope (apply everywhere):

```jsonc
{
  "code": "string_machine_code",
  "message": "Human readable detail",
  "details": { "field": "context" },
  "request_id": "uuid"
}
```

The future `openapi/gnss.yaml` must include the full schema definitions referenced above (SatelliteVisibilityResponse, TecHeatmapResponse, DopResponse, ProviderHealth, AgricultureInsightResponse, RecommendationResponse, SavedLocation, AlertRule, SchedulerStatus) and example payloads for each endpoint.

### Implementation Patterns & Key Details

```go
// WorkOS middleware sketch (internal/workos/middleware.go)
func (m *Middleware) RequireSession() gin.HandlerFunc {
  return func(c *gin.Context) {
    token := extractBearer(c.Request.Header.Get("Authorization"))
    if token == "" {
      c.AbortWithStatusJSON(http.StatusUnauthorized, api.Error("missing token"))
      return
    }
    claims, err := m.validator.Validate(c.Request.Context(), token)
    if err != nil {
      c.AbortWithStatusJSON(http.StatusUnauthorized, api.Error("invalid token"))
      return
    }
    c.Set(ContextKeyClaims, claims)
    c.Next()
  }
}

// pgxpool usage with Supavisor limits (internal/database/timescale.go)
pool, err := pgxpool.NewWithConfig(ctx, config)
if err != nil { return err }
pool.Config().MaxConns = int32(cfg.Database.MaxConnections)
pool.Config().MaxConnLifetime = time.Hour
pool.Config().HealthCheckPeriod = 30 * time.Second

// Redis Lua limiter (internal/redis/limiter.go)
const lua = `
  redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[1])
  local count = redis.call('ZCARD', KEYS[1])
  if count >= tonumber(ARGV[3]) then return {0, redis.call('PTTL', KEYS[1])} end
  redis.call('ZADD', KEYS[1], ARGV[2], ARGV[2])
  redis.call('PEXPIRE', KEYS[1], ARGV[4])
  return {1, redis.call('PTTL', KEYS[1])}
`

// Gin route grouping (internal/gnss/api/router.go)
api := router.Group("/api/v1/gnss")
api.GET("/health", ctrl.Health)
api.GET("/visibility", limiter.Anonymous(), ctrl.Visibility)
auth := api.Group("/")
auth.Use(workos.RequireSession())
auth.GET("/locations", ctrl.ListLocations)
auth.POST("/locations", ctrl.CreateLocation)
```

> Non-obvious details:
> - Always trim/provider-normalize TLE lines before storing; failure causes go-satellite to panic.
> - Provider clients should respect documented rate limits (Space-Track hourly, N2YO daily) and fallback to cached Timescale rows when upstream fails.
> - Alert evaluation reuses cached TEC/DOP aggregates to avoid double-querying large tables.
> - Observability: expose Prometheus metrics for provider latency, scheduler success/failure, Redis throttles, WorkOS 401 counts.

### Integration Points

```yaml
DATABASE:
  migrations: backend/gnss/migrations/*.sql (run via `go run ./cmd/migrate --dsn $SUPABASE_DIRECT_DSN`)
  seed: optional fixtures stored under backend/gnss/migrations/seeds for local testing.

CONFIG:
  files: .env.example, README.md (document all GNSS env vars), internal/config/config.go, `backend/gnss/config.local.example.yaml`.
  env vars: WORKOS_API_KEY, WORKOS_CLIENT_ID, WORKOS_JWKS_URL, GNSS_API_KEY_PUBLIC (default `demo`), SUPABASE_DB_URL, SUPABASE_DB_DIRECT_URL, SUPABASE_SERVICE_ROLE_KEY, REDIS_URL, SPACE_TRACK_USER/PASS, N2YO_API_KEY, NASA_CDDIS_USER/PASS, SENDGRID_API_KEY.
  workflow: copy the example config to `backend/gnss/config.local.yaml` for local runs; CI relies on env vars only.

ROUTES:
  backend: Gin router registers under `/api/v1/gnss`.
  frontend: (Task 10) `src/lib/api-client.ts` exports `getGnssBaseUrl()` reading `NEXT_PUBLIC_GNSS_API_URL`; `Navbar` adds “GNSS Planning” link + WorkOS “Sign In”.

DOCKER/CI:
  docker-compose.gnss.yml spins up services; `Makefile` wraps `docker compose`.
  GitHub workflow `.github/workflows/gnss.yml` runs gofmt/golangci-lint/go test/migrations/docker build.

DOCS:
  README.md adds backend usage, migrations, Compose instructions.
  PRPs/ai_docs updated with WorkOS/Supabase/Redis specifics (already added).

PERF TEST ARTIFACTS:
  file: backend/gnss/perf/visibility.txt
  contents: |
    GET http://localhost:8080/api/v1/gnss/visibility?lat=36.7&lon=-121.4
    x-api-key: demo
  note: vegeta Level 4 validation targets this file; keep the header value in sync with `api_keys.anonymous_public` (default `demo`) so engineers can run `vegeta attack` without editing the file.
```

## Validation Loop

### Tooling Prerequisites

Install the required CLI utilities before running Levels 1–4:

- `golangci-lint` — `brew install golangci-lint` (or `go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest`).
- `vegeta` — `brew install vegeta` to power the load test targeting `backend/gnss/perf/visibility.txt`.
- `gosec` — `brew install gosec` for the optional security scan.
- `wos` (WorkOS CLI) — `brew tap workos/cli && brew install wos` (or install from https://workos.com/docs/cli) to mint QA sessions and bearer tokens used in Level 3 curls.

Document these installs in README + onboarding notes while implementing Task 10 so new engineers have a single setup flow.

After installing the CLIs, confirm they are on your `PATH` before running any validation commands:

```bash
which golangci-lint gosec vegeta wos
```

### Level 1: Syntax & Style

```bash
# Go formatting & lint
cd backend/gnss
rg --files -g '*.go' -0 | xargs -0 gofmt -w
golangci-lint run ./...

# Frontend + repo-wide checks remain mandatory
npm run lint
npm run type-check
```

### Level 2: Unit Tests

```bash
# Go unit tests with race detector
cd backend/gnss
go test ./... -race -short

# Targeted packages
go test ./internal/gnss/providers ./internal/gnss/api ./internal/workos -count=1

# Frontend regression (keeps repo guarantees intact)
npm run test:coverage
```

### Level 3: Integration Testing

Before running Level 3, export a QA bearer token (see WorkOS Auth steps) so `$WORKOS_TEST_TOKEN` is available to the curl smoke tests.
- Copy the committed config template: `cp backend/gnss/config.local.example.yaml backend/gnss/config.local.yaml`.
- Populate secrets inside `backend/gnss/config.local.yaml` or export env vars for CI (envs take precedence).
- Export the anonymous key used in validation commands (defaults to `demo`): `export GNSS_API_KEY_PUBLIC=${GNSS_API_KEY_PUBLIC:-demo}`.

```bash
# Launch local stack (repo root)
docker compose -f docker-compose.gnss.yml up --build -d

# Enter backend module for Go commands
cd backend/gnss

# Run migrations against Supabase container
SUPABASE_DIRECT_DSN=postgres://postgres:postgres@localhost:54322/postgres \
  go run ./cmd/migrate

# Start API with live deps
go run ./cmd/server --config config.local.yaml

# Smoke endpoints
curl -f http://localhost:8080/api/v1/gnss/health
curl -H "x-api-key: $GNSS_API_KEY_PUBLIC" "http://localhost:8080/api/v1/gnss/visibility?lat=36.7&lon=-121.4"
curl -H "Authorization: Bearer $WORKOS_TEST_TOKEN" http://localhost:8080/api/v1/gnss/locations
curl -X POST -H "Authorization: Bearer $WORKOS_TEST_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Orchard","latitude":36.7,"longitude":-121.4,"elevation_m":45}' \
     http://localhost:8080/api/v1/gnss/locations
```

### Level 4: Domain-Specific Validation

```bash
cd backend/gnss

# Scheduler + provider validation
go test ./internal/gnss/scheduler -run TestTLERefreshFlow -v

# Rate limiter Lua script test harness
go test ./internal/redis -run TestSlidingWindowLimiter -v

# Load test critical endpoint (visibility) with vegeta/k6
vegeta attack -duration=30s -rate=20/1s -targets=perf/visibility.txt | vegeta report

# Observability + metrics
curl -sf http://localhost:8080/metrics | rg gnss_provider_latency_seconds

# Security scans (optional but recommended)
gosec ./...
```

## Final Validation Checklist

- [ ] `gofmt`, `golangci-lint`, `go test ./... -race` pass inside `backend/gnss`.
- [ ] `npm run validate` (lint + type-check + coverage + build) passes after frontend/env updates.
- [ ] `docker compose -f docker-compose.gnss.yml up --build` succeeds and health checks pass.
- [ ] Supabase migrations applied (verify via `select * from gnss_tle_snapshots limit 1;`).
- [ ] WorkOS middleware tested with valid, expired, and revoked tokens.
- [ ] Redis rate limiter rejects abuse and returns `429` with Retry-After.
- [ ] Scheduler logs + `/api/v1/gnss/status` show green state after batch refresh.
- [ ] Level 4 load test + observability checks succeed (`vegeta attack ... | vegeta report` + `curl -sf http://localhost:8080/metrics | rg gnss_provider_latency_seconds`).
- [ ] README + `.env.example` document every new variable and command.
- [ ] OpenAPI spec published and validated (e.g., `npx @redocly/cli lint openapi/gnss.yaml`).
- [ ] `backend/gnss/config.local.example.yaml` + copy instructions exist, and local `config.local.yaml` uses the same schema as env fallbacks.
- [ ] Anonymous API key seeded in Supabase matches `api_keys.anonymous_public` and the validation headers/vegeta targets.

## Success Metrics

- **Confidence Score**: 8/10 — The PRP lists all relevant files, external docs, migrations, middleware patterns, and validation steps so an implementing agent has a single-pass blueprint; remaining risk is the effort required to port calculation engines from AgCore without direct code references (mitigated by go-satellite + provider docs referenced above).
- **Endpoint Coverage**: 100% of the `/api/v1/gnss/*` routes above (including DOP, agriculture, providers, recommendations) are implemented, documented in OpenAPI, and exercised by automated tests before merge.
- **Migration Runtime**: Supabase Timescale migrations complete in ≤2 minutes in CI (Timescale job logs) to guarantee fast rollbacks; any run exceeding this threshold blocks deployment.
- **Performance KPI**: `GET /api/v1/gnss/visibility` and `GET /api/v1/gnss/dop` sustain ≤500 ms p95 latency at 20 req/s during the vegeta Level 4 test; failures require profiling before release.
