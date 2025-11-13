# Coastal PASS Page Layout & Content Plan

Guidance for visual/structural updates across every nav item described in `docs/content-rewrite`. All layouts should retain the current brand system (Plus Jakarta Sans, Tailwind utility scale, shadcn UI primitives, brand.primary `#0c2c94`, brand.accent `#f5c400`, subtle wash backgrounds).

## Global Theme Patterns
1. **Section rhythm:** Alternate light surfaces (`bg-white`, `bg-brand-wash`) with deep brand gradients for emphasis. Maintain 80–100px vertical spacing between sections.
2. **Typography:** Keep max-width (`max-w-3xl`) for long-form copy, pair uppercase eyebrow (`text-sm tracking-wide text-brand-neutral`) with large H1/H2 headlines.
3. **CTAs:** Primary button (“Talk with our team”) + ghost/link CTA (“Download spec sheet”) per section.
4. **Imagery:** Favor photography of Central Coast fields, growers, and cabs. Use illustration overlays (GNSS lines, telemetry nodes) only in Beta/SaaS sections.
5. **Components:** Reuse `HeroBanner`, `ServiceArea`, `WhyChoose`, `Card`, `Button`, `Separator`, plus iconography from `lucide-react`.

---

## Page Blueprints

### 1. Home (`docs/content-rewrite/home_v2.md`)
**Layout Steps**
1. **Hero:** Two-column hero with left-aligned headline (“Precision Ag Services…”), supporting paragraph, stacked CTA buttons (primary = Contact, secondary = Watch Overview). Right column → looping background video or still of sprayer with GNSS overlay.
2. **Audience Bands (“Who We Serve”):** Three cards in a horizontal scroll on mobile; include icons for growers/dealerships/fleet managers.
3. **Services Carousel:** Use existing `ServiceArea` grid to spotlight six services; include microcopy and CTA chips linking to detail pages.
4. **Beta Highlights:** Two-up cards for AgSupport Platform + RTK+ Network with status pill (“Beta”) and action button (“Join beta list”).
5. **Partners Row:** Logo strip (New Holland, Raven, PTx Trimble, Ecorobotix) on muted surface with `aria-label`.
6. **Why Choose:** Vertical timeline steps 01–04 with icon badges and supporting paragraphs.
7. **About Snippet:** Pull introduction from About page with inline link to full story.
8. **Footer CTA:** Full-width contact block with phone/email, plus form link.

**Imagery & Media**
- Hero: sunrise field drone shot or cab interior.
- Beta cards: abstract network graphic (RTK) and UI mock (AgSupport).
- Partner row: grayscale logos to avoid color clash.

**Content Mapping**
- Copy segments map 1:1 to sections in `home_v2.md` (Service blurbs, Beta descriptions, Trusted Partners, Why Choose, About).

### 2. About Us (`docs/content-rewrite/about_page.md`)
**Layout Steps**
1. **Hero:** Full-width image of family dealership, overlay title “A Legacy Rooted in Farming.”
2. **Origin Story:** Two-column layout: narrative text vs archival photo collage; include timeline (1971 → today).
3. **Why We Exist:** Three icon cards summarizing the bullet list (Trusted Expertise, Partnerships, Local Presence).
4. **Looking Ahead: GNSS Planning:** Highlight block with gradient background, include diagram of GNSS satellites + CTA “Get notified.”
5. **Commitment to Service:** Quote block + stat chips (years in business, locations served).
6. **Visit Us:** Map or cards for Salinas, King City, Paso Robles with address, phone, and “Get directions” link.

**Imagery**
- Use historic photos, store exteriors, GNSS mock.

### 3. Services Landing (new hub)
**Layout Steps**
1. Hero summarizing “Comprehensive solutions for modern agriculture.”
2. Intro paragraph + CTA.
3. **Service Grid:** Six cards (Fleet Telematics, Water Management, Seeding & Rate Control, Application Control, Sprayer Retrofits, AgTech Consulting). Each card → icon, 2-line blurb, “View details” linking to respective detail page.
4. **Process Section:** 3-step process (Assess → Integrate → Support) to explain engagement flow.
5. **CTA Band:** “Not sure where to start? Book a consultation.”

### 4. Service Detail Pages
Use a common scaffold per file in `docs/content-rewrite/services*.md`.

