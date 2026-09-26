const FT_COOKIE = "mm_ft"; // first-touch attribution
const COOKIE_DOMAIN = ".trymurmur.studio";
const MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export type FirstTouch = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_path?: string;
};

const REF_KEY = "mm_ref";
const REF_RE = /^[a-z0-9]{6,12}$/;

/** Referral code from ?ref=, kept for the session's waitlist signup. */
export function captureReferral() {
  if (typeof window === "undefined") return;
  const ref = new URLSearchParams(window.location.search).get("ref")?.toLowerCase();
  if (!ref || !REF_RE.test(ref)) return;
  try {
    sessionStorage.setItem(REF_KEY, ref);
  } catch {
    // storage blocked: referral simply isn't attributed
  }
}

export function readReferral(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const ref = sessionStorage.getItem(REF_KEY);
    return ref && REF_RE.test(ref) ? ref : null;
  } catch {
    return null;
  }
}

export function captureFirstTouchOnce() {
  if (typeof window === "undefined") return;
  // already set? never overwrite (set-once semantics)
  if (document.cookie.includes(`${FT_COOKIE}=`)) return;

  const p = new URLSearchParams(window.location.search);
  const hasUtm = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ].some((k) => p.get(k));
  // only record a first touch if there's attribution OR a real external referrer
  const referrer =
    document.referrer && !document.referrer.includes("trymurmur.studio")
      ? document.referrer
      : "";
  if (!hasUtm && !referrer) return;

  const ft: FirstTouch = {
    utm_source: p.get("utm_source") || undefined,
    utm_medium: p.get("utm_medium") || undefined,
    utm_campaign: p.get("utm_campaign") || undefined,
    utm_content: p.get("utm_content") || undefined,
    utm_term: p.get("utm_term") || undefined,
    referrer: referrer || undefined,
    landing_path: window.location.pathname,
  };
  const val = encodeURIComponent(JSON.stringify(ft));
  const domainPart = window.location.hostname.endsWith("trymurmur.studio")
    ? `; domain=${COOKIE_DOMAIN}`
    : "";
  document.cookie = `${FT_COOKIE}=${val}${domainPart}; path=/; max-age=${MAX_AGE}; SameSite=Lax; Secure`;
}

export function readFirstTouch(): FirstTouch | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`${FT_COOKIE}=([^;]+)`));
  if (!m) return null;
  try {
    return JSON.parse(decodeURIComponent(m[1])) as FirstTouch;
  } catch {
    return null;
  }
}
