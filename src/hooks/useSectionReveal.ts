"use client";

import { type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";

export type SectionRevealGroup = {
  /** CSS selector scoped to the section ref */
  selector: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  /**
   * ScrollTrigger trigger. Defaults to `selector` (first match) so padding on
   * the section does not fire the reveal while content is still off-screen.
   */
  trigger?: string | Element | null;
  scrollEnter?: { start: string; toggleActions: string };
  /**
   * Reveal each matched element as it enters the viewport (better for long lists).
   */
  batch?: boolean;
};

type UseSectionRevealOptions = {
  scope: RefObject<HTMLElement | null>;
  groups: SectionRevealGroup[];
  /** All selectors that must be visible under reduced motion */
  reducedMotionTargets?: string[];
  scrollEnter?: { start: string; toggleActions: string };
};

/** Post-Pipeline default: larger travel, later start, snappier settle. */
const defaultFrom = { autoAlpha: 0, y: 48 };
const defaultTo = {
  autoAlpha: 1,
  y: 0,
  duration: 0.9,
  stagger: 0.1,
  ease: PREMIUM_EASE,
};

const REVEALED = "data-sr";

function takePending(els: HTMLElement[]) {
  return els.filter((el) => {
    if (el.getAttribute(REVEALED) === "1") {
      return false;
    }
    el.setAttribute(REVEALED, "1");
    return true;
  });
}

/**
 * Shared scroll-enter reveal for marketing sections.
 *
 * Uses callback ScrollTriggers (not tween-linked ones) so a pin/scrub section
 * above — and its refresh cycles — cannot auto-complete reveals off-screen.
 */
export function useSectionReveal({
  scope,
  groups,
  reducedMotionTargets,
  scrollEnter: scrollEnterOption = scrollEnter,
}: UseSectionRevealOptions) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) {
        return;
      }

      const allTargets =
        reducedMotionTargets ?? groups.map((group) => group.selector);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(allTargets, { autoAlpha: 1, y: 0, x: 0, scaleY: 1, scale: 1 });
        return;
      }

      for (const group of groups) {
        const enter = group.scrollEnter ?? scrollEnterOption;
        const from = { ...defaultFrom, ...group.from };
        const to = { ...defaultTo, ...group.to };
        const els = gsap.utils.toArray<HTMLElement>(group.selector, root);

        if (!els.length) {
          continue;
        }

        gsap.set(els, from);

        const play = (batch: HTMLElement[]) => {
          const pending = takePending(batch);
          if (!pending.length) {
            return;
          }
          gsap.to(pending, {
            ...to,
            stagger: to.stagger ?? 0.1,
            overwrite: "auto",
          });
        };

        if (group.batch) {
          ScrollTrigger.batch(els, {
            start: enter.start,
            once: true,
            onEnter: (batch) => play(batch as HTMLElement[]),
          });
          continue;
        }

        const triggerOption = group.trigger;
        const triggerEl =
          triggerOption === undefined || triggerOption === null
            ? els[0]
            : typeof triggerOption === "string"
              ? ((root.querySelector(triggerOption) as HTMLElement | null) ?? els[0])
              : triggerOption;

        ScrollTrigger.create({
          trigger: triggerEl,
          start: enter.start,
          once: true,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onEnter: () => play(els),
        });
      }
    },
    { scope },
  );
}
