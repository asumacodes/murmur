import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/examples/CtaBand";
import { PageShell } from "@/components/site/PageShell";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { formatDuration, paletteOf, runs, runStats } from "@/content/runs";
import { brandFontFamily } from "@/lib/brand-fonts";
import { absoluteUrl } from "@/lib/site";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "PRD Examples From Real Voice Memos, With Jira Boards",
  description:
    "Real, unedited Murmur runs from voice memos: PRDs, competitor maps, brand kits, engineering briefs, roadmaps and Jira boards for a game, a SaaS, a proptech app and an AI finance assistant.",
  alternates: { canonical: "/examples" },
};

const artifacts = [
  "Transcript",
  "Competitor map",
  "PRD (MoSCoW)",
  "Brand kit",
  "Tech design",
  "Roadmap",
  "Jira board",
  "Confluence space",
];

export default function ExamplesPage() {
  const stats = runStats();
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Murmur PRD examples",
    itemListElement: runs.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/examples/${r.slug}`),
      name: `${r.title.split(":")[0]} PRD example: ${r.idea}`,
    })),
  };
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Murmur", path: "/" },
    { name: "Examples", path: "/examples" },
  ]);

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([itemList, breadcrumbs]) }} />
      <div className="wrap pb-10 pt-32 sm:pt-40">
        <Eyebrow dot>Real runs · unedited output</Eyebrow>
        <h1 className="display-1 balance mt-5 max-w-5xl">
          PRD examples <span className="serif-accent text-fg-2">from real voice memos.</span>
        </h1>
        <p className="lede mt-6 max-w-3xl">
          Each example below started as a short voice memo and came back as a complete product foundation: competitor research with sources, a
          full PRD, a brand kit, an engineering brief, a three-phase roadmap and a Jira backlog. Nothing is rewritten; only private links are
          removed.
        </p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {artifacts.map((a) => (
            <li key={a} className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-fg-2">
              {a}
            </li>
          ))}
        </ul>

        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {runs.map((run, i) => {
            const palette = paletteOf(run);
            return (
              <li key={run.slug} data-reveal style={{ ["--reveal-i" as string]: i }}>
                <Link href={`/examples/${run.slug}`} className="card spotlight group flex h-full flex-col overflow-hidden transition hover:border-line-2">
                  <div className="relative h-40 overflow-hidden" style={{ background: run.brand.colorPalette.secondary }}>
                    <div className="absolute inset-x-0 bottom-0 flex h-3">
                      {palette.map((c) => (
                        <span key={c.hex} className="flex-1" style={{ background: c.hex }} />
                      ))}
                    </div>
                    <p
                      className="absolute left-6 top-6 max-w-[80%] text-3xl leading-[1.05] text-white/95 transition-transform duration-500 group-hover:-translate-y-1"
                      style={{ fontFamily: brandFontFamily(run.brand.typography.heading), fontWeight: 600, textShadow: "0 1px 16px rgb(0 0 0 / 0.25)" }}
                    >
                      {run.brand.tagline}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fg-3">
                      {run.category} · {run.idea}
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-fg">{run.title}</h2>
                    <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-fg-2">{run.prd.oneLiner}</p>
                    <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-5 font-mono text-[0.72rem] text-fg-3">
                      <div>
                        <dt className="inline">memo </dt>
                        <dd className="inline text-fg-2">{formatDuration(run.memoSeconds, "clock")}</dd>
                      </div>
                      <div>
                        <dt className="inline">run </dt>
                        <dd className="inline text-fg-2">{formatDuration(run.runSeconds)}</dd>
                      </div>
                      <div>
                        <dt className="inline">epics </dt>
                        <dd className="inline text-fg-2">{run.jira.epicCount}</dd>
                      </div>
                      <div>
                        <dt className="inline">stories </dt>
                        <dd className="inline text-fg-2">{run.jira.storyCount}</dd>
                      </div>
                    </dl>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-fg">
                      Read the full foundation <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 font-mono text-xs text-fg-3">
          Across these {stats.count} runs: {stats.totalCompetitors} competitors researched, {stats.totalEpics} epics and {stats.totalStories} stories
          created, average run time {formatDuration(stats.avgRunSeconds)}.
        </p>

        <CtaBand location="examples_index" title="Want one of these for your own idea?" />
      </div>
    </PageShell>
  );
}
