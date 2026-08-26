import { Beat01RecordingStage } from "@/components/scrollhero-test/Beat01RecordingStage";
import { Beat02TranscribeStage } from "@/components/scrollhero-test/Beat02TranscribeStage";
import { Beat03PipelineStage } from "@/components/scrollhero-test/Beat03PipelineStage";
import { Beat04PrdStage } from "@/components/scrollhero-test/Beat04PrdStage";
import { Beat05BrandStage } from "@/components/scrollhero-test/Beat05BrandStage";
import { SHOTGUN_WORD_COUNT } from "@/components/scrollhero-test/listener/ListenerCaptureTranscriptUI";
import { measureAnchor, relPoint } from "@/lib/scrollhero/geometry";
import type { Point, ScrollBeat, ScrollBeatStageProps } from "@/lib/scrollhero/types";
import type { ComponentType } from "react";

export const SPINE_LABELS = [
  "Record",
  "Transcribe",
  "Pipeline",
  "PRD",
  "Workspace",
  "Ship",
] as const;

export const STAGE_PAD = { top: 118, bottom: 100, left: 204, right: 80 };
export const GHOST_OPACITY = 0.05;

function measureByAnchors(
  shot: HTMLElement,
  container: HTMLElement,
  specs: Record<string, (r: DOMRect) => Point>,
): Partial<Record<string, Point>> {
  const hots: Partial<Record<string, Point>> = {};
  for (const [id, map] of Object.entries(specs)) {
    const p = measureAnchor(shot, container, id, (r) => map(r));
    if (p) hots[id] = p;
  }
  return hots;
}

export const beatMeasures: Record<
  string,
  (shot: HTMLElement, container: HTMLElement) => Partial<Record<string, Point>>
> = {
  record: (shot, container) =>
    measureByAnchors(shot, container, {
      capture: (r) =>
        relPoint(container, r.left - 30, r.top - 30 + r.height / 2),
      timer: (r) => relPoint(container, r.left + r.width / 2, r.top - 50),
      stop: (r) => relPoint(container, r.left - 22 + r.width / 2, r.bottom - 25),
    }),
  transcribe: (shot, container) =>
    measureByAnchors(shot, container, {
      transcript: (r) =>
        relPoint(container, r.left - 30, r.top + r.height / 2),
      meta: (r) =>
        relPoint(container, r.left + r.width * 0.18, r.top + 35),
      runpipeline: (r) =>
        relPoint(container, r.left - 20 + r.width / 2, r.bottom + 53),
    }),
  pipeline: (shot, container) =>
    measureByAnchors(shot, container, {
      stages: (r) =>
        relPoint(container, r.left - 6, r.top + r.height * 0.45),
      progress: (r) =>
        relPoint(container, r.left + r.width / 2, r.top - 8),
      building: (r) =>
        relPoint(container, r.left + r.width / 2, r.bottom + 8),
    }),
  prd: (shot, container) =>
    measureByAnchors(shot, container, {
      oneliner: (r) =>
        relPoint(container, r.left + r.width / 2, r.top - 8),
      feature: (r) =>
        relPoint(container, r.left - 6, r.top + r.height * 0.4),
      nav: (r) =>
        relPoint(container, r.left + r.width / 2, r.bottom + 8),
    }),
  workspace: (shot, container) =>
    measureByAnchors(shot, container, {
      palette: (r) =>
        relPoint(container, r.left + r.width / 2, r.top - 8),
      values: (r) =>
        relPoint(container, r.left - 6, r.top + r.height / 2),
      type: (r) =>
        relPoint(container, r.left + r.width / 2, r.bottom + 8),
    }),
};

export const beatStages: Record<
  string,
  ComponentType<ScrollBeatStageProps> | null
> = {
  record: Beat01RecordingStage,
  transcribe: Beat02TranscribeStage,
  pipeline: Beat03PipelineStage,
  prd: Beat04PrdStage,
  workspace: Beat05BrandStage,
  ship: null,
};

