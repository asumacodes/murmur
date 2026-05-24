"use client";

import { useRef } from "react";
import { Container, SectionEyebrow } from "@/components/ui";
import { waitlistSection } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";

export function EarlyAccessCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const revealTargets = [
        ".waitlist-eyebrow",
        ".waitlist-headline",
        ".waitlist-copy",
        ".waitlist-counter",
        ".waitlist-form",
        ".waitlist-footnote",
      ];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(revealTargets, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        revealTargets,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.1,
          ease: PREMIUM_EASE,
          scrollTrigger: {
            trigger: sectionRef.current,
            ...scrollEnter,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="early-access" ref={sectionRef} className="waitlist-section section-pad">
      <Container>
        <div className="waitlist-inner mx-auto max-w-2xl text-center">
          <SectionEyebrow className="waitlist-eyebrow opacity-0">
            {waitlistSection.eyebrow}
          </SectionEyebrow>

          <h2 className="waitlist-headline font-serif-display opacity-0">
            {waitlistSection.headline}
          </h2>

          <p className="waitlist-copy mx-auto mt-6 max-w-xl text-base leading-7 text-[var(--text-secondary)] opacity-0 sm:text-lg sm:leading-8">
            {waitlistSection.description}
          </p>

          <p className="waitlist-counter font-mono-text mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--gold)_38%,transparent)] px-4 py-2 text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--gold)] opacity-0">
            <span className="waitlist-counter-dot" aria-hidden="true" />
            {waitlistSection.count} {waitlistSection.countLabel}
          </p>

          <form
            className="waitlist-form mx-auto mt-8 flex flex-col items-center gap-3 opacity-0 sm:flex-row sm:items-stretch"
            action="mailto:hello@sprintzero.studio?subject=Murmur%20early%20access"
            method="post"
            encType="text/plain"
            aria-label="Early access waitlist"
          >
            <label className="sr-only" htmlFor="waitlist-email">
              Email address
            </label>
            <input
              id="waitlist-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={waitlistSection.placeholder}
              required
              className="waitlist-input flex-1 rounded-sm border bg-[var(--bg-deep)] px-4 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
            <button type="submit" className="waitlist-submit focus-ring">
              {waitlistSection.cta}
            </button>
          </form>

          <p className="waitlist-footnote opacity-0">{waitlistSection.footnote}</p>
        </div>
      </Container>
    </section>
  );
}
