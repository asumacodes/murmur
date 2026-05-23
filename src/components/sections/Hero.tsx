"use client";

import { useRef } from "react";
import { ListenerMockup } from "@/components/mockups";
import { Container, GhostButton, PlayIcon, SectionEyebrow } from "@/components/ui";
import { MagneticGoldButton } from "@/components/ui/MagneticGoldButton";
import { pipelineLabels } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";
import { REPLAY_PIPELINE_EVENT } from "@/lib/pipeline-tracer";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const targets = [
        ".hero-eyebrow",
        ".hero-title-line",
        ".hero-subhead",
        ".hero-cta",
        ".hero-honesty",
        ".hero-mockup-wrapper",
        ".hero-divider",
        ".hero-pipeline-label",
        ".hero-pipeline-arrow",
      ];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(targets, { autoAlpha: 1, y: 0, x: 0, scale: 1, rotation: 0 });
        gsap.set(".hero-divider", { scaleX: 1 });
        return;
      }

      const mm = gsap.matchMedia();

      const animateListenerDevice = (options?: { float?: boolean }) => {
        const bars = gsap.utils.toArray<HTMLElement>(
          ".waveform-bar",
          containerRef.current,
        );

        bars.forEach((bar) => {
          gsap.to(bar, {
            scaleY: "random(0.55, 1.35)",
            transformOrigin: "bottom center",
            duration: "random(0.18, 0.42)",
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        });

        if (options?.float) {
          gsap.to(".listener", {
            y: -6,
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      };

      mm.add("(min-width: 768px)", () => {
        animateListenerDevice({ float: true });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(
          ".hero-eyebrow",
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
        )
          .fromTo(
            ".hero-title-line",
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 1, stagger: 0.15 },
            "-=0.6",
          )
          .fromTo(
            ".hero-subhead",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 1 },
            "-=0.6",
          )
          .fromTo(
            ".hero-cta",
            { autoAlpha: 0, y: 15 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
            "-=0.6",
          )
          .fromTo(
            ".hero-honesty",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.6 },
            "-=0.4",
          )
          .fromTo(
            ".hero-mockup-wrapper",
            { autoAlpha: 0, scale: 0.95, y: 40 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 1.2 },
            "-=1.0",
          )
          .fromTo(
            ".hero-divider",
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2 },
            "-=0.8",
          )
          .fromTo(
            ".hero-pipeline-label, .hero-pipeline-arrow",
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 },
            "-=0.8",
          );
      });

      mm.add("(max-width: 767px)", () => {
        animateListenerDevice();

        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.07,
            ease: "power3.out",
          },
        );
        gsap.set(".hero-divider", { scaleX: 1 });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="top"
      aria-label="Hero — Murmur product introduction"
      className="relative overflow-hidden pb-16 pt-36 sm:pt-44 lg:flex lg:min-h-[100svh] lg:flex-col lg:pb-10 lg:pt-32"
    >
      <Container className="relative z-10 flex flex-1 flex-col">
        <div className="grid flex-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 lg:flex lg:flex-col lg:justify-center">
            <div className="space-y-8">
              <SectionEyebrow className="hero-eyebrow opacity-0">
                MURMUR · A SPRINTZERO STUDIO PRODUCT
              </SectionEyebrow>
              <h1 className="font-serif-display text-[clamp(3.35rem,16vw,8rem)] leading-[0.95] tracking-[-0.02em] lg:text-[clamp(3.75rem,7.5vw,7.5rem)]">
                <span className="hero-title-line block opacity-0">Speak.</span>
                <span className="hero-title-line block opacity-0 italic text-[var(--gold)]">
                  Transcribe.
                </span>
                <span className="hero-title-line block opacity-0">Ship.</span>
              </h1>
              <p className="hero-subhead max-w-[35rem] text-xl leading-[1.55] text-[var(--text-secondary)] opacity-0">
                A five-minute voice memo becomes a validated PRD, brand kit, Jira board, and
                Confluence space — automatically. Skip the{" "}
                <span className="font-serif-display italic text-[var(--text-primary)]">
                  planning theater
                </span>
                .
              </p>
              <div className="hero-mockup-wrapper opacity-0 lg:hidden">
                <ListenerMockup animateWaveform />
              </div>
              <div className="hero-cta opacity-0">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <MagneticGoldButton href="#early-access">Join early access →</MagneticGoldButton>
                  <GhostButton
                    href="#pipeline"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent(REPLAY_PIPELINE_EVENT));
                    }}
                  >
                    Watch the pipeline run
                    <PlayIcon />
                  </GhostButton>
                </div>
              </div>
              <p className="hero-honesty font-mono-text text-xs uppercase tracking-[0.14em] text-[var(--text-tertiary)] opacity-0">
                4 users · 1 builder · phase 0 in progress
              </p>
            </div>
          </div>

          <div className="hero-mockup-wrapper hidden opacity-0 lg:col-span-5 lg:flex lg:items-center lg:justify-end lg:py-6">
            <ListenerMockup animateWaveform tall />
          </div>
        </div>

        <div className="hero-floor mt-16 lg:mt-auto lg:pt-10">
          <hr
            aria-hidden="true"
            className="hero-divider origin-left scale-x-0 border-t border-[var(--border-gold)]"
          />
          <nav
            aria-label="Pipeline stages overview"
            className="hero-pipeline-nav mt-6 flex flex-wrap items-center gap-x-2 gap-y-3 lg:w-full lg:justify-between lg:gap-0"
          >
            {pipelineLabels.map((item, index) => (
              <span key={item.label} className="contents">
                <span className="hero-pipeline-label inline-flex items-center gap-1 opacity-0 text-[var(--gold)]">
                  <span className="font-serif-display text-[0.65rem] italic leading-none lg:text-[0.72rem]">
                    {item.numeral}
                  </span>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] lg:text-[0.72rem]">
                    {item.label}
                  </span>
                </span>
                {index < pipelineLabels.length - 1 ? (
                  <span
                    className="hero-pipeline-arrow hidden px-1 text-[0.72rem] leading-none text-[var(--gold)] opacity-0 lg:inline"
                    aria-hidden="true"
                  >
                    →
                  </span>
                ) : null}
              </span>
            ))}
          </nav>
        </div>
      </Container>
    </section>
  );
}
