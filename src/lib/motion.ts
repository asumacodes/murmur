import { features } from "@/config/features";

export const PREMIUM_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export const motionDefaults = {
  revealDuration: 0.9,
  revealStagger: 0.1,
  revealEase: "power3.out" as const,
  enterY: 48,
};

/** Primary post-Pipeline enter — fires when content is clearly in view. */
export const scrollEnter = {
  start: "top 82%",
  toggleActions: "play none none none" as const,
};

export const scrollEnterSoft = {
  start: "top 86%",
  toggleActions: "play none none none" as const,
};

export const sectionSpyIds = features.studioLog
  ? (["how-it-works", "pipeline", "comparison", "pricing", "studio-log", "faq"] as const)
  : (["how-it-works", "pipeline", "comparison", "pricing", "faq"] as const);

/** All trackable content sections, in page order — analytics drop-off (not nav). */
export const analyticsSectionIds = [
  "how-it-works",
  "pipeline",
  "demo",
  "comparison",
  "pricing",
  ...(features.studioLog ? (["studio-log"] as const) : []),
  "faq",
  "sprintzero",
  "early-access",
] as const;

export const DESKTOP_BREAKPOINT = 1024;
export const desktopMedia = `(min-width: ${DESKTOP_BREAKPOINT}px)`;
export const mobileMedia = `(max-width: ${DESKTOP_BREAKPOINT - 1}px)`;
