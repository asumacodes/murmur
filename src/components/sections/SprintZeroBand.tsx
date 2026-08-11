"use client";

import { useRef } from "react";
import { Container, GoldButton, SectionEyebrow } from "@/components/ui";
import { sprintZeroBand } from "@/content/home";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { trackWaitlistCtaClicked } from "@/lib/analytics/events";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";

/** Adjacent-product handoff. Sits between FAQ and waitlist. */
export function SprintZeroBand() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionReveal({
    scope: sectionRef,
    scrollEnter,
    groups: [
      {
        selector: ".sprintzero-band",
        trigger: ".sprintzero-band",
        from: { autoAlpha: 0, y: 36, scale: 0.985 },
        to: { duration: 0.85, ease: PREMIUM_EASE, scale: 1 },
      },
      {
        selector: ".sprintzero-line",
        trigger: ".sprintzero-band",
        from: { autoAlpha: 0, y: 24 },
        to: { duration: 0.85, stagger: 0.12, ease: PREMIUM_EASE, delay: 0.12 },
      },
    ],
  });

  return (
    <section
      id="sprintzero"
      ref={sectionRef}
      className="py-[clamp(2.75rem,5.5vw,4.5rem)]"
      aria-label="SprintZero"
    >
      <Container>
        <div className="sprintzero-band rounded border border-(--border-gold) bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bg-elevated)_92%,var(--gold))_0%,var(--bg-elevated)_60%)] px-[clamp(1.75rem,4vw,3.25rem)] py-[clamp(2rem,4vw,3rem)] opacity-0">
          <SectionEyebrow className="sprintzero-line opacity-0">
            {sprintZeroBand.eyebrow}
          </SectionEyebrow>
          <h2 className="sprintzero-line font-serif-display mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] opacity-0">
            {sprintZeroBand.headline}
          </h2>
          <p className="sprintzero-line mt-4 max-w-2xl text-base leading-[1.6] text-(--text-secondary) opacity-0">
            {sprintZeroBand.body}
          </p>
          <div className="sprintzero-line mt-7 flex flex-col items-start gap-3 opacity-0 sm:flex-row sm:items-center">
            <GoldButton
              href={sprintZeroBand.ctaHref}
              className="min-h-11 rounded-xs text-sm font-semibold"
              onClick={() => trackWaitlistCtaClicked("sprintzero_band")}
            >
              {sprintZeroBand.cta}
            </GoldButton>
            <span className="font-mono-text text-xs text-(--text-tertiary) opacity-[0.85]">
              {sprintZeroBand.responsePromise}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
