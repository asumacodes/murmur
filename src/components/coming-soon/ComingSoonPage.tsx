"use client";

import { useRef } from "react";
import { ComingSoonFooter } from "@/components/coming-soon/ComingSoonFooter";
import { ComingSoonHeader } from "@/components/coming-soon/ComingSoonHeader";
import { ComingSoonHero } from "@/components/coming-soon/ComingSoonHero";
import { gsap, useGSAP } from "@/lib/gsap";
import { PREMIUM_EASE } from "@/lib/motion";

export function ComingSoonPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>(".cs-reveal", pageRef.current);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(targets, { autoAlpha: 0, y: 18 });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: PREMIUM_EASE,
          delay: 0.12,
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.05,
          ease: PREMIUM_EASE,
          delay: 0.06,
        });
      });

      return () => mm.revert();
    },
    { scope: pageRef },
  );

  return (
    <div ref={pageRef} className="coming-soon-page">
      <a href="#coming-soon-main" className="skip-link">
        Skip to content
      </a>
      <ComingSoonHeader />
      <main id="coming-soon-main" className="coming-soon-main" tabIndex={-1}>
        <ComingSoonHero />
      </main>
      <ComingSoonFooter />
    </div>
  );
}
