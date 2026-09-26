import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shortStack } from "@/components/artifacts/Artifacts";
import { PageShell } from "@/components/site/PageShell";
import { buildTemplateSchemas } from "@/components/templates/schema";
import { TemplateActions, TemplateCodeBlock } from "@/components/templates/TemplateCodeBlock";
import {
  Breadcrumb,
  Bullets,
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
import { formatDuration, getRun } from "@/content/runs";
import { technicalDesignTemplate as tpl } from "@/content/templates/technical-design-document";
import { absoluteUrl } from "@/lib/site";

const PATH = "/templates/technical-design-document";
const TITLE = "Technical Design Document Template: Free Markdown";
const DESCRIPTION =
  "Free technical design document template in Markdown: overview, data flow, components, data models, schema, stack and tasks, plus a guide and a real example.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: [
    "technical design document template",
    "tech design doc template",
    "engineering design doc template",
    "design doc template",
    "technical specification template",
  ],
  openGraph: { title: "Technical design document template (free, Markdown)", description: DESCRIPTION, url: absoluteUrl(PATH), type: "article" },
  twitter: { card: "summary_large_image", title: "Technical design document template (free, Markdown)", description: DESCRIPTION },
};

const toc: TocItem[] = [
  { id: "template", label: "The template" },
  { id: "guide", label: "How to fill it in", children: tpl.guide.map((g) => ({ id: `guide-${g.id}`, label: g.title })) },
  { id: "example", label: "Filled example" },
  { id: "faq", label: "FAQ" },
];

const STACK_LAYERS: [key: string, label: string][] = [
  ["frontend", "Frontend"],
  ["backend", "Backend"],
  ["database", "Database"],
  ["auth", "Auth"],
  ["llm", "LLM"],
  ["infra", "Infra"],
  ["devtools", "Dev tools"],
];

/** Highlights the overview's "one thing it must get right" sentence, if present. */
function Overview({ text }: { text: string }) {
  const start = text.indexOf("The one thing");
  const end = start >= 0 ? text.indexOf(";", start) : -1;
  if (start < 0 || end < 0) return <p className="text-[0.98rem] leading-relaxed text-fg-2">{text}</p>;
  return (
    <p className="text-[0.98rem] leading-relaxed text-fg-2">
      {text.slice(0, start)}
      <mark className="rounded bg-signal-soft px-0.5 text-fg [box-decoration-break:clone]">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </p>
  );
}

