# Murmur — www.trymurmur.studio

Marketing site for Murmur (voice memo → project foundation). Next.js 16 App Router, Tailwind v4, GSAP + Lenis, a raw-WebGL particle system (no three.js), PostHog, Resend.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Launch switch: waitlist → Get started

Every primary CTA reads one flag, `NEXT_PUBLIC_CTA_MODE` (`src/config/features.ts`):

| Value | Behaviour |
|---|---|
| `waitlist` (default) | Hero and closer show inline email capture; every other CTA opens the waitlist dialog. Signups go to Resend with attribution packed into the `source` contact property: `location\|role\|tier:x\|ref:<referrer>\|code:<own code>`. |
| `signup` | Every CTA links to the app (`NEXT_PUBLIC_APP_URL`), pricing CTAs carry `?tier=`; a "Sign in" link appears in the header. |

Flip it in Vercel (Production + Preview) and redeploy. No code change.

## Environment

See `.env.example`. New optional vars:

- `REFERRAL_SALT`: salt for waitlist referral codes (defaults to a constant; set once and never change it, or existing links stop matching).
- `WAITLIST_IDEAS_TO`: inbox for the optional post-signup "what would you build first?" note (default `hey@trymurmur.studio`).

## Content

- Home copy: `src/content/home.ts`, `src/content/faq.ts`, `src/content/cta.ts`. Founding copy is canonical in `src/content/founding.ts`.
- Real example runs: `src/content/runs/*.json`, rendered on the home Run Explorer, `/examples` and `/examples/[slug]` (plus per-run OG images, sitemap and llms.txt).
- Adding a run: export the owner-approved run as `{ recording, runs, results }` JSON, then
  `node scripts/curate-run.mjs raw.json <slug> --idea "…" --category "…" --noun "…" --order 5`,
  review the file (trim personal details from the transcript), and add the import in `src/content/runs/index.ts`.
- The founding-seat counter is live from the app's `/api/founding` (proxied at `/api/founding`, cached 2 min). If it's unavailable the chip hides; the site never shows a made-up number.

## Brand kit

Social assets (avatar, X/LinkedIn banners, OG card, video end cards and overlays, the foundations sheet) live in `brand/`, in dark and light editions, rendered from HTML templates with `npm run brand:render`. See `brand/README.md`.

## Analytics (PostHog, explicit events only)

Funnel: `marketing_page_viewed` → `marketing_section_viewed` / `marketing_scroll_depth` → `waitlist_cta_clicked` / `signup_cta_clicked` (`cta_location`) → `waitlist_modal_opened` → `waitlist_form_started` → `waitlist_submitted` (`status`) → `waitlist_joined` → `referral_link_copied` / `referral_shared`.

Engagement: `run_explorer_selected` / `_replayed` / `_opened_full`, `pipeline_stage_viewed`, `example_viewed`, `pricing_tier_clicked`, `faq_opened`, `demo_video_played`, `theme_toggled`, `free_tool_used`, `template_action`, `sprintzero_cta_clicked`.

No emails or typed text are ever sent as event properties.
