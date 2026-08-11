export const comingSoon = {
  brand: "Murmur",
  headline: "Speak. Structure. Handoff.",
  subhead: "Voice → a complete project foundation under 10 minutes.",
  differentiation:
    "Not another AI dashboard. An agentic pipeline that does the founder-ops work (research, PRD, brand, board) while you talk.",
  /** Display as ALL CAPS in the UI */
  status: "Coming soon.",
  statusDisplay: "COMING SOON",
  social: {
    x: {
      label: "Follow on X",
      href: "https://x.com/trymurmurhq",
    },
    youtube: {
      label: "Watch on YouTube",
      href: "https://www.youtube.com/@trymurmurhq",
    },
  },
  notify: {
    placeholder: "you@studio.com",
    cta: "Notify me",
    footnote: "One welcome email now, then only what matters. Unsubscribe anytime.",
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
