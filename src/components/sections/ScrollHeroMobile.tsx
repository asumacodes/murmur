"use client";

import { useEffect, useRef } from "react";
import { beatStages, SCROLL_BEATS } from "@/components/scrollhero-test/beats";
import { MagneticGoldButton } from "@/components/ui/MagneticGoldButton";
import {
  trackScrollHeroBeatViewed,
  trackScrollHeroCompleted,
  trackWaitlistCtaClicked,
} from "@/lib/analytics/events";
import { markCinematicIntroComplete } from "@/lib/cinematicIntro";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollEnter } from "@/lib/motion";
import type { ComponentType } from "react";
import type { ScrollBeatStageProps } from "@/lib/scrollhero/types";

type StageProps = ScrollBeatStageProps;

function StageLayer({
  Stage,
}: {
  Stage: ComponentType<StageProps>;
}) {
  return <Stage active={false} />;
}

function hotspotCaption(lines: string[]) {
  return lines.join(" ");
}

/**
 * Stacked scroll-hero for mobile and prefers-reduced-motion.
 * Normal document flow — no pin, no absolute beat pile-up.
 */
export function ScrollHeroMobile({ className }: { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const completedRef = useRef(false);
  const viewedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    markCinematicIntroComplete();
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) {
        return;
      }

      const sections = gsap.utils.toArray<HTMLElement>("[data-sh-mobile-beat]", root);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(sections, { autoAlpha: 1, y: 0 });
        return;
      }

      sections.forEach((section, index) => {
        const beat = SCROLL_BEATS[index];
        gsap.set(section, { autoAlpha: 0, y: 20 });

        ScrollTrigger.create({
          trigger: section,
          start: scrollEnter.start,
          once: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            gsap.to(section, {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
            });

            if (beat && !viewedRef.current.has(beat.id)) {
              viewedRef.current.add(beat.id);
              trackScrollHeroBeatViewed(beat.id);
            }

            if (
              index === SCROLL_BEATS.length - 1 &&
              !completedRef.current
            ) {
              completedRef.current = true;
              trackScrollHeroCompleted();
            }
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: rootRef },
  );

  const onWaitlistClick = () => {
    trackWaitlistCtaClicked("scroll_hero");
  };

  return (
    <section
      ref={rootRef}
      className={`bg-[var(--bg-deep)] ${className ?? ""}`}
      aria-label="Murmur product story"
    >
      {SCROLL_BEATS.map((beat) => {
        const Stage = beatStages[beat.id];

        return (
          <article
            key={beat.id}
            data-sh-mobile-beat={beat.id}
            className="flex min-h-[85vh] flex-col px-6 py-14 sm:px-8 sm:py-16"
          >
            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
              <p className="font-mono-text text-[0.6875rem] tracking-[0.16em] text-[var(--gold)] uppercase">
                {beat.eyebrow}
              </p>
              <h2 className="font-serif-display mt-4 text-[clamp(1.85rem,7.5vw,2.65rem)] leading-[1.08] text-[var(--text-primary)]">
                {beat.headline.join(" ")}
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">
                {beat.subhead}
              </p>

              {Stage ? (
                <>
                  <div
                    className="mt-8 w-full overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-[0_24px_48px_rgba(0,0,0,0.35)]"
                  >
                    <div className="relative aspect-[16/10] bg-[var(--bg-elevated)]">
                      <StageLayer Stage={Stage} />
                    </div>
                  </div>

                  {beat.hotspots.length > 0 ? (
                    <ul className="mt-5 space-y-2.5" aria-label="Key details">
                      {beat.hotspots.map((hotspot) => (
                        <li
                          key={hotspot.id}
                          className="flex gap-2 text-[0.875rem] leading-snug text-[var(--text-secondary)]"
                        >
                          <span className="text-[var(--gold)]" aria-hidden="true">·</span>
                          <span>{hotspotCaption(hotspot.lines)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                <div className="mt-10 flex flex-1 flex-col justify-end">
                  <p className="font-mono-text text-[0.7rem] tracking-[0.12em] text-[var(--gold)] uppercase">
                    8 of 8 artifacts delivered
                  </p>
                  <MagneticGoldButton
                    href="#early-access"
                    className="mt-4 min-h-11 w-full max-w-sm px-5 text-[0.9375rem] sm:w-auto"
                    onClick={onWaitlistClick}
                  >
                    Join the waitlist
                  </MagneticGoldButton>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
