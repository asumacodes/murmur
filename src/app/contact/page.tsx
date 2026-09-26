import type { Metadata } from "next";
import { SimplePage } from "@/components/site/SimplePage";
import { contact } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email hey@trymurmur.studio with any question about Murmur. Most emails get a reply within one business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <SimplePage eyebrow={contact.eyebrow} title={contact.headline}>
      <p className="text-[1.08rem] leading-relaxed text-fg-2">{contact.body}</p>
      <a
        href={`mailto:${contact.email}`}
        className="display-3 mt-8 inline-block text-signal underline decoration-signal/30 underline-offset-8 transition hover:decoration-signal"
      >
        {contact.email}
      </a>
      <div className="mt-6 grid gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-3">
        <p>{contact.responsePromise}</p>
        <p>{contact.featureRequestPromise}</p>
      </div>
      <p className="mt-8 text-[0.95rem] text-fg-2">
        {contact.support.body}{" "}
        <a href={`mailto:${contact.support.email}`} className="text-fg underline decoration-line-2 underline-offset-4 hover:decoration-signal">
          {contact.support.email}
        </a>
      </p>
      <div className="mt-10 border-t border-line pt-6">
        <a href={contact.sprintZero.href} target="_blank" rel="noopener noreferrer" className="text-sm text-fg-2 transition hover:text-fg">
          {contact.sprintZero.label}
        </a>
      </div>
    </SimplePage>
  );
}
