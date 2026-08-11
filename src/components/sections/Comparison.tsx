"use client";

import { useRef } from "react";
import { Container, SectionEyebrow } from "@/components/ui";
import { comparison } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollEnterSoft } from "@/lib/motion";

export function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const revealTargets = [".comparison-header > *", ".comparison-row"];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(revealTargets, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ".comparison-header > *",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, ...scrollEnterSoft },
        },
      );

      gsap.fromTo(
        ".comparison-row",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: ".comparison-table", ...scrollEnterSoft },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="comparison" ref={sectionRef} className="section-pad">
      <Container>
        <div className="comparison-header mb-10 max-w-3xl lg:mb-12">
          <SectionEyebrow className="opacity-0">{comparison.eyebrow}</SectionEyebrow>
          <h2 className="font-serif-display mt-4 text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08] opacity-0">
            {comparison.headline}
          </h2>
          <p className="mt-5 max-w-2xl text-[var(--text-secondary)] opacity-0">
            {comparison.subhead}
          </p>
        </div>

        <div className="comparison-table">
          <div className="comparison-colhead" aria-hidden="true">
            <span className="comparison-colhead-dim" />
            <span className="comparison-colhead-manual font-mono-text">
              {comparison.manualLabel}
            </span>
            <span className="comparison-colhead-murmur font-mono-text">
              {comparison.murmurLabel}
            </span>
          </div>

          {comparison.rows.map((row) => (
            <div key={row.dimension} className="comparison-row opacity-0">
              <div className="comparison-dim font-mono-text text-[var(--text-tertiary)]">
                {row.dimension}
              </div>
              <div className="comparison-manual text-[var(--text-secondary)]">
                <span className="comparison-inline-label font-mono-text" aria-hidden="true">
                  {comparison.manualLabel}
                </span>
                {row.manual}
              </div>
              <div className="comparison-murmur text-[var(--text-primary)]">
                <span className="comparison-inline-label font-mono-text" aria-hidden="true">
                  {comparison.murmurLabel}
                </span>
                {row.murmur}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