| Page | Steps & Sections | Imagery |
| --- | --- | --- |
| Fleet Telematics | 1) Hero with mixed-fleet dashboard mock; 2) Metrics list (Real-time location etc.) in two-column checklist; 3) “Why it matters” callout; 4) “Perfect for” audience tags; 5) Contact CTA. | Dashboard screenshot, map lines. |
| Water Management & Field Leveling | 1) Hero with leveled field aerial; 2) Deliverables list as icons (survey, modeling, cut-fill); 3) “Why it matters” stats; 4) “Ideal for” chips; 5) Survey CTA. | Topo map overlay. |
| Seeding & Rate Control | 1) Hero of planter detail; 2) Solutions accordion; 3) Benefits list with checkmarks; 4) CTA. | Macro shot of row unit. |
| Application Control | 1) Hero of sprayer in vineyard; 2) Capabilities grid; 3) Use cases; 4) CTA. | Spray nozzle close-up. |
| Sprayer Retrofits | 1) Hero showing retrofit install; 2) “What we install” list; 3) Outcomes; 4) Testimonial slider. | Before/after photo pair. |
| AgTech Consulting & Integrations | 1) Hero with operator + tablet; 2) Services list; 3) Use-case cards; 4) CTA linking to consultation form. | Abstract data flow illustration. |

### 5. Products Landing
**Layout Steps**
1. Hero emphasizing “Multi-brand hardware backed by real field techs.”
2. Product overview paragraph referencing Trimble, Raven, Ecorobotix, RTK+, AgSupport.
3. **Product Cards:** Each card includes logo, short blurb, CTA to detail page.
4. Comparison table (Columns = Product, Use Case, Fleet Fit, Status).
5. CTA linking to contact and dealership partner program.

### 6. Product Detail Pages
Apply consistent structure using content files:

- **Trimble Precision Ag Systems:** Hero + “Solutions we support” icons, compatibility list, CTA.
- **Raven Precision Systems:** Hero + feature list, vineyard-friendly callout, CTA.
- **Ecorobotix ARA:** Hero + capabilities, ideal for, sustainability stat block.
- **Coastal PASS RTK+ (Beta):** Hero with coverage map, What’s Included list, beta status pill, early access form CTA.
- **AgSupport Platform (Beta):** Hero with SaaS UI mock, features roadmap timeline, beta CTA.

### 7. Raven Air Blast Experience (`docs/content-rewrite/raven_page.md`)
**Layout Steps**
1. Immersive hero with Raven sprayer photo; overlay “Reach a new level…”.
2. **Implement Base Kit**: Highlight card with bullet list + wiring diagram.
3. **Tractor Control Options:** Split section featuring CR7 and Viper 4+ cards, each with spec bullets and optional carousel of images.
4. **Connectivity Section:** Field Hub 2.1 explainer with icon row for LTE/Wi-Fi/RTK.
5. **AgSync Dispatch Pro:** Infographic showing workflow; include feature list and advantage list.
6. **CTA Footer:** Contact info + dealership location callout.

### 8. Dealership Partner Program (`docs/content-rewrite/dealers-partner-program.md`)
**Layout Steps**
1. Hero showing dealer handshake, tagline “White-Label Precision Ag Support.”
2. Split section: “What your customers get” vs “What your dealership gets.”
3. Benefits grid (Multi-Brand Mastery, White-Label Everything, Proven Field Experience, Real-Time Availability) using numbered badges.
4. Optional add-ons accordion.
5. Partner CTA with form + phone number.

### 9. Contact Page
**Layout Steps**
1. Hero with quick contact info + hours.
2. Two-column layout: validated `ContactForm` on left, right column with phone, email, social, response-time guarantee.
3. Locations map showing the three offices (reuse About data).
4. FAQ accordion for response expectations, service areas, emergency support.

**Imagery:** Map tile styled to match brand; background photo of support team.

### 10. Privacy Page
**Layout Steps**
1. Hero with document icon, include “Last updated” date.
2. Table of contents (sticky on desktop) linking to sections: Data We Collect, How We Use Data, Sharing & Security, Cookies/Tracking, Your Choices, Contact.
3. Each section uses heading + paragraph + bullet list; include callout for California privacy rights.
4. Final CTA linking to contact for additional questions.

### 11. Supporting CTAs & Footer
- Add global footer CTA encouraging RTK beta signups + dealership inquiries.
- Ensure every page ends with consistent contact block for phone/email.

---

## Implementation Checklist
1. For each page, prototype wireframes (low-fidelity) following steps above.
2. Identify or commission imagery listed per section; add to `/public/images/...`.
3. Update navigation to include dropdowns for Services & Products linking to detail pages.
4. Ensure each section references the exact copy blocks from the corresponding `docs/content-rewrite/*.md` file; adjust only for length/UX.
5. Validate on mobile + desktop, keeping sections under 200 lines of JSX and files under 500 lines as per AGENTS.md.

