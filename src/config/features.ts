export const features = {
  // KAN-51: while true, page.tsx renders <ComingSoon /> instead of the full
  // landing page below. Flip to false when Phase B (KAN-63, real landing
  // with pricing) is ready to ship.
  comingSoon: false,
  studioLog: false,
  artifacts: false, // hide until video / output pass (recordings + GSAP)
} as const;
