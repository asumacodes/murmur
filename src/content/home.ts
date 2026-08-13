export const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Compare", href: "#comparison" },
  { label: "Pricing", href: "#pricing" },
  { label: "Studio log", href: "#studio-log" },
  { label: "FAQ", href: "#faq" },
];

export const pipelineLabels = [
  { numeral: "i.", label: "VOICE" },
  { numeral: "ii.", label: "RESEARCH" },
  { numeral: "iii.", label: "PRD" },
  { numeral: "iv.", label: "BRAND" },
  { numeral: "v.", label: "SHIPPED" },
];

export const howItWorks = [
  {
    number: "01",
    label: "Voice in",
    headline: "You open Listener. Tap once. Talk for five minutes.",
    body: "No prompts. No fields. No structure to figure out. Speak the idea as if explaining it to a friend at a kitchen table.",
    artifact: "Recording",
  },
  {
    number: "02",
    label: "Transcription",
    headline: "Your voice becomes structured text in seconds.",
    body: "Speaker turns, punctuation, paragraph breaks. Clean transcript in, clean transcript out. It's what the rest of the pipeline reads.",
    artifact: "Transcript",
  },
  {
    number: "03",
    label: "Research",
    headline: "Exa searches the web for competitors, prior art, and market signal. You get a brief, not a hallucination.",
    body: "Real URLs. Real snippets. Each finding cited and dated. The PRD agent reads this before it writes a word.",
    artifact: "Market signal",
  },
  {
    number: "04",
    label: "Project foundation",
    headline: "Claude writes the PRD. A brand identity is generated. Jira board and Confluence space scaffold themselves.",
    body: "Four specialists, four typed schemas, one validated handoff per agent. The output is what a small studio would produce in a week.",
    artifact: "PRD + brand + Jira",
  },
  {
    number: "05",
    label: "Ship it with SprintZero",
    headline: "When the foundation is ready to become working software, SprintZero Studio takes it from there.",
    body: "Murmur ends where automation ends. Turning the PRD, board, and brand into a shipped landing page, MVP, or full build is human-led studio work, delivered in 72-hour sprints.",
    artifact: "Handoff",
  },
];

export const pipelineNodes = [
  { name: "Listener", role: "PWA Capture", level: 0 },
  { name: "Transcription", role: "Structured Text", level: 0 },
  { name: "Exa", role: "Market Research", level: 0 },
  { name: "Claude / PRD Agent", role: "Zod Schema", level: 0 },
  { name: "Brand Agent", role: "Identity Kit", level: 1 },
  { name: "Jira Generator", role: "Epics + Stories", level: 1 },
  { name: "Confluence Generator", role: "Space + Pages", level: 1 },
];

export const pipelineNodeOutputs = [
  "→ Voice capture session",
  "→ Structured transcript",
  "→ Competitive brief",
  "→ Validated PRD schema",
  "→ Brand identity kit",
  "→ Jira epics + stories",
  "→ Confluence space scaffold",
];

export const pipelineNodeBodies = [
  "Speak once. Murmur captures your voice in one tap: no uploads to fumble, no prompt wrangling, no leaving your flow.",
  "Speech becomes structured text: speaker turns, punctuation, paragraph breaks. The transcript is what the pipeline reads.",
  "Live web search for competitors and prior art. Citations you can open, not invented market research.",
  "One agent turns the memo into a typed PRD, validated against a Zod schema before anything downstream runs.",
  "Palette, typography, and voice pulled from the spec, not a generic mood board.",
  "Epics and stories generated from the PRD. The backlog follows the product, not reverse-engineered docs.",
  "Confluence space and pages scaffolded to mirror the PRD structure your team can fill in.",
];

export type PipelineIllustration =
  | "capture"
  | "transcript"
  | "research"
  | "schema"
  | "parallel"
  | "brand"
  | "jira"
  | "confluence";

export const pipelineNodeIllustrations: PipelineIllustration[] = [
  "capture",
  "transcript",
  "research",
  "schema",
  "brand",
  "jira",
  "confluence",
];

export const pipelineRailSteps = [
  { step: "01", label: "Voice" },
  { step: "02", label: "Transcription" },
  { step: "03", label: "Research" },
  { step: "04", label: "PRD" },
  { step: "05", label: "Brand · Jira · Confluence" },
] as const;

