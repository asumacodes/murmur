"use client";

import { ctaMode } from "@/config/features";
import { ctaCopy } from "@/content/cta";
import { closer } from "@/content/home";
import { FoundingChip } from "@/components/cta/FoundingChip";
import { PrimaryCta } from "@/components/cta/PrimaryCta";
import { WaitlistForm } from "@/components/cta/WaitlistForm";

export function Closer() {
  return (
    <section id="closer" data-cta-zone aria-labelledby="closer-title" className="relative isolate overflow-hidden py-[clamp(5rem,12vw,10rem)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal opacity-[0.09] blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 flex h-40 items-end justify-center gap-[4px] opacity-40">
          {Array.from({ length: 64 }, (_, i) => (
            <span
              key={i}
              className="bar-dance w-[3px] rounded-full bg-fg/40"
              style={{
                height: `${(12 + Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.31)) * 88 * Math.exp(-((i - 32) ** 2) / 500)).toFixed(1)}%`,
                animationDelay: `${((i % 9) * 0.11).toFixed(2)}s`,
                animationDuration: `${(0.9 + (i % 4) * 0.2).toFixed(2)}s`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="wrap text-center">
        <p data-reveal className="eyebrow inline-flex items-center gap-2">
          <span className="rec-dot text-signal" aria-hidden="true" /> {closer.eyebrow}
        </p>
        <h2 id="closer-title" data-reveal style={{ ["--reveal-i" as string]: 1 }} className="display-hero mx-auto mt-6">
          <span className="block">{closer.titleLine1}</span>
          <span className="serif-accent block text-signal">{closer.titleLine2}</span>
        </h2>
        <p data-reveal style={{ ["--reveal-i" as string]: 2 }} className="lede mx-auto mt-6 max-w-xl">
          {closer.body}
        </p>
        <div data-reveal style={{ ["--reveal-i" as string]: 3 }} className="mx-auto mt-9 max-w-[34rem] text-left">
          {ctaMode === "waitlist" ? (
            <WaitlistForm location="closer" variant="closer" />
          ) : (
            <div className="flex justify-center">
              <PrimaryCta location="closer" size="lg" label={ctaCopy.signup.button} />
            </div>
          )}
          <div className="mt-4 flex justify-center">
            <FoundingChip />
          </div>
        </div>
      </div>
    </section>
  );
}
