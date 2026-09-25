"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { AnnotationOverlay } from "@/components/scrollhero-test/AnnotationOverlay";
import {
  beatMeasures,
  beatStages,
  GHOST_OPACITY,
  SCROLL_BEATS,
  SPINE_LABELS,
  STAGE_PAD,
} from "@/components/scrollhero-test/beats";
import { MagneticGoldButton } from "@/components/ui/MagneticGoldButton";
import {
  trackScrollHeroBeatViewed,
  trackScrollHeroCompleted,
  trackSignupCtaClicked,
} from "@/lib/analytics/events";
import { appHref } from "@/lib/appUrl";
import { gsap } from "@/lib/gsap";
import {
  prepareStrokeDraw,
} from "@/lib/scrollhero/prepareStrokeDraw";
import {
  EMPTY_STAGE_BOX,
  type Point,
  type ScrollBeatStageProps,
  type StageBox,
} from "@/lib/scrollhero/types";

const STAGE_BEATS = SCROLL_BEATS.filter((b) => b.hasStage);
const BEAT_COUNT = SCROLL_BEATS.length;

type StageProps = ScrollBeatStageProps & { active?: boolean };

function StageLayer({
  Stage,
  onLayout,
  active,
}: {
  Stage: ComponentType<StageProps>;
  onLayout: () => void;
  active?: boolean;
}) {
  return <Stage onLayout={onLayout} active={active} />;
}

