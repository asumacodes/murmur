"use client";

import { GoldButton } from "@/components/ui";
import { foundingReward } from "@/content/home";
import { trackWaitlistCtaClicked } from "@/lib/analytics/events";

/** Founding member offer — split row + CTA (same family as PAYG). */
export function FoundingOffer() {
  return (
    <div className="packs-founding mt-6 rounded border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--bg-elevated)_70%,var(--bg-deep))] px-[clamp(1.5rem,3vw,2.25rem)] py-[clamp(1.25rem,2.5vw,1.75rem)] opacity-0">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="font-mono-text text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--gold)]">
            {foundingReward.eyebrow}
          </span>
          <h3 className="font-serif-display text-[clamp(1.2rem,2.2vw,1.65rem)] leading-[1.15] text-[var(--text-primary)]">
            First 50 · double ideas · 1 year
          </h3>
          <p className="max-w-[36rem] text-[0.9375rem] leading-[1.55] text-[var(--text-secondary)]">
            {foundingReward.body}
          </p>
        </div>
        <GoldButton
          href="#early-access"
          className="min-h-11 w-full shrink-0 rounded-[2px] text-sm font-semibold !text-[var(--bg-deep)] md:w-auto"
          onClick={() =>
            trackWaitlistCtaClicked("pricing", { pack: "founding" })
          }
        >
          Join the waitlist →
        </GoldButton>
      </div>
    </div>
  );
}
