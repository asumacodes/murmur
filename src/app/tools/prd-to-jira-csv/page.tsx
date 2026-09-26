import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { CtaBand } from "@/components/examples/CtaBand";
import { PageShell } from "@/components/site/PageShell";
import { PrdToJiraTool } from "@/components/tools/PrdToJiraTool";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { getRun } from "@/content/runs";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import { buildExamplePrdMarkdown } from "@/lib/tools/prd-example";

const PATH = "/tools/prd-to-jira-csv";
const TITLE = "Free PRD to Jira CSV Converter: Epics & Stories";
const SHARE_TITLE = "PRD to Jira CSV: epics and stories, already linked";
const DESCRIPTION =
  "Paste a Markdown PRD or feature list and get a Jira CSV with epics and linked stories. Free, runs in your browser, works with Jira Cloud and Data Center.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "PRD to Jira",
    "convert PRD to Jira epics and stories",
    "Jira CSV import template",
    "Jira CSV import epics and stories",
    "Jira CSV parent epic",
    "Markdown to Jira",
  ],
  alternates: { canonical: PATH },
  // Setting openGraph here replaces the root's, so the site OG image is re-declared.
  openGraph: {
    title: SHARE_TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    siteName: "Murmur",
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: SHARE_TITLE }],
  },
  twitter: { card: "summary_large_image", title: SHARE_TITLE, description: DESCRIPTION, images: ["/twitter-image.png"] },
};

const SOURCES = [
  { label: "Import data from a CSV file", href: "https://support.atlassian.com/jira-cloud-administration/docs/import-data-from-a-csv-file/" },
  {
    label: "Keep parent-child relationships during CSV import",
    href: "https://support.atlassian.com/jira/kb/keep-issue-parent-child-mapping-during-csv-import-to-jira-cloud/",
  },
  { label: "Import data to Jira using a CSV file", href: "https://support.atlassian.com/jira-software-cloud/docs/import-data-to-a-software-project-using-a-csv-file/" },
  { label: "Create work items using the CSV importer", href: "https://support.atlassian.com/jira-software-cloud/docs/create-issues-using-the-csv-importer/" },
  { label: "Fix Epic Link CSV import errors (Data Center)", href: "https://support.atlassian.com/jira/kb/fix-epic-link-csv-import-format-errors-jira/" },
];

const cloudColumns: [string, string, string][] = [
  ["Work item ID", "A unique number per row: epics 1…n, then stories", "Work item ID"],
  ["Work type", "Epic, then Story (or Task)", "Work type"],
  ["Summary", "The heading or bullet text, up to 255 characters", "Summary"],
  ["Description", "Text after the colon, sub-bullets and paragraphs", "Description"],
  ["Parent", "On stories: the epic's Work item ID. Blank on epics", "Parent"],
  ["Priority", "Optional. High, Medium, Low or Lowest from MoSCoW", "Priority"],
  ["Labels", "Optional. One column per label, e.g. must-have", "Labels"],
];

const dcColumns: [string, string][] = [
  ["Issue Type", "Epic, then Story (or Task)"],
  ["Summary", "The heading or bullet text"],
  ["Epic Name", "On epics: a unique name (duplicates get “(2)”)"],
  ["Epic Link", "On stories: the Epic Name of its epic"],
  ["Description, Priority, Labels", "Same as the Cloud file"],
];

