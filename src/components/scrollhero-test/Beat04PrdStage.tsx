"use client";

import { useLayoutEffect } from "react";
import type { ScrollBeatStageProps } from "@/lib/scrollhero/types";

const TOC = [
  "One-liner",
  "Problem",
  "Target user",
  "Must-have features",
  "Success metrics",
  "Open questions",
] as const;

const FEATURES = [
  "Shared queue anyone in the car can add to",
  "Democratic skip / vote on the next track",
  "Works over Bluetooth or aux without an account wall",
] as const;

/**
 * Presentation-only Listener PRD pane — Shotgun artifact (full-page crop).
 */
export function Beat04PrdStage({ onLayout }: ScrollBeatStageProps) {
  useLayoutEffect(() => {
    onLayout?.();
  }, [onLayout]);

  return (
    <div
      className="beat04-prd-stage flex h-full w-full overflow-hidden bg-[#fafaf7]"
      aria-hidden="true"
    >
      <aside className="flex w-[22%] min-w-[110px] max-w-[160px] shrink-0 flex-col border-r border-[rgba(0,0,0,0.08)] px-3 py-4">
        <p className="text-[9px] font-medium tracking-[0.14em] text-[#8a8278] uppercase">
          Artifacts
        </p>
        {["PRD", "Brand kit", "Engineering", "Roadmap"].map((label, i) => (
          <div
            key={label}
            className={`mt-1.5 rounded-lg px-2 py-2 text-[11px] ${
              i === 0
                ? "bg-white font-medium text-[#1a1a1a] shadow-sm"
                : "text-[#8a8278]"
            }`}
          >
            {label}
          </div>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 gap-4 overflow-hidden px-5 py-4">
        <div className="min-w-0 flex-1 space-y-5 overflow-hidden">
          <div>
            <p className="text-[10px] font-medium tracking-[0.16em] text-[#8a7348] uppercase">
              PRD
            </p>
            <h2 className="font-serif-display mt-1 text-[clamp(1.1rem,1.8vw,1.5rem)] text-[#1a1a1a]">
              PRD — Shotgun
            </h2>
          </div>

          <div data-sh-anchor="oneliner">
            <p className="font-serif-display text-[10px] tracking-[0.16em] text-[var(--gold)] uppercase">
              One-liner
            </p>
            <p className="font-serif-display mt-2 text-[clamp(0.95rem,1.4vw,1.25rem)] leading-snug text-[#1a1a1a]">
              A shared music queue for road trips — everyone in the car
              contributes, votes, and rides shotgun on the aux.
            </p>
          </div>

          <div data-sh-anchor="feature">
            <p className="font-serif-display text-[10px] tracking-[0.16em] text-[var(--gold)] uppercase">
              Must-have features
            </p>
            <ul className="mt-2 space-y-1.5">
              {FEATURES.map((f, i) => (
                <li
                  key={f}
                  className="flex gap-2 text-[11px] leading-snug text-[#2a2218]"
                >
                  <span className="font-mono-text shrink-0 text-[10px] text-[#8a8278]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside
          className="hidden w-[120px] shrink-0 sm:block"
          data-sh-anchor="nav"
        >
          <p className="text-[9px] font-medium tracking-[0.12em] text-[#8a8278] uppercase">
            On this page
          </p>
          <p className="mt-1 text-[10px] text-[#8a8278]">6 sections</p>
          <nav className="mt-3 space-y-1.5 border-l border-[rgba(0,0,0,0.08)] pl-2">
            {TOC.map((label, i) => (
              <p
                key={label}
                className={`text-[10px] leading-tight ${
                  i === 0
                    ? "border-l-2 border-[var(--gold)] pl-2 -ml-0.5 font-medium text-[#1a1a1a]"
                    : "pl-2 text-[#8a8278]"
                }`}
              >
                {label}
              </p>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
