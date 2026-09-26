"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { trackRunScreenViewed } from "@/lib/analytics/events";

const SCREENS = [
  { name: "prd", label: "PRD", where: "Murmur", url: "app.trymurmur.studio" },
  { name: "competitors", label: "Competitor map", where: "Murmur", url: "app.trymurmur.studio" },
  { name: "brand", label: "Brand kit", where: "Murmur", url: "app.trymurmur.studio" },
  { name: "engineering", label: "Tech design", where: "Murmur", url: "app.trymurmur.studio" },
  { name: "jira", label: "Jira backlog", where: "Your Jira", url: "your-site.atlassian.net/jira" },
  { name: "confluence", label: "Roadmap page", where: "Your Confluence", url: "your-site.atlassian.net/wiki" },
] as const;

const SIZES: Record<string, { w: number; h: number }> = {
  jira: { w: 1398, h: 2183 },
  confluence: { w: 1800, h: 2183 },
};

/**
 * Phones: zoom into each screen's content column so the text stays readable.
 * zoom = image width ÷ frame width; shift = left offset as % of the frame.
 */
const MOBILE_CROP: Record<string, { zoom: number; shift: number }> = {
  prd: { zoom: 1.8, shift: -56 },
  competitors: { zoom: 1.8, shift: -56 },
  brand: { zoom: 1.8, shift: -56 },
  engineering: { zoom: 1.8, shift: -56 },
  jira: { zoom: 1.6, shift: 0 },
  confluence: { zoom: 1.85, shift: -60 },
};

const CYCLE_MS = 5200;

/**
 * Real screenshots of the selected run, in Murmur and in Atlassian, shown in a
 * browser frame. Each screen slowly pans down while it's on (a Ken Burns
 * scroll), and the tabs auto-advance until the visitor picks one.
 */
export function InTheApp({ slug, title }: { slug: string; title: string }) {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const screen = SCREENS[index];
  const size = SIZES[screen.name] ?? { w: 1800, h: 2250 };
  const crop = MOBILE_CROP[screen.name];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % SCREENS.length), CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [auto, visible, index]);

  function pick(i: number) {
    setAuto(false);
    setIndex(i);
    trackRunScreenViewed(slug, SCREENS[i].name);
  }

  return (
    <div ref={ref} className="card overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-line-2" />
            <span className="size-2.5 rounded-full bg-line-2" />
            <span className="size-2.5 rounded-full bg-line-2" />
          </span>
          <span className="truncate rounded-md bg-surface-3 px-2.5 py-1 font-mono text-[0.68rem] text-fg-3">{screen.url}</span>
        </div>
        <div role="tablist" aria-label={`${title}: real screens`} className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
          {SCREENS.map((s, i) => {
            const on = i === index;
            return (
              <button
                key={s.name}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => pick(i)}
                className={`relative shrink-0 overflow-hidden rounded-full px-3 py-1.5 text-[0.78rem] transition-colors ${
                  on ? "bg-fg text-bg" : "text-fg-2 hover:bg-[color-mix(in_srgb,var(--fg)_7%,transparent)] hover:text-fg"
                }`}
              >
                {s.label}
                {on && auto && visible ? (
                  <span
                    key={`${index}-bar`}
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-1 h-px origin-left bg-bg/50 [animation:tab-progress_linear_forwards]"
                    style={{ animationDuration: `${CYCLE_MS}ms` }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden bg-surface-3 sm:aspect-[16/10]">
        {/* Outer box sets the phone zoom/offset; inner box runs the entrance + pan (both use translate). */}
        <div
          style={{ ["--zoom" as string]: crop.zoom, ["--shift" as string]: `${crop.shift}%` }}
          className="absolute left-[var(--shift)] top-0 w-[calc(var(--zoom)*100%)] sm:left-0 sm:w-full"
        >
          <div key={`${slug}-${screen.name}`} className="[animation:screen-in_0.6s_var(--ease-out)_both,ken-scroll_14s_var(--ease-in-out)_0.8s_both]">
            <Image
            src={`/runs/${slug}/${screen.name}.jpg`}
            alt={`${screen.label} for ${title}, as it appears in ${screen.where}`}
            width={size.w}
            height={size.h}
            sizes="(min-width: 1320px) 1300px, 100vw"
            className="h-auto w-full"
            priority={index === 0}
          />
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />
        <p className="absolute bottom-3 left-4 flex items-center gap-2 rounded-full border border-line bg-glass px-3 py-1.5 font-mono text-[0.66rem] text-fg-2 backdrop-blur">
          <span className="size-1.5 rounded-full bg-ok" aria-hidden="true" />
          Real screen · {screen.where}
        </p>
      </div>
    </div>
  );
}
