"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const MAX_OFFSET = 10;

export function useMagneticHover<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      const pullX = gsap.utils.clamp(-MAX_OFFSET, MAX_OFFSET, x * 0.18);
      const pullY = gsap.utils.clamp(-MAX_OFFSET, MAX_OFFSET, y * 0.18);

      gsap.to(element, {
        x: pullX,
        y: pullY,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    const onLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    element.addEventListener("mousemove", onMove);
    element.addEventListener("mouseleave", onLeave);

    return () => {
      element.removeEventListener("mousemove", onMove);
      element.removeEventListener("mouseleave", onLeave);
      gsap.set(element, { x: 0, y: 0 });
    };
  }, []);

  return ref;
}