export function ScrollHero() {
  const root = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageInnerRef = useRef<HTMLDivElement>(null);
  const shotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const completedRef = useRef(false);
  const lastBeatViewedRef = useRef<string | null>(null);

  const [box, setBox] = useState<StageBox>(EMPTY_STAGE_BOX);
  const [hotsByBeat, setHotsByBeat] = useState<
    Partial<Record<string, Partial<Record<string, Point>>>>
  >({});
  const [recordingActive, setRecordingActive] = useState(false);
  const [stacked, setStacked] = useState(false);

  const measureStage = useCallback(() => {
    const stage = stageRef.current;
    const stageInner = stageInnerRef.current;
    const firstShot = shotRefs.current[0];
    if (!stage || !stageInner || !firstShot) return;

    const shotW = firstShot.offsetWidth;
    const shotH = firstShot.offsetHeight;
    if (shotW <= 0 || shotH <= 0) return;

    setBox({
      w: stage.clientWidth,
      h: stage.clientHeight,
      shotLeft: firstShot.offsetLeft,
      shotTop: firstShot.offsetTop,
      shotW,
      shotH,
    });

    // Positions settled after fonts/layout — tips from getBoundingClientRect.
    const next: Partial<Record<string, Partial<Record<string, Point>>>> = {};
    STAGE_BEATS.forEach((beat, i) => {
      const shot = shotRefs.current[i];
      const measure = beatMeasures[beat.id];
      if (shot && measure) next[beat.id] = measure(shot, stageInner);
    });
    setHotsByBeat(next);
  }, []);

  const settleAndMeasure = useCallback(async () => {
    if (typeof document !== "undefined" && document.fonts?.ready) {
      await document.fonts.ready;
    }
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    measureStage();
  }, [measureStage]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const stageInner = stageInnerRef.current;
    if (!stage) return;

    let debounceId = 0;
    const scheduleMeasure = () => {
      window.clearTimeout(debounceId);
      debounceId = window.setTimeout(() => {
        measureStage();
      }, 80);
    };

    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(stage);
    if (stageInner) ro.observe(stageInner);
    shotRefs.current.forEach((shot) => {
      if (shot) ro.observe(shot);
    });

    void settleAndMeasure().then(() => {
      // Re-observe after fonts/layout settle in case shot nodes remounted.
      shotRefs.current.forEach((shot) => {
        if (shot) ro.observe(shot);
      });
    });

    return () => {
      window.clearTimeout(debounceId);
      ro.disconnect();
    };
  }, [measureStage, settleAndMeasure]);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (self) => {
          const isDesktop = !!self.conditions?.desktop;
          const reduce = !!self.conditions?.reduce;

          if (!isDesktop || reduce) {
            setStacked(true);
            setRecordingActive(true);
            gsap.set(
              [
                ".sh-ghost",
                ".sh-copy",
                ".sh-shot",
                ".sh-path",
                ".sh-label",
                ".sh-hotspot",
                ".sh-ship",
                ".sh-spine-label",
                ".sh-spine-dot",
              ],
              { clearProps: "all" },
            );
            return;
          }

          setStacked(false);
          if (!box.w) return;

          root.current
            ?.querySelectorAll<SVGPathElement>(".sh-path")
            .forEach((path) => prepareStrokeDraw(path));

          /* Init hidden — annotation selectors only for stage beats (not Ship). */
          SCROLL_BEATS.forEach((beat, i) => {
            gsap.set(`.sh-ghost-${i}`, {
              autoAlpha: 0,
              y: i === 0 ? 60 : 80,
            });
            gsap.set(`.sh-copy-${i}`, { autoAlpha: 0 });
            gsap.set(`.sh-copy-${i} .sh-eyebrow, .sh-copy-${i} .sh-sub`, {
              autoAlpha: 0,
              y: 20,
            });
            gsap.set(`.sh-copy-${i} .sh-word`, { autoAlpha: 0, y: 30 });

            if (beat.hasStage) {
              gsap.set(`.sh-path-${i}, .sh-label-${i}, .sh-hotspot-${i}`, {
                autoAlpha: 0,
              });
              gsap.set(`.sh-hotspot-${i}`, { scale: 0 });
              gsap.set(`.sh-label-${i}`, { y: 10 });
              gsap.set(`.sh-path-${i}`, { strokeDashoffset: 1 });
              gsap.set(`.sh-shot-${i}`, {
                autoAlpha: 0,
                y: i === 0 ? 40 : -40,
                rotateY: i === 0 ? -12 : -6,
                rotateX: 2,
                scale: i === 0 ? 0.96 : 0.94,
              });
            }
          });

          /* Remeasure tips after initial 3D shot transforms. */
          measureStage();

          gsap.set(".sh-ship", { autoAlpha: 0, y: 30 });
          gsap.set(".sh-spine-label-0", { autoAlpha: 1 });
          for (let i = 1; i < BEAT_COUNT; i += 1) {
            gsap.set(`.sh-spine-label-${i}`, { autoAlpha: 0 });
          }
          gsap.set(".sh-spine-progress", {
            scaleY: 1 / BEAT_COUNT,
            transformOrigin: "top",
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=900%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              onUpdate: (self) => {
                const idx = Math.min(
                  BEAT_COUNT - 1,
                  Math.floor(self.progress * BEAT_COUNT),
                );
                const beat = SCROLL_BEATS[idx];
                if (beat && lastBeatViewedRef.current !== beat.id) {
                  lastBeatViewedRef.current = beat.id;
                  trackScrollHeroBeatViewed(beat.id);
                }
                if (self.progress > 0.92 && !completedRef.current) {
                  completedRef.current = true;
                  trackScrollHeroCompleted();
                }
              },
            },
          });

          SCROLL_BEATS.forEach((beat, i) => {
            const isFirst = i === 0;
            const isShip = !beat.hasStage;
            const shotSel = `.sh-shot-${i}`;
            const ghostSel = `.sh-ghost-${i}`;
            const copySel = `.sh-copy-${i}`;

            if (isFirst) {
              tl.to(ghostSel, { autoAlpha: 1, y: 0, duration: 1 }, 0).to(
                shotSel,
                {
                  autoAlpha: 1,
                  y: 0,
                  rotateY: -6,
                  rotateX: 2,
                  scale: 1,
                  duration: 1.4,
                },
                0,
              );
              tl.call(() => setRecordingActive(true), undefined, 0.8);
              tl.to(
                `${copySel} .sh-eyebrow`,
                { autoAlpha: 1, y: 0, duration: 0.6 },
                1.0,
              )
                .to(
                  `${copySel} .sh-word`,
                  { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 },
                  1.2,
                )
                .to(
                  `${copySel} .sh-sub`,
                  { autoAlpha: 1, y: 0, duration: 0.6 },
                  1.7,
                );
              tl.set(copySel, { autoAlpha: 1 }, 1.0);

              if (beat.hotspots.length) {
                tl.to(
                  `.sh-hotspot-${i}`,
                  { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.2 },
                  2.3,
                )
                  .to(
                    `.sh-path-${i}`,
                    {
                      autoAlpha: 1,
                      strokeDashoffset: 0,
                      duration: 0.8,
                      stagger: 0.2,
                      ease: "power2.inOut",
                    },
                    2.5,
                  )
                  .to(
                    `.sh-label-${i}`,
                    { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2 },
                    2.9,
                  );
              }
              tl.to({}, { duration: 0.55 });
              return;
            }

            /* Transition from previous */
            const t0 = tl.duration();
            const prev = i - 1;

            tl.to(
              `.sh-path-${prev}, .sh-label-${prev}, .sh-hotspot-${prev}`,
              { autoAlpha: 0, duration: 0.4 },
              t0,
            );

            if (SCROLL_BEATS[prev]?.hasStage) {
              tl.to(
                `.sh-shot-${prev}`,
                {
                  autoAlpha: 0,
                  y: 40,
                  scale: 0.94,
                  rotateY: -12,
                  duration: 0.65,
                  ease: "power2.in",
                },
                t0 + 0.25,
              );
            }

            tl.to(
              `.sh-copy-${prev}`,
              { autoAlpha: 0, y: 20, duration: 0.45 },
              t0 + 0.25,
            )
              .to(
                `.sh-ghost-${prev}`,
                { autoAlpha: 0, y: -80, duration: 0.5, ease: "power2.in" },
                t0 + 0.2,
              )
              .to(
                `.sh-spine-label-${prev}`,
                { autoAlpha: 0, duration: 0.3 },
                t0 + 0.25,
              )
              .to(
                `.sh-spine-dot-${prev}`,
                { backgroundColor: "var(--border-subtle)", duration: 0.3 },
                t0 + 0.25,
              )
              .to(
                ".sh-spine-progress",
                {
                  scaleY: (i + 1) / BEAT_COUNT,
                  duration: 0.7,
                  ease: "power2.inOut",
                },
                t0 + 0.35,
              );

            const tIn = t0 + 0.95;

            tl.to(
              ghostSel,
              { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
              tIn,
            )
              .to(
                `.sh-spine-dot-${i}`,
                { backgroundColor: "var(--gold)", duration: 0.35 },
                tIn + 0.1,
              )
              .to(
                `.sh-spine-label-${i}`,
                { autoAlpha: 1, duration: 0.4 },
                tIn + 0.1,
              );

            if (isShip) {
              tl.to(
                ".sh-ship",
                { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" },
                tIn + 0.05,
              )
                .set(copySel, { autoAlpha: 1 }, tIn + 0.15)
                .to(
                  `${copySel} .sh-eyebrow`,
                  { autoAlpha: 1, y: 0, duration: 0.45 },
                  tIn + 0.2,
                )
                .to(
                  `${copySel} .sh-word`,
                  { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 },
                  tIn + 0.35,
                )
                .to(
                  `${copySel} .sh-sub`,
                  { autoAlpha: 1, y: 0, duration: 0.45 },
                  tIn + 0.65,
                );
              /* Fill spine completely */
              tl.to(
                ".sh-spine-progress",
                { scaleY: 1, duration: 0.5 },
                tIn + 0.2,
              );
              for (let d = 0; d < BEAT_COUNT; d += 1) {
                tl.to(
                  `.sh-spine-dot-${d}`,
                  { backgroundColor: "var(--gold)", duration: 0.2 },
                  tIn + 0.2,
                );
              }
              tl.to({}, { duration: 0.8 });
              return;
            }

            tl.to(
              shotSel,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                rotateY: -6,
                rotateX: 2,
                duration: 0.7,
                ease: "power2.out",
              },
              tIn + 0.05,
            )
              .set(copySel, { autoAlpha: 1 }, tIn + 0.15)
              .to(
                `${copySel} .sh-eyebrow`,
                { autoAlpha: 1, y: 0, duration: 0.45 },
                tIn + 0.2,
              )
              .to(
                `${copySel} .sh-word`,
                { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 },
                tIn + 0.35,
              )
              .to(
                `${copySel} .sh-sub`,
                { autoAlpha: 1, y: 0, duration: 0.45 },
                tIn + 0.65,
              );

            const tAnn = tIn + 0.95;
            tl.to(
              `.sh-hotspot-${i}`,
              { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.2 },
              tAnn,
            )
              .to(
                `.sh-path-${i}`,
                {
                  autoAlpha: 1,
                  strokeDashoffset: 0,
                  duration: 0.8,
                  stagger: 0.2,
                  ease: "power2.inOut",
                },
                tAnn + 0.2,
              )
              .to(
                `.sh-label-${i}`,
                { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2 },
                tAnn + 0.6,
              );

            tl.to({}, { duration: 0.55 });
          });
        },
      );
    }, root);

    return () => ctx.revert();
  }, [box.w, box.h, box.shotW, box.shotH, measureStage]);

  const onSignupClick = () => {
    trackSignupCtaClicked("scroll_hero");
  };

  if (stacked) {
    return (
      <section
        id="scroll-hero"
        ref={root}
        className="relative bg-[var(--bg-deep)]"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:px-10">
          {SCROLL_BEATS.map((beat, i) => {
            const Stage = beatStages[beat.id];
            return (
              <div key={beat.id} className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <div>
                  <p className="font-mono-text text-xs tracking-[0.16em] text-[var(--gold)] uppercase">
                    {beat.eyebrow}
                  </p>
                  <h2 className="font-serif-display mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-[var(--text-primary)]">
                    {beat.headline.join(" ")}
                  </h2>
                  <p className="mt-4 max-w-sm text-[var(--text-secondary)]">
                    {beat.subhead}
                  </p>
                  {!beat.hasStage && (
                    <div className="mt-8">
                      <p className="font-mono-text text-[0.7rem] tracking-[0.12em] text-[var(--gold)] uppercase">
                        8 of 8 artifacts delivered
                      </p>
                      <MagneticGoldButton
                        href={appHref()}
                        className="mt-4 min-h-11 px-5 text-[0.9375rem]"
                        onClick={onSignupClick}
                      >
                        Get started
                      </MagneticGoldButton>
                    </div>
                  )}
                </div>
                {Stage ? (
                  <div className="aspect-[16/10] overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
                    <StageLayer
                      Stage={Stage}
                      onLayout={measureStage}
                      active={i === 0 ? recordingActive : undefined}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section
      id="scroll-hero"
      ref={root}
      className="relative h-screen w-full overflow-hidden bg-[var(--bg-deep)]"
      style={{ perspective: "2000px" }}
    >
      <div
        className="pointer-events-none absolute top-1/2 right-[10%] h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-[0.06] blur-[120px]"
        style={{
          background: "radial-gradient(circle, var(--gold), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Ghosts */}
      <div
        className="pointer-events-none absolute top-1/2 left-[6%] -translate-y-1/2 select-none leading-none"
        aria-hidden="true"
      >
        <div className="relative">
          {SCROLL_BEATS.map((beat, i) => (
            <div
              key={beat.id}
              className={`sh-ghost sh-ghost-${i} font-serif-display will-change-transform ${
                i === 0 ? "" : "absolute inset-0"
              }`}
            >
              <div
                className="text-[var(--text-primary)]"
                style={{
                  fontSize: beat.id === "ship" ? "18vw" : "34vw",
                  opacity: GHOST_OPACITY,
                }}
              >
                {beat.id === "ship" ? "Ship" : beat.numeral}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spine */}
      <div className="absolute top-1/2 left-[3%] h-[55vh] -translate-y-1/2">
        <div className="relative h-full w-px bg-[var(--border-subtle)]">
          <div className="sh-spine-progress absolute top-0 left-0 h-full w-px origin-top bg-[var(--gold)]" />
          {SPINE_LABELS.map((label, i) => (
            <div
              key={label}
              className="absolute -left-[3px] flex items-center gap-2"
              style={{ top: `${(i / (SPINE_LABELS.length - 1)) * 100}%` }}
            >
              <span
                className={`sh-spine-dot sh-spine-dot-${i} block size-[7px] rounded-full ${
                  i === 0 ? "bg-[var(--gold)]" : "bg-[var(--border-subtle)]"
                }`}
              />
              <span
                className={`sh-spine-label sh-spine-label-${i} font-mono-text text-[0.6rem] tracking-[0.16em] whitespace-nowrap text-[var(--gold)] uppercase`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Copy stacks */}
      <div className="absolute top-1/2 left-[9%] max-w-md -translate-y-1/2">
        <div className="relative">
          {SCROLL_BEATS.map((beat, i) => (
            <div
              key={beat.id}
              className={`sh-copy sh-copy-${i} ${i === 0 ? "" : "absolute inset-0"}`}
            >
              <p className="sh-eyebrow font-mono-text text-xs tracking-[0.16em] text-[var(--gold)] uppercase">
                {beat.eyebrow}
              </p>
              <h2 className="font-serif-display mt-4 flex flex-wrap gap-x-4 text-[clamp(2.5rem,4.5vw,4rem)] leading-[1.05] text-[var(--text-primary)]">
                {beat.headline.map((w) => (
                  <span key={w} className="sh-word inline-block">
                    {w}
                  </span>
                ))}
              </h2>
              <p className="sh-sub mt-6 max-w-sm text-[var(--text-secondary)]">
                {beat.subhead}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ship CTA overlay (desktop film) */}
      <div className="sh-ship pointer-events-auto absolute top-[62%] left-[9%] z-10 max-w-sm">
        <p className="font-mono-text text-[0.7rem] tracking-[0.12em] text-[var(--gold)] uppercase">
          8 of 8 artifacts delivered
        </p>
        <MagneticGoldButton
          href={appHref()}
          className="mt-4 min-h-11 px-5 text-[0.9375rem]"
          onClick={onSignupClick}
        >
          Get started
        </MagneticGoldButton>
      </div>

      {/* Stage stack */}
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
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative aspect-[16/10]">
            {STAGE_BEATS.map((beat, i) => {
              const Stage = beatStages[beat.id];
              if (!Stage) return null;
              return (
                <div
                  key={beat.id}
                  ref={(el) => {
                    shotRefs.current[i] = el;
                  }}
                  className={`sh-shot sh-shot-${i} absolute inset-0 z-[1] overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-[0_60px_120px_rgba(0,0,0,0.55)]`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <StageLayer
                    Stage={Stage}
                    onLayout={measureStage}
                    active={beat.id === "record" ? recordingActive : undefined}
                  />
                </div>
              );
            })}
          </div>

          {box.w > 0 &&
            STAGE_BEATS.map((beat, i) => (
              <AnnotationOverlay
                key={beat.id}
                hotspots={beat.hotspots}
                box={box}
                hots={hotsByBeat[beat.id] ?? {}}
                pathClass={`sh-path sh-path-${i}`}
                hotspotClass={`sh-hotspot sh-hotspot-${i}`}
                labelClass={`sh-label sh-label-${i}`}
              />
            ))}
        </div>
      </div>
    </section>
  );
}

/** @deprecated Use ScrollHero — kept for test-route import stability */
export const ScrollHeroBeat1 = ScrollHero;
