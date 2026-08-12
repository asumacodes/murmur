import { ArtifactCard } from "@/components/ui";

const WAVEFORM_HEIGHTS = [
  10, 16, 8, 22, 12, 26, 9, 20, 14, 24, 11, 18, 7, 21, 15, 28, 10, 17, 13, 23,
  8, 19, 12, 25, 9, 16, 11, 22, 14, 27, 10, 18, 8, 20, 13, 24,
];

function getWaveformHeight(index: number) {
  return WAVEFORM_HEIGHTS[index % WAVEFORM_HEIGHTS.length];
}

export function VoiceCaptureMockup() {
  return (
    <div className="pointer-events-none w-full" aria-hidden="true">
      <ArtifactCard title="Listener capture">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[rgba(10,10,10,0.55)] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="font-serif-display text-xl italic text-[var(--gold)] sm:text-2xl">
              listener
            </span>
            <span
              className="size-2 rounded-full bg-[var(--red-seal)] shadow-[0_0_10px_rgba(214,59,48,0.55)]"
              aria-hidden="true"
            />
          </div>

          <hr className="my-4 border-[var(--border-subtle)]/40" />

          <div className="flex items-center gap-5 sm:gap-6">
            <div className="grid size-14 shrink-0 place-items-center rounded-full border border-[var(--gold)]/50 sm:size-16">
              <span className="size-5 rounded-sm bg-[var(--red-seal)] sm:size-6" />
            </div>
            <div>
              <p className="font-mono-text text-[clamp(1.75rem,4vw,2.25rem)] leading-none tracking-[0.08em] text-[var(--text-primary)]">
                0:34
              </p>
              <p className="font-mono-text mt-2 text-[0.62rem] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                Status: capturing
              </p>
            </div>
          </div>

          <hr className="my-4 border-[var(--border-subtle)]/40" />

          <div className="flex items-center justify-between font-mono-text text-[0.62rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            <span>Mem: local</span>
            <span>dB: -42.4</span>
          </div>
        </div>
      </ArtifactCard>
    </div>
  );
}

export function HowItWorksRecordingMockup() {
  return (
    <div
      className="overflow-hidden rounded-[1.25rem] border border-[rgba(42,34,24,0.14)] bg-[#faf6ec] p-6 text-[#2a2218] shadow-[0_24px_64px_rgba(0,0,0,0.32)] sm:p-7"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center text-center">
        <div className="grid size-16 place-items-center rounded-full border border-[rgba(42,34,24,0.2)]">
          <span className="size-5 rounded-sm bg-[var(--red-seal)]" />
        </div>
        <p className="font-serif-display mt-5 text-[clamp(2rem,5vw,2.75rem)] leading-none text-[#2a2218]">
          0:34
        </p>
        <div className="mt-4 flex h-8 items-end justify-center gap-[3px]">
          {WAVEFORM_HEIGHTS.slice(0, 24).map((height, index) => (
            <span
              key={index}
              className="how-recording-bar origin-bottom will-change-transform w-[3px] rounded-full bg-[#2a2218]/70"
              style={{ height: `${Math.max(6, height * 0.55)}px` }}
            />
          ))}
        </div>
        <p className="font-mono-text mt-5 text-[0.62rem] uppercase tracking-[0.16em] text-[#6b6760]">
          Listener · recording
        </p>
      </div>
    </div>
  );
}

