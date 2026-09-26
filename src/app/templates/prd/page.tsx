import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/site/PageShell";
import { buildTemplateSchemas } from "@/components/templates/schema";
import { TemplateActions, TemplateCodeBlock } from "@/components/templates/TemplateCodeBlock";
import {
  Breadcrumb,
  DocSection,
  FaqList,
  GuideList,
  MobileToc,
  NextTemplate,
  Sub,
  TemplateCta,
  TemplateOutline,
  TemplateToc,
  countSections,
  pickByName,
  type TocItem,
} from "@/components/templates/TemplateParts";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { formatDuration, getRun, type Feature } from "@/content/runs";
import { prdTemplate as tpl } from "@/content/templates/prd";
import { absoluteUrl } from "@/lib/site";

const PATH = "/templates/prd";
const TITLE = "PRD Template: Free Markdown Download + Example";
const DESCRIPTION =
  "Free PRD template in Markdown: MoSCoW features with rationale, success metrics, non-goals and risks, plus a section-by-section guide and a real example.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["PRD template", "product requirements document template", "PRD template markdown", "PRD template for startups", "PRD example", "MoSCoW"],
  openGraph: { title: "PRD template (free, copy-paste Markdown)", description: DESCRIPTION, url: absoluteUrl(PATH), type: "article" },
  twitter: { card: "summary_large_image", title: "PRD template (free, copy-paste Markdown)", description: DESCRIPTION },
};

const toc: TocItem[] = [
  { id: "template", label: "The template" },
  { id: "guide", label: "How to fill it in", children: tpl.guide.map((g) => ({ id: `guide-${g.id}`, label: g.title })) },
  { id: "example", label: "Filled example" },
  { id: "faq", label: "FAQ" },
];

const TONE = {
  must: { label: "Must have", chip: "border-signal/50 bg-signal-soft text-fg" },
  should: { label: "Should have", chip: "border-line-2 bg-surface-2 text-fg" },
  could: { label: "Could have", chip: "border-line bg-surface text-fg-2" },
  wont: { label: "Won't have", chip: "border-line bg-surface text-fg-3" },
} as const;

