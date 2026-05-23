"use client";

import { useRef } from "react";
import { Container, SectionEyebrow } from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";

export function EarlyAccessCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".cta-content", { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ".cta-content",
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
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
    <section id="early-access" ref={sectionRef} className="section-pad">
      <Container>
        <div className="cta-content mx-auto max-w-3xl rounded-[2.5rem] border border-[var(--border-gold)] bg-[rgba(22,20,16,0.74)] px-6 py-20 text-center opacity-0 shadow-2xl shadow-black/30 sm:px-12">
          <SectionEyebrow>Join the waitlist</SectionEyebrow>
          <h2 className="font-serif-display mt-4 text-[clamp(3rem,7vw,6rem)] leading-none">
            Be early.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[var(--text-secondary)]">
            Murmur opens in private beta this summer. No spam, occasional
            updates, first access when Pack A is live.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
            action="mailto:hello@sprintzero.studio?subject=Murmur%20early%20access"
            method="post"
            encType="text/plain"
            aria-label="Early access waitlist"
            aria-describedby="waitlist-status"
          >
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="focus-ring min-h-12 flex-1 rounded-full border border-[var(--border-gold)] bg-[var(--bg-deep)] px-5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
            <button
              type="submit"
              className="focus-ring min-h-12 rounded-full bg-[var(--gold-bright)] px-6 text-sm font-semibold text-[var(--bg-deep)] transition hover:bg-[var(--gold)]"
            >
              Request early access
            </button>
          </form>
          <p
            id="waitlist-status"
            className="font-mono-text mt-5 text-xs uppercase tracking-[0.12em] text-[var(--text-tertiary)]"
          >
            Private beta · summer 2026 · one email when Pack A opens
          </p>
        </div>
      </Container>
    </section>
  );
}
