name: "Phase 1 – Next15 + Tailwind/shadcn PRP"
description: |
  Migrate the CoastalPASS marketing site from its Bootstrap-heavy Next.js 14 theme to the
  same runtime, design system, and provider stack used by the GNSS dashboard so Phase 2/3
  work can land without rework. This PRP assumes no prior knowledge of the repo and walks
  through dependencies, file targets, and validation gates for a one-pass upgrade.

---

## Goal

**Feature Goal**: Run the marketing site on Next.js 15 + React 19 with Tailwind/shadcn UI primitives and shared providers ready for GNSS modules.

**Deliverable**: Updated repo (package + config + UI components) plus screenshot evidence proving Tailwind/shadcn render parity on `/`, `/contact`, `/privacy`, and `/raven-air-blast`.

**Success Definition**: `npm run lint` and `npm run build` pass on Next 15, Bootstrap/SCSS assets are removed, Tailwind theme matches prior spacing/color tokens, shadcn components compile without TS errors, and the new ClientProviders wrapper keeps Scroll-to-top plus Query/Theme state without hydration issues.

## User Persona (if applicable)

**Target User**: CoastalPASS marketing engineers and GNSS feature squads deploying via App Router.

**Use Case**: They need a modern UI toolkit (Tailwind + shadcn) and React 19 runtime parity with the GNSS dashboard to embed upcoming `/gnss` features without duplicating provider glue.

**User Journey**:
1. Install deps, run codemods, and stand up Next 15.
2. Add Tailwind/shadcn + ClientProviders scaffolding.
3. Convert legacy Bootstrap components and verify key marketing routes.
4. Hand PRP + screenshots to implementation agent for the actual upgrade branch.

**Pain Points Addressed**:
- Eliminates Bootstrap-specific markup that blocks GNSS UI reuse.
- Prevents React 18/19 mismatches between repos.
- Documents exact files and commands so an unfamiliar agent can execute Phase 1 with confidence.

## Why

- Aligning runtimes/design systems removes integration drift highlighted in `docs/gnss-integration-plan.md` (Phase 1 requirements).
- Tailwind + shadcn unlocks GNSS dashboard components that already rely on those tokens/components.
- Shared providers (TanStack Query, theme toggles) avoid repeated infra when WorkOS auth/GNSS data arrives in later phases.

## What

Marketing pages must render the same content but with Tailwind utilities + shadcn primitives (no Bootstrap classes), React 19-compatible providers, and a documented Tailwind theme derived from the old SCSS tokens. `package.json` and `next.config.js` must reflect Next 15 + React 19, `globals.scss` is replaced with Tailwind entry CSS, and `BootstrapInit` is superseded by `ClientProviders` that wires Query/Theme/Scroll-to-top.

### Success Criteria

- [ ] `package.json` pins `next@15.x`, `react@19`, `react-dom@19`, removes `bootstrap`, and adds Tailwind/postcss/autoprefixer, shadcn CLI, `@tanstack/react-query`, and `next-themes`.
- [ ] `tailwind.config.ts` + `postcss.config.js` exist, and `src/app/layout.js` imports the new Tailwind entry file instead of `globals.scss`.
- [ ] Navbar, HeroBanner, ServiceArea, WhyChoose, Footer, Raven hero/sections, and the `/contact`, `/privacy`, `/raven-air-blast` routes read exclusively from Tailwind/shadcn styles with matching visuals.
- [ ] ClientProviders (TanStack Query + Theme + ScrollToTop) replaces `BootstrapInit` without hydration warnings, and hero animation/contact form/auth modal still work per AGENTS testing rules.
- [ ] Lint/build/manual QA evidence attached (command output + screenshots noted in PR description).

## All Needed Context

### Context Completeness Check

✅ Passes "No Prior Knowledge" test—repo layout, legacy patterns, desired files, docs, and commands are enumerated below.

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://nextjs.org/docs/app/guides/upgrading/version-15#react-19
  why: Details codemods, React 19 requirements, and async request API changes needed for package + layout updates.
  critical: React 19 enforces async `cookies()/headers()` and deprecates `useFormState`, which affects future GNSS forms.

