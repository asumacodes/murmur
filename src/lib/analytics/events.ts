import { posthog } from "./posthog-client";

type CtaLocation = "hero" | "footer" | "nav" | "pricing" | "form_submit" | string;

export function trackWaitlistCtaClicked(
  location: CtaLocation,
  extra?: Record<string, unknown>,
) {
  posthog?.capture("waitlist_cta_clicked", {
    cta_location: location,
    ...extra,
  });
}

export function trackSignupCtaClicked(location: CtaLocation) {
  posthog?.capture("signup_cta_clicked", { cta_location: location });
}