const rules: { rule: ReactNode; example: string }[] = [
  {
    rule: (
      <>
        <C>#</C> and <C>##</C> headings become <strong>epics</strong>. If the document opens with one <C>#</C> title followed by <C>##</C>{" "}
        sections, the title is skipped and each <C>##</C> section is an epic.
      </>
    ),
    example: "# Checkout PRD   ← title, skipped\n## Payments      ← epic 1\n## Refunds       ← epic 2",
  },
  {
    rule: (
      <>
        Bullets (<C>-</C>, <C>*</C>, <C>+</C>, <C>1.</C>, <C>- [ ]</C>) under an epic become <strong>stories</strong>, linked to that epic.
      </>
    ),
    example: "## Payments      ← epic 1\n- Apple Pay      ← Parent 1\n- Save cards     ← Parent 1",
  },
  {
    rule: (
      <>
        Text after the first colon (or a spaced hyphen, <C> - </C>) becomes the story&apos;s <strong>description</strong>, and so do indented
        sub-bullets and lines directly beneath it. Bold lead-ins like <C>**Title**:</C> work too.
      </>
    ),
    example: "- Apple Pay: one-tap on iOS\n  - Safari only for v1\n\nSummary      Apple Pay\nDescription  one-tap on iOS\n             - Safari only for v1",
  },
  {
    rule: (
      <>
        <C>###</C> headings inside an epic are stories too; everything under one, bullets included, is its description.
      </>
    ),
    example: "## Payments      ← epic\n### Apple Pay    ← story\nOne-tap checkout ← description\n- iOS 17+ only   ← description",
  },
  {
    rule: (
      <>
        Flat lists work: a line starting <C>Epic:</C> opens an epic, and the bullets or <C>Story:</C> lines below it are its stories.
      </>
    ),
    example: "Epic: Reporting  ← epic\nStory: Digest    ← story\n- Export to CSV  ← story",
  },
  {
    rule: (
      <>
        MoSCoW headings (Must have, Should have, Could have, Won&apos;t have) can add a <strong>Priority</strong> (High, Medium, Low, Lowest) and
        a label such as <C>must-have</C>. A bare bucket heading is named after the document title, e.g. “Aavaas: Must have”. Won&apos;t-have
        items are left out unless you include them.
      </>
    ),
    example: "# Aavaas\n## Must have     ← “Aavaas: Must have”\n- Plot intake    ← High, must-have\n## Could have\n- Walkthrough    ← Low, could-have",
  },
  {
    rule: (
      <>
        Paragraphs under an epic heading become the epic&apos;s description. Headings with no bullets under them (Overview, Problem…) are skipped,
        and the page tells you which. Summaries lose their Markdown and are capped at Jira&apos;s 255 characters; the overflow moves into the
        description.
      </>
    ),
    example: "## Overview      ← skipped\nContext only, no bullets.",
  },
];

const faq = [
  {
    q: "Does this work with team-managed and company-managed projects?",
    a: "Yes, in Jira Cloud both use the Parent field to connect a story to its epic, which is what the Jira Cloud format writes. The Work type values (Epic, Story or Task) must match work types that already exist in the space; Atlassian notes that team-managed spaces can't create new work types during an import.",
  },
  {
    q: "Why did my stories import without their epic?",
    a: "The usual causes: the Parent column wasn't mapped to the Parent field on the field-mapping screen; child rows sat above their parent (this tool always writes epics first); or the file went through the bulk-create importer under Search work items, which Atlassian says can't map parent-child relationships. Use External System Import instead. On Data Center, the Epic Link must match the Epic Name exactly.",
  },
  {
    q: "What happened to Epic Link and Epic Name in Jira Cloud?",
    a: "Atlassian replaced Epic Link with a single Parent field in company-managed projects, deprecated the Epic Link field in its APIs, and now shows an epic's Summary rather than its Epic Name. Team-managed projects never used Epic Name. Use the Jira Cloud format unless you're importing into self-hosted Jira Data Center.",
  },
  {
    q: "Is my PRD uploaded anywhere?",
    a: "No. Parsing and CSV generation happen in your browser, and the file is created on your device. The page records anonymous usage counts (for example, how many epics and stories a conversion produced), never the text you paste.",
  },
  {
    q: "How many work items can I import at once?",
    a: "Atlassian recommends up to 1,500 work items per file for the admin CSV importer, which takes roughly an hour at that size. The bulk-create importer available to non-admins is limited to 250 work items per file, and it can't link stories to epics.",
  },
  {
    q: "Can something write the PRD and build the Jira board for me?",
    a: "That's what Murmur does. Record a voice memo about your idea and Murmur researches competitors, writes the PRD, and creates the epics and stories directly in your own Jira site, with no CSV step. Your first idea is free.",
  },
];

