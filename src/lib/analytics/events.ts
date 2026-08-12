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

export function trackSectionViewed(
  sectionId: string,
  extra?: Record<string, unknown>,
) {
  posthog?.capture("marketing_section_viewed", {
    section_id: sectionId,
    ...extra,
  });
}

export function trackScrollDepth(percent: 25 | 50 | 75 | 100) {
  posthog?.capture("marketing_scroll_depth", {
    depth_percent: percent,
  });
}
