# Murmur brand kit (v2.0 · Sep 2026)

Social and share assets for Murmur, built from the same tokens, type and motif as trymurmur.studio. Every asset exists in a **dark** and a **light** edition. v2.0 replaces the v1.1 ink / paper / gold kit.

```
brand/
├── tokens.json            design tokens (mirror of src/app/globals.css; the website is the source of truth)
├── shared/brand.css       tokens, fonts, components (wordmark, CTA pill, labels, URL lockup)
├── shared/brand.js        theme + size params, the five-bar mark, the particle "flock" motif
├── social/*.html          one template per asset
├── render.mjs             renders every template to PNG
└── export/{dark,light}/   the rendered PNGs (commit these)
```

## Render

```bash
npm run brand:render                        # all assets, both editions
npm run brand:render -- --theme light       # one edition
npm run brand:render -- --only end-card     # names containing "end-card"
npm run brand:render -- --theme dark --only og --site-og   # also refresh the site's share image
```

Needs Chromium for playwright-core once: `npx playwright-core install chromium`. Fonts load from Google Fonts at render time.

Open any template directly in a browser to tweak it: `brand/social/end-card.html?theme=light&w=1080&h=1920&cta=signup`.

## Assets

| File | Size | Notes |
|---|---|---|
| `01-brand-avatar-1000x1000` | 1000×1000 | Mark only, ~54% of width. X, LinkedIn, YouTube, GitHub. |
| `02-x-header-1500x500` | 1500×500 | Bottom-left kept clear for the avatar. |
| `03-linkedin-banner-1584x396` | 1584×396 | Copy starts at x=560 (profile photo covers the left). |
| `04-og-1200x630` | 1200×630 | Dark edition is also `src/app/opengraph-image.png` / `twitter-image.png`. |
| `end-card-A-until-1-oct-*` | 1080×1920, 1920×1080 | CTA "Get early access" (waitlist). Use until Oct 1. |
| `end-card-B-from-1-oct-*` | 1080×1920, 1920×1080 | CTA "Get started free". Use from Oct 1. |
| `overlay-caption-sample-*` | 1080×1920, 1920×1080 | Transparent. `?text=` sets the caption; two lines max. |
| `overlay-honesty-label-*` | 1080×1920, 1920×1080 | Transparent. `?text=` **must** state the real run time of the footage. |
| `overlay-hook-sample-*` | 1080×1920, 1920×1080 | Transparent scrim + opening line. `?text=` sets it. |
| `murmur-social-brand-foundations-v2.0` | 1440×auto | The reference sheet: logo, color, type, motif, components, assets, rules. |

Custom text renders: `?text=` accepts simple HTML (`<br />`, `<span class="accent">word</span>`). Example:

```
brand/social/overlay-honesty.html?theme=dark&w=1080&h=1920&text=Real%20run%20%C2%B7%209m%2022s%20%C2%B7%20sped%20up
```

## Rules

1. No generated or recreated product UI. Screens are always real captures from app.trymurmur.studio.
2. No invented numbers, testimonials or customer logos. Every number traces to a real run.
3. Sped-up footage always carries the honesty label with that footage's real run time.
4. No SprintZero branding on Murmur assets.
5. Signal (#FF5A2C dark / #F2481B light) at most once per asset. No gold; the v1 palette is retired.