- url: https://nextjs.org/blog/next-15-1#react-19-support
  why: Confirms React 19 GA support landed in Next 15.1 and highlights fetch/cache regressions to validate after upgrade.
  critical: Use its release checklist to ensure incremental adoption (lint/build after dependency bumps).

- url: https://tailwindcss.com/docs/installation/framework-guides/nextjs#app-router
  why: Shows the exact `tailwindcss` CLI flags, `@import "tailwindcss";` entry file syntax, and `content` globs for App Router.
  critical: Prevents missing purge paths so marketing routes actually receive Tailwind classes once Bootstrap SCSS is removed.

- url: https://ui.shadcn.com/docs/installation/next
  why: Documents `npx shadcn@latest init`, `components.json`, and default paths (`src/components/ui`) for shadcn/ui.
  critical: Ensures generated components match the GNSS POC conventions and clarifies how to add primitives (Button, Card, Sheet).

- url: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#app-router
  why: Provides the `makeQueryClient/getQueryClient` pattern for App Router layouts so Query state persists across server/client.
  critical: Avoids creating a new QueryClient per render, preventing cache loss on navigation.

- docfile: PRPs/ai_docs/next15-upgrade.md
  why: Condenses Next 15 upgrade pitfalls (React 19 APIs, async helpers, install hygiene) for quick reference mid-implementation.
  section: Entire document (short brief).
```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase

```bash
$ tree -L 2 -I node_modules
.
├── AGENTS.md
├── docs
│   └── gnss-integration-plan.md
├── jsconfig.json
├── next.config.js
├── package-lock.json
├── package.json
├── PRPs
│   ├── ai_docs
│   ├── prp-readme.md
│   └── templates
├── public
│   ├── assets
│   └── raven-brochure.pdf
├── README.md
└── src
    ├── app
    ├── components
    ├── helper
    └── scripts