export default function TechnicalDesignTemplatePage() {
  const run = getRun("creature-clash");
  if (!run) notFound();

  const eng = run.engineering;
  const name = run.title.split(":")[0].trim();
  const components = pickByName(eng.components, (c) => c.name, ["Duel Battle Engine", "AI Trainer Decision Engine", "Local Persistence & Save Layer"], 3);
  const badge = eng.dataModels.find((m) => m.entity === "Badge");
  const stack = STACK_LAYERS.filter(([key]) => eng.techStack[key]).map(([key, label]) => {
    const value = eng.techStack[key];
    const head = shortStack(value, 60);
    // Drop the headline from the detail when the detail simply repeats it ("Not required. …").
    const repeats = value.startsWith(`${head}.`) || value.startsWith(`${head};`);
    const rest = repeats ? value.slice(head.length + 1).trim() : value;
    const detail = rest.charAt(0).toUpperCase() + rest.slice(1);
    return { label, head, detail };
  });
  const tasks = eng.tasks.slice(0, 4);
  // The guide above already quotes the "this doc assumed…" question; show two others that also flag assumptions.
  const questions = eng.openQuestions.filter((q) => !q.includes("(from PRD)") && !q.includes("this doc assumed")).slice(0, 2);
  const sections = countSections(tpl.markdown);

  const schemas = buildTemplateSchemas({
    headline: "Technical design document template (free, Markdown)",
    description: DESCRIPTION,
    path: PATH,
    name: "Technical design document template",
    about: ["Technical design document", "Design doc", "Software architecture", "Database schema", "Engineering planning"],
  });

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <header className="relative isolate overflow-hidden pb-14 pt-32 sm:pt-40">
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: "radial-gradient(55% 60% at 88% 0%, var(--signal-soft), transparent 70%)" }} />
        <div className="wrap">
          <Breadcrumb current="Technical design document" />
          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_21rem] lg:items-center xl:grid-cols-[1fr_23rem]">
            <div className="min-w-0">
              <Eyebrow dot>Free template · Markdown · no sign-up</Eyebrow>
              <h1 className="display-1 balance mt-4 max-w-4xl">
                Technical design document template <span className="serif-accent text-fg-2">in Markdown.</span>
              </h1>
              <p className="lede mt-5 max-w-2xl">
                A tech design doc template that turns a PRD into something engineers can build and reviewers can challenge: overview, data flow,
                components, data models, schema, a stack with a reason for every layer, ordered tasks and open questions. It mirrors the engineering
                brief Murmur writes, and the filled example below comes from a real run.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <TemplateActions templateName={tpl.slug} filename={tpl.filename} markdown={tpl.markdown} />
                <a href="#example" className="text-sm text-fg-2 underline decoration-line-2 underline-offset-4 transition hover:text-fg hover:decoration-signal">
                  See a filled example ↓
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2">
                {[`${sections} sections`, "SQL + TypeScript schema", "7-layer stack", "Plain Markdown"].map((chip) => (
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

            <DocSection id="guide" n="02" title="How to fill it in, section by section" lead="What goes in each section, why reviewers need it, and the habits that make a design doc worth reading.">
              <GuideList entries={tpl.guide} />
            </DocSection>

            <DocSection
              id="example"
              n="03"
              title={`Filled example: ${name}`}
              lead={`An excerpt from the engineering brief of a real Murmur run: a private prototype of a mobile creature-battler game, generated from a ${formatDuration(run.memoSeconds, "clock")} voice memo. Unedited; the full brief, PRD and Jira board are on the example page.`}
            >
              <div className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3 sm:px-7">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-fg-3">
                    {name} · {run.category}
                  </p>
                  <p className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-fg-3">
                    <span className="rec-dot text-signal" aria-hidden="true" /> Real run · unedited
                  </p>
                </div>

                <div className="p-5 sm:p-7">
                  {eng.overview ? (
                    <>
                      <Sub>Overview</Sub>
                      <Overview text={eng.overview} />
                    </>
                  ) : null}

                  <Sub>Components</Sub>
                  <ul className="grid gap-3">
                    {components.map((c) => (
                      <li key={c.name} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
                        <p className="font-medium text-fg">{c.name}</p>
                        {c.responsibility ? <p className="mt-1.5 text-[0.9rem] leading-relaxed text-fg-2">{c.responsibility}</p> : null}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 font-mono text-[0.7rem] text-fg-3">
                    {components.length} of {eng.components.length} components
                  </p>

                  {badge ? (
                    <>
                      <Sub>Data model: {badge.entity}</Sub>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-line bg-surface p-4">
                          <p className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-fg-3">Fields</p>
                          <ul className="mt-2 grid gap-1 font-mono text-[0.8rem] text-fg-2">
                            {badge.fields.map((field) => (
                              <li key={field.name} className="flex justify-between gap-3">
                                <span className="text-fg">{field.name}</span>
                                <span className="text-fg-3">{field.type}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl border border-line bg-surface p-4">
                          <p className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-fg-3">Relationships</p>
                          <ul className="mt-2 grid gap-1 text-[0.88rem] text-fg-2">
                            {badge.relationships.map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : null}

                  {eng.schemaSqlExcerpt ? (
                    <>
                      <Sub>Schema (excerpt)</Sub>
                      <pre tabIndex={0} aria-label="SQL schema excerpt" className="overflow-x-auto rounded-2xl border border-line bg-surface-2 p-4 font-mono text-[0.78rem] leading-relaxed text-fg-2">
                        <code>{eng.schemaSqlExcerpt}</code>
                      </pre>
                    </>
                  ) : null}

                  <Sub>Tech stack</Sub>
                  <dl className="overflow-hidden rounded-2xl border border-line">
                    {stack.map(({ label, head, detail }) => (
                      <div key={label} className="grid gap-1 border-b border-line px-4 py-3 last:border-0 sm:grid-cols-[7rem_1fr] sm:gap-4">
                        <dt className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-fg-3 sm:pt-0.5">{label}</dt>
                        <dd className="text-[0.9rem] leading-relaxed text-fg-2">
                          <span className="font-medium text-fg">{head}</span>
                          {detail ? <span className="mt-0.5 block text-fg-3">{detail}</span> : null}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Sub>Engineering tasks</Sub>
                  <ol className="grid gap-4">
                    {tasks.map((t, i) => (
                      <li key={t.title} className="flex gap-4">
                        <span className="pt-0.5 font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                        <div className="min-w-0">
                          <p className="font-medium text-fg">{t.title}</p>
                          <p className="mt-0.5 text-[0.9rem] leading-relaxed text-fg-2">{t.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 font-mono text-[0.7rem] text-fg-3">
                    First {tasks.length} of {eng.tasks.length} tasks, in build order
                  </p>

                  {questions.length ? (
                    <>
                      <Sub>Open engineering questions</Sub>
                      <Bullets items={questions} />
                      <p className="mt-3 font-mono text-[0.7rem] text-fg-3">
                        {questions.length} of {eng.openQuestions.length} questions
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 border-t border-line bg-surface-2/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <p className="font-mono text-[0.7rem] text-fg-3">
                    Whole run: {formatDuration(run.runSeconds)} · {eng.dataModels.length} data models · {run.jira.storyCount} Jira stories
                  </p>
                  <Link href={`/examples/${run.slug}#engineering`} className="group inline-flex items-center gap-2 text-sm font-medium text-fg">
                    Read the full engineering brief <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </DocSection>

            <TemplateCta
              title="Murmur writes this design doc from a voice memo."
              body="Talk through your idea for a couple of minutes. Murmur researches competitors, writes the PRD, then this engineering brief: components, data models, a SQL schema, a reasoned stack and ordered tasks, alongside a roadmap and a Jira board. Your first idea is free."
            />

            <DocSection id="faq" n="04" title="Technical design document FAQ">
              <FaqList items={tpl.faq} />
            </DocSection>

            <div className="mt-12">
              <NextTemplate href="/templates/prd" label="PRD template" blurb="Start with what and why: MoSCoW features, success metrics and a Won't-have list." />
            </div>
          </article>
        </div>
      </div>
    </PageShell>
  );
}
