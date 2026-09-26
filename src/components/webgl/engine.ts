import type { Shape } from "./shapes";

/**
 * A small raw-WebGL particle engine (no three.js — zero dependency weight).
 * Particles morph between Shape formations; mid-flight they swirl on a flow
 * field so the transition reads as a flock turning, not a crossfade.
 */

const VERT = /* glsl */ `
precision highp float;
attribute vec3 aA;
attribute vec3 aB;
attribute vec4 aCA;
attribute vec4 aCB;
attribute vec4 aRand;
uniform float uMix;
uniform float uTime;
uniform float uWave;
uniform float uFlow;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform vec2 uView;
uniform vec2 uOffset;
uniform float uScale;
uniform float uDpr;
uniform float uSize;
uniform vec2 uRot;
uniform vec3 uInk;
uniform vec3 uAccent;
varying vec3 vColor;
varying float vAlpha;

vec3 flow(vec3 p, float t, float ph) {
  return vec3(
    sin(p.y * 2.3 + t * 0.9 + ph) + sin(p.z * 1.7 + t * 0.6),
    sin(p.x * 1.9 + t * 0.7 + ph * 1.3) + cos(p.z * 2.1 + t * 0.8),
    sin(p.x * 1.4 + p.y * 1.1 + t * 0.5 + ph)
  ) * 0.5;
}

void main() {
  float d = aRand.x * 0.42;
  float t = clamp((uMix - d) / 0.58, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 p = mix(aA, aB, t);
  float ph = aRand.z * 6.2831853;
  float fly = sin(3.14159265 * t);
  p += flow(p * 1.3, uTime * 0.6, ph) * fly * 0.42;
  p += flow(p * 2.0, uTime * 0.35, ph) * (0.01 + uFlow * 0.16);

  float bar = floor((p.x + 2.0) * 18.4);
  float amp = 0.4 + 0.6 * abs(sin(uTime * 2.4 + bar * 0.37) * sin(uTime * 0.95 + bar * 0.13 + 1.7));
  p.y *= mix(1.0, amp * 1.45, uWave);

  p *= uScale;

  float cy = cos(uRot.y), sy = sin(uRot.y);
  p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  float cx = cos(uRot.x), sx = sin(uRot.x);
  p = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);

  p.xy += uOffset;

  vec2 dp = p.xy - uPointer;
  float dist2 = dot(dp, dp);
  float push = uPointerStrength * exp(-dist2 * 10.0);
  p.xy += normalize(dp + vec2(1e-4)) * push * 0.22;
  p.z += push * 0.3;

  float camZ = 4.2;
  float persp = camZ / (camZ - p.z);
  gl_Position = vec4(p.xy * persp / uView, 0.0, 1.0);
  gl_PointSize = max(1.0, uSize * aRand.y * persp * uDpr);

  vec4 c = mix(aCA, aCB, t);
  vec3 base = mix(uInk, c.rgb, c.a);
  float accent = step(0.935, aRand.w) * (1.0 - c.a);
  vColor = mix(base, uAccent, accent);
  vAlpha = (0.5 + 0.5 * aRand.y) * (1.0 - 0.25 * fly) + push * 0.3;
}
`;

