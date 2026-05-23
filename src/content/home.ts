export const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Packs", href: "#packs" },
  { label: "Studio log", href: "#studio-log" },
];

export const pipelineLabels = ["VOICE", "RESEARCH", "PRD", "BRAND", "SHIPPED"];

export const howItWorks = [
  {
    number: "01",
    title: "VOICE IN",
    body: "You open Listener. Tap once. Talk for five minutes about your idea.",
    artifact: "Recording",
  },
  {
    number: "02",
    title: "TRANSCRIPTION",
    body: "Whisper runs locally. Your voice becomes structured text - privately, in seconds.",
    artifact: "Transcript",
  },
  {
    number: "03",
    title: "RESEARCH",
    body: "Exa searches the web for competitors, prior art, and market signal. You get a brief, not a hallucination.",
    artifact: "Market signal",
  },
  {
    number: "04",
    title: "PROJECT FOUNDATION",
    body: "Claude writes the PRD. A brand identity is generated. Jira board and Confluence space scaffold themselves.",
    artifact: "PRD + brand + Jira",
  },
  {
    number: "05",
    title: "SCAFFOLD & DEPLOY",
    body: "For Pack B and C: a Next.js + Supabase repo lands in your hands. For Pack C: it is live on a *.murmur.studio URL before you close the tab.",
    artifact: "Deploy",
  },
];

export const pipelineNodes = [
  { name: "Listener", role: "PWA capture", level: 0, pack: "A" },
  { name: "Whisper", role: "transcription", level: 0, pack: "A" },
  { name: "Exa", role: "market research", level: 0, pack: "A" },
  { name: "Claude / PRD Agent", role: "Zod schema", level: 0, pack: "A" },
  { name: "Brand Agent", role: "identity kit", level: 1, pack: "A" },
  { name: "Jira Generator", role: "epics + stories", level: 1, pack: "A" },
  { name: "Confluence Generator", role: "space + pages", level: 1, pack: "A" },
  { name: "Engineering Agent", role: "scaffold spec", level: 1, pack: "B" },
  { name: "Next.js + Supabase", role: "repo", level: 0, pack: "B" },
  { name: "Vercel Deploy", role: "staging deploy", level: 0, pack: "C" },
];

export const packs = [
  {
    letter: "A",
    name: "Pipeline",
    position: "Turn the memo into a real project foundation.",
    price: "Starting from $49/month - early access",
    features: [
      "Listener intake",
      "Local transcription handoff",
      "Competitive research brief",
      "Validated PRD",
      "Brand identity kit",
      "Jira + Confluence scaffold",
    ],
    cta: "Join for Pack A",
    featured: true,
  },
  {
    letter: "B",
    name: "Pipeline + Scaffold",
    position: "Add a starter codebase when planning is not enough.",
    price: "From $199/project - early access",
    features: [
      "Everything in Pack A",
      "Engineering scaffold spec",
      "Next.js app foundation",
      "Supabase-ready structure",
      "Repository handoff",
    ],
    cta: "Join for Pack B",
    tag: "+ SCAFFOLD",
  },
  {
    letter: "C",
    name: "Pipeline + Scaffold + Deploy",
    position: "Go from spoken idea to a staged URL.",
    price: "From $399/project - early access",
    features: [
      "Everything in Pack B",
      "Vercel project setup",
      "Staging deployment",
      "*.murmur.studio preview",
      "Launch checklist",
    ],
    cta: "Join for Pack C",
    tag: "+ DEPLOY",
    glow: true,
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
