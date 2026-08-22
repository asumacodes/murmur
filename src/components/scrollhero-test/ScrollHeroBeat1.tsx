"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Beat01RecordingStage } from "@/components/scrollhero-test/Beat01RecordingStage";
import { gsap } from "@/lib/gsap";
import {
  prepareStrokeDraw,
  setStrokeDrawn,
} from "@/lib/scrollhero/prepareStrokeDraw";

/* ============================================================================
   HOTSPOTS — label / connector are % of the SCREENSHOT box.
   Hot points are measured from data-sh-anchor targets inside the live UI.
   ============================================================================ */
const HOTSPOTS = [
  {
    id: "capture",
    lines: ["Real-time", "capture"],
    label: { x: -12, y: 25 },
    connector: { x: -10, y: 36 },
    dir: "left" as const,
  },
  {
    id: "timer",
    lines: ["Fifteen seconds", "is PLENTY"],
    label: { x: 62, y: -26 },
    connector: { x: 50, y: -14 },
    dir: "up" as const,
    loops: 2,
  },
  {
    id: "stop",
    lines: ["One tap.", "Done."],
    label: { x: 65, y: 110 },
    connector: { x: 66, y: 109 },
    dir: "down" as const,
    loops: 2,
  },
] as const;

/** Padding around screenshot so labels sit in dark space, not clipped. */
const STAGE_PAD = { top: 118, bottom: 100, left: 204, right: 80 };

const BEATS = ["Record", "Transcribe", "Pipeline", "PRD", "Workspace", "Ship"];
const GHOST_OPACITY = 0.05;

type Point = { x: number; y: number };

type StageBox = {
  w: number;
  h: number;
  shotLeft: number;
  shotTop: number;
  shotW: number;
  shotH: number;
};

const EMPTY_BOX: StageBox = { w: 0, h: 0, shotLeft: 0, shotTop: 0, shotW: 0, shotH: 0 };

function relPoint(container: HTMLElement, x: number, y: number): Point {
  const cRect = container.getBoundingClientRect();
  return { x: x - cRect.left, y: y - cRect.top };
}

/** Map data-sh-anchor nodes → pixel hot points in stage space. */
function measureAnchorHots(
  shot: HTMLElement,
  container: HTMLElement,
): Partial<Record<(typeof HOTSPOTS)[number]["id"], Point>> {
  const waveform = shot.querySelector('[data-sh-anchor="waveform"]');
  const timer = shot.querySelector('[data-sh-anchor="timer"]');
  const stop = shot.querySelector('[data-sh-anchor="stop"]');
  const hots: Partial<Record<(typeof HOTSPOTS)[number]["id"], Point>> = {};

  if (waveform) {
    const r = waveform.getBoundingClientRect();
    hots.capture = relPoint(container, r.left - 12, r.top + r.height - 100 / 2);
  }
  if (timer) {
    const r = timer.getBoundingClientRect();
    hots.timer = relPoint(container, r.left + r.width / 2, r.top - 50);
  }
  if (stop) {
    const r = stop.getBoundingClientRect();
    hots.stop = relPoint(container, r.left + r.width / 2 + 40, r.bottom - 40);
  }

  return hots;
}

function pointOnShot(p: Point, box: StageBox): Point {
  return {
    x: box.shotLeft + (box.shotW * p.x) / 100,
    y: box.shotTop + (box.shotH * p.y) / 100,
  };
}

/** Small decaying coil from connector (below text) → hotspot on UI. */
function spiralPath(fromPx: Point, toPx: Point, loops = 2): string {
  const dx = toPx.x - fromPx.x;
  const dy = toPx.y - fromPx.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const px = -uy;
  const py = ux;
  const coilR = Math.min(11, dist * 0.11);
  const steps = loops * 20;

  let d = `M ${fromPx.x.toFixed(1)} ${fromPx.y.toFixed(1)}`;
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const along = t * dist;
    const angle = t * loops * Math.PI * 2;
    const r = coilR * (1 - t * 0.88);
    const x = fromPx.x + ux * along + px * Math.cos(angle) * r;
    const y = fromPx.y + uy * along + py * Math.cos(angle) * r;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  d += ` L ${toPx.x.toFixed(1)} ${toPx.y.toFixed(1)}`;
  return d;
}

function connectorPath(
  h: (typeof HOTSPOTS)[number],
  from: Point,
  to: Point,
): string {
  const loops = "loops" in h ? h.loops : 2;
  return spiralPath(from, to, loops);
}

