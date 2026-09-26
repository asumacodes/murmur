"use client";

import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from "react";

/**
 * Before/after reveal, after Aceternity's Compare. The "before" layer is
 * clipped to the left of the divider; the "after" layer sits underneath.
 * Fine pointers: the divider follows the cursor. Touch: drag. Keyboard: arrows.
 * On first view the divider sweeps across once so the reveal is discoverable.
 */
export function CompareSlider({
  before,
  after,
  label,
  className = "",
  delay = 0,
}: {
  before: ReactNode;
  after: ReactNode;
  label: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(96);
  const [active, setActive] = useState(false);
  const dragging = useRef(false);
  const touched = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (reduce) {
          setPos(42);
          return;
        }
        timer = window.setTimeout(() => {
          const start = performance.now();
          const from = 96;
          const to = 42;
          const step = (now: number) => {
            if (touched.current) return;
            const t = Math.min((now - start) / 1500, 1);
            const e = 1 - (1 - t) ** 4;
            setPos(from + (to - from) * e);
            if (t < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        }, delay);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [delay]);

  function setFromClientX(clientX: number) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    touched.current = true;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    const delta = event.key === "ArrowLeft" ? -5 : event.key === "ArrowRight" ? 5 : 0;
    if (!delta && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    touched.current = true;
    setPos((p) => (event.key === "Home" ? 0 : event.key === "End" ? 100 : Math.min(100, Math.max(0, p + delta))));
  }

  return (
    <div
      ref={ref}
      className={`relative select-none overflow-hidden rounded-xl border border-line [touch-action:pan-y] ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" || dragging.current) setFromClientX(e.clientX);
      }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>

      {/* divider */}
      <div className="pointer-events-none absolute inset-y-0 z-10 w-px -translate-x-1/2" style={{ left: `${pos}%` }}>
        <span className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-signal to-transparent" />
        <span className="absolute inset-y-[18%] -left-3 w-6 bg-signal/25 blur-md" />
        <div
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(100 - pos)}% of the Murmur side visible`}
          onKeyDown={onKey}
          className={`pointer-events-auto absolute left-1/2 top-1/2 grid h-9 w-6 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-line-2 bg-surface-2 text-fg-3 shadow-[var(--card-shadow)] transition-transform duration-300 ${
            active ? "scale-110" : ""
          }`}
        >
          <svg viewBox="0 0 8 16" className="h-3.5 w-2" fill="currentColor" aria-hidden="true">
            <circle cx="2" cy="4" r="1" />
            <circle cx="6" cy="4" r="1" />
            <circle cx="2" cy="8" r="1" />
            <circle cx="6" cy="8" r="1" />
            <circle cx="2" cy="12" r="1" />
            <circle cx="6" cy="12" r="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}
