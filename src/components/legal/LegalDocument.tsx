import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Container } from "@/components/ui";

type LegalDocumentProps = {
  eyebrow: string;
  markdown: string;
};

const markdownComponents: Components = {
  a({ href, children }) {
    const isExternal = href?.startsWith("http");

    return (
      <a
        href={href}
        className="legal-link"
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : undefined)}
      >
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className="table-wrap">
        <table>{children}</table>
      </div>
    );
  },
};

export function LegalDocument({ eyebrow, markdown }: LegalDocumentProps) {
  return (
    <main className="section-pad legal-page">
      <Container>
        <div className="legal-shell">
          <a href="/" className="legal-back">
            ← Murmur
          </a>
          <p className="font-mono-text text-xs uppercase tracking-[0.15em] text-[var(--gold)]">
            {eyebrow}
          </p>
          <article className="legal-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {markdown}
            </ReactMarkdown>
          </article>
        </div>
      </Container>
    </main>
  );
}
