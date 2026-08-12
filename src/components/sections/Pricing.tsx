"use client";

import { useRef } from "react";
import {
  Container,
  GhostButton,
  GoldButton,
  SectionHeader,
} from "@/components/ui";
import {
  packs,
  paygEntry,
  type Pack,
  type PackFeature,
} from "@/content/home";
import { FoundingOffer } from "@/components/sections/FoundingOffer";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { trackWaitlistCtaClicked } from "@/lib/analytics/events";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";
import { sectionPadClass } from "@/lib/styles";

function featureText(feature: PackFeature): { text: string; bold: boolean } {
  if (typeof feature === "string") {
    return { text: feature, bold: false };
  }
  return { text: feature.text, bold: feature.bold ?? false };
}

const cardBtnClass = "mt-5 min-h-11 w-full rounded-[2px] text-sm";
const ghostCardBtnClass = `${cardBtnClass} pointer-fine:group-hover:border-[var(--gold)] pointer-fine:group-hover:bg-[rgba(201,169,110,0.05)]`;

export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionReveal({
    scope: sectionRef,
    scrollEnter,
    reducedMotionTargets: [
      ".packs-header > *",
      ".pack-card",
      ".packs-payg",
      ".packs-founding",
    ],
    groups: [
      {
        selector: ".packs-header > *",
        trigger: ".packs-header",
        from: { autoAlpha: 0, y: 40 },
        to: { duration: 1, stagger: 0.12, ease: "power3.out" },
      },
      {
        selector: ".pack-card",
        from: { autoAlpha: 0, y: 48, scale: 0.98 },
        to: { duration: 1, stagger: 0.12, ease: PREMIUM_EASE, scale: 1 },
        batch: true,
      },
      {
        selector: ".packs-payg",
        trigger: ".packs-payg",
        from: { autoAlpha: 0, y: 36 },
        to: { duration: 0.95, ease: PREMIUM_EASE },
      },
      {
        selector: ".packs-founding",
        trigger: ".packs-founding",
        from: { autoAlpha: 0, y: 28 },
        to: { duration: 0.9, ease: PREMIUM_EASE },
      },
    ],
  });

  return (
    <section id="pricing" ref={sectionRef} className={`${sectionPadClass} overflow-x-hidden`}>
      <Container>
        <SectionHeader
          className="packs-header !mb-12 max-w-3xl max-lg:mx-auto max-lg:text-center lg:!mb-14"
          eyebrowClassName="opacity-0"
          titleClassName="!text-[clamp(2.25rem,4.5vw,3.75rem)] opacity-0"
          subheadClassName="!max-w-xl text-base leading-[1.6] opacity-0"
          eyebrow="Pricing"
          title={
            <>
              <span className="text-white">Pay per idea </span>
              <span className="italic text-[var(--gold)]">delivered.</span>
            </>
          }
          subhead={
            <>
              A plan when you&apos;re running ideas regularly, or a single idea when
              you&apos;re not. You&apos;re only charged for a result that ships. Failed
              runs are on us.
            </>
          }
        />

        <div className="packs-grid grid items-stretch gap-5 md:grid-cols-3 lg:gap-6">
          {packs.map((pack) => (
            <PackCard key={pack.name} pack={pack} />
          ))}
        </div>

        {/* PAYG — prominent no-commitment entry, not buried */}
        <div
          className="packs-payg mt-6 rounded border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--bg-elevated)_70%,var(--bg-deep))] px-[clamp(1.5rem,3vw,2.25rem)] py-[clamp(1.25rem,2.5vw,1.75rem)] opacity-0"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
            <div className="flex flex-1 flex-col gap-2">
              <span className="font-mono-text text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--gold)]">
                {paygEntry.label}
              </span>
              <p className="max-w-[42rem] text-[0.9375rem] leading-[1.55] text-[var(--text-secondary)]">
                {paygEntry.description}
              </p>
            </div>
            <div className="flex items-baseline gap-[0.4rem]">
              <span className="font-serif-display text-[clamp(2rem,4vw,2.75rem)] leading-none text-[var(--gold)]">
                {paygEntry.priceAmount}
              </span>
              <span className="text-[0.9375rem] text-[var(--text-secondary)]">
                {paygEntry.priceUnit}
              </span>
            </div>
            <GhostButton
              href="#early-access"
              className="min-h-11 w-full shrink-0 rounded-[2px] text-sm md:w-auto"
              onClick={() => trackWaitlistCtaClicked("pricing", { pack: "payg" })}
            >
              Join the waitlist →
            </GhostButton>
          </div>
        </div>

        {/* Founding members — ink seal under PAYG */}
        <FoundingOffer />
      </Container>
    </section>
  );
}

