"use client";

import { useRef, type RefObject } from "react";
import { Container, SectionEyebrow } from "@/components/ui";
import { PipelineCardIllustration } from "@/components/sections/PipelineCardIllustration";
import {
  pipelineNodeBodies,
  pipelineNodeIllustrations,
  pipelineNodeOutputs,
  pipelineNodes,
  pipelineRailSteps,
  pipelineStages,
} from "@/content/home";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { desktopMedia, mobileMedia, scrollEnter } from "@/lib/motion";
import {
  applyPipelineScrub,
  createPipelineStageController,
  REPLAY_PIPELINE_EVENT,
} from "@/lib/pipeline-tracer";

const mainFlow = pipelineNodes.slice(0, 4);
const parallelStage = pipelineStages[4];

function PipelineTopBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pipeline-top-bar pipeline-header-line flex shrink-0 items-center justify-between gap-4 opacity-0 ${className}`}
    >
      <SectionEyebrow className="mb-0">Pipeline</SectionEyebrow>
      <p className="font-mono-text text-right text-xs uppercase tracking-[0.15em] text-[var(--gold)]">
        Orchestrated by n8n · self-hosted
      </p>
    </div>
  );
}

function PipelineMobileTopBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pipeline-top-bar pipeline-header-line flex shrink-0 flex-col items-center gap-2 opacity-0 ${className}`}
    >
      <SectionEyebrow className="mb-0">Pipeline</SectionEyebrow>
      <p className="pipeline-top-bar-note font-mono-text text-center text-[0.75rem] tracking-[0.06em] text-[var(--gold)]">
        Orchestrated by n8n · self-hosted
      </p>
    </div>
  );
}

function PipelineIntro({ className = "" }: { className?: string }) {
  return (
    <div className={`pipeline-header shrink-0 max-w-4xl ${className}`}>
      <h2 className="pipeline-header-line font-serif-display text-[clamp(2.5rem,5vw,4.75rem)] leading-[1.05] opacity-0">
        <span style={{ color: "#ffffff" }}>Not one Claude call in a </span>
        <span style={{ color: "#c9a96e", fontStyle: "italic" }}>trenchcoat.</span>
      </h2>
    </div>
  );
}

