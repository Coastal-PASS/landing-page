name: "docs/page-layout-plan PRP"
description: |
  Comprehensive Product Requirement Prompt for implementing the multi-page marketing layout
  plan defined in `docs/page-layout-plan.md`. Provides context, references, and validation
  steps so an executing agent can ship the new navigation, pages, and shared components in
  one pass.

---

## Goal

**Feature Goal**: Deliver a fully implemented marketing experience that mirrors the page
layout plan (home, about, services, service details, products, product details, partner
program, Raven experience, contact, privacy) using cohesive App Router structure and
shared design tokens.

**Deliverable**: Refactored Next.js 15 App Router with a `(marketing)` route group,
updated `docs/page-layout-plan.md`, new page + component files per blueprint, and test
coverage validating layout states and CTAs.

**Success Definition**: Every nav item renders the specified sections with correct copy
and imagery, responsive spacing, accessible CTAs, metadata per page, automated + manual
validation pass (`npm run validate`, manual QA from docs/qa/manual-phase1.md), and zero
regressions in existing contact form/Raven flows.

## User Persona (if applicable)

**Target User**: Precision agriculture growers, equipment dealers, and fleet managers
seeking Coastal PASS services/products online.

**Use Case**: Discover offerings via home/landing pages, dive into service/product detail
pages, and convert through beta signups or the contact form without friction.

**User Journey**: Home hero → scroll through sections (services, social proof, betas) →
navigate to About/Services/Product detail via navbar or inline CTA chips → validate fit
through partner/program/Raven pages → submit contact form or call/email from footer.

**Pain Points Addressed**: Lack of structured navigation, missing intermediate pages,
unclear CTAs, inconsistent imagery, and insufficient trust signals currently limiting
lead capture.

## Why

- Drives revenue by turning static copy docs into live, navigable experiences with clear
  CTAs and SEO metadata per buyer type.
- Unlocks future GNSS integrations by aligning marketing shell with App Router route
  groups and shared layout primitives.
- Reduces implementation risk by codifying page structure, imagery requirements, testing
  expectations, and brand constraints ahead of development.

## What

Implement all user-visible marketing routes (home, about, services hub, six service
detail pages, products hub, five product detail pages, Raven experience, dealership
partner program, contact, privacy) plus shared layout primitives.

### Success Criteria

- [ ] `(marketing)` route group owns home + content pages with a shared layout that wraps
      Navbar, Footer, SEO metadata, and brand spacing tokens.
- [ ] Each section defined in `docs/page-layout-plan.md` is represented with reusable
      components (hero, card grids, timelines, CTA bands) under 200 lines per component.
- [ ] Service & product detail pages are generated from typed config (Zod validated)
      covering hero, benefits, imagery, and CTAs for all docs/content-rewrite files.
- [ ] Navbar + Footer link structure matches `docs/content-rewrite/nav_and_site_structure.md`
      and highlights current route on desktop/mobile.
- [ ] Contact form, raven page, and beta CTAs remain functional with updated copy + tests.
- [ ] Automated (`npm run lint`, `npm run type-check`, `npm run test:coverage`,
      `npm run build`) and manual QA checklists pass.

## All Needed Context

### Context Completeness Check

Status: ✅ PASS — Core specs (docs folder), existing components/tests, design tokens,
external layout best practices, and validation scripts are included. No external
knowledge gaps remain for an implementing agent.

### Documentation & References

