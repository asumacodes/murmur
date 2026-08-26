"use client";

import type { Hotspot, Point, StageBox } from "@/lib/scrollhero/types";
import {
  connectorPath,
  labelTransform,
  pointOnShot,
} from "@/lib/scrollhero/geometry";

type AnnotationOverlayProps = {
  hotspots: Hotspot[];
  box: StageBox;
  hots: Partial<Record<string, Point>>;
  pathClass: string;
  hotspotClass: string;
  labelClass: string;
};

export function AnnotationOverlay({
  hotspots,
  box,
  hots,
  pathClass,
  hotspotClass,
  labelClass,
}: AnnotationOverlayProps) {
  if (!hotspots.length || box.w <= 0) return null;

  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 z-[2] overflow-visible"
        width={box.w}
        height={box.h}
        aria-hidden="true"
        style={{ transform: "translateZ(48px)" }}
      >
        {hotspots.map((h) => {
          const from = pointOnShot(h.connector, box);
          const to = hots[h.id];
          if (!to) return null;
          return (
            <path
              key={h.id}
              className={pathClass}
              d={connectorPath(h, from, to)}
              pathLength={1}
              fill="none"
              stroke="var(--gold)"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
        {hotspots.map((h) => {
          const hp = hots[h.id];
          if (!hp) return null;
          return (
            <circle
              key={`${h.id}-dot`}
              className={hotspotClass}
              cx={hp.x}
              cy={hp.y}
              r={4.5}
              fill="var(--gold)"
            />
          );
        })}
      </svg>

      {hotspots.map((h) => {
        const lp = pointOnShot(h.label, box);
        const textAlign = h.dir === "left" ? "text-right" : "text-center";

        return (
          <div
            key={`${h.id}-label`}
            className="pointer-events-none absolute z-[3]"
            style={{
              left: lp.x,
              top: lp.y,
              transform: "translateZ(48px)",
            }}
          >
            <div
              className={`${labelClass} font-serif-display text-[clamp(1.75rem,2.75vw,2.65rem)] leading-[1.12] font-medium text-[var(--gold)] italic ${textAlign}`}
              style={{
                transform: labelTransform(h.dir),
                textShadow: "0 2px 22px rgba(201, 169, 110, 0.32)",
              }}
            >
              {h.lines.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
