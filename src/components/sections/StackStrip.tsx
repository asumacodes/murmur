"use client";

import { useRef } from "react";
import { Container, SectionEyebrow } from "@/components/ui";
import { stackLayers } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollEnterSoft } from "@/lib/motion";

export function StackStrip() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([".stack-header-line", ".stack-layer", ".stack-tool", ".stack-divider"], {
          autoAlpha: 1,
          y: 0,
          scaleY: 1,
        });
        return;
      }

      gsap.fromTo(
        ".stack-header-line",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            ...scrollEnterSoft,
          },
        },
      );

      gsap.fromTo(
        ".stack-layer",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stack-registry",
            ...scrollEnterSoft,
          },
        },
      );

      gsap.fromTo(
        ".stack-tool",
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stack-registry",
            ...scrollEnterSoft,
          },
        },
      );

      gsap.fromTo(
        ".stack-divider",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power2.out",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: ".stack-registry",
            ...scrollEnterSoft,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-16 !pb-0 sm:py-20">
      <Container>
        <div className="border-y border-[var(--border-subtle)] py-10 sm:py-12">
          <div className="stack-header mb-10 max-w-3xl lg:mb-12">
            <SectionEyebrow className="stack-header-line opacity-0">Built on</SectionEyebrow>
            <h2 className="stack-header-line font-serif-display mt-4 text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.05] opacity-0">
              Every layer is <span className="text-invert">named</span>.
            </h2>
            <p className="stack-header-line mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] opacity-0">
              Proven primitives at each step of the pipeline — intelligence,
              orchestration, and ship stack. Nothing hidden in a black box.
            </p>
          </div>

          <div className="stack-registry relative grid gap-10 lg:grid-cols-3 lg:gap-0">
            {stackLayers.map((layer, layerIndex) => (
              <div
                key={layer.label}
                className={`stack-layer relative opacity-0 lg:px-8 ${
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
                    <li key={tool.name} className="stack-tool opacity-0">
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
