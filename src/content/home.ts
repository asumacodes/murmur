import type { ShapeName } from "@/components/webgl/shapes";
import { FOUNDING_REWARD_COPY } from "@/content/founding";

export const hero = {
  eyebrow: "Voice → project foundation",
  titleLine1: "Voice memo in.",
  titleLine2Lead: "Whole",
  titleLine2Rest: "project out.",
  subhead:
    "Talk through your idea. Murmur researches the competition, writes the PRD, designs the brand and drafts the tech design. Then it builds your Confluence space, roadmap and Jira board in your own Atlassian site, all in under 10 minutes.",
  secondaryCta: "See a real run",
} as const;

/** The hero loop: what the flock turns into, and the caption shown while it does. */
export const heroSequence: { shape: ShapeName; label: string; hold: number }[] = [
  { shape: "voice", label: "Listening", hold: 3.4 },
  { shape: "transcript", label: "Transcribing", hold: 1.8 },
  { shape: "research", label: "Researching the market", hold: 2.4 },
  { shape: "prd", label: "Writing the PRD", hold: 2.2 },
  { shape: "brand", label: "Designing the brand", hold: 2.2 },
  { shape: "jira", label: "Building your board", hold: 2.6 },
];

export type Stage = {
  id: string;
  n: string;
  name: string;
  shape: ShapeName;
  output: string;
  body: string;
  fields: string[];
  by?: string;
};

/** The nine stages, in the order a run produces them. Field names mirror the app's output types. */
export const stages: Stage[] = [
  {
    id: "voice",
    n: "01",
    name: "Voice memo",
    shape: "voice",
    output: "Your idea, out loud",
    body: "Tap record and pitch it like you would to a friend. Fifteen seconds works; ten minutes is the ceiling. Rather type? That works too.",
    fields: ["Phone or desktop", "15 sec to 10 min", "Or type it"],
  },
  {
    id: "transcript",
    n: "02",
    name: "Transcript",
    shape: "transcript",
    output: "Clean, punctuated text",
    body: "Your memo becomes text you can read back and correct. Nothing runs until you confirm.",
    fields: ["Language detection", "Review before running"],
    by: "AssemblyAI",
  },
  {
    id: "research",
    n: "03",
    name: "Competitor map",
    shape: "research",
    output: "Who's already out there",
    body: "Live web search for competitors and prior art. Every competitor comes with a link you can open, their positioning, strengths, weaknesses and pricing where it's stated.",
    fields: ["competitors[]", "marketSummary", "tableStakes", "differentiationOpportunities", "ourPositioning"],
    by: "Exa",
  },
  {
    id: "prd",
    n: "04",
    name: "PRD",
    shape: "prd",
    output: "The product requirements document",
    body: "A tight, opinionated PRD. MoSCoW features grounded in your memo and the research. Won't-haves included, because that's where scope creep dies.",
    fields: ["oneLiner", "problem", "targetUser", "must / should / could / won't", "successMetrics", "risks", "openQuestions"],
    by: "Claude",
  },
  {
    id: "brand",
    n: "05",
    name: "Brand kit",
    shape: "brand",
    output: "A name, a tagline, a palette",
    body: "Name notes, a tagline, brand values, a full color palette with semantic colors, a type system and a logo direction with a ready-to-use image prompt.",
    fields: ["tagline", "brandValues", "colorPalette", "typography", "logoDirection", "logoPrompt"],
    by: "Claude",
  },
  {
    id: "engineering",
    n: "06",
    name: "Tech design",
    shape: "engineering",
    output: "The engineering brief",
    body: "High-level architecture, data flow, components and their responsibilities, data models, a SQL and TypeScript schema, a tech stack and the first engineering tasks.",
    fields: ["hld", "dataModels", "schemaSql", "techStack", "engineeringTasks"],
    by: "Claude",
  },
  {
    id: "confluence",
    n: "07",
    name: "Confluence space",
    shape: "confluence",
    output: "Six pages, already written",
    body: "A new space in your own Confluence, named after the brand: Product, Brand & Identity, Engineering, Competitor Analysis, Roadmap, Research Notes.",
    fields: ["01 Product", "02 Brand", "03 Engineering", "04 Competitors", "05 Roadmap", "06 Research"],
    by: "Atlassian",
  },
  {
    id: "roadmap",
    n: "08",
    name: "Roadmap",
    shape: "roadmap",
    output: "Three phases, every story placed",
    body: "Every story lands in phase one, two or three, so you know what ships first and what can wait. It lives in Confluence and on the board.",
    fields: ["Phase 1", "Phase 2", "Phase 3"],
  },
  {
    id: "jira",
    n: "09",
    name: "Jira board",
    shape: "jira",
    output: "Epics and stories in your own Jira",
    body: "A brand-new Jira project in your own site, with epics drawn from the PRD's features plus one for engineering. The public runs created 11 to 12 epics and 33 to 47 stories. Open it and start pulling cards.",
    fields: ["New project", "Epics", "Stories", "Phase per story"],
    by: "Atlassian",
  },
];

