"use client";

import { useEffect, useState } from "react";
import { PrimaryCta } from "@/components/cta/PrimaryCta";

/**
 * Mobile-only bottom bar. Appears after the first screen and hides while any
 * inline CTA ([data-cta-zone]) or the footer is visible, so it never stacks on a CTA.
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let scrolledPast = false;
    const shown = new Set<Element>();
    const update = () => setVisible(scrolledPast && shown.size === 0);

    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.85;
      if (next !== scrolledPast) {
        scrolledPast = next;
        update();
      }
    };

    // Any inline CTA zone (hero form, pricing, closer, CTA bands) or the footer hides the bar.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? shown.add(e.target) : shown.delete(e.target)));
      update();
    });
    const observe = () => document.querySelectorAll("[data-cta-zone], footer").forEach((el) => io.observe(el));
    observe();

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-500 ease-[var(--ease-out)] sm:hidden ${
        visible ? "translate-y-0" : "translate-y-[130%]"
      }`}
    >
      <div className="glass flex items-center gap-3 rounded-full border border-line p-1.5 pl-4 shadow-[var(--lift-shadow)]">
        <p className="min-w-0 flex-1 truncate text-[0.82rem] text-fg-2">
          <span className="font-medium text-fg">First idea free.</span> No card.
        </p>
        <PrimaryCta location="sticky_mobile" size="md" />
      </div>
    </div>
  );
}
