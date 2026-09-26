"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { THEME_EVENT } from "@/components/site/ThemeToggle";
import { MurmurationEngine, readThemeColors } from "./engine";
import { buildShapes, type ShapeName } from "./shapes";

export type MurmurationHandle = {
  engine: MurmurationEngine;
  shapes: ShapeName[];
  reducedMotion: boolean;
};

type Props = {
  shapes: ShapeName[];
  palette?: string[];
  density?: { desktop: number; mobile: number };
  size?: number;
  interactive?: boolean;
  className?: string;
  /** Called once the engine exists; drive `engine.progress` from here. */
  onReady?: (handle: MurmurationHandle) => void | (() => void);
  fallback?: ReactNode;
  label?: string;
};

function weightFor(shapes: ShapeName[], name: ShapeName, progress: number) {
  let w = 0;
  shapes.forEach((s, i) => {
    if (s === name) w = Math.max(w, 1 - Math.min(Math.abs(progress - i), 1));
  });
  return w;
}

export function MurmurationCanvas({
  shapes,
  palette,
  density = { desktop: 6800, mobile: 3400 },
  size,
  interactive = true,
  className = "",
  onReady,
  fallback = null,
  label,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);
  const shapesKey = shapes.join(",");
  const paletteKey = (palette ?? []).join(",");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
    const count = small || lowPower ? density.mobile : density.desktop;
    const names = shapesKey.split(",") as ShapeName[];

    let engine: MurmurationEngine | null = null;
    let disposeReady: void | (() => void);
    let visible = false;
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    const boot = () => {
      if (cancelled) return;
      try {
        engine = new MurmurationEngine(canvas, {
          count,
          size: size ?? (small ? 2.1 : 2.3),
          maxDpr: small ? 1.75 : 2,
        });
      } catch {
        setFailed(true);
        return;
      }
      const eng = engine;
      eng.setTheme(readThemeColors());
      eng.setShapes(buildShapes(names, count, { palette: paletteKey ? paletteKey.split(",") : undefined }));
      eng.onFrame = () => {
        eng.wave = weightFor(names, "voice", eng.progress);
        eng.flow = weightFor(names, "swarm", eng.progress);
      };

      const onTheme = () => eng.setTheme(readThemeColors());
      window.addEventListener(THEME_EVENT, onTheme);
      cleanups.push(() => window.removeEventListener(THEME_EVENT, onTheme));

      const ro = new ResizeObserver(() => eng.resize());
      ro.observe(canvas);
      cleanups.push(() => ro.disconnect());

      const sync = () => {
        if (reducedMotion) {
          eng.renderStatic();
          return;
        }
        if (visible && document.visibilityState === "visible") eng.play();
        else eng.pause();
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          sync();
        },
        { rootMargin: "120px" },
      );
      io.observe(canvas);
      cleanups.push(() => io.disconnect());
      document.addEventListener("visibilitychange", sync);
      cleanups.push(() => document.removeEventListener("visibilitychange", sync));

      if (interactive && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
        const host = canvas.parentElement ?? canvas;
        const onMove = (e: PointerEvent) => {
          const r = canvas.getBoundingClientRect();
          eng.setPointer(e.clientX - r.left, e.clientY - r.top);
        };
        const onLeave = () => eng.setPointer(null, null);
        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          host.removeEventListener("pointermove", onMove);
          host.removeEventListener("pointerleave", onLeave);
        });
      }

      if (process.env.NODE_ENV !== "production") {
        const w = window as unknown as { __mmEngines?: MurmurationEngine[] };
        (w.__mmEngines ??= []).push(eng);
      }
      disposeReady = onReadyRef.current?.({ engine: eng, shapes: names, reducedMotion });
      if (reducedMotion) eng.renderStatic();
      setReady(true);
    };

    // Build after first paint so the canvas never competes with LCP.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let idleId: number | null = null;
    let timeoutId: number | null = null;
    if (w.requestIdleCallback) idleId = w.requestIdleCallback(boot, { timeout: 900 });
    else timeoutId = window.setTimeout(boot, 120);

    return () => {
      cancelled = true;
      if (idleId !== null) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      if (typeof disposeReady === "function") disposeReady();
      cleanups.forEach((fn) => fn());
      engine?.destroy();
    };
  }, [shapesKey, paletteKey, density.desktop, density.mobile, size, interactive]);

  if (failed) return <>{fallback}</>;

  return (
    <canvas
      ref={canvasRef}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`block h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
