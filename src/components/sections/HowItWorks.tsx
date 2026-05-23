"use client";

import { useRef } from "react";
import {
  DeployMockup,
  FoundationMockup,
  HowItWorksRecordingMockup,
  ResearchMockup,
  TranscriptMockup,
} from "@/components/mockups";
import { Container, SectionEyebrow } from "@/components/ui";
import { StepArtifact } from "@/components/ui/StepArtifact";
import { howItWorks } from "@/content/home";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollEnter } from "@/lib/motion";

const stepArtifacts = [
  { tilt: "cw" as const, variant: "cream" as const, flat: false, mockup: <HowItWorksRecordingMockup /> },
  { tilt: "ccw" as const, variant: "cream" as const, flat: false, mockup: <TranscriptMockup /> },
  { tilt: "cw" as const, variant: "dark" as const, flat: false, mockup: <ResearchMockup /> },
  { tilt: "ccw" as const, variant: "dark" as const, flat: false, mockup: <FoundationMockup /> },
  { tilt: "cw" as const, variant: "dark" as const, flat: false, mockup: <DeployMockup /> },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const revealTargets = [
        ".how-header > *",
        ".step-numeral",
        ".step-content",
        ".step-visual",
      ];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(revealTargets, { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(".how-progress-fill", { scaleY: 1 });
        return;
      }

      const recordingBars = gsap.utils.toArray<HTMLElement>(
        ".how-recording-bar",
        sectionRef.current,
      );

      recordingBars.forEach((bar) => {
        gsap.to(bar, {
          scaleY: "random(0.55, 1.35)",
          transformOrigin: "bottom center",
          duration: "random(0.18, 0.42)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      });

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
      const progressSteps = gsap.utils.toArray<HTMLElement>(".how-progress-step", sectionRef.current);
      const progressFill = sectionRef.current?.querySelector<HTMLElement>(".how-progress-fill");

      function setActiveStep(activeIndex: number) {
        progressSteps.forEach((step, index) => {
          step.classList.toggle("is-active", index === activeIndex);
          step.classList.toggle("is-complete", index < activeIndex);
        });

        if (progressFill) {
          gsap.to(progressFill, {
            scaleY: (activeIndex + 1) / howItWorks.length,
            duration: 0.45,
            ease: "power2.out",
            transformOrigin: "top center",
          });
        }
      }

      rows.forEach((row, index) => {
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
            { autoAlpha: 0, x: -24 },
            { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" },
          );
        }

        if (content) {
          tl.fromTo(
            content,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.55",
          );
        }

        if (visual) {
          tl.fromTo(
            visual,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.85, ease: "cubic-bezier(0.16, 1, 0.3, 1)" },
            "-=0.55",
          );
        }

        ScrollTrigger.create({
          trigger: row,
          start: "top center+=40",
          end: "bottom center+=40",
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="pb-[clamp(4.5rem,10vw,10rem)] pt-10 lg:pt-12"
    >
      <hr aria-hidden="true" className="how-section-divider mb-16 w-full border-0 border-t lg:mb-20" />
      <Container>
        <div className="how-header mb-20 max-w-4xl">
          <SectionEyebrow className="opacity-0">How it works</SectionEyebrow>
          <h2 className="how-header-headline font-serif-display mt-4 text-[clamp(2.5rem,5vw,4.75rem)] leading-[1.05] opacity-0">
            <span style={{ color: "#ffffff" }}>From a voice memo to </span>
            <span style={{ color: "#c9a96e", fontStyle: "italic" }}>a project that already exists.</span>
          </h2>
        </div>

        <div className="how-steps-layout lg:grid lg:grid-cols-12 lg:gap-12">
          <aside className="how-progress-aside relative hidden lg:col-span-1 lg:block" aria-hidden="true">
            <div className="how-progress-rail">
              <div className="how-progress-track" aria-hidden="true">
                <div className="how-progress-fill" />
              </div>
              <ol className="how-progress-list relative">
                {howItWorks.map((step, index) => (
                  <li
                    key={step.number}
                    className={`how-progress-step flex justify-center ${index === 0 ? "is-active" : ""}`}
                    aria-label={`Step ${step.number}`}
                  >
                    <span className="how-progress-dot-wrap">
                      <span className="how-progress-dot" />
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <div className="lg:col-span-11">
            {howItWorks.map((step, index) => {
              const artifact = stepArtifacts[index];

              return (
                <article
                  key={step.number}
                  className="how-step-row step-row grid gap-10 border-t border-[var(--border-subtle)]/35 py-16 md:gap-12 md:py-24 lg:grid-cols-12 lg:items-start"
                >
                  <div className="step-numeral font-mono-text text-6xl text-[var(--gold)] opacity-0 lg:col-span-2 lg:pt-1 lg:text-8xl">
                    {step.number}
                  </div>
                  <div className="step-content opacity-0 lg:col-span-5">
                    <p className="how-step-label font-mono-text mb-3 text-xs uppercase tracking-[0.15em]">
                      {step.label}
                    </p>
                    <h3 className="how-step-headline font-serif-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15]">
                      {step.headline}
                    </h3>
                    <p className="how-step-body mt-4 max-w-md leading-7">
                      {step.body}
                    </p>
                  </div>
                  <div className="step-visual opacity-0 lg:col-span-5 lg:flex lg:justify-end">
                    <StepArtifact
                      tilt={artifact.tilt}
                      variant={artifact.variant}
                      flat={artifact.flat}
                    >
                      {artifact.mockup}
                    </StepArtifact>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