function PackCard({ pack }: { pack: Pack }) {
  const isFeatured = pack.featured === true;

  return (
    <article
      className={[
        "pack-card group flex h-full flex-col rounded border border-(--border-gold) bg-(--bg-elevated) px-[clamp(1.75rem,2.5vw,2.5rem)] py-[clamp(1.75rem,2.5vw,2.25rem)] opacity-0",
        "pointer-fine:transition-[transform,border-color,box-shadow,background-color] pointer-fine:duration-400 pointer-fine:ease-(--ease)",
        "pointer-fine:hover:-translate-y-0.75 pointer-fine:hover:border-[color-mix(in_srgb,var(--gold)_48%,var(--border-gold))] pointer-fine:hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--gold)_12%,transparent),0_20px_48px_rgba(0,0,0,0.34)]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        isFeatured
          ? "border-[color-mix(in_srgb,var(--gold)_42%,var(--border-gold))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--gold)_20%,transparent)]"
          : "",
      ].join(" ")}
    >
      <header className="flex items-start justify-between gap-3 max-lg:items-start max-lg:text-left">
        <div className="min-w-0 flex-auto pt-[0.05rem]">
          <h3
            className={[
              "font-serif-display text-(--text-primary)",
              isFeatured
                ? "text-[clamp(1.375rem,1.85vw,1.75rem)] leading-[1.1]"
                : "text-[clamp(1.125rem,1.45vw,1.4375rem)] leading-[1.12]",
            ].join(" ")}
          >
            {pack.name}
          </h3>
          {pack.subtitle ? (
            <p className="mt-[0.3rem] text-[clamp(0.8125rem,0.88vw,0.875rem)] leading-[1.4] text-(--text-secondary)">
              {pack.subtitle}
            </p>
          ) : null}
        </div>
        {pack.tag ? (
          <span className="mt-[0.35rem] shrink-0 self-start rounded-xs border border-[color-mix(in_srgb,var(--gold)_35%,var(--border-gold))] px-[0.55rem] py-[0.3rem] font-mono-text text-[0.625rem] uppercase tracking-[0.14em] text-[var(--gold)]">
            {pack.tag}
          </span>
        ) : null}
      </header>

      <div className="mt-1 mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-[0.35rem] max-lg:justify-center max-lg:text-center lg:text-inherit">
        <p className="flex items-baseline gap-[0.35rem]">
          <span className="font-serif-display text-[clamp(1.75rem,2.4vw,2.125rem)] leading-none text-(--gold)">
            {pack.priceAmount}
          </span>
          <span className="text-[clamp(0.9375rem,1vw,1rem)] text-(--text-secondary)">
            {pack.priceUnit}
          </span>
        </p>
      </div>

      {pack.idealFor ? (
        <p className="mb-1 flex flex-col gap-1 text-sm leading-[1.45] text-(--text-secondary)">
          <span className="font-mono-text text-[0.625rem] uppercase tracking-[0.12em] text-(--text-tertiary)">
            Ideal for
          </span>
          {pack.idealFor}
        </p>
      ) : null}

      <div
        className="mt-[1.35rem] mb-5 h-px bg-[color-mix(in_srgb,var(--border-gold)_65%,var(--border-subtle))]"
        aria-hidden="true"
      />

      <ul className="m-0 grid flex-none gap-1 p-0 list-none">
        {pack.features.map((feature) => {
          const { text, bold } = featureText(feature);
          return (
            <li
              key={text}
              className="flex gap-2 text-[clamp(0.875rem,0.92vw,0.9375rem)] leading-[1.35] text-(--text-secondary)"
            >
              <span
                className="shrink-0 text-[0.8125rem] leading-[1.35] text-(--gold)"
                aria-hidden="true"
              >
                ✓
              </span>
              <span className={bold ? "font-semibold text-(--text-secondary)" : ""}>
                {text}
              </span>
            </li>
          );
        })}
      </ul>

      <footer className="mt-auto pt-5">
        {isFeatured ? (
          <GoldButton
            href="#early-access"
            className={`${cardBtnClass} font-semibold text-(--bg-deep) hover:text-(--bg-deep)`}
            onClick={() => trackWaitlistCtaClicked("pricing", { pack: pack.name })}
          >
            {pack.cta}
          </GoldButton>
        ) : (
          <GhostButton
            href="#early-access"
            className={ghostCardBtnClass}
            onClick={() => trackWaitlistCtaClicked("pricing", { pack: pack.name })}
          >
            {pack.cta}
          </GhostButton>
        )}

        {pack.footnote ? (
          <p className="mt-[0.85rem] text-center text-sm font-medium leading-normal tracking-[0.01em] text-(--text-secondary) max-lg:justify-center max-lg:text-center lg:text-inherit">
            {pack.footnote}
          </p>
        ) : null}
      </footer>
    </article>
  );
}
