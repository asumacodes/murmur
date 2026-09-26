import { ctaMode } from "@/config/features";
import { formatDuration, runStats } from "@/content/runs";

/**
 * Comparison pages (/compare/<slug>). Adding a competitor is data only:
 * append a `defineCompetitor({...})` to `competitors`.
 *
 * Rules for the competitor side:
 * - Every claim cites at least one entry in `sources` (checked by the type:
 *   `src` ids must be keys of `sources`).
 * - Only record what a source actually says on `checkedAt`. If it can't be
 *   verified, leave it out.
 * Murmur's column is shared across competitors (`murmurRows`) and can be
 * overridden per competitor via `murmurOverrides`.
 */

export const COMPARE_CHECKED_AT = "2026-09-26";

export type CompareRowKey = "input" | "output" | "research" | "brand" | "techDesign" | "atlassian" | "pricing" | "freeTier" | "speed";

export const compareRows: readonly { key: CompareRowKey; label: string }[] = [
  { key: "input", label: "Input" },
  { key: "output", label: "What you get" },
  { key: "research", label: "Research with sources" },
  { key: "brand", label: "Brand kit" },
  { key: "techDesign", label: "Tech design" },
  { key: "atlassian", label: "Jira & Confluence" },
  { key: "pricing", label: "Pricing" },
  { key: "freeTier", label: "Free tier" },
  { key: "speed", label: "Time to first output" },
];

export type CompareSource = { title: string; url: string };

/** A statement plus the source ids that back it. Empty `src` = Murmur's own claim. */
export type Claim<Id extends string = string> = { text: string; src: readonly Id[] };

export type CompareFaqItem<Id extends string = string> = { q: string; a: string; src?: readonly Id[] };

export type Competitor<Id extends string = string> = {
  slug: string;
  /** Full product name, e.g. "Atlassian Rovo". */
  name: string;
  /** Name used in running copy, e.g. "Rovo". */
  shortName: string;
  url: string;
  checkedAt: string;
  seo: { title: string; description: string };
  /** One honest line under the H1. */
  summary: string;
  /** Their own positioning line, quoted. */
  positioning: Claim<Id>;
  rows: Record<CompareRowKey, Claim<Id>>;
  murmurOverrides?: Partial<Record<CompareRowKey, string>>;
  bottomLine: { murmur: string; them: string };
  chooseThem: Claim<Id>[];
  chooseMurmur: Claim<Id>[];
  faq: CompareFaqItem<Id>[];
  sources: Record<Id, CompareSource>;
};

/**
 * Infers the source ids from `sources` only (NoInfer on every `src`), so a
 * typo in a citation is a type error rather than a silently broken link.
 */
type CompetitorInput<Id extends string> = Omit<Competitor<NoInfer<Id>>, "sources"> & { sources: Record<Id, CompareSource> };

function defineCompetitor<const Id extends string>(c: CompetitorInput<Id>): Competitor {
  return c as Competitor;
}

const stats = runStats();

/** Murmur's side of every table. Facts only; no competitor claims here. */
export const murmurRows: Record<CompareRowKey, string> = {
  input: "A voice memo, 15 seconds to 10 minutes. Typing works too.",
  output:
    "One run, a full foundation: transcript, competitor research, PRD, brand kit, engineering brief and a three-phase roadmap. The PRD has MoSCoW features grounded in the memo and the research, plus success metrics, non-goals, risks and open questions.",
  research: "Competitor and market research from live web search (Exa), with source links you can open.",
  brand: "Name notes, tagline, values, palette, typography, logo direction and a logo prompt. Downloads as a zip.",
  techDesign: "An engineering brief: architecture, data flow, components, data models, SQL/TypeScript schema, tech stack and tasks.",
  atlassian:
    "Creates a new Jira project (epics and stories, each story placed in a roadmap phase) and a new Confluence space with six pages, in your own Atlassian site. A free Atlassian account works.",
  pricing: "Per idea: $7 pay-as-you-go, or Starter $19/mo (5 ideas), Builder $49/mo (15), Studio $79/mo (30). Failed runs don't use an idea.",
  freeTier:
    ctaMode === "signup"
      ? "Your first idea is free, full run included. No card needed."
      : "Your first idea is free, full run included. Access is by waitlist for now; invites go out in batches.",
  speed: `Public example runs took ${formatDuration(stats.minRunSeconds)} to ${formatDuration(stats.maxRunSeconds)}, memo to Jira board.`,
};

