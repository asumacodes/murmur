"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  useRef,
  useState,
} from "react";
import {
  BrandKitPanel,
  ConfluenceSpacePanel,
  JiraBoardPanel,
} from "@/components/artifacts/ArtifactSurfaces";
import { ListenerMockup } from "@/components/mockups";
import { Container, SectionHeader } from "@/components/ui";
import {
  ARTIFACT_STAGES,
  ARTIFACT_SURFACES,
  artifacts,
  type ArtifactStage,
  type ArtifactSurface,
} from "@/content/artifacts";
import {
  trackArtifactsStageToggled,
  trackArtifactsSurfaceTabbed,
} from "@/lib/analytics/events";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";
import { focusRingClass, sectionPadClass } from "@/lib/styles";

function tabButtonClass(active: boolean) {
  return `${focusRingClass} font-mono-text rounded-[3px] px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors ${
    active
      ? "bg-[var(--gold)] text-[var(--bg-deep)]"
      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
  }`;
}

function onTabListKeyDown<T extends string>(
  event: ReactKeyboardEvent<HTMLDivElement>,
  items: readonly T[],
  current: T,
  select: (next: T) => void,
) {
  const index = items.indexOf(current);
  if (index < 0) {
    return;
  }

  let nextIndex = index;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (index + 1) % items.length;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (index - 1 + items.length) % items.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = items.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  const next = items[nextIndex]!;
  select(next);

  const tabs = event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]');
  tabs[nextIndex]?.focus();
}