export type PipelineStage = {
  step: string;
  title: string;
  role: string;
  output: string;
  body: string;
  glowTarget: number | "hub";
};

export const pipelineStages: PipelineStage[] = [
  {
    step: "01",
    title: "Listener",
    role: "PWA Capture",
    output: "→ Voice capture session",
    body: "Speak once. Murmur captures your voice in one tap: no uploads to fumble, no prompt wrangling, no leaving your flow.",
    glowTarget: 0,
  },
  {
    step: "02",
    title: "Transcription",
    role: "Transcription",
    output: "→ Structured transcript",
    body: "Speech becomes structured text: speaker turns, punctuation, paragraph breaks. The transcript is what the pipeline reads.",
    glowTarget: 1,
  },
  {
    step: "03",
    title: "Exa",
    role: "Market Research",
    output: "→ Competitive brief",
    body: "Live web search for competitors and prior art. Citations you can open, not invented market research.",
    glowTarget: 2,
  },
  {
    step: "04",
    title: "Claude / PRD Agent",
    role: "Zod Schema",
    output: "→ Validated PRD schema",
    body: "One agent turns the memo into a typed PRD, validated against a Zod schema before anything downstream runs.",
    glowTarget: 3,
  },
  {
    step: "05–07",
    title: "Parallel agents",
    role: "PRD Fans Out",
    output: "→ Brand · Jira · Confluence",
    body: "The PRD fans out to three specialists at once: brand identity, Jira board, and Confluence space, generated in parallel.",
    glowTarget: "hub",
  },
];

export type PackFeature =
  | string
  | {
      text: string;
      bold?: boolean;
    };

export type Pack = {
  name: string;
  subtitle?: string;
  priceAmount: string;
  priceUnit: string;
  idealFor?: string;
  features: PackFeature[];
  cta: string;
  tag?: string;
  footnote?: string;
  featured?: boolean;
};

export const packs: Pack[] = [
  {
    name: "Starter",
    subtitle: "Validate a few ideas at a time.",
    priceAmount: "$19",
    priceUnit: "/ month",
    idealFor: "Founders validating a few ideas at a time",
    features: [
      { text: "5 ideas / month", bold: true },
      "1-month retention",
      "Top-up at $5 / idea",
      "USD, no rollover. Monthly reset",
    ],
    cta: "Join the waitlist →",
    featured: true,
  },
  {
    name: "Builder",
    subtitle: "For serial builders and small teams.",
    priceAmount: "$49",
    priceUnit: "/ month",
    idealFor: "Serial builders and small teams shipping regularly",
    features: [
      { text: "15 ideas / month", bold: true },
      "6-month retention",
      "Top-up at $4 / idea",
    ],
    cta: "Join the waitlist →",
    tag: "Popular",
  },
  {
    name: "Studio",
    subtitle: "For agencies pitching clients at volume.",
    priceAmount: "$79",
    priceUnit: "/ month",
    idealFor: "Agencies and studios pitching clients at volume",
    features: [
      { text: "30 ideas / month", bold: true },
      "6-month retention",
      "Top-up at $3 / idea",
    ],
    cta: "Join the waitlist →",
    tag: "For agencies",
  },
];

// Presented prominently alongside the tiers as the no-commitment entry —
// not buried. KAN-49: the answer for anyone who balks at a subscription.
export const paygEntry = {
  priceAmount: "$7",
  priceUnit: "/ idea",
  label: "Pay as you go",
  description:
    "One idea, no subscription. The no-commitment way in. Three PAYG ideas cost more than Starter and deliver fewer. The upgrade math is deliberately obvious.",
} as const;

export const foundingReward = {
  eyebrow: "Founding members",
  headline: "First 50 subscribers get double the ideas, for a year.",
  body:
    "When Murmur opens, the first 50 people to subscribe get double their tier's idea allowance, for a year. Join the waitlist to be ready when that window opens.",
} as const;

// Full-width band below the tier cards. The ONLY Contact Sales surface —
// Studio is fully self-serve and never sits behind Contact Sales.
export const sprintZeroBand = {
  eyebrow: "From foundation to shipped",
  headline: "Want to turn your Murmur artifacts into real, working software?",
  body: "Murmur turns your idea into a complete project foundation. SprintZero Studio turns that foundation into shipped software: landing page, MVP, or full product build, in 72-hour sprints.",
  cta: "Contact SprintZero",
  ctaHref: "https://sprint0.trymurmur.studio",
  responsePromise: "We reply to every enquiry within one business day.",
} as const;

