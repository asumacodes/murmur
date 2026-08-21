export type DemoDevice = "desktop" | "mobile";

export const DEMO_DEVICES: readonly DemoDevice[] = ["desktop", "mobile"] as const;

export const demo = {
  eyebrow: "See a real run",
  titleLine1: "Watch it happen.",
  titleLine2: "On both screens.",
  subhead:
    "The same idea, captured on mobile and delivered to your desktop workspace: real footage, not a mockup.",
  disclaimer: "Wait time trimmed · real runs take about six minutes",
  fullRunHref: "https://www.youtube.com/watch?v=wrxiuiyw1IM",
  devices: {
    desktop: {
      label: "Desktop",
      frameLabel: "Murmur · Desktop",
      videoId: "oDebXh0MFBQ",
      poster: "https://img.youtube.com/vi/oDebXh0MFBQ/maxresdefault.jpg",
      crop: false,
    },
    mobile: {
      label: "Mobile",
      frameLabel: "Listener · iPhone",
      videoId: "otd8jbBQTmg",
      poster: "https://img.youtube.com/vi/otd8jbBQTmg/maxresdefault.jpg",
      crop: true,
    },
  },
} as const;
