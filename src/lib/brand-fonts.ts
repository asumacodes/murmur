import { Fraunces, Inter, Space_Grotesk } from "next/font/google";

/**
 * The typefaces the public example runs' brand kits chose. Loaded without
 * preload: the browser only fetches one when a brand card actually uses it.
 */
const fraunces = Fraunces({ subsets: ["latin"], preload: false, display: "swap", variable: "--bf-fraunces" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], preload: false, display: "swap", variable: "--bf-space" });
const inter = Inter({ subsets: ["latin"], preload: false, display: "swap", variable: "--bf-inter" });

export const brandFontVars = `${fraunces.variable} ${spaceGrotesk.variable} ${inter.variable}`;

const families: Record<string, string> = {
  fraunces: "var(--bf-fraunces), Georgia, serif",
  "space grotesk": "var(--bf-space), 'Helvetica Neue', Arial, sans-serif",
  inter: "var(--bf-inter), 'Helvetica Neue', Arial, sans-serif",
};

export function brandFontFamily(name: string | undefined) {
  if (!name) return undefined;
  return families[name.trim().toLowerCase()];
}
