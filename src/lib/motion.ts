import { features } from "@/config/features";

export const PREMIUM_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export const motionDefaults = {
  revealDuration: 0.85,
  revealStagger: 0.08,
  revealEase: "power3.out" as const,
  enterY: 18,
};

export const scrollEnter = {
  start: "top 80%",
  toggleActions: "play none none none" as const,
};

export const scrollEnterSoft = {
  start: "top 85%",
  toggleActions: "play none none none" as const,
};

export const sectionSpyIds = features.studioLog
  ? (["how-it-works", "pipeline", "packs", "studio-log"] as const)
  : (["how-it-works", "pipeline", "packs"] as const);

export const DESKTOP_BREAKPOINT = 1024;
export const desktopMedia = `(min-width: ${DESKTOP_BREAKPOINT}px)`;
export const mobileMedia = `(max-width: ${DESKTOP_BREAKPOINT - 1}px)`;
