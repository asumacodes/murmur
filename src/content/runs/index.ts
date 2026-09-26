import aavaas from "./aavaas.json";
import creatureClash from "./creature-clash.json";
import finMatter from "./fin-matter.json";
import shipreel from "./shipreel.json";

/**
 * Real, unedited Murmur runs, published with the owner's permission.
 * Source: the founder's own account on app.trymurmur.studio (Sep 2026).
 * Curated by removing raw scraped research text, private IDs and links into
 * the owner's Atlassian tenant. The Fin Matter transcript is excerpted.
 * `runSeconds` = run start → results delivered.
 */

export type Feature = { title: string; description: string; rationale?: string };

export type RunExample = {
  slug: string;
  order: number;
  idea: string;
  category: string;
  seoNoun: string;
  title: string;
  recordedAt: string;
  runAt: string;
  memoSeconds: number;
  runSeconds: number | null;
  language: string;
  transcript: string;
  prd: {
    productName: string;
    oneLiner: string;
    problem?: string;
    targetUser: string;
    features: { must_have: Feature[]; should_have: Feature[]; could_have: Feature[]; wont_have: Feature[] };
    successMetrics: { metric: string; target: string }[];
    nonGoals: string[];
    risks: string[];
    openQuestions: string[];
    competitiveLandscape: { competitor: string; positioningDelta: string }[];
  };
  research: {
    marketSummary: string;
    ourPositioning: string;
    tableStakes: string[];
    differentiationOpportunities: string[];
    competitors: {
      name: string;
      url: string;
      positioning: string;
      keyFeatures: string[];
      pricingModel?: string;
      strengths: string[];
      weaknesses: string[];
      directOverlap?: string;
    }[];
  };
  brand: {
    brandName: string;
    tagline: string;
    nameNotes: string[];
    brandValues: string[];
    colorPalette: {
      primary: string;
      secondary: string;
      accent: string;
      neutral: string;
      semantic?: Record<string, string>;
    };
    typography: { heading: string; body: string; mono: string };
    logoDirection?: { form?: string; style?: string; symbolConcept?: string; avoidances?: string[] };
    iconographyStyle?: string;
  };
  engineering: {
    overview?: string;
    dataFlow?: string;
    components: { name: string; responsibility?: string }[];
    techStack: Record<string, string>;
    dataModels: { entity: string; fields: { name: string; type: string }[]; relationships: string[] }[];
    tasks: { title: string; description: string }[];
    openQuestions: string[];
    schemaSqlExcerpt?: string;
  };
  jira: {
    projectKey: string;
    epicCount: number;
    storyCount: number;
    epics: { key: string; title: string; stories: { key: string; title: string; phase: number }[] }[];
  };
  roadmap: { phase: number; storyCount: number; epics: string[] }[];
  confluence: { pages: string[] };
};

export const runs: RunExample[] = ([creatureClash, shipreel, aavaas, finMatter] as unknown as RunExample[]).sort(
  (a, b) => a.order - b.order,
);

export function getRun(slug: string) {
  return runs.find((r) => r.slug === slug);
}

export function formatDuration(seconds: number | null | undefined, style: "short" | "clock" = "short") {
  if (seconds == null || !Number.isFinite(seconds)) return "n/a";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (style === "clock") return `${m}:${String(s).padStart(2, "0")}`;
  return m ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
}

/** Features the PRD commits to (Must + Should + Could). Won't-haves are counted separately. */
export function prdFeatureCount(run: RunExample) {
  const f = run.prd.features;
  return f.must_have.length + f.should_have.length + f.could_have.length;
}

export function paletteOf(run: RunExample): { name: string; hex: string }[] {
  const p = run.brand.colorPalette;
  return [
    { name: "Primary", hex: p.primary },
    { name: "Secondary", hex: p.secondary },
    { name: "Accent", hex: p.accent },
    { name: "Neutral", hex: p.neutral },
  ].filter((c) => /^#[0-9a-f]{6}$/i.test(c.hex));
}

/** Aggregate stats across the published runs — every number traceable to a run file. */
export function runStats() {
  const secs = runs.map((r) => r.runSeconds).filter((s): s is number => s != null);
  const avg = secs.reduce((a, b) => a + b, 0) / Math.max(secs.length, 1);
  return {
    count: runs.length,
    avgRunSeconds: Math.round(avg),
    maxRunSeconds: Math.max(...secs),
    minRunSeconds: Math.min(...secs),
    totalStories: runs.reduce((a, r) => a + r.jira.storyCount, 0),
    totalEpics: runs.reduce((a, r) => a + r.jira.epicCount, 0),
    totalCompetitors: runs.reduce((a, r) => a + r.research.competitors.length, 0),
  };
}

export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Timezone-proof date label from an ISO date (YYYY-MM-DD); safe for SSR hydration. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
