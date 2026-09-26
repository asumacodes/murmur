"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One IntersectionObserver for every [data-reveal] element on the page.
 * The hidden state is gated on html.js (set here), so content is never
 * hidden from crawlers or when JS fails.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const observeAll = () => {
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    };
    observeAll();

    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    // Pointer-tracked glow on .spotlight cards (one listener for the page).
    const onMove = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });

    // Magnetic CTAs: [data-magnetic] leans toward a fine pointer (max ~6px).
    const canMagnet =
      window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let magnet: HTMLElement | null = null;
    const onMagnet = (event: PointerEvent) => {
      const el = (event.target as Element | null)?.closest?.<HTMLElement>("[data-magnetic]") ?? null;
      if (magnet && magnet !== el) {
        magnet.style.transform = "";
        magnet = null;
      }
      if (!el) return;
      magnet = el;
      const r = el.getBoundingClientRect();
      const dx = (event.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (event.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.transform = `translate3d(${(dx * 6).toFixed(1)}px, ${(dy * 4).toFixed(1)}px, 0)`;
    };
    const onLeaveDoc = () => {
      if (magnet) magnet.style.transform = "";
      magnet = null;
    };
    if (canMagnet) {
      document.addEventListener("pointermove", onMagnet, { passive: true });
      document.addEventListener("pointerleave", onLeaveDoc);
    }

    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointermove", onMagnet);
      document.removeEventListener("pointerleave", onLeaveDoc);
    };
  }, [pathname]);

  return null;
}
