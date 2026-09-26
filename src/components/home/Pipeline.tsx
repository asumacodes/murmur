"use client";

import { useCallback, useRef, useState } from "react";
import { stages } from "@/content/home";
import { formatDuration, getRun, hostOf, paletteOf } from "@/content/runs";
import { clampText } from "@/components/artifacts/Artifacts";
import { MurmurationCanvas, type MurmurationHandle } from "@/components/webgl/MurmurationCanvas";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { trackPipelineStageViewed } from "@/lib/analytics/events";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const shipreel = getRun("shipreel")!;
const aavaas = getRun("aavaas")!;
const creature = getRun("creature-clash")!;
const finMatter = getRun("fin-matter")!;

const higgsfield = shipreel.research.competitors.find((c) => /higgsfield/i.test(c.name));

/** One true detail from a real run per stage. Every value is read from the run files. */
const snippets: Record<string, { run: string; body: React.ReactNode }> = {
  voice: {
    run: "ShipReel",
    body: (
      <>
        The whole ShipReel idea was a <strong className="font-medium text-fg">{formatDuration(shipreel.memoSeconds)}</strong> memo. It still came back with{" "}
        {shipreel.jira.storyCount} stories.
      </>
    ),
  },
  transcript: {
    run: "Creature Clash",
    body: (
      <>
        &ldquo;{creature.transcript.split(/(?<=\.)\s+/).find((line) => line.includes("duel of stats")) ?? creature.transcript.slice(0, 140)}
        &rdquo; Punctuated, paragraphed, and yours to correct before anything runs.
      </>
    ),
  },
  research: {
    run: "ShipReel",
    body: (
      <>
        The memo said &ldquo;Hixfield&rdquo;. Research still found{" "}
        <strong className="font-medium text-fg">{higgsfield ? hostOf(higgsfield.url) : "the right company"}</strong> and{" "}
        {shipreel.research.competitors.length - 1} others building nearby.
      </>
    ),
  },
  prd: {
    run: "Aavaas",
    body: (
      <>
        Won&apos;t have: <strong className="font-medium text-fg">{aavaas.prd.features.wont_have[0]?.title}</strong>.{" "}
        {clampText(aavaas.prd.features.wont_have[0]?.rationale, 150)}
      </>
    ),
  },
  brand: {
    run: "Aavaas",
    body: (
      <>
        &ldquo;{aavaas.brand.tagline}&rdquo; Set in {aavaas.brand.typography.heading}, on{" "}
        {paletteOf(aavaas)
          .slice(0, 3)
          .map((c) => c.hex.toUpperCase())
          .join(" / ")}
        .
      </>
    ),
  },
  engineering: {
    run: "Creature Clash",
    body: (
      <>
        LLM: <strong className="font-medium text-fg">not required</strong>. The brief chose rule-based AI trainers so every battle replays
        exactly from its seed.
      </>
    ),
  },
  confluence: {
    run: "Fin Matter",
    body: <>{finMatter.confluence.pages.join(" · ")}</>,
  },
  roadmap: {
    run: "Creature Clash",
    body: (
      <>
        {creature.roadmap.map((p) => `Phase ${p.phase}: ${p.storyCount} stories`).join(" · ")}. First up:{" "}
        {creature.roadmap[0]?.epics.slice(0, 2).join(" and ").toLowerCase()}.
      </>
    ),
  },
  jira: {
    run: "Creature Clash",
    body: (
      <>
        Project <strong className="font-mono font-medium text-fg">{creature.jira.projectKey}</strong>: {creature.jira.epicCount} epics,{" "}
        {creature.jira.storyCount} stories, created in the owner&apos;s own Jira in a {formatDuration(creature.runSeconds)} run.
      </>
    ),
  },
};

const pipelineShapes = stages.map((s) => s.shape);
const brandPalette = paletteOf(aavaas).map((c) => c.hex);

