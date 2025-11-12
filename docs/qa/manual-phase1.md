# Phase 1 Manual QA

Use this checklist after running automated validation to document manual results and attach screenshots to the PR body.

## Routes & Expected States

1. `/` (desktop + mobile)
   - Hero banner renders CTA buttons (Get In Touch, Watch Video) and opens dialog.
   - Service Area cards show six offerings and partner logos.
   - Why Choose section displays three reasons with correct copy.
2. `/contact`
   - Contact tiles link out correctly (`tel:`, `mailto:`, Maps URL).
   - Contact form validation messages appear for empty submission and success message appears after valid submission.
3. `/privacy`
   - Headings and lists render with Tailwind typography classes; external links open in new tab.
4. `/raven-air-blast`
   - Hero shows kicker/title, imagery, and logos.
   - Tractor option cards display CR7 and Viper 4+ copy.
   - Contact strip links (website/Instagram/phone) are functional.
5. `/auth/callback`
   - Confirmation message appears, with links back to Home and Contact.

## Screenshot Guidance

Capture desktop (≥1280px) and mobile (~375px) for `/`, `/contact`, `/privacy`, `/raven-air-blast`. Include hero + CTA visibility. Attach to PR body along with notes on:

- Hero CTA interaction
- Contact info verification
- Raven CTA links
