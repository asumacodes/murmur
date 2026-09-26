import Link from "next/link";
import type { ReactNode } from "react";
import { CtaBand } from "@/components/examples/CtaBand";
import type { FaqItem } from "@/content/faq";
import type { Contrast, GuideEntry, OutlineItem, RunQuote } from "@/content/templates/types";

/* ---------- Inline rich text: **bold**, *italic*, `code`, [label](/href) ---------- */

const TOKEN = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

export function Rich({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-fg">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.84em] text-fg [overflow-wrap:anywhere]">
              {part.slice(1, -1)}
            </code>
          );
        }
        const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
        if (link) {
          return (
            <Link key={i} href={link[2]} className="text-fg underline decoration-signal/50 underline-offset-4 transition hover:decoration-signal">
              {link[1]}
            </Link>
          );
        }
        if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return part;
      })}
    </>
  );
}

/* ---------- Header ---------- */

export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-xs text-fg-3">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-fg">
            Murmur
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>Templates</li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-fg-2">
          {current}
        </li>
      </ol>
    </nav>
  );
}

/** The template's own section list, drawn as a document outline. */
export function TemplateOutline({ filename, items }: { filename: string; items: OutlineItem[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line px-5 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-line-2" />
          <span className="size-2 rounded-full bg-line-2" />
          <span className="size-2 rounded-full bg-line-2" />
        </span>
        <span className="ml-2 truncate font-mono text-[0.72rem] text-fg-3">{filename}</span>
      </div>
      <p className="px-5 pt-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-fg-3">What&apos;s inside</p>
      <ol className="px-5 pb-5 pt-2">
        {items.map((item, i) => (
          <li key={item.title} className="flex items-baseline gap-3 border-b border-line py-2.5 last:border-0">
            <span className="font-mono text-[0.66rem] text-signal">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0">
              <span className="block text-[0.95rem] font-medium text-fg">{item.title}</span>
              <span className="block text-[0.82rem] leading-snug text-fg-3">{item.note}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Table of contents ---------- */

export type TocItem = { id: string; label: string; children?: { id: string; label: string }[] };

function TocList({ items }: { items: TocItem[] }) {
  return (
    <ol className="grid gap-1 border-l border-line">
      {items.map((item, i) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="-ml-px flex gap-3 border-l border-transparent py-1.5 pl-4 text-sm text-fg-2 transition hover:border-signal hover:text-fg">
            <span className="font-mono text-[0.68rem] text-fg-3">{String(i + 1).padStart(2, "0")}</span>
            {item.label}
          </a>
          {item.children?.length ? (
            <ol className="mb-1 grid">
              {item.children.map((child) => (
                <li key={child.id}>
                  <a
                    href={`#${child.id}`}
                    className="-ml-px block border-l border-transparent py-1 pl-[2.6rem] text-[0.8rem] text-fg-3 transition hover:border-signal hover:text-fg"
                  >
                    {child.label}
                  </a>
                </li>
              ))}
            </ol>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function TemplateToc({ items, footer }: { items: TocItem[]; footer?: ReactNode }) {
  return (
    <aside className="hidden lg:block">
      <nav aria-label="On this page" data-lenis-prevent="" className="no-scrollbar sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4">
        <p className="eyebrow">On this page</p>
        <div className="mt-4">
          <TocList items={items} />
        </div>
        {footer ? <div className="mt-8">{footer}</div> : null}
      </nav>
    </aside>
  );
}

export function MobileToc({ items }: { items: TocItem[] }) {
  return (
    <details className="group rounded-2xl border border-line bg-surface lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
        <span className="eyebrow">On this page</span>
        <span aria-hidden="true" className="font-mono text-xs text-fg-3 transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <nav aria-label="On this page (mobile)" className="border-t border-line px-4 py-4">
        <TocList items={items} />
      </nav>
    </details>
  );
}

/* ---------- Article structure ---------- */

export function DocSection({ id, n, title, lead, children }: { id: string; n: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28 border-t border-line pb-4 pt-12 first:border-t-0 first:pt-0">
      <p className="font-mono text-xs text-signal">{n}</p>
      <h2 id={`${id}-h`} className="display-3 mt-2">
        {title}
      </h2>
      {lead ? <p className="lede mt-3 max-w-2xl !text-[1.02rem]">{lead}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function Sub({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h3 className={`mb-3 mt-10 text-[1.05rem] font-semibold text-fg first:mt-0 ${className}`}>{children}</h3>;
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[0.98rem] leading-relaxed text-fg-2">
          <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-fg-3" aria-hidden="true" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Guide ---------- */

function SourceLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="font-mono text-[0.66rem] uppercase tracking-[0.1em] text-fg-3 underline decoration-line-2 underline-offset-4 transition hover:text-signal">
      From the {label} ↗
    </Link>
  );
}

function ContrastBlock({ contrast }: { contrast: Contrast }) {
  return (
    <div className="mt-5 grid gap-2">
      <div className="flex gap-3 rounded-xl border border-line bg-surface px-4 py-3">
        <span className="mt-0.5 shrink-0 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-fg-3">Weak</span>
        <p className="min-w-0 text-[0.93rem] leading-relaxed text-fg-3 line-through decoration-fg-3/40">{contrast.weak}</p>
      </div>
      <div className="rounded-xl border border-ok/35 bg-surface px-4 py-3">
        <div className="flex gap-3">
          <span className="mt-0.5 shrink-0 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-ok">Strong</span>
          <p className="min-w-0 text-[0.93rem] leading-relaxed text-fg">{contrast.strong}</p>
        </div>
        {contrast.breakdown?.length ? (
          <dl className="mt-3 grid gap-x-4 gap-y-2 border-t border-line pt-3 sm:grid-cols-2">
            {contrast.breakdown.map((b) => (
              <div key={b.label} className="min-w-0">
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-fg-3">{b.label}</dt>
                <dd className="text-[0.88rem] text-fg-2">{b.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {contrast.strongSource ? (
          <p className="mt-3">
            <SourceLink {...contrast.strongSource} />
          </p>
        ) : null}
      </div>
    </div>
  );
}

function QuoteBlock({ quote }: { quote: RunQuote }) {
  return (
    <figure className="mt-5 rounded-xl border border-signal/35 bg-signal-soft px-4 py-3.5">
      {quote.title ? <p className="font-mono text-[0.64rem] uppercase tracking-[0.1em] text-fg-2">{quote.title}</p> : null}
      <blockquote className={`text-[0.95rem] leading-relaxed text-fg ${quote.title ? "mt-1.5" : ""}`}>
        <p>“{quote.text}”</p>
      </blockquote>
      <figcaption className="mt-2.5">
        <SourceLink label={quote.label} href={quote.href} />
      </figcaption>
    </figure>
  );
}

export function GuideList({ entries, idPrefix = "guide-" }: { entries: GuideEntry[]; idPrefix?: string }) {
  return (
    <div className="grid gap-4">
      {entries.map((entry) => (
        <article key={entry.id} id={`${idPrefix}${entry.id}`} aria-labelledby={`${idPrefix}${entry.id}-h`} className="scroll-mt-28 rounded-2xl border border-line bg-surface/60 p-5 sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 id={`${idPrefix}${entry.id}-h`} className="font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-fg">
              {entry.title}
            </h3>
            <code className="font-mono text-[0.7rem] text-fg-3">{entry.heading}</code>
          </div>
          <div className="mt-3 grid gap-3">
            {entry.body.map((p) => (
              <p key={p.slice(0, 48)} className="text-[0.98rem] leading-[1.7] text-fg-2">
                <Rich text={p} />
              </p>
            ))}
          </div>
          {entry.contrast ? <ContrastBlock contrast={entry.contrast} /> : null}
          {entry.quote ? <QuoteBlock quote={entry.quote} /> : null}
        </article>
      ))}
    </div>
  );
}

/* ---------- FAQ (plain content, always visible) ---------- */

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-line">
      {items.map((item) => (
        <div key={item.q} className="border-b border-line py-6 last:border-b-0">
          <h3 className="text-[1.08rem] font-medium text-fg">{item.q}</h3>
          <p className="mt-2 text-[0.98rem] leading-relaxed text-fg-2">
            <Rich text={item.a} />
          </p>
        </div>
      ))}
    </div>
  );
}

/* ---------- CTA ---------- */

/**
 * CtaBand, with its button column kept at natural width. Inside the 48rem
 * article column the band's row layout otherwise squeezes the button until
 * its label wraps (same on /examples/[slug]; fix belongs in CtaBand).
 */
export function TemplateCta({ title, body }: { title: string; body: string }) {
  return (
    <div className="[&_aside>div.relative>div:last-child]:shrink-0">
      <CtaBand location="template_page" title={title} body={body} />
    </div>
  );
}

/* ---------- Footer nav ---------- */

export function NextTemplate({ href, label, blurb }: { href: string; label: string; blurb: string }) {
  return (
    <nav aria-label="More templates" className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between">
      <Link href="/examples" className="text-sm text-fg-2 hover:text-fg">
        ← Real PRD examples
      </Link>
      <Link href={href} className="group sm:max-w-md sm:text-right">
        <span className="block font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fg-3">Next template</span>
        <span className="font-display text-xl font-semibold tracking-[-0.02em] text-fg">
          {label} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
        <span className="mt-1 block text-[0.88rem] text-fg-3">{blurb}</span>
      </Link>
    </nav>
  );
}

/* ---------- Helpers ---------- */

/**
 * Picks items by name, in the given order, then tops up from the start of the
 * list so a renamed item in the run data never leaves a gap on the page.
 */
export function pickByName<T>(items: T[], nameOf: (item: T) => string, names: string[], count: number): T[] {
  const picked = names.map((n) => items.find((item) => nameOf(item) === n)).filter((item): item is T => item !== undefined);
  for (const item of items) {
    if (picked.length >= count) break;
    if (!picked.includes(item)) picked.push(item);
  }
  return picked.slice(0, count);
}

/** Number of top-level (##) sections in a Markdown template. */
export function countSections(markdown: string) {
  return markdown.split("\n").filter((l) => /^##\s/.test(l)).length;
}