const chatprd = defineCompetitor({
  slug: "chatprd",
  name: "ChatPRD",
  shortName: "ChatPRD",
  url: "https://www.chatprd.ai/",
  checkedAt: COMPARE_CHECKED_AT,
  seo: {
    title: "Murmur vs ChatPRD: Voice-to-Jira vs AI PRD Chat",
    description:
      "Murmur vs ChatPRD, with sources: one voice memo to a PRD, research, brand kit and new Jira project, or a chat-based AI PM for your team's docs.",
  },
  summary:
    "ChatPRD is an AI product manager you chat with to write, critique and refine docs as a team. Murmur isn't a chat: you speak one memo and get the whole foundation, ending in a new Jira project and Confluence space.",
  positioning: { text: "The AI product manager for your entire team", src: ["home"] },
  rows: {
    input: {
      text: "A chat. Type prompts, upload files and images (Pro), and pull context from Notion, Linear, GitHub, Slack and Granola through connectors (Pro and up).",
      src: ["pricing", "features", "mcp"],
    },
    output: {
      text: "PRDs, one-pagers, user stories, technical specs and go-to-market briefs from 20+ templates, plus CPO-style feedback on your drafts.",
      src: ["features"],
    },
    research: {
      text: "Competitive analysis is one of its templates, written from your conversation and the tools you connect.",
      src: ["features"],
    },
    brand: { text: "Not listed among its doc types or templates.", src: ["features"] },
    techDesign: {
      text: "Technical specs are a core doc type, and there's a technical design document template covering architecture, APIs and data models.",
      src: ["features", "tdd"],
    },
    atlassian: {
      text: "Works with the Jira and Confluence you already have: its Atlassian connector searches and creates or updates Jira issues (Pro and up), and docs export to Confluence in one click.",
      src: ["atlassian", "home"],
    },
    pricing: {
      text: "Pro $15/mo billed annually ($179/yr) for unlimited chats and docs. Teams $29 per seat/mo billed annually ($349/seat/yr). Enterprise is custom.",
      src: ["pricing"],
    },
    freeTier: { text: "Free plan: 3 chats (limited length), a basic AI model and basic templates.", src: ["pricing"] },
    speed: { text: "Conversational: drafts arrive in the chat as you go. ChatPRD pitches PRDs and docs “in minutes.”", src: ["features"] },
  },
  bottomLine: {
    murmur: "One memo in, a whole foundation out, ending in a new Jira project.",
    them: "An AI PM to chat with, for docs your team keeps iterating on.",
  },
  chooseThem: [
    { text: "You want to iterate on a PRD over days or weeks, in conversation, with an AI that critiques and coaches as you write.", src: ["features"] },
    { text: "Your team co-writes docs. The Teams plan adds shared projects, real-time doc collaboration and comments.", src: ["pricing"] },
    { text: "You live in Linear, Notion or Google Docs. ChatPRD pulls context from and exports to them; Murmur only creates Jira and Confluence content.", src: ["home", "mcp"] },
    { text: "You're writing for a product that already exists, with context in GitHub, Linear or meeting notes from Granola.", src: ["mcp"] },
    { text: "You need many doc types over time, not one foundation: one-pagers, user stories, go-to-market briefs and custom templates.", src: ["features"] },
  ],
  chooseMurmur: [
    { text: "You're starting from zero and would rather talk than type. One memo, no prompting, no back-and-forth.", src: [] },
    { text: "You want more than the PRD from the same run: competitor research with source links, a brand kit, an engineering brief and a three-phase roadmap.", src: [] },
    { text: "You want the Jira project and Confluence space set up for you: phased epics and stories in a new project, six written pages in a new space.", src: [] },
    { text: "You'd rather pay per idea than per seat: $7 an idea, and the first one's free.", src: [] },
    { text: "You work alone or in a small team and don't need co-editing inside the tool; you'll edit in Jira, Confluence or the Markdown exports.", src: [] },
  ],
  faq: [
    {
      q: "Is Murmur a ChatPRD alternative?",
      a: "For turning a brand-new idea into a plan, yes. For ongoing doc work with a team, ChatPRD is the closer fit. Murmur isn't a chat assistant: you give it one memo and it returns a full foundation, which you then edit in Jira, Confluence or the Markdown exports.",
    },
    {
      q: "Can I use Murmur and ChatPRD together?",
      a: "Yes. Murmur's PRD, research, engineering brief and transcript download as Markdown, and ChatPRD's Pro plan accepts file uploads, so you can start with Murmur and keep refining in ChatPRD.",
      src: ["pricing"],
    },
    {
      q: "Does Murmur export to Linear, Notion or GitHub?",
      a: "No. Murmur creates Jira and Confluence content and offers Markdown and zip downloads. If your team works in Linear or Notion, ChatPRD connects to both.",
      src: ["home", "mcp"],
    },
    {
      q: "Which one costs less?",
      a: "It depends on how you work. ChatPRD Pro is $15 a month billed annually for unlimited chats and documents. Murmur charges per idea: the first is free, then $7 each, or 5, 15 or 30 ideas a month for $19, $49 or $79. Writing docs every day favors a flat subscription; starting a few new ideas a month favors paying per idea.",
      src: ["pricing"],
    },
    {
      q: "Does Murmur have team collaboration?",
      a: "Not inside Murmur: there's no co-editing, commenting or shared workspace. Collaboration happens in Jira and Confluence, where the output lands. ChatPRD's Teams plan includes real-time doc collaboration and comments.",
      src: ["pricing"],
    },
  ],
  sources: {
    home: { title: "ChatPRD homepage", url: "https://www.chatprd.ai/" },
    features: { title: "ChatPRD features", url: "https://www.chatprd.ai/product/features" },
    pricing: { title: "ChatPRD pricing", url: "https://www.chatprd.ai/pricing" },
    mcp: { title: "ChatPRD docs: MCP connectors", url: "https://www.chatprd.ai/docs/mcp-connectors" },
    atlassian: { title: "ChatPRD docs: Atlassian connector (Jira & Confluence)", url: "https://www.chatprd.ai/docs/atlassian-mcp-connector" },
    tdd: { title: "ChatPRD technical design document template", url: "https://www.chatprd.ai/templates/technical-design-document-template" },
  },
});