export function Pipeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const seen = useRef(new Set<number>());

  const onReady = useCallback(({ engine, reducedMotion }: MurmurationHandle) => {
    engine.progress = 0;
    engine.autoSway = true;
    engine.scale = window.matchMedia("(min-width: 1024px)").matches ? 1 : 0.96;
    const list = listRef.current;
    if (!list) return;

    const to = reducedMotion
      ? (v: number) => {
          engine.progress = Math.round(v);
          engine.renderStatic();
        }
      : gsap.quickTo(engine, "progress", { duration: 0.9, ease: "power3.out" });

    const last = stages.length - 1;
    const st = ScrollTrigger.create({
      trigger: list,
      start: "top center",
      end: "bottom center",
      onUpdate: (self) => {
        // Stage i's text is centred on screen at progress (i + 0.5) / n, so shift by
        // half a stage: raw === i exactly when stage i sits mid-viewport.
        const raw = Math.min(Math.max(self.progress * stages.length - 0.5, 0), last);
        const base = Math.floor(raw);
        const frac = raw - base;
        // Hold each formation while its stage is centred; morph in the gap between stages.
        const eased = frac < 0.35 ? 0 : frac > 0.65 ? 1 : (frac - 0.35) / 0.3;
        const target = Math.min(base + eased, last);
        to(target);
        const idx = Math.min(Math.round(raw), last);
        setActive(idx);
        if (!seen.current.has(idx)) {
          seen.current.add(idx);
          trackPipelineStageViewed(stages[idx].id, idx);
        }
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section id="pipeline" aria-labelledby="pipeline-title" className="section relative">
      <div className="wrap">
        <SectionHeading
          id="pipeline-title"
          eyebrow="The pipeline"
          title="One memo. Nine stages."
          accent="Zero blank pages."
          sub="Each stage reads everything before it: the PRD is grounded in the research, the brand in the PRD, the board in all of it. Scroll to watch one memo become a Jira board."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* sticky visual */}
          <div className="sticky top-[4.6rem] z-10 -mx-[var(--gutter)] h-[36vh] min-h-[220px] self-start border-y border-line bg-bg/85 px-[var(--gutter)] backdrop-blur-md sm:top-20 lg:top-24 lg:col-span-7 lg:mx-0 lg:h-[calc(100svh-8rem)] lg:rounded-[1.5rem] lg:border lg:bg-surface/50 lg:px-0 lg:backdrop-blur-none">
            <div className="relative h-full">
              <div className="dot-grid absolute inset-0 opacity-30 lg:rounded-[1.5rem]" aria-hidden="true" />
              <MurmurationCanvas
                shapes={pipelineShapes}
                palette={brandPalette}
                onReady={onReady}
                interactive
                density={{ desktop: 7200, mobile: 3200 }}
                label="Particles re-forming into each pipeline stage"
              />
              <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 lg:inset-x-5 lg:bottom-5">
                <div className="glass rounded-2xl border border-line px-3 py-2 shadow-[var(--card-shadow)] lg:px-4 lg:py-3">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-fg-3">
                    Stage {stages[active].n} / 0{stages.length}
                  </p>
                  <p key={active} className="font-display text-base font-semibold tracking-[-0.02em] text-fg [animation:fade-rise_0.45s_var(--ease-out)_both] lg:text-xl">
                    {stages[active].name}
                  </p>
                </div>
                <div className="hidden gap-1 lg:flex" aria-hidden="true">
                  {stages.map((s, i) => (
                    <span
                      key={s.id}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-signal" : i < active ? "w-1.5 bg-fg-2" : "w-1.5 bg-line-2"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* stage list */}
          <ol ref={listRef} className="relative lg:col-span-5">
            {stages.map((stage, i) => {
              const snip = snippets[stage.id];
              const isActive = i === active;
              return (
                <li
                  key={stage.id}
                  className={`flex min-h-[58vh] flex-col justify-center border-l py-10 pl-6 transition-colors duration-500 lg:min-h-[68vh] lg:pl-8 ${
                    isActive ? "border-signal" : "border-line"
                  }`}
                >
                  <div className={`transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-45"}`}>
                    <p className="flex items-center gap-3 font-mono text-xs text-fg-3">
                      <span className={isActive ? "text-signal" : ""}>{stage.n}</span>
                      {stage.by ? <span className="rounded-full border border-line px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.1em]">{stage.by}</span> : null}
                    </p>
                    <h3 className="display-2 mt-3">{stage.name}</h3>
                    <p className="serif-accent mt-1 text-2xl text-fg-2">{stage.output}</p>
                    <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-fg-2">{stage.body}</p>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {stage.fields.map((f) => (
                        <li key={f} className="rounded-md border border-line bg-surface px-2 py-1 font-mono text-[0.68rem] text-fg-2">
                          {f}
                        </li>
                      ))}
                    </ul>
                    {snip ? (
                      <figure className="mt-6 max-w-md rounded-2xl border border-line bg-surface/70 p-4">
                        <figcaption className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-fg-3">
                          From the {snip.run} run
                        </figcaption>
                        <p className="mt-2 text-[0.9rem] leading-relaxed text-fg-2">{snip.body}</p>
                      </figure>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
