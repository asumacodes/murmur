"use client";

import { useRef } from "react";
import {
  DeployMockup,
  FoundationMockup,
  ResearchMockup,
  TranscriptMockup,
  VoiceCaptureMockup,
} from "@/components/mockups";
import { Container, SectionEyebrow } from "@/components/ui";
import { howItWorks } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollEnter } from "@/lib/motion";

const artifactMap = [
  <VoiceCaptureMockup key="voice-capture" />,
  <TranscriptMockup key="transcript" />,
  <ResearchMockup key="research" />,
  <FoundationMockup key="foundation" />,
  <DeployMockup key="deploy" />,
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const revealTargets = [".how-header > *", ".step-numeral", ".step-content", ".step-visual"];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(revealTargets, { autoAlpha: 1, x: 0, y: 0, rotation: 0 });
        return;
      }

      gsap.fromTo(
          ".how-header > *",
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".how-header",
              ...scrollEnter,
            },
          },
        );

        const rows = gsap.utils.toArray<HTMLElement>(".step-row", sectionRef.current);

        rows.forEach((row) => {
          const numeral = row.querySelector(".step-numeral");
          const content = row.querySelector(".step-content");
          const visual = row.querySelector(".step-visual");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              ...scrollEnter,
            },
          });

          if (numeral) {
            tl.fromTo(
              numeral,
              { autoAlpha: 0, x: -30 },
              { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" },
            );
          }

          if (content) {
            tl.fromTo(
              content,
              { autoAlpha: 0, y: 30 },
              { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
              "-=0.6",
            );
          }

          if (visual) {
            tl.fromTo(
              visual,
              { autoAlpha: 0, y: 30, rotateZ: -2 },
              {
                autoAlpha: 1,
                y: 0,
                rotateZ: 0,
                duration: 0.9,
                ease: "cubic-bezier(0.16, 1, 0.3, 1)",
              },
              "-=0.6",
            );
          }
        });
    },
    { scope: sectionRef },
  );

  return (
    <section id="how-it-works" ref={sectionRef} className="section-pad">
      <Container>
        <div className="how-header mb-16 max-w-3xl">
          <SectionEyebrow className="opacity-0">How it works</SectionEyebrow>
          <h2 className="font-serif-display mt-4 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] opacity-0">
            The memo is only the beginning.
          </h2>
        </div>

        <div>
          {howItWorks.map((step, index) => (
            <article
              key={step.number}
              className="how-step-row step-row grid gap-8 border-t border-[var(--border-subtle)]/35 py-14 md:py-20 lg:grid-cols-12 lg:items-center"
            >
              <div className="step-numeral font-mono-text text-6xl text-[var(--gold)] opacity-0 lg:col-span-2 lg:text-8xl">
                {step.number}
              </div>
              <div className="step-content opacity-0 lg:col-span-5">
                <p className="font-mono-text mb-3 text-xs uppercase tracking-[0.15em] text-[var(--text-tertiary)]">
                  {step.artifact}
                </p>
                <h3 className="font-serif-display text-4xl text-[var(--text-primary)]">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-xl leading-7 text-[var(--text-secondary)]">
                  {step.body}
                </p>
              </div>
              <div className="step-visual opacity-0 lg:col-span-5 lg:flex lg:items-center lg:justify-end">
                <div className="w-full max-w-md">{artifactMap[index]}</div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
