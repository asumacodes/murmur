"use client";

import { useRef } from "react";
import { Container, SectionEyebrow } from "@/components/ui";
import { pipelineNodes } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollEnter } from "@/lib/motion";

const mainFlow = pipelineNodes.slice(0, 4);
const branchFlow = pipelineNodes.slice(4, 8);
const shipFlow = pipelineNodes.slice(8);

type Point = { x: number; y: number };

const TRACER_SPEED = 180;

type TracerStep = {
  type: "trail";
  points: [Point, Point];
  glowStart?: number | "hub";
  glowEnd?: number | "hub";
};

function linkPoints(run: HTMLElement, flow: string): [Point, Point] | null {
  const line = run.querySelector<HTMLElement>(`[data-flow="${flow}"]`);
  if (!line) {
    return null;
  }

  const runRect = run.getBoundingClientRect();
  const rect = line.getBoundingClientRect();
  const y = rect.top + rect.height / 2 - runRect.top;

  return [
    { x: rect.left - runRect.left, y },
    { x: rect.right - runRect.left, y },
  ];
}

function railPoints(run: HTMLElement, flow: "branch-in" | "branch-out"): [Point, Point] | null {
  const rail = run.querySelector<HTMLElement>(`[data-flow="${flow}"]`);
  if (!rail) {
    return null;
  }

  const runRect = run.getBoundingClientRect();
  const rect = rail.getBoundingClientRect();
  const y = rect.top + rect.height / 2 - runRect.top;

  return [
    { x: rect.left - runRect.left, y },
    { x: rect.right - runRect.left, y },
  ];
}

function trailStep(
  run: HTMLElement,
  source: "link" | "rail",
  flow: string,
  glow?: { start?: number | "hub"; end?: number | "hub" },
): TracerStep | null {
  const points =
    source === "link"
      ? linkPoints(run, flow)
      : railPoints(run, flow as "branch-in" | "branch-out");

  if (!points) {
    return null;
  }

  return {
    type: "trail",
    points,
    glowStart: glow?.start,
    glowEnd: glow?.end,
  };
}

function buildTracerSteps(run: HTMLElement): TracerStep[] {
  const steps: TracerStep[] = [];

  const add = (step: TracerStep | null) => {
    if (step) {
      steps.push(step);
    }
  };

  // Tracer only runs on visible lines — hidden instant jumps between each segment.
  add(trailStep(run, "link", "main-0", { start: 0, end: 1 }));
  add(trailStep(run, "link", "main-1", { start: 1, end: 2 }));
  add(trailStep(run, "link", "main-2", { start: 2, end: 3 }));
  add(trailStep(run, "rail", "branch-in", { start: "hub", end: "hub" }));
  add(trailStep(run, "rail", "branch-out", { start: "hub", end: "hub" }));
  add(trailStep(run, "link", "ship-0", { start: 8, end: 9 }));

  return steps;
}

function buildTracerLoop(run: HTMLElement, dot: HTMLElement) {
  if (window.matchMedia("(max-width: 1023px)").matches) {
    return null;
  }

  const steps = buildTracerSteps(run);
  if (!steps.length) {
    return null;
  }

  const nodes = gsap.utils.toArray<HTMLElement>(".pipeline-node", run);
  const hub = run.querySelector<HTMLElement>(".pipeline-branch-hub");
  const parallelIndexes = [4, 5, 6, 7];
  let activeNodes: HTMLElement[] = [];

  const clearGlow = () => {
    activeNodes.forEach((nodeEl) => nodeEl.classList.remove("is-tracing"));
    activeNodes = [];
    hub?.classList.remove("is-tracing");
  };

  const setGlow = (target: number | "hub") => {
    clearGlow();

    if (target === "hub") {
      hub?.classList.add("is-tracing");
      activeNodes = parallelIndexes
        .map((index) => nodes.find((nodeEl) => nodeEl.dataset.index === String(index)))
        .filter((nodeEl): nodeEl is HTMLElement => Boolean(nodeEl));
      activeNodes.forEach((nodeEl) => nodeEl.classList.add("is-tracing"));
      return;
    }

    const nodeEl = nodes.find((entry) => entry.dataset.index === String(target));
    if (nodeEl) {
      activeNodes = [nodeEl];
      nodeEl.classList.add("is-tracing");
    }
  };

  const loop = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.25,
    onRepeat: () => {
      gsap.set(dot, { opacity: 0 });
      clearGlow();
    },
  });

  steps.forEach((step) => {
    const [start, end] = step.points;
    const duration = Math.hypot(end.x - start.x, end.y - start.y) / TRACER_SPEED;

    loop.call(() => {
      gsap.set(dot, {
        opacity: 1,
        x: start.x,
        y: start.y,
        xPercent: -50,
        yPercent: -50,
      });
      if (step.glowStart !== undefined) {
        setGlow(step.glowStart);
      }
    });

    loop.to(
      dot,
      {
        x: end.x,
        y: end.y,
        duration,
        ease: "none",
        onComplete: () => {
          gsap.set(dot, { opacity: 0 });
          if (step.glowEnd !== undefined) {
            setGlow(step.glowEnd);
          }
        },
      },
      ">",
    );
  });

  loop.call(() => {
    gsap.set(dot, { opacity: 0 });
    clearGlow();
  });

  return loop;
}