const rovo = defineCompetitor({
  slug: "atlassian-rovo",
  name: "Atlassian Rovo",
  shortName: "Rovo",
  url: "https://www.atlassian.com/software/rovo",
  checkedAt: COMPARE_CHECKED_AT,
  seo: {
    title: "Murmur vs Atlassian Rovo: Voice-to-Jira vs Built-in AI",
    description:
      "Murmur vs Atlassian Rovo, with sources: a voice memo that builds a new Jira project and Confluence space, or AI inside the Atlassian plan you pay for.",
  },
  summary:
    "Rovo is AI built into the Jira and Confluence you already pay for, working across what's already there. Murmur starts before any of that exists: one voice memo becomes the research, PRD and plan, plus a new Jira project and Confluence space.",
  positioning: { text: "AI that knows your business", src: ["rovoHome"] },
  rows: {
    input: {
      text: "Prompts to Rovo Chat, Search and agents inside Jira and Confluence (also Slack, Microsoft Teams and a browser extension), grounded in your company's Atlassian and connected third-party data.",
      src: ["whatIsRovo", "rovoPricing"],
    },
    output: {
      text: "Answers, summaries and drafts across existing work: Confluence pages, live docs, whiteboards, databases and slides via Create with Rovo; Jira work items created, updated or broken down into tasks.",
      src: ["confCreate", "jiraAi"],
    },
    research: {
      text: "Answers from your company's knowledge. Org admins can turn on web search to expand its sources to public websites.",
      src: ["whatIsRovo", "webSearch"],
    },
    brand: {
      text: "Not a listed feature. Create with Rovo can draft creative briefs and messaging guides as Confluence pages.",
      src: ["confRovo"],
    },
    techDesign: {
      text: "Drafts structured Confluence pages, from project plans to PRDs. Code planning and generation is Rovo Dev, sold separately at $20 per developer/month.",
      src: ["confRovo", "rovoPricing"],
    },
    atlassian: {
      text: "Works inside your existing Jira and Confluence: breaks work into tasks, creates and updates work items, and drafts pages in your spaces.",
      src: ["jiraAi", "confCreate"],
    },
    pricing: {
      text: "No separate purchase: included in Standard, Premium and Enterprise Cloud plans, with 25 / 70 / 150 Rovo credits per user per month on Jira or Confluence. Jira Standard is listed at $7.91 per user/month.",
      src: ["rovoPricing", "jiraPricing"],
    },
    freeTier: {
      text: "Not on Atlassian's Free plans. You can try it through a trial of a Standard, Premium or Enterprise plan.",
      src: ["jiraPricing", "rovoPricing"],
    },
    speed: { text: "Per prompt. Atlassian pitches Create with Rovo as going “from idea to draft in seconds.”", src: ["confRovo"] },
  },
  bottomLine: {
    murmur: "Builds a new idea's foundation, including the Jira project and Confluence space.",
    them: "AI across the Atlassian work your team already has.",
  },
  chooseThem: [
    { text: "You already pay for Atlassian Standard, Premium or Enterprise. Rovo is included; there's nothing extra to buy.", src: ["rovoPricing"] },
    { text: "You want AI across existing work: search, chat and answers over your Jira, Confluence and connected apps like Google Drive and Slack.", src: ["whatIsRovo", "confRovo"] },
    { text: "Your project is already running and you need day-to-day help: breaking work into tasks, capturing work items from Confluence, Slack or email, and drafting status updates.", src: ["jiraAi"] },
    { text: "You want to build custom agents and automations for your team in plain language with Rovo Studio.", src: ["jiraPricing"] },
  ],
  chooseMurmur: [
    { text: "The idea is new and has no project yet. Murmur creates the Jira project and Confluence space from a voice memo.", src: [] },
    { text: "You're on Atlassian's Free plan. Murmur works with a free Atlassian account; Rovo needs a paid Cloud plan.", src: ["jiraPricing"] },
    { text: "You want outside-in competitor research from live web search, with source links, as part of the run.", src: [] },
    { text: "You want the brand kit, engineering brief and a phased roadmap written before anyone opens Jira.", src: [] },
    { text: "You'd rather pay per idea than per seat: $7 an idea, and the first one's free.", src: [] },
  ],
  faq: [
    {
      q: "Do I need Rovo or a paid Atlassian plan to use Murmur?",
      a: "No. A free Atlassian account works. You connect it once, and Murmur creates a new Jira project and Confluence space in your site for each idea.",
    },
    {
      q: "Can I use Murmur and Rovo together?",
      a: "Yes. What Murmur creates is ordinary Jira and Confluence content. If your site has Rovo, it can work with that project and space like any other: answering questions about it and breaking stories into smaller tasks.",
      src: ["whatIsRovo", "jiraAi"],
    },
    {
      q: "Is Rovo free?",
      a: "Not on Atlassian's Free plans. It's included, with no separate purchase, in Standard, Premium and Enterprise Cloud plans, and usage is metered in monthly Rovo credits. Rovo Search doesn't use credits; Chat and agent requests do.",
      src: ["jiraPricing", "rovoPricing"],
    },
    {
      q: "Which should write my PRD?",
      a: "If the PRD belongs in an existing Confluence space and should draw on work already there, Rovo can draft it in place. If the idea is new and you want the PRD alongside research, a brand kit, a tech design and a backlog, Murmur produces all of it in one run.",
      src: ["confRovo"],
    },
    {
      q: "Does Murmur change my existing Jira projects?",
      a: "No. Each run creates a new Jira project and a new Confluence space. Murmur isn't built to work inside projects you already have; that's where Rovo fits.",
    },
  ],
  sources: {
    rovoHome: { title: "Atlassian: Rovo product page", url: "https://www.atlassian.com/software/rovo" },
    rovoPricing: { title: "Atlassian: Rovo plans and pricing FAQ", url: "https://www.atlassian.com/software/rovo/pricing" },
    jiraPricing: { title: "Atlassian: Jira pricing (“Who can use Rovo AI in Jira?”)", url: "https://www.atlassian.com/software/jira/pricing" },
    whatIsRovo: { title: "Atlassian Support: What is Rovo?", url: "https://support.atlassian.com/rovo/docs/what-is-rovo/" },
    jiraAi: { title: "Atlassian: Rovo in Jira, AI features", url: "https://www.atlassian.com/software/jira/ai" },
    confCreate: { title: "Atlassian Support: Create new content items with Rovo", url: "https://support.atlassian.com/confluence-cloud/docs/create-new-content-items-with-rovo/" },
    confRovo: { title: "Atlassian: Create, draft, and edit with AI in Confluence", url: "https://www.atlassian.com/software/confluence/create-and-edit-with-rovo" },
    webSearch: {
      title: "Atlassian Support: Manage a web search option for Rovo",
      url: "https://support.atlassian.com/organization-administration/docs/manage-a-web-search-option-for-rovo/",
    },
  },
});

export const competitors: readonly Competitor[] = [chatprd, rovo];

export function getCompetitor(slug: string) {
  return competitors.find((c) => c.slug === slug);
}

export function murmurCell(c: Competitor, key: CompareRowKey) {
  return c.murmurOverrides?.[key] ?? murmurRows[key];
}

/** Sources in citation order, numbered from 1. */
export function sourceList(c: Competitor) {
  return Object.entries(c.sources).map(([id, s], i) => ({ id, n: i + 1, ...s }));
}

export function sourceNumber(c: Competitor, id: string) {
  const n = Object.keys(c.sources).indexOf(id) + 1;
  if (!n) throw new Error(`compare/${c.slug}: unknown source "${id}"`);
  return n;
}
