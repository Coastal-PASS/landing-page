name: "Phase 1 – Next.js 15 + Tailwind/shadcn Rewrite (v2)"
description: |
  Rebuild the CoastalPASS marketing site foundation on Next.js 15 + React 19 with Tailwind/shadcn UI, TypeScript,
  and shared ClientProviders so follow-on GNSS feature work lands on a modern, consistent stack without rework.

---

## Goal

**Feature Goal**: Ship a React 19-ready marketing site that uses Tailwind/shadcn components, TanStack Query providers, and strict TypeScript, removing Bootstrap/SCSS debt ahead of GNSS integrations.

**Deliverable**: A single PR containing upgraded dependencies, Tailwind/shadcn scaffolding, rewritten marketing components (Navbar, HeroBanner, ServiceArea, WhyChoose, Footer, Raven feature set), Vitest tests, and screenshots proving parity on `/`, `/contact`, `/privacy`, `/raven-air-blast`.

**Success Definition**: `npm run lint`, `npm run type-check`, `npm run test:coverage`, and `npm run build` pass on Node ≥18.18; Bootstrap/SCSS assets and `BootstrapInit` are removed; new `ClientProviders` keeps ScrollToTop + Query + Theme state stable; manual QA confirms Tailwind render parity with screenshot evidence attached to the PR.

## User Persona (if applicable)

**Target User**: CoastalPASS marketing engineers and GNSS squads embedding dashboard modules into the marketing shell.

**Use Case**: They need a modern App Router shell that matches the GNSS dashboard runtime (Next 15/React 19, Tailwind, shadcn) so shared providers/components can be reused without forks.

**User Journey**:
1. Install dependencies, pin Node, and run codemods to upgrade to Next 15/React 19.
2. Scaffold Tailwind, shadcn, and ClientProviders, translating SCSS tokens to Tailwind theme extensions.
3. Rewrite marketing components/routes in TypeScript using shadcn primitives and Tailwind utilities.
4. Run Vitest, lint, type-check, build, and capture screenshots for the four marketing routes.

**Pain Points Addressed**:
- Eliminates Bootstrap/SCSS coupling currently blocking GNSS component reuse.
- Removes runtime drift (React 18 vs 19) between marketing site and GNSS dashboard.
- Documents exact files, tokens, tests, and validation commands so an unfamiliar agent can execute Phase 1 without tribal knowledge (no more WorkOS/auth modal confusion).

## Why

- Aligns the marketing runtime, design system, and providers with the GNSS dashboard per `docs/gnss-integration-plan.md` Phase 1 requirements.
- Tailwind/shadcn unlocks the shared UI kit already used by GNSS squads, preventing duplicate CSS and inconsistent spacing.
- Strict TypeScript + Vitest coverage protects against regressions while GNSS features start layering on server actions and authenticated states.

## What

Replatform the marketing pages (`/`, `/contact`, `/privacy`, `/raven-air-blast`, `/auth/callback`) onto Next.js 15.1 App Router with React 19, Tailwind 3.4, shadcn/ui primitives, TanStack Query + Theme providers, and Vitest test coverage. All legacy SCSS helpers (`public/assets/scss/**`) and Bootstrap scripts must be removed, replaced with Tailwind theme tokens sourced from `PRPs/ai_docs/tailwind-theme-map.md`. Components and pages must be TypeScript modules returning `ReactElement`, with client boundaries only where hooks are required (`HeroBanner` video toggle, Navbar menu, Contact form). Manual QA focuses on component-level parity rather than nonexistent WorkOS flows.

### Success Criteria

