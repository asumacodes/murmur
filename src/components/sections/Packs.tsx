"use client";

import { useRef } from "react";
import { Container, GhostButton, GoldButton, SectionEyebrow } from "@/components/ui";
import {
  packs,
  paygEntry,
  sprintZeroBand,
  type Pack,
  type PackFeature,
} from "@/content/home";
import { trackWaitlistCtaClicked } from "@/lib/analytics/events";
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

  useGSAP(
    () => {
      const revealTargets = [
        ".packs-header > *",
        ".pack-card",
        ".packs-payg",
        ".packs-lock",
        ".sprintzero-band",
      ];

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
          scrollTrigger: { trigger: ".packs-header", ...scrollEnter },
        },
      );

      gsap.fromTo(
        ".pack-card",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.1,
          ease: PREMIUM_EASE,
          scrollTrigger: { trigger: ".packs-grid", ...scrollEnter },
        },
      );

      gsap.fromTo(
        [".packs-payg", ".packs-lock", ".sprintzero-band"],
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: PREMIUM_EASE,
          scrollTrigger: { trigger: ".packs-payg", ...scrollEnter },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="packs" ref={sectionRef} className="section-pad">
      <Container>
        <div className="packs-header mb-12 max-w-3xl lg:mb-14">
          <SectionEyebrow className="opacity-0">Pricing</SectionEyebrow>
          <h2 className="packs-headline font-serif-display mt-4 text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.08] opacity-0">
            <span style={{ color: "#ffffff" }}>Pay per idea </span>
            <span style={{ color: "#c9a96e", fontStyle: "italic" }}>delivered.</span>
          </h2>
          <p className="packs-subhead mt-5 max-w-xl text-[var(--text-secondary)] opacity-0">
            A plan when you&apos;re running ideas regularly, or a single idea when you&apos;re not.
            You&apos;re only charged for a result that ships — failed runs are on us.
          </p>
        </div>

        <div className="packs-grid grid items-stretch gap-5 md:grid-cols-3 lg:gap-6">
          {packs.map((pack) => (
            <PackCard
              key={pack.name}
              pack={pack}
              className={`pack-card ${pack.featured ? "pack-card--featured" : ""}`}
            />
          ))}
        </div>

        {/* PAYG — prominent no-commitment entry, not buried */}
        <div className="packs-payg mt-6 opacity-0">
          <div className="packs-payg-inner">
            <div className="packs-payg-copy">
              <span className="packs-payg-label font-mono-text uppercase text-[var(--gold)]">
                {paygEntry.label}
              </span>
              <p className="packs-payg-desc text-[var(--text-secondary)]">
                {paygEntry.description}
              </p>
            </div>
            <div className="packs-payg-price">
              <span className="packs-payg-amount font-serif-display text-[var(--gold)]">
                {paygEntry.priceAmount}
              </span>
              <span className="packs-payg-unit text-[var(--text-secondary)]">
                {paygEntry.priceUnit}
              </span>
            </div>
            <GhostButton
              href="#early-access"
              className="pack-card-btn pack-card-btn--ghost packs-payg-cta"
              onClick={() => trackWaitlistCtaClicked("pricing", { pack: "payg" })}
            >
              Join the waitlist →
            </GhostButton>
          </div>
        </div>

        {/* Grandfathering — one-line strip, same copy the FAQ carries */}
        <p className="packs-lock mt-5 text-center font-mono-text text-xs uppercase tracking-[0.12em] text-[var(--text-tertiary)] opacity-0">
          First 100 subscribers keep their price for 12 months — a price lock, not a limited-time
          discount.
        </p>

        {/* SprintZero handoff band — qualitative, no price, the only Contact Sales surface */}
        <div className="sprintzero-band mt-12 opacity-0 lg:mt-16">
          <SectionEyebrow className="sprintzero-band-eyebrow">
            {sprintZeroBand.eyebrow}
          </SectionEyebrow>
          <h3 className="sprintzero-band-headline font-serif-display mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1]">
            {sprintZeroBand.headline}
          </h3>
          <p className="sprintzero-band-body mt-4 max-w-2xl text-[var(--text-secondary)]">
            {sprintZeroBand.body}
          </p>
          <div className="sprintzero-band-actions mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <GoldButton
              href={sprintZeroBand.ctaHref}
              className="pack-card-btn pack-card-btn--primary"
              onClick={() => trackWaitlistCtaClicked("sprintzero_band")}
            >
              {sprintZeroBand.cta}
            </GoldButton>
            <span className="sprintzero-band-promise font-mono-text text-xs uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
              {sprintZeroBand.responsePromise}
            </span>
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
      <header className="pack-card-head pack-card-head--stacked">
        <div className="pack-card-head-copy">
          <h3 className="pack-card-name font-serif-display text-[var(--text-primary)]">
            {pack.name}
          </h3>
          {pack.subtitle ? (
            <p className="pack-card-subtitle text-[var(--text-secondary)]">{pack.subtitle}</p>
          ) : null}
        </div>
        {pack.tag ? (
          <span className="pack-card-tag font-mono-text uppercase text-[var(--gold)]">
            {pack.tag}
          </span>
        ) : null}
      </header>

      <div className="pack-card-price-row pack-card-price-row--top">
        <p className="pack-card-price">
          <span className="pack-card-price-amount font-serif-display text-[var(--gold)]">
            {pack.priceAmount}
          </span>
          <span className="pack-card-price-unit text-[var(--text-secondary)]">
            {pack.priceUnit}
          </span>
        </p>
      </div>

      {pack.idealFor ? (
        <p className="pack-card-idealfor text-[var(--text-secondary)]">
          <span className="pack-card-idealfor-label font-mono-text uppercase text-[var(--text-tertiary)]">
            Ideal for
          </span>
          {pack.idealFor}
        </p>
      ) : null}

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
        {isFeatured ? (
          <GoldButton
            href="#early-access"
            className="pack-card-btn pack-card-btn--primary"
            onClick={() => trackWaitlistCtaClicked("pricing", { pack: pack.name })}
          >
            {pack.cta}
          </GoldButton>
        ) : (
          <GhostButton
            href="#early-access"
            className="pack-card-btn pack-card-btn--ghost"
            onClick={() => trackWaitlistCtaClicked("pricing", { pack: pack.name })}
          >
            {pack.cta}
          </GhostButton>
        )}

        {pack.footnote ? <p className="pack-card-footnote">{pack.footnote}</p> : null}
      </footer>
    </article>
  );
}
