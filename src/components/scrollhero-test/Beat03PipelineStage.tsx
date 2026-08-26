"use client";

import { useLayoutEffect } from "react";
import type { ScrollBeatStageProps } from "@/lib/scrollhero/types";

const STAGE_ITEMS = [
  { label: "Competitor map", state: "done" as const },
  { label: "PRD", state: "done" as const },
  { label: "Brand kit", state: "done" as const },
  { label: "Engineering brief", state: "now" as const },
];

/**
 * Presentation-only Listener live-run view — Stage 4 of 4 / Building your board.
 * Full-page crop (no modal).
 */
export function Beat03PipelineStage({ onLayout }: ScrollBeatStageProps) {
  useLayoutEffect(() => {
    onLayout?.();
  }, [onLayout]);

  return (
    <div
      className="beat03-pipeline-stage flex h-full w-full overflow-hidden bg-[#fafaf7]"
      aria-hidden="true"
    >
      <aside className="flex w-[28%] min-w-[140px] max-w-[200px] shrink-0 flex-col border-r border-[rgba(0,0,0,0.08)] px-3 py-4">
        <p className="font-serif-display text-[15px] text-[#1a1a1a]">Shotgun</p>
        <p
          className="mt-4 text-[9px] font-medium tracking-[0.14em] text-[#8a8278] uppercase"
          data-sh-anchor="progress"
        >
          Stage 4 of 4
        </p>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[rgba(201,169,110,0.2)]">
          <div className="h-full w-full rounded-full bg-[var(--gold)]" />
        </div>

        <div className="mt-5 space-y-1" data-sh-anchor="stages">
          <p className="mb-2 text-[9px] font-medium tracking-[0.12em] text-[#8a8278] uppercase">
            Stage 4 · Now
          </p>
          {STAGE_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`flex h-9 items-center gap-2 rounded-lg px-2 text-[11px] ${
                item.state === "now"
                  ? "bg-[rgba(201,169,110,0.12)] text-[#1a1a1a]"
                  : "text-[#6b6760]"
              }`}
            >
              <span
                className={`size-1.5 shrink-0 rounded-full ${
                  item.state === "done" ? "bg-[var(--gold)]" : "bg-[var(--gold)] animate-pulse"
                }`}
              />
              <span className="min-w-0 truncate">{item.label}</span>
              {item.state === "done" ? (
                <span className="ml-auto text-[9px] text-[#8a8278]">Done</span>
              ) : (
                <span className="ml-auto text-[9px] text-[var(--gold)]">Writing</span>
              )}
            </div>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-6 py-8 text-center">
        <span className="rounded-full border border-[rgba(201,169,110,0.35)] bg-[rgba(201,169,110,0.1)] px-3 py-1 text-[10px] font-medium tracking-[0.14em] text-[#8a7348] uppercase">
          Stage 4 of 4
        </span>

        <div
          className="mt-8 flex flex-col items-center"
          data-sh-anchor="building"
        >
          <div className="grid size-[120px] place-items-center rounded-2xl border border-dashed border-[rgba(0,0,0,0.12)] bg-white">
            <div className="flex gap-1.5">
              <span className="h-8 w-1.5 rounded-full bg-[var(--gold)] opacity-80" />
              <span className="h-8 w-1.5 rounded-full bg-[var(--gold)]" />
              <span className="h-8 w-1.5 rounded-full bg-[var(--gold)] opacity-60" />
            </div>
          </div>
          <h3 className="font-serif-display mt-6 text-[clamp(1.25rem,2vw,1.75rem)] text-[#1a1a1a]">
            Building your board…
          </h3>
          <p className="mt-2 text-[13px] text-[#6b6760]">
            Assembling your workspace.
          </p>
          <p className="mt-4 text-[11px] text-[#8a8278]">
            This usually takes about a minute.
          </p>
        </div>
      </div>
    </div>
  );
}
