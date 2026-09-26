"use client";

import type { ReactNode } from "react";
import { comparison } from "@/content/home";
import { formatDuration, getRun, hostOf, paletteOf, runStats } from "@/content/runs";
import { brandFontFamily } from "@/lib/brand-fonts";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CompareSlider } from "./CompareSlider";

const run = getRun("aavaas")!;

/* ---------- shared chrome for each side ---------- */

function Side({ tone, children }: { tone: "before" | "after"; children: ReactNode }) {
  const before = tone === "before";
  return (
    <div
      className={`absolute inset-0 overflow-hidden p-4 ${
        before ? "bg-bg-2 dot-grid [background-size:14px_14px]" : "bg-surface-2"
      }`}
    >
      <span
        className={`absolute top-3 z-10 rounded-full px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] ${
          before ? "left-3 border border-line bg-bg-2 text-fg-3" : "right-3 flex items-center gap-1.5 bg-signal-soft text-fg"
        }`}
      >
        {before ? (
          "By hand"
        ) : (
          <>
            <span className="rec-dot !size-1.5 text-signal" aria-hidden="true" /> Murmur
          </>
        )}
      </span>
      <div className="relative h-full pt-7">{children}</div>
    </div>
  );
}

const scribble = "h-2 rounded-full bg-fg-3/25";

/* ---------- per-dimension visuals ---------- */

const visuals: Record<string, { before: ReactNode; after: ReactNode }> = {
  research: {
    before: (
      <div className="relative h-full">
        {["best ai floor plan app", "grehyug pricing??", "reddit: vastu tools", "floorplan G2 reviews", "competitors_v2.xlsx", "Untitled"].map((t, i) => (
          <span
            key={t}
            className="absolute flex max-w-[70%] items-center gap-1.5 truncate rounded-t-md border border-b-0 border-line bg-surface px-2 py-1 text-[0.66rem] text-fg-3 line-through decoration-fg-3/40"
            style={{ left: `${4 + i * 8}%`, top: `${6 + i * 13}%`, transform: `rotate(${(i % 2 ? 1 : -1) * (1 + i)}deg)` }}
          >
            <span className="size-2 shrink-0 rounded-full bg-fg-3/30" aria-hidden="true" />
            {t}
          </span>
        ))}
      </div>
    ),
    after: (
      <ul className="grid gap-2">
        {run.research.competitors.slice(0, 3).map((c) => (
          <li key={c.name} className="flex items-center justify-between gap-2 rounded-lg border border-line bg-surface px-2.5 py-2">
            <span className="truncate text-[0.78rem] font-medium text-fg">{c.name.replace(/\s*\(.*\)$/, "")}</span>
            <span className="shrink-0 font-mono text-[0.6rem] text-fg-3">{hostOf(c.url)} ↗</span>
          </li>
        ))}
        <li className="font-mono text-[0.62rem] text-fg-3">{run.research.competitors.length} competitors · every one linked</li>
      </ul>
    ),
  },
  prd: {
    before: (
      <div className="relative h-full rounded-md border border-line bg-surface p-3">
        <p className="font-mono text-[0.6rem] text-fg-3">PRD_v3_final_FINAL.docx</p>
        <div className="mt-2 grid gap-1.5">
          {[80, 62, 90, 45, 70, 55].map((w, i) => (
            <span key={i} className={scribble} style={{ width: `${w}%` }} />
          ))}
        </div>
        <span className="absolute bottom-3 right-3 rotate-[-4deg] rounded bg-fg-3/15 px-1.5 py-0.5 text-[0.62rem] text-fg-3">scope??</span>
      </div>
    ),
    after: (
      <div className="grid gap-2">
        {(
          [
            ["Must", run.prd.features.must_have.length, "bg-signal"],
            ["Should", run.prd.features.should_have.length, "bg-fg-2"],
            ["Could", run.prd.features.could_have.length, "bg-fg-3"],
            ["Won't", run.prd.features.wont_have.length, "bg-line-2"],
          ] as const
        ).map(([k, n, c]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="w-12 font-mono text-[0.62rem] uppercase text-fg-3">{k}</span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-3">
              <span className={`block h-full rounded-full ${c}`} style={{ width: `${(n / 8) * 100}%` }} />
            </span>
            <span className="w-4 text-right font-mono text-[0.66rem] text-fg">{n}</span>
          </div>
        ))}
        <p className="mt-1 text-[0.7rem] text-fg-3">Every feature carries a rationale.</p>
      </div>
    ),
  },
  brand: {
    before: (
      <div className="relative grid h-full grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="rounded-md bg-fg-3/15" style={{ transform: `rotate(${(i % 3) - 1}deg)` }} />
        ))}
        <span className="absolute bottom-2 right-2 rotate-3 rounded bg-surface px-2 py-1 text-[0.66rem] text-fg-3 shadow-[var(--card-shadow)]">
          fix it later
        </span>
      </div>
    ),
    after: (
      <div>
        <p className="text-[1.05rem] leading-tight text-fg" style={{ fontFamily: brandFontFamily(run.brand.typography.heading), fontWeight: 600 }}>
          {run.brand.tagline}
        </p>
        <div className="mt-3 flex gap-1.5">
          {paletteOf(run).map((c) => (
            <span key={c.hex} className="h-8 flex-1 rounded-md border border-line" style={{ background: c.hex }} title={c.hex} />
          ))}
        </div>
        <p className="mt-2 font-mono text-[0.62rem] text-fg-3">
          {run.brand.typography.heading} · {run.brand.typography.body}
        </p>
      </div>
    ),
  },
  tech: {
    before: (
      <div className="relative h-full">
        <span className="absolute left-[8%] top-[10%] h-9 w-20 rounded border-2 border-dashed border-fg-3/40" />
        <span className="absolute left-[46%] top-[30%] h-9 w-24 rounded border-2 border-dashed border-fg-3/40" />
        <span className="absolute left-[18%] top-[62%] h-9 w-16 rounded-full border-2 border-dashed border-fg-3/40" />
        <span className="absolute left-[30%] top-[26%] h-px w-24 rotate-[18deg] bg-fg-3/40" />
        <span className="absolute left-[56%] top-[58%] font-serif text-3xl text-fg-3/60">?</span>
        <span className="absolute bottom-1 left-1 text-[0.66rem] text-fg-3">it&apos;s all in my head</span>
      </div>
    ),
    after: (
      <div className="grid gap-1.5">
        {run.engineering.components.slice(0, 3).map((c) => (
          <span key={c.name} className="truncate rounded-md border border-line bg-surface px-2 py-1.5 text-[0.74rem] text-fg">
            {c.name}
          </span>
        ))}
        <code className="mt-1 truncate font-mono text-[0.62rem] text-fg-3">CREATE TABLE floor_plans (…)</code>
      </div>
    ),
  },
  backlog: {
    before: (
      <div className="grid h-full grid-cols-3 gap-1.5">
        {["To do", "Doing", "Done"].map((c) => (
          <div key={c} className="rounded-md border border-dashed border-line-2 p-1.5">
            <p className="text-[0.6rem] text-fg-3">{c}</p>
            <p className="mt-6 text-center text-lg text-fg-3/60">?</p>
          </div>
        ))}
      </div>
    ),
    after: (
      <div className="grid gap-1.5">
        {run.jira.epics[1].stories.slice(0, 3).map((s) => (
          <div key={s.key} className="rounded-md border border-line bg-surface px-2 py-1.5">
            <p className="truncate text-[0.72rem] text-fg">{s.title}</p>
            <p className="mt-0.5 flex justify-between font-mono text-[0.58rem] text-fg-3">
              <span>{s.key}</span>
              <span>Phase {s.phase}</span>
            </p>
          </div>
        ))}
      </div>
    ),
  },
  workspace: {
    before: (
      <div className="flex h-full flex-col rounded-md border border-line bg-surface p-3">
        <p className="text-[0.9rem] font-semibold text-fg-3">Untitled page</p>
        <p className="mt-1 text-[0.66rem] text-fg-3">Start writing, or choose a template…</p>
        <span className="mt-auto self-start text-[0.62rem] text-fg-3/70">0 of 6 pages</span>
      </div>
    ),
    after: (
      <ul className="grid gap-1">
        {run.confluence.pages.map((p) => (
          <li key={p} className="flex items-center gap-2 text-[0.72rem] text-fg">
            <span className="grid size-4 place-items-center rounded-sm bg-[#1868db] text-[0.5rem] font-bold text-white">C</span>
            {p}
          </li>
        ))}
      </ul>
    ),
  },
};

