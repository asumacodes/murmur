import { initPostHog, posthog } from "./posthog-client";

/**
 * Explicit marketing events only (autocapture is off). Never put an email,
 * name, or free text a visitor typed into an event property.
 *
 * Funnel, in order:
 *   marketing_page_viewed → marketing_section_viewed → *_cta_clicked
 *   → waitlist_modal_opened → waitlist_form_started → waitlist_submitted
 *   → waitlist_joined → referral_link_copied / referral_shared
 */

type CtaLocation =
  | "hero"
  | "nav"
  | "nav_mobile"
  | "sticky_mobile"
  | "run_explorer"
  | "how_it_works"
  | "pipeline"
  | "comparison"
  | "pricing"
  | "faq"
  | "closer"
  | "footer"
  | "example_page"
  | "tool_page"
  | "template_page"
  | "compare_page"
  | (string & {});

function capture(event: string, props?: Record<string, unknown>) {
  // Child effects run before the provider's init effect, so make sure the
  // client exists before the very first event (the pageview).
  initPostHog();
  posthog?.capture(event, props);
}

export function trackPageViewed(path: string, extra?: Record<string, unknown>) {
  capture("marketing_page_viewed", { path, ...extra });
}

export function trackWaitlistCtaClicked(location: CtaLocation, extra?: Record<string, unknown>) {
  capture("waitlist_cta_clicked", { cta_location: location, ...extra });
}

export function trackSignupCtaClicked(location: CtaLocation, extra?: Record<string, unknown>) {
  capture("signup_cta_clicked", { cta_location: location, ...extra });
}

export function trackWaitlistModalOpened(location: CtaLocation, extra?: Record<string, unknown>) {
  capture("waitlist_modal_opened", { cta_location: location, ...extra });
}

/** Once per page load, on the first keystroke in any waitlist email field. */
export function trackWaitlistFormStarted(location: CtaLocation) {
  capture("waitlist_form_started", { cta_location: location });
}

export function trackWaitlistSubmitted(
  location: CtaLocation,
  status: "success" | "duplicate" | "error",
  extra?: Record<string, unknown>,
) {
  capture("waitlist_submitted", { cta_location: location, status, ...extra });
}

export function trackWaitlistJoined(location: CtaLocation, extra?: Record<string, unknown>) {
  capture("waitlist_joined", { cta_location: location, ...extra });
}

export function trackWaitlistIdeaShared(length: number) {
  capture("waitlist_idea_shared", { idea_length_bucket: length < 80 ? "short" : length < 280 ? "medium" : "long" });
}

export function trackReferralLinkCopied(location: CtaLocation) {
  capture("referral_link_copied", { cta_location: location });
}

export function trackReferralShared(network: "x" | "linkedin" | "whatsapp" | "native", location: CtaLocation) {
  capture("referral_shared", { network, cta_location: location });
}

export function trackSectionViewed(sectionId: string, extra?: Record<string, unknown>) {
  capture("marketing_section_viewed", { section_id: sectionId, ...extra });
}

export function trackScrollDepth(percent: 25 | 50 | 75 | 100) {
  capture("marketing_scroll_depth", { depth_percent: percent });
}

export function trackRunExplorerSelected(slug: string, method: "click" | "auto" | "keyboard") {
  capture("run_explorer_selected", { run_slug: slug, method });
}

export function trackRunExplorerReplayed(slug: string) {
  capture("run_explorer_replayed", { run_slug: slug });
}

export function trackRunExplorerOpenedFull(slug: string) {
  capture("run_explorer_opened_full", { run_slug: slug });
}

export function trackRunScreenViewed(slug: string, screen: string) {
  capture("run_screen_viewed", { run_slug: slug, screen });
}

export function trackExampleViewed(slug: string) {
  capture("example_viewed", { run_slug: slug });
}

export function trackExampleTabChanged(slug: string, tab: string) {
  capture("example_tab_changed", { run_slug: slug, tab });
}

export function trackThemeToggled(theme: "light" | "dark") {
  capture("theme_toggled", { theme });
}

export function trackPipelineStageViewed(stage: string, index: number) {
  capture("pipeline_stage_viewed", { stage, index });
}

export function trackPricingTierClicked(tier: string, mode: "waitlist" | "signup") {
  capture("pricing_tier_clicked", { tier, cta_mode: mode });
}

export function trackFaqOpened(question: string) {
  capture("faq_opened", { question });
}

export function trackVideoOpened(device: "desktop" | "mobile") {
  capture("demo_video_played", { device });
}

export function trackSprintZeroCtaClicked(location: CtaLocation = "sprintzero_band") {
  capture("sprintzero_cta_clicked", { cta_location: location });
}

export function trackSocialOutboundClicked(network: "x" | "youtube" | "github", location: CtaLocation) {
  capture("social_outbound_clicked", { social_network: network, cta_location: location });
}

export function trackToolUsed(tool: string, extra?: Record<string, unknown>) {
  capture("free_tool_used", { tool, ...extra });
}

export function trackTemplateAction(template: string, action: "copy" | "download") {
  capture("template_action", { template, action });
}
