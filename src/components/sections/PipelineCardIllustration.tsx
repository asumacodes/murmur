import type { PipelineIllustration } from "@/content/home";

const WAVEFORM_BARS = [
  { height: "28%", delay: "0s" },
  { height: "52%", delay: "0.08s" },
  { height: "36%", delay: "0.16s" },
  { height: "68%", delay: "0.24s" },
  { height: "44%", delay: "0.32s" },
  { height: "72%", delay: "0.4s" },
  { height: "38%", delay: "0.48s" },
  { height: "58%", delay: "0.56s" },
  { height: "34%", delay: "0.64s" },
  { height: "62%", delay: "0.72s" },
  { height: "46%", delay: "0.8s" },
  { height: "30%", delay: "0.88s" },
] as const;

const shellBase =
  "pipeline-card-art relative flex items-center justify-center overflow-hidden border border-[rgba(168,163,154,0.1)]";

const shellDefault =
  "min-h-[5.5rem] flex-auto rounded-2xl bg-[linear-gradient(145deg,rgba(201,169,110,0.05),rgba(10,10,10,0.35))]";

const shellHero =
  "h-full min-h-[9.5rem] w-full flex-auto rounded-2xl bg-[linear-gradient(160deg,rgba(201,169,110,0.08),rgba(10,10,10,0.42))] lg:min-h-[12.5rem]";

const shellCompact =
  "h-[clamp(3.75rem,7vh,4.75rem)] w-[clamp(4.75rem,9vw,6.25rem)] min-h-0 shrink-0 rounded-xl bg-[linear-gradient(145deg,rgba(201,169,110,0.05),rgba(10,10,10,0.35))]";

