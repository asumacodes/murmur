"use client";

import { useRef } from "react";
import { Container, SectionEyebrow, WaitlistForm } from "@/components/ui";
import { waitlistSection } from "@/content/home";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { useSubscribeForm } from "@/hooks/useSubscribeForm";
import { trackWaitlistCtaClicked } from "@/lib/analytics/events";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";

export function EarlyAccessCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { email, status, handleSubmit, onEmailChange } = useSubscribeForm({
    onSubmitStart: () => trackWaitlistCtaClicked("form_submit"),
  });

  useSectionReveal({
    scope: sectionRef,
    scrollEnter,
    groups: [
      {
        selector: ".waitlist-eyebrow, .waitlist-headline, .waitlist-copy",
        trigger: ".waitlist-inner",
        from: { autoAlpha: 0, y: 44 },
        to: { duration: 1, stagger: 0.14, ease: PREMIUM_EASE },
      },
      {
        selector: ".waitlist-form, .waitlist-footnote",
        trigger: ".waitlist-form",
        from: { autoAlpha: 0, y: 32 },
        to: { duration: 0.9, stagger: 0.12, ease: PREMIUM_EASE },
      },
    ],
  });

  return (
    <section
      id="early-access"
      ref={sectionRef}
      className="mt-18 relative isolate border-y border-[color-mix(in_srgb,var(--border-gold)_72%,transparent)] bg-[var(--bg-warm)] bg-[radial-gradient(ellipse_90%_75%_at_50%_35%,rgba(201,169,110,0.09),transparent_58%),radial-gradient(circle_at_50%_100%,rgba(0,0,0,0.28),transparent_52%),linear-gradient(180deg,color-mix(in_srgb,var(--bg-warm)_88%,#1a1610)_0%,rgba(22,20,16,0.94)_48%,color-mix(in_srgb,var(--bg-warm)_92%,#121010)_100%)] pt-[clamp(2.75rem,5.5vw,4.5rem)] pb-[clamp(4rem,8vw,7rem)] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[radial-gradient(circle_at_50%_0%,rgba(232,168,32,0.04),transparent_42%)] before:content-['']"
    >
      <Container>
        <div className="waitlist-inner relative z-[1] mx-auto max-w-2xl text-center">
          <SectionEyebrow className="waitlist-eyebrow opacity-0">
            {waitlistSection.eyebrow}
          </SectionEyebrow>

          <h2 className="waitlist-headline mt-4 font-serif-display text-[clamp(3.25rem,8vw,7rem)] italic leading-[0.95] tracking-[-0.02em] text-[var(--text-primary)] opacity-0">
            {waitlistSection.headline}
          </h2>

          <p className="waitlist-copy mx-auto mt-6 max-w-xl text-base leading-7 text-[var(--text-secondary)] opacity-0 sm:text-lg sm:leading-8">
            {waitlistSection.description}
          </p>

          <div className="waitlist-form mx-auto mt-8 w-full max-w-lg opacity-0 sm:w-fit sm:max-w-full">
            <WaitlistForm
              variant="waitlist"
              email={email}
              status={status}
              onEmailChange={onEmailChange}
              onSubmit={handleSubmit}
              placeholder={waitlistSection.placeholder}
              ctaLabel={waitlistSection.cta}
              inputId="waitlist-email"
              formAriaLabel="Early access waitlist"
            />
          </div>

          {status !== "success" ? (
            <p className="waitlist-footnote mt-5 font-mono-text text-xs font-normal leading-normal tracking-[0.01em] text-[var(--text-tertiary)] opacity-0">
              {waitlistSection.footnote}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