- [ ] `.nvmrc`, `tsconfig.json`, `next-env.d.ts`, `tailwind.config.ts`, `postcss.config.js`, `components.json`, and `src/styles/tailwind.css` exist and are wired into `src/app/layout.tsx`.
- [ ] `package.json` pins `next@15.1.x`, `react@19.x`, `react-dom@19.x`, adds Tailwind/postcss/autoprefixer, shadcn deps (`class-variance-authority`, `clsx`, `tailwind-merge`, Radix primitives), `@tanstack/react-query`, `@tanstack/react-query-devtools`, `next-themes`, `react-hook-form`, `@hookform/resolvers`, `zod`, `vitest`, `@testing-library/*`, `jsdom`, `prettier`, `@axe-core/cli`, `lighthouse`, and removes Bootstrap/Sass/Animate/Slick/AOS packages unless proven React-19-ready.
- [ ] `ClientProviders.tsx` + `query-client.ts` replace `BootstrapInit`, wrap children with ThemeProvider, QueryClientProvider (singleton per TanStack guide), ScrollToTop, and React Query Devtools (dev only).
- [ ] Navbar, HeroBanner (video CTA), ServiceArea, WhyChoose, Footer, and Raven sections are rewritten in TypeScript using Tailwind utilities + shadcn Button/Card/Separator; assets use `next/image` with `priority` where needed.
- [ ] Routes (`src/app/page.tsx`, `contact/page.tsx`, `privacy/page.tsx`, `raven-air-blast/page.tsx`, `auth/callback/page.tsx`) import only rewritten components, default to server components, and share metadata via `generateMetadata` where appropriate.
- [ ] Tailwind theme reproduces color/spacing tokens from `public/assets/scss` (see `PRPs/ai_docs/tailwind-theme-map.md`), and legacy SCSS imports are deleted.
- [ ] Co-located Vitest suites under `__tests__` exercise Navbar interactions, Hero video toggle, ServiceArea content rendering, Raven hero copy, and ClientProviders context wiring.
- [ ] README docs list new tooling, scripts, and manual QA expectations; PR body links lint/type-check/test/build logs plus screenshots for required routes.

## All Needed Context

### Context Completeness Check

This PRP includes all files, docs, token maps, and commands needed for a greenfield engineer to execute the migration without prior CoastalPASS knowledge. WorkOS/auth modal testing was removed because no such implementation exists in `src/` today.

### Documentation & References