function FeatureGroup({ tone, items, total }: { tone: keyof typeof TONE; items: Feature[]; total: number }) {
  if (!items.length) return null;
  return (
    <div className="mt-6 first:mt-0">
      <p className="flex items-center gap-2">
        <span className={`rounded-full border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.1em] ${TONE[tone].chip}`}>{TONE[tone].label}</span>
        <span className="font-mono text-xs text-fg-3">
          {items.length} of {total}
        </span>
      </p>
      <ol className="mt-3 grid gap-3">
        {items.map((f) => (
          <li key={f.title} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
            <p className={`font-medium ${tone === "wont" ? "text-fg-2 line-through decoration-fg-3/50" : "text-fg"}`}>{f.title}</p>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-fg-2">{f.description}</p>
            {f.rationale ? (
              <p className="mt-2.5 border-l-2 border-line-2 pl-3 text-[0.88rem] leading-relaxed text-fg-3">
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.1em]">Rationale · </span>
                {f.rationale}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Rows({ head, rows }: { head: [string, string]; rows: [string, string][] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="hidden grid-cols-[13rem_1fr] gap-4 bg-surface-2 px-4 py-2.5 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-fg-3 sm:grid" aria-hidden="true">
        <span>{head[0]}</span>
        <span>{head[1]}</span>
      </div>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 border-t border-line px-4 py-3 first:border-t-0 sm:grid-cols-[13rem_1fr] sm:gap-4 sm:first:border-t">
            <dt className="text-[0.92rem] font-medium text-fg">{k}</dt>
            <dd className="text-[0.92rem] leading-relaxed text-fg-2">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function PrdTemplatePage() {
  const run = getRun("aavaas");
  if (!run) notFound();

  const { prd } = run;
  const f = prd.features;
  const counts = [
    ["Must", f.must_have.length],
    ["Should", f.should_have.length],
    ["Could", f.could_have.length],
    ["Won't", f.wont_have.length],
  ] as const;
  const musts = pickByName(f.must_have, (x) => x.title, ["Plot & Lifestyle Intake", "Free Revision Loop"], 2);
  const wonts = pickByName(f.wont_have, (x) => x.title, ["CAD/DXF Professional Export", "Sanctioned/Legal Approval Drawings", "Mobile Apps"], 3);
  const metrics = pickByName(
    prd.successMetrics,
    (m) => m.metric,
    ["Intake-to-3D-model completion rate", "Paid conversion rate", "Customer satisfaction (CSAT)"],
    3,
  );
  const landscape = prd.competitiveLandscape.slice(0, 3);
  const sections = countSections(tpl.markdown);

  const schemas = buildTemplateSchemas({
    headline: "PRD template (free, copy-paste Markdown)",
    description: DESCRIPTION,
    path: PATH,
    name: "PRD template",
    about: ["Product requirements document", "PRD template", "MoSCoW prioritization", "Success metrics", "Product management"],
  });

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <header className="relative isolate overflow-hidden pb-14 pt-32 sm:pt-40">
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: "radial-gradient(55% 60% at 88% 0%, var(--signal-soft), transparent 70%)" }} />
        <div className="wrap">
          <Breadcrumb current="PRD template" />
          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_21rem] lg:items-center xl:grid-cols-[1fr_23rem]">
            <div className="min-w-0">
              <Eyebrow dot>Free template · Markdown · no sign-up</Eyebrow>
              <h1 className="display-1 balance mt-4 max-w-4xl">
                PRD template{" "}
                <span className="serif-accent text-fg-2">
                  in <span className="whitespace-nowrap">copy-paste</span> Markdown.
                </span>
              </h1>
              <p className="lede mt-5 max-w-2xl">
                A product requirements document template with the sections that settle arguments before they start: a one-liner, the problem, one
                target user, MoSCoW features that each carry a rationale, measurable success metrics and an explicit Won&apos;t-have list. It&apos;s
                the structure Murmur writes, so the guide and the real example below line up section for section.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <TemplateActions templateName={tpl.slug} filename={tpl.filename} markdown={tpl.markdown} />
                <a href="#example" className="text-sm text-fg-2 underline decoration-line-2 underline-offset-4 transition hover:text-fg hover:decoration-signal">
                  See a filled example ↓
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2">
                {[`${sections} sections`, "MoSCoW features", "Rationale on every feature", "Plain Markdown"].map((chip) => (
                  <li key={chip} className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-fg-2">
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block">
              <TemplateOutline filename={tpl.filename} items={tpl.outline} />
            </div>
          </div>
        </div>
      </header>

      <div className="wrap pb-10">
        <div className="mb-10 lg:hidden">
          <MobileToc items={toc} />
        </div>
        <div className="grid gap-12 lg:grid-cols-[14rem_1fr] xl:grid-cols-[16rem_1fr]">
          <TemplateToc
            items={toc}
            footer={
              <div className="rounded-2xl border border-line bg-surface p-4">
                <p className="text-[0.85rem] leading-snug text-fg-2">Take the template with you.</p>
                <div className="mt-3">
                  <TemplateActions templateName={tpl.slug} filename={tpl.filename} markdown={tpl.markdown} size="sm" />
                </div>
              </div>
            }
          />

          <article className="min-w-0 max-w-3xl">
            <DocSection
              id="template"
              n="01"
              title="The template"
              lead="Copy it, download it as a .md file, or read it here. Guidance sits in HTML comments, which most Markdown renderers hide."
            >
              <TemplateCodeBlock templateName={tpl.slug} filename={tpl.filename} markdown={tpl.markdown} />
            </DocSection>

            <DocSection id="guide" n="02" title="How to fill it in, section by section" lead="What goes in each section, why it's there, and what separates a strong entry from a weak one.">
              <GuideList entries={tpl.guide} />
            </DocSection>

            <DocSection
              id="example"
              n="03"
              title={`Filled example: ${run.prd.productName}`}
              lead={`An excerpt from a real Murmur run for an ${run.idea}, generated from a ${formatDuration(run.memoSeconds, "clock")} voice memo. Unedited; the full PRD, competitor research and Jira board are on the example page.`}
            >
              <div className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3 sm:px-7">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-fg-3">
                    {run.prd.productName} · {run.category}
                  </p>
                  <p className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-fg-3">
                    <span className="rec-dot text-signal" aria-hidden="true" /> Real run · unedited
                  </p>
                </div>

                <div className="p-5 sm:p-7">
                  <Sub>One-liner</Sub>
                  <p className="font-display text-xl font-semibold leading-snug tracking-[-0.015em] text-fg">{prd.oneLiner}</p>

                  <Sub>Target user</Sub>
                  <p className="text-[0.98rem] leading-relaxed text-fg-2">{prd.targetUser}</p>

                  <Sub>Features</Sub>
                  <dl className="mb-6 grid grid-cols-4 gap-2">
                    {counts.map(([k, v]) => (
                      <div key={k} className="rounded-xl border border-line bg-surface-2 px-3 py-2.5">
                        <dt className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fg-3">{k}</dt>
                        <dd className="font-display text-2xl font-semibold tracking-[-0.03em] text-fg">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <FeatureGroup tone="must" items={musts} total={f.must_have.length} />
                  <FeatureGroup tone="wont" items={wonts} total={f.wont_have.length} />

                  <Sub>Success metrics</Sub>
                  <Rows head={["Metric", "Target"]} rows={metrics.map((m) => [m.metric, m.target])} />

                  <Sub>Competitive landscape</Sub>
                  <Rows head={["Competitor", "Positioning delta"]} rows={landscape.map((c) => [c.competitor, c.positioningDelta])} />
                </div>

                <div className="flex flex-col gap-3 border-t border-line bg-surface-2/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <p className="font-mono text-[0.7rem] text-fg-3">
                    Showing {musts.length + wonts.length} of {f.must_have.length + f.should_have.length + f.could_have.length + f.wont_have.length} features,{" "}
                    {metrics.length} of {prd.successMetrics.length} metrics, {landscape.length} of {prd.competitiveLandscape.length} competitors
                  </p>
                  <Link href={`/examples/${run.slug}#prd`} className="group inline-flex items-center gap-2 text-sm font-medium text-fg">
                    Read the full {run.prd.productName} PRD <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </DocSection>

            <TemplateCta
              title="Murmur fills this template from a voice memo."
              body="Talk through your idea for a couple of minutes. Murmur researches competitors, then writes this PRD section by section, grounded in your memo and the research, plus a brand kit, engineering brief, roadmap, Jira board and Confluence space. Your first idea is free."
            />

            <DocSection id="faq" n="04" title="PRD template FAQ">
              <FaqList items={tpl.faq} />
            </DocSection>

            <div className="mt-12">
              <NextTemplate
                href="/templates/technical-design-document"
                label="Technical design document template"
                blurb="Turn the PRD into components, data models, schema, stack and ordered tasks."
              />
            </div>
          </article>
        </div>
      </div>
    </PageShell>
  );
}
