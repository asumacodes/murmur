"use client";

import { useRef } from "react";
import { Container, GhostButton, SectionEyebrow } from "@/components/ui";
import { MagneticGoldButton } from "@/components/ui/MagneticGoldButton";
import { packs } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";

export function Packs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [primary, ...addons] = packs;

  useGSAP(
    () => {
      const revealTargets = [".packs-header > *", ".pack-card-left", ".pack-card-right"];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(revealTargets, { autoAlpha: 1, x: 0, y: 0 });
        return;
      }

      gsap.fromTo(
          ".packs-header > *",
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".packs-header",
              ...scrollEnter,
            },
          },
        );

        gsap.fromTo(
          ".pack-card-left",
          { autoAlpha: 0, x: -50 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1,
            ease: PREMIUM_EASE,
            scrollTrigger: {
              trigger: ".pack-card-left",
              ...scrollEnter,
            },
          },
        );

        gsap.fromTo(
          ".pack-card-right",
          { autoAlpha: 0, x: 50 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1,
            stagger: 0.2,
            ease: PREMIUM_EASE,
            scrollTrigger: {
              trigger: ".pack-card-right-container",
              ...scrollEnter,
            },
          },
        );
    },
    { scope: sectionRef },
  );

  return (
    <section id="packs" ref={sectionRef} className="section-pad">
      <Container>
        <div className="packs-header mb-14 max-w-3xl">
          <SectionEyebrow className="opacity-0">Packs</SectionEyebrow>
          <h2 className="font-serif-display mt-4 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] opacity-0">
            Start with the pipeline. Add code when it matters.
          </h2>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <PackCard pack={primary} large className="pack-card-left" />
          <div className="pack-card-right-container grid gap-6">
            {addons.map((pack) => (
              <PackCard key={pack.letter} pack={pack} className="pack-card-right" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function PackCard({
  pack,
  large = false,
  className = "",
}: {
  pack: (typeof packs)[number];
  large?: boolean;
  className?: string;
}) {
  return (
    <article
      className={`pack-card-interactive relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-[var(--border-gold)] bg-[var(--bg-elevated)] p-6 opacity-0 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)] ${className} ${
        large ? "justify-between lg:p-9" : "h-full"
      }`}
    >
      {pack.glow ? (
        <div className="pointer-events-none absolute inset-x-8 -top-20 h-40 rounded-full bg-[rgba(201,169,110,0.14)] blur-3xl" />
      ) : null}

      <div className="relative">
        <div className="mb-6 flex items-start justify-between gap-4">
          <span className="font-serif-display text-7xl text-[var(--gold)]">
            {pack.letter}
          </span>
          {pack.tag ? (
            <span className="font-mono-text rounded-full border border-[var(--border-gold)] px-3 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--gold)]">
              {pack.tag}
            </span>
          ) : null}
        </div>
        <h3 className="font-serif-display text-4xl text-[var(--text-primary)]">
          {pack.name}
        </h3>
        <p className="mt-3 text-[var(--text-secondary)]">{pack.position}</p>
        <div className="my-6 border-t border-[var(--border-gold)]" />
        <ul className="grid gap-4 text-sm text-[var(--text-secondary)] sm:grid-cols-2 lg:grid-cols-1">
          {pack.features.map((feature) => (
            <li key={feature} className="flex gap-3">
              <span className="text-[var(--gold-bright)]">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {large ? <PackOutputPreview /> : null}
      </div>

      <div
        className={`relative border-t border-[var(--border-gold)] pt-6 ${
          large ? "" : "mt-6"
        }`}
      >
        <p className="font-mono-text text-sm uppercase tracking-[0.08em] text-[var(--gold)]">
          {pack.price}
        </p>
        {large ? (
          <MagneticGoldButton href="#early-access" className="mt-5">
            {pack.cta}
          </MagneticGoldButton>
        ) : (
          <GhostButton href="#early-access" className="mt-5">
            {pack.cta}
          </GhostButton>
        )}
      </div>
    </article>
  );
}

function PackOutputPreview() {
  const outputs = ["PRD", "Research brief", "Brand kit", "Jira board", "Confluence space"];

  return (
    <div className="mt-8 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[rgba(10,10,10,0.35)] p-4">
      <p className="font-mono-text text-[0.65rem] uppercase tracking-[0.14em] text-[var(--gold)]">
        Pack A outputs
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {outputs.map((output) => (
          <div
            key={output}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[rgba(245,241,232,0.03)] px-4 py-3"
          >
            <p className="text-sm text-[var(--text-primary)]">{output}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