```yaml
# External references
- url: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
  why: Defines how layouts vs templates behave in the App Router to keep Navbar/Footer
    persistent across marketing routes (Next.js 15 reference).
  critical: Prevents remounting shared providers when adding `(marketing)` layout.
- url: https://nextjs.org/docs/app/building-your-application/routing/route-groups#route-groups
  why: Needed to create `(marketing)` route group without changing public URLs.
  critical: Ensures new layout only scopes marketing pages and not auth flows.
- url: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-export
  why: Guides per-page metadata exports for SEO/social previews.
  critical: Guarantees each route declares title/description derived from docs copy.
- url: https://www.buttercups.tech/blog/react/how-to-use-nextjs-layouts-with-the-app-router-effectively#keep-layouts-lightweight
  why: Performance tips for nesting layouts and keeping client components minimal.
  critical: Avoids unnecessary client bundles or duplicated provider trees.
- url: https://www.aneeverse.com/blog/7-landing-page-design#cta-strategies
  why: CTA cadence + social proof ordering for B2B landing pages.
  critical: Validates alternating sections/CTAs from the page plan.
- url: https://www.webyansh.com/post/designing-high-converting-landing-pages-in-webflow-for-b2b-saas#imagery
  why: Audience-specific storytelling + imagery guidelines for SaaS experiences.
  critical: Informs imagery pairing + benefit framing per section.
- url: https://shalev.agency/blog/b2b-landing-page-best-practices#forms
  why: Reinforces best practices for keeping forms lightweight near CTAs.
  critical: Ensures contact/beta signup sections stay short and accessible.

# Repo references
- file: AGENTS.md
  why: Enforces strict TS, React 19, Zod, testing, and component length constraints.
  pattern: Follow Component-First + vertical slice architecture rules.
  gotcha: No `any`, files <500 lines, components <200 lines, and full JSDoc required.
- file: README.md
  why: High-level stack summary plus QA steps and scripts.
  pattern: Use `npm run validate` before finishing.
  gotcha: Node >=18.18; Netlify env fallbacks already configured.
- file: package.json
  why: Provides scripts (`dev`, `lint`, `type-check`, `test:coverage`, `build`, `validate`).
  pattern: Validate locally via `npm run validate` post-implementation.
  gotcha: `npm run dev` binds to `-H 192.168.191.253` (update documentation if needed).
- file: tsconfig.json
  why: Strict compiler settings (noImplicitAny, noUncheckedIndexedAccess).
  pattern: Ensure new modules respect path alias `@/*` and `moduleResolution: bundler`.
  gotcha: JSX preserve; import React types explicitly (`ReactElement`).
- file: tailwind.config.ts
  why: Contains brand tokens (colors, spacing, shadow) used across sections.
  pattern: Reuse `brand.*`, `surface.*`, `spacing` keys in new components.
  gotcha: Content glob currently `./src/**/*.{ts,tsx}` — new files must live under `src`.
- file: src/styles/tailwind.css
  why: Sets CSS variables + base typography for headings/body copy.
  pattern: Keep typography utilities consistent (uppercase eyebrow, etc.).
  gotcha: Body text uses `text-brand-body`; don't override globally.
- file: src/app/layout.tsx
  why: Root layout setting font, providers, metadata base URL.
  pattern: Ensure new `(marketing)` layout composes within this root.
  gotcha: `ClientProviders` already wraps ScrollToTop + QueryClient.
- file: src/components/providers/ClientProviders.tsx
  why: Shows Theme + Query providers; ensure new layouts do not reinstantiate clients.
  pattern: Keep marketing layout server-side, only mark client where hooks used.
  gotcha: Process env gating for React Query DevTools.
- file: src/app/page.tsx
  why: Current home page skeleton using Navbar/Hero/Service/Why.
  pattern: Use as baseline when migrating to `(marketing)` layout.
  gotcha: Present page is minimal — replace with sectionized plan.
- file: src/app/contact/page.tsx
  why: Existing contact hero + form usage.
  pattern: Retain contact method tiles + `ContactForm` hooking.
  gotcha: Contact CTAs rely on `contactMethods` array; update copy but keep structure.
- file: src/app/privacy/page.tsx
  why: Illustrates article formatting + section component pattern.
  pattern: Reuse `Section` helper for new privacy layout.
  gotcha: Contains nested component `Section`; keep under 200 lines.
- file: src/app/raven-air-blast/page.tsx
  why: Example of content-rich marketing page fed by config + Raven components.
  pattern: Mirror data-driven approach for service/product detail pages.
  gotcha: Imports from `scripts/ravenBrochure`; maintain zod-validated data.
- file: src/app/auth/callback/page.tsx
  why: Non-marketing route; ensure `(marketing)` route group does not wrap auth.
  pattern: Keep minimal layout.
  gotcha: Maintains CTA links back to home/contact.
- file: docs/page-layout-plan.md
  why: Primary spec enumerating section order, imagery, CTAs per page.
  pattern: Each numbered section must map to a tangible React component.
  gotcha: Must update this doc to reflect any new sections/assets added.
- file: docs/content-rewrite/nav_and_site_structure.md
  why: Source of desired nav hierarchy.
  pattern: Use to build Navbar menus + route definitions.
  gotcha: Services/products have nested entries that require actual subroutes.
- file: docs/content-rewrite/home_v2.md
  why: Canonical copy for new home sections (hero, services, beta, partners, why).
  pattern: Map headings/paragraphs 1:1 into components with CTA links.
  gotcha: Contact links currently relative (`contact`); convert to `/contact`.
- file: docs/content-rewrite/about_page.md
  why: Source for About hero, story timeline, map cards.
  pattern: Use timeline structure + CTA guidance.
  gotcha: Imagery references require assets under `public/assets/img/about`.
- file: docs/content-rewrite/services_fleet_telematics.md
  why: Example of service detail copy blocks.
  pattern: Build slug-to-content map for all `services-*.md` files.
  gotcha: Inline arrows `→` should become explicit CTA buttons.
- file: docs/content-rewrite/services-application-control.md
  why: Additional service detail content.
  pattern: Provide `Why it matters`, `Perfect for`, CTA blocks.
  gotcha: Keep markdown bullet order.
- file: docs/content-rewrite/services-water-management.md
  why: Service detail copy referencing surveying deliverables.
  pattern: Convert lists to icon cards or accordions per blueprint.
  gotcha: CTA uses relative links; convert to `/contact`.
- file: docs/content-rewrite/services-seeding-and-rate-control.md
  why: Additional detail content requiring specialized imagery.
  pattern: Map benefits list into grid.
  gotcha: Mention hero imagery `planter detail`.
- file: docs/content-rewrite/services-retrofits.md
  why: Contains testimonial slider requirement.
  pattern: Determine slider vs stacked testimonial approach.
  gotcha: Keep "Before/after" imagery references.
- file: docs/content-rewrite/services-consulting.md
  why: Consulting page copy for CTA hooking.
  pattern: Use cards for use cases.
  gotcha: CTA should link to consultation form (contact page anchor).
- file: docs/content-rewrite/products-trimble.md
  why: Product detail copy; replicate for `products-*.md` files.
  pattern: Provide hero + compatibility list + CTA.
  gotcha: Keep brand-specific keywords.
- file: docs/content-rewrite/products-raven.md
  why: Additional product copy.
  pattern: Map features into bullet lists.
  gotcha: Provide `Talk with our team` CTA.
- file: docs/content-rewrite/products-ecorobotix.md
  why: Contains sustainability stat block requirement.
  pattern: Use stat chips.
  gotcha: CTA referencing contact page.
- file: docs/content-rewrite/products-rtk-beta.md
  why: Beta-specific copy (map, status pill, early access CTA).
  pattern: Use status badge + callout.
  gotcha: Include "Note: Trimble CMR+" disclaimers.
- file: docs/content-rewrite/products-agcore.md
  why: Additional product entry.
  pattern: Provide compatibility table.
  gotcha: Marketing name is "AgSupport Platform (Beta)" but slug stays `/products/agcore`; keep CTA targeting `/contact?context=agsupport`.
- file: docs/content-rewrite/dealers-partner-program.md
  why: Copy for dealership page sections.
  pattern: Map "What your customers get" vs "What your dealership gets".
  gotcha: CTA uses `Become a Partner`; map to `/contact` with query param if needed.
- file: docs/content-rewrite/raven_page.md
  why: Additional Raven layout cues for immersive hero.
  pattern: Align with existing Raven components.
  gotcha: Imagery references under `public/assets/img/raven-brocure`.
- file: docs/qa/manual-phase1.md
  why: Manual regression checklist; extend for new routes.
  pattern: Add new routes to list.
  gotcha: Provide screenshot guidance for new sections.
- file: public/assets/img/ct/*
  why: Brand imagery (logos, hero photography, partner logos).
  pattern: Use `next/image` with accurate dimensions.
  gotcha: Keep file sizes optimized; import from `/assets/img/...`.
- file: src/components/marketing/Navbar.tsx
  why: Primary nav & mobile sheet implementation.
  pattern: Extend navLinks array for new routes, highlight active link.
  gotcha: Keep component <200 lines; mobile state uses `useState` so file stays client.
- file: src/components/marketing/Footer.tsx
  why: Footer pattern (logo, contact info, nav links, CTA copy).
  pattern: Update nav + copy to match new sections.
  gotcha: Year computed dynamically; preserve contact icons.
- file: src/components/marketing/HeroBanner.tsx
  why: Pattern for hero sections with imagery + CTA + optional dialog.
  pattern: Reuse layout when creating new hero variations.
  gotcha: Component is client because of Dialog; prefer server components elsewhere.
- file: src/components/marketing/ServiceArea.tsx
  why: Grid pattern for services + CTA link.
  pattern: Extend or abstract for new service grid.
  gotcha: Uses `ButtonLink` inline; maintain accessible link semantics.
- file: src/components/marketing/WhyChoose.tsx
  why: Example of timeline/list sections with numbering.
  pattern: Apply similar pattern to "Why Choose" blocks on other pages.
  gotcha: Hard-coded reasons array; future state may import from config.
- file: src/components/marketing/raven/*.tsx
  why: Shows modular sections fed by typed content.
  pattern: Mirror approach for service/product detail slices.
  gotcha: Components return `null` if no data; follow same guard.
- file: src/components/marketing/__tests__/*.test.tsx
  why: RTL + Vitest patterns for verifying marketing components.
  pattern: Add new tests alongside components inside `__tests__` folders.
  gotcha: Tests expect `@testing-library/jest-dom` matchers.
- file: src/features/contact/components/ContactForm.tsx
  why: Validated form reused on contact + CTA sections.
  pattern: Reuse component via props or wrappers when embedding in new pages.
  gotcha: Status state toggles success message; avoid multiple forms per page without scoping.
- file: src/features/contact/schemas/form.ts
  why: Contact form schema; extend if new fields added.
  pattern: Keep Zod validation aligned with UI.
  gotcha: No optional message text; ensure copy matches requirement.
- file: src/features/contact/__tests__/contact-form.test.tsx
  why: Shows TDD pattern for form validation.
  pattern: Mirror for new forms/beta signup actions.
  gotcha: `waitFor` usage for async success message.
- file: src/scripts/ravenBrochure.ts
  why: Demonstrates using Zod to validate static content imports.
  pattern: Use similar schema for services/products blueprint data.
  gotcha: Keep data serializable for server components.
- file: src/test/setup.tsx
  why: RTL setup + Next Image mock.
  pattern: No extra setup required; ensure new tests rely on existing mocks.
  gotcha: `window.matchMedia` mocked; avoid re-defining.
- file: vitest.config.ts
  why: Coverage thresholds + alias config.
  pattern: Ensure new tests keep coverage ≥80%.
  gotcha: Coverage include globs currently `src/components` and `src/features` only; tests for `src/app` components should import from these directories or adjust config.
- file: PRPs/ai_docs/tailwind-theme-map.md
  why: Maps legacy SCSS tokens to Tailwind theme keys.
  pattern: Reference when assigning colors/spacing in new sections.
  gotcha: Do not invent new tokens unless necessary.
- file: PRPs/ai_docs/next15-upgrade.md
  why: Notes on React 19 + Next 15 upgrade requirements.
  pattern: Confirm new code adheres to async request APIs and Node version.
  gotcha: Keep server components async-safety.
- file: PRPs/ai_docs/app-router-page-layouts.md
  why: Curated Next.js layout + marketing best-practice research.
  section: Read entire document before structuring route groups and section cadence.
```

