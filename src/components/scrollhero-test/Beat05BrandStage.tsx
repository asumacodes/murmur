"use client";

import { useLayoutEffect } from "react";
import type { ScrollBeatStageProps } from "@/lib/scrollhero/types";

const SWATCHES = [
  { name: "Asphalt", hex: "#1A1A1A" },
  { name: "Cream", hex: "#FAFAF7" },
  { name: "Gold", hex: "#C9A96E" },
  { name: "Signal", hex: "#D63B30" },
  { name: "Fog", hex: "#8A8278" },
] as const;

const VALUES = [
  { title: "Shared control", body: "Nobody owns the aux alone." },
  { title: "Low friction", body: "Join the queue in one tap." },
  { title: "Trip memory", body: "Keep the playlist after the drive." },
  { title: "Fair votes", body: "The car decides what plays next." },
] as const;

/**
 * Presentation-only Listener Brand kit pane — Workspace beat hero.
 */
export function Beat05BrandStage({ onLayout }: ScrollBeatStageProps) {
  useLayoutEffect(() => {
    onLayout?.();
  }, [onLayout]);

  return (
    <div
      className="beat05-brand-stage h-full w-full overflow-hidden bg-white px-5 py-4"
      aria-hidden="true"
    >
      <p className="text-[10px] font-medium tracking-[0.16em] text-[#8a7348] uppercase">
        Brand kit
      </p>
      <p className="font-serif-display mt-3 max-w-[28ch] text-[clamp(1.15rem,2vw,1.65rem)] leading-[1.15] text-[#1a1a1a]">
        Everyone&apos;s riding shotgun on the aux.
      </p>

      <div className="mt-5" data-sh-anchor="palette">
        <p className="text-[10px] font-medium tracking-[0.16em] text-[#8a7348] uppercase">
          Palette
        </p>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {SWATCHES.map((s) => (
            <div key={s.hex}>
              <div
                className="h-12 rounded-xl border border-[rgba(0,0,0,0.06)]"
                style={{ backgroundColor: s.hex }}
              />
              <p className="mt-1 truncate text-[9px] font-medium text-[#1a1a1a]">
                {s.name}
              </p>
              <p className="font-mono-text text-[8px] text-[#8a8278]">{s.hex}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3" data-sh-anchor="type">
        <div className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#fafaf7] px-3 py-3">
          <p className="text-[9px] tracking-[0.14em] text-[#8a8278] uppercase">
            Display
          </p>
          <p className="font-serif-display mt-2 text-xl text-[#1a1a1a]">Aa</p>
          <p className="mt-1 text-[10px] text-[#6b6760]">Instrument Serif</p>
        </div>
        <div className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#fafaf7] px-3 py-3">
          <p className="text-[9px] tracking-[0.14em] text-[#8a8278] uppercase">
            Text
          </p>
          <p className="mt-2 text-xl text-[#1a1a1a]">Aa</p>
          <p className="mt-1 text-[10px] text-[#6b6760]">Geist Sans</p>
        </div>
      </div>

      <div className="mt-5" data-sh-anchor="values">
        <p className="text-[10px] font-medium tracking-[0.16em] text-[#8a7348] uppercase">
          Brand values
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="min-h-[72px] rounded-xl bg-[#fafaf7] px-3 py-3"
            >
              <p className="text-[11px] font-medium text-[#1a1a1a]">{v.title}</p>
              <p className="mt-1 text-[10px] leading-snug text-[#6b6760]">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