export function PipelineCardIllustration({
  variant,
  compact = false,
  hero = false,
}: {
  variant: PipelineIllustration;
  compact?: boolean;
  hero?: boolean;
}) {
  const shellClass = [
    shellBase,
    `pipeline-card-art--${variant}`,
    hero ? `pipeline-card-art--hero ${shellHero}` : compact ? `pipeline-card-art--compact ${shellCompact}` : shellDefault,
  ].join(" ");

  const contentWidth = hero ? "w-[76%]" : compact ? "w-[82%]" : "w-[72%]";

  return (
    <div className={shellClass} aria-hidden="true">
      {variant === "capture" ? (
        <>
          <span
            className={[
              "pipeline-art-mic absolute rounded-full border border-[color-mix(in_srgb,var(--gold)_45%,transparent)] bg-[rgba(201,169,110,0.08)]",
              hero ? "left-[14%] size-[2.25rem]" : compact ? "left-[12%] size-6" : "left-[18%] size-10",
            ].join(" ")}
          />
          <div
            className={[
              "pipeline-art-waveform flex items-end gap-[0.22rem]",
              hero
                ? "h-[3.25rem] pr-[10%] pl-[24%]"
                : compact
                  ? "h-8 pr-[8%] pl-[28%]"
                  : "h-12 pr-[12%] pl-[42%]",
            ].join(" ")}
          >
            {WAVEFORM_BARS.map((bar, index) => (
              <span
                key={index}
                className="pipeline-art-bar w-[0.22rem] rounded-full bg-[color-mix(in_srgb,var(--gold-bright)_70%,transparent)] motion-reduce:animate-none"
                style={{
                  height: bar.height,
                  animation: "pipeline-art-pulse 1.8s ease-in-out infinite",
                  animationDelay: bar.delay,
                }}
              />
            ))}
          </div>
        </>
      ) : null}

      {variant === "transcript" ? (
        <div
          className={[
            "pipeline-art-lines flex flex-col",
            contentWidth,
            compact ? "gap-[0.35rem]" : "gap-[0.55rem]",
          ].join(" ")}
        >
          {[92, 78, 88, 64].map((width) => (
            <span
              key={width}
              className={[
                "pipeline-art-line block rounded-full bg-[rgba(168,163,154,0.22)]",
                compact ? "h-[0.28rem]" : "h-[0.35rem]",
              ].join(" ")}
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      ) : null}

      {variant === "research" ? (
        <div
          className={[
            "pipeline-art-search relative",
            contentWidth,
            compact ? "h-[2.75rem]" : "h-[4.5rem]",
          ].join(" ")}
        >
          <span className="pipeline-art-node absolute top-[18%] left-[8%] size-3 rounded-full border border-[color-mix(in_srgb,var(--gold)_50%,transparent)] bg-[rgba(201,169,110,0.12)]" />
          <span className="pipeline-art-node absolute top-[52%] left-[46%] size-3 rounded-full border border-[color-mix(in_srgb,var(--gold)_50%,transparent)] bg-[rgba(201,169,110,0.12)]" />
          <span className="pipeline-art-node absolute top-[22%] right-[8%] size-3 rounded-full border border-[color-mix(in_srgb,var(--gold)_50%,transparent)] bg-[rgba(201,169,110,0.12)]" />
          <span className="pipeline-art-link absolute top-[34%] left-[14%] h-px w-[34%] origin-left rotate-12 bg-[rgba(168,163,154,0.28)]" />
          <span className="pipeline-art-link absolute top-[38%] left-1/2 h-px w-[30%] -rotate-[10deg] bg-[rgba(168,163,154,0.28)]" />
        </div>
      ) : null}

      {variant === "schema" ? (
        <div className={`pipeline-art-schema flex items-center gap-3 ${contentWidth}`}>
          <span
            className={[
              "pipeline-art-brace font-mono-text text-[color-mix(in_srgb,var(--gold)_55%,transparent)]",
              compact ? "text-[1.1rem]" : "text-[1.75rem]",
            ].join(" ")}
          >
            {"{"}
          </span>
          <div className="pipeline-art-lines flex flex-1 flex-col gap-[0.55rem]">
            {[70, 54, 62].map((width) => (
              <span
                key={width}
                className="pipeline-art-line block h-[0.35rem] rounded-full bg-[rgba(168,163,154,0.22)]"
                style={{ width: `${width}%` }}
              />
            ))}
          </div>
          <span
            className={[
              "pipeline-art-brace font-mono-text text-[color-mix(in_srgb,var(--gold)_55%,transparent)]",
              compact ? "text-[1.1rem]" : "text-[1.75rem]",
            ].join(" ")}
          >
            {"}"}
          </span>
        </div>
      ) : null}

      {variant === "parallel" ? (
        <div
          className={[
            "pipeline-art-parallel grid grid-cols-2",
            hero ? "w-[76%] gap-[0.45rem]" : compact ? "w-[82%] gap-[0.3rem]" : "w-[78%] gap-2",
          ].join(" ")}
        >
          {["Brand", "Jira", "Confluence", "Eng"].map((label) => (
            <span
              key={label}
              className={[
                "pipeline-art-chip flex items-center justify-center rounded-lg border border-[rgba(168,163,154,0.16)] bg-[rgba(201,169,110,0.06)] font-mono-text uppercase tracking-[0.08em] text-[var(--text-tertiary)]",
                hero
                  ? "min-h-7 text-[0.52rem]"
                  : compact
                    ? "min-h-[1.35rem] text-[0.48rem]"
                    : "min-h-9 text-[0.58rem]",
              ].join(" ")}
            >
              {label}
            </span>
          ))}
        </div>
      ) : null}

      {variant === "brand" ? (
        <div className={`pipeline-art-swatches flex gap-[0.55rem] ${contentWidth}`}>
          <span className="pipeline-art-swatch h-[3.25rem] flex-1 rounded-[0.55rem] border border-[rgba(168,163,154,0.14)] bg-[rgba(201,169,110,0.35)]" />
          <span className="pipeline-art-swatch h-[3.25rem] flex-1 rounded-[0.55rem] border border-[rgba(168,163,154,0.14)] bg-[rgba(168,163,154,0.18)]" />
          <span className="pipeline-art-swatch h-[3.25rem] flex-1 rounded-[0.55rem] border border-[rgba(168,163,154,0.14)] bg-[rgba(42,34,24,0.85)]" />
        </div>
      ) : null}

      {variant === "jira" ? (
        <div className={`pipeline-art-tickets flex flex-col gap-[0.45rem] ${contentWidth}`}>
          <span className="pipeline-art-ticket block h-[0.85rem] rounded-[0.35rem] border border-[rgba(168,163,154,0.16)] bg-[rgba(168,163,154,0.1)]" />
          <span className="pipeline-art-ticket block h-[0.85rem] w-[88%] rounded-[0.35rem] border border-[rgba(168,163,154,0.16)] bg-[rgba(168,163,154,0.1)]" />
          <span className="pipeline-art-ticket block h-[0.85rem] w-[72%] rounded-[0.35rem] border border-[rgba(168,163,154,0.16)] bg-[rgba(168,163,154,0.1)]" />
        </div>
      ) : null}

      {variant === "confluence" ? (
        <div className={`pipeline-art-pages flex gap-[0.65rem] ${contentWidth}`}>
          <span className="pipeline-art-page h-16 flex-1 rounded-[0.45rem] border border-[rgba(168,163,154,0.16)] bg-[rgba(168,163,154,0.08)]" />
          <span className="pipeline-art-page mt-[0.65rem] h-16 flex-1 rounded-[0.45rem] border border-[rgba(168,163,154,0.16)] bg-[rgba(168,163,154,0.08)]" />
        </div>
      ) : null}
    </div>
  );
}
