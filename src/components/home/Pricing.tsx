"use client";

import { ctaMode } from "@/config/features";
import { ctaCopy } from "@/content/cta";
import { pricing } from "@/content/home";
import { useFounding } from "@/components/cta/FoundingChip";
import { PrimaryCta } from "@/components/cta/PrimaryCta";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { trackPricingTierClicked } from "@/lib/analytics/events";

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 size-3.5 shrink-0 text-ok" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 50 spots as 50 ticks; claimed ones fill in. Hidden unless the live count loaded. */
function FoundingMeter() {
  const data = useFounding();
  if (!data) return null;
  return (
    <div className="mt-6">
      <div className="flex gap-[3px]" role="img" aria-label={`${data.claimed} of ${data.cap} founding spots claimed`}>
        {Array.from({ length: data.cap }, (_, i) => (
          <span key={i} className={`h-7 flex-1 rounded-[2px] ${i < data.claimed ? "bg-signal" : "bg-line-2"}`} />
        ))}
      </div>
      <p className="mt-2.5 flex items-center justify-between font-mono text-[0.72rem] text-fg-3">
        <span>
          <strong className="font-semibold text-fg">{data.left}</strong> of {data.cap} spots left
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-ok" aria-hidden="true" /> Live count
        </span>
      </p>
    </div>
  );
}

export function Pricing() {
  const label = ctaMode === "signup" ? ctaCopy.signup.short : ctaCopy.waitlist.short;
  return (
    <section id="pricing" data-cta-zone aria-labelledby="pricing-title" className="section relative">
      <div className="wrap">
        <SectionHeading id="pricing-title" eyebrow={pricing.eyebrow} title={pricing.title} accent={pricing.titleAccent} sub={pricing.subhead} />

        {/* First idea + founding members: the two reasons to start now, side by side */}
        <div data-reveal className="card relative mt-14 grid overflow-hidden lg:grid-cols-[1.15fr_1fr]">
          <div className="relative p-6 sm:p-9">
            <p className="eyebrow">{pricing.free.name}</p>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-7xl font-semibold leading-none tracking-[-0.05em]">$0</span>
              <span className="text-fg-2">{pricing.free.tagline}</span>
            </p>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-fg-2">{pricing.free.note}</p>
            <div className="mt-7">
              <PrimaryCta location="pricing" size="lg" label={ctaMode === "signup" ? ctaCopy.signup.button : ctaCopy.waitlist.button} />
            </div>
          </div>
          <div className="relative border-t border-line bg-[color-mix(in_srgb,var(--surface-2)_60%,transparent)] p-6 sm:p-9 lg:border-l lg:border-t-0">
            <p className="eyebrow flex items-center gap-2">
              <span className="rec-dot text-signal" aria-hidden="true" /> {pricing.foundingTitle}
            </p>
            <p className="display-3 mt-3">{pricing.foundingHeadline}</p>
            <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-fg-2">{pricing.founding}</p>
            <FoundingMeter />
          </div>
        </div>

        <div className="no-scrollbar -mx-[var(--gutter)] mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {/* PAYG */}
          <article data-reveal className="card flex w-[82vw] max-w-sm shrink-0 snap-center flex-col p-6 lg:w-auto lg:max-w-none">
            <h3 className="text-lg font-semibold">{pricing.payg.name}</h3>
            <p className="mt-1 text-sm text-fg-2">{pricing.payg.note}</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-5xl font-semibold tracking-[-0.05em]">{pricing.payg.price}</span>
              <span className="text-fg-3">{pricing.payg.unit}</span>
            </p>
            <p className="mt-1 font-mono text-[0.7rem] text-fg-3">One idea, whenever you need it</p>
            <div className="mt-auto pt-8">
              <PrimaryCta
                location="pricing"
                tier="payg"
                tierLabel="Pay as you go"
                label={label}
                fullWidth
                className="!bg-surface-3 !text-fg hover:!bg-line-2"
                onClick={() => trackPricingTierClicked("payg", ctaMode)}
              />
            </div>
          </article>

          {pricing.plans.map((plan, i) => {
            const perIdea = (plan.price / plan.ideas).toFixed(2);
            return (
              <article
                key={plan.name}
                data-reveal
                style={{ ["--reveal-i" as string]: i + 1 }}
                className={`card relative flex w-[82vw] max-w-sm shrink-0 snap-center flex-col p-6 lg:w-auto lg:max-w-none ${
                  plan.highlight ? "border-signal/60 ring-1 ring-signal/30" : ""
                }`}
              >
                {plan.highlight ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-signal px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-on-signal">
                    Recommended
                  </span>
                ) : null}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-fg-2">{plan.blurb}</p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-semibold tracking-[-0.05em]">${plan.price}</span>
                  <span className="text-fg-3">/ month</span>
                </p>
                <p className="mt-1 font-mono text-[0.7rem] text-fg-3">
                  ${perIdea} per idea <span className="text-fg-3/70">vs $7 pay-as-you-go</span>
                </p>
                <ul className="mt-6 grid gap-2.5 text-[0.9rem] text-fg-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <PrimaryCta
                    location="pricing"
                    tier={plan.tier}
                    tierLabel={plan.name}
                    label={label}
                    fullWidth
                    className={plan.highlight ? "" : "!bg-fg !text-bg hover:!bg-[color-mix(in_srgb,var(--fg)_85%,var(--bg))]"}
                    onClick={() => trackPricingTierClicked(plan.tier, ctaMode)}
                  />
                </div>
              </article>
            );
          })}
        </div>

        <ul className="mt-6 flex flex-col gap-2 text-[0.85rem] text-fg-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {pricing.footnotes.map((note) => (
            <li key={note} className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-fg-3" aria-hidden="true" />
              {note}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