export function ListenerMockup({
  compact = false,
  animateWaveform = false,
  tall = false,
}: {
  compact?: boolean;
  animateWaveform?: boolean;
  tall?: boolean;
}) {
  const barCount = compact ? 28 : 36;

  return (
    <div
      className={[
        "listener listener-classic pointer-events-none relative z-[1] mx-auto origin-center -rotate-[2deg]",
        tall ? "listener-tall w-[min(360px,100%)]" : "w-[min(340px,100%)]",
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="listener-bezel lc-bezel rounded-[44px] border border-[rgba(201,169,110,0.55)] bg-[#f5f1e8] p-[14px]">
        <div
          className="listener-screen lc-screen relative flex aspect-[390/844] flex-col overflow-hidden rounded-[32px] bg-[#faf6ec] px-5 pt-4 pb-[22px] text-[#2a2218] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_20%,rgba(201,169,110,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(201,169,110,0.06),transparent_50%)] before:content-['']"
        >
          <div className="ls-statusbar relative mb-4 flex items-center justify-between text-sm font-semibold text-[#2a2218]">
            <span>9:41</span>
            <span className="ls-status-right inline-flex items-center gap-1.5 text-[#2a2218]">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                <path
                  d="M0 8 H2 V10 H0 Z M3 6 H5 V10 H3 Z M6 4 H8 V10 H6 Z M9 2 H11 V10 H9 Z M12 0 H14 V10 H12 Z"
                  fill="currentColor"
                />
              </svg>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                <path
                  d="M7 9.5C7 9.5 1 5 1 3.2C1 1.8 2.1 1 3.2 1C4.5 1 5.5 1.7 7 3.2C8.5 1.7 9.5 1 10.8 1C11.9 1 13 1.8 13 3.2C13 5 7 9.5 7 9.5Z"
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
              <span className="ls-batt relative inline-block h-[11px] w-[22px] rounded-[2.5px] border border-[#2a2218] p-px before:block before:h-full before:w-[70%] before:rounded-[1px] before:bg-[#2a2218] before:content-[''] after:absolute after:top-[3px] after:-right-[3px] after:h-[3px] after:w-0.5 after:rounded-r-sm after:bg-[#2a2218] after:content-['']" />
            </span>
          </div>

          <div className="lc-header font-serif-display flex items-baseline gap-1.5">
            <span className="lc-brand text-[22px] tracking-[-0.01em] text-[var(--gold)] italic">
              Listener
            </span>
            <span className="lc-mode font-mono-text text-[10px] tracking-[0.15em] text-[#6b6760] uppercase">
              ·&nbsp; recording
            </span>
          </div>

          <div className="lc-stage relative flex flex-1 flex-col items-center justify-center gap-3.5 py-5">
            <button
              type="button"
              className="lc-ring relative flex size-[130px] cursor-default items-center justify-center rounded-full border-2 border-[var(--gold)] bg-transparent outline-none before:absolute before:-inset-2 before:rounded-full before:border before:border-[rgba(201,169,110,0.35)] before:content-['']"
              tabIndex={-1}
              aria-label="Stop recording"
            >
              <span className="lc-square block size-8 rounded-[3px] bg-[var(--red-seal)] shadow-[0_0_0_1px_rgba(214,59,48,0.25),0_0_20px_rgba(214,59,48,0.2)]" />
              <span
                className="lc-pulse absolute -inset-0.5 rounded-full border-2 border-[var(--red-seal)] opacity-0 motion-reduce:animate-none"
                style={{ animation: "listener-ringpulse 2s var(--ease-out) infinite" }}
              />
            </button>
            <div
              className="lc-timer font-serif-display mt-2 inline-flex items-baseline gap-[0.06em] text-[clamp(2.15rem,7vw,3.25rem)] leading-none font-normal tracking-[0.02em] text-[#2a2218] [font-feature-settings:'lnum'_1,'tnum'_1] [font-variant-numeric:lining-nums_tabular-nums]"
              aria-hidden="true"
            >
              <span className="lc-timer-min">0</span>
              <span className="lc-timer-colon px-[0.04em] text-[#2a2218]">:</span>
              <span className="lc-timer-sec">34</span>
            </div>
            <div className="lc-caption font-mono-text text-[10px] tracking-[0.1em] text-[#6b6760] uppercase">
              tap to stop &nbsp;·&nbsp; auto-saves locally
            </div>

            <div className="lc-waveform mt-1.5 flex h-9 items-center justify-center gap-[2.5px]" aria-hidden="true">
              {Array.from({ length: barCount }).map((_, index) => (
                <span
                  key={index}
                  className={`lc-waveform-bar w-[3px] rounded-full ${
                    index % 2 === 0 ? "lc-waveform-bar-dark bg-[#2a2218]" : "lc-waveform-bar-gold bg-[var(--gold)]"
                  } ${animateWaveform ? "waveform-bar" : ""}`}
                  style={{ height: `${getWaveformHeight(index)}px` }}
                />
              ))}
            </div>
          </div>

          <div className="lc-foot flex flex-col gap-2 border-t border-[rgba(42,34,24,0.12)] pt-3.5">
            <div className="lc-foot-row font-mono-text grid grid-cols-[auto_1fr_auto] items-center gap-2.5 text-[10.5px] text-[#6b6760]">
              <span
                className="dot dot-rec listener-status-dot size-[7px] rounded-full bg-[var(--red-seal)] motion-reduce:animate-none"
                style={{ animation: "listener-blink 1.4s ease-in-out infinite" }}
              />
              <span className="lc-foot-label text-[10px] tracking-[0.12em] text-[#2a2218] uppercase">
                capturing voice memo
              </span>
              <span className="lc-foot-meta text-[10px] tracking-[0.04em] text-[#8a8278]">
                local · 48 kHz
              </span>
            </div>
            <div className="lc-foot-row font-mono-text grid grid-cols-[auto_1fr_auto] items-center gap-2.5 text-[10.5px] text-[#6b6760]">
              <span className="dot dot-q listener-whisper-dot box-border size-[7px] rounded-full border border-[var(--gold)] bg-transparent" />
              <span className="lc-foot-label text-[10px] tracking-[0.12em] text-[#2a2218] uppercase">
                whisper queued
              </span>
              <span className="lc-foot-meta text-[10px] tracking-[0.04em] text-[#8a8278]">
                on stop
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TranscriptMockup() {
  return (
    <div
      className="overflow-hidden rounded-[1.25rem] border border-[rgba(42,34,24,0.14)] bg-[#faf6ec] p-6 text-[#2a2218] shadow-[0_24px_64px_rgba(0,0,0,0.32)] sm:p-7"
      aria-hidden="true"
    >
      <p className="font-mono-text text-[0.62rem] uppercase tracking-[0.14em] text-[#6b6760]">
        Transcription · EN
      </p>
      <p className="mt-5 font-serif-display text-[1.05rem] leading-[1.65] text-[#2a2218] sm:text-[1.1rem]">
        I want to build a calm app for founders who only have a messy voice memo and no time to
        write a spec.
        <span className="bg-[rgba(232,168,32,0.22)]">
          {" "}
          Everything else can wait until tomorrow.
        </span>
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 font-mono-text text-[0.58rem] uppercase tracking-[0.12em] text-[#6b6760]">
        <span>34 sec · 28 words</span>
        <span>Apr 24, 9:42</span>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-[rgba(42,34,24,0.1)] pt-4">
        <span className="font-mono-text text-[0.62rem] uppercase tracking-[0.12em] text-[#6b6760]">
          Copy
        </span>
        <span className="rounded-sm bg-[var(--gold-bright)] px-3 py-1.5 font-mono-text text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-[#2a2218]">
          New recording
        </span>
      </div>
    </div>
  );
}

export function ResearchMockup() {
  const items = [
    {
      title: "Voice transcription tools",
      quote: "...live transcription with AI summary; no PRD or scaffolding stage...",
    },
    {
      title: "Doc generators",
      quote: "...works from typed input; no voice-first capture surface...",
    },
    {
      title: "Code-first generators",
      quote: "...skip planning, jump to UI; no PRD or research stage...",
    },
  ];

  return (
    <div
      className="overflow-hidden rounded-[1.25rem] border border-[color-mix(in_srgb,var(--gold)_28%,var(--border-subtle))] bg-[rgba(10,10,10,0.78)] p-5 text-[var(--text-primary)] shadow-[0_24px_64px_rgba(0,0,0,0.32)] sm:p-6"
      aria-hidden="true"
    >
      {items.map((item) => (
        <div
          key={item.title}
          className="mt-4 border-t border-[rgba(201,169,110,0.12)] pt-4 first:mt-0 first:border-t-0 first:pt-0"
        >
          <p className="font-serif-display text-[1.05rem] text-[var(--text-primary)]">
            {item.title}
          </p>
          <p className="mt-2 font-serif-display text-sm italic leading-6 text-[var(--text-secondary)]">
            {item.quote}
          </p>
          <p className="font-mono-text mt-3 text-[0.58rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Category · indexed 2024-05-14
          </p>
        </div>
      ))}
      <p className="font-mono-text mt-5 text-[0.58rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
        8 more categories
      </p>
    </div>
  );
}

export function FoundationMockup() {
  return (
    <div
      className="overflow-hidden rounded-[1.25rem] border border-[color-mix(in_srgb,var(--gold)_28%,var(--border-subtle))] bg-[rgba(10,10,10,0.78)] text-[var(--text-primary)] shadow-[0_24px_64px_rgba(0,0,0,0.32)]"
      aria-hidden="true"
    >
      <div className="border-b border-[rgba(201,169,110,0.12)] bg-[#faf6ec] px-5 pb-5 pt-4 text-[#2a2218]">
        <p className="font-mono-text text-[0.58rem] uppercase tracking-[0.12em] text-[#6b6760]">
          PRD.md v1 · validated
        </p>
        <p className="font-serif-display mt-2 text-xl">Murmur · product requirements</p>
        <div className="mt-4 space-y-2">
          <div className="h-1 rounded bg-[#2a2218]/10" />
          <div className="h-1 w-4/5 rounded bg-[#2a2218]/10" />
          <div className="h-1 w-3/5 rounded bg-[#2a2218]/10" />
        </div>
        <p className="font-mono-text mt-4 text-[0.58rem] uppercase tracking-[0.12em] text-[#6b6760]">
          Goals · non-goals · constraints · open questions
        </p>
      </div>
      <div className="grid gap-4 px-5 pb-5 pt-4 sm:grid-cols-2">
        <div>
          <p className="font-mono-text text-[0.58rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Brand kit
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {["#0a0a0a", "#faf6ec", "#c9a96e", "#d63b30"].map((color) => (
              <span
                key={color}
                className="aspect-square rounded-sm border border-[rgba(201,169,110,0.15)]"
                style={{ background: color }}
              />
            ))}
          </div>
          <p className="font-mono-text mt-3 text-[0.58rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Murmur · brand kit
          </p>
        </div>
        <div>
          <p className="font-mono-text text-[0.58rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Jira board
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 font-mono-text text-[0.5rem] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
            {["Backlog", "In progress", "Done"].map((column) => (
              <div key={column}>
                <p>{column}</p>
                <div className="mt-2 space-y-1.5">
                  <div className="h-1 rounded bg-[var(--gold-faint)]" />
                  <div className="h-1 w-2/3 rounded bg-[var(--border-gold)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Step 05 — honest handoff package (not a fake Murmur deploy). */
export function HandoffMockup() {
  return (
    <div
      className="overflow-hidden rounded-[1.25rem] border border-[color-mix(in_srgb,var(--gold)_28%,var(--border-subtle))] bg-[rgba(10,10,10,0.92)] text-[var(--text-primary)] shadow-[0_24px_64px_rgba(0,0,0,0.32)]"
      aria-hidden="true"
    >
      <div className="flex items-center gap-2 border-b border-[rgba(201,169,110,0.12)] px-4 py-3">
        <span className="size-2 rounded-full bg-[rgba(168,163,154,0.35)]" />
        <span className="size-2 rounded-full bg-[rgba(168,163,154,0.35)]" />
        <span className="size-2 rounded-full bg-[rgba(168,163,154,0.35)]" />
        <p className="font-mono-text ml-2 text-[0.58rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
          Murmur · handoff
        </p>
      </div>
      <div className="space-y-2.5 px-5 py-4 font-mono-text text-[0.72rem] leading-6 text-[var(--text-secondary)]">
        <p>
          <span className="text-[var(--gold)]">$</span> murmur package --for sprintzero
        </p>
        <p className="text-[var(--gold)]">✓ PRD.md validated</p>
        <p className="text-[var(--gold)]">✓ brand kit · palette + type</p>
        <p className="text-[var(--gold)]">✓ Jira board + Confluence space</p>
        <p className="text-[var(--gold)]">✓ research brief attached</p>
        <p className="pt-1 text-[var(--text-primary)]">
          → SprintZero Studio{" "}
          <span className="text-[var(--gold-bright)] underline decoration-[var(--gold)]/40 underline-offset-2">
            awaiting kickoff
          </span>
        </p>
        <p className="pt-1 text-[var(--text-tertiary)]">foundation ready · 72h sprints from here</p>
      </div>
    </div>
  );
}

