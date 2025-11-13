# GNSS Planning Integration Plan

This document aligns the CoastalPASS marketing site (`/Users/brianpistone/Development/CoastalPASS/landing-page`) with the standalone GNSS Planning work (`../GNSSPlanning`) and the production-grade Go backend (`../AgCore/backend`). It captures context, required tooling shifts, and phased execution with concrete file-level actions.

---

## Context & Current State

1. **Marketing Site (Next.js 14, SCSS/Bootstrap)**
   - Routes and shared UI live in `src/app`, `src/components`, and `src/helper`.
   - Styling relies on `src/app/globals.scss` plus component SCSS; Bootstrap JS is injected via `src/helper/BootstrapInit.js`.
   - No Tailwind/shadcn primitives yet, making it hard to drop in the GNSS dashboard components from the POC.

2. **GNSS Planning POC (`../GNSSPlanning`)**
   - Next.js 15 / React 19 App Router with Tailwind + shadcn UI system.
   - API routes (`src/app/api/v1/**`) handle TLE/TEC/DOP calculations by orchestrating provider managers and the SGP4 calculator.
   - Hooks (`src/hooks/use-*.ts`) expect a modern React runtime, TanStack Query provider, and Tailwind-based design tokens.

3. **Go GNSS Backend (`../AgCore/backend/internal/gnss`)**
   - Gin service exposing `/api/v1/gnss/**` endpoints with provider failover, TimescaleDB persistence, Redis-based rate limiting, and batch schedulers.
   - Currently secured by session/API key middleware; we need WorkOS auth integration and Supabase Postgres as the managed database.

Goal: Deliver GNSS Planning features directly on the marketing site, publicly readable yet enhanced for logged-in users (WorkOS) who can save locations and automate alerts, backed by Supabase.

---

## Phase 1 – Upgrade Marketing Site to Next.js 15 + Tailwind/shadcn

**Objective:** Make the existing site share the same runtime and design system as the GNSS dashboard before adding new features.

### Key Tasks

1. **Framework Upgrade**
   - Update `package.json`, `package-lock.json`, and `.nvmrc` (if present) to Next.js 15.x and React 19.x.
   - Adjust `next.config.js` for App Router defaults (e.g., `experimental.serverActions` as needed) and rerun `npx next@latest codemod` to patch legacy imports.
   - Verify `jsconfig.json` paths still map `@/*` to `./src/*`.

2. **Tailwind + shadcn Setup**
   - Add Tailwind deps (`tailwindcss`, `postcss`, `autoprefixer`) and generate `tailwind.config.ts` + `postcss.config.js` at repo root.
   - Scaffold `src/styles/tailwind.css` (or reuse `src/app/globals.scss` by converting to CSS) and import it from `src/app/layout.js`.
   - Initialize shadcn (`npx shadcn@latest init`) and store components under `src/components/ui`. Document any tokens in `src/lib/typography.ts` or similar.

3. **Bootstrap/SCSS Migration**
   - Remove Bootstrap JS injection from `src/helper/BootstrapInit.js` and delete the dependency from `package.json`.
   - Convert existing components/pages (`src/components/Navbar.js`, `HeroBanner.js`, `Footer.js`, `ServiceArea.js`, etc.) to Tailwind utility classes and shadcn primitives. Keep the same JSX file names but ensure the CSS comes exclusively from Tailwind layers.
   - Rewrite `src/app/globals.scss` into Tailwind base/components/utilities; keep brand colors/fonts in `tailwind.config.ts`.

4. **Shared Providers**
   - Add TanStack Query and Theme providers to `src/app/layout.js` mirroring the GNSS POC (import from a new `src/components/providers` directory).
   - Confirm `BootstrapInit` is replaced by a light `ClientProviders` component handling Query + Theme + Scroll-to-top if still needed.

5. **Verification**
   - Run `npm run lint`, `npm run build`, and manual QA across `"/"`, `"/contact"`, `"/privacy"`, and `"/raven-air-blast"`.
   - Capture before/after screenshots for regression tracking.

Deliverable: Marketing site running on Next 15/React 19 with Tailwind/shadcn, ready to host GNSS UI modules.

---

## Phase 2 – Build CoastalPASS GNSS Go Backend (Supabase + WorkOS)

**Objective:** Stand up a brand-new Go backend _inside this repo_ (for example `backend/gnss`) that mirrors the behavior of `../AgCore/backend/internal/gnss/**` without altering that codebase. This service must own WorkOS authentication, Supabase-hosted Timescale data, provider orchestration, and every GNSS Planning endpoint the marketing site depends on.

