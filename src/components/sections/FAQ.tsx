"use client";

import { useRef } from "react";
import { Container, SectionEyebrow } from "@/components/ui";
import { faq } from "@/content/faq";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollEnterSoft } from "@/lib/motion";

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const revealTargets = [".faq-header > *", ".faq-item"];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(revealTargets, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ".faq-header > *",
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
        ".faq-item",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: ".faq-list", ...scrollEnterSoft },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="faq" ref={sectionRef} className="section-pad">
      <Container>
        <div className="faq-header mb-10 max-w-3xl lg:mb-12">
          <SectionEyebrow className="opacity-0">FAQ</SectionEyebrow>
          <h2 className="font-serif-display mt-4 text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08] opacity-0">
            The honest answers.
          </h2>
        </div>

        <div className="faq-list mx-auto max-w-3xl">
          {faq.map((item) => (
            <details key={item.q} className="faq-item group opacity-0" name="murmur-faq">
              <summary className="faq-summary focus-ring">
                <span className="faq-question font-serif-display text-[var(--text-primary)]">
                  {item.q}
                </span>
                <span className="faq-marker" aria-hidden="true" />
              </summary>
              <div className="faq-answer text-[var(--text-secondary)]">{item.a}</div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