const FRAG = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
uniform float uOpacity;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  float a = smoothstep(0.5, 0.12, r);
  gl_FragColor = vec4(vColor * a * vAlpha * uOpacity, a * vAlpha * uOpacity);
}
`;

export type ThemeColors = {
  ink: [number, number, number];
  accent: [number, number, number];
  additive: boolean;
};

export type EngineOptions = {
  count: number;
  size?: number;
  maxDpr?: number;
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("shader");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`shader compile: ${log}`);
  }
  return sh;
}

export function readThemeColors(): ThemeColors {
  const cs = getComputedStyle(document.documentElement);
  const parse = (v: string, fallback: [number, number, number]): [number, number, number] => {
    const parts = v.trim().split(/\s+/).map(Number);
    return parts.length === 3 && parts.every(Number.isFinite)
      ? [parts[0] / 255, parts[1] / 255, parts[2] / 255]
      : fallback;
  };
  return {
    ink: parse(cs.getPropertyValue("--particle-rgb"), [0.95, 0.94, 0.92]),
    accent: parse(cs.getPropertyValue("--particle-accent-rgb"), [1, 0.35, 0.17]),
    additive: cs.getPropertyValue("--particle-blend").trim() !== "normal",
  };
}

export class MurmurationEngine {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private buf: Record<"aA" | "aB" | "aCA" | "aCB" | "aRand", WebGLBuffer>;
  private loc: Record<string, WebGLUniformLocation | null> = {};
  private attr: Record<string, number> = {};
  private shapes: Shape[] = [];
  private pairIndex = -1;
  private count: number;
  private raf = 0;
  private running = false;
  private start = performance.now();
  private dpr = 1;
  private viewX = 1;
  private viewY = 1;

  progress = 0;
  wave = 0;
  flow = 0;
  scale = 1;
  opacity = 1;
  offset: [number, number] = [0, 0];
  size: number;
  private pointer: [number, number] = [9, 9];
  private pointerTarget: [number, number] = [9, 9];
  private pointerStrength = 0;
  private pointerActive = false;
  private rot: [number, number] = [0, 0];
  private rotTarget: [number, number] = [0, 0];
  autoSway = true;
  private theme: ThemeColors = { ink: [1, 1, 1], accent: [1, 0.35, 0.17], additive: true };
  private maxDpr: number;
  onFrame?: (time: number) => void;

  constructor(private canvas: HTMLCanvasElement, opts: EngineOptions) {
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error("webgl unavailable");
    this.gl = gl;
    this.count = opts.count;
    this.size = opts.size ?? 2.2;
    this.maxDpr = opts.maxDpr ?? 2;

    const program = gl.createProgram();
    if (!program) throw new Error("program");
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`link: ${gl.getProgramInfoLog(program)}`);
    }
    this.program = program;
    gl.useProgram(program);

    const mk = () => {
      const b = gl.createBuffer();
      if (!b) throw new Error("buffer");
      return b;
    };
    this.buf = { aA: mk(), aB: mk(), aCA: mk(), aCB: mk(), aRand: mk() };
    for (const name of ["aA", "aB", "aCA", "aCB", "aRand"]) {
      this.attr[name] = gl.getAttribLocation(program, name);
    }
    for (const name of [
      "uMix",
      "uTime",
      "uWave",
      "uFlow",
      "uPointer",
      "uPointerStrength",
      "uView",
      "uOffset",
      "uScale",
      "uDpr",
      "uSize",
      "uRot",
      "uInk",
      "uAccent",
      "uOpacity",
    ]) {
      this.loc[name] = gl.getUniformLocation(program, name);
    }

    // Per-particle randomness: delay, size, phase, accent flag.
    const rand = new Float32Array(this.count * 4);
    for (let i = 0; i < this.count; i++) {
      rand[i * 4] = Math.random();
      rand[i * 4 + 1] = 0.55 + Math.random() * 0.9;
      rand[i * 4 + 2] = Math.random();
      rand[i * 4 + 3] = Math.random();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf.aRand);
    gl.bufferData(gl.ARRAY_BUFFER, rand, gl.STATIC_DRAW);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    this.resize();
  }

  setTheme(theme: ThemeColors) {
    this.theme = theme;
    if (!this.running) this.draw(performance.now());
  }

  setShapes(shapes: Shape[]) {
    this.shapes = shapes;
    this.pairIndex = -1;
    this.syncPair();
  }

  private upload(name: "aA" | "aB" | "aCA" | "aCB", data: Float32Array) {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf[name]);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  }

  private syncPair() {
    if (!this.shapes.length) return;
    const max = this.shapes.length - 1;
    const p = Math.min(Math.max(this.progress, 0), max);
    const i = Math.min(Math.floor(p), Math.max(max - 1, 0));
    if (i === this.pairIndex) return;
    this.pairIndex = i;
    const a = this.shapes[i];
    const b = this.shapes[Math.min(i + 1, max)];
    this.upload("aA", a.pos);
    this.upload("aB", b.pos);
    this.upload("aCA", a.col);
    this.upload("aCB", b.col);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    // Hidden / collapsed containers report 0×0; keep the last good size.
    if (rect.width < 2 || rect.height < 2) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    const w = Math.max(1, Math.round(rect.width * this.dpr));
    const h = Math.max(1, Math.round(rect.height * this.dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.gl.viewport(0, 0, w, h);
    const aspect = rect.width / Math.max(rect.height, 1);
    // Fit the ~2.8 × 1.9 formation box inside the canvas at any aspect.
    this.viewY = Math.max(1.02, 1.5 / aspect);
    this.viewX = this.viewY * aspect;
    if (!this.running) this.draw(performance.now());
  }

  /** Pointer in CSS px relative to the canvas; null when it leaves. */
  setPointer(x: number | null, y: number | null) {
    if (x === null || y === null) {
      this.pointerActive = false;
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const nx = (x / rect.width) * 2 - 1;
    const ny = -((y / rect.height) * 2 - 1);
    this.pointerTarget = [nx * this.viewX, ny * this.viewY];
    this.rotTarget = [-ny * 0.12, nx * 0.22];
    this.pointerActive = true;
  }

  play() {
    if (this.running) return;
    this.running = true;
    const loop = (now: number) => {
      if (!this.running) return;
      this.draw(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  pause() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  renderStatic() {
    this.draw(performance.now());
  }

  private draw(now: number) {
    const gl = this.gl;
    const time = (now - this.start) / 1000;
    this.onFrame?.(time);
    this.syncPair();

    // Ease pointer + tilt.
    this.pointer[0] += (this.pointerTarget[0] - this.pointer[0]) * 0.12;
    this.pointer[1] += (this.pointerTarget[1] - this.pointer[1]) * 0.12;
    this.pointerStrength += ((this.pointerActive ? 1 : 0) - this.pointerStrength) * 0.06;
    const sway = this.autoSway ? Math.sin(time * 0.25) * 0.18 : 0;
    const target: [number, number] = this.pointerActive ? this.rotTarget : [0, sway];
    this.rot[0] += (target[0] - this.rot[0]) * 0.04;
    this.rot[1] += (target[1] - this.rot[1]) * 0.04;

    const max = Math.max(this.shapes.length - 1, 1);
    const p = Math.min(Math.max(this.progress, 0), max);
    const mix = this.shapes.length > 1 ? p - this.pairIndex : 0;

    gl.useProgram(this.program);
    if (this.theme.additive) {
      gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    } else {
      gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const bind = (name: "aA" | "aB" | "aCA" | "aCB" | "aRand", size: number) => {
      const l = this.attr[name];
      if (l < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buf[name]);
      gl.enableVertexAttribArray(l);
      gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
    };
    bind("aA", 3);
    bind("aB", 3);
    bind("aCA", 4);
    bind("aCB", 4);
    bind("aRand", 4);

    gl.uniform1f(this.loc.uMix, Math.min(Math.max(mix, 0), 1));
    gl.uniform1f(this.loc.uTime, time);
    gl.uniform1f(this.loc.uWave, this.wave);
    gl.uniform1f(this.loc.uFlow, this.flow);
    gl.uniform2f(this.loc.uPointer, this.pointer[0], this.pointer[1]);
    gl.uniform1f(this.loc.uPointerStrength, this.pointerStrength);
    gl.uniform2f(this.loc.uView, this.viewX, this.viewY);
    gl.uniform2f(this.loc.uOffset, this.offset[0], this.offset[1]);
    gl.uniform1f(this.loc.uScale, this.scale);
    gl.uniform1f(this.loc.uDpr, this.dpr);
    gl.uniform1f(this.loc.uSize, this.size);
    gl.uniform2f(this.loc.uRot, this.rot[0], this.rot[1]);
    gl.uniform3f(this.loc.uInk, ...this.theme.ink);
    gl.uniform3f(this.loc.uAccent, ...this.theme.accent);
    gl.uniform1f(this.loc.uOpacity, this.opacity);

    gl.drawArrays(gl.POINTS, 0, this.count);
  }

  destroy() {
    this.pause();
    const gl = this.gl;
    Object.values(this.buf).forEach((b) => gl.deleteBuffer(b));
    gl.deleteProgram(this.program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
