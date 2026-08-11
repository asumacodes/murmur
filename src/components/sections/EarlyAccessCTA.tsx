"use client";

import { FormEvent, useRef, useState } from "react";
import { Container, SectionEyebrow } from "@/components/ui";
import { waitlistSection } from "@/content/home";
import { trackWaitlistCtaClicked } from "@/lib/analytics/events";
import { gsap, useGSAP } from "@/lib/gsap";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";

type SubscribeStatus = "idle" | "loading" | "success" | "error";

export function EarlyAccessCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const submitGuardRef = useRef(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");

  useGSAP(
    () => {
      const revealTargets = [
        ".waitlist-eyebrow",
        ".waitlist-headline",
        ".waitlist-copy",
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitGuardRef.current || status === "loading") {
      return;
    }
    submitGuardRef.current = true;
    trackWaitlistCtaClicked("form_submit");

    setStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("subscribe failed");
      }

      setStatus("success");
      setEmail("");
    } catch {
      submitGuardRef.current = false;
      setStatus("error");
    }
  }

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

          <div className="waitlist-form mx-auto mt-8 opacity-0">
            {status === "success" ? (
              <p
                className="waitlist-done font-mono-text text-[var(--gold)]"
                role="status"
                aria-live="polite"
              >
                You&rsquo;re on the list — we&rsquo;ll email you when it&rsquo;s live.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="waitlist-form-row mx-auto flex flex-col items-center gap-3 sm:flex-row sm:items-stretch"
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
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status === "error") {
                      setStatus("idle");
                    }
                  }}
                  placeholder={waitlistSection.placeholder}
                  disabled={status === "loading"}
                  className="waitlist-input flex-1 rounded-sm border bg-[var(--bg-deep)] px-4 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="waitlist-submit focus-ring"
                >
                  {status === "loading" ? "Sending…" : waitlistSection.cta}
                </button>
              </form>
            )}

            {status === "error" ? (
              <p className="waitlist-error mt-3" role="alert" aria-live="assertive">
                Something went wrong — try again in a moment.
              </p>
            ) : null}
          </div>

          {status !== "success" ? (
            <p className="waitlist-footnote opacity-0">{waitlistSection.footnote}</p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
