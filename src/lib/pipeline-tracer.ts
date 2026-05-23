import { gsap } from "@/lib/gsap";

export const TRACER_SPEED = 180;

export const REPLAY_PIPELINE_EVENT = "murmur:pipeline-replay";

export type Point = { x: number; y: number };

export type TracerStep = {
  type: "trail";
  points: [Point, Point];
  glowStart?: number | "hub";
  glowEnd?: number | "hub";
};

export type TracerWaypoint = {
  point: Point;
  distance: number;
  glow?: number | "hub";
};

export type PipelineGlowController = {
  setGlow: (target: number | "hub") => void;
  clearGlow: () => void;
};

export function linkPoints(run: HTMLElement, flow: string): [Point, Point] | null {
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

export function railPoints(
  run: HTMLElement,
  flow: "branch-in" | "branch-out",
): [Point, Point] | null {
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

export function buildTracerSteps(run: HTMLElement): TracerStep[] {
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

function pointsEqual(a: Point, b: Point, epsilon = 0.5): boolean {
  return Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon;
}

export function buildTracerPath(steps: TracerStep[]): TracerWaypoint[] {
  const waypoints: TracerWaypoint[] = [];
  let distance = 0;

  for (const step of steps) {
    const [start, end] = step.points;
    const segmentLength = Math.hypot(end.x - start.x, end.y - start.y);

    if (waypoints.length === 0) {
      waypoints.push({ point: { ...start }, distance, glow: step.glowStart });
    } else {
      const last = waypoints[waypoints.length - 1];

      if (!pointsEqual(last.point, start)) {
        waypoints.push({ point: { ...start }, distance, glow: step.glowStart });
      } else if (step.glowStart !== undefined) {
        last.glow = step.glowStart;
      }
    }

    distance += segmentLength;
    waypoints.push({ point: { ...end }, distance, glow: step.glowEnd });
  }

  return waypoints;
}

export function createPipelineGlowController(run: HTMLElement): PipelineGlowController {
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

  return { setGlow, clearGlow };
}

function resolveGlowAtDistance(
  waypoints: TracerWaypoint[],
  targetDistance: number,
): number | "hub" | undefined {
  let glow: number | "hub" | undefined;

  for (const waypoint of waypoints) {
    if (waypoint.distance > targetDistance) {
      break;
    }
    if (waypoint.glow !== undefined) {
      glow = waypoint.glow;
    }
  }

  return glow;
}

function interpolateAlongPath(
  waypoints: TracerWaypoint[],
  targetDistance: number,
): Point | null {
  if (!waypoints.length) {
    return null;
  }

  if (targetDistance <= 0) {
    return waypoints[0].point;
  }

  const totalLength = waypoints[waypoints.length - 1].distance;
  if (targetDistance >= totalLength) {
    return waypoints[waypoints.length - 1].point;
  }

  for (let index = 1; index < waypoints.length; index += 1) {
    const end = waypoints[index];
    const start = waypoints[index - 1];

    if (targetDistance <= end.distance) {
      const segmentLength = end.distance - start.distance;
      const t =
        segmentLength > 0 ? (targetDistance - start.distance) / segmentLength : 0;

      return {
        x: start.point.x + (end.point.x - start.point.x) * t,
        y: start.point.y + (end.point.y - start.point.y) * t,
      };
    }
  }

  return waypoints[waypoints.length - 1].point;
}

export function setTracerProgress(
  run: HTMLElement,
  dot: HTMLElement,
  progress: number,
  glowController: PipelineGlowController,
): void {
  const steps = buildTracerSteps(run);
  const waypoints = buildTracerPath(steps);

  if (!waypoints.length) {
    return;
  }

  const clamped = Math.max(0, Math.min(1, progress));
  const totalLength = waypoints[waypoints.length - 1].distance;

  if (clamped <= 0) {
    gsap.set(dot, { opacity: 0, xPercent: -50, yPercent: -50 });
    glowController.clearGlow();
    return;
  }

  if (clamped >= 1) {
    const end = waypoints[waypoints.length - 1].point;
    gsap.set(dot, {
      opacity: 0,
      x: end.x,
      y: end.y,
      xPercent: -50,
      yPercent: -50,
    });
    glowController.setGlow(9);
    return;
  }

  const targetDistance = totalLength * clamped;
  const point = interpolateAlongPath(waypoints, targetDistance);

  if (!point) {
    return;
  }

  gsap.set(dot, {
    opacity: 1,
    x: point.x,
    y: point.y,
    xPercent: -50,
    yPercent: -50,
  });

  const glow = resolveGlowAtDistance(waypoints, targetDistance);
  if (glow !== undefined) {
    glowController.setGlow(glow);
  } else {
    glowController.clearGlow();
  }
}

export function createPipelineReplayTimeline(
  run: HTMLElement,
  dot: HTMLElement,
  glowController: PipelineGlowController,
  onComplete?: () => void,
): gsap.core.Timeline {
  const proxy = { progress: 0 };

  return gsap.timeline({
    onUpdate: () => setTracerProgress(run, dot, proxy.progress, glowController),
    onComplete,
  }).to(proxy, {
    progress: 1,
    duration: 2.8,
    ease: "none",
  });
}

export function createPipelineTracerLoop(
  run: HTMLElement,
  dot: HTMLElement,
  glowController: PipelineGlowController,
): gsap.core.Timeline | null {
  if (window.matchMedia("(max-width: 1023px)").matches) {
    return null;
  }

  const steps = buildTracerSteps(run);
  if (!steps.length) {
    return null;
  }

  const { setGlow, clearGlow } = glowController;

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