### Canonical slug mapping (doc → marketing label → route)

| Source doc | Marketing label | Route slug | Example path |
| --- | --- | --- | --- |
| docs/content-rewrite/services_fleet_telematics.md | Fleet Telematics & RTK Monitoring | fleet-telematics | /services/fleet-telematics |
| docs/content-rewrite/services-application-control.md | Application Control Retrofits | application-control | /services/application-control |
| docs/content-rewrite/services-water-management.md | Water Management & Survey | water-management | /services/water-management |
| docs/content-rewrite/services-seeding-and-rate-control.md | Seeding & Rate Control | seeding-and-rate-control | /services/seeding-and-rate-control |
| docs/content-rewrite/services-retrofits.md | Hardware Retrofits & Installs | retrofits | /services/retrofits |
| docs/content-rewrite/services-consulting.md | Precision Consulting | consulting | /services/consulting |
| docs/content-rewrite/products-trimble.md | Trimble Guidance Systems | trimble | /products/trimble |
| docs/content-rewrite/products-raven.md | Raven Air-Blast Enhancements | raven | /products/raven |
| docs/content-rewrite/products-ecorobotix.md | Ecorobotix Precision Sprayers | ecorobotix | /products/ecorobotix |
| docs/content-rewrite/products-rtk-beta.md | RTK+ Network (Beta) | rtk-beta | /products/rtk-beta |
| docs/content-rewrite/products-agcore.md | AgSupport Platform (Beta) | agcore | /products/agcore |

