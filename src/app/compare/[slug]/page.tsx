import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ChooseCards } from "@/components/compare/ChooseCards";
import { Cite } from "@/components/compare/Cite";
import { CompareFaq } from "@/components/compare/CompareFaq";
import { CompareTable } from "@/components/compare/CompareTable";
import { CtaBand } from "@/components/examples/CtaBand";
import { PageShell } from "@/components/site/PageShell";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { competitors, getCompetitor, sourceList } from "@/content/compare";
import { runStats } from "@/content/runs";
import { absoluteUrl, emails, ORG_NAME } from "@/lib/site";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

type Params = { slug: string };

export function generateStaticParams() {
  return competitors.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCompetitor(slug);
  if (!c) return {};
  const { title, description } = c.seo;
  const url = absoluteUrl(`/compare/${slug}`);
  return {
    // Already names Murmur; skip the "· Murmur" template suffix to stay under 60 chars.
    title: { absolute: title },
    description,
    alternates: { canonical: `/compare/${slug}` },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const toc = [
  { id: "side-by-side", label: "Side by side" },
  { id: "which-fits", label: "Which fits" },
  { id: "faq", label: "FAQ" },
  { id: "sources", label: "Sources" },
];

function Section({
  id,
  n,
  title,
  lead,
  className = "",
  children,
}: {
  id: string;
  n: string;
  title: string;
  lead?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`scroll-mt-28 border-t border-line pt-14 sm:pt-16 ${className || "pb-14 sm:pb-16"}`}>
      <p className="font-mono text-xs text-signal">{n}</p>
      <h2 id={`${id}-h`} className="display-3 mt-2">
        {title}
      </h2>
      {lead ? <p className="lede mt-3 max-w-3xl !text-[1.02rem]">{lead}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default async function ComparePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = getCompetitor(slug);
  if (!c) notFound();

  const sources = sourceList(c);
  const stats = runStats();
  const path = `/compare/${slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Murmur vs ${c.name}`,
    description: c.seo.description,
    datePublished: c.checkedAt,
    dateModified: c.checkedAt,
    author: { "@type": "Organization", name: ORG_NAME, url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: ORG_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/icons/icon-512.png") } },
    mainEntityOfPage: absoluteUrl(path),
    about: [
      { "@type": "SoftwareApplication", name: "Murmur", url: absoluteUrl("/") },
      { "@type": "SoftwareApplication", name: c.name, url: c.url },
    ],
    citation: sources.map((s) => s.url),
  };
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Murmur", path: "/" },
    { name: `Murmur vs ${c.name}`, path },
  ]);

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, breadcrumbs]) }} />

      <header className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <div aria-hidden="true" className="absolute -right-40 -top-48 -z-10 size-[36rem] rounded-full bg-signal opacity-[0.12] blur-[120px]" />
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-fg-3">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-fg">
                  Murmur
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-fg-2">
                Murmur vs {c.name}
              </li>
            </ol>
          </nav>

          <Eyebrow dot className="mt-8">
            Comparison · Facts checked <time dateTime={c.checkedAt}>{c.checkedAt}</time>
          </Eyebrow>
          <h1 className="display-1 balance mt-4 max-w-5xl">
            Murmur <span className="serif-accent text-fg-2">vs</span> {c.name}
          </h1>
          <p className="lede mt-5 max-w-3xl">{c.summary}</p>
          <p className="mt-4 max-w-3xl text-[0.95rem] leading-relaxed text-fg-3">
            {c.name}&apos;s own pitch: <q className="text-fg-2">{c.positioning.text}</q>
            <Cite c={c} ids={c.positioning.src} />. Every claim about {c.shortName} on this page links to its source.
          </p>

          <nav aria-label="On this page" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="inline-flex rounded-full border border-line px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-fg-2 transition-colors hover:border-line-2 hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="wrap pb-10">
        <Section
          id="side-by-side"
          n="01"
          title="Side by side"
          lead={`What each tool takes in, what it gives back, and what it costs. Numbers in brackets link to ${c.shortName}'s own pages.`}
        >
          <CompareTable c={c} />
        </Section>

        <Section id="which-fits" n="02" title="Which one fits?" lead="They solve different problems, so the honest answer depends on where you are.">
          <ChooseCards c={c} />
          <Link
            href="/examples"
            data-reveal
            className="card spotlight group mt-4 flex flex-col gap-5 p-6 transition hover:border-line-2 sm:p-8 md:flex-row md:items-center md:justify-between"
          >
            <div className="max-w-2xl">
              <p className="eyebrow">Judge the output yourself</p>
              <p className="display-3 mt-2">Read {stats.count} real Murmur runs, unedited.</p>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-fg-2">
                Each started as a voice memo. See the competitor research, PRD, brand kit, engineering brief and Jira board it came back with.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-fg">
              See the examples <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </Section>

        {/* CtaBand brings its own my-16, so this section skips bottom padding. */}
        <Section id="faq" n="03" title={`Murmur vs ${c.shortName}: questions`} className="pb-0">
          <div className="max-w-4xl">
            <CompareFaq c={c} />
          </div>
        </Section>

        <CtaBand
          location="compare_page"
          title="Say the idea out loud. Get the whole foundation."
          body="Record a memo and get research with sources, a PRD, brand kit, engineering brief, roadmap, and a new Jira project and Confluence space. Your first idea is free."
        />

        <Section
          id="sources"
          n="04"
          title="Sources"
          lead={
            <>
              Facts checked <time dateTime={c.checkedAt}>{c.checkedAt}</time>. Pricing and features change; each page below was read on that date.
              Spot something out of date? Email{" "}
              <a href={`mailto:${emails.hello}`} className="text-fg underline decoration-line-2 underline-offset-4 hover:decoration-signal">
                {emails.hello}
              </a>{" "}
              and we&apos;ll fix it.
            </>
          }
        >
          <ol className="grid max-w-4xl gap-2">
            {sources.map((s) => (
              <li
                key={s.id}
                id={`source-${s.id}`}
                className="flex scroll-mt-28 gap-4 rounded-xl border border-line bg-surface px-4 py-3 transition-colors target:border-signal/60 target:bg-signal-soft"
              >
                <span className="font-mono text-xs leading-6 text-fg-3">[{s.n}]</span>
                <div className="min-w-0">
                  <p className="text-[0.95rem] text-fg">{s.title}</p>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="block break-words font-mono text-xs text-fg-3 underline decoration-line-2 underline-offset-2 hover:text-signal"
                  >
                    {s.url.replace(/^https?:\/\/(www\.)?/, "")} ↗
                  </a>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-3xl text-[0.9rem] leading-relaxed text-fg-3">
            Murmur&apos;s column describes the current product and pricing. Run times come from the{" "}
            <Link href="/examples" className="text-fg-2 underline decoration-line-2 underline-offset-4 hover:decoration-signal">
              public example runs
            </Link>
            .
          </p>
        </Section>
      </div>
    </PageShell>
  );
}
