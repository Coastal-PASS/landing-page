# CoastalPASS Tailwind Theme Mapping

Use this cheat sheet while replacing the legacy Bootstrap/SCSS bundle with Tailwind + shadcn/ui. All values come directly from `public/assets/scss/global/_global.scss`, `_common.scss`, `_extra.scss`, `_section-title.scss`, and `_service.scss`.

## Color Tokens

| Legacy Token / Selector | Hex Value | Tailwind Token to Add (theme.extend.colors) | Usage Notes |
| --- | --- | --- | --- |
| `--main-color` | `#0c2c94` | `brand.primary` | Buttons, headings, icon borders, nav links (`.sub-title-nh-blue`, `.single-service-inner-3` borders). |
| `--main-color2` | `#f5c400` | `brand.accent` | Secondary CTAs, icon borders, badges. |
| `--main-color3` (new) | `#8ea1c6` | `brand.highlight` | Metallic glows, link hovers, subtle gradients. |
| `--main-color4` (warm gray) | `#6c7484` | `brand.neutral` / `brand.body` | Paragraph copy, subtitles, icon captions. |
| `--main-color5` (wash) | `#dfe7f7` | `brand.wash` / `surface.muted` | Section backgrounds and gradient end stops. |
| `--main-color6` (alert) | `#c75c02` | `brand.destructive` | Validation errors, destructive buttons. |
| `--heading-color` | `#101a29` | `brand.heading` | Default `text-brand-heading`. |
| `.bg-gray` (`_extra.scss:812`) | `#dfe7f7` | `surface.muted` | Sections with light panels (ServiceArea pill). |
| `.service-area.single-service-inner-3:hover` background | `#6c7484` | `surface.deep` / `brand.neutral` | Use for hover states to retain dark slate behavior. |

### Font + Typography

- Base font: `Plus Jakarta Sans`, weight 400–700 (`public/assets/scss/global/_variables.scss`).
- Body font size: `16px` ⇒ Tailwind `text-base`.
- Heading color uses `--heading-color`; default letter spacing normal.

## Spacing Scale (Padding/Margin Helpers)

From `_common.scss:964-1010`. Add custom spacing keys so legacy sections map 1:1:

| Utility | px | rem | Tailwind key suggestion |
| --- | --- | --- | --- |
| `.pd-top-60` / `.pd-bottom-60` | 60 | 3.75 | `spacing.15` |
| `.pd-top-90` / `.pd-bottom-90` | 90 | 5.625 | `spacing.22` |
| `.pd-top-100` / `.pd-bottom-100` | 100 | 6.25 | `spacing.25` |
| `.pd-top-110` / `.pd-bottom-110` | 110 | 6.875 | `spacing.27` |
| `.pd-top-115` / `.pd-bottom-115` | 115 | 7.1875 | `spacing.28` |
| `.pd-top-120` / `.pd-bottom-120` | 120 | 7.5 | `spacing.30` |
| `.pd-top-200` | 200 | 12.5 | `spacing.50` |
| `.mg-top-120` / `.mg-bottom-120` | 120 | 7.5 | `spacing.30` |
| `.mg-top--82` | -100 (per comment) | -6.25 | use negative margin `-space-25`. |

Represent these in `tailwind.config.ts`:

```ts
extend: {
  spacing: {
    15: "3.75rem",
    22: "5.625rem",
    25: "6.25rem",
    27: "6.875rem",
    28: "7.1875rem",
    30: "7.5rem",
    50: "12.5rem",
    "-25": "-6.25rem",
  },
}
```

## Component Pattern Notes

- **Section Title (`_section-title.scss`)**: `.sub-title-nh-blue` is uppercase text with `color: #0c2c94`. Recreate via `text-brand-primary uppercase tracking-wide font-semibold`.
- **Service Cards (`_service.scss:163-210`)**: left/right variants rely on absolute-positioned circular icon at ±40px. Rebuild using CSS grid + `before`/`after` or flex gap to avoid manual transforms.
- **Why Choose list (`_about.scss:239`)**: `.count` uses large numerals + `color-base`. Use stacked flex with `text-4xl font-semibold text-brand-primary`.
- **Hero overlay**: `.banner-area .overlay` uses `background: rgba(10, 24, 81, 0.5)`; replicate via `after` pseudo or `bg-brand-primary/50`.

## Assets to Preserve

- Logos under `public/assets/img/ct/*.png`.
- Raven brochure assets under `public/assets/img/raven-brocure/*`.
- Contact icons under `public/assets/img/icon/*.svg`.

## Migration Checklist

1. Populate `tailwind.config.ts` `theme.extend` with `colors`, `fontFamily`, `spacing`, `boxShadow` token lists above.
2. Replace `.bg-gray`, `.sub-title-nh-blue`, `.single-service-inner-3`, `.why-choose-us-list` usages with Tailwind utilities referencing the new tokens.
3. Drop `src/app/globals.scss` once `src/styles/tailwind.css` imports Tailwind layers plus the CSS custom properties that still need to exist (fonts + root variables for compatibility).
4. Use shadcn `Card`, `Button`, `Separator`, and `Sheet` components for structural consistency instead of recreating from scratch.

Keep this file in the PRP context to avoid reverse-engineering SCSS mid-implementation.
