/**
 * The one switch for launch day.
 *
 * - "waitlist": every primary CTA opens the waitlist capture (inline in the
 *   hero, a dialog everywhere else). Signups land in Resend.
 * - "signup":   every primary CTA hands off to the app (app.trymurmur.studio),
 *   carrying the pricing tier when there is one.
 *
 * Flip with NEXT_PUBLIC_CTA_MODE=signup on the Vercel project; no code change.
 */
export type CtaMode = "waitlist" | "signup";

const envMode = process.env.NEXT_PUBLIC_CTA_MODE;

export const ctaMode: CtaMode = envMode === "signup" ? "signup" : "waitlist";

export const features = {
  /** Live founding-seat counter, read from the app's public /api/founding. */
  foundingCounter: true,
} as const;
