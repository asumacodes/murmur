export const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Packs", href: "#packs" },
  { label: "Studio log", href: "#studio-log" },
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
    headline: "Whisper runs locally. Your voice becomes structured text — privately, in seconds.",
    body: "Speaker turns, punctuation, paragraph breaks. The audio never leaves your machine. The transcript is what the pipeline reads.",
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
    label: "Scaffold & deploy — optional",
    headline: "For Pack B and C: a Next.js + Supabase repo lands in your hands. For Pack C: it's live before you close the tab.",
    body: "Auth wired. Database typed. Vercel preview URL. The scaffold matches the PRD schema, not a generic template.",
    artifact: "Deploy",
  },
];

export const pipelineNodes = [
  { name: "Listener", role: "PWA Capture", level: 0, pack: "A" },
  { name: "Whisper", role: "Transcription", level: 0, pack: "A" },
  { name: "Exa", role: "Market Research", level: 0, pack: "A" },
  { name: "Claude / PRD Agent", role: "Zod Schema", level: 0, pack: "A" },
  { name: "Brand Agent", role: "Identity Kit", level: 1, pack: "A" },
  { name: "Jira Generator", role: "Epics + Stories", level: 1, pack: "A" },
  { name: "Confluence Generator", role: "Space + Pages", level: 1, pack: "A" },
  { name: "Engineering Agent", role: "Scaffold Spec", level: 1, pack: "B" },
  { name: "Next.js + Supabase", role: "Repo", level: 0, pack: "B" },
  { name: "Vercel Deploy", role: "Staging Deploy", level: 0, pack: "C" },
];

export const pipelineNodeOutputs = [
  "→ On-device capture session",
  "→ Structured transcript",
  "→ Competitive brief",
  "→ Validated PRD schema",
  "→ Brand identity kit",
  "→ Jira epics + stories",
  "→ Confluence space scaffold",
  "→ Engineering scaffold spec",
  "→ Next.js + Supabase repo",
  "→ Staging deploy URL",
];

export const pipelineNodeBodies = [
  "Speak once. Murmur captures on-device — no uploads, no prompt wrangling, no leaving your flow.",
  "Speech becomes structured text on your machine. Whisper transcribes before anything crosses the wire.",
  "Live web search for competitors and prior art. Citations you can open — not invented market research.",
  "One agent turns the memo into a typed PRD, validated against a Zod schema before anything downstream runs.",
  "Palette, typography, and voice pulled from the spec — not a generic mood board.",
  "Epics and stories generated from the PRD. The backlog follows the product, not reverse-engineered docs.",
  "Confluence space and pages scaffolded to mirror the PRD structure your team can fill in.",
  "Repo boundaries and scaffold spec defined before Pack B writes application code.",
  "A typed Next.js + Supabase repo aligned to the PRD — auth, schema, and brand tokens wired in.",
  "A preview URL on Vercel before you close the tab. Staged, not a localhost demo.",
];

export type PipelineIllustration =
  | "capture"
  | "transcript"
  | "research"
  | "schema"
  | "parallel"
  | "brand"
  | "jira"
  | "confluence"
  | "engineering"
  | "repo"
  | "deploy";

export const pipelineNodeIllustrations: PipelineIllustration[] = [
  "capture",
  "transcript",
  "research",
  "schema",
  "brand",
  "jira",
  "confluence",
  "engineering",
  "repo",
  "deploy",
];

export const pipelineRailSteps = [
  { step: "01", label: "Voice" },
  { step: "02", label: "Transcription" },
  { step: "03", label: "Research" },
  { step: "04", label: "PRD" },
  { step: "05", label: "Brand · Jira · Confluence" },
  { step: "06", label: "Scaffold" },
  { step: "07", label: "Deploy" },
] as const;

export type PipelineStage = {
  step: string;
  title: string;
  role: string;
  pack: string;
  output: string;
  body: string;
  glowTarget: number | "hub";
};

