export const features = {
  // KAN-51: while true, page.tsx renders <ComingSoon /> instead of the full
  // landing page below. Flip to false when Phase B (KAN-63, real landing
  // with pricing) is ready to ship. Do not delete the gated sections —
  // they're built ahead for that phase.
  comingSoon: true,
  studioLog: false,
  caseStudies: false,
  testimonials: false,
  demoVideo: false,
  exactPricing: false,
  comparisonTable: false,
  faq: false,
} as const;
