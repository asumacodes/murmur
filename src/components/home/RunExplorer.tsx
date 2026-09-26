"use client";

import Link from "next/link";
import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  ArtifactFrame,
  BrandKit,
  clampText,
  CompetitorList,
  ConfluenceTree,
  EngineeringSummary,
  JiraBoard,
  PrdSummary,
  RoadmapPhases,
} from "@/components/artifacts/Artifacts";
import { PrimaryCta } from "@/components/cta/PrimaryCta";
import { ctaMode } from "@/config/features";
import { ctaCopy } from "@/content/cta";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InTheApp } from "./InTheApp";
import { formatDate, formatDuration, prdFeatureCount, runs, type RunExample } from "@/content/runs";
import {
  trackRunExplorerOpenedFull,
  trackRunExplorerReplayed,
  trackRunExplorerSelected,
} from "@/lib/analytics/events";

/** Artifact order follows the pipeline: … tech design → Confluence → roadmap → Jira. */
const ORDER = ["transcript", "research", "prd", "brand", "engineering", "confluence", "roadmap", "jira"] as const;
const STEP_MS = 620;

type Status = "waiting" | "writing" | "done";

function statusFor(index: number, step: number): Status {
  if (index < step) return "done";
  if (index === step) return "writing";
  return "waiting";
}

function Skeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="grid gap-2.5" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="skeleton-shimmer h-3 rounded-full bg-surface-3" style={{ width: `${88 - ((i * 17) % 40)}%` }} />
      ))}
    </div>
  );
}

function Reveal({ status, lines, children }: { status: Status; lines?: number; children: React.ReactNode }) {
  if (status === "waiting") return <Skeleton lines={lines} />;
  return <div className="[animation:fade-rise_0.6s_var(--ease-out)_both]">{children}</div>;
}

function Transcript({ run, status, playKey }: { run: RunExample; status: Status; playKey: number }) {
  const excerpt = clampText(run.transcript, 520);
  const words = excerpt.split(/\s+/);
  const animate = status === "writing";
  return (
    <div className="relative">
      <p className="text-[0.92rem] leading-relaxed text-fg-2 max-sm:line-clamp-[8]" key={playKey}>
        <span className="mr-1 text-signal">“</span>
        {words.map((w, i) => (
          <span
            key={i}
            className={animate ? "[animation:fade-rise_0.35s_var(--ease-out)_both]" : undefined}
            style={animate ? { animationDelay: `${i * 7}ms` } : undefined}
          >
            {w}{" "}
          </span>
        ))}
        <span className="text-signal">”</span>
      </p>
      <p className="mt-3 font-mono text-[0.68rem] text-fg-3">
        {formatDuration(run.memoSeconds, "clock")} memo · {run.slug === "fin-matter" ? "excerpt" : "unedited"}
      </p>
    </div>
  );
}

