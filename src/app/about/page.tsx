import type { Metadata } from "next";
import { Container, SectionEyebrow } from "@/components/ui";
import { about } from "@/content/about";
import { focusRingClass, goldLinkClass } from "@/lib/styles";

export const metadata: Metadata = {
  title: "About · Murmur",
  description:
    "Murmur is a product of SprintZero Studios, built in public by a solo founder in Chandigarh. Honesty is the moat.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
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
          <SectionEyebrow>{about.eyebrow}</SectionEyebrow>
          <h1 className="font-serif-display mt-4 text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.1] tracking-[-0.02em]">
            {about.headline}
          </h1>
          <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-[var(--text-secondary)] max-sm:text-base">
            {about.body.map((para) => (
              <p key={para.slice(0, 32)}>{para}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono-text text-sm">
            {about.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${focusRingClass} ${goldLinkClass} rounded-sm`}
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
