"use client";

import { FormEvent, useRef, useState } from "react";
import { GhostButton, GoldButton } from "@/components/ui";
import { comingSoon } from "@/content/coming-soon";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionDefaults, PREMIUM_EASE } from "@/lib/motion";

type SubscribeStatus = "idle" | "loading" | "success" | "error";

export function ComingSoon() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");

  const { social, notify, footer } = comingSoon;

  useGSAP(
    () => {
<<<<<<< Updated upstream
      const revealTargets = [
        ".cs-wordmark",
        ".cs-headline",
        ".cs-subhead",
        ".cs-hook",
        ".cs-status",
        ".cs-ctas",
        ".cs-form",
        ".cs-footer",
      ];
=======
      // LCP text paints immediately; animate only secondary UI.
      const revealTargets = [".cs-ctas", ".cs-form"];
>>>>>>> Stashed changes

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") {
      return;
    }

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
      setStatus("error");
    }
  }

  return (
    <div ref={rootRef} className="coming-soon-page">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="coming-soon-header">
<<<<<<< Updated upstream
        <p className="cs-wordmark coming-soon-brand font-serif-display italic text-[var(--gold)] opacity-0">
=======
        <p className="cs-wordmark coming-soon-brand font-serif-display italic text-[var(--gold)]">
>>>>>>> Stashed changes
          {comingSoon.brand}
        </p>
      </header>

      <main id="main-content" tabIndex={-1} className="coming-soon-main">
        <div className="coming-soon-hero">
<<<<<<< Updated upstream
          <h1 className="cs-headline coming-soon-headline font-serif-display italic opacity-0">
            {comingSoon.headline}
          </h1>

          <p className="cs-subhead coming-soon-subhead opacity-0">
            {comingSoon.subhead}
          </p>

          <p className="cs-hook coming-soon-hook opacity-0">
            {comingSoon.differentiation}
          </p>

          <p className="cs-status coming-soon-status font-mono-text opacity-0">
=======
          <h1 className="cs-headline coming-soon-headline font-serif-display italic">
            {comingSoon.headline}
          </h1>

          <p className="cs-subhead coming-soon-subhead">
            {comingSoon.subhead}
          </p>

          <p className="cs-hook coming-soon-hook">
            {comingSoon.differentiation}
          </p>

          <p className="cs-status coming-soon-status font-mono-text">
>>>>>>> Stashed changes
            {comingSoon.statusDisplay}
          </p>

          <div className="cs-ctas coming-soon-ctas opacity-0">
            <GoldButton
              href={social.x.href}
              target="_blank"
              rel="noopener noreferrer"
              className="coming-soon-btn coming-soon-btn--primary w-full sm:w-auto sm:flex-1"
            >
              {social.x.label}
            </GoldButton>
            <GhostButton
              href={social.youtube.href}
              target="_blank"
              rel="noopener noreferrer"
              className="coming-soon-btn coming-soon-btn--ghost w-full sm:w-auto sm:flex-1"
            >
              {social.youtube.label}
            </GhostButton>
          </div>

          <div className="cs-form coming-soon-form-wrap opacity-0">
            {status === "success" ? (
              <p
                className="coming-soon-notify-done"
                role="status"
                aria-live="polite"
              >
                You&rsquo;re on the list — we&rsquo;ll email you when
                it&rsquo;s live.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="coming-soon-notify-form"
                aria-label="Get notified when Murmur is ready"
              >
                <label className="sr-only" htmlFor="notify-email">
                  Email address
                </label>
                <input
                  id="notify-email"
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
                  placeholder={notify.placeholder}
                  disabled={status === "loading"}
                  className="coming-soon-notify-input"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="coming-soon-notify-submit focus-ring"
                >
                  {status === "loading" ? "Sending…" : notify.cta}
                </button>
              </form>
            )}

            {status === "error" ? (
              <p
                className="coming-soon-notify-error"
                role="alert"
                aria-live="assertive"
              >
                Something went wrong — try again in a moment.
              </p>
            ) : null}

            {status !== "success" ? (
              <p className="coming-soon-notify-footnote">{notify.footnote}</p>
            ) : null}
          </div>
        </div>
      </main>

<<<<<<< Updated upstream
      <footer className="cs-footer coming-soon-footer opacity-0">
=======
      <footer className="coming-soon-footer">
>>>>>>> Stashed changes
        <p className="coming-soon-footer-legal">
          <a href={footer.privacy.href} className="coming-soon-footer-link">
            {footer.privacy.label}
          </a>
          <span aria-hidden="true" className="coming-soon-footer-sep">
            {" "}
            /{" "}
          </span>
          <a href={footer.terms.href} className="coming-soon-footer-link">
            {footer.terms.label}
          </a>
        </p>
        <a
          href={`mailto:${footer.contact}`}
          className="coming-soon-footer-link coming-soon-footer-contact"
        >
          {footer.contact}
        </a>
      </footer>
    </div>
  );
}