export const stackLayers = [
  {
    label: "Intelligence",
    tools: [
      { name: "Claude", note: "PRD + agent reasoning" },
      { name: "AssemblyAI", note: "Speech to text" },
      { name: "Exa", note: "Market research" },
    ],
  },
  {
    label: "Orchestration",
    tools: [
      { name: "n8n", note: "Self-hosted workflows" },
      { name: "Atlassian", note: "Jira + Confluence" },
    ],
  },
  {
    label: "Ship stack",
    tools: [
      { name: "Next.js", note: "App shell" },
      { name: "Supabase", note: "Auth + data" },
      { name: "Vercel", note: "Hosting" },
    ],
  },
  {
    label: "Infrastructure",
    tools: [
      { name: "Cloudflare", note: "DNS + edge" },
      { name: "Resend", note: "Transactional email" },
      { name: "PostHog", note: "Product analytics" },
      { name: "DigitalOcean", note: "Pipeline compute" },
    ],
  },
] as const;

export const comparison = {
  eyebrow: "Murmur vs. by hand",
  headline: "The same foundation. One afternoon versus one tap.",
  subhead:
    "By hand is a day of context-switching. Murmur runs the same work in parallel and hands you coherent artifacts.",
  manualLabel: "By hand",
  murmurLabel: "With Murmur",
  rows: [
    {
      dimension: "Getting started",
      manual: "Blank doc, blank board. Stare.",
      murmur: "Talk for five minutes. That's the input.",
    },
    {
      dimension: "The PRD",
      manual: "Write it, rewrite the structure, rewrite again.",
      murmur: "Typed PRD, schema-validated before anything runs.",
    },
    {
      dimension: "Market research",
      manual: "Twenty tabs, half stale, none cited.",
      murmur: "Competitive brief with citations you can open.",
    },
    {
      dimension: "Brand",
      manual: "Mood board now, fix later (you won't).",
      murmur: "Palette, type, and voice from the spec.",
    },
    {
      dimension: "The backlog",
      manual: "Reverse-engineer epics from the doc.",
      murmur: "Jira epics and stories from the PRD, in your tenant.",
    },
    {
      dimension: "The workspace",
      manual: "Set up Confluence before you've written a word.",
      murmur: "Space scaffolded to mirror the PRD.",
    },
    {
      dimension: "How long",
      manual: "An afternoon across five tools.",
      murmur: "Under ten minutes, start to foundation.",
    },
  ],
} as const;

export const waitlistSection = {
  eyebrow: "Join the waitlist",
  headline: "Be early.",
  description:
    "Murmur is being built carefully. Join the waitlist and you'll be first in when it opens. No date promised, no spam.",
  placeholder: "you@studio.com",
  cta: "Reserve a seat →",
  footnote: "One welcome email now, then only what matters. Unsubscribe anytime.",
} as const;

export const studioLog = [
  {
    date: "2026 · MAY · 18",
    dateTime: "2026-05-18",
    title: "Phase 0 - Pipeline wiring",
    duration: "Build note",
    action: "View",
    href: "#pipeline",
    description: "The current build map: Listener intake, transcription, research, PRD, brand, Jira, and Confluence.",
  },
  {
    date: "2026 · MAY · 11",
    dateTime: "2026-05-11",
    title: "PRD agent + Zod schema pass",
    duration: "Build note",
    action: "View",
    href: "#how-it-works",
    description: "What has to be true before Murmur can call an output validated: typed fields, source notes, pack boundaries, and human-readable handoff docs.",
  },
  {
    date: "2026 · MAY · 04",
    dateTime: "2026-05-04",
    title: "Listener PWA prototype",
    duration: "Build note",
    action: "View",
    href: "#top",
    description: "The voice-in surface is intentionally small: one tap, then a clean handoff into the orchestration layer.",
  },
];

export const footerLinks = {
  product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Pipeline", href: "#pipeline" },
    { label: "Pricing", href: "#pricing" },
  ],
  studio: [
    { label: "Log", href: "#studio-log" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Roadmap", href: "#pipeline" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};