```

### Desired Codebase tree with files to be added and responsibility of file

```bash
.
├── postcss.config.js              # Generated via `npx tailwindcss init -p` (JS) for Tailwind pipeline
├── tailwind.config.ts             # Custom theme w/ Coastal colors/spacing tokens + shadcn presets
├── src
│   ├── styles
│   │   └── tailwind.css          # Entry point replacing globals.scss, imports `@tailwind base/components/utilities`
│   ├── components
│   │   ├── providers
│   │   │   ├── ClientProviders.jsx   # Wraps QueryClientProvider + ThemeProvider + ScrollToTop
│   │   │   └── query-client.js       # Exports singleton helpers per TanStack advanced SSR guide
│   │   ├── ui                       # Auto-generated by shadcn (Button, Card, Sheet, Separator, Skeleton, etc.)
│   │   └── (rewritten) Navbar.js / Footer.js / HeroBanner.js / ServiceArea.js / WhyChoose.js / raven/*.jsx
│   ├── app
│   │   ├── globals.css             # Thin CSS w/ `@import "tailwindcss";` + font variables + resets
│   │   └── (routes) page.jsx, contact/page.jsx, privacy/page.jsx, raven-air-blast/page.jsx using Tailwind+shadcn
│   └── lib
│       └── theme-tokens.ts        # (Optional) exports JS objects mapping legacy SCSS tokens to Tailwind theme (used in config)
├── components.json                 # shadcn config (framework: next-app, tsx true even if components stay JS)
└── .nvmrc                          # Pin >=18.17 to match Next 15 requirements (if not already tracked)
```

### Known Gotchas of our codebase & Library Quirks

```python
# BootstrapInit (src/helper/BootstrapInit.js:1) injects bootstrap.bundle + ScrollToTop globally.
# Removing Bootstrap before replacing ScrollToTop will break the floating button on every page.

# globals.scss (src/app/globals.scss:1) imports bootstrap + animate + slick + entire theme SCSS; deleting it without
# mapping tokens into tailwind.config.ts drops typography, spacing, and color variables used everywhere.

# Raven marketing components (src/components/raven/*.jsx) and shared sections rely on non-standard classes like
# `pd-top-120` (public/assets/scss/global/_common.scss:974) and `.why-choose-area` (public/assets/scss/style.scss).
# Tailwind equivalents must be explicit (e.g., `py-28`, `bg-gradient-to-br`) or the layouts collapse.

# Privacy/auth routes already use Tailwind-like class names (`text-2xl`, `mx-auto`), but Tailwind isn’t installed,
# so these classes currently do nothing. After Tailwind config lands, verify typography/spacing so we don’t regress copy fit.

# shadcn/ui defaults to TypeScript/ESM; if we stay on plain JS components, run `npx shadcn@latest init` with
# `--typescript false --tailwind-config ./tailwind.config.ts --components "button,card,separator"` to avoid TS lint errors.

# TanStack Query in layouts must follow the `makeQueryClient` pattern; creating a new QueryClient inline per render causes
# hydration churn once `/gnss` introduces data fetching.
```

## Implementation Blueprint

### Data models and structure

```python
# Tailwind theme tokens map legacy SCSS vars (public/assets/scss/global/_global.scss:1-80) to config:
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0c2c94',  # var(--main-color)
          accent: '#f5c400',   # approved secondary yellow
          highlight: '#8ea1c6',
          neutral: '#6c7484',
          wash: '#dfe7f7',
          destructive: '#c75c02',
          heading: '#101a29',
          body: '#6c7484',
        },
        surface: {
          muted: '#dfe7f7',
          deep: '#6c7484',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      spacing: {
        30: '7.5rem',   # matches .pd-top-120
      },
    },
  },
};

# ClientProviders skeleton (src/components/providers/ClientProviders.jsx):
import { ThemeProvider } from 'next-themes';
import { QueryClientProvider, ReactQueryDevtools } from '@tanstack/react-query';
import ScrollToTop from 'react-scroll-to-top';
import { getQueryClient } from './query-client';

export default function ClientProviders({ children }) {
  const queryClient = getQueryClient();
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        {children}
        <ScrollToTop smooth color="#0c2c94" />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
```

### Implementation Tasks (ordered by dependencies)

```yaml
Task 1: PREP runtime + dependencies
  - IMPLEMENT: Add .nvmrc (>=18.17), run `npx @next/codemod@canary upgrade latest`, update package.json: next@15.x, react@19.x, react-dom@19.x, eslint-config-next@15.x, add tailwindcss/postcss/autoprefixer, @tanstack/react-query, next-themes, shadcn CLI, remove bootstrap/slick/animate if unused.
  - FOLLOW pattern: package.json:1-40 (existing scripts) to keep dev/build/lint parity.
  - GOTCHA: Document any peer-dependency overrides in PR description per `PRPs/ai_docs/next15-upgrade.md`.

Task 2: INIT Tailwind + postcss
  - IMPLEMENT: `npx tailwindcss init -p --ts`, move output to tailwind.config.ts & postcss.config.js.
  - CONTENT: `content` globs `./src/**/*.{js,jsx,ts,tsx}` + `./src/components/ui/**/*` as per Tailwind Next guide.
  - ADD: `src/styles/tailwind.css` with `@import "tailwindcss";` blocks and base resets (font vars, body text).
  - PLACEMENT: Import new CSS in `src/app/layout.js` once Bootstrap files are removed.

Task 3: SETUP shadcn/ui
  - IMPLEMENT: `npx shadcn@latest init` (framework=next-app, tailwind-config=tailwind.config.ts, components path `src/components/ui`).
  - ADD: Baseline components (Button, Card, Sheet, Separator, Skeleton) to cover hero CTA, service cards, Raven layout.
  - DOCUMENT: Generate `components.json` committed at repo root.

Task 4: ADD ClientProviders + TanStack Query utilities
  - CREATE: `src/components/providers/query-client.js` exporting `makeQueryClient`/`getQueryClient` (per TanStack guide) and `ClientProviders.jsx` wrapping ThemeProvider + QueryClientProvider + ScrollToTop.
  - MODIFY: `src/app/layout.js` to import ClientProviders, remove `BootstrapInit`, swap metadata for Coastal PASS copy, and load `src/styles/tailwind.css`.
  - CLEANUP: Delete `src/helper/BootstrapInit.js` references once ScrollToTop is inside providers.

Task 5: MIGRATE global styles
  - CONVERT: `src/app/globals.scss` → `src/app/globals.css` that only houses Tailwind directives + custom CSS variables (fonts/colors) + Raven background overrides.
  - TRANSLATE: Map SCSS tokens from `public/assets/scss/global/_global.scss` and spacing helpers from `_common.scss` into Tailwind theme extension.
  - REMOVE: `public/assets/scss` import chain once equivalent utilities exist; keep imagery under `public/assets/img/**`.

Task 6: REWRITE shared components to Tailwind/shadcn
  - TARGET: `src/components/Navbar.js`, `HeroBanner.js`, `ServiceArea.js`, `WhyChoose.js`, `Footer.js`, and `src/components/raven/*.jsx`.
  - APPROACH: Replace Bootstrap grid classes with Tailwind flex/grid, reuse shadcn `Button`, `Card`, `Separator` for CTAs and service tiles.
  - DATA: Keep existing content from `src/scripts/**` (service data, raven brochure) untouched; only adjust markup/styling.
  - ACCESSIBILITY: Ensure nav toggles use `aria-expanded`, `aria-controls` without manual DOM queryListeners (prefer `useState`).

Task 7: UPDATE routes and metadata
  - FILES: `src/app/page.jsx`, `contact/page.jsx`, `privacy/page.jsx`, `raven-air-blast/page.jsx`, `auth/callback/page.jsx`.
  - ACTION: Remove unused `template/*` imports, compose pages from rewritten components, ensure sections load as Server Components unless hooks force `"use client"`.
  - PRIVACY/AUTH: Confirm Tailwind classes now render; add semantic headings and consistent spacing.

Task 8: CLEAN dependencies + assets
  - REMOVE: `sass` devDependency if no SCSS remains, delete `public/assets/scss/**` if unused, drop `react-modal-video/scss` import once converted to CSS modules or Tailwind-friendly modal.
  - VERIFY: Icons/assets referenced (e.g., `assets/img/ct/logo.png`) stay in `public` and are imported via Next `<Image>` where beneficial.
  - DOCS: Update README with new stack summary and commands.

Task 9: VALIDATE + capture evidence
  - COMMANDS: `npm run lint`, `npm run build`, `npm run dev` smoke.
  - QA: Manual walkthrough of `/`, `/contact`, `/privacy`, `/raven-air-blast`, verifying hero animation, contact form submission (mock), WorkOS auth modal, ScrollToTop.
  - ARTIFACTS: Before/after screenshots + note about removal of Bootstrap/shadcn adoption in PR body.
```

### Implementation Patterns & Key Details

```python
# Layout pattern once Tailwind is in place (src/app/layout.js):
import "@/styles/tailwind.css";
import ClientProviders from "@/components/providers/ClientProviders";
import { Plus_Jakarta_Sans } from "next/font/google";

const fontSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontSans.variable} suppressHydrationWarning>
      <body className="bg-white text-slate-900">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

# Navbar pattern using shadcn Button + Tailwind grid:
<nav className="border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/80">
  <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
    <Link href="/" className="flex items-center gap-2">
      <Image src="/assets/img/ct/logo.png" alt="Coastal PASS" width={148} height={32} />
    </Link>
    <Button variant="outline" asChild>
      <Link href="/contact">Contact Us</Link>
    </Button>
  </div>
</nav>

# Section card mapping ServiceArea data without Bootstrap grids:
<div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
  {services.map((service) => (
    <Card key={service.title} className="h-full border border-slate-100 shadow-sm">
      <CardHeader className="flex items-center gap-4">
        <span className="text-brand-primary text-3xl">{service.icon}</span>
        <CardTitle>{service.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-slate-600">{service.description}</CardContent>
    </Card>
  ))}
</div>
```

### Integration Points

```yaml
CONFIG:
  - Update next.config.js:3-17 only if new headers or experimental flags are required post-upgrade; keep existing apple-app-site-association header.
  - Ensure jsconfig.json:1-7 still maps `@/*` to `./src/*`; update if new folders (src/styles, src/lib) need aliases.

STYLES:
  - Replace src/app/globals.scss:1-7 import tree with src/styles/tailwind.css.
  - Delete public/assets/scss/** once Tailwind equivalents exist; keep imagery under public/assets/img/**.

ROUTES:
  - src/app/page.jsx:1-56 should import only rewritten components.
  - src/app/contact/page.jsx:1-34 and privacy/page.jsx:1-200 adopt Tailwind spacing.
  - src/app/raven-air-blast/page.jsx:1-42 uses updated Raven components.

DATA:
  - src/scripts/ravenBrochure.js:1-79 continues as pure data; ensure components consume it with Tailwind layouts.
  - src/scripts/serviceList.js (if reused) should feed Tailwind Card grid vs. Bootstrap `.single-service-inner-3` classes.
```

## Validation Loop

### Level 1: Syntax & Style (Immediate Feedback)

```bash
# Dependency + code mods
npx @next/codemod@canary upgrade latest
npx @next/codemod async-requests ./src

# Lint + formatting
npm run lint
npx prettier "src/**/*.{js,jsx,ts,tsx,css}" --check
```

### Level 2: Unit / Component Validation

```bash
# Storybook not configured; rely on targeted component tests
npx @testing-library/react check --findRelatedTests src/components/Navbar.js src/components/ServiceArea.js  # optional once tests exist
# For now, add TODO to implement Jest/RTL when automation is introduced.
```

### Level 3: Integration Testing (System Validation)

```bash
npm run build
npm run start & sleep 5
curl -I http://localhost:3000/
curl -I http://localhost:3000/contact
curl -I http://localhost:3000/privacy
curl -I http://localhost:3000/raven-air-blast
# Manual QA per AGENTS.md: verify hero animation, contact form submission flow, auth modal/WorkOS link, ScrollToTop button.
```

### Level 4: Creative & Domain-Specific Validation

```bash
# Visual regression (manual screenshots acceptable until Playwright is introduced)
npx @percy/cli snapshot http://localhost:3000 http://localhost:3000/contact http://localhost:3000/privacy http://localhost:3000/raven-air-blast

