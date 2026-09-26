#!/usr/bin/env node
/**
 * Turn a raw run export into a publishable example at src/content/runs/<slug>.json.
 *
 *   node scripts/curate-run.mjs <raw.json> <slug> --idea "…" --category "…" --noun "…" --order 5 [--transcript-file excerpt.txt]
 *
 * <raw.json> is { recording, runs, results } exported from the owner's own run
 * in app.trymurmur.studio (results = the run_results row). Only publish runs
 * the owner has explicitly approved, and review the output before committing:
 *   - trim personal details from the transcript (use --transcript-file),
 *   - raw scraped research text, private IDs and Atlassian links are dropped here.
 * Then add the import to src/content/runs/index.ts.
 */
import fs from "node:fs";
import path from "node:path";

const [, , rawPath, slug, ...rest] = process.argv;
if (!rawPath || !slug) {
  console.error("usage: node scripts/curate-run.mjs <raw.json> <slug> --idea … --category … --noun … --order N [--transcript-file f]");
  process.exit(1);
}
const flag = (name, fallback) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : fallback;
};

const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));
const results = raw.results ?? raw.latestRunResults;
const { recording } = raw;
const { prd, competitors, brand, engineering, jira, confluence } = results;

const isRef = (v) => typeof v === "string" && /^\$[0-9a-f]+$/.test(v);
const clean = (v) => (isRef(v) ? undefined : v);
const stated = (v) => (v && !/^not stated$/i.test(String(v).trim()) ? v : undefined);

const done = (raw.runs ?? []).filter((r) => r.status === "done").sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
let runSeconds = null;
if (done?.retention?.expiresAt) {
  // Retention is stamped at delivery (+1 month on the default tier).
  const end = new Date(done.retention.expiresAt);
  end.setUTCMonth(end.getUTCMonth() - (done.retention.retentionTier === "extended" ? 6 : 1));
  runSeconds = Math.round((end - new Date(done.createdAt)) / 1000);
}

const transcriptFile = flag("transcript-file");
const transcript = transcriptFile ? fs.readFileSync(transcriptFile, "utf8").trim() : (recording.transcription ?? "").trim();

const epics = (jira.epicsCreated ?? []).map((e) => ({
  key: e.key,
  title: e.title,
  stories: (jira.storiesCreated ?? []).filter((s) => s.epic === e.key).map((s) => ({ key: s.key, title: s.title, phase: s.phase })),
}));

const out = {
  slug,
  order: Number(flag("order", "99")),
  idea: flag("idea", recording.title),
  category: flag("category", "Product"),
  seoNoun: flag("noun", "app"),
  title: prd.productName || recording.title,
  recordedAt: recording.createdAt.slice(0, 10),
  runAt: (done?.createdAt ?? recording.createdAt).slice(0, 10),
  memoSeconds: recording.durationSeconds,
  runSeconds,
  language: recording.language,
  transcript,
  prd: {
    productName: prd.productName,
    oneLiner: prd.oneLiner,
    problem: clean(prd.problem),
    targetUser: prd.targetUser,
    features: {
      must_have: prd.features?.must_have ?? [],
      should_have: prd.features?.should_have ?? [],
      could_have: prd.features?.could_have ?? [],
      wont_have: prd.features?.wont_have ?? [],
    },
    successMetrics: prd.successMetrics ?? [],
    nonGoals: prd.nonGoals ?? [],
    risks: prd.risks ?? [],
    openQuestions: prd.openQuestions ?? [],
    competitiveLandscape: prd.competitiveLandscape ?? [],
  },
  research: {
    marketSummary: competitors.marketSummary,
    ourPositioning: competitors.ourPositioning,
    tableStakes: competitors.tableStakes ?? [],
    differentiationOpportunities: competitors.differentiationOpportunities ?? [],
    competitors: (competitors.competitors ?? []).map((c) => ({
      name: c.name,
      url: c.url,
      positioning: c.positioning,
      keyFeatures: c.keyFeatures ?? [],
      pricingModel: stated(c.pricingModel),
      strengths: c.strengths ?? [],
      weaknesses: c.weaknesses ?? [],
      directOverlap: stated(c.directOverlap),
    })),
  },
  brand: {
    brandName: brand.brandName,
    tagline: brand.tagline,
    nameNotes: brand.nameNotes ?? [],
    brandValues: brand.brandValues ?? [],
    colorPalette: brand.colorPalette,
    typography: brand.typography,
    logoDirection: brand.logoDirection,
    iconographyStyle: brand.iconographyStyle,
  },
  engineering: {
    overview: clean(engineering.hld?.overview),
    dataFlow: clean(engineering.hld?.dataFlow),
    components: (engineering.hld?.components ?? []).map((c) => ({ name: c.name, responsibility: clean(c.responsibility) })),
    techStack: engineering.techStack ?? {},
    dataModels: (engineering.dataModels ?? []).map((m) => ({
      entity: m.entity,
      fields: (m.fields ?? []).map((f) => ({ name: f.name, type: f.type })),
      relationships: m.relationships ?? [],
    })),
    tasks: engineering.engineeringTasks ?? [],
    openQuestions: engineering.openEngineeringQuestions ?? [],
    schemaSqlExcerpt: clean(engineering.schemaSql)?.split("\n").slice(0, 28).join("\n"),
  },
  jira: { projectKey: jira.projectKey, epicCount: epics.length, storyCount: (jira.storiesCreated ?? []).length, epics },
  roadmap: [1, 2, 3].map((phase) => {
    const stories = (jira.storiesCreated ?? []).filter((s) => s.phase === phase);
    return {
      phase,
      storyCount: stories.length,
      epics: [...new Set(stories.map((s) => s.epic))].map((k) => epics.find((e) => e.key === k)?.title).filter(Boolean),
    };
  }),
  confluence: { pages: (confluence.pagesCreated ?? []).map((p) => p.title) },
};

const unresolved = JSON.stringify(out).match(/"\$[0-9a-f]+"/g);
if (unresolved) console.warn("⚠ unresolved RSC text references (re-export those fields):", unresolved.join(", "));

const dest = path.resolve("src/content/runs", `${slug}.json`);
fs.writeFileSync(dest, `${JSON.stringify(out, null, 2)}\n`);
console.log(`wrote ${dest} · memo ${out.memoSeconds}s · run ${runSeconds}s · ${out.jira.epicCount} epics · ${out.jira.storyCount} stories`);