### Current Codebase tree (key directories)

```bash
.
├── AGENTS.md
├── docs/
│   ├── content-rewrite/
│   ├── page-layout-plan.md
│   └── qa/
├── PRPs/
│   ├── ai_docs/
│   ├── prp-readme.md
│   └── templates/
├── public/assets/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── helper/
│   ├── lib/
│   ├── scripts/
│   ├── styles/
│   └── test/
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

### Desired Codebase tree with files to be added and responsibility

```bash
src/app/
├── (marketing)/
│   ├── layout.tsx                 # Shared Navbar/Footer + metadata for marketing routes
│   ├── page.tsx                   # New home page composing hero, services, beta highlights
│   ├── about/page.tsx             # About layout per docs/about_page.md
│   ├── services/
│   │   ├── page.tsx               # Services landing grid + process + CTA band
│   │   └── [service]/page.tsx     # Dynamic service detail routes (fleet-telematics, etc.)
│   ├── products/
│   │   ├── page.tsx               # Products landing page with comparison table
│   │   └── [product]/page.tsx     # Dynamic product detail routes (trimble, raven, etc.)
│   ├── partner-program/page.tsx   # Dealership partner program page
│   ├── raven-air-blast/page.tsx   # (Optionally relocated) Raven immersive experience
│   ├── contact/page.tsx           # Updated contact hero/form/FAQ layout
│   └── privacy/page.tsx           # Privacy page (if opted into marketing layout)
src/app/(marketing)/_components/
├── Hero.tsx                       # Server component for hero sections (copy, media, CTAs)
├── Section.tsx                    # Wrapper controlling spacing/background rhythm
├── SectionHeader.tsx              # Shared heading/eyebrow/copy block for every section
├── SectionContent.tsx             # Discriminated renderer that maps blueprint kinds → UI primitives
├── IconCardGrid.tsx               # Grid used by services/products summaries
├── StatGroup.tsx                  # Shared stat/testimonial block
├── Timeline.tsx                   # Vertical timeline steps used by About/Why Choose
├── CTACluster.tsx                 # Primary + secondary CTA pairings per section
├── ContactCTA.tsx                 # Reusable contact-summary band embedding ContactForm variants
├── DetailNav.tsx                  # Chips or tabs linking to services/products detail routes
├── BetaHighlight.tsx              # Beta status pill + action button component
├── PartnerLogos.tsx               # Logo row leveraging `public/assets/img/ct`
├── ProcessSteps.tsx               # Stepper used on services landing
├── FaqAccordion.tsx               # Accessible accordion for question/answer blocks
└── PageMetadata.ts                # Config-driven metadata definitions per slug
src/lib/
├── pageBlueprints.ts              # Zod schemas + typed config for services/products pages
├── navigation.ts                  # Source of nav hierarchy consumed by Navbar/Footer
├── imagery.ts                     # Central map of asset paths + alt text per section
docs/
├── page-layout-plan.md            # Updated with new imagery references and component names
└── qa/manual-phase1.md            # Extended manual QA checklist covering new routes
src/components/marketing/
├── Navbar.tsx                     # Updated nav links + dropdowns for nested routes
├── Footer.tsx                     # Updated link lists + CTA references
└── __tests__/*.test.tsx           # Expanded coverage for new nav/footer states
src/features/contact/
├── components/ContactForm.tsx     # Updated to accept optional `variant` props for in-page embeds
├── __tests__/contact-form.test.tsx# Extended coverage for new props + success states
src/scripts/
└── servicesProducts.ts            # (Optional) Data file for service/product configs if not stored in lib
```

### Known Gotchas of our codebase & Library Quirks

```python
# CRITICAL: Marketing components default to server components; only mark "use client" when hooks/state are required.
# Example: Navbar must stay client for mobile sheet; all section components should remain server to reduce JS payloads.
# CRITICAL: Keep every component under 200 lines (AGENTS.md). Break large sections into `_components` helpers.
# CRITICAL: ContactForm relies on Zod schema in src/features/contact/schemas/form.ts — update schema + tests before adding fields.
# Example: Next/Image requires explicit width/height or fill; ensure assets exist under public/assets/img/*.
# Example: Tests live in `__tests__` folders beside components/features; maintain coverage ≥80% via vitest.config.ts thresholds.
# CRITICAL: Docs under docs/content-rewrite contain relative links (../contact); convert to absolute Next routes when embedding.
```

## Implementation Blueprint

### Data models and structure

Use typed configuration to keep sections declarative and validate them with Zod:

```typescript
// src/lib/pageBlueprints.ts
import { z } from "zod";

const mediaSchema = z.object({
  src: z.string(),
  alt: z.string(),
  aspect: z.enum(["16:9", "4:3", "1:1"]).default("16:9"),
});

const sectionBackgroundSchema = z.enum(["white", "wash", "gradient"]).default("white");
const actionSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(["primary", "secondary", "ghost"]).default("primary"),
});

const cardSchema = z.object({
  icon: z.string().optional(),
  title: z.string(),
  body: z.string(),
  cta: actionSchema.optional(),
});

const timelineStepSchema = z.object({
  label: z.string(),
  description: z.string(),
});

const statSchema = z.object({
  label: z.string(),
  value: z.string(),
  helper: z.string().optional(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const processStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  helper: z.string().optional(),
});

const partnerLogoSchema = z.object({
  name: z.string(),
  logo: z.string(),
  alt: z.string(),
  href: z.string().url().optional(),
});

const betaStatusSchema = z.object({
  label: z.string(),
  tone: z.enum(["default", "success", "warning"]).default("default"),
});

const sectionBaseSchema = z.object({
  id: z.string(),
  eyebrow: z.string().optional(),
  title: z.string(),
  body: z.string(),
  copy: z.array(z.string()).optional(),
  background: sectionBackgroundSchema.optional(),
});

const heroSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("hero"),
  media: mediaSchema,
  actions: z.array(actionSchema).min(1).max(2),
});

const gridSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("grid"),
  cards: z.array(cardSchema).min(3),
  detailNav: z.array(actionSchema).optional(),
});

const timelineSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("timeline"),
  steps: z.array(timelineStepSchema).min(3),
});

const detailNavSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("detail-nav"),
  links: z.array(actionSchema).min(3),
});

const ctaSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("cta"),
  actions: z.array(actionSchema).min(1).max(2),
});

const statsSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("stats"),
  stats: z.array(statSchema).min(3),
});

const faqSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("faq"),
  faqs: z.array(faqSchema).min(3),
});

const processSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("process"),
  steps: z.array(processStepSchema).min(3),
});

const partnerLogosSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("partner-logos"),
  logos: z.array(partnerLogoSchema).min(4),
});

const betaHighlightSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("beta-highlight"),
  status: betaStatusSchema,
  actions: z.array(actionSchema).min(1).max(2),
});

export const sectionSchema = z.discriminatedUnion("kind", [
  heroSectionSchema,
  gridSectionSchema,
  timelineSectionSchema,
  detailNavSectionSchema,
  ctaSectionSchema,
  statsSectionSchema,
  faqSectionSchema,
  processSectionSchema,
  partnerLogosSectionSchema,
  betaHighlightSectionSchema,
]);

export const pageBlueprintSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  sections: z.array(sectionSchema).min(3),
});

export type PageBlueprint = z.infer<typeof pageBlueprintSchema>;
```

Populate `pageBlueprints.ts` with exports for each page (home, about, services, etc.) so
server components can map over sections without duplicating markup. The discriminated
union keeps `SectionContent` type-safe—each `kind` exposes the exact data shape needed for
that renderer. Always specify the `body` copy for the `SectionHeader`, optional `copy`
arrays for supporting paragraphs, partner logo metadata, beta status pills (`label` +
`tone`), and the `background` property for each section to drive the alternating
wash/gradient rhythm used by the shared `<Section>` wrapper.

### Implementation Tasks (ordered by dependencies)

```yaml
Task 1: SYNTHESIZE docs/page-layout-plan.md + content sources
  - IMPLEMENT: Update docs/page-layout-plan.md with any clarifications (imagery filenames, CTA copy, slug mapping) discovered during planning.
  - FOLLOW pattern: Existing sections already define hero → supporting layout; keep table for service/product detail mapping.
  - NAMING: Use kebab-case anchors (e.g., `services-fleet-telematics`).
  - OUTPUT: Confirm mapping sheet enumerates slug, doc file, imagery asset, and CTA target.

Task 2: CREATE src/lib/pageBlueprints.ts (and imagery/navigation helpers)
  - IMPLEMENT: Zod schemas + typed objects for each marketing page, referencing copy from docs/content-rewrite.
  - FOLLOW pattern: src/scripts/ravenBrochure.ts for schema validation + export of typed data.
  - NAMING: `homeBlueprint`, `serviceBlueprints.fleetTelematics`, etc.
  - DEPENDENCIES: Task 1 mapping ensures accurate slug-to-copy association.

Task 3: RESTRUCTURE App Router with `(marketing)` layout
  - IMPLEMENT: Create `src/app/(marketing)/layout.tsx` that imports Navbar/Footer + sets page-level metadata using blueprint data.
  - FOLLOW pattern: src/app/layout.tsx for structure, Navbar/Footer usage from current `page.tsx`.
  - NAMING: Keep `default export function MarketingLayout({ children }: { children: ReactNode })` returning `<Navbar /><main>{children}</main><Footer />`.
  - ACTIONS: Move existing `page.tsx`, `contact/page.tsx`, `privacy/page.tsx`, `raven-air-blast/page.tsx` into `(marketing)` folder and update imports.
  - DEPENDS ON: Task 2 (page blueprints + navigation helpers) to provide metadata + nav data.

Task 4: BUILD shared section components under src/app/(marketing)/_components
  - IMPLEMENT: `Hero`, `Section`, `SectionHeader`, `SectionContent`, `IconCardGrid`, `CTACluster`, `ContactCTA`, `DetailNav`, `StatGroup`, `Timeline`, `PartnerLogos`, `ProcessSteps`, `FaqAccordion`, `BetaHighlight`, `PageMetadata` (server component exporting metadata fragments).
  - FOLLOW pattern: src/components/marketing/HeroBanner.tsx (CTA structure), ServiceArea.tsx (card grid), WhyChoose.tsx (numbered list).
  - NAMING: Use filenames listed in the desired tree; each file exports a default component returning `ReactElement` with full JSDoc.
  - REQUIREMENTS: Components must accept typed data from blueprint + optional children, remain server components unless interactivity required, include a docstring per AGENTS.md.
  - DEPENDS ON: Task 2 (typed data) and Task 3 (layout shell for consumption).

Task 5: IMPLEMENT top-level marketing pages (home, about, services hub, products hub, partner program)
  - IMPLEMENT: Each page imports relevant blueprint data + section components to render hero + supporting sections.
  - FOLLOW pattern: Use `Section` wrapper to alternate `bg-white` vs `bg-surface-muted` (per docs plan) and keep 80–100px spacing.
  - NAMING: Export default `HomePage`, `AboutPage`, etc. with explicit `ReactElement` return types and `metadata` objects referencing blueprint metadata.
  - CONTENT: Map copy from docs/content-rewrite and doc plan; embed the shared `<ContactCTA />` band (fed with page context + `ContactForm` variant) at the bottom of each page.
  - DEPENDS ON: Tasks 1–4 (slug map + blueprints + shared components + layout).

Task 6: IMPLEMENT dynamic service detail routes `src/app/(marketing)/services/[service]/page.tsx`
  - IMPLEMENT: Use dynamic route params to select blueprint (fleet-telematics, water-management, etc.).
  - FOLLOW pattern: Raven page for data-driven sections; contact CTA anchored at bottom.
  - NAMING: Slugs derived from docs file names (e.g., `fleet-telematics`, `water-management`).
  - TESTS: Add `src/app/(marketing)/services/__tests__/service-detail-page.test.tsx` verifying hero copy + CTA link per slug.
  - DEPENDS ON: Tasks 1–4 (slug table + blueprint data + Section components).

Task 7: IMPLEMENT dynamic product detail routes `src/app/(marketing)/products/[product]/page.tsx`
  - IMPLEMENT: Similar to services; include compatibility tables + status badges for beta offerings.
  - FOLLOW pattern: Beta highlight spec from docs/page-layout-plan (RTK+, AgSupport) and hero cards referencing `docs/content-rewrite/products-*.md`.
  - ACTIONS: Provide fallback 404 via `notFound()` when slug missing.
  - TESTS: Add `src/app/(marketing)/products/__tests__/product-detail-page.test.tsx` covering metadata + CTA variants.
  - DEPENDS ON: Tasks 1–4 (slug table + blueprint data + Section components).

Task 8: UPDATE Navbar/Footer + navigation helpers
  - IMPLEMENT: Replace hard-coded `navLinks` arrays with data from `src/lib/navigation.ts` (derived from docs/nav_and_site_structure.md).
  - FOLLOW pattern: Existing Navbar for mobile sheet, Footer for nav list.
  - REQUIREMENTS: Highlight active route via `usePathname()`, add Services/Products dropdown or mega menu for nested links, ensure accessible focus states.
  - TESTS: Extend `navbar.test.tsx` and `footer.test.tsx` to cover new links + active states.
  - DEPENDS ON: Task 2 (navigation helpers) and Task 3 (marketing layout shell).

Task 9: ENHANCE contact, privacy, and Raven experiences to match plan
  - IMPLEMENT: Contact page gets FAQ accordion + location cards, privacy page gets TOC/sticky nav, Raven page uses new Section wrappers but retains brochure data.
  - FOLLOW pattern: docs/page-layout-plan instructions for each page.
  - REQUIREMENTS: Reuse ContactForm component; add optional `variant` prop for in-page embed sections as needed.
  - TESTS: Update contact form tests for new props; add Raven section tests verifying data-driven render.
  - DEPENDS ON: Tasks 2–4 (components + blueprints + layout) and Task 8 (nav links for shared shells).

Task 10: WRITE tests + docs and run validation
  - IMPLEMENT: Co-locate RTL tests under `__tests__` for each new component/page; update `docs/page-layout-plan.md` and `docs/qa/manual-phase1.md` to reflect final structure.
  - FOLLOW pattern: Existing tests, manual QA doc format.
  - COMMANDS: `npm run test:coverage`, `npm run lint`, `npm run type-check`, `npm run build`, update screenshot checklist.
  - DEPENDS ON: Tasks 1–9 being functionally complete.
```

### Implementation Patterns & Key Details

```typescript
// Example Section component pattern
interface SectionProps {
  readonly id: string;
  readonly background?: "white" | "wash" | "gradient";
  readonly children: ReactNode;
}

export const Section = ({ id, background = "white", children }: SectionProps): ReactElement => (
  <section
    id={id}
    className={cn(
      "py-30",
      background === "wash" && "bg-surface-muted",
      background === "gradient" && "bg-gradient-to-br from-brand-primary/10 to-brand-highlight/30",
    )}
  >
    <div className="mx-auto max-w-6xl px-4">{children}</div>
  </section>
);

interface SectionContentProps {
  readonly section: z.infer<typeof sectionSchema>;
}

export const SectionContent = ({ section }: SectionContentProps): ReactElement => {
  switch (section.kind) {
    case "hero":
      return <Hero section={section} />;
    case "grid":
      return <IconCardGrid cards={section.cards} detailNav={section.detailNav} />;
    case "timeline":
      return <Timeline steps={section.steps} eyebrow={section.eyebrow} />;
    case "detail-nav":
      return <DetailNav links={section.links} helperText={section.body} />;
    case "cta":
      return <CTACluster actions={section.actions} copy={section.copy ?? []} />;
    case "stats":
      return <StatGroup stats={section.stats} />;
    case "faq":
      return <FaqAccordion items={section.faqs} />;
    case "process":
      return <ProcessSteps steps={section.steps} />;
    case "partner-logos":
      return <PartnerLogos logos={section.logos} eyebrow={section.eyebrow} />;
    case "beta-highlight":
      return <BetaHighlight status={section.status} actions={section.actions} copy={section.copy ?? []} />;
    default:
      return <></>;
  }
};

// Usage in a page component
const HomePage = (): ReactElement => (
  <>
    <Hero section={homeBlueprint.sections.find((section) => section.kind === "hero")!} />
    {homeBlueprint.sections
      .filter((section) => section.kind !== "hero")
      .map((section) => (
        <Section key={section.id} id={section.id} background={section.background}>
          <SectionHeader eyebrow={section.eyebrow} title={section.title} body={section.body} />
          <SectionContent section={section} />
        </Section>
      ))}
    <ContactCTA />
  </>
);

// Section kind expectations
// - detail-nav: renders page-specific jump links or slug chips (use `links` + `body` helper text).
// - partner-logos: displays brand rows; logos map to imagery tokens defined in `src/lib/imagery.ts`.
// - beta-highlight: wraps status pill + CTA stack for beta programs (e.g., RTK+).
// - process: visualizes services workflow across 3–5 steps.
// - ContactCTA consumes `ContactForm` with a `variant` + `context` prop to reuse validation/schema logic everywhere.

// Navbar nav data example
export const primaryNav = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: serviceBlueprints.map(({ slug, title }) => ({ label: title, href: `/services/${slug}` })),
  },
  // ...
];
```

Key reminders:
- Use server components for data-driven sections; isolate interactive pieces (carousels, accordions) into small client components.
- Keep imagery references centralized (`src/lib/imagery.ts`) to avoid typo-induced 404s.
- All CTAs should use `<Link>` with descriptive aria-labels; include phone/email alternatives.
- Provide skeleton/loading states for dynamic routes if data fetch introduced later; placeholder currently static.
- `ContactCTA.tsx` lives under `src/app/(marketing)/_components` and wraps the shared `ContactForm` with a summary, phone/email chips, and variant selector so every page can render a consistent contact band without redefining form logic.

### Integration Points

```yaml
ROUTES:
  - add: src/app/(marketing)/** routes for each nav entry
  - ensure: src/app/not-found.tsx handles unknown service/product slugs via `notFound()` inside dynamic pages
NAVIGATION CONFIG:
  - new: src/lib/navigation.ts exported arrays consumed by Navbar & Footer
ASSETS:
  - extend: public/assets/img/... with any missing imagery referenced in docs (compress before commit)
DATA VALIDATION:
  - new: src/lib/pageBlueprints.ts + unit tests to guard copy regressions
FORMS:
  - reuse: ContactForm; optionally add `context` prop to adjust success copy per page
  - new: ContactCTA component composes ContactForm variant + summary chips for consistent contact bands
TESTS:
  - update: src/components/marketing/__tests__/*.test.tsx and src/features/contact/__tests__/contact-form.test.tsx
DOCS:
  - update: docs/page-layout-plan.md, docs/qa/manual-phase1.md with new references/screenshots
```

## Validation Loop

### Level 1: Syntax & Style

```bash
npm run lint
npm run type-check
npm run format:check
npm run format                         # only if formatting issues arise
```

### Level 2: Unit Tests & Coverage

```bash
npm run test:coverage                  # ensures ≥80% coverage per vitest.config.ts
npx vitest run src/components/marketing/__tests__
npx vitest run src/features/contact/__tests__/contact-form.test.tsx
```

### Level 3: Integration & Manual Validation

```bash
npm run build
npm run start &                        # serve production build locally
APP_URL=http://localhost:3000 npx @axe-core/cli http://localhost:3000/ --exit
open http://localhost:3000/            # (macOS) manual QA per docs/qa/manual-phase1.md; use `xdg-open` (Linux) or `start` (Windows)
open http://localhost:3000/services    # (macOS) verify nav + detail routes; Linux/Windows use `xdg-open`/`start`
open http://localhost:3000/products/agcore  # (macOS) dynamic product route; Linux/Windows use `xdg-open`/`start`
```

Stop the production server (`Ctrl+C`) before continuing to Level 4 to free port 3000 for dev mode.

### Level 4: Creative & Domain-Specific Validation

```bash
npm run dev &                          # spin up dev server for interactive reviews
npx lighthouse http://localhost:3000/ --quiet --chrome-flags="--headless"
# Capture screenshots for /, /about, /services, /services/fleet-telematics, /products, /products/trimble,
# /partner-program, /raven-air-blast, /contact, /privacy in desktop + mobile widths per QA doc.
# After audits, bring the background job to the foreground with `fg` (or `jobs -p` + `kill`) and press Ctrl+C to stop `npm run dev` so the port is freed.
```

## Final Validation Checklist

- [ ] Updated docs/page-layout-plan.md and docs/qa/manual-phase1.md committed with accurate instructions.
- [ ] `npm run lint`, `npm run type-check`, `npm run test:coverage`, and `npm run build` succeed.
- [ ] All new components/pages include full JSDoc comments and explicit `ReactElement` return types.
- [ ] Route navigation (desktop/mobile) surfaces every services/products detail page without 404s.
- [ ] Contact form works across `/contact` and embedded CTAs; success message appears via RTL tests.
- [ ] Imagery assets load without 404s; Next/Image dimensions verified in dev tools.
- [ ] Accessibility spot checks (axe, keyboard nav) pass for nav menus, accordions, and forms.
- [ ] Raven brochure page still references zod-validated data with no console errors.

## Anti-Patterns to Avoid

- ❌ Duplicating layout markup per page instead of using shared Section/Hero components.
- ❌ Hard-coding nav links in multiple files; centralize via `src/lib/navigation.ts`.
- ❌ Parsing markdown at runtime — copy should live in typed config or constants.
- ❌ Mixing interactive client logic into server components without `"use client"` guard.
- ❌ Skipping tests or manual QA for new routes/CTAs; coverage must remain ≥80%.
- ❌ Leaving docs/page-layout-plan.md outdated relative to implemented UI.

## Success Metrics

**Confidence Score**: 8/10 — All routes, content sources, and validation scripts are
specified. Remaining risk lies in asset availability (ensure imagery exists) and
coordinating many new sections under size limits.
