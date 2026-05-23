"use client";

import { useRef } from "react";
import { ListenerMockup } from "@/components/mockups";
import { Container, GoldButton, PlayIcon, SectionEyebrow } from "@/components/ui";
import { pipelineLabels } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";

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
      ];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(targets, { autoAlpha: 1, y: 0, x: 0, scale: 1, rotation: 0 });
        gsap.set(".hero-divider", { scaleX: 1 });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const bars = gsap.utils.toArray<HTMLElement>(
          ".waveform-bar",
          containerRef.current,
        );

        bars.forEach((bar) => {
          gsap.to(bar, {
            scaleY: "random(0.45, 1.35)",
            transformOrigin: "bottom center",
            duration: "random(0.2, 0.45)",
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        });

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
            ".hero-pipeline-label",
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
            "-=0.8",
          );
      });

      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          [
            ".hero-eyebrow",
            ".hero-title-line",
            ".hero-subhead",
            ".hero-cta",
            ".hero-honesty",
            ".hero-mockup-wrapper",
            ".hero-divider",
            ".hero-pipeline-label",
          ],
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[4%] top-[8%] hidden h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.06),transparent_70%)] lg:block"
      />

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
              <p className="hero-subhead max-w-2xl text-xl leading-[1.55] text-[var(--text-secondary)] opacity-0">
                A five-minute voice memo becomes a validated PRD, brand kit,
                Jira board, and Confluence space - automatically. Skip the
                planning theater.
              </p>
              <div className="hero-mockup-wrapper opacity-0 lg:hidden">
                <ListenerMockup animateWaveform />
              </div>
              <div className="hero-cta opacity-0">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <GoldButton href="#early-access">Join early access →</GoldButton>
                  <a
                    href="#how-it-works"
                    className="focus-ring gold-link inline-flex items-center gap-3 rounded-sm font-serif-display text-lg text-[var(--text-primary)]"
                  >
                    Watch the pipeline run
                    <PlayIcon />
                  </a>
                </div>
                {/* Pipeline demo coming with Bridge stream Part 1 */}
              </div>
              <p className="hero-honesty font-mono-text text-xs uppercase tracking-[0.14em] text-[var(--text-tertiary)] opacity-0">
                4 users · 1 builder · phase 0 in progress
              </p>
            </div>
          </div>

          <div className="hero-mockup-wrapper hidden opacity-0 lg:col-span-5 lg:flex lg:items-center lg:justify-end">
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
            className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0"
          >
            {pipelineLabels.map((label, index) => (
              <div
                key={label}
                className="hero-pipeline-label opacity-0 font-mono-text text-[0.68rem] uppercase tracking-[0.15em] text-[var(--gold)] lg:text-center"
              >
                {label}
                {index < pipelineLabels.length - 1 ? (
                  <span className="ml-3 hidden text-[var(--text-tertiary)] lg:inline">
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </nav>
        </div>
      </Container>
    </section>
  );
}
