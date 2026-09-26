import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";

type LegalDocumentProps = {
  eyebrow: string;
  markdown: string;
};

const legalLinkClass =
  "!text-[var(--gold)] !underline decoration-[color-mix(in_srgb,var(--gold)_55%,transparent)] underline-offset-[0.18em] transition-[color,text-decoration-color] duration-[180ms] ease-[var(--ease-out)] hover:!text-[var(--gold-bright)] hover:decoration-[var(--gold-bright)]";

const markdownComponents: Components = {
  h1({ children }) {
    return (
      <h1 className="display-2 mb-5 text-[var(--text-primary)] first:mt-0">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    return (
      <h2 className="mt-11 mb-4 text-[1.25rem] leading-[1.3] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
        {children}
      </h2>
    );
  },
  p({ children }) {
    return <p className="mb-[1.1rem] first:mt-0">{children}</p>;
  },
  strong({ children }) {
    return (
      <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>
    );
  },
  em({ children }) {
    return <em className="text-[var(--text-tertiary)]">{children}</em>;
  },
  ul({ children }) {
    return <ul className="mb-5 list-disc pl-5 marker:text-[var(--gold)]">{children}</ul>;
  },
  li({ children }) {
    return <li className="mb-[0.55rem]">{children}</li>;
  },
  hr() {
    return <hr className="my-8 border-0 border-t border-[var(--border-subtle)]" />;
  },
  code({ children }) {
    return (
      <code className="font-mono-text text-[0.9em] text-[var(--text-primary)]">
        {children}
      </code>
    );
  },
  a({ href, children }) {
    const isExternal = href?.startsWith("http");
    const isMail = href?.startsWith("mailto:");

    return (
      <a
        href={href}
        className={legalLinkClass}
        {...(isExternal && !isMail
          ? { target: "_blank", rel: "noopener noreferrer" }
          : undefined)}
      >
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className="mb-6 w-full overflow-x-auto">
        <table className="mb-0 w-full min-w-[36rem] border-collapse text-[0.95rem] max-sm:text-base">
          {children}
        </table>
      </div>
    );
  },
  th({ children }) {
    return (
      <th className="border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-elevated)_88%,var(--gold-faint))] px-[0.85rem] py-3 text-left align-top text-[0.8rem] font-semibold tracking-[0.02em] text-[var(--text-primary)] max-sm:px-[0.7rem] max-sm:py-[0.65rem]">
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td className="border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-elevated)_55%,transparent)] px-[0.85rem] py-3 text-left align-top max-sm:px-[0.7rem] max-sm:py-[0.65rem]">
        {children}
      </td>
    );
  },
};

export function LegalDocument({ eyebrow, markdown }: LegalDocumentProps) {
  return (
    <PageShell>
      <div className="wrap pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-[46rem]">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-fg-3 transition-colors hover:text-fg">
            <span aria-hidden="true">←</span> Murmur
          </Link>
          <p className="eyebrow">{eyebrow}</p>
          <article className="mt-5 text-[1.05rem] leading-[1.75] text-fg-2 max-sm:text-base [&_:first-child]:mt-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {markdown}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </PageShell>
  );
}