```yaml
# External references
- url: https://nextjs.org/docs/app/guides/upgrading/version-15#react-19
  why: Details the React 19 upgrade path, async request API changes, and codemods required after bumping Next 15.
  critical: Follow its codemod + async API guidance before touching layouts/pages to avoid breaking builds.

- url: https://nextjs.org/blog/next-15-1#react-19-support
  why: Confirms React 19 GA support landed in Next 15.1 and lists regression tests (fetch/cache) to run post-upgrade.
  critical: Use its checklist to validate lint+build after dependency upgrades.

- url: https://tailwindcss.com/docs/installation/framework-guides/nextjs#app-router
  why: Shows exact Tailwind CLI flags, `@tailwind` directives, and `content` globs required for App Router.
  critical: Prevents purge misconfiguration so marketing routes receive Tailwind styles once SCSS is removed.

- url: https://ui.shadcn.com/docs/installation/next
  why: Documents `npx shadcn@latest init`, `components.json`, and default `src/components/ui` paths for Next App Router projects.
  critical: Ensures generated primitives (Button, Card, Sheet, Separator, Skeleton) match GNSS conventions.

- url: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#app-router
  why: Provides the `makeQueryClient/getQueryClient` pattern required to keep Query state consistent across server/client renders.
  critical: Avoids instantiating new QueryClients per render, preventing cache loss and hydration churn.

# Repository files & docs
- file: package.json
  why: Contains current scripts/dependencies (Next 14, Bootstrap stack) that must be upgraded/removed.
  pattern: Preserve script names while adding `type-check`, `test`, `format`, `validate` entries per AGENTS guidelines.
  gotcha: No prettier/eslint/dev tooling is installed yet—add them explicitly.

- file: next.config.js
  why: Houses `headers()` for apple-app-site-association; keep behavior while upgrading Next.
  pattern: Extend config only if new experimental flags are required; do not drop existing headers.
  gotcha: Ensure new config stays ESM/TS compatible when converting to `next.config.mjs` (if needed).

- file: jsconfig.json
  why: Provides `@/*` alias; ensure tsconfig mirrors it once TypeScript is introduced.
  pattern: Align tsconfig `paths` with jsconfig to avoid IDE drift.

- file: src/app/layout.js
  why: Currently imports Bootstrap assets and `BootstrapInit`; must be converted to `layout.tsx` with Tailwind + ClientProviders.
  pattern: Follow the layout snippet in this PRP’s Implementation Blueprint.
  gotcha: Remove `<BootstrapInit />` and replace with `<body><ClientProviders>{children}</ClientProviders></body>`.

- file: src/helper/BootstrapInit.js
  why: Injects bootstrap.bundle and ScrollToTop; reference its ScrollToTop props when recreating inside ClientProviders.
  pattern: Replace with Query + Theme provider wrapper; delete file afterwards.
  gotcha: Ensure ScrollToTop colors pull from Tailwind tokens instead of hardcoded `#246BFD`.

- file: src/app/globals.scss
  why: Imports bootstrap/animate/slick plus mega SCSS file; shows everything that must be removed.
  pattern: Replace with Tailwind entry file + minimal CSS custom properties.
  gotcha: Removing this before Tailwind config lands will nuke all typography/spacing.

- file: public/assets/scss/global/_global.scss
  why: Source of color/font CSS variables; feed these into Tailwind theme extension (see token map doc).
  pattern: Use `PRPs/ai_docs/tailwind-theme-map.md` for conversions.
  gotcha: Keep font-family references for `Plus Jakarta Sans` when configuring `next/font`.

- file: public/assets/scss/global/_common.scss
  why: Defines spacing helpers (`.pd-top-120` etc.); convert to Tailwind spacing scale.
  pattern: Map px → rem (documented in token map doc) and add to `tailwind.config.ts`.

- file: public/assets/scss/sections/_service.scss
  why: Documents `.single-service-inner-3` layout; replicate spacing, hover states, icon positions with Tailwind/shadcn Card grid.
  gotcha: Icon circles rely on absolute positioning; plan a flex layout instead.

- file: src/components/Navbar.js
  why: Current Bootstrap nav; convert to TypeScript + shadcn `Button`/Sheet for mobile toggles.
  pattern: Use `useState` for drawer, `aria-controls` for accessibility.
  gotcha: Remove direct DOM queries for submenu toggles—use stateful logic instead.

- file: src/components/HeroBanner.js
  why: Contains hero copy, CTA, and ModalVideo; convert to Tailwind + shadcn Button, replacing `react-modal-video` with Radix `Dialog` if React 19 incompatibility arises.
  gotcha: Keep overlay gradient/backdrop behavior from SCSS.

- file: src/components/ServiceArea.js
  why: Example of SCSS-heavy service grid; rewrite with shadcn Cards + data mapping.
  gotcha: Icon ordering must remain symmetrical; use arrays rather than repeated markup.

- file: src/components/WhyChoose.js
  why: Another layout reliant on `.why-choose-area`; replicate using Tailwind grid + tokenized spacing.

- file: src/components/Footer.js
  why: Contains contact info and mission copy; convert to Tailwind, ensuring semantics + contact links remain.

- file: src/components/raven/*.jsx
  why: Raven brochure sections consumed by `/raven-air-blast`; rewrite them first to unlock route migration.
  gotcha: They rely on data from `src/scripts/ravenBrochure.js`; keep data module JS-only but add types when consumed.

- file: src/scripts/ravenBrochure.js
  why: Data for Raven page; add TypeScript types via `z.infer` wrapper or TypeScript declaration file.

- file: src/app/page.jsx, contact/page.jsx, privacy/page.jsx, raven-air-blast/page.jsx, auth/callback/page.jsx
  why: Routes needing Tailwind/shadcn layout + metadata updates.
  gotcha: `contact/page.jsx` currently mixes template components; keep About/Contact combos but restyle.

- file: src/components/template/ContactMain.js
  why: Contact detail grid + map; convert to TypeScript, replacing iframe with responsive container and hooking to Zod form schema for future submissions.

- file: PRPs/ai_docs/next15-upgrade.md
  why: Quick reference for Next 15 pitfalls; keep in context for dependency work.

- file: PRPs/ai_docs/tailwind-theme-map.md
  why: Newly added token map translating SCSS variables + spacing utilities to Tailwind theme entries.
  gotcha: Follow its spacing table so padding/margin parity matches old `.pd-*` classes.
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
│   ├── phase-1-next15-tailwind.md
│   ├── prp-readme.md
│   ├── reports
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

13 directories, 10 files
```

### Desired Codebase tree with files to be added and responsibility of file

```bash
.
├── .nvmrc                               # Pin >=18.18.0 for Next 15 compatibility
├── components.json                      # shadcn config (framework: next-app, src/components/ui paths)
├── next-env.d.ts                        # Generated by Next when enabling TypeScript
├── postcss.config.js                    # Tailwind pipeline
├── tailwind.config.ts                   # Theme tokens sourced from token map doc
├── tsconfig.json                        # Matches AGENTS TypeScript strict config
├── vitest.config.ts                     # JSDOM env, coverage thresholds ≥80%
├── README.md                            # Updated with Tailwind/shadcn stack + QA steps
├── src
│   ├── styles
│   │   └── tailwind.css                 # `@tailwind base; @tailwind components; @tailwind utilities;` + resets
│   ├── app
│   │   ├── layout.tsx                   # Imports `@/styles/tailwind.css`, wraps children in ClientProviders
│   │   ├── page.tsx                     # Server component composing marketing sections
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── raven-air-blast/page.tsx
│   │   └── auth/callback/page.tsx
│   ├── components
│   │   ├── providers
│   │   │   ├── ClientProviders.tsx      # Theme + Query + ScrollToTop provider wrapper
│   │   │   └── query-client.ts          # Singleton QueryClient utilities per TanStack doc
│   │   ├── ui                           # shadcn primitives (Button, Card, Sheet, Separator, Skeleton)
│   │   └── marketing
│   │       ├── Navbar.tsx
│   │       ├── HeroBanner.tsx
│   │       ├── ServiceArea.tsx
│   │       ├── WhyChoose.tsx
│   │       ├── Footer.tsx
│   │       └── raven
│   │           ├── HeroSection.tsx
│   │           ├── SystemsSection.tsx
│   │           ├── AgSyncSection.tsx
│   │           ├── ClosingSection.tsx
│   │           └── ContactStrip.tsx
│   ├── features
│   │   └── contact
│   │       ├── schemas/form.ts          # zod schema + branded types for contact form
│   │       └── __tests__/contact-form.test.tsx
│   ├── test
│   │   └── setup.ts                     # Testing Library + jest-dom setup for Vitest
│   └── components
│       └── marketing/__tests__          # Vitest suites for Navbar, Hero, ServiceArea, WhyChoose, Footer, Raven sections
└── public
    └── assets                           # Images remain; SCSS directory removed after migration
```

### Known Gotchas of our codebase & Library Quirks

```python
# src/helper/BootstrapInit.js injects bootstrap.bundle + ScrollToTop. Removing Bootstrap without relocating ScrollToTop removes the floating button globally—keep ScrollToTop mounted via ClientProviders.

# src/app/globals.scss imports bootstrap, animate, slick, and the entire theme SCSS. Delete it only after Tailwind config + entry CSS exist, otherwise typography/spacing vanish.

# Raven marketing components (src/components/raven/*.jsx) and shared sections rely on custom classes like `.pd-top-120`, `.why-choose-area`, `.single-service-inner-3`. Translate them using the spacing/color tokens documented in PRPs/ai_docs/tailwind-theme-map.md to prevent layout collapse.

# Privacy/auth routes already contain Tailwind-like classes (`text-2xl`, `mx-auto`) that currently do nothing because Tailwind isn’t installed. Once Tailwind is configured, ensure these classes stay intentional and deduplicate overlapping utilities.

# React 19 requires async accessors (`cookies()`, `headers()`) inside layout/page files. Run `npx @next/codemod async-requests ./src` to catch offenders before enabling TypeScript strict mode.

# `react-modal-video` is not confirmed React-19-safe. Either replace it with shadcn Dialog + `next/video` or upgrade to a compatible fork before reintroducing the hero video CTA.
```

## Implementation Blueprint

### Data models and structure

```typescript
// tailwind.config.ts (excerpt)
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{ts,tsx}", "./src/components/ui/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0c2c94",
          accent: "#ee0020",
          fuchsia: "#ff00ea",
          purple: "#7e22ce",
          violet: "#6d18ef",
          crimson: "#e94057",
          heading: "#101a29",
          body: "#737588",
        },
        surface: {
          muted: "#f3f6fc",
          deep: "#3c547c",
        },
      },
      spacing: {
        15: "3.75rem",
        22: "5.625rem",
        25: "6.25rem",
        27: "6.875rem",
        28: "7.1875rem",
        30: "7.5rem",
        50: "12.5rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      boxShadow: {
        card: "0px 3px 20px rgba(0, 33, 71, 0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

> Tailwind automatically exposes negative spacing variants (e.g., `-mt-25`) for every positive key above, so never declare manual negative keys.

```typescript
// src/components/providers/query-client.ts
import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

const makeQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

export const getQueryClient = (): QueryClient => {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
};
```

```tsx
// src/components/providers/ClientProviders.tsx
"use client";
import { ReactNode, ReactElement } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ScrollToTop from "react-scroll-to-top";
import { getQueryClient } from "./query-client";

interface ClientProvidersProps {
  readonly children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps): ReactElement {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        {children}
        <ScrollToTop smooth color="#0c2c94" />
        {process.env.NODE_ENV !== "production" && (
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
```

```tsx
// Example Navbar.tsx (client component)
"use client";
import { ReactElement, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar(): ReactElement {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
    { href: "/raven-air-blast", label: "Raven" },
  ];

  const linkList = (
    <ul className="flex flex-col gap-4 text-base font-medium lg:flex-row lg:items-center">
      {navLinks.map(({ href, label }) => (
        <li key={href}>
          <Link className="transition hover:text-brand-primary" href={href}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link className="flex items-center gap-3" href="/">
          <Image src="/assets/img/ct/logo.png" alt="Coastal PASS" width={148} height={32} priority />
        </Link>
        <nav className="hidden lg:block" aria-label="Primary">
          {linkList}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="lg:hidden" aria-label="Open navigation">
              <span className="sr-only">Open navigation</span>
              <div className="space-y-1">
                <span className="block h-0.5 w-6 bg-brand-heading" />
                <span className="block h-0.5 w-6 bg-brand-heading" />
                <span className="block h-0.5 w-6 bg-brand-heading" />
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="pt-10">
              <nav aria-label="Mobile primary">{linkList}</nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
```

```tsx
// Example Vitest suite (src/components/marketing/__tests__/navbar.test.tsx)
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "../Navbar";

describe("Navbar", () => {
  it("renders primary links and contact CTA", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /Contact Us/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Raven/i })).toHaveAttribute("href", "/raven-air-blast");
  });
});
```

### Implementation Tasks (ordered by dependencies)

```yaml
- id: TASK-001
  name: "Foundation – runtime, tooling, dependencies"
  dependencies: []
  steps:
    - description: "Add `.nvmrc` pinned to >=18.18.0 and document the Node requirement in README."
    - description: "Run `npx @next/codemod@canary upgrade latest` to bump Next/React; update `package.json` to include next@15.1.x, react@19.x, react-dom@19.x, eslint-config-next@15.1.x, typescript@5.6.x, @types/react@19.x, @types/react-dom@19.x, prettier@3.x, vitest@2.x, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, @tanstack/react-query, @tanstack/react-query-devtools, next-themes, tailwindcss@3.4.x, postcss@8.4.x, autoprefixer@10.4.x, class-variance-authority, clsx, tailwind-merge, @radix-ui/react-dialog, @radix-ui/react-sheet, @radix-ui/react-separator, @hookform/resolvers, react-hook-form, zod, @axe-core/cli, lighthouse."
    - description: "Remove Bootstrap-era dependencies (bootstrap, animate.css, aos, slick-carousel, react-slick, sass, react-modal-video unless proven React-19 compatible) plus unused template deps noted in validation report."
    - description: "Create `src/lib/env.ts` with the mandated Zod schema (NODE_ENV, NEXT_PUBLIC_APP_URL, DATABASE_URL, NEXTAUTH_* fields) and call `env` within server code so invalid configs fail fast."
    - description: "Add npm scripts: `type-check`, `format`, `format:check`, `test:unit` (=vitest run), `test:watch`, `test:coverage`, `validate` (lint + type-check + test:coverage + build)."

- id: TASK-002
  name: "Enable TypeScript + Tailwind primitives"
  dependencies: ["TASK-001"]
  steps:
    - description: "Generate `tsconfig.json` and `next-env.d.ts` using Next CLI, then override compiler options per AGENTS.md (target ES2022, strict true, noImplicitAny, etc.)."
    - description: "Run `npx tailwindcss init -p --ts`, move config to `tailwind.config.ts`, and create `src/styles/tailwind.css` importing `@tailwind base; @tailwind components; @tailwind utilities;` plus CSS vars for fonts."
    - description: "Update `src/app/layout.tsx` (converted from `.js`) to import `@/styles/tailwind.css` and Google font via `next/font` instead of `font.css`."
    - description: "Delete `src/app/globals.scss` and `src/app/font.css` once Tailwind entry file and font loader are active."

- id: TASK-003
  name: "Scaffold shadcn/ui"
  dependencies: ["TASK-002"]
  steps:
    - description: "Run `npx shadcn@latest init` (framework=next-app, typescript=true, tailwind-config=tailwind.config.ts, components path `src/components/ui`)."
    - description: "Generate Button, Card, Sheet, Separator, Skeleton primitives and commit resulting `components.json`."
    - description: "Add helper utilities (e.g., `cn` function) in `src/lib/utils.ts` if shadcn scaffolding creates it; ensure lint rules allow it."

- id: TASK-004
  name: "ClientProviders + Query utilities"
  dependencies: ["TASK-002"]
  steps:
    - description: "Create `src/components/providers/query-client.ts` per TanStack advanced SSR guide, exposing `makeQueryClient` + `getQueryClient`."
    - description: "Create `src/components/providers/ClientProviders.tsx` that wraps `ThemeProvider`, `QueryClientProvider`, ScrollToTop, and React Query Devtools (dev only)."
    - description: "Replace `<BootstrapInit />` usage in `layout.tsx` with `<ClientProviders>` and delete `src/helper/BootstrapInit.js`."

- id: TASK-005
  name: "Global styles + token mapping"
  dependencies: ["TASK-002", "TASK-003"]
  steps:
    - description: "Populate `tailwind.config.ts` `theme.extend` with colors/spacing from `PRPs/ai_docs/tailwind-theme-map.md` (brand palette, surface colors, spacing scale)."
    - description: "Add CSS custom properties (fonts, base body styles) to `src/styles/tailwind.css` as needed; ensure `body` `font-family` uses `--font-sans`."
    - description: "Purge `public/assets/scss` imports from the build by removing references in any remaining CSS/JS files; keep image assets only."
    - description: "Document token decisions in README plus a short note in `tailwind.config.ts`."

- id: TASK-006
  name: "Rewrite shared marketing components"
  dependencies: ["TASK-003", "TASK-005"]
  steps:
    - description: "Convert `Navbar.js`, `HeroBanner.js`, `ServiceArea.js`, `WhyChoose.js`, `Footer.js` to TypeScript modules under `src/components/marketing/`."
    - description: "Replace Bootstrap markup with Tailwind/shadcn primitives, referencing token map for spacing/color parity; ensure nav toggles use `aria-expanded` and hero CTA uses shadcn Button/Dialog."
    - description: "Refactor `src/components/raven/*.jsx` into `src/components/marketing/raven/*.tsx`, using Tailwind grid/flex layouts and shadcn Cards for product panels."
    - description: "Convert `src/scripts/ravenBrochure.js` to a `.ts` module (or add `ravenBrochure.d.ts` + Zod schema) so Raven sections consume typed data instead of untyped objects."
    - description: "Add story-like fixtures or test-friendly props (e.g., `services` array) to facilitate Vitest coverage."

- id: TASK-007
  name: "Update App Router pages + metadata"
  dependencies: ["TASK-006"]
  steps:
    - description: "Convert `src/app/page.jsx` and route files (`contact`, `privacy`, `raven-air-blast`, `auth/callback`) to `.tsx`, importing rewritten components only."
    - description: 'Use server components by default; isolate client-only wrappers (Navbar, HeroBanner video) with explicit "use client" directives.'
    - description: "Ensure metadata exports use modern Next patterns (e.g., `export const metadata` typed) and share default SEO text via `layout.tsx`."
    - description: "Refactor `src/components/template/ContactMain.js` into `src/features/contact/components/ContactForm.tsx` as a client component wired to the `src/features/contact/schemas/form.ts` Zod schema via react-hook-form."

- id: TASK-008
  name: "Testing + coverage"
  dependencies: ["TASK-006", "TASK-007"]
  steps:
    - description: "Add `vitest.config.ts` with jsdom env, setup file `src/test/setup.ts` registering `@testing-library/jest-dom` and `next/font`/`next/image` mocks."
    - description: "Create `__tests__` folders adjacent to marketing components and contact feature, covering render, CTA links, and interactive states."
    - description: "Enforce ≥80% coverage thresholds (branches/functions/lines/statements) via Vitest config and ensure `npm run test:coverage` surfaces the HTML/text reports."

- id: TASK-009
  name: "Cleanup, docs, validation artifacts"
  dependencies: ["TASK-005", "TASK-007", "TASK-008"]
  steps:
    - description: "Delete obsolete files (`src/app/globals.scss`, `src/app/font.css`, `public/assets/scss/**`, `src/helper/BootstrapInit.js`) and update import paths accordingly."
    - description: "Update README with new stack overview, scripts, manual QA expectations, and instructions for regenerating shadcn components."
    - description: "Capture before/after screenshots for `/`, `/contact`, `/privacy`, `/raven-air-blast` (desktop + mobile widths) and attach them plus lint/type-check/test/build logs to the PR description."
    - description: "Document manual QA notes (hero animation, contact info links, Raven CTA buttons) inside `docs/qa/manual-phase1.md` so every phase stores artifacts in the same location."
```

### Required npm scripts (package.json excerpt)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,css,md,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,css,md,json}\"",
    "test:unit": "vitest run",
    "test:coverage": "vitest run --coverage",
    "validate": "npm run lint && npm run type-check && npm run test:coverage && npm run build"
  }
}
```

### Implementation Patterns & Key Details

```tsx
// Root layout pattern with next/font and ClientProviders
import type { Metadata } from "next";
import { type ReactElement, type ReactNode } from "react";
import "@/styles/tailwind.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClientProviders } from "@/components/providers/ClientProviders";

const fontSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Coastal PASS | Precision Agriculture",
  description: "High-tech advantage with old fashioned service.",
};

export default function RootLayout({ children }: { readonly children: ReactNode }): ReactElement {
  return (
    <html lang="en" className={fontSans.variable} suppressHydrationWarning>
      <body className="bg-white text-brand-body">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
```

```tsx
// ServiceArea – leverage arrays + shadcn Card
import { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type IconType } from "react-icons";
import { FaTractor, FaWater } from "react-icons/fa";
import { GiField, GiPlantWatering } from "react-icons/gi";
import { PiFarm } from "react-icons/pi";

interface ServiceItem {
  readonly title: string;
  readonly description: string;
  readonly Icon: IconType;
}

const services: ServiceItem[] = [
  { title: "Fleet Telematics", description: "Monitor location...", Icon: FaTractor },
  { title: "Water Management", description: "Optimize water usage...", Icon: FaWater },
  // ...
];

export function ServiceArea(): ReactElement {
  return (
    <section className="bg-surface-muted py-30">
      <div className="mx-auto max-w-6xl px-4">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">Our Services</p>
          <h2 className="mt-2 text-3xl font-semibold text-brand-heading">
            Comprehensive Solutions <span className="block">For Modern Agriculture</span>
          </h2>
        </header>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map(({ title, description, Icon }) => (
            <Card key={title} className="relative overflow-hidden border border-slate-100 shadow-card">
              <CardHeader className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-primary bg-white shadow">
                  <Icon className="text-3xl text-brand-primary" aria-hidden />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-body">{description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

```ts
// Contact form schema (src/features/contact/schemas/form.ts)
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

### Integration Points

```yaml
CONFIG:
  - Ensure next.config.js retains existing `headers()` while remaining compatible with Next 15 (convert to ESM if needed).
  - Mirror `@/*` alias from jsconfig.json inside tsconfig.json `compilerOptions.paths`.
  - Add mandatory `src/lib/env.ts` validation using Zod (per AGENTS.md) during Task-001 so future GNSS env vars have a typed home.

STYLES:
  - `src/styles/tailwind.css` replaces `src/app/globals.scss` as the only global stylesheet imported by `layout.tsx`.
  - Delete `public/assets/scss/**` once Tailwind theme + utilities cover all sections; keep image assets.

ROUTES:
  - `src/app/page.tsx`, `contact/page.tsx`, `privacy/page.tsx`, `raven-air-blast/page.tsx`, `auth/callback/page.tsx` import new marketing components only.
  - Use Next Image/Link components across routes for optimized assets.

DATA:
  - Keep `src/scripts/ravenBrochure.js` as the single source of brochure copy; add `.d.ts` or convert to `.ts` for stronger typing when consumed.
  - Introduce `src/features/contact/schemas/form.ts` for contact form validation (fail fast before hooking up WorkOS/Supabase later).

TESTS:
  - Co-locate Vitest suites inside `__tests__` directories adjacent to components/features to satisfy AGENTS testing mandate.
  - `src/test/setup.ts` registers RTL helpers and polyfills `window.matchMedia` for Navbar tests.
```

## Validation Loop

### Level 1: Syntax & Style (Immediate Feedback)

> These scripts are added during TASK-001. Before they exist, run `next lint`, `tsc --noEmit`, and `npx prettier --check "src/**/*.{ts,tsx,js,jsx,css,md,json}"` directly.

