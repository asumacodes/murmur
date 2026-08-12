"use client";

import { useEffect } from "react";
import { trackScrollDepth, trackSectionViewed } from "@/lib/analytics/events";

/**
 * Fires once-per-section and once-per-depth-milestone per page load.
 * Separate from useScrollSpy (nav highlighting) so analytics and UI stay decoupled.
 * Explicit events only — no autocapture.
 */
export function useSectionAnalytics(sectionIds: readonly string[]) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const seen = new Set<string>();
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    let sectionObserver: IntersectionObserver | null = null;

    if (sections.length) {
      // 25%: tall sections (e.g. pipeline) may never hit 40% of their height on mobile.
      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              entry.intersectionRatio >= 0.25 &&
              !seen.has(entry.target.id)
            ) {
              seen.add(entry.target.id);
              trackSectionViewed(entry.target.id, {
                order: sectionIds.indexOf(entry.target.id),
              });
            }
          });
        },
        { threshold: [0, 0.25] },
      );

      sections.forEach((section) => sectionObserver!.observe(section));
    }

    const milestones: Array<25 | 50 | 75 | 100> = [25, 50, 75, 100];
    const fired = new Set<number>();
    let ticking = false;

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        if (scrollable <= 0) {
          return;
        }

        const pct = (window.scrollY / scrollable) * 100;
        milestones.forEach((milestone) => {
          if (pct >= milestone && !fired.has(milestone)) {
            fired.add(milestone);
            trackScrollDepth(milestone);
          }
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      sectionObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sectionIds]);
}