function PipelineProgressRail({
  progressRailRef,
  className = "",
}: {
  progressRailRef: RefObject<HTMLElement | null>;
  className?: string;
}) {
  return (
    <nav
      ref={progressRailRef}
      className={`pipeline-progress-rail pipeline-header-line opacity-0 ${className}`}
      aria-label="Pipeline stages"
    >
      <div className="pipeline-progress-track">
        <div className="pipeline-progress-track-line" aria-hidden="true" />
        <span
          className="pipeline-progress-tracer pointer-events-none absolute z-10 size-2.5 rounded-full bg-[var(--gold-bright)] shadow-[0_0_16px_rgba(232,168,32,0.95)]"
          aria-hidden="true"
        />
        <ol className="pipeline-progress-list">
          {pipelineRailSteps.map((step, index) => (
            <li
              key={step.step}
              className={`pipeline-progress-step ${index === 0 ? "is-active" : ""}`}
              data-stage-index={index}
            >
              <span className="pipeline-progress-anchor" data-stage-anchor={index} aria-hidden="true">
                <span className="pipeline-progress-dot" />
              </span>
              <p className="pipeline-progress-label font-mono-text text-[0.58rem] font-semibold uppercase leading-snug tracking-[0.1em]">
                <span className="pipeline-progress-num">{step.step}</span> {step.label}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

type ScrubRefs = {
  run: HTMLDivElement;
  progressRail: HTMLElement;
  viewport: HTMLDivElement;
  track: HTMLDivElement;
};

function createScrubHandlers(refs: ScrubRefs, section: HTMLElement, pinWrap: HTMLDivElement) {
  let scrubTrigger: ScrollTrigger | null = null;
  const stageController = createPipelineStageController(refs.run, refs.progressRail);
  const getTracer = () =>
    refs.progressRail.querySelector<HTMLElement>(".pipeline-progress-tracer");

  const scrubTo = (progress: number) => {
    const dot = getTracer();
    if (!dot) {
      return;
    }

    applyPipelineScrub(
      refs.run,
      refs.progressRail,
      dot,
      refs.track,
      refs.viewport,
      progress,
      stageController,
    );
  };

  const setupScrub = (scrollEnd: string, start = "top top+=80") => {
    const dot = getTracer();
    if (!dot) {
      return;
    }

    scrubTrigger?.kill();
    refs.run.classList.add("is-live");
    gsap.set(refs.run, { autoAlpha: 1, y: 0 });

    scrubTrigger = ScrollTrigger.create({
      trigger: section,
      start,
      end: scrollEnd,
      pin: pinWrap,
      scrub: 0.55,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // Refresh before downstream section reveals so pin spacer is accounted for.
      refreshPriority: -10,
      onUpdate: (self) => {
        scrubTo(self.progress);
      },
      onEnter: () => {
        scrubTo(scrubTrigger?.progress ?? 0);
      },
      onLeave: () => {
        refs.run.classList.remove("is-scrubbing");
        stageController.resetFocus();
      },
      onEnterBack: () => {
        refs.run.classList.add("is-scrubbing");
        requestAnimationFrame(() => scrubTo(scrubTrigger?.progress ?? 0));
      },
    });

    scrubTo(scrubTrigger.progress);
    // One refresh after pin exists — do NOT refresh on every onEnter (that
    // auto-completes tween-linked reveals further down the page).
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  const kill = () => {
    scrubTrigger?.kill();
    scrubTrigger = null;
    stageController.clearStage();
  };

  return { setupScrub, scrubTo, kill, getScrubTrigger: () => scrubTrigger };
}

export function Pipeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const progressRailRef = useRef<HTMLElement>(null);
  const runRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const mobilePinWrapRef = useRef<HTMLDivElement>(null);
  const mobileProgressRailRef = useRef<HTMLElement>(null);
  const mobileRunRef = useRef<HTMLDivElement>(null);
  const mobileViewportRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      let desktopScrub: ReturnType<typeof createScrubHandlers> | null = null;
      let mobileScrub: ReturnType<typeof createScrubHandlers> | null = null;
      let replayTimeline: gsap.core.Timeline | null = null;

      const onReplay = () => {
        const activeScrub = desktopScrub ?? mobileScrub;
        const scrubTrigger = activeScrub?.getScrubTrigger();
        const dot = progressRailRef.current?.querySelector<HTMLElement>(".pipeline-progress-tracer")
          ?? mobileProgressRailRef.current?.querySelector<HTMLElement>(".pipeline-progress-tracer");

        if (!activeScrub || !dot) {
          return;
        }

        replayTimeline?.kill();
        scrubTrigger?.disable();

        section.scrollIntoView({ behavior: "smooth", block: "start" });

        const proxy = { progress: 0 };
        replayTimeline = gsap.timeline({
          onUpdate: () => activeScrub.scrubTo(proxy.progress),
          onComplete: () => {
            scrubTrigger?.enable();
          },
        });

        replayTimeline.to(proxy, {
          progress: 1,
          duration: 3.2,
          ease: "none",
        });

        replayTimeline.play(0);
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".pipeline-header-line", { autoAlpha: 1, y: 0 });
        gsap.set(".pipeline-node", { autoAlpha: 1, y: 0, scale: 1 });
        if (runRef.current) {
          gsap.set(runRef.current, { autoAlpha: 1, y: 0 });
          runRef.current.classList.add("is-live");
        }
        if (mobileRunRef.current) {
          gsap.set(mobileRunRef.current, { autoAlpha: 1, y: 0 });
          mobileRunRef.current.classList.add("is-live");
        }
        return;
      }

      gsap.fromTo(
        ".pipeline-header-line",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            ...scrollEnter,
          },
        },
      );

      const mm = gsap.matchMedia();

      mm.add(desktopMedia, () => {
        const run = runRef.current;
        const progressRail = progressRailRef.current;
        const viewport = viewportRef.current;
        const track = trackRef.current;
        const pinWrap = pinWrapRef.current;

        if (!run || !progressRail || !viewport || !track || !pinWrap) {
          return;
        }

        desktopScrub = createScrubHandlers(
          { run, progressRail, viewport, track },
          section,
          pinWrap,
        );

        gsap.set(run, { autoAlpha: 1, y: 0 });
        requestAnimationFrame(() => desktopScrub?.setupScrub("+=240%"));

        const onResize = () => {
          if (!run.classList.contains("is-live")) {
            return;
          }

          desktopScrub?.setupScrub("+=240%");
        };

        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          desktopScrub?.kill();
          desktopScrub = null;
        };
      });

      mm.add(mobileMedia, () => {
        const run = mobileRunRef.current;
        const progressRail = mobileProgressRailRef.current;
        const viewport = mobileViewportRef.current;
        const track = mobileTrackRef.current;
        const pinWrap = mobilePinWrapRef.current;

        if (!run || !progressRail || !viewport || !track || !pinWrap) {
          return;
        }

        mobileScrub = createScrubHandlers(
          { run, progressRail, viewport, track },
          section,
          pinWrap,
        );

        gsap.set(run, { autoAlpha: 1, y: 0 });
        gsap.set(track, { x: 0 });
        requestAnimationFrame(() => {
          mobileScrub?.setupScrub("+=180%");
          mobileScrub?.scrubTo(0);
        });

        return () => {
          mobileScrub?.kill();
          mobileScrub = null;
        };
      });

      window.addEventListener(REPLAY_PIPELINE_EVENT, onReplay);

      return () => {
        replayTimeline?.kill();
        desktopScrub?.kill();
        mobileScrub?.kill();
        mm.revert();
        window.removeEventListener(REPLAY_PIPELINE_EVENT, onReplay);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section id="pipeline" ref={sectionRef} className="section-pad bg-[var(--bg-warm)] lg:pb-0">
      <div ref={pinWrapRef} className="pipeline-pin-wrap hidden lg:flex">
        <Container className="pipeline-pin-header shrink-0">
          <PipelineTopBar />
          <PipelineIntro />
          <PipelineProgressRail progressRailRef={progressRailRef} />
        </Container>

        <div ref={runRef} className="pipeline-run pipeline-run--open relative min-h-0 w-full shrink-0">
          <div ref={viewportRef} className="pipeline-viewport overflow-x-hidden overflow-y-visible">
            <div ref={trackRef} className="pipeline-stage-track flex w-max items-center gap-4">
              <HorizontalPipelineTrack />
            </div>
          </div>
        </div>
      </div>

      <div ref={mobilePinWrapRef} className="pipeline-pin-wrap pipeline-pin-wrap--mobile flex flex-col lg:hidden">
        <Container className="pipeline-pin-header shrink-0">
          <PipelineMobileTopBar />
          <PipelineIntro />
          <PipelineProgressRail
            progressRailRef={mobileProgressRailRef}
            className="pipeline-progress-rail--mobile-hidden"
          />
        </Container>

        <div ref={mobileRunRef} className="pipeline-run pipeline-run--open relative min-h-0 w-full shrink-0">
          <div ref={mobileViewportRef} className="pipeline-viewport overflow-x-hidden overflow-y-visible">
            <div ref={mobileTrackRef} className="pipeline-stage-track flex w-max items-center gap-4">
              <HorizontalPipelineTrack />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HorizontalPipelineTrack() {
  return (
    <>
      {mainFlow.map((node, index) => (
        <div key={node.name} className="pipeline-card-slot shrink-0">
          <PipelineStageCard node={node} index={index} />
        </div>
      ))}

      <div className="pipeline-card-slot shrink-0" data-pipeline-hub>
        <PipelineStageCard
          node={{
            name: parallelStage.title,
            role: parallelStage.role,
            level: 1,
          }}
          index={4}
          body={parallelStage.body}
          output={parallelStage.output}
          illustration="parallel"
          stepLabel={parallelStage.step}
        />
      </div>
    </>
  );
}

function formatCardOutput(output: string): string {
  return output.replace(/^→\s*/, "");
}

function PipelineStageCard({
  node,
  index,
  body,
  output,
  illustration,
  stepLabel,
}: {
  node: { name: string; role: string; level: number };
  index: number;
  body?: string;
  output?: string;
  illustration?: (typeof pipelineNodeIllustrations)[number];
  stepLabel?: string;
}) {
  const cardBody = body ?? pipelineNodeBodies[index];
  const cardOutput = output ?? pipelineNodeOutputs[index];
  const cardIllustration = illustration ?? pipelineNodeIllustrations[index];
  const step = stepLabel ?? String(index + 1).padStart(2, "0");
  const outputLabel = cardOutput ? formatCardOutput(cardOutput) : null;

  return (
    <article className="pipeline-node pipeline-node--stage" data-index={index}>
      <header className="flex items-start justify-between gap-6">
        <div className="flex min-w-0 flex-col items-start gap-[0.35rem]">
          <span className="shrink-0 font-mono-text text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
            {step}
          </span>
          <h3 className="font-serif-display text-[clamp(1.35rem,5vw,1.75rem)] font-medium leading-[1.02] tracking-[-0.01em] text-[var(--text-primary)] lg:text-[clamp(1.875rem,2.25vw,2.375rem)]">
            {node.name}
          </h3>
        </div>
      </header>

      <div
        className="mx-0 mt-[0.9rem] mb-4 h-px bg-[color-mix(in_srgb,var(--border-gold)_70%,var(--border-subtle))] lg:mt-[1.35rem] lg:mb-[1.65rem]"
        aria-hidden="true"
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 items-stretch justify-between gap-5 sm:grid-cols-[45%_45%] sm:gap-0">
        <div className="flex min-w-0 flex-col">
          <p className="font-mono-text text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]">
            {node.role}
          </p>
          <p className="mt-[0.55rem] text-[0.875rem] font-medium leading-[1.5] text-[var(--text-secondary)] lg:mt-3 lg:text-[clamp(0.9375rem,1vw,1rem)] lg:leading-[1.65]">
            {cardBody}
          </p>
          {outputLabel ? (
            <>
              <div
                className="mt-[clamp(1.25rem,1.5vh,1.5rem)] mb-4 h-px w-full bg-[color-mix(in_srgb,var(--border-gold)_70%,var(--border-subtle))]"
                aria-hidden="true"
              />
              <p className="font-mono-text text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
                {outputLabel}
              </p>
            </>
          ) : null}
        </div>

        <div className="flex h-full min-w-0 items-stretch justify-center [&_.pipeline-card-art]:h-full [&_.pipeline-card-art]:w-full [&_.pipeline-card-art]:min-h-[9.5rem] lg:[&_.pipeline-card-art]:min-h-[12.5rem]">
          <PipelineCardIllustration variant={cardIllustration} hero />
        </div>
      </div>
    </article>
  );
}
