# Repository Guidelines

## Project Structure & Module Organization
CoastalPASS runs on Next.js 14 App Router. Route segments live in `src/app` (e.g., `contact/page.jsx` for the lead form, `privacy/page.jsx` for compliance copy). Shared UI and motion pieces belong to `src/components`, while cross-cutting utilities sit in `src/helper`. Marketing data lists such as `src/scripts/serviceList.js` keep copy separate from layout. Drop static assets in `public/`, keep global styling inside `src/app/globals.scss`, and reach for route-level `.module.scss` when you need scoped styles.

## Build, Test, and Development Commands
Use Node 18+ and npm 9+. After `npm install`, run `npm run dev` for the hot-reloading server on http://localhost:3000. `npm run build` compiles the production bundle and surfaces type or lint blockers, while `npm run start` serves the `.next` output for smoke tests. `npm run lint` runs the Next.js ESLint preset (React, hooks, accessibility) and must pass before you push.

## Coding Style & Naming Conventions
Favor functional components and hooks; default to server components unless interactivity demands `"use client"`. Keep 2-space indentation, double quotes in JSX, and import order as: third-party packages, shared helpers, relative styles. Components, pages, and SCSS modules use PascalCase (`HeroBanner.js`, `HeroBanner.module.scss`); hooks, helpers, and data files stay camelCase. Co-locate styles with their component when practical and reserve `globals.scss` for site-wide tokens.

## Testing Guidelines
Automation is not in place yet, so linting plus manual route checks are required before every PR. When introducing coverage, use Jest + React Testing Library for component logic and Playwright for end-to-end journeys; store specs alongside the source (`ComponentName.test.jsx`). Always verify the hero animation, contact form submission, and auth modal locally.

## Commit & Pull Request Guidelines
History favors concise, imperative subjects (e.g., `add webcredentials`, `fix app id`); keep them under 50 characters and skip trailing punctuation. Scope each commit to one concern, documenting context and follow-ups in the body if needed. PRs must include a summary of user-facing changes, test evidence (`npm run build`, key manual routes), linked issues, and refreshed screenshots/GIFs for visual tweaks. Flag breaking changes clearly and request at least one review before merge.

## Security & Configuration Tips
Never commit secrets—place EmailJS keys, analytics IDs, and API roots in `.env.local`, then document required variables in `.env.example`. Keep files under `src/scripts/` limited to serializable data so nothing sensitive ships to the browser. Review `next.config.js` before enabling experimental flags, and confirm new dependencies are browser-safe.