export function Artifacts() {
  const sectionRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState<ArtifactStage>("capture");
  const [surface, setSurface] = useState<ArtifactSurface>("brand");

  useSectionReveal({
    scope: sectionRef,
    scrollEnter,
    groups: [
      {
        selector: ".artifacts-header > *",
        trigger: ".artifacts-header",
        from: { autoAlpha: 0, y: 40 },
        to: { duration: 0.95, stagger: 0.14, ease: PREMIUM_EASE },
      },
      {
        selector: ".artifacts-stage-toggle",
        trigger: ".artifacts-stage-toggle",
        from: { autoAlpha: 0, y: 24 },
        to: { duration: 0.8, ease: PREMIUM_EASE },
      },
      {
        selector: ".artifacts-stage-frame",
        trigger: ".artifacts-stage-frame",
        from: { autoAlpha: 0, y: 36 },
        to: { duration: 0.95, ease: PREMIUM_EASE },
      },
      {
        selector: ".artifacts-live-sample",
        trigger: ".artifacts-live-sample",
        from: { autoAlpha: 0, y: 16 },
        to: { duration: 0.7, ease: PREMIUM_EASE },
      },
    ],
  });

  function selectStage(next: ArtifactStage) {
    if (next === stage) {
      return;
    }
    setStage(next);
    trackArtifactsStageToggled(next);
  }

  function selectSurface(next: ArtifactSurface) {
    if (next === surface) {
      return;
    }
    setSurface(next);
    trackArtifactsSurfaceTabbed(next);
  }

  const liveHref = artifacts.liveSample.href;
  const liveEnabled = Boolean(liveHref);

  return (
    <section id="artifacts" ref={sectionRef} className={sectionPadClass}>
      <Container>
        <SectionHeader
          className="artifacts-header !max-w-3xl"
          eyebrowClassName="opacity-0"
          titleClassName="opacity-0"
          subheadClassName="opacity-0"
          eyebrow={artifacts.eyebrow}
          title={artifacts.title}
          subhead={artifacts.subhead}
        />

        <div
          className="artifacts-stage-toggle mt-10 inline-flex rounded-sm border border-[var(--border-subtle)] p-1 opacity-0"
          role="tablist"
          aria-label="Choose a stage"
          onKeyDown={(event) =>
            onTabListKeyDown(event, ARTIFACT_STAGES, stage, selectStage)
          }
        >
          {ARTIFACT_STAGES.map((s) => {
            const active = s === stage;
            return (
              <button
                key={s}
                type="button"
                role="tab"
                id={`artifacts-tab-${s}`}
                aria-selected={active}
                aria-controls={`artifacts-panel-${s}`}
                tabIndex={active ? 0 : -1}
                onClick={() => selectStage(s)}
                className={tabButtonClass(active)}
              >
                {artifacts.stages[s].label}
              </button>
            );
          })}
        </div>

        <div className="artifacts-stage mt-8">
          {/* Capture */}
          <div
            id="artifacts-panel-capture"
            role="tabpanel"
            aria-labelledby="artifacts-tab-capture"
            hidden={stage !== "capture"}
            className="artifacts-stage-panel"
          >
            <div className="artifacts-stage-frame opacity-0">
              <p className="font-mono-text mb-4 text-center text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                {artifacts.stages.capture.frameLabel}
              </p>
              <div className="mx-auto flex max-w-md justify-center px-2">
                <ListenerMockup animateWaveform />
              </div>
            </div>
          </div>

          {/* Artifacts */}
          <div
            id="artifacts-panel-artifacts"
            role="tabpanel"
            aria-labelledby="artifacts-tab-artifacts"
            hidden={stage !== "artifacts"}
            className="artifacts-stage-panel"
          >
            <div className="artifacts-stage-frame opacity-0">
              <p className="font-mono-text mb-4 text-center text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)] lg:text-left">
                {artifacts.stages.artifacts.frameLabel}
              </p>

              <div className="overflow-hidden rounded-md border border-[color-mix(in_srgb,var(--gold)_28%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--bg-elevated)_88%,transparent)] shadow-[0_24px_64px_rgba(0,0,0,0.28)]">
                <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-deep)_55%,transparent)] px-3 py-2.5">
                  <span className="size-2.5 rounded-full bg-[#d63b30]/70" />
                  <span className="size-2.5 rounded-full bg-[var(--gold)]/70" />
                  <span className="size-2.5 rounded-full bg-[color-mix(in_srgb,var(--text-tertiary)_50%,transparent)]" />
                  <span className="font-mono-text ml-2 truncate text-[0.6rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    murmur · {artifacts.surfaces[surface].panelTitle}
                  </span>
                </div>

                <div
                  className="flex flex-wrap gap-1 border-b border-[var(--border-subtle)] p-2"
                  role="tablist"
                  aria-label="Artifact surface"
                  onKeyDown={(event) =>
                    onTabListKeyDown(
                      event,
                      ARTIFACT_SURFACES,
                      surface,
                      selectSurface,
                    )
                  }
                >
                  {ARTIFACT_SURFACES.map((s) => {
                    const active = s === surface;
                    return (
                      <button
                        key={s}
                        type="button"
                        role="tab"
                        id={`artifacts-surface-tab-${s}`}
                        aria-selected={active}
                        aria-controls={`artifacts-surface-panel-${s}`}
                        tabIndex={active ? 0 : -1}
                        onClick={() => selectSurface(s)}
                        className={tabButtonClass(active)}
                      >
                        {artifacts.surfaces[s].label}
                      </button>
                    );
                  })}
                </div>

                <div className="min-h-[22rem]">
                  <div
                    id="artifacts-surface-panel-brand"
                    role="tabpanel"
                    aria-labelledby="artifacts-surface-tab-brand"
                    hidden={surface !== "brand"}
                  >
                    <BrandKitPanel />
                  </div>
                  <div
                    id="artifacts-surface-panel-jira"
                    role="tabpanel"
                    aria-labelledby="artifacts-surface-tab-jira"
                    hidden={surface !== "jira"}
                  >
                    <JiraBoardPanel />
                  </div>
                  <div
                    id="artifacts-surface-panel-confluence"
                    role="tabpanel"
                    aria-labelledby="artifacts-surface-tab-confluence"
                    hidden={surface !== "confluence"}
                  >
                    <ConfluenceSpacePanel />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="artifacts-live-sample mt-8 opacity-0">
          {liveEnabled && liveHref ? (
            <a
              href={liveHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${focusRingClass} ${tabButtonClass(false)} inline-flex border border-[var(--border-gold)]`}
            >
              {artifacts.liveSample.enabledLabel}
            </a>
          ) : (
            <p
              className="font-mono-text inline-flex cursor-not-allowed rounded-sm border border-[var(--border-subtle)] px-4 py-2 text-xs uppercase tracking-[0.12em] text-[var(--text-tertiary)]"
              aria-disabled="true"
            >
              {artifacts.liveSample.disabledLabel}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
