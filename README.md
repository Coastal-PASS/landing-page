# Coastal PASS Marketing Site

Modernized marketing site built with Next.js 15 (App Router), React 19, Tailwind CSS (shadcn/ui), TanStack Query, and Vitest. The goal is to keep the marketing shell aligned with the GNSS dashboard runtime so shared UI and providers remain compatible.

## Requirements

- Node.js >= 18.18.0 (`.nvmrc` provided)
- Copy `.env.example` to `.env.local` and adjust values as needed
- npm (uses local cache via `npm_config_cache=./.npm-cache` in CI)
- When deploying on Netlify, `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` automatically fall back to `DEPLOY_PRIME_URL` → `DEPLOY_URL` → `URL`, so you normally do not need to set them manually per deploy preview

## Key Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server with Turbopack |
| `npm run lint` | ESLint with `--max-warnings=0` |
| `npm run type-check` | Strict `tsc --noEmit` run |
| `npm run test:coverage` | Vitest + RTL with 80% global thresholds |
| `npm run build` | Production build for deployment |
| `npm run validate` | Runs lint, type-check, coverage, and build sequentially |

## Testing

- Tests live next to components/features inside `__tests__` folders.
- Vitest is configured with jsdom, shadcn mocks, and coverage reporters (`text`, `json`, `html`).
- RTL user behavior tests currently cover Navbar interactions, Hero video dialog, Service Area content, Raven hero copy, providers, and the contact form validation.

## Manual QA & Accessibility

- Refer to [`docs/qa/manual-phase1.md`](docs/qa/manual-phase1.md) for the Phase 1 manual QA checklist (routes exercised, expected CTAs, and screenshot guidance).
- Accessibility spot checks use `@axe-core/cli` and `lighthouse` devDependencies once the app is running (`npm run dev`).

## Stack Highlights

- **UI**: Tailwind 3.4 with shadcn components (button, card, sheet, dialog, input, etc.)
- **Providers**: `ClientProviders` wraps `next-themes`, TanStack Query (singleton client), and ScrollToTop + DevTools (dev only)
- **Forms & Validation**: `react-hook-form` + `zod`, with Zod schemas also powering static Raven brochure data.
- **Testing**: Vitest + RTL + jest-dom + jsdom environment, coverage thresholds enforced at 80%.

## QA Checklist Summary

1. `npm run lint`
2. `npm run type-check`
3. `npm run test:coverage`
4. `npm run build`
5. Manual route verification + screenshots per [`docs/qa/manual-phase1.md`](docs/qa/manual-phase1.md)

## GNSS Go Backend (Phase 2)

The Phase 2 PRP adds a Go 1.24 GNSS backend under `backend/gnss`. Copy the committed template when running locally:

```bash
cp backend/gnss/config.local.example.yaml backend/gnss/config.local.yaml
```

Fill in Supabase, Redis, WorkOS, Space-Track/N2YO, and SendGrid credentials or export the env vars defined in `.env.example`. Install the required CLIs (`golangci-lint`, `vegeta`, `gosec`, `wos`) before running the validation loop.

| Command | Description |
| --- | --- |
| `npm run go:fmt` | gofmt all backend packages |
| `npm run go:lint` | `golangci-lint run ./...` inside `backend/gnss` |
| `npm run go:test` | `go test ./... -race` inside `backend/gnss` |
| `npm run go:run` | Starts the Gin API using `config.local.yaml` |
| `npm run go:migrate` | Applies Timescale migrations via `cmd/migrate` |

Run `docker compose -f docker-compose.gnss.yml up --build` to launch Supabase Postgres + Redis for integration tests, then hit:

```bash
curl -f http://localhost:8080/api/v1/gnss/health
curl -H "x-api-key: $GNSS_API_KEY_PUBLIC" "http://localhost:8080/api/v1/gnss/visibility?lat=36.7&lon=-121.4"
```

See `backend/gnss/README.md` and `PRPs/phase-2-gnss-backend.md` for the full validation ladder (lint → tests → docker → vegeta).