export function Pipeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const runRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const revealTargets = [
        ".pipeline-header-line",
        ".pipeline-node",
        ".pipeline-link",
        ".pipeline-branch-rail",
        ".pipeline-branch-label",
        ".pipeline-branch-hub",
      ];

      const run = runRef.current;
      if (!run) {
        return;
      }

      let tracerLoop: gsap.core.Timeline | null = null;

      const startTracer = () => {
        tracerLoop?.kill();
        const dot = run.querySelector<HTMLElement>(".pipeline-tracer-global");
        if (!dot) {
          return;
        }
        tracerLoop = buildTracerLoop(run, dot);
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(revealTargets, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        gsap.set(".pipeline-link-line, .pipeline-branch-rail", { scaleX: 1 });
        run.classList.add("is-live");
        return;
      }

      gsap.fromTo(
        ".pipeline-header-line",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".pipeline-header",
            ...scrollEnter,
          },
        },
      );

      const nodes = gsap.utils.toArray<HTMLElement>(".pipeline-node", run);
      const links = gsap.utils.toArray<HTMLElement>(".pipeline-link", run);
      const branchRails = gsap.utils.toArray<HTMLElement>(".pipeline-branch-rail", run);
      const branchLabels = gsap.utils.toArray<HTMLElement>(".pipeline-branch-label", run);
      const branchHub = run.querySelector<HTMLElement>(".pipeline-branch-hub");

      gsap.set(links, { autoAlpha: 0 });
      gsap.set(".pipeline-link-line", {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(branchRails, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(branchLabels, { autoAlpha: 0, y: 6 });
      if (branchHub) {
        gsap.set(branchHub, { autoAlpha: 0, y: 16, scale: 0.98 });
      }
      gsap.set(run, { autoAlpha: 0.94, y: 16 });

      const flow = gsap.timeline({
        scrollTrigger: {
          trigger: run,
          start: "top 78%",
          toggleActions: "play none none none",
        },
        onComplete: () => {
          run.classList.add("is-live");
          startTracer();
        },
      });

      flow.fromTo(
        run,
        { autoAlpha: 0.92, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" },
      );

      nodes.slice(0, 4).forEach((nodeEl, index) => {
        flow.fromTo(
          nodeEl,
          { autoAlpha: 0, y: 18, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" },
          index === 0 ? "-=0.35" : "-=0.18",
        );

        const link = run.querySelector<HTMLElement>(`[data-flow="main-${index}"]`)?.closest(".pipeline-link");
        if (link && index < 3) {
          const line = link.querySelector<HTMLElement>(".pipeline-link-line");
          flow.to(link, { autoAlpha: 1, duration: 0.15 }, "-=0.12");
          if (line) {
            flow.to(line, { scaleX: 1, duration: 0.35, ease: "power2.out" }, "-=0.12");
          }
        }
      });

      branchRails.forEach((rail, index) => {
        flow.to(
          rail,
          { scaleX: 1, duration: 0.45, ease: "power2.out" },
          index === 0 ? "-=0.05" : "-=0.35",
        );
      });

      branchLabels.forEach((label, index) => {
        flow.fromTo(
          label,
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
          index === 0 ? "-=0.3" : "-=0.35",
        );
      });

      if (branchHub) {
        flow.fromTo(
          branchHub,
          { autoAlpha: 0, y: 16, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
          "-=0.25",
        );
      }

      nodes.slice(4, 8).forEach((nodeEl, index) => {
        flow.fromTo(
          nodeEl,
          { autoAlpha: 0, y: 14, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" },
          index === 0 ? "-=0.2" : "-=0.22",
        );
      });

      const shipNodes = nodes.slice(8);

      shipNodes.forEach((nodeEl, index) => {
        flow.fromTo(
          nodeEl,
          { autoAlpha: 0, y: 18, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" },
          index === 0 ? "-=0.1" : "-=0.18",
        );

        if (index < shipNodes.length - 1) {
          const link = run.querySelector<HTMLElement>('[data-flow="ship-0"]')?.closest(".pipeline-link");
          const line = link?.querySelector<HTMLElement>(".pipeline-link-line");
          if (link) {
            flow.to(link, { autoAlpha: 1, duration: 0.15 }, "-=0.12");
          }
          if (line) {
            flow.to(line, { scaleX: 1, duration: 0.35, ease: "power2.out" }, "-=0.12");
          }
        }
      });

      const onResize = () => {
        if (!run.classList.contains("is-live")) {
          return;
        }
        startTracer();
      };

      window.addEventListener("resize", onResize);

      return () => {
        tracerLoop?.kill();
        window.removeEventListener("resize", onResize);
        run.querySelectorAll(".pipeline-node.is-tracing, .pipeline-branch-hub.is-tracing").forEach((el) => {
          el.classList.remove("is-tracing");
        });
      };
    },
    { scope: sectionRef },
  );

  return (
    <section id="pipeline" ref={sectionRef} className="section-pad bg-[var(--bg-warm)]">
      <Container>
        <div className="pipeline-header mb-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <SectionEyebrow className="pipeline-header-line opacity-0">
              Pipeline
            </SectionEyebrow>
            <h2 className="pipeline-header-line font-serif-display mt-4 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] opacity-0">
              Not one Claude call in a trenchcoat.
            </h2>
          </div>
          <p className="pipeline-header-line max-w-2xl text-lg leading-8 text-[var(--text-secondary)] opacity-0">
            Each agent has a single job and a typed schema. The PRD agent does
            not write code. The brand agent does not generate research.
            Specialization is what makes the output trustworthy.
          </p>
        </div>

        <div
          ref={runRef}
          className="pipeline-run relative rounded-[2rem] border border-[var(--border-gold)] bg-[rgba(10,10,10,0.45)] p-4 sm:p-6 lg:p-8"
        >
          <span
            className="pipeline-tracer-global pointer-events-none absolute left-0 top-0 z-20 hidden size-2 rounded-full bg-[var(--gold-bright)] opacity-0 shadow-[0_0_14px_rgba(232,168,32,0.95)] lg:block"
            aria-hidden="true"
          />

          <div className="grid gap-5">
            <FlowRow nodes={mainFlow} startIndex={0} flowPrefix="main" />

            <div className="grid gap-4 lg:grid-cols-[1fr_2fr_1fr] lg:items-center">
              <BranchRail label="PRD fans out" align="right" flow="branch-in" />
              <div className="pipeline-branch-hub opacity-0 rounded-[1.5rem] border border-[var(--border-gold)] bg-[rgba(201,169,110,0.04)] p-4">
                <p className="font-mono-text mb-4 text-center text-[0.65rem] uppercase tracking-[0.14em] text-[var(--gold)]">
                  parallel agents
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {branchFlow.map((node, index) => (
                    <PipelineNode
                      key={node.name}
                      node={node}
                      index={index + mainFlow.length}
                      compact
                    />
                  ))}
                </div>
              </div>
              <BranchRail label="engineering rejoins" align="left" flow="branch-out" />
            </div>

            <FlowRow
              nodes={shipFlow}
              startIndex={mainFlow.length + branchFlow.length}
              alignRight
              flowPrefix="ship"
            />
          </div>
        </div>

        <div className="font-mono-text mt-5 text-right text-xs uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
          Orchestrated by n8n · self-hosted
        </div>
      </Container>
    </section>
  );
}

function BranchRail({
  label,
  align,
  flow,
}: {
  label: string;
  align: "left" | "right";
  flow: "branch-in" | "branch-out";
}) {
  return (
    <div className={align === "right" ? "lg:text-right" : undefined}>
      <div className="relative flex h-px items-center">
        <div
          className="pipeline-branch-rail relative h-px w-full scale-x-0 bg-[var(--border-gold)]/80"
          data-flow={flow}
        />
      </div>
      <p
        className={`pipeline-branch-label mt-2 font-mono-text text-[0.6rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)] opacity-0 ${
          align === "right" ? "lg:text-right" : ""
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function FlowLink({ flow }: { flow: string }) {
  return (
    <div
      className="pipeline-link opacity-0 hidden shrink-0 items-center lg:flex lg:h-full lg:w-14 xl:w-20"
      aria-hidden="true"
    >
      <div
        className="pipeline-link-line relative h-px w-full scale-x-0 bg-[var(--border-gold)]/80"
        data-flow={flow}
      />
    </div>
  );
}

function FlowRow({
  nodes,
  startIndex,
  alignRight = false,
  flowPrefix,
}: {
  nodes: typeof pipelineNodes;
  startIndex: number;
  alignRight?: boolean;
  flowPrefix: "main" | "ship";
}) {
  return (
    <div
      className={`flex flex-col gap-0 lg:flex-row lg:items-stretch ${
        alignRight ? "lg:justify-end" : ""
      }`}
    >
      {nodes.map((node, index) => (
        <div key={node.name} className="contents">
          <div className="lg:min-w-0 lg:flex-1">
            <PipelineNode node={node} index={index + startIndex} />
          </div>
          {index < nodes.length - 1 ? (
            <FlowLink flow={`${flowPrefix}-${index}`} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function PipelineNode({
  node,
  index,
  compact = false,
}: {
  node: { name: string; role: string; level: number; pack: string };
  index: number;
  compact?: boolean;
}) {
  return (
    <div
      className={`pipeline-node opacity-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 transition-[border-color,box-shadow] duration-300 ${
        compact ? "min-h-32" : ""
      }`}
      data-index={index}
    >
      <div className="font-mono-text mb-5 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span className="rounded-full border border-[var(--gold)] px-2 py-0.5 text-[var(--gold)]">
          Pack {node.pack}
        </span>
      </div>
      <h3 className="font-serif-display text-2xl text-[var(--gold)]">{node.name}</h3>
      <p className="font-mono-text mt-2 text-[0.68rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
        {node.role}
      </p>
    </div>
  );
}
