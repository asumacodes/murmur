"use client";

import { useRef } from "react";
import { Container, SectionHeader } from "@/components/ui";
import { comparison } from "@/content/home";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";
import { sectionPadClass } from "@/lib/styles";

export function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionReveal({
    scope: sectionRef,
    scrollEnter,
    groups: [
      {
        selector: ".comparison-header > *",
        trigger: ".comparison-header",
        from: { autoAlpha: 0, y: 40 },
        to: { duration: 0.95, stagger: 0.14, ease: PREMIUM_EASE },
      },
      {
        selector: ".comparison-colhead",
        trigger: ".comparison-table",
        from: { autoAlpha: 0, y: 16 },
        to: { duration: 0.7, ease: PREMIUM_EASE },
      },
      {
        selector: ".comparison-row",
        from: { autoAlpha: 0, y: 40 },
        to: { duration: 0.85, stagger: 0.12, ease: PREMIUM_EASE },
        batch: true,
      },
    ],
  });

  return (
    <section id="comparison" ref={sectionRef} className={sectionPadClass}>
      <Container>
        <SectionHeader
          className="comparison-header !max-w-3xl"
          eyebrowClassName="opacity-0"
          titleClassName="opacity-0"
          subheadClassName="opacity-0"
          eyebrow={comparison.eyebrow}
          title={comparison.headline}
          subhead={comparison.subhead}
        />

        <div className="comparison-table w-full border-t border-[var(--border-subtle)]">
          {/* Sticky dual column heads — table, not journal, on every breakpoint */}
          <div
            className="comparison-colhead sticky top-[4.5rem] z-[1] grid grid-cols-2 gap-x-3 border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-deep)_92%,transparent)] py-3 opacity-0 backdrop-blur-sm md:top-[5rem] md:grid-cols-[8.5rem_minmax(0,1fr)_minmax(0,1.15fr)] md:gap-x-8 md:bg-transparent md:py-3 md:backdrop-blur-none lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-x-10"
            aria-hidden="true"
          >
            <span className="hidden md:block" />
            <span className="font-mono-text text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)] md:text-[0.65rem] md:tracking-[0.14em]">
              {comparison.manualLabel}
            </span>
            <span className="font-mono-text text-[0.62rem] uppercase tracking-[0.12em] text-[var(--gold)] md:text-[0.65rem] md:tracking-[0.14em]">
              {comparison.murmurLabel}
            </span>
          </div>

          {comparison.rows.map((row) => (
            <div
              key={row.dimension}
              className="comparison-row grid grid-cols-2 gap-x-3 gap-y-2 border-b border-[var(--border-subtle)] py-4 opacity-0 md:grid-cols-[8.5rem_minmax(0,1fr)_minmax(0,1.15fr)] md:gap-x-8 md:gap-y-0 md:py-4 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-x-10"
            >
              <div className="col-span-2 font-mono-text text-[0.65rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)] md:col-span-1 md:pt-0.5 md:text-[0.68rem]">
                {row.dimension}
              </div>
              <div className="text-[0.8125rem] leading-[1.5] text-[var(--text-secondary)] sm:text-[0.875rem] md:text-[0.95rem] md:leading-[1.55]">
                {row.manual}
              </div>
              <div className="relative text-[0.8125rem] leading-[1.5] text-[var(--text-primary)] sm:text-[0.875rem] md:pl-5 md:text-[0.95rem] md:leading-[1.55] md:before:absolute md:before:top-0 md:before:bottom-0 md:before:left-0 md:before:w-px md:before:bg-[color-mix(in_srgb,var(--gold)_40%,transparent)]">
                {row.murmur}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