```bash
npm run lint                    # next lint with --max-warnings=0 configured in package.json
npm run type-check              # tsc --noEmit using strict config
npm run format:check            # prettier --check "src/**/*.{ts,tsx,js,jsx,css,md,json}"
```

### Level 2: Unit / Component Validation

> Also introduced in TASK-001. If scripts are unavailable yet, call `npx vitest run` and `npx vitest run --coverage` manually.

```bash
npm run test:unit               # vitest run --passWithNoTests should never trigger; ensure suites exist
npm run test:coverage           # vitest run --coverage (thresholds ≥80% branches/functions/lines/statements)
```

### Level 3: Integration Testing (System Validation)

```bash
set -euo pipefail
npm run build
npm run start > .next/start.log 2>&1 &
START_PID=$!
sleep 5
curl -sfS http://localhost:3000/ | head -n 20
curl -sfS http://localhost:3000/contact | head -n 20
curl -sfS http://localhost:3000/privacy | head -n 20
curl -sfS http://localhost:3000/raven-air-blast | head -n 20
pkill -P $START_PID || kill $START_PID
```

### Level 4: Creative & Domain-Specific Validation

> Requires the devDependencies installed in TASK-001 (`@axe-core/cli`, `lighthouse`).

```bash
# Accessibility + perf spot checks (install via devDependencies in Task 001)
npx @axe-core/cli http://localhost:3000 --exit
npx lighthouse http://localhost:3000 --preset=desktop --output-path=./artifacts/lighthouse-home.html
npx lighthouse http://localhost:3000/raven-air-blast --preset=desktop --output-path=./artifacts/lighthouse-raven.html

# Manual visual parity script (document results in PR body)
npm run dev & DEV_PID=$!
sleep 4
# Use your OS-specific opener (macOS: `open`, Linux: `xdg-open`, Windows: `start`)
xdg-open http://localhost:3000 || open http://localhost:3000 || start http://localhost:3000
xdg-open http://localhost:3000/contact || open http://localhost:3000/contact || start http://localhost:3000/contact
xdg-open http://localhost:3000/privacy || open http://localhost:3000/privacy || start http://localhost:3000/privacy
xdg-open http://localhost:3000/raven-air-blast || open http://localhost:3000/raven-air-blast || start http://localhost:3000/raven-air-blast
# Capture screenshots via OS tools, then stop dev server
kill $DEV_PID
```

