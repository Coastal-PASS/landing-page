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
