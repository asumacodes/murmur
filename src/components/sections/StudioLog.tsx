"use client";

import { useRef } from "react";
import { Container, SectionEyebrow } from "@/components/ui";
import { studioLog } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollEnter } from "@/lib/motion";

export function StudioLog() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const revealTargets = [".studio-header-line", ".log-item"];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(revealTargets, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
          ".studio-header-line",
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".studio-header",
              ...scrollEnter,
            },
          },
        );

        const entries = gsap.utils.toArray<HTMLElement>(".log-item", sectionRef.current);

        gsap.fromTo(
          entries,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".log-items-container",
              ...scrollEnter,
            },
          },
        );
    },
    { scope: sectionRef },
  );

  return (
    <section id="studio-log" ref={sectionRef} className="py-20 sm:py-24">
      <Container>
        <div className="studio-header mb-10 grid gap-6 lg:grid-cols-[0.75fr_1fr] lg:items-end">
          <div>
            <SectionEyebrow className="studio-header-line opacity-0">
              Studio log
            </SectionEyebrow>
            <h2 className="studio-header-line font-serif-display mt-4 text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.05] opacity-0">
              The traction is the build.
            </h2>
          </div>
          <p className="studio-header-line max-w-2xl text-base leading-7 text-[var(--text-secondary)] opacity-0">
            Build notes and Bridge streams will live here as the pipeline moves
            from phase 0 wiring to private beta.
          </p>
        </div>

        <div className="log-items-container divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {studioLog.map((entry) => (
            <article
              key={entry.title}
              className="log-item group grid gap-4 py-6 opacity-0 transition-[background-color,padding] duration-300 hover:-mx-4 hover:rounded-2xl hover:bg-[rgba(201,169,110,0.04)] hover:px-4 lg:grid-cols-[170px_1fr_140px] lg:items-start"
            >
              <time
                dateTime={entry.dateTime}
                className="font-mono-text text-xs uppercase tracking-[0.12em] text-[var(--gold)]"
              >
                {entry.date}
              </time>
              <div>
                <h3 className="font-serif-display text-2xl text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--gold)] sm:text-3xl">
                  {entry.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                  {entry.description}
                </p>
              </div>
              <a
                href={entry.href}
                className="focus-ring gold-link w-fit rounded-sm text-sm text-[var(--gold)]"
              >
                ↗ {entry.action} ({entry.duration})
              </a>
            </article>
          ))}
        </div>
        <a
          href="#early-access"
          className="focus-ring gold-link mt-8 inline-block rounded-sm text-sm text-[var(--gold)]"
        >
          View all updates →
        </a>
      </Container>
    </section>
  );
}