export function Comparison() {
  const stats = runStats();
  return (
    <section id="comparison" aria-labelledby="comparison-title" className="section relative border-t border-line bg-bg-2">
      <div className="wrap">
        <SectionHeading id="comparison-title" eyebrow={comparison.eyebrow} title={comparison.title} accent={comparison.titleAccent} sub={comparison.subhead} />

        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {comparison.rows.map((row, i) => {
            const v = visuals[row.id];
            return (
              <li key={row.id} data-reveal style={{ ["--reveal-i" as string]: i % 3 }} className="card flex flex-col p-2.5">
                <CompareSlider
                  label={`${row.dimension}: drag to compare by hand with Murmur`}
                  className="h-52"
                  delay={(i % 3) * 180}
                  before={<Side tone="before">{v.before}</Side>}
                  after={<Side tone="after">{v.after}</Side>}
                />
                <div className="px-2.5 pb-2 pt-4">
                  <h3 className="text-[1.05rem] font-semibold tracking-[-0.01em] text-fg">{row.dimension}</h3>
                  <p className="mt-1.5 text-[0.88rem] leading-snug text-fg-3">
                    <span className="line-through decoration-fg-3/40">{row.manual}</span>
                  </p>
                  <p className="mt-1 text-[0.9rem] leading-snug text-fg">{row.murmur}</p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* the bottom line */}
        <div data-reveal className="card mt-4 grid overflow-hidden md:grid-cols-2">
          <div className="border-b border-line p-6 sm:p-8 md:border-b-0 md:border-r">
            <p className="eyebrow">By hand</p>
            <p className="display-3 mt-3 text-fg-3 line-through decoration-fg-3/30">{comparison.manualTotal}</p>
            <p className="mt-2 text-[0.9rem] text-fg-3">{comparison.manualNote}</p>
          </div>
          <div className="bg-signal-soft p-6 sm:p-8">
            <p className="eyebrow flex items-center gap-2 !text-fg">
              <span className="rec-dot text-signal" aria-hidden="true" /> With Murmur
            </p>
            <p className="display-3 mt-3">{comparison.murmurTotal}</p>
            <p className="mt-2 text-[0.9rem] text-fg-2">
              The four public runs took {formatDuration(stats.minRunSeconds)} to {formatDuration(stats.maxRunSeconds)}, memo to board.
            </p>
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[0.68rem] text-fg-3">Murmur side of every card: the real Aavaas run.</p>
      </div>
    </section>
  );
}
