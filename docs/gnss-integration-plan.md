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

## Phase 2 – Backend Port to Supabase + WorkOS

**Objective:** Rehost the Go GNSS service with WorkOS-based auth and Supabase Postgres while preserving provider logic.

### Key Tasks

1. **Supabase Schema & Access Layer**
   - Export Timescale schema definitions from `../AgCore/backend/internal/gnss/database/timescaledb.go` and recreate them via Supabase migrations (`supabase/migrations/*.sql`).
   - Modify `TimescaleDBManager` (same path) to connect using Supabase connection strings; confirm hypertable features are enabled.
   - Ensure ingestion processors (`internal/gnss/processors/tle_processor.go`, `tec_processor.go`) write to Supabase tables via pooled connections.

2. **WorkOS Auth Integration**
   - Introduce middleware in `internal/services/gnss/gnss_service.go` (or `internal/gnss/api/middleware.go`) that validates WorkOS tokens/JWKS and injects user/org context.
   - Keep read-only endpoints (`/api/v1/gnss/satellites/positions`, `/api/v1/gnss/tec`, `/api/v1/gnss/dop`) accessible with an app-level API key + rate limiting to support anonymous browsing.

3. **Saved Data & Alerts**
   - Define Supabase tables: `users`, `saved_locations`, `alert_rules`, `alert_events`.
   - Add REST handlers (`gnss_service.go`) for CRUD on saved locations/alerts, gated by WorkOS session.
   - Extend `processors/batch_scheduler.go` to evaluate alert rules and enqueue notifications (email/SMS) via a future notification service.

4. **Infrastructure & Deployment**
   - Containerize the Go service with Supabase credentials injected via environment variables.
   - Add CI jobs to run `go test ./...` and `golangci-lint` before deploying to staging/production.

Deliverable: Authenticated GNSS API backed by Supabase/WorkOS, exposing both public and user-specific capabilities.

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
