"use client";

import { sprintZero } from "@/content/home";
import { trackSprintZeroCtaClicked } from "@/lib/analytics/events";

/**
 * The handoff moment: Murmur's foundation → SprintZero's 72-hour build → live.
 * An inverse card (ink on paper, paper on ink) so it reads as a separate
 * service, not another Murmur feature.
 */
export function SprintZeroBand() {
  return (
    <section id="sprintzero" aria-labelledby="sprintzero-title" className="pb-10 pt-4">
      <div className="wrap">
        <div data-reveal className="relative isolate overflow-hidden rounded-[1.75rem] bg-fg text-bg">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(var(--bg)_1px,transparent_1px)] [background-size:22px_22px]"
          />
          <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14 lg:p-14">
            <div>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] opacity-60">{sprintZero.eyebrow}</p>
              <h2 id="sprintzero-title" className="display-2 mt-4">
                {sprintZero.titleLead} <span className="serif-accent">{sprintZero.titleAccent}</span>
              </h2>
              <p className="mt-5 max-w-md text-[1rem] leading-relaxed opacity-75">{sprintZero.body}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={sprintZero.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackSprintZeroCtaClicked()}
                  className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-bg px-6 font-semibold text-fg transition-[transform,background-color] duration-300 hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--bg)_88%,var(--fg))]"
                >
                  {sprintZero.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                    ↗
                  </span>
                </a>
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] opacity-60">{sprintZero.price}</span>
              </div>
            </div>

            <ol className="relative grid gap-3 sm:grid-cols-3 sm:gap-0">
              {/* the rail + a light travelling along it */}
              <span aria-hidden="true" className="absolute left-[16.6%] right-[16.6%] top-[1.35rem] hidden h-px bg-bg/20 sm:block">
                <span className="absolute -top-[3px] left-0 size-[7px] rounded-full bg-signal [animation:rail-travel_4.8s_var(--ease-in-out)_infinite]" />
              </span>
              {sprintZero.steps.map((step, i) => (
                <li key={step.name} className="relative flex gap-4 sm:flex-col sm:items-center sm:gap-0 sm:px-3 sm:text-center">
                  <span
                    className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-full border font-mono text-xs ${
                      i === 2 ? "border-signal bg-signal text-on-signal" : "border-bg/25 bg-fg"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="sm:mt-4">
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] opacity-55">{step.who}</p>
                    <p className="mt-1 font-display text-xl font-semibold tracking-[-0.02em]">{step.name}</p>
                    <p className="mt-1 text-[0.85rem] leading-snug opacity-70">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
