"use client";

import { type RefObject, useEffect, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const TIMER_START = 10;
const TIMER_END = 15;
const TICK_MS = 1000;
const LOOP_PAUSE_MS = 800;

export function useBeat01RecordingDemo(
  scope: RefObject<HTMLElement | null>,
  active: boolean,
) {
  const [seconds, setSeconds] = useState(TIMER_START);

  useEffect(() => {
    if (!active) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setSeconds(13);
      return;
    }

    let current = TIMER_START;
    let intervalId = 0;
    let pauseId = 0;

    setSeconds(TIMER_START);

    const startTicking = () => {
      intervalId = window.setInterval(() => {
        if (current < TIMER_END) {
          current += 1;
          setSeconds(current);
          return;
        }

        window.clearInterval(intervalId);
        intervalId = 0;
        pauseId = window.setTimeout(() => {
          current = TIMER_START;
          setSeconds(TIMER_START);
          startTicking();
        }, LOOP_PAUSE_MS);
      }, TICK_MS);
    };

    startTicking();

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(pauseId);
    };
  }, [active]);

  useGSAP(
    () => {
      if (!active || !scope.current) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const bars = gsap.utils.toArray<HTMLElement>(
        ".listener-demo-wave-bar",
        scope.current,
      );
      const barTweens = bars.map((bar) =>
        gsap.to(bar, {
          scaleY: "random(0.35, 1.15)",
          transformOrigin: "bottom center",
          duration: "random(0.45, 0.9)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        }),
      );

      return () => {
        barTweens.forEach((tween) => tween.kill());
      };
    },
    { scope, dependencies: [active] },
  );

  return { elapsedSeconds: seconds };
}
