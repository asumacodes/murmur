import type { Metadata } from "next";
import { Container, SectionEyebrow } from "@/components/ui";
import { contact } from "@/content/contact";
import { focusRingClass, goldLinkClass } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Contact · Murmur",
  description:
    "Questions about Murmur or the waitlist? Email hey@trymurmur.studio. We reply within one business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="pt-[clamp(3rem,6vw,5.5rem)] pb-[clamp(4.5rem,10vw,10rem)]">
      <Container>
        <div className="mx-auto max-w-[44rem]">
          <a
            href="/"
            className="mb-10 inline-flex items-center text-sm text-[var(--text-tertiary)] transition-colors duration-[180ms] ease-[var(--ease-out)] hover:text-[var(--gold)]"
          >
            ← Murmur
          </a>
          <SectionEyebrow>{contact.eyebrow}</SectionEyebrow>
          <h1 className="font-serif-display mt-4 text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.1] tracking-[-0.02em]">
            {contact.headline}
          </h1>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-[var(--text-secondary)] max-sm:text-base">
            {contact.body}
          </p>

          <a
            href={`mailto:${contact.email}`}
            className={`${focusRingClass} font-serif-display mt-8 inline-block rounded-sm text-[clamp(1.5rem,3vw,2rem)] text-[var(--gold)] transition-colors hover:text-[var(--gold-bright)]`}
          >
            {contact.email}
          </a>

          <p className="font-mono-text mt-4 text-xs uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            {contact.responsePromise}
          </p>

          <div className="mt-10 border-t border-[var(--border-subtle)] pt-6">
            <a
              href={contact.sprintZero.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${focusRingClass} ${goldLinkClass} font-mono-text rounded-sm text-sm`}
            >
              {contact.sprintZero.label}
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
}
