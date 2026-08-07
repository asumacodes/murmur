import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!key) return; // no-op if unconfigured (e.g. local without env)

  posthog.init(key, {
    api_host: host,
    // --- cross-property seam (Phase 2) ---
    cross_subdomain_cookie: true, // cookie readable on www + app (.trymurmur.studio)
    persistence: "localStorage+cookie",
    // --- anonymization posture (Phase 2) ---
    person_profiles: "identified_only", // no profile for anonymous traffic
    autocapture: false, // no DOM/PII scraping; events are explicit only
    capture_pageview: false, // we fire marketing_page_viewed manually
    capture_pageleave: true, // needed for bounce/duration in funnels
    disable_session_recording: true,
    disable_surveys: true,
    // Under identified_only, PostHog does not persist $initial_* on anonymous
    // persons. Durable first-touch UTMs live in mm_ft via first-touch.ts;
    // Step 2 feeds them into identify() $set_once after auth.
  });
  initialized = true;
}

export { posthog };
