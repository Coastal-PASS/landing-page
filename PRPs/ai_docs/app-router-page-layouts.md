# Next.js App Router + Marketing Layout Research

Curated references for implementing the `docs/page-layout-plan.md` feature. Use these when designing new route groups, layouts, and marketing sections.

## Next.js layout architecture

- **App Router layout fundamentals** — Layouts persist across navigations, while templates remount per route. Use layouts for shared nav/footer and templates for per-page analytics or forms. [Next.js docs: Routing → Pages and Layouts](https://nextjs.org/docs/14/app/building-your-application/routing/pages-and-layouts).
- **Route groups for multiple root layouts** — Wrap folders in parentheses (e.g., `app/(marketing)/...`) to organize pages and opt subsets into different layouts without affecting URLs. Critical when marketing and platform shells need divergent headers/nav. [Next.js docs: Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups).
- **Project structure & private folders** — Keep feature-specific components inside private folders (e.g., `_components`) under each route to avoid global imports and keep page files concise. [Next.js docs: Project Structure & Colocation](https://nextjs.org/docs/app/building-your-application/routing/colocation).
- **Metadata orchestration** — Prefer static `metadata` exports for predictable SEO, and fall back to `generateMetadata` when page titles/descriptions depend on dynamic params. [Next.js API reference: `generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).
- **Partial prerendering & streaming** — Keep heavy, dynamic slices (dashboards, galleries) behind Suspense boundaries to take advantage of PPR. Prioritize server components for static content. [TheDailyDevs: Next.js 14.3+ App Router Best Practices](https://thedailydevs.com/blog/nextjs-14-3-app-router-best-practices).
- **Layout performance tips** — Limit nested layouts, lazy-load heavy client widgets, and centralize providers at the highest necessary level. [Buttercups Tech: Using Next.js App Router Layouts Effectively](https://www.buttercups.tech/blog/react/how-to-use-nextjs-layouts-with-the-app-router-effectively).

## Marketing layout & copy patterns

- **CTA density** — Repeat high-contrast CTAs every scroll depth to avoid dead ends; ensure buttons mirror nav prompts and include secondary “Download/Watch” options. [AneeVerse: 7 B2B SaaS Landing Page Tips](https://www.aneeverse.com/blog/7-landing-page-design).
- **Hero + social proof cadence** — Proven homepage sequence: Hero → immediate social proof → problem → solution → results → CTA. Useful for structuring each marketing page slice. [Reddit r/SaaS: Homepage structure boosting demo conversions](https://www.reddit.com/r/SaaS/comments/1javhiq).
- **Audience-specific storytelling** — Showcase use-case specific visuals (dashboards, field shots) and testimonial badges to capture different buyer personas. [WebYansh: High-Converting B2B SaaS Landing Pages in 2025](https://www.webyansh.com/post/designing-high-converting-landing-pages-in-webflow-for-b2b-saas).
- **Minimal, mobile-first forms** — Keep contact/beta signup forms ≤4 fields and place near primary CTA sections to reduce friction. [Shalev Agency: B2B Landing Page Best Practices](https://shalev.agency/blog/b2b-landing-page-best-practices).
- **Visual hierarchy & trust badges** — Mix hero imagery or loops with product UI, highlight benefits over features, and cluster logos/testimonials adjacent to CTAs. [WeAreNoCode: SaaS Landing Page Examples](https://www.wearenocode.com/blog/10-best-saas-landing-page-examples-to-inspire-your-design).

Use these references to justify layout decisions (route grouping, metadata, CTA frequency) directly inside the PRP so downstream agents do not need to research them again.