export const SCROLL_BEATS: ScrollBeat[] = [
  {
    id: "record",
    numeral: "01",
    spineLabel: "Record",
    eyebrow: "01 · Record",
    headline: ["Speak", "your", "idea."],
    subhead: "Fifteen seconds is plenty. Murmur takes it from there.",
    hasStage: true,
    hotspots: [
      {
        id: "capture",
        lines: ["Real-time", "capture"],
        label: { x: 20, y: 32 },
        connector: { x: 18, y: 50 },
        dir: "left",
      },
      {
        id: "timer",
        lines: ["Fifteen seconds", "is PLENTY"],
        label: { x: 96, y: -12 },
        connector: { x: 85, y: 0 },
        dir: "up",
        loops: 2,
      },
      {
        id: "stop",
        lines: ["One tap.", "Done."],
        label: { x: 35, y: 125 },
        connector: { x: 42, y: 135 },
        dir: "down",
        loops: 2,
      },
    ],
  },
  {
    id: "transcribe",
    numeral: "02",
    spineLabel: "Transcribe",
    eyebrow: "02 · Transcribe",
    headline: ["It", "becomes", "structure."],
    subhead:
      "Your voice, transcribed and structured. Confirm it, and the pipeline runs.",
    hasStage: true,
    hotspots: [
      {
        id: "transcript",
        lines: ["Structured,", "not raw"],
        label: { x: 20, y: 32 },
        connector: { x: 18, y: 50 },
        dir: "left",
      },
      {
        id: "meta",
        lines: [`${SHOTGUN_WORD_COUNT} words · 37 seconds`],
        label: { x: 100, y: 10 },
        connector: { x: 81, y: 15 },
        dir: "up",
        loops: 2,
      },
      {
        id: "runpipeline",
        lines: ["One click.", "It runs."],
        label: { x: 35, y: 125 },
        connector: { x: 42, y: 135 },
        dir: "down",
        loops: 1,
      },
    ],
  },
  {
    id: "pipeline",
    numeral: "03",
    spineLabel: "Pipeline",
    eyebrow: "03 · Pipeline",
    headline: ["Then", "it", "works."],
    subhead:
      "Research, PRD, brand, board — each agent runs in turn, in about six minutes.",
    hasStage: true,
    hotspots: [
      {
        id: "stages",
        lines: ["Four agents,", "in order"],
        label: { x: -12, y: 42 },
        connector: { x: -10, y: 52 },
        dir: "left",
      },
      {
        id: "progress",
        lines: ["Stage four", "of four"],
        label: { x: 28, y: -28 },
        connector: { x: 28, y: -12 },
        dir: "up",
        loops: 2,
      },
      {
        id: "building",
        lines: ["Your board,", "forming"],
        label: { x: 62, y: 108 },
        connector: { x: 58, y: 116 },
        dir: "down",
        loops: 1,
      },
    ],
  },
  {
    id: "prd",
    numeral: "04",
    spineLabel: "PRD",
    eyebrow: "04 · PRD",
    headline: ["A", "real", "PRD."],
    subhead:
      "Problem, users, features, metrics — the document you'd have written, written for you.",
    hasStage: true,
    hotspots: [
      {
        id: "oneliner",
        lines: ["A sharp", "one-liner"],
        label: { x: 48, y: -28 },
        connector: { x: 48, y: -12 },
        dir: "up",
        loops: 2,
      },
      {
        id: "feature",
        lines: ["Real features,", "prioritized"],
        label: { x: -12, y: 48 },
        connector: { x: -10, y: 58 },
        dir: "left",
      },
      {
        id: "nav",
        lines: ["Structured,", "navigable"],
        label: { x: 78, y: 108 },
        connector: { x: 78, y: 116 },
        dir: "down",
        loops: 1,
      },
    ],
  },
  {
    id: "workspace",
    numeral: "05",
    spineLabel: "Workspace",
    eyebrow: "05 · Workspace",
    headline: ["In", "your", "tools."],
    subhead:
      "Brand kit, Jira board, and Confluence space — pushed into your own workspace, ready to edit.",
    hasStage: true,
    hotspots: [
      {
        id: "palette",
        lines: ["Palette,", "type & voice"],
        label: { x: 50, y: -28 },
        connector: { x: 50, y: -12 },
        dir: "up",
        loops: 2,
      },
      {
        id: "values",
        lines: ["Brand, Jira", "& Confluence —", "in your tools"],
        label: { x: -14, y: 62 },
        connector: { x: -10, y: 72 },
        dir: "left",
      },
      {
        id: "type",
        lines: ["Ready to use"],
        label: { x: 50, y: 108 },
        connector: { x: 50, y: 116 },
        dir: "down",
        loops: 1,
      },
    ],
  },
  {
    id: "ship",
    numeral: "06",
    spineLabel: "Ship",
    eyebrow: "06 · Ship",
    headline: ["Talk.", "Get a foundation."],
    subhead: "Join the waitlist — be first when Murmur opens.",
    hasStage: false,
    hotspots: [],
  },
];
