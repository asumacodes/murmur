/**
 * Target formations for the murmuration. Every shape is N points in a shared
 * world space (x ≈ [-1.4, 1.4], y ≈ [-0.95, 0.95]); particle i flies from
 * shape A[i] to shape B[i], so shapes are just arrays of the same length.
 *
 * pos: N×3 floats. col: N×4 floats (rgb 0–1 + weight; weight 0 = theme ink).
 */
export type Shape = { pos: Float32Array; col: Float32Array };

export type ShapeName =
  | "voice"
  | "swarm"
  | "transcript"
  | "research"
  | "prd"
  | "brand"
  | "engineering"
  | "confluence"
  | "roadmap"
  | "jira";

type Rng = () => number;

/** Deterministic PRNG so shapes are identical across renders. */
function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rng: Rng) {
  const u = Math.max(rng(), 1e-6);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function empty(n: number): Shape {
  return { pos: new Float32Array(n * 3), col: new Float32Array(n * 4) };
}

/* ---------------- procedural ---------------- */

function voice(n: number, rng: Rng): Shape {
  const s = empty(n);
  const bars = 46;
  const span = 2.5;
  const barW = span / bars;
  const heights: number[] = [];
  let total = 0;
  for (let b = 0; b < bars; b++) {
    const x = -span / 2 + (b + 0.5) * barW;
    const env = 0.22 + 0.78 * Math.exp(-x * x * 1.5);
    const h = env * (0.45 + 0.55 * Math.abs(Math.sin(b * 1.7) * Math.cos(b * 0.53))) * 0.62 + 0.03;
    heights.push(h);
    total += h;
  }
  for (let i = 0; i < n; i++) {
    let r = rng() * total;
    let b = 0;
    while (b < bars - 1 && r > heights[b]) {
      r -= heights[b];
      b++;
    }
    const x = -span / 2 + (b + 0.5) * barW + (rng() - 0.5) * barW * 0.42;
    const y = (rng() * 2 - 1) * heights[b];
    s.pos[i * 3] = x;
    s.pos[i * 3 + 1] = y;
    s.pos[i * 3 + 2] = (rng() - 0.5) * 0.14;
  }
  return s;
}

function swarm(n: number, rng: Rng): Shape {
  const s = empty(n);
  for (let i = 0; i < n; i++) {
    const u = rng();
    const cx = -1.25 + 2.5 * u;
    const cy = 0.32 * Math.sin(u * Math.PI * 1.35 + 0.3) - 0.05;
    const cz = 0.35 * Math.cos(u * Math.PI * 2);
    const r = 0.12 + 0.34 * Math.sin(u * Math.PI) ** 0.8;
    s.pos[i * 3] = cx + gauss(rng) * r * 0.55;
    s.pos[i * 3 + 1] = cy + gauss(rng) * r * 0.4;
    s.pos[i * 3 + 2] = cz + gauss(rng) * r * 0.5;
  }
  return s;
}

function research(n: number, rng: Rng): Shape {
  const s = empty(n);
  const R = 0.78;
  const hits = [
    [0.4, 0.5],
    [1.4, -0.3],
    [2.4, 0.9],
    [3.5, 0.2],
    [4.6, -0.7],
    [5.5, 0.55],
  ];
  for (let i = 0; i < n; i++) {
    const k = rng();
    let theta: number;
    let phi: number;
    if (k < 0.44) {
      // latitude rings
      const ring = Math.floor(rng() * 7);
      phi = -1.2 + (ring / 6) * 2.4;
      theta = rng() * Math.PI * 2;
    } else if (k < 0.8) {
      // meridians
      const m = Math.floor(rng() * 9);
      theta = (m / 9) * Math.PI * 2;
      phi = (rng() * 2 - 1) * (Math.PI / 2);
    } else {
      // search hits: bright clusters on the surface
      const h = hits[Math.floor(rng() * hits.length)];
      theta = h[0] + gauss(rng) * 0.07;
      phi = h[1] + gauss(rng) * 0.07;
      s.col[i * 4] = 1;
      s.col[i * 4 + 1] = 0.36;
      s.col[i * 4 + 2] = 0.18;
      s.col[i * 4 + 3] = 0.9;
    }
    const cp = Math.cos(phi);
    s.pos[i * 3] = R * cp * Math.cos(theta);
    s.pos[i * 3 + 1] = R * Math.sin(phi);
    s.pos[i * 3 + 2] = R * cp * Math.sin(theta);
  }
  return s;
}

/* ---------------- canvas-sampled ---------------- */

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

const CW = 640;
const CH = 440;
const WORLD_W = 2.5;

function sample(n: number, rng: Rng, draw: Draw, depth = 0.12): Shape {
  const s = empty(n);
  const canvas = document.createElement("canvas");
  canvas.width = CW;
  canvas.height = CH;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return s;
  ctx.clearRect(0, 0, CW, CH);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  draw(ctx, CW, CH);

  const data = ctx.getImageData(0, 0, CW, CH).data;
  const pts: number[] = [];
  for (let y = 0; y < CH; y += 2) {
    for (let x = 0; x < CW; x += 2) {
      if (data[(y * CW + x) * 4 + 3] > 140) pts.push(x, y);
    }
  }
  const count = pts.length / 2;
  if (!count) return s;
  const worldH = (WORLD_W * CH) / CW;
  for (let i = 0; i < n; i++) {
    const j = Math.floor(rng() * count);
    const px = pts[j * 2] + (rng() - 0.5) * 1.6;
    const py = pts[j * 2 + 1] + (rng() - 0.5) * 1.6;
    s.pos[i * 3] = (px / CW - 0.5) * WORLD_W;
    s.pos[i * 3 + 1] = -(py / CH - 0.5) * worldH;
    s.pos[i * 3 + 2] = (rng() - 0.5) * depth;
    const o = (pts[j * 2 + 1] * CW + pts[j * 2]) * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    if (!(r > 245 && g > 245 && b > 245)) {
      s.col[i * 4] = r / 255;
      s.col[i * 4 + 1] = g / 255;
      s.col[i * 4 + 2] = b / 255;
      s.col[i * 4 + 3] = 1;
    }
  }
  return s;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const drawTranscript: Draw = (ctx) => {
  const widths = [
    [70, 110, 46, 88, 120],
    [96, 58, 130, 74],
    [52, 118, 90, 66, 84],
    [140, 60, 98],
    [80, 72, 116, 54, 70],
    [64, 124, 88],
  ];
  let y = 92;
  widths.forEach((row, ri) => {
    let x = 110 + (ri === 0 ? 0 : 0);
    row.forEach((w) => {
      roundRect(ctx, x, y, w, 13, 6.5);
      ctx.fill();
      x += w + 14;
    });
    y += 44;
  });
  // speaker marks
  ctx.beginPath();
  ctx.arc(80, 98, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(80, 230, 7, 0, Math.PI * 2);
  ctx.fill();
};

const drawPrd: Draw = (ctx) => {
  ctx.lineWidth = 5;
  roundRect(ctx, 200, 30, 240, 380, 18);
  ctx.stroke();
  roundRect(ctx, 228, 62, 150, 20, 8);
  ctx.fill();
  roundRect(ctx, 228, 96, 184, 9, 4.5);
  ctx.fill();
  roundRect(ctx, 228, 114, 130, 9, 4.5);
  ctx.fill();
  let y = 156;
  for (let i = 0; i < 5; i++) {
    ctx.lineWidth = 3.5;
    roundRect(ctx, 230, y - 2, 16, 16, 4);
    ctx.stroke();
    if (i < 3) {
      ctx.beginPath();
      ctx.moveTo(234, y + 6);
      ctx.lineTo(238, y + 10);
      ctx.lineTo(243, y + 2);
      ctx.stroke();
    }
    roundRect(ctx, 258, y + 1, 90 + ((i * 37) % 60), 9, 4.5);
    ctx.fill();
    y += 38;
  }
  roundRect(ctx, 228, 356, 184, 9, 4.5);
  ctx.fill();
  roundRect(ctx, 228, 374, 110, 9, 4.5);
  ctx.fill();
};

function makeDrawBrand(palette: string[]): Draw {
  return (ctx) => {
    ctx.font = "italic 400 200px Georgia, 'Times New Roman', serif";
    ctx.textBaseline = "middle";
    ctx.fillText("Aa", 70, 210);
    const colors = palette.length ? palette : ["#fff", "#fff", "#fff", "#fff", "#fff"];
    const cols = colors.slice(0, 5);
    cols.forEach((c, i) => {
      const cx = 400 + (i % 3) * 80;
      const cy = 150 + Math.floor(i / 3) * 110;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(cx, cy, 34, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#fff";
    roundRect(ctx, 70, 330, 220, 10, 5);
    ctx.fill();
    roundRect(ctx, 70, 352, 150, 10, 5);
    ctx.fill();
  };
}

const drawEngineering: Draw = (ctx) => {
  ctx.lineWidth = 4.5;
  const box = (x: number, y: number, w: number, h: number) => {
    roundRect(ctx, x, y, w, h, 12);
    ctx.stroke();
    roundRect(ctx, x + 16, y + h / 2 - 4, w - 40, 8, 4);
    ctx.fill();
  };
  box(250, 40, 140, 60);
  box(90, 180, 140, 60);
  box(250, 180, 140, 60);
  box(410, 180, 140, 60);
  // db cylinders
  const db = (cx: number, y: number) => {
    ctx.beginPath();
    ctx.ellipse(cx, y, 56, 14, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 56, y);
    ctx.lineTo(cx - 56, y + 58);
    ctx.ellipse(cx, y + 58, 56, 14, 0, Math.PI, 0, true);
    ctx.lineTo(cx + 56, y);
    ctx.stroke();
  };
  db(230, 330);
  db(410, 330);
  ctx.lineWidth = 3;
  ctx.setLineDash([2, 10]);
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
  line(320, 100, 160, 180);
  line(320, 100, 320, 180);
  line(320, 100, 480, 180);
  line(160, 240, 230, 316);
  line(320, 240, 230, 316);
  line(480, 240, 410, 316);
  ctx.setLineDash([]);
};

const drawConfluence: Draw = (ctx) => {
  const rows = [
    [0, 150],
    [1, 170],
    [1, 130],
    [1, 190],
    [2, 120],
    [1, 150],
    [2, 140],
  ];
  ctx.lineWidth = 3.5;
  let y = 44;
  const baseX = 170;
  rows.forEach(([depth, w], i) => {
    const x = baseX + depth * 48;
    // doc icon
    roundRect(ctx, x, y, 26, 32, 5);
    ctx.stroke();
    roundRect(ctx, x + 6, y + 10, 14, 4, 2);
    ctx.fill();
    roundRect(ctx, x + 6, y + 18, 10, 4, 2);
    ctx.fill();
    roundRect(ctx, x + 42, y + 11, w, 11, 5.5);
    ctx.fill();
    if (depth > 0) {
      ctx.beginPath();
      ctx.moveTo(x - 30, y + 16);
      ctx.lineTo(x - 8, y + 16);
      ctx.stroke();
    }
    if (i === 0) {
      ctx.beginPath();
      ctx.moveTo(baseX + 18, y + 38);
      ctx.lineTo(baseX + 18, 44 + 5 * 52 + 16);
      ctx.stroke();
    }
    y += 52;
  });
};

const drawRoadmap: Draw = (ctx) => {
  ctx.lineWidth = 3;
  // axis
  ctx.beginPath();
  ctx.moveTo(70, 370);
  ctx.lineTo(580, 370);
  ctx.stroke();
  for (let i = 0; i <= 6; i++) {
    ctx.beginPath();
    ctx.moveTo(70 + i * 85, 362);
    ctx.lineTo(70 + i * 85, 378);
    ctx.stroke();
  }
  const bars: [number, number, number][] = [
    [70, 60, 200],
    [150, 120, 150],
    [240, 180, 180],
    [300, 240, 170],
    [400, 300, 160],
  ];
  bars.forEach(([x, y, w]) => {
    roundRect(ctx, x, y, w, 30, 15);
    ctx.fill();
  });
  // milestones
  [
    [290, 45],
    [440, 225],
    [570, 285],
  ].forEach(([x, y]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-9, -9, 18, 18);
    ctx.restore();
  });
};

const drawJira: Draw = (ctx) => {
  ctx.lineWidth = 3.5;
  const cols = [
    [60, 4],
    [250, 3],
    [440, 2],
  ];
  cols.forEach(([x, cards]) => {
    roundRect(ctx, x, 36, 140, 12, 6);
    ctx.fill();
    for (let c = 0; c < cards; c++) {
      const y = 70 + c * 88;
      roundRect(ctx, x, y, 150, 74, 12);
      ctx.stroke();
      roundRect(ctx, x + 16, y + 18, 96, 9, 4.5);
      ctx.fill();
      roundRect(ctx, x + 16, y + 36, 60, 9, 4.5);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 128, y + 54, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
};

/* ---------------- factory ---------------- */

export function buildShapes(names: ShapeName[], n: number, opts?: { palette?: string[] }): Shape[] {
  const cache = new Map<ShapeName, Shape>();
  return names.map((name, idx) => {
    const hit = cache.get(name);
    if (hit) return hit;
    const rng = mulberry32(1337 + idx * 7919);
    let shape: Shape;
    switch (name) {
      case "voice":
        shape = voice(n, rng);
        break;
      case "swarm":
        shape = swarm(n, rng);
        break;
      case "research":
        shape = research(n, rng);
        break;
      case "transcript":
        shape = sample(n, rng, drawTranscript);
        break;
      case "prd":
        shape = sample(n, rng, drawPrd);
        break;
      case "brand":
        shape = sample(n, rng, makeDrawBrand(opts?.palette ?? []));
        break;
      case "engineering":
        shape = sample(n, rng, drawEngineering);
        break;
      case "confluence":
        shape = sample(n, rng, drawConfluence);
        break;
      case "roadmap":
        shape = sample(n, rng, drawRoadmap);
        break;
      case "jira":
        shape = sample(n, rng, drawJira);
        break;
    }
    cache.set(name, shape);
    return shape;
  });
}
