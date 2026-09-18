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

export function appHref(tier?: AppTier): string {
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  if (!origin) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set");
  }
  const base = origin.replace(/\/$/, "");
  if (!tier) {
    return base;
  }
  return `${base}/?tier=${tier}`;
}
