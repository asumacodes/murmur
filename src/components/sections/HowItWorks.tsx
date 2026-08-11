"use client";

import { useRef } from "react";
import {
  FoundationMockup,
  HandoffMockup,
  HowItWorksRecordingMockup,
  ResearchMockup,
  TranscriptMockup,
} from "@/components/mockups";
import { Container, SectionHeader } from "@/components/ui";
import { StepArtifact } from "@/components/ui/StepArtifact";
import { howItWorks } from "@/content/home";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { desktopMedia, mobileMedia, scrollEnter } from "@/lib/motion";

const stepArtifacts = [
  { tilt: "cw" as const, variant: "cream" as const, flat: false, mockup: <HowItWorksRecordingMockup /> },
  { tilt: "ccw" as const, variant: "cream" as const, flat: false, mockup: <TranscriptMockup /> },
  { tilt: "cw" as const, variant: "dark" as const, flat: false, mockup: <ResearchMockup /> },
  { tilt: "ccw" as const, variant: "dark" as const, flat: false, mockup: <FoundationMockup /> },
  { tilt: "cw" as const, variant: "dark" as const, flat: false, mockup: <HandoffMockup /> },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const mobilePinRef = useRef<HTMLDivElement>(null);

  useSectionReveal({
    scope: sectionRef,
    scrollEnter,
    reducedMotionTargets: [".how-header > *"],
    groups: [
      {
        selector: ".how-header > *",
        from: { autoAlpha: 0, y: 24 },
        to: { duration: 0.9, stagger: 0.12, ease: "power3.out" },
        trigger: ".how-header",
      },
    ],
  });

  useGSAP(
    () => {
      const revealTargets = [".step-numeral", ".step-content", ".step-visual"];
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(revealTargets, { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(".how-progress-fill", { scaleY: 1 });
        gsap.utils.toArray<HTMLElement>(".how-mobile-panel").forEach((panel, index) => {
          panel.classList.toggle("is-active", index === 0);
        });
      } else {
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
      }

      const mm = gsap.matchMedia();

      mm.add(desktopMedia, () => {
        const aside = sectionRef.current?.querySelector<HTMLElement>(".how-progress-aside");
        const rows = gsap.utils.toArray<HTMLElement>(".step-row", sectionRef.current);
        const progressSteps = gsap.utils.toArray<HTMLElement>(".how-progress-step", sectionRef.current);
        const progressFill = sectionRef.current?.querySelector<HTMLElement>(".how-progress-fill");
        let dotCenters: number[] = [];

        function syncProgressDotPositions() {
          if (!aside || rows.length === 0 || progressSteps.length === 0) {
            return;
          }

          const asideRect = aside.getBoundingClientRect();
          const centers: number[] = [];

          rows.forEach((row, index) => {
            const numeral = row.querySelector<HTMLElement>(".step-numeral");
            const step = progressSteps[index];
            if (!numeral || !step) {
              return;
            }

            const numeralRect = numeral.getBoundingClientRect();
            const center = numeralRect.top + numeralRect.height / 2 - asideRect.top;
            centers.push(center);
            step.style.top = `${center}px`;
          });

          dotCenters = centers;

          if (centers.length >= 2) {
            const start = centers[0];
            const end = centers[centers.length - 1];
            aside.style.setProperty("--how-progress-start", `${start}px`);
            aside.style.setProperty("--how-progress-span", `${Math.max(0, end - start)}px`);
          }
        }

        function setActiveStep(activeIndex: number) {
          progressSteps.forEach((step, index) => {
            step.classList.toggle("is-active", index === activeIndex);
            step.classList.toggle("is-complete", index < activeIndex);
          });

          if (!progressFill || dotCenters.length < 2 || reduceMotion) {
            return;
          }

          const start = dotCenters[0];
          const end = dotCenters[dotCenters.length - 1];
          const active = dotCenters[activeIndex] ?? start;
          const scaleY = end === start ? 1 : (active - start) / (end - start);

          gsap.to(progressFill, {
            scaleY,
            duration: 0.45,
            ease: "power2.out",
            transformOrigin: "top center",
          });
        }

        syncProgressDotPositions();
        setActiveStep(0);

        const onResize = () => {
          syncProgressDotPositions();
          const activeIndex = progressSteps.findIndex((step) =>
            step.classList.contains("is-active"),
          );
          setActiveStep(activeIndex >= 0 ? activeIndex : 0);
          ScrollTrigger.refresh();
        };

        window.addEventListener("resize", onResize);
        void document.fonts?.ready.then(() => {
          syncProgressDotPositions();
          setActiveStep(0);
          ScrollTrigger.refresh();
        });

        if (reduceMotion) {
          return () => {
            window.removeEventListener("resize", onResize);
          };
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

        return () => {
          window.removeEventListener("resize", onResize);
        };
      });

      if (reduceMotion) {
        return () => mm.revert();
      }

      mm.add(mobileMedia, () => {
        const pin = mobilePinRef.current;
        const experience = sectionRef.current?.querySelector<HTMLElement>(".how-mobile-experience");
        const panels = gsap.utils.toArray<HTMLElement>(".how-mobile-panel", sectionRef.current);

        if (!pin || !experience || panels.length === 0) {
          return;
        }

        const setActivePanel = (activeIndex: number) => {
          panels.forEach((panel, index) => {
            const isActive = index === activeIndex;
            panel.classList.toggle("is-active", isActive);
            panel.setAttribute("aria-hidden", isActive ? "false" : "true");

            gsap.to(panel, {
              autoAlpha: isActive ? 1 : 0,
              y: isActive ? 0 : 10,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
        };

        setActivePanel(0);

        const scrubTrigger = ScrollTrigger.create({
          trigger: experience,
          start: "top top+=96",
          end: () => `+=${Math.max(1, panels.length - 1) * 100}%`,
          pin,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              panels.length - 1,
              Math.round(self.progress * (panels.length - 1)),
            );
            setActivePanel(index);
          },
        });

        return () => {
          scrubTrigger.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="pb-[clamp(2rem,4vw,5rem)] pt-5 lg:pb-[clamp(3rem,6vw,6rem)] lg:pt-10"
    >
      <hr
        aria-hidden="true"
        className="how-section-divider mb-6 hidden w-full border-0 border-t border-[rgba(168,163,154,0.12)] lg:mb-12 lg:block"
      />
      <Container>
        <SectionHeader
          className="how-header !mb-8 max-w-4xl max-lg:mx-auto max-lg:text-center lg:!mb-12"
          eyebrowClassName="opacity-0"
          titleClassName="how-header-headline !text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.05] opacity-0 lg:!text-[clamp(2.5rem,5vw,4.75rem)]"
          eyebrow="How it works"
          title={
            <>
              <span style={{ color: "#ffffff" }}>From a voice memo to </span>
              <span style={{ color: "#c9a96e", fontStyle: "italic" }}>a project that already exists.</span>
            </>
          }
        />

        <div className="how-mobile-experience mt-2 lg:hidden">
          <div className="how-mobile-pin-shell relative">
            <div ref={mobilePinRef} className="how-mobile-pin min-h-[min(62vh,560px)] pt-4">
              <div className="how-mobile-stage relative min-h-[min(62vh,560px)]">
                {howItWorks.map((step, index) => {
                  const artifact = stepArtifacts[index];

                  return (
                    <article
                      key={step.number}
                      className={`how-mobile-panel absolute inset-0 flex flex-col items-center gap-4 pt-4 text-center opacity-0 invisible pointer-events-none [&.is-active]:pointer-events-auto [&.is-active]:visible [&.is-active]:opacity-100 ${
                        index === 0 ? "is-active" : ""
                      }`}
                      data-step={index}
                      aria-hidden={index !== 0}
                    >
                      <p className="how-mobile-numeral font-mono-text text-[clamp(2.5rem,10vw,3.5rem)] leading-none text-[var(--gold)]">
                        {step.number}
                      </p>
                      <div className="max-w-md">
                        <p className="how-step-label mb-2 font-mono-text text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--gold)]">
                          {step.label}
                        </p>
                        <h3 className="how-step-headline font-serif-display text-[clamp(1.45rem,5vw,1.85rem)] leading-[1.12] text-[#f5f1e8]">
                          {step.headline}
                        </h3>
                        <p className="how-step-body mx-auto mt-3 max-w-sm text-[0.9375rem] leading-[1.55] text-[var(--text-secondary)]">
                          {step.body}
                        </p>
                      </div>
                      <div className="how-mobile-artifact mt-2 w-full max-w-[18rem]">
                        <StepArtifact tilt={artifact.tilt} variant={artifact.variant} flat>
                          {artifact.mockup}
                        </StepArtifact>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="how-steps-layout hidden items-stretch lg:grid lg:grid-cols-12 lg:gap-12">
          <aside className="how-progress-aside relative self-stretch lg:col-span-1" aria-hidden="true">
            <div className="how-progress-rail absolute inset-0 block">
              <div
                className="how-progress-track absolute top-[var(--how-progress-start,0)] left-1/2 h-[var(--how-progress-span,100%)] w-px -translate-x-1/2 bg-[var(--border-subtle)]"
                aria-hidden="true"
              >
                <div className="how-progress-fill absolute inset-0 top-0 left-0 h-full w-full origin-top scale-y-0 bg-[var(--gold)]" />
              </div>
              <ol className="how-progress-list relative m-0 block h-full list-none p-0">
                {howItWorks.map((step, index) => (
                  <li
                    key={step.number}
                    className={`how-progress-step group/dot absolute top-0 left-1/2 m-0 flex -translate-x-1/2 -translate-y-1/2 justify-center ${
                      index === 0 ? "is-active" : ""
                    }`}
                    aria-label={`Step ${step.number}`}
                  >
                    <span className="flex w-4 items-center justify-center">
                      <span className="how-progress-dot relative z-[1] size-2 shrink-0 rounded-full border border-[var(--border-gold)] bg-[var(--bg-deep)] transition-[border-color,background-color,box-shadow] duration-200 ease-[var(--ease-out)] group-[.is-active]/dot:border-[var(--gold-bright)] group-[.is-active]/dot:bg-[var(--gold-bright)] group-[.is-active]/dot:shadow-[0_0_0_3px_color-mix(in_srgb,var(--gold-bright)_18%,transparent)] group-[.is-complete]/dot:border-[var(--gold)] group-[.is-complete]/dot:bg-[var(--gold)]" />
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
                  className="how-step-row step-row grid min-h-0 gap-8 border-t border-[var(--border-subtle)]/35 py-8 md:gap-10 md:py-12 lg:min-h-0 lg:grid-cols-12 lg:items-start lg:py-14"
                >
                  <div className="step-numeral font-mono-text text-6xl text-[var(--gold)] opacity-0 lg:col-span-2 lg:pt-1 lg:text-8xl">
                    {step.number}
                  </div>
                  <div className="step-content opacity-0 lg:col-span-5">
                    <p className="how-step-label mb-3 font-mono-text text-xs uppercase tracking-[0.15em] text-[var(--gold)]">
                      {step.label}
                    </p>
                    <h3 className="how-step-headline font-serif-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] text-[#f5f1e8]">
                      {step.headline}
                    </h3>
                    <p className="how-step-body mt-4 max-w-md leading-7 text-[var(--text-secondary)]">
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
