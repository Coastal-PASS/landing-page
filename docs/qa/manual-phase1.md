# Phase 1 Manual QA

Use this checklist after running automated validation to document manual results and attach screenshots to the PR body.

## Routes & Expected States

1. `/` (desktop + mobile)
   - Hero renders blueprint copy and CTA buttons (Talk with our team, Watch overview) with video overlay.
   - Services grid lists six service pillars with “View details” chips.
   - Beta highlight cards display AgSupport + RTK status pills.
   - Contact CTA at bottom embeds the form and shows phone/email chips.
2. `/about`
   - Timeline renders 1971 → Today steps.
   - Location cards show Salinas, King City, and Paso Robles with map links.
3. `/services`
   - Dropdown chips for each service route link to corresponding detail pages.
   - Process section shows Assess → Integrate → Support steps.
4. `/services/fleet-telematics` (spot-check additional slugs)
   - Hero copy/imagery match blueprint, CTA points to `/contact?context=fleet-telematics`.
   - Detail nav chips show “Perfect for” audiences.
5. `/products`
   - Product cards list five offerings with comparison table showing status column.
6. `/products/trimble` (spot-check additional slugs)
   - Compatibility chips list supported fleets; CTA links to `/contact?context=trimble`.
7. `/partner-program`
   - “What your customers get” and “What your dealership gets” grids render with copy + icons.
8. `/raven-air-blast`
   - Existing brochure sections render plus Contact CTA context `raven`.
9. `/contact`
   - Hero matches blueprint, quick contact cards link correctly, embedded form submits and shows success copy.
10. `/privacy`
    - Hero + detail nav render; full policy article displays legacy text; contact CTA uses privacy context.
11. Navigation (desktop + mobile)
    - Services/Products dropdowns reveal child links (Fleet Telematics, Trimble, etc.).
    - Active route state highlights the current page.

## Screenshot Guidance

Capture desktop (≥1280px) and mobile (~375px) for `/`, `/contact`, `/privacy`, `/raven-air-blast`. Include hero + CTA visibility. Attach to PR body along with notes on:

- Hero CTA interaction
- Contact info verification
- Raven CTA links