function labelTransform(dir: (typeof HOTSPOTS)[number]["dir"]) {
  if (dir === "left") return "translate(-100%, -50%)";
  if (dir === "up") return "translate(-50%, -100%)";
  return "translate(-50%, 0)";
}

export function ScrollHeroBeat1() {
  const root = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageInnerRef = useRef<HTMLDivElement>(null);
  const shotRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<StageBox>(EMPTY_BOX);
  const [anchorHots, setAnchorHots] = useState<
    Partial<Record<(typeof HOTSPOTS)[number]["id"], Point>>
  >({});
  const [recordingActive, setRecordingActive] = useState(false);

  const measureStage = useCallback(() => {
    const stage = stageRef.current;
    const stageInner = stageInnerRef.current;
    const shot = shotRef.current;
    if (!stage || !stageInner || !shot) return;

    const shotW = shot.offsetWidth;
    const shotH = shot.offsetHeight;
    if (shotW <= 0 || shotH <= 0) return;

    setBox({
      w: stage.clientWidth,
      h: stage.clientHeight,
      shotLeft: shot.offsetLeft,
      shotTop: shot.offsetTop,
      shotW,
      shotH,
    });
    setAnchorHots(measureAnchorHots(shot, stageInner));
  }, []);

  useLayoutEffect(() => {
    measureStage();
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(measureStage);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [measureStage]);

  useLayoutEffect(() => {
    if (!box.w || !root.current) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      root.current?.querySelectorAll<SVGPathElement>(".sh-path").forEach((path) => {
        prepareStrokeDraw(path);
      });

      if (reduce) {
        gsap.set(
          [
            ".sh-ghost-wrap",
            ".sh-eyebrow",
            ".sh-word",
            ".sh-sub",
            ".sh-screenshot",
            ".sh-path",
            ".sh-label",
            ".sh-hotspot",
          ],
          { autoAlpha: 1, y: 0, x: 0 },
        );
        root.current?.querySelectorAll<SVGPathElement>(".sh-path").forEach((path) => {
          setStrokeDrawn(path);
        });
        setRecordingActive(true);
        return;
      }

      gsap.set(".sh-ghost-wrap", { autoAlpha: 0, y: 60 });
      gsap.set(".sh-eyebrow", { autoAlpha: 0, y: 20 });
      gsap.set(".sh-word", { autoAlpha: 0, y: 30 });
      gsap.set(".sh-sub", { autoAlpha: 0, y: 20 });
      gsap.set(".sh-screenshot", {
        autoAlpha: 0,
        y: 40,
        rotateY: -12,
        rotateX: 5,
        scale: 0.96,
      });
      gsap.set(".sh-path", {
        autoAlpha: 0,
        strokeDashoffset: (i, el) => (el as SVGPathElement).getTotalLength(),
      });
      gsap.set(".sh-label", { autoAlpha: 0, y: 10 });
      gsap.set(".sh-hotspot", { autoAlpha: 0, scale: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      tl.to(".sh-ghost-wrap", { autoAlpha: 1, y: 0, duration: 1 }, 0)
        .to(
          ".sh-screenshot",
          { autoAlpha: 1, y: 0, rotateY: -6, rotateX: 2, scale: 1, duration: 1.4 },
          0,
        )
        /* Latch on — never flip false on scrub/rebuild or the wall-clock timer resets. */
        .call(() => setRecordingActive(true), undefined, 0.8);

      tl.to(".sh-eyebrow", { autoAlpha: 1, y: 0, duration: 0.6 }, 1.0)
        .to(".sh-word", { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 }, 1.2)
        .to(".sh-sub", { autoAlpha: 1, y: 0, duration: 0.6 }, 1.7);

      tl.to(".sh-hotspot", { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.2 }, 2.3)
        .to(
          ".sh-path",
          { autoAlpha: 1, strokeDashoffset: 0, duration: 0.8, stagger: 0.2, ease: "power2.inOut" },
          2.5,
        )
        .to(".sh-label", { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2 }, 2.9);

      tl.to({}, { duration: 0.6 });
    }, root);

    return () => ctx.revert();
    /* Intentionally omit anchorHots — measuring anchors must not rebuild the scrub timeline. */
  }, [box.w, box.h, box.shotW, box.shotH]);

  return (
    <section
      ref={root}
      className="relative h-screen w-full overflow-hidden bg-[var(--bg-deep)]"
      style={{ perspective: "2000px" }}
    >
      <p className="font-mono-text pointer-events-none fixed top-4 right-4 z-50 text-[0.6rem] tracking-[0.14em] text-[var(--text-secondary)] uppercase">
        <span className="text-[var(--gold)]">/scroll-hero-test-1</span>
      </p>

      <div
        className="pointer-events-none absolute top-1/2 right-[10%] h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-[0.06] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
        aria-hidden="true"
      />

      <div
        className="sh-ghost-wrap font-serif-display pointer-events-none absolute top-1/2 left-[6%] -translate-y-1/2 select-none leading-none will-change-transform"
        aria-hidden="true"
      >
        <div
          className="sh-ghost text-[var(--text-primary)]"
          style={{ fontSize: "34vw", opacity: GHOST_OPACITY }}
        >
          01
        </div>
      </div>

      <div className="absolute top-1/2 left-[3%] h-[55vh] -translate-y-1/2">
        <div className="relative h-full w-px bg-[var(--border-subtle)]">
          <div className="absolute top-0 left-0 h-1/6 w-px bg-[var(--gold)]" />
          {BEATS.map((b, i) => (
            <div
              key={b}
              className="absolute -left-[3px] flex items-center gap-2"
              style={{ top: `${(i / (BEATS.length - 1)) * 100}%` }}
            >
              <span
                className={`block size-[7px] rounded-full ${
                  i === 0 ? "bg-[var(--gold)]" : "bg-[var(--border-subtle)]"
                }`}
              />
              {i === 0 && (
                <span className="font-mono-text text-[0.6rem] tracking-[0.16em] whitespace-nowrap text-[var(--gold)] uppercase">
                  {BEATS[0]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-[9%] max-w-md -translate-y-1/2">
        <p className="sh-eyebrow font-mono-text text-xs tracking-[0.16em] text-[var(--gold)] uppercase">
          01 · Record
        </p>
        <h2 className="font-serif-display mt-4 flex flex-wrap gap-x-4 text-[clamp(2.5rem,4.5vw,4rem)] leading-[1.05] text-[var(--text-primary)]">
          {["Speak", "your", "idea."].map((w) => (
            <span key={w} className="sh-word inline-block">
              {w}
            </span>
          ))}
        </h2>
        <p className="sh-sub mt-6 max-w-sm text-[var(--text-secondary)]">
          Fifteen seconds is plenty. Murmur takes it from there.
        </p>
      </div>

      <div
        ref={stageRef}
        className="absolute top-1/2 right-[3%] w-[60vw] max-w-[1140px] -translate-y-1/2 overflow-visible"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={stageInnerRef}
          className="relative overflow-visible"
          style={{
            paddingTop: STAGE_PAD.top,
            paddingRight: STAGE_PAD.right,
            paddingBottom: STAGE_PAD.bottom,
            paddingLeft: STAGE_PAD.left,
          }}
        >
          <div
            ref={shotRef}
            className="sh-screenshot relative z-[1] aspect-[16/10] overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-[0_60px_120px_rgba(0,0,0,0.55)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Beat01RecordingStage
              active={recordingActive}
              onLayout={measureStage}
            />
          </div>

          {box.w > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 z-[2] overflow-visible"
              width={box.w}
              height={box.h}
              aria-hidden="true"
            >
              {HOTSPOTS.map((h) => {
                const from = pointOnShot(h.connector, box);
                const to = anchorHots[h.id];
                if (!to) return null;
                return (
                  <path
                    key={h.id}
                    className="sh-path"
                    d={connectorPath(h, from, to)}
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth={2.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })}
              {HOTSPOTS.map((h) => {
                const hp = anchorHots[h.id];
                if (!hp || ("hideDot" in h && h.hideDot)) return null;
                return (
                  <circle
                    key={`${h.id}-dot`}
                    className="sh-hotspot"
                    cx={hp.x}
                    cy={hp.y}
                    r={4.5}
                    fill="var(--gold)"
                  />
                );
              })}
            </svg>
          )}

          {box.w > 0 &&
            HOTSPOTS.map((h) => {
              const lp = pointOnShot(h.label, box);
              const textAlign =
                h.dir === "left" ? "text-right" : "text-center";

              return (
                <div
                  key={`${h.id}-label`}
                  className={`sh-label font-serif-display pointer-events-none absolute z-[3] text-[clamp(1.75rem,2.75vw,2.65rem)] leading-[1.12] font-medium text-[var(--gold)] italic ${textAlign}`}
                  style={{
                    left: lp.x,
                    top: lp.y,
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
              );
            })}
        </div>
      </div>
    </section>
  );
}