## Final Validation Checklist

### Technical Validation

- [ ] `npm run lint`, `npm run type-check`, and `npm run format:check` all pass without warnings.
- [ ] `npm run test:coverage` meets ≥80% coverage thresholds across branches/functions/lines/statements.
- [ ] `npm run build` succeeds on Node ≥18.18 with no hydration warnings.
- [ ] No references to `bootstrap`, `.scss`, or `BootstrapInit` remain in the repo.

### Feature Validation

- [ ] Screenshot parity documented for `/`, `/contact`, `/privacy`, `/raven-air-blast` (desktop + mobile).
- [ ] Navbar links, hero CTA, service tiles, Raven CTAs, and contact links operate as expected.
- [ ] ScrollToTop renders via ClientProviders and respects Tailwind theme colors.

### Code Quality Validation

- [ ] Components stay under 200 lines and have JSDoc headers describing props/behavior.
- [ ] Tailwind class patterns documented or abstracted where repeated; spacing tokens align with `tailwind-theme-map.md`.
- [ ] shadcn components live under `src/components/ui` with no global leakage.

### Documentation & Deployment

- [ ] README updated with Next 15/Tailwind/shadcn stack, scripts, and QA commands.
- [ ] PR body includes dependency changes, codemods run, lint/type-check/test/build logs, accessibility/performance scores, and manual QA notes.
- [ ] `.nvmrc` committed and any new env vars documented (none expected in Phase 1).

## Success Metrics

**Confidence Score**: 8.5/10 (primary risks: React 19 compatibility of `react-modal-video`, thoroughness of Tailwind token mapping). 

**Risks & Mitigations**:
- Modal video library may break on React 19 → replace with shadcn Dialog + YouTube iframe wrapper if tests fail.
- Tailwind spacing drift could regress layout → rely on `PRPs/ai_docs/tailwind-theme-map.md` and screenshot diff.
- Lack of existing tests → enforce Vitest coverage early (Task 008) to catch regressions before rewrites expand scope.

**Open Questions**:
1. Should Raven ContactStrip remain commented out? Decide during rewrite so CTA alignment stays intentional.
2. Do we need to stub WorkOS auth UI now or in Phase 2? (Not in scope here; document decision in README.)