export const pipelineStages: PipelineStage[] = [
  {
    step: "01",
    title: "Listener",
    role: "PWA Capture",
    pack: "A",
    output: "→ On-device capture session",
    body: "Speak once. Murmur captures on-device — no uploads, no prompt wrangling, no leaving your flow.",
    glowTarget: 0,
  },
  {
    step: "02",
    title: "Whisper",
    role: "Transcription",
    pack: "A",
    output: "→ Structured transcript",
    body: "Speech becomes structured text on your machine. Whisper transcribes before anything crosses the wire.",
    glowTarget: 1,
  },
  {
    step: "03",
    title: "Exa",
    role: "Market Research",
    pack: "A",
    output: "→ Competitive brief",
    body: "Live web search for competitors and prior art. Citations you can open — not invented market research.",
    glowTarget: 2,
  },
  {
    step: "04",
    title: "Claude / PRD Agent",
    role: "Zod Schema",
    pack: "A",
    output: "→ Validated PRD schema",
    body: "One agent turns the memo into a typed PRD, validated against a Zod schema before anything downstream runs.",
    glowTarget: 3,
  },
  {
    step: "05–08",
    title: "Parallel agents",
    role: "PRD Fans Out",
    pack: "A · B",
    output: "→ Brand · Jira · Confluence · Scaffold spec",
    body: "The PRD fans out to four specialists at once — brand, Jira, Confluence, and engineering scaffold in parallel.",
    glowTarget: "hub",
  },
  {
    step: "09",
    title: "Next.js + Supabase",
    role: "Repo",
    pack: "B",
    output: "→ Next.js + Supabase repo",
    body: "A typed Next.js + Supabase repo aligned to the PRD — auth, schema, and brand tokens wired in.",
    glowTarget: 8,
  },
  {
    step: "10",
    title: "Vercel Deploy",
    role: "Staging Deploy",
    pack: "C",
    output: "→ Staging deploy URL",
    body: "A preview URL on Vercel before you close the tab. Staged, not a localhost demo.",
    glowTarget: 9,
  },
];

export type PackFeature =
  | string
  | {
      text: string;
      bold?: boolean;
    };

export type Pack = {
  letter: string;
  name: string;
  subtitle?: string;
  priceAmount: string;
  priceUnit: string;
  priceNote?: string;
  features: PackFeature[];
  cta: string;
  tag?: string;
  footnote?: string;
  featured?: boolean;
};

export const packs: Pack[] = [
  {
    letter: "A",
    name: "Pipeline",
    subtitle: "Voice memo → PRD, brand kit, Jira, Confluence.",
    priceAmount: "$49",
    priceUnit: "/ month",
    priceNote: "Early access",
    features: [
      "Unlimited voice memos via Listener PWA",
      "Local Whisper transcription",
      "Exa-backed market research brief",
      "Validated PRD (Zod schema, exportable)",
      "Brand kit — palette, type, logo marks",
      "Jira board + Confluence space scaffold",
    ],
    cta: "Start with Pack A →",
    footnote: "The base. Most builders start here.",
    featured: true,
  },
  {
    letter: "B",
    name: "Pipeline + Scaffold",
    subtitle: "Adds a Next.js + Supabase repo, in your hands.",
    priceAmount: "$199",
    priceUnit: "/ project",
    features: [
      { text: "Everything in Pack A", bold: true },
      "Next.js 15 + Supabase scaffold",
      "Auth, RLS policies, typed DB schema",
      "Brand tokens applied to UI",
    ],
    cta: "Add Scaffold",
    tag: "+ Scaffold",
  },
  {
    letter: "C",
    name: "Pipeline + Scaffold + Deploy",
    subtitle: "Live URL, in your hands",
    priceAmount: "$399",
    priceUnit: "/ project",
    features: [
      { text: "Everything in Pack B", bold: true },
      "Vercel deploy + preview URL",
      "Custom subdomain on murmur.studio",
      "CI & environment wired",
    ],
    cta: "Add Deploy",
    tag: "+ Deploy",
  },
];

export const stackLayers = [
  {
    label: "Intelligence",
    tools: [
      { name: "Claude", note: "PRD + agent reasoning" },
      { name: "Whisper", note: "Local transcription" },
      { name: "Ollama", note: "On-device models" },
      { name: "Exa", note: "Market research" },
    ],
  },
  {
    label: "Orchestration",
    tools: [{ name: "n8n", note: "Self-hosted workflows" }],
  },
  {
    label: "Ship stack",
    tools: [
      { name: "Next.js", note: "App shell" },
      { name: "Supabase", note: "Auth + data" },
      { name: "Vercel", note: "Staging deploy" },
    ],
  },
] as const;

export const waitlistSection = {
  eyebrow: "Join the waitlist",
  headline: "Be early.",
  description:
    "Murmur opens in private beta this summer. No spam, occasional updates, first access when Pack A is live.",
  count: 4,
  countLabel: "builders on the waitlist",
  placeholder: "you@studio.com",
  cta: "Reserve a seat →",
  footnote: "Powered by Buttondown · no tracking pixels · unsubscribe one-click",
} as const;

export const studioLog = [
  {
    date: "2026 · MAY · 18",
    dateTime: "2026-05-18",
    title: "Phase 0 - Pipeline wiring",
    duration: "Build note",
    action: "View",
    href: "#pipeline",
    description: "The current build map: Listener intake, local transcription, research, PRD, brand, Jira, Confluence, scaffold, and deploy boundaries.",
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
    description: "The voice-in surface is intentionally small: one tap, local-first transcription, then a clean handoff into the orchestration layer.",
  },
];

export const footerLinks = {
  product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Pipeline", href: "#pipeline" },
    { label: "Packs", href: "#packs" },
  ],
  studio: [
    { label: "Log", href: "#studio-log" },
    { label: "About", href: "https://sprintzero.studio" },
    { label: "Roadmap", href: "#pipeline" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};
