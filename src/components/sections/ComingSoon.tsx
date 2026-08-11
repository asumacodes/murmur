"use client";

import { useRef } from "react";
import { MurmurMark } from "@/components/brand/MurmurMark";
import { GhostButton, GoldButton, WaitlistForm } from "@/components/ui";
import { comingSoon } from "@/content/coming-soon";
import { useSubscribeForm } from "@/hooks/useSubscribeForm";
import { trackWaitlistCtaClicked } from "@/lib/analytics/events";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionDefaults, PREMIUM_EASE } from "@/lib/motion";

export function ComingSoon() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { email, status, handleSubmit, onEmailChange } = useSubscribeForm({
    onSubmitStart: () => trackWaitlistCtaClicked("hero"),
  });

  const { social, notify, footer } = comingSoon;

  useGSAP(
    () => {
      // LCP text paints immediately; animate only secondary UI.
      const revealTargets = [".cs-ctas", ".cs-form"];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(revealTargets, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        revealTargets,
        { autoAlpha: 0, y: motionDefaults.enterY },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionDefaults.revealDuration,
          stagger: motionDefaults.revealStagger,
          ease: PREMIUM_EASE,
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-svh flex-col bg-[var(--bg-deep)] text-[var(--text-primary)]"
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="flex justify-center px-6 pt-9 md:pt-11">
        <p className="cs-wordmark m-0 flex items-center gap-3 font-serif-display text-[1.35rem] italic leading-none tracking-[-0.01em] text-[var(--gold)] md:text-2xl">
          <MurmurMark className="size-8 shrink-0 sm:size-9" />
          <span>{comingSoon.brand}</span>
        </p>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="flex w-full flex-1 flex-col items-center justify-center px-6 py-10 outline-none md:py-6 md:pb-4"
      >
        <div className="mx-auto flex w-full max-w-[42rem] flex-col items-center text-center">
          <h1 className="cs-headline m-0 max-w-full font-serif-display text-[clamp(2.35rem,7.5vw,4.25rem)] font-normal italic leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)]">
            {comingSoon.headline}
          </h1>

          <p className="cs-subhead mt-6 max-w-md text-[clamp(1rem,2.2vw,1.2rem)] leading-[1.55] text-[var(--text-primary)]">
            {comingSoon.subhead}
          </p>

          <p className="cs-hook mt-[1.15rem] max-w-lg text-[clamp(0.9rem,1.8vw,1rem)] leading-[1.65] text-[var(--text-secondary)]">
            {comingSoon.differentiation}
          </p>

          <p className="cs-status mt-7 font-mono-text text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-[var(--gold-bright)]">
            {comingSoon.statusDisplay}
          </p>

          <div className="cs-ctas mt-7 flex w-full max-w-[26rem] flex-col gap-3 opacity-0 sm:max-w-[28rem] sm:flex-row">
            <GoldButton
              href={social.x.href}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[2.875rem] w-full rounded text-[0.9375rem] sm:flex-1"
            >
              {social.x.label}
            </GoldButton>
            <GhostButton
              href={social.youtube.href}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[2.875rem] w-full rounded border-[color-mix(in_srgb,var(--gold)_55%,transparent)] text-[0.9375rem] sm:flex-1"
            >
              {social.youtube.label}
            </GhostButton>
          </div>

          <div className="cs-form mt-7 w-full max-w-[26rem] opacity-0 sm:max-w-[28rem]">
            <WaitlistForm
              variant="comingSoon"
              email={email}
              status={status}
              onEmailChange={onEmailChange}
              onSubmit={handleSubmit}
              placeholder={notify.placeholder}
              ctaLabel={notify.cta}
              inputId="notify-email"
              formAriaLabel="Get notified when Murmur is ready"
            />

            {status !== "success" ? (
              <p className="mt-[0.85rem] text-center text-[0.8125rem] leading-normal text-[var(--text-tertiary)]">
                {notify.footnote}
              </p>
            ) : null}
          </div>
        </div>
      </main>

      <footer className="flex flex-col items-center gap-[0.65rem] px-6 pb-8 pt-5 text-center md:mx-auto md:w-full md:max-w-[42rem] md:flex-row md:justify-between md:text-left">
        <p className="m-0 text-[0.8125rem]">
          <a
            href={footer.privacy.href}
            className="text-[var(--gold)] transition-colors duration-200 hover:text-[var(--gold-bright)]"
          >
            {footer.privacy.label}
          </a>
          <span aria-hidden="true" className="text-[var(--gold)]">
            {" "}
            /{" "}
          </span>
          <a
            href={footer.terms.href}
            className="text-[var(--gold)] transition-colors duration-200 hover:text-[var(--gold-bright)]"
          >
            {footer.terms.label}
          </a>
        </p>
        <a
          href={`mailto:${footer.contact}`}
          className="text-[0.8125rem] text-[var(--gold)] transition-colors duration-200 hover:text-[var(--gold-bright)]"
        >
          {footer.contact}
        </a>
      </footer>
    </div>
  );
}
