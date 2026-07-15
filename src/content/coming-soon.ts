export const comingSoon = {
  brand: "Murmur",
  headline: "Speak. Transcribe. Ship.",
  subhead: "Voice → a complete project foundation in about six minutes.",
  differentiation:
    "Not another AI dashboard. An agentic pipeline that does the founder-ops work — research, PRD, brand, board — while you talk.",
  /** Display as ALL CAPS with em dash in the UI */
  status: "Coming soon. Building in public the whole way.",
  statusDisplay: "COMING SOON — BUILDING IN PUBLIC THE WHOLE WAY",
  social: {
    x: {
      label: "Follow on X",
      href: "https://x.com/AsumaCodes",
    },
    youtube: {
      label: "Watch on YouTube",
      href: "https://www.youtube.com/@AsumaCodes",
    },
  },
  notify: {
    placeholder: "you@studio.com",
    cta: "Notify me",
    footnote: "No spam. No drip. Just one email, when it's live.",
    success: "You're on the list.",
    alreadySubscribed: "You're already on the list.",
    error: "Something went wrong. Try again.",
  },
  footer: {
    privacy: { label: "Privacy", href: "/privacy" },
    terms: { label: "Terms", href: "/terms" },
    // Placeholder inbox — replace once a real address exists
    contact: "hello@trymurmur.studio",
  },
} as const;
