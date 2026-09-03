export type Point = { x: number; y: number };

export type HotspotDir = "left" | "up" | "down";

export type Hotspot = {
  id: string;
  lines: string[];
  label: Point;
  connector: Point;
  dir: HotspotDir;
  loops?: number;
};

export type StageBox = {
  w: number;
  h: number;
  shotLeft: number;
  shotTop: number;
  shotW: number;
  shotH: number;
};

export const EMPTY_STAGE_BOX: StageBox = {
  w: 0,
  h: 0,
  shotLeft: 0,
  shotTop: 0,
  shotW: 0,
  shotH: 0,
};

export type ScrollBeatStageProps = {
  onLayout?: () => void;
  /** Live demo (recording timer); omit or false for static mobile frames */
  active?: boolean;
};

export type ScrollBeat = {
  id: string;
  numeral: string;
  spineLabel: string;
  eyebrow: string;
  headline: string[];
  subhead: string;
  /** null = CTA-only beat (Ship) */
  hasStage: boolean;
  hotspots: Hotspot[];
};
