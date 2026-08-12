"use client";

import { useRef } from "react";
import { Container, SectionEyebrow } from "@/components/ui";
import { stackLayers } from "@/content/home";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";
import { sectionPadClass, textInvertClass } from "@/lib/styles";

export function StackStrip() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionReveal({
    scope: sectionRef,
    scrollEnter,
    reducedMotionTargets: [".stack-header-line", ".stack-layer", ".stack-divider"],
    groups: [
      {
        selector: ".stack-header-line",
        trigger: ".stack-header",
        from: { autoAlpha: 0, y: 36 },
        to: { duration: 0.9, stagger: 0.12, ease: PREMIUM_EASE },
      },
      // Animate columns only — not nested tools (parent opacity was masking children).
      {
        selector: ".stack-layer",
        trigger: ".stack-registry",
        from: { autoAlpha: 0, y: 40 },
        to: { duration: 0.95, stagger: 0.14, ease: PREMIUM_EASE },
        batch: true,
      },
      {
        selector: ".stack-divider",
        trigger: ".stack-registry",
        from: { autoAlpha: 1, y: 0, scaleY: 0 },
        to: {
          autoAlpha: 1,
          y: 0,
          scaleY: 1,
          duration: 1.1,
          stagger: 0.14,
          transformOrigin: "top center",
          ease: PREMIUM_EASE,
        },
      },
    ],
  });

  return (
    <section ref={sectionRef} className={sectionPadClass}>
      <Container>
        <div className="border-y border-[var(--border-subtle)] py-12 sm:py-16">
          <div className="stack-header mb-10 max-w-3xl max-lg:mx-auto max-lg:text-center lg:mb-12">
            <SectionEyebrow className="stack-header-line opacity-0">Built on</SectionEyebrow>
            <h2 className="stack-header-line font-serif-display mt-4 text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.05] opacity-0">
              Every layer is <span className={textInvertClass}>named</span>.
            </h2>
            <p className="stack-header-line mt-5 max-w-xl text-base leading-7 text-[var(--text-secondary)] opacity-0">
              Named primitives at every layer. Nothing hidden in a black box.
            </p>
          </div>

          <div className="stack-registry relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {stackLayers.map((layer, layerIndex) => (
              <div
                key={layer.label}
                className={`stack-layer relative opacity-0 lg:px-6 ${
                  layerIndex === 0 ? "lg:pl-0" : ""
                } ${layerIndex === stackLayers.length - 1 ? "lg:pr-0" : ""}`}
              >
                {layerIndex > 0 ? (
                  <div
                    className="stack-divider pointer-events-none absolute bottom-0 left-0 top-0 hidden w-px origin-top scale-y-0 bg-[var(--border-subtle)] lg:block"
                    aria-hidden="true"
                  />
                ) : null}
                <p className="font-mono-text mb-6 text-[0.62rem] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                  {layer.label}
                </p>
                <ul className="space-y-5">
                  {layer.tools.map((tool) => (
                    <li key={tool.name}>
                      <div className="group flex items-baseline justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 transition-colors duration-300 hover:border-[var(--border-gold)]">
                        <span className="font-serif-display text-[clamp(1.35rem,2vw,1.65rem)] leading-none text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--gold)]">
                          {tool.name}
                        </span>
                        <span className="font-mono-text shrink-0 text-[0.58rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                          {tool.note}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
