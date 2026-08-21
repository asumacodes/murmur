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

export function trackArtifactsStageToggled(stage: "capture" | "artifacts") {
  posthog?.capture("artifacts_stage_toggled", { stage });
}

export function trackArtifactsSurfaceTabbed(
  surface: "brand" | "jira" | "confluence",
) {
  posthog?.capture("artifacts_surface_tabbed", { surface });
}

export function trackPipelineReplayClicked(location: "hero" | string) {
  posthog?.capture("pipeline_replay_clicked", { cta_location: location });
}

export function trackSocialOutboundClicked(
  network: "x" | "youtube" | "github",
  location: "coming_soon" | "footer" | string,
) {
  posthog?.capture("social_outbound_clicked", {
    social_network: network,
    cta_location: location,
  });
}

export function trackDemoDeviceToggled(device: "desktop" | "mobile") {
  posthog?.capture("demo_device_toggled", { device });
}

export function trackDemoVideoPlayed(device: "desktop" | "mobile") {
  posthog?.capture("demo_video_played", { device });
}