### Findings from AgCore’s GNSS stack (porting checklist)

- `internal/gnss/gnss_manager.go` wires config, pooled DB access, provider manager, batch scheduler, calculation engines (SGP4, DOP, TEC), recommendation engine, and route registration. Our new manager needs the same lifecycle so HTTP handlers can rely on initialized engines and schedulers.
- `internal/gnss/api/gnss_service.go` exposes recommendations, batch jobs, regional coverage, satellite visibility/positions/predictions, DOP/TEC analyses, provider/system health, agricultural intelligence routes, and admin triggers while layering cache, rate limiting, validation, logging, and metrics middleware. These routes and behaviors define our parity contract.
- `internal/gnss/providers/*.go` implement Space-Track, CelesTrak, N2YO, NASA CDDIS, and NOAA SWPC clients plus Redis-backed rate limiting, circuit breakers, and health checks with per-data-type failover chains.
- `internal/gnss/calculations/*.go` house the SGP4 propagator, the matrix-math-backed DOP calculator, and the TEC analyzer/interpolator. Each engine caches results, reads historical samples, and surfaces shared request/response structs that the frontend already consumes.
- `internal/gnss/processors/*.go` schedule batch ingestion (TLE/TEC refresh), manage retries/failure recovery, and expose manual trigger hooks used by `/gnss/admin/**` endpoints.
- `internal/gnss/database/timescaledb.go` abstracts Timescale hypertable creation, retention policies, and pooled query helpers. We must replicate this against Supabase connection strings.
- `internal/services/gnss/gnss_service.go` integrates the GNSS router into Gin with `middleware.APIKeyOrSessionMiddleware`, showing how API-key vs. session access is enforced. The new service should import similar middleware patterns but live alongside the marketing project.

These findings describe the functionality our new backend must reproduce.

### Key Tasks

1. **Module Scaffolding**
   - Create `backend/gnss` (Go 1.23+) with `cmd/server`, `internal/{config,gnss,services}` and `pkg/{gnss,math,types}` so ported packages land cleanly.
   - Initialize a dedicated `go.mod` (e.g., `module github.com/coastalpass/landing/backend/gnss`) and add dependencies for Gin, pgx, go-redis, WorkOS, SendGrid, and any math helpers used by the calculators.
   - Reimplement `GNSSManager` to mirror AgCore’s startup/shutdown order while reading config from this repo’s `.env` + Supabase secrets.

2. **Supabase Timescale Persistence**
   - Translate the schema/managers in `../AgCore/backend/internal/gnss/database/timescaledb.go` into SQL migrations stored under `backend/gnss/migrations` (TLE snapshots, TEC grids, coverage caches, scheduler metadata).
   - Build a new `TimescaleDBManager` that connects through Supabase, enables hypertables/retention policies, and exposes helper methods for processors/calculations.
   - Provide CLI tooling (`cmd/migrate`) so developers and CI can apply migrations against Supabase.

3. **Provider + Calculation Layers**
   - Port the provider manager, rate limiter, circuit breaker, and health checker so Space-Track, CelesTrak, N2YO, NASA CDDIS, and NOAA SWPC integrations keep the exact failover order and throttling behavior.
   - Recreate the SGP4 engine, DOP calculator, and TEC analyzer packages so request/response contracts (`DOPCalculationRequest`, `TECInterpolationRequest`, `GNSSRecommendationResponse`, etc.) stay identical for the frontend.
   - Externalize provider credentials (Space-Track OAuth, N2YO API key, NASA credentials) via Supabase secrets or WorkOS vaults.

4. **HTTP/API Surface + Middleware**
   - Implement `GNSSService` under `backend/gnss/internal/gnss/api` with the full route map from the AgCore reference, including caching, rate limiting, validation, logging, metrics, and admin sub-routes.
   - Port the agriculture helpers (field operation guidance, precision requirement metadata) so `/gnss/agriculture/**` endpoints continue returning enriched recommendations.
   - Publish an OpenAPI spec covering every endpoint so the marketing app can generate typed clients.

5. **WorkOS Authentication & Access Modes**
   - Embed WorkOS session + organization validation middleware modeled after `middleware.APIKeyOrSessionMiddleware`, sourcing JWKS/workspace IDs from this repo’s env config.
   - Gate saved data/admin endpoints behind WorkOS sessions while keeping satellite/coverage/DOP/TEC reads available via signed API key + rate limiting for anonymous usage.

