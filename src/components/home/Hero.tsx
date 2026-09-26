"use client";

import { useCallback, useRef, useState } from "react";
import { ctaMode } from "@/config/features";
import { ctaCopy } from "@/content/cta";
import { hero, heroSequence, stages } from "@/content/home";
import { FoundingChip } from "@/components/cta/FoundingChip";
import { PrimaryCta, ghostButtonClass } from "@/components/cta/PrimaryCta";
import { WaitlistForm } from "@/components/cta/WaitlistForm";
import { MurmurationCanvas, type MurmurationHandle } from "@/components/webgl/MurmurationCanvas";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const heroShapes = [...heroSequence.map((s) => s.shape), "voice" as const];

function StaticWave() {
  return (
    <div className="flex h-full items-center justify-center gap-[3px]" aria-hidden="true">
      {Array.from({ length: 40 }, (_, i) => {
        const h = 18 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.53)) * 70 * Math.exp(-((i - 20) ** 2) / 260);
        return <span key={i} className="w-[3px] rounded-full bg-fg/70" style={{ height: `${h.toFixed(1)}%` }} />;
      })}
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const onReady = useCallback(({ engine, reducedMotion }: MurmurationHandle) => {
    engine.progress = 0;
    engine.scale = window.matchMedia("(min-width: 1024px)").matches ? 1.18 : 1.08;
    if (reducedMotion) return;

    const tl = gsap.timeline({ repeat: -1, delay: 0.6 });
    tl.call(() => setStep(0));
    heroSequence.forEach((item, i) => {
      tl.to(engine, { progress: i + 1, duration: 1.55, ease: "power2.inOut" }, `+=${item.hold}`);
      // The caption changes as the flock takes off, not when it lands.
      tl.call(() => setStep((i + 1) % heroSequence.length), undefined, "<0.15");
    });
    tl.call(() => {
      engine.progress = 0;
    });
    timelineRef.current = tl;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      onLeave: () => tl.pause(),
      onEnterBack: () => tl.resume(),
    });

    return () => {
      st.kill();
      tl.kill();
      timelineRef.current = null;
    };
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(visualRef.current, {
        yPercent: 14,
        scale: 0.94,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: sectionRef },
  );

  const current = heroSequence[step];
  const stageIndex = stages.findIndex((s) => s.shape === current.shape);

  return (
    <section
      ref={sectionRef}
      id="top"
      data-cta-zone
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-10 pt-28 sm:pt-32 lg:flex lg:min-h-[min(100svh,58rem)] lg:flex-col lg:pb-8 lg:pt-32"
    >
      {/* ambient light */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[8%] h-[70vh] w-[70vh] rounded-full bg-signal opacity-[0.07] blur-[120px] dark:opacity-[0.1]" />
        <div className="dot-grid noise-mask-fade absolute inset-x-0 top-0 h-[70%] opacity-40" />
      </div>

      <div className="wrap relative flex-1 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="relative z-10 lg:col-span-7 xl:col-span-6">
          <div className="hero-fade flex flex-wrap items-center gap-2" style={{ ["--d" as string]: "0s" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-fg-2">
              <span className="rec-dot text-signal" aria-hidden="true" />
              {hero.eyebrow}
            </span>
            <span className="hidden sm:contents">
              <FoundingChip />
            </span>
          </div>

          <h1 id="hero-title" className="display-hero mt-6 sm:mt-7">
            <span className="hero-line">{hero.titleLine1}</span>
            <span className="hero-line">
              <span className="serif-accent pr-[0.06em] text-signal">{hero.titleLine2Lead}</span> {hero.titleLine2Rest}
            </span>
          </h1>

          <p className="lede hero-fade mt-6 max-w-[36rem] sm:mt-7" style={{ ["--d" as string]: "0.18s" }}>
            {hero.subhead}
          </p>

          <div className="hero-fade mt-8 max-w-[34rem]" style={{ ["--d" as string]: "0.3s" }}>
            {ctaMode === "waitlist" ? (
              <WaitlistForm location="hero" variant="hero" />
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <PrimaryCta location="hero" size="lg" label={ctaCopy.signup.button} />
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[0.85rem] text-fg-2">
                {(ctaMode === "waitlist" ? ctaCopy.waitlist.reassurance : ctaCopy.signup.reassurance).map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <svg viewBox="0 0 16 16" className="size-3.5 text-ok" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#runs" className={`${ghostButtonClass} h-9 px-4 text-[0.85rem] max-sm:hidden`}>
                <span className="relative grid size-4 place-items-center">
                  <span className="absolute inset-0 rounded-full bg-signal/30 [animation:ping-ring_1.8s_ease-out_infinite]" />
                  <svg viewBox="0 0 16 16" className="relative size-3 text-signal" fill="currentColor" aria-hidden="true">
                    <path d="M5 3.5v9l7-4.5-7-4.5z" />
                  </svg>
                </span>
                {hero.secondaryCta}
              </a>
            </div>
            <div className="mt-4 sm:hidden">
              <FoundingChip />
            </div>
          </div>
        </div>

        {/* The murmuration: its own grid column, centred on the copy, never under it */}
        <div
          ref={visualRef}
          className="relative mt-10 h-[min(72vw,400px)] sm:h-[440px] lg:col-span-5 lg:mt-0 lg:h-[min(62vh,540px)] xl:col-span-6 xl:h-[min(64vh,600px)]"
        >
          <MurmurationCanvas
            shapes={heroShapes}
            onReady={onReady}
            label="Particles forming a voice waveform, then transcript lines, a research globe, a PRD page, a brand palette and a Jira board"
            fallback={<StaticWave />}
          />
          <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 lg:bottom-3">
            <div className="glass flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line px-3.5 py-2 font-mono text-[0.72rem] text-fg-2 shadow-[var(--card-shadow)]">
              <span className="rec-dot text-signal" aria-hidden="true" />
              <span key={step} className="inline-block text-fg [animation:fade-rise_0.5s_var(--ease-out)_both]">
                {current.label}…
              </span>
              <span className="text-fg-3">
                {String(stageIndex + 1).padStart(2, "0")}/{stages.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage rail */}
      <div className="wrap relative z-10 mt-8 lg:mt-auto lg:pt-10">
        <nav aria-label="Pipeline stages" className="edge-fade-x -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] no-scrollbar xl:mx-0 xl:overflow-visible xl:px-0 xl:[mask-image:none] xl:[-webkit-mask-image:none]">
          <ol className="flex min-w-max items-center gap-1 border-t border-line pt-4 xl:min-w-0 xl:justify-between">
            {stages.map((s, i) => {
              const active = i === stageIndex;
              return (
                <li key={s.id} className="flex items-center gap-1">
                  <a
                    href="#pipeline"
                    className={`flex items-center gap-2 whitespace-nowrap rounded-full px-2.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] transition-colors duration-500 ${
                      active ? "bg-signal-soft text-fg" : "text-fg-3 hover:text-fg-2"
                    }`}
                  >
                    <span className={active ? "text-signal" : ""}>{s.n}</span>
                    {s.name}
                  </a>
                  {i < stages.length - 1 ? <span className="text-fg-3/60" aria-hidden="true">→</span> : null}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </section>
  );
}
