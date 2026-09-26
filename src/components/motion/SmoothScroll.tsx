"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis on fine-pointer desktops only; touch devices keep native momentum.
 * Anchor links glide instead of jumping.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse), (max-width: 1023px)").matches;

    if (reduceMotion || coarse) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      anchors: { offset: -72 },
      prevent: (node) => node.closest?.("dialog, [data-lenis-prevent]") != null,
    });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh);
    } else {
      requestAnimationFrame(refresh);
    }

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return children;
}
