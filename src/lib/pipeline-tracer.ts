import { pipelineStages } from "@/content/home";
import { gsap } from "@/lib/gsap";

export const REPLAY_PIPELINE_EVENT = "murmur:pipeline-replay";

/** Progress breakpoints for 7 narrative stages (aligned to scrub scroll). */
const STAGE_THRESHOLDS = [0, 0.12, 0.26, 0.4, 0.52, 0.7, 0.86, 1];

export function getPipelineStageIndex(progress: number): number {
  const clamped = Math.max(0, Math.min(1, progress));

  for (let index = STAGE_THRESHOLDS.length - 2; index >= 0; index -= 1) {
    if (clamped >= STAGE_THRESHOLDS[index]) {
      return index;
    }
  }

  return 0;
}

export function setPipelineTrackPan(
  track: HTMLElement,
  viewport: HTMLElement,
  progress: number,
): void {
  const styles = getComputedStyle(viewport);
  const padLeft = Number.parseFloat(styles.paddingLeft) || 0;
  const padRight = Number.parseFloat(styles.paddingRight) || 0;
  const visibleWidth = viewport.clientWidth - padLeft - padRight;
  const maxPan = Math.max(0, track.scrollWidth - visibleWidth);
  gsap.set(track, { x: -maxPan * Math.max(0, Math.min(1, progress)) });
}

export type PipelineStageController = {
  setStage: (stageIndex: number) => void;
  clearStage: () => void;
  resetFocus: () => void;
};

const ACTIVE_CARD_SCALE = 1.035;
const INACTIVE_CARD_SCALE = 0.96;
const INACTIVE_CARD_OPACITY = 0.52;
const CARD_FOCUS_DURATION = 0.65;

export function createPipelineStageController(
  run: HTMLElement,
  progressRail: HTMLElement,
): PipelineStageController {
  const steps = gsap.utils.toArray<HTMLElement>(".pipeline-progress-step", progressRail);
  let activeStageIndex = -1;

  const queryNodes = () => gsap.utils.toArray<HTMLElement>(".pipeline-node", run);
  const querySlots = () => gsap.utils.toArray<HTMLElement>(".pipeline-card-slot", run);
  const queryHubSlot = () => run.querySelector<HTMLElement>("[data-pipeline-hub]");

  const getActiveSlot = (stageIndex: number): HTMLElement | null => {
    const stage = pipelineStages[stageIndex];
    if (!stage) {
      return null;
    }

    if (stage.glowTarget === "hub") {
      return queryHubSlot();
    }

    const nodeEl = queryNodes().find((entry) => entry.dataset.index === String(stage.glowTarget));
    return nodeEl?.closest<HTMLElement>(".pipeline-card-slot") ?? null;
  };

  const resetSlotMotion = () => {
    activeStageIndex = -1;
    const slots = querySlots();
    gsap.killTweensOf(slots);
    gsap.set(slots, { scale: 1, opacity: 1 });
  };

  const applySlotFocus = (activeSlot: HTMLElement | null) => {
    const scrubbing = run.classList.contains("is-scrubbing");

    querySlots().forEach((slot) => {
      const isActive = slot === activeSlot;

      if (!scrubbing) {
        gsap.set(slot, { scale: 1, opacity: 1 });
        return;
      }

      gsap.to(slot, {
        scale: isActive ? ACTIVE_CARD_SCALE : INACTIVE_CARD_SCALE,
        opacity: isActive ? 1 : INACTIVE_CARD_OPACITY,
        duration: CARD_FOCUS_DURATION,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  const clearStage = () => {
    queryNodes().forEach((node) => node.classList.remove("is-tracing"));
    querySlots().forEach((slot) => slot.classList.remove("is-active-stage"));
    steps.forEach((step) => {
      step.classList.remove("is-active");
      step.classList.remove("is-complete");
    });
    resetSlotMotion();
  };

  const setStage = (stageIndex: number) => {
    if (stageIndex === activeStageIndex) {
      return;
    }

    queryNodes().forEach((node) => node.classList.remove("is-tracing"));
    querySlots().forEach((slot) => slot.classList.remove("is-active-stage"));

    activeStageIndex = stageIndex;

    const stage = pipelineStages[stageIndex];
    if (!stage) {
      return;
    }

    steps.forEach((step, index) => {
      step.classList.toggle("is-active", index === stageIndex);
      step.classList.toggle("is-complete", index < stageIndex);
    });

    const { glowTarget } = stage;
    const activeSlot = getActiveSlot(stageIndex);

    if (glowTarget === "hub") {
      activeSlot?.classList.add("is-active-stage");
      activeSlot?.querySelector<HTMLElement>(".pipeline-node")?.classList.add("is-tracing");
      applySlotFocus(activeSlot);
      return;
    }

    const nodeEl = queryNodes().find((entry) => entry.dataset.index === String(glowTarget));
    if (!nodeEl) {
      return;
    }

    nodeEl.classList.add("is-tracing");
    activeSlot?.classList.add("is-active-stage");
    applySlotFocus(activeSlot);
  };

  return { setStage, clearStage, resetFocus: resetSlotMotion };
}

export function setProgressRailTracer(
  progressRail: HTMLElement,
  dot: HTMLElement,
  progress: number,
): void {
  const track = progressRail.querySelector<HTMLElement>(".pipeline-progress-track");
  const anchors = gsap.utils.toArray<HTMLElement>("[data-stage-anchor]", progressRail);

  if (!track || !anchors.length) {
    return;
  }

  const trackRect = track.getBoundingClientRect();
  const line = track.querySelector<HTMLElement>(".pipeline-progress-track-line");
  const lineRect = line?.getBoundingClientRect();
  const y = lineRect
    ? lineRect.top + lineRect.height / 2 - trackRect.top
    : 13;

  const xs = anchors.map((anchor) => {
    const rect = anchor.getBoundingClientRect();
    return rect.left + rect.width / 2 - trackRect.left;
  });

  const clamped = Math.max(0, Math.min(1, progress));
  const scaled = clamped * (xs.length - 1);
  const startIndex = Math.min(Math.floor(scaled), xs.length - 2);
  const t = scaled - startIndex;
  const x = xs[startIndex] + (xs[startIndex + 1] - xs[startIndex]) * t;

  gsap.set(dot, {
    opacity: 1,
    left: x,
    top: y,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
  });
}

export type PipelineScrubUpdate = {
  progress: number;
  stageIndex: number;
};

export function applyPipelineScrub(
  run: HTMLElement,
  progressRail: HTMLElement,
  dot: HTMLElement,
  track: HTMLElement,
  viewport: HTMLElement,
  progress: number,
  stageController: PipelineStageController,
): PipelineScrubUpdate {
  const clamped = Math.max(0, Math.min(1, progress));

  run.classList.add("is-scrubbing");
  setPipelineTrackPan(track, viewport, clamped);
  setProgressRailTracer(progressRail, dot, clamped);

  const stageIndex = getPipelineStageIndex(clamped);
  stageController.setStage(stageIndex);

  return {
    progress: clamped,
    stageIndex,
  };
}

/** @deprecated Use createPipelineStageController */
export type PipelineGlowController = PipelineStageController;

/** @deprecated Use createPipelineStageController */
export function createPipelineGlowController(
  run: HTMLElement,
  progressRail?: HTMLElement | null,
): PipelineStageController {
  if (progressRail) {
    return createPipelineStageController(run, progressRail);
  }

  return {
    setStage: () => {},
    clearStage: () => {},
    resetFocus: () => {},
  };
}
