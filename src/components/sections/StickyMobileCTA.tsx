"use client";

import { useEffect, useState } from "react";
import { GoldButton } from "@/components/ui";
import { trackWaitlistCtaClicked } from "@/lib/analytics/events";

/**
 * Mobile-only persistent waitlist CTA. Shows after the hero (~0.8vh),
 * hides when #early-access is on screen so it doesn't stack on the form.
 * Desktop keeps the header CTA instead (md+).
 */
export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const target = document.getElementById("early-access");
    let ticking = false;

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const pastHero = window.scrollY > window.innerHeight * 0.8;

        let nearForm = false;
        if (target) {
          const rect = target.getBoundingClientRect();
          nearForm = rect.top < window.innerHeight && rect.bottom > 0;
        }

        setVisible(pastHero && !nearForm);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-deep)_95%,transparent)] px-4 py-3 backdrop-blur-sm transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <GoldButton
        href="#early-access"
        className="w-full justify-center"
        tabIndex={visible ? undefined : -1}
        onClick={() => trackWaitlistCtaClicked("sticky_mobile")}
      >
        Join early access →
      </GoldButton>
    </div>
  );
}
