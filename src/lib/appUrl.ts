export type AppTier = "starter" | "builder" | "studio" | "payg" | "founding";

// Fallback keeps builds working when the env var is missing (e.g. a Vercel
// environment it hasn't been added to); set NEXT_PUBLIC_APP_URL to override.
const DEFAULT_APP_URL = "https://app.trymurmur.studio";

export function appOrigin(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_URL).replace(/\/$/, "");
}

/** `/?tier=` is read by the app's root route and routed into checkout after login. */
export function appHref(tier?: AppTier): string {
  const base = appOrigin();
  return tier ? `${base}/?tier=${tier}` : base;
}

export function appLoginHref(): string {
  return `${appOrigin()}/login`;
}
