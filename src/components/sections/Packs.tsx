"use client";

import { useRef } from "react";
import { Container, GhostButton, GoldButton, SectionEyebrow } from "@/components/ui";
import { packs, type Pack, type PackFeature } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";

function featureText(feature: PackFeature): { text: string; bold: boolean } {
  if (typeof feature === "string") {
    return { text: feature, bold: false };
  }

  return { text: feature.text, bold: feature.bold ?? false };
}

export function Packs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [primary, ...addons] = packs;

  useGSAP(
    () => {
      const revealTargets = [".packs-header > *", ".pack-card"];

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
        ".pack-card",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.12,
          ease: PREMIUM_EASE,
          scrollTrigger: {
            trigger: ".packs-grid",
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
        <div className="packs-header mb-12 max-w-3xl lg:mb-14">
          <SectionEyebrow className="opacity-0">The Packs</SectionEyebrow>
          <h2 className="packs-headline font-serif-display mt-4 text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.08] opacity-0">
            <span style={{ color: "#ffffff" }}>Start with the pipeline. Add code </span>
            <span style={{ color: "#c9a96e", fontStyle: "italic" }}>when it matters.</span>
          </h2>
        </div>

        <div className="packs-grid grid items-stretch gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
          <PackCard pack={primary} className="pack-card pack-card--featured" />
          <div className="grid gap-5 lg:gap-6">
            {addons.map((pack) => (
              <PackCard key={pack.letter} pack={pack} className="pack-card" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function PackCard({ pack, className = "" }: { pack: Pack; className?: string }) {
  const isFeatured = pack.featured === true;

  return (
    <article className={`pack-card-surface ${className}`}>
      <header className="pack-card-head">
        <div className="pack-card-head-main">
          <span className="pack-card-letter font-serif-display italic text-[var(--gold)]">
            {pack.letter}
          </span>
          <div className="pack-card-head-copy">
            <h3 className="pack-card-name font-serif-display text-[var(--text-primary)]">
              {pack.name}
            </h3>
            {pack.subtitle ? (
              <p className="pack-card-subtitle text-[var(--text-secondary)]">{pack.subtitle}</p>
            ) : null}
          </div>
        </div>
        {pack.tag ? (
          <span className="pack-card-tag font-mono-text uppercase text-[var(--gold)]">
            {pack.tag}
          </span>
        ) : null}
      </header>

      <div className="pack-card-divider" aria-hidden="true" />

      <ul className="pack-card-features">
        {pack.features.map((feature) => {
          const { text, bold } = featureText(feature);

          return (
            <li key={text} className="pack-card-feature">
              <span className="pack-card-check text-[var(--gold)]" aria-hidden="true">
                ✓
              </span>
              <span className={bold ? "font-semibold text-[var(--text-secondary)]" : ""}>
                {text}
              </span>
            </li>
          );
        })}
      </ul>

      <footer className="pack-card-footer">
        <div className="pack-card-price-row">
          <p className="pack-card-price">
            <span className="pack-card-price-amount font-serif-display text-[var(--gold)]">
              {pack.priceAmount}
            </span>
            <span className="pack-card-price-unit text-[var(--text-secondary)]">
              {pack.priceUnit}
            </span>
          </p>
          {pack.priceNote ? (
            <p className="pack-card-price-note font-mono-text uppercase text-[var(--text-tertiary)]">
              {pack.priceNote}
            </p>
          ) : null}
        </div>

        {isFeatured ? (
          <GoldButton href="#early-access" className="pack-card-btn pack-card-btn--primary">
            {pack.cta}
          </GoldButton>
        ) : (
          <GhostButton href="#early-access" className="pack-card-btn pack-card-btn--ghost">
            {pack.cta}
          </GhostButton>
        )}

        {pack.footnote ? (
          <p className="pack-card-footnote">{pack.footnote}</p>
        ) : null}
      </footer>
    </article>
  );
}
