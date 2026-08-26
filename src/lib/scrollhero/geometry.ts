import type { Hotspot, Point, StageBox } from "@/lib/scrollhero/types";

export function relPoint(container: HTMLElement, x: number, y: number): Point {
  const cRect = container.getBoundingClientRect();
  return { x: x - cRect.left, y: y - cRect.top };
}

export function pointOnShot(p: Point, box: StageBox): Point {
  return {
    x: box.shotLeft + (box.shotW * p.x) / 100,
    y: box.shotTop + (box.shotH * p.y) / 100,
  };
}

export function spiralPath(fromPx: Point, toPx: Point, loops = 2): string {
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

export function connectorPath(h: Hotspot, from: Point, to: Point): string {
  return spiralPath(from, to, h.loops ?? 2);
}

export function labelTransform(dir: Hotspot["dir"]) {
  if (dir === "left") return "translate(-100%, -50%)";
  if (dir === "up") return "translate(-50%, -100%)";
  return "translate(-50%, 0)";
}

export function measureAnchor(
  shot: HTMLElement,
  container: HTMLElement,
  name: string,
  map: (r: DOMRect) => Point,
): Point | undefined {
  const el = shot.querySelector(`[data-sh-anchor="${name}"]`);
  if (!el) return undefined;
  return map(el.getBoundingClientRect());
}