export const howItWorks = {
  eyebrow: "How it works",
  title: "Three steps.",
  titleAccent: "You only do the talking.",
  steps: [
    {
      n: "01",
      title: "Say the idea",
      body: "Open Murmur on your phone or laptop and talk. What it does, who it's for, why now. No prompts, no forms, no structure to figure out.",
      meta: "15 sec to 10 min",
    },
    {
      n: "02",
      title: "Murmur runs the other eight",
      body: "Research, PRD, brand kit, tech design, Confluence, roadmap and Jira, each stage building on everything before it. Close the tab; you'll get a notification when it's done.",
      meta: "≈ 8 min",
    },
    {
      n: "03",
      title: "Open your workspace",
      body: "Your Jira project and Confluence space are already there, in your own Atlassian site. Everything else downloads as Markdown, plus a brand-kit zip.",
      meta: "Your tools",
    },
  ],
} as const;

export const comparison = {
  eyebrow: "By hand vs Murmur",
  title: "Same foundation.",
  titleAccent: "Different week.",
  subhead:
    "None of this is hard. It's just a lot. Drag across any card to see the first week of a new idea done by hand, then done by talking.",
  rows: [
    { id: "research", dimension: "Market research", manual: "Twenty tabs, half stale, none cited.", murmur: "A competitor map with a source link for every competitor." },
    { id: "prd", dimension: "The PRD", manual: "Write it, restructure it, rewrite it.", murmur: "MoSCoW features, grounded in your memo and the research." },
    { id: "brand", dimension: "Brand", manual: "A mood board now, a real brand later. Maybe.", murmur: "Tagline, palette, type and logo direction." },
    { id: "tech", dimension: "Tech design", manual: "Lives in your head until it's too late.", murmur: "Architecture, data models and a SQL schema." },
    { id: "backlog", dimension: "The backlog", manual: "Reverse-engineer epics from the doc.", murmur: "Phased epics and stories, in your own Jira." },
    { id: "workspace", dimension: "The workspace", manual: "Set up Confluence before you've written a word.", murmur: "Six pages, already written." },
  ],
  manualTotal: "Days, across six tools",
  manualNote: "Docs, tabs, a design tool, a whiteboard, Jira and Confluence.",
  murmurTotal: "Under 10 minutes",
} as const;

export const pricing = {
  eyebrow: "Pricing",
  title: "Pay per idea.",
  titleAccent: "Your first one's on us.",
  subhead:
    "Every account starts with one free idea: the full foundation, no card. After that, pick a plan or buy one idea at a time. An idea is only used when a run delivers.",
  free: {
    name: "Your first idea",
    price: "$0",
    tagline: "on every account",
    note: "The full foundation: research, PRD, brand kit, tech design, roadmap, Jira board and Confluence space. No card needed.",
  },
  payg: { name: "Pay as you go", price: "$7", unit: "/ idea", note: "No subscription. Ideas never expire.", tier: "payg" as const },
  plans: [
    {
      name: "Starter",
      tier: "starter" as const,
      price: 19,
      ideas: 5,
      blurb: "A few new ideas a month.",
      features: ["5 ideas / month", "1-month result retention", "Top-ups at $5 / idea"],
      highlight: false,
    },
    {
      name: "Builder",
      tier: "builder" as const,
      price: 49,
      ideas: 15,
      blurb: "For builders shipping regularly.",
      features: ["15 ideas / month", "6-month result retention", "Top-ups at $4 / idea"],
      highlight: true,
    },
    {
      name: "Studio",
      tier: "studio" as const,
      price: 79,
      ideas: 30,
      blurb: "Agencies pitching clients at volume.",
      features: ["30 ideas / month", "6-month result retention", "Top-ups at $3 / idea"],
      highlight: false,
    },
  ],
  footnotes: [
    "Failed runs never use an idea. Retrying a stage is free.",
    "Monthly ideas reset; they don't roll over. Top-ups never expire.",
    "Prices in USD, exclusive of tax. INR pricing shown in the app for India.",
  ],
  foundingTitle: "Founding members",
  foundingHeadline: "Double the ideas, for a year.",
  founding: FOUNDING_REWARD_COPY,
} as const;

export const stack = {
  eyebrow: "Built on",
  items: [
    { name: "Claude", note: "Writes every document" },
    { name: "Exa", note: "Live web research" },
    { name: "AssemblyAI", note: "Transcription" },
    { name: "Jira", note: "Your board" },
    { name: "Confluence", note: "Your space" },
    { name: "Supabase", note: "Auth + data" },
    { name: "Vercel", note: "Hosting" },
  ],
} as const;

export const sprintZero = {
  eyebrow: "When you're ready to build",
  titleLead: "Foundation ready?",
  titleAccent: "SprintZero ships it.",
  body: "Murmur stops where automation should. SprintZero, the studio behind Murmur, takes your foundation and hands back a deployed, working MVP in a fixed 72-hour window.",
  cta: "Book a 30-minute call",
  href: "https://sprint0.trymurmur.studio/book",
  price: "Fixed scope · from $1,500",
  steps: [
    { who: "Murmur", name: "Foundation", detail: "PRD, brand, tech design and a Jira board, in minutes." },
    { who: "SprintZero", name: "72-hour sprint", detail: "One operator builds against that board." },
    { who: "You", name: "Live MVP", detail: "Deployed, with the code, infra and keys handed over." },
  ],
} as const;

export const closer = {
  eyebrow: "Your turn",
  titleLine1: "Say it",
  titleLine2: "out loud.",
  body: "The idea you keep describing to friends is about eight minutes away from a Jira board. Your first one's on us.",
} as const;
