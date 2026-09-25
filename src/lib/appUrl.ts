import type { Pack } from "@/content/home";

export type AppTier = "starter" | "builder" | "studio" | "payg" | "founding";

const PACK_TO_TIER = {
  Starter: "starter",
  Builder: "builder",
  Studio: "studio",
} as const satisfies Record<Pack["name"], AppTier>;

export function packToTier(name: Pack["name"]): AppTier {
  return PACK_TO_TIER[name];
}

// Fallback keeps builds working when the env var is missing (e.g. a Vercel
// environment it hasn't been added to); set NEXT_PUBLIC_APP_URL to override.
const DEFAULT_APP_URL = "https://app.trymurmur.studio";

export function appHref(tier?: AppTier): string {
  const origin = process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_URL;
  const base = origin.replace(/\/$/, "");
  if (!tier) {
    return base;
  }
  return `${base}/?tier=${tier}`;
}
