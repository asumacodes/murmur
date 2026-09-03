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
  trackWaitlistCtaClicked,
} from "@/lib/analytics/events";
import { markCinematicIntroComplete } from "@/lib/cinematicIntro";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  buildScrollHeroBeatTimeline,
  initScrollHeroHiddenState,
  SCROLL_HERO_BEAT_COUNT,
} from "@/lib/scrollhero/buildBeatTimeline";
import { prepareStrokeDraw } from "@/lib/scrollhero/prepareStrokeDraw";
import {
  EMPTY_STAGE_BOX,
  type Point,
  type ScrollBeatStageProps,
  type StageBox,
} from "@/lib/scrollhero/types";

const STAGE_BEATS = SCROLL_BEATS.filter((b) => b.hasStage);
const BEAT_COUNT = SCROLL_HERO_BEAT_COUNT;
const PIN_SCROLL_END = "+=900%";

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
  const root = useRef<HTMLElement>(null);
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
    const section = root.current;
    if (!section) {
      return;
    }

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
            return;
          }

          if (!box.w) {
            return;
          }

          completedRef.current = false;
          lastBeatViewedRef.current = null;

          section
            .querySelectorAll<SVGPathElement>(".sh-path")
            .forEach((path) => prepareStrokeDraw(path));

          initScrollHeroHiddenState();
          measureStage();

          const finishIntro = () => {
            if (completedRef.current) {
              return;
            }
            completedRef.current = true;
            trackScrollHeroCompleted();

            if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              gsap.to([".sh-copy-5", ".sh-ship"], {
                y: -40,
                autoAlpha: 0.9,
                duration: 0.45,
                ease: "power2.in",
                overwrite: "auto",
              });
            }

            markCinematicIntroComplete();
          };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: PIN_SCROLL_END,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: -10,
              onUpdate: (st) => {
                const idx = Math.min(
                  BEAT_COUNT - 1,
                  Math.floor(st.progress * BEAT_COUNT),
                );
                const beat = SCROLL_BEATS[idx];
                if (beat && lastBeatViewedRef.current !== beat.id) {
                  lastBeatViewedRef.current = beat.id;
                  trackScrollHeroBeatViewed(beat.id);
                }
                if (st.progress >= 1) {
                  finishIntro();
                }
              },
              onLeave: (st) => {
                if (st.direction === 1) {
                  finishIntro();
                }
              },
            },
          });

          buildScrollHeroBeatTimeline(tl, { setRecordingActive });

          requestAnimationFrame(() => ScrollTrigger.refresh());
          void document.fonts?.ready.then(() => {
            requestAnimationFrame(() => ScrollTrigger.refresh());
          });
        },
      );
    }, section);

    return () => ctx.revert();
  }, [box.w, box.h, box.shotW, box.shotH, measureStage]);

  const onWaitlistClick = () => {
    trackWaitlistCtaClicked("scroll_hero");
  };

  return (
    <section
      id="scroll-hero"
      data-scroll-hero-pin
      ref={root}
      className="relative h-screen w-full overflow-hidden bg-[var(--bg-deep)]"
      style={{ perspective: "2000px" }}
      aria-label="Murmur scroll story"
    >
      <div
        className="pointer-events-none absolute top-1/2 right-[10%] h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-[0.06] blur-[120px] max-md:hidden"
        style={{
          background: "radial-gradient(circle, var(--gold), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute top-1/2 left-[3%] max-md:left-[4%] -translate-y-1/2 select-none leading-none md:left-[6%]"
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
                  fontSize:
                    beat.id === "ship"
                      ? "clamp(4rem, 18vw, 18vw)"
                      : "clamp(6rem, 34vw, 34vw)",
                  opacity: GHOST_OPACITY,
                }}
              >
                {beat.id === "ship" ? "Ship" : beat.numeral}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-[2%] h-[45vh] -translate-y-1/2 max-md:left-[3%] md:left-[3%] md:h-[55vh]">
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
                className={`sh-spine-label sh-spine-label-${i} font-mono-text text-[0.55rem] tracking-[0.16em] whitespace-nowrap text-[var(--gold)] uppercase max-md:hidden md:text-[0.6rem]`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-[8%] max-w-[42%] -translate-y-1/2 max-md:left-[10%] max-md:max-w-[55%] md:left-[9%] md:max-w-md">
        <div className="relative">
          {SCROLL_BEATS.map((beat, i) => (
            <div
              key={beat.id}
              className={`sh-copy sh-copy-${i} ${i === 0 ? "" : "absolute inset-0"}`}
            >
              <p className="sh-eyebrow font-mono-text text-[0.65rem] tracking-[0.16em] text-[var(--gold)] uppercase md:text-xs">
                {beat.eyebrow}
              </p>
              <h2 className="font-serif-display mt-3 flex flex-wrap gap-x-3 text-[clamp(1.5rem,4.5vw,4rem)] leading-[1.05] text-[var(--text-primary)] md:mt-4 md:gap-x-4">
                {beat.headline.map((w) => (
                  <span key={w} className="sh-word inline-block">
                    {w}
                  </span>
                ))}
              </h2>
              <p className="sh-sub mt-4 max-w-sm text-sm text-[var(--text-secondary)] md:mt-6 md:text-base">
                {beat.subhead}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="sh-ship pointer-events-auto absolute top-[62%] left-[8%] z-10 max-w-sm max-md:left-[10%] md:left-[9%]">
        <p className="font-mono-text text-[0.7rem] tracking-[0.12em] text-[var(--gold)] uppercase">
          8 of 8 artifacts delivered
        </p>
        <MagneticGoldButton
          href="#early-access"
          className="mt-4 min-h-11 px-5 text-[0.9375rem]"
          onClick={onWaitlistClick}
        >
          Join the waitlist
        </MagneticGoldButton>
      </div>

      <div
        ref={stageRef}
        className="absolute top-1/2 right-[2%] w-[52vw] max-w-[1140px] -translate-y-1/2 overflow-visible max-md:w-[58vw] md:right-[3%] md:w-[60vw]"
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