6. **Saved Data & Alerts**
   - Design Supabase tables (`users`, `saved_locations`, `alert_rules`, `alert_events`, `notification_queue`).
   - Add CRUD handlers for `/api/v1/gnss/locations` and `/api/v1/gnss/alerts`, leveraging WorkOS identity to scope data per org.
   - Extend the scheduler to evaluate alert thresholds (PDOP spikes, TEC risk, provider outages) and enqueue notification jobs (email/SMS) for a future notification worker.

7. **Background Processing & Admin Hooks**
   - Rebuild the batch scheduler, TLE/TEC processors, and failure recovery manager so timed jobs run via goroutines with context cancellation and expose status via `/gnss/status`, `/gnss/health`, and `/gnss/providers/status`.
   - Support `/gnss/admin/batch/trigger/*` endpoints for manual refreshes, mirroring AgCore’s admin workflows.

8. **Infrastructure & CI**
   - Add Dockerfile + compose stack to run the Go API, a Supabase-compatible Postgres/Timescale instance, and Redis locally.
   - Update repo-level CI to execute `go test ./...`, `golangci-lint`, Supabase migrations, and container builds, then publish the API image alongside the marketing frontend artifacts.

Deliverable: A self-contained CoastalPASS GNSS backend living in this repository, aligned with Supabase + WorkOS from day one and feature-parity with the AgCore GNSS Planning services.

---

## Phase 3 – GNSS UI Integration into Marketing Site

**Objective:** Embed the dashboard UX from `../GNSSPlanning` inside the upgraded marketing site.

### Key Tasks

1. **Code Import & Module Structure**
   - Create `src/features/gnss-ui` and copy over GNSS components (`../GNSSPlanning/src/components/**/*`, `src/app/dashboard/**/*`, hooks, and providers). Adjust import paths to the marketing repo’s aliases.
   - Install any missing dependencies (e.g., `@tanstack/react-query`, `zustand`, `react-leaflet`, `satellite.js`) in `package.json`.

2. **Routing & Layout**
   - Add a new route group `src/app/(gnss)/gnss/...` with the dashboard pages (`page.tsx`, subpages for `tec`, `dop`, etc.).
   - Implement a shared `DashboardLayout` using shadcn Sidebar components and ensure it coexists with the marketing layout.
   - Update `src/components/Navbar.js` to include a “GNSS Planning” nav item and a “Sign in” button (WorkOS).

3. **Data Wiring**
   - Replace the POC’s `/api/v1/...` calls in hooks (e.g., `src/features/gnss-ui/hooks/use-satellite-data.ts`) with fetches to the Go service domain. Centralize the base URL in `src/lib/api-client.ts`.
   - When a WorkOS session exists, attach the auth token so saved locations/alerts endpoints return personalized data.

4. **Saved Locations & Alerts UI**
   - Build a sidebar or modal that lets authenticated users:
     - Save the current dashboard location (`POST /api/v1/gnss/locations`).
     - Configure alert thresholds (PDOP, TEC risk) and frequency.
     - View alert history pulled from Supabase.
   - Show public visitors a read-only dashboard with a CTA prompting WorkOS sign-in to unlock automation.

Deliverable: `/gnss` route on the marketing site serving the live dashboard, public by default but enhanced when logged in.

---

## Phase 4 – Rollout, Observability, and Hardening

1. **Testing & QA**
   - Add Vitest suites covering GNSS hooks/components in `src/features/gnss-ui/**`.
   - Write Playwright smoke tests for critical flows (anonymous view, sign-in, save location, configure alert).
   - Create contract tests ensuring the frontend expects the same JSON structure as the Go API (e.g., `tests/integration/gnss-contract.test.ts`).

2. **Monitoring**
   - Wire Go service metrics into existing observability stack (Prometheus/Grafana or Datadog) using `/api/v1/gnss/health` and custom metrics (provider availability, batch failures).
   - Add frontend logging for API errors to detect regressions quickly.

3. **Launch Steps**
   - Stage deployment: release upgraded marketing site + Go API to staging, run regression suite, and collect beta feedback.
   - Production rollout: enable `/gnss` link publicly, announce WorkOS account features, and monitor alert delivery.
   - Post-launch: deprecate the standalone `../GNSSPlanning` POC once parity is verified.

---

## References

- Marketing repo: `/Users/brianpistone/Development/CoastalPASS/landing-page`
- GNSS Next.js POC: `/Users/brianpistone/Development/CoastalPASS/GNSSPlanning`
- Go backend: `/Users/brianpistone/Development/CoastalPASS/AgCore/backend`

This plan should be updated as implementation details evolve; keep it in sync with actual changes to maintain a single source of truth for GNSS feature delivery.