export function RunExplorer() {
  const [active, setActive] = useState(0);
  const [step, setStep] = useState<number>(ORDER.length);
  const [playKey, setPlayKey] = useState(0);
  const timer = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const started = useRef(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const run = runs[active];

  const play = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPlayKey((k) => k + 1);
    if (reduce) {
      setStep(ORDER.length);
      return;
    }
    setStep(0);
    timer.current = window.setInterval(() => {
      setStep((s) => {
        if (s >= ORDER.length) {
          if (timer.current) window.clearInterval(timer.current);
          return s;
        }
        return s + 1;
      });
    }, STEP_MS);
  }, []);

  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);

  // First replay when the section scrolls into view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          trackRunExplorerSelected(runs[0].slug, "auto");
          play();
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  function select(index: number, method: "click" | "keyboard") {
    if (index === active) {
      trackRunExplorerReplayed(runs[index].slug);
    } else {
      trackRunExplorerSelected(runs[index].slug, method);
    }
    setActive(index);
    started.current = true;
    play();
  }

  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let next = active;
    if (event.key === "ArrowRight") next = (active + 1) % runs.length;
    if (event.key === "ArrowLeft") next = (active - 1 + runs.length) % runs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = runs.length - 1;
    select(next, "keyboard");
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  const s = (key: (typeof ORDER)[number]) => statusFor(ORDER.indexOf(key), step);
  const done = step >= ORDER.length;

  return (
    <section ref={sectionRef} id="runs" aria-labelledby="runs-title" className="section relative">
      <div className="wrap">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="runs-title"
            eyebrow="Real runs · unedited output"
            title="Don't take our word for it."
            accent="Open a real run."
            sub="Four ideas, recorded as voice memos, run through Murmur. Everything below is what came back, straight from the app. Pick one and watch it build."
          />
        </div>

        {/* run picker */}
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Example runs"
          onKeyDown={onTabKey}
          className="no-scrollbar -mx-[var(--gutter)] mt-10 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1"
        >
          {runs.map((r, i) => {
            const selected = i === active;
            return (
              <button
                key={r.slug}
                type="button"
                role="tab"
                id={`run-tab-${r.slug}`}
                aria-selected={selected}
                aria-controls="run-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i, "click")}
                className={`group flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color,transform] duration-300 active:scale-[0.98] ${
                  selected ? "border-fg/40 bg-surface-2 shadow-[var(--card-shadow)]" : "border-line bg-surface/40 hover:border-line-2"
                }`}
              >
                <span className="flex -space-x-1.5" aria-hidden="true">
                  {[r.brand.colorPalette.primary, r.brand.colorPalette.accent, r.brand.colorPalette.secondary].map((c) => (
                    <span key={c} className="size-4 rounded-full ring-2 ring-surface" style={{ background: c }} />
                  ))}
                </span>
                <span>
                  <span className="block text-[0.95rem] font-medium leading-tight text-fg">{r.title.split(":")[0]}</span>
                  <span className="block font-mono text-[0.66rem] uppercase tracking-[0.08em] text-fg-3">{r.category}</span>
                </span>
              </button>
            );
          })}
          <PrimaryCta location="run_explorer" size="md" className="!h-auto shrink-0 rounded-2xl px-5 py-3" label={ctaMode === "signup" ? ctaCopy.signup.button : ctaCopy.waitlist.button} />
        </div>

        {/* active run */}
        <div id="run-panel" role="tabpanel" aria-labelledby={`run-tab-${run.slug}`} className="mt-6">
          <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-fg-3">
                {run.idea} · recorded {formatDate(run.recordedAt)}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-fg sm:truncate sm:text-3xl">{run.title}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                ["Memo", formatDuration(run.memoSeconds, "clock")],
                ["Run", formatDuration(run.runSeconds)],
                ["Competitors", String(run.research.competitors.length)],
                ["Stories", String(run.jira.storyCount)],
              ].map(([k, v]) => (
                <span key={k} className="rounded-xl border border-line bg-surface-2 px-3 py-2">
                  <span className="block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fg-3">{k}</span>
                  <span className="block font-display text-lg font-semibold leading-tight tracking-[-0.02em] text-fg">{v}</span>
                </span>
              ))}
              <button
                type="button"
                onClick={() => select(active, "click")}
                className="ml-1 inline-flex h-11 items-center gap-2 rounded-full border border-line-2 px-4 text-sm text-fg transition hover:border-fg-3"
              >
                <svg viewBox="0 0 16 16" className={`size-3.5 ${done ? "" : "animate-[spin-slow_1.2s_linear_infinite]"}`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M13.5 8a5.5 5.5 0 11-1.6-3.9M13.5 2.5v3h-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {done ? "Replay" : "Building…"}
              </button>
            </div>
          </div>

          <div aria-busy={!done} className="mt-4 grid gap-4 lg:grid-cols-12">
            <ArtifactFrame n="01" title="Transcript" status={s("transcript")} className="lg:col-span-5">
              <Reveal status={s("transcript")} lines={6}>
                <Transcript run={run} status={s("transcript")} playKey={playKey} />
              </Reveal>
            </ArtifactFrame>

            <ArtifactFrame n="02" title="Competitor map" meta="via live web search" status={s("research")} className="lg:col-span-7">
              <Reveal status={s("research")} lines={6}>
                <CompetitorList run={run} limit={4} />
              </Reveal>
            </ArtifactFrame>

            <ArtifactFrame n="03" title="PRD" meta={`${prdFeatureCount(run)} features · ${run.prd.features.wont_have.length} won't`} status={s("prd")} className="lg:col-span-7">
              <Reveal status={s("prd")} lines={7}>
                <PrdSummary run={run} />
              </Reveal>
            </ArtifactFrame>

            <ArtifactFrame n="04" title="Brand kit" status={s("brand")} className="lg:col-span-5">
              <Reveal status={s("brand")} lines={6}>
                <BrandKit run={run} />
              </Reveal>
            </ArtifactFrame>

            <ArtifactFrame n="05" title="Tech design" status={s("engineering")} className="lg:col-span-4">
              <Reveal status={s("engineering")} lines={6}>
                <EngineeringSummary run={run} tasks={0} />
              </Reveal>
            </ArtifactFrame>

            <ArtifactFrame n="06" title="Confluence space" status={s("confluence")} className="lg:col-span-4">
              <Reveal status={s("confluence")} lines={6}>
                <ConfluenceTree run={run} />
              </Reveal>
            </ArtifactFrame>

            <ArtifactFrame n="07" title="Roadmap" status={s("roadmap")} className="lg:col-span-4">
              <Reveal status={s("roadmap")} lines={5}>
                <RoadmapPhases run={run} />
              </Reveal>
            </ArtifactFrame>

            <ArtifactFrame n="08" title="Jira board" meta="in your own Jira" status={s("jira")} className="lg:col-span-12">
              <Reveal status={s("jira")} lines={4}>
                <JiraBoard run={run} />
              </Reveal>
            </ArtifactFrame>
          </div>

          <div className="mt-10">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="display-3">
                Same run, <span className="serif-accent text-fg-2">in the app, in Jira and in Confluence.</span>
              </h3>
              <p className="font-mono text-[0.68rem] text-fg-3">Screenshots of the real run</p>
            </div>
            <InTheApp slug={run.slug} title={run.title.split(":")[0]} />
          </div>

          <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-fg-3">
              Replay is sped up. The real run took{" "}
              <strong className="font-medium text-fg-2">{formatDuration(run.runSeconds)}</strong>, memo to board.
            </p>
            <Link
              href={`/examples/${run.slug}`}
              onClick={() => trackRunExplorerOpenedFull(run.slug)}
              className="group inline-flex items-center gap-2 text-[0.95rem] font-medium text-fg underline decoration-line-2 underline-offset-[6px] transition hover:decoration-signal"
            >
              Open the full {run.title.split(":")[0]} foundation
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