# Accessibility + performance spot checks
npx @axe-core/cli http://localhost:3000
npx lighthouse http://localhost:3000 --preset=desktop --chrome-flags="--headless"
```

## Final Validation Checklist

### Technical Validation

- [ ] `npm run lint` + `npm run build` succeed on Node >=18.17 / Next 15.
- [ ] Tailwind/dev server hot reload works (`npm run dev`).
- [ ] No references to `bootstrap`, `.scss`, or `BootstrapInit` remain.
- [ ] QueryClientProvider + ThemeProvider confirmed via React DevTools (provider tree present once in layout).

### Feature Validation

- [ ] Visual parity confirmed via screenshots for `/`, `/contact`, `/privacy`, `/raven-air-blast`.
- [ ] Hero animation (HeroBanner), contact form interactions, and auth modal behave per AGENTS testing guidelines.
- [ ] ScrollToTop button renders via ClientProviders and respects Tailwind theme colors.

### Code Quality Validation

- [ ] Tailwind classes documented or abstracted where repeated; no leftover `.pd-top-120` style hooks.
- [ ] shadcn components live under `src/components/ui` with local styles (no global leakage).
- [ ] README + docs updated to mention Tailwind/shadcn stack, new commands, and Node version requirements.

### Documentation & Deployment

- [ ] PR body lists dependency bumps, codemods used, screenshots, lint/build output, and manual QA notes.
- [ ] `.nvmrc` committed (if new) and any new env vars captured in `.env.example` (none expected for Phase 1).

---

## Success Metrics

**Confidence Score**: 8/10 (main risk is the breadth of component rewrites; mitigated by shadcn patterns + documented tokens).

**Risks & Mitigations**:
- Legacy SCSS class usage is pervasive; use Tailwind theme extensions + shadcn cards to avoid missing spacing/typography.
- React 19 peer conflicts possible (especially `react-modal-video`); track and resolve/upstream replacements as part of cleanup.

**Open Questions**:
1. Should we introduce Jest/RTL now or wait until automation mandate in testing guidelines? (Currently manual + lint only.)
2. Are we keeping any of the template components under `src/components/template/*`, or can unused files be removed after conversion?

---

## Anti-Patterns to Avoid

- ❌ Mixing Bootstrap classes with Tailwind utilities—remove Bootstrap markup entirely instead of patching both.
- ❌ Creating a new QueryClient inside every component; keep the singleton helper per TanStack guidance.
- ❌ Leaving SCSS helper class names (e.g., `pd-top-120`) in markup once the Tailwind theme exists.
- ❌ Skipping manual QA on hero animation/contact/auth flows just because lint/build passed.
- ❌ Hardcoding colors instead of referencing Tailwind theme tokens derived from legacy SCSS variables.