function C({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-surface-3 px-1.5 py-0.5 font-mono text-[0.84em] text-fg">{children}</code>;
}

function Section({ id, n, title, lead, children }: { id: string; n: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-line pb-4 pt-12">
      <p className="font-mono text-xs text-signal">{n}</p>
      <h2 id={`${id}-h`} className="display-3 mt-2 max-w-3xl">
        {title}
      </h2>
      {lead ? <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-fg-2">{lead}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="grid gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 rounded-2xl border border-line bg-surface p-4 text-[0.95rem] leading-relaxed text-fg-2 sm:p-5">
          <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line-2 font-mono text-[0.72rem] text-fg">{i + 1}</span>
          <span className="min-w-0 pt-0.5">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function Ui({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-fg">{children}</strong>;
}

export default function PrdToJiraCsvPage() {
  const run = getRun("aavaas");
  const exampleMarkdown = run ? buildExamplePrdMarkdown(run) : "";
  const exampleName = run?.prd.productName ?? "Aavaas";

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${absoluteUrl(PATH)}#app`,
    name: "PRD to Jira CSV Converter",
    url: absoluteUrl(PATH),
    description: DESCRIPTION,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Project management",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Runs entirely in the browser; nothing is uploaded.",
    isAccessibleForFree: true,
    featureList: [
      "Converts Markdown headings to Jira epics and bullets to stories",
      "Links stories to epics with Parent and Work item ID (Jira Cloud)",
      "Epic Name and Epic Link format for Jira Data Center",
      "MoSCoW headings to Priority and labels",
      "Editable preview before download",
      "Copy or download the CSV",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": `${SITE_URL}/#org` },
  };
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Murmur", path: "/" },
    { name: "PRD to Jira CSV", path: PATH },
  ]);

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([appSchema, breadcrumbs, buildFaqSchema(faq)]) }}
      />

      <div className="wrap pb-8 pt-32 sm:pt-40">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-fg-3">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-fg">
                Murmur
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg-2">
              PRD to Jira CSV
            </li>
          </ol>
        </nav>
        <Eyebrow dot className="mt-8">
          Free tool · runs in your browser
        </Eyebrow>
        <h1 className="display-1 balance mt-5 max-w-5xl">
          PRD to Jira CSV, <span className="serif-accent text-fg-2">epics and stories already linked.</span>
        </h1>
        <p className="lede mt-6 max-w-3xl">
          Paste a Markdown PRD or a plain feature list. Check the epics and stories, fix anything in place, then download a CSV that Jira&apos;s
          importer turns into a linked backlog. No sign-up, no AI, and your text never leaves this page.
        </p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {["Jira Cloud + Data Center", "Parent-linked stories", "MoSCoW → Priority", "Nothing uploaded"].map((a) => (
            <li key={a} className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-fg-2">
              {a}
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap">
        <PrdToJiraTool exampleMarkdown={exampleMarkdown} exampleName={exampleName} />
      </div>

      <div className="wrap pt-16">
        <div className="grid gap-x-16 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <Section
              id="import"
              n="01"
              title="How to import this CSV into Jira"
              lead="Linking stories to epics needs Jira's admin CSV importer (External System Import). These are the steps in Jira Cloud today."
            >
              <Steps
                items={[
                  <>
                    Go to <Ui>Settings</Ui> (the cog) → <Ui>System</Ui>. Under <Ui>Import and Export</Ui>, select <Ui>External System Import</Ui>, then{" "}
                    <Ui>CSV</Ui>. If Jira offers the new import experience, select <Ui>switch to the old experience</Ui>.
                  </>,
                  <>
                    Choose the file you downloaded here. Leave <Ui>Use an existing configuration file</Ui> unticked; the defaults under{" "}
                    <Ui>Advanced</Ui> (UTF-8, comma delimiter) are right. Select <Ui>Next</Ui>.
                  </>,
                  <>
                    Under <Ui>Select a space</Ui>, pick the space the epics should land in, then select <Ui>Next</Ui>.
                  </>,
                  <>
                    Map each column to the Jira field of the same name: <C>Work item ID</C>, <C>Work type</C>, <C>Summary</C>, <C>Description</C>,{" "}
                    <C>Parent</C>, and <C>Priority</C> / <C>Labels</C> if present. Summary is required. Select <Ui>Next</Ui>.
                  </>,
                  <>
                    On the value-mapping screen, leave values as they are (or map <C>Story</C> to <C>Task</C> if your space has no Story type), then
                    select <Ui>Begin Import</Ui>.
                  </>,
                ]}
              />
              <div className="mt-6 grid gap-3 text-[0.93rem] leading-relaxed text-fg-2 md:grid-cols-2">
                <div className="rounded-2xl border border-line p-4 sm:p-5">
                  <p className="font-medium text-fg">Starting a new space instead?</p>
                  <p className="mt-1.5">
                    Admins can select <Ui>Create space</Ui> in the sidebar, then <Ui>Import data</Ui> → <Ui>CSV</Ui>. On the mapping screen, map
                    the columns to <Ui>work item ID</Ui>, <Ui>parent</Ui> and <Ui>work type</Ui> to keep the hierarchy.
                  </p>
                </div>
                <div className="rounded-2xl border border-line p-4 sm:p-5">
                  <p className="font-medium text-fg">Not a Jira admin?</p>
                  <p className="mt-1.5">
                    <Ui>Filters</Ui> → <Ui>Search work items</Ui> → <Ui>•••</Ui> → <Ui>Import work items from CSV</Ui>{" "}
                    imports up to 250 items, but Atlassian says it can&apos;t map parent-child links. Stories arrive unlinked, so ask an admin to run the import.
                  </p>
                </div>
              </div>
              <p className="mt-6 text-[0.93rem] leading-relaxed text-fg-2">
                <span className="font-medium text-fg">Jira Data Center:</span> choose the Data Center format above, then go to{" "}
                <Ui>Administration</Ui> → <Ui>System</Ui> → <Ui>External System Import</Ui> → <Ui>CSV</Ui> and map <C>Issue Type</C>,{" "}
                <C>Summary</C>, <C>Epic Name</C>, <C>Epic Link</C> and <C>Description</C>. If stories fail to link, import the epics-only file first
                and the stories-only file second.
              </p>
              <p className="mt-6 font-mono text-[0.7rem] leading-relaxed text-fg-3">
                Sources (Atlassian Support, checked September 2026):{" "}
                {SOURCES.map((s, i) => (
                  <span key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline decoration-line-2 underline-offset-2 hover:text-fg">
                      {s.label}
                    </a>
                    {i < SOURCES.length - 1 ? " · " : ""}
                  </span>
                ))}
              </p>
            </Section>

            <Section
              id="columns"
              n="02"
              title="The CSV columns"
              lead="Header names match Jira's field names, so every column maps one-to-one. Parents always come before their children."
            >
              <div className="relative overflow-x-auto rounded-2xl border border-line">
                <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9rem]">
                  <caption className="sr-only">Jira Cloud CSV columns</caption>
                  <thead>
                    <tr className="border-b border-line bg-surface-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fg-3">
                      <th scope="col" className="px-4 py-2.5 font-medium">
                        Jira Cloud column
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-medium">
                        What it holds
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-medium">
                        Map to
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cloudColumns.map(([col, what, map]) => (
                      <tr key={col} className="border-b border-line last:border-b-0">
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-[0.82rem] text-fg">{col}</td>
                        <td className="px-4 py-3 text-fg-2">{what}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-fg-2">{map}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 className="mb-3 mt-8 text-[1.02rem] font-semibold text-fg">Jira Data Center format</h3>
              <dl className="grid gap-2 text-[0.93rem]">
                {dcColumns.map(([col, what]) => (
                  <div key={col} className="grid gap-1 border-b border-line pb-2 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
                    <dt className="font-mono text-[0.82rem] text-fg">{col}</dt>
                    <dd className="text-fg-2">{what}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <Section
              id="parsing-rules"
              n="03"
              title="How your PRD is parsed"
              lead="Plain rules, no AI. If the preview isn't what you expected, adjust the Markdown or edit the rows before you download."
            >
              <ol className="grid gap-3">
                {rules.map((r, i) => (
                  <li key={i} className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] md:gap-5">
                    <p className="text-[0.95rem] leading-relaxed text-fg-2 [&_strong]:font-medium [&_strong]:text-fg">{r.rule}</p>
                    <pre className="overflow-x-auto rounded-xl bg-bg-2 p-3 font-mono text-[0.72rem] leading-relaxed text-fg-2">{r.example}</pre>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="faq" n="04" title="Questions about PRD to Jira imports">
              <div className="border-t border-line">
                {faq.map((item) => (
                  <div key={item.q} className="border-b border-line py-5">
                    <h3 className="text-[1.05rem] font-medium text-fg">{item.q}</h3>
                    <p className="mt-2 max-w-2xl text-[0.97rem] leading-relaxed text-fg-2">{item.a}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[0.95rem] text-fg-2">
                Want to see what that looks like?{" "}
                <Link href="/examples" className="text-fg underline decoration-line-2 underline-offset-4 hover:decoration-signal">
                  Browse real PRDs and the Jira boards Murmur built from them
                </Link>
                .
              </p>
            </Section>
          </div>

          <aside className="hidden lg:col-span-4 lg:block" aria-label="On this page">
            <div className="sticky top-28 pt-12">
              <p className="eyebrow">On this page</p>
              <ul className="mt-4 grid gap-1 border-l border-line">
                {[
                  ["#import", "Import into Jira"],
                  ["#columns", "The CSV columns"],
                  ["#parsing-rules", "Parsing rules"],
                  ["#faq", "FAQ"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a href={href} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[0.9rem] text-fg-2 transition-colors hover:border-signal hover:text-fg">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <CtaBand
          location="tool_page"
          title="No PRD yet? Say it out loud."
          body="Record a voice memo about your idea. Murmur researches competitors, writes the PRD, then creates the epics and stories straight in your own Jira, no CSV needed. Your first idea is free."
        />
      </div>
    </PageShell>
  );
}
