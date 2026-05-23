import { ArtifactCard } from "@/components/ui";

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

export function ListenerMockup({
  compact = false,
  animateWaveform = false,
  tall = false,
}: {
  compact?: boolean;
  animateWaveform?: boolean;
  tall?: boolean;
}) {
  const cardMinHeight = tall
    ? "min-h-[min(500px,56svh)] sm:min-h-[min(540px,58svh)]"
    : "min-h-[440px] sm:min-h-[480px]";

  return (
    <div
      className="pointer-events-none relative mx-auto w-full max-w-[360px]"
      aria-hidden="true"
    >
      <div className="absolute inset-8 rounded-full bg-[rgba(201,169,110,0.18)] blur-3xl" />
      <div className="relative rotate-[-2deg] rounded-[2rem] border border-[rgba(201,169,110,0.6)] bg-[#f5f1e8] p-4 text-[#161410] shadow-2xl shadow-black/60">
        <div className={`flex flex-col rounded-[1.5rem] border border-[#d8c9a8] bg-[#fffaf0] p-5 ${cardMinHeight}`}>
          <div className="flex items-center justify-between">
            <span className="font-serif-display text-2xl italic text-[#8b6b27]">
              Listener
            </span>
            <span className="font-mono-text rounded-full border border-[#d8c9a8] px-3 py-1 text-[0.65rem] uppercase tracking-[0.14em]">
              local
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-6">
            <div className="grid size-36 place-items-center rounded-full border border-[#d8c9a8] bg-[#fbf0d5]">
              <div className="grid size-24 place-items-center rounded-full border border-[#c9a96e]">
                <span className="size-8 rounded-sm bg-[var(--red-seal)]" />
              </div>
            </div>
            <div className="font-mono-text mt-6 text-center text-sm text-[#6b5740]">
              0:34 · recording
            </div>
          </div>

          <div className="pb-1 pt-2">
            <div className="flex h-8 items-end justify-center gap-1 overflow-hidden px-3">
              {Array.from({ length: compact ? 16 : 24 }).map((_, index) => (
                <span
                  key={index}
                  className={`w-1 rounded-full bg-[#c9a96e] ${
                    animateWaveform ? "waveform-bar origin-bottom" : ""
                  }`}
                  style={{ height: `${10 + ((index * 13) % 18)}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TranscriptMockup() {
  return (
    <div className="pointer-events-none w-full" aria-hidden="true">
      <ArtifactCard title="Whisper transcript">
      <div className="space-y-3 text-sm leading-6 text-[var(--text-secondary)]">
        <p className="text-[var(--text-primary)]">
          &ldquo;I want to build a calm app for founders who only have a messy
          voice memo...&rdquo;
        </p>
        <p className="font-mono-text text-xs text-[var(--text-tertiary)]">
          confidence 0.94 · local first · structured text
        </p>
      </div>
      </ArtifactCard>
    </div>
  );
}

export function ResearchMockup() {
  return (
    <div className="pointer-events-none w-full" aria-hidden="true">
      <ArtifactCard title="Market signal">
      <div className="space-y-4">
        {["Voice intake tools", "AI project planners", "Founder build logs"].map(
          (item) => (
            <div key={item} className="border-l border-[var(--border-gold)] pl-4">
              <p className="text-sm text-[var(--text-primary)]">{item}</p>
              <p className="font-mono-text text-xs text-[var(--text-tertiary)]">
                source · snippet · confidence
              </p>
            </div>
          ),
        )}
      </div>
      </ArtifactCard>
    </div>
  );
}

export function FoundationMockup() {
  return (
    <div className="pointer-events-none w-full" aria-hidden="true">
      <ArtifactCard title="Project foundation">
      <div className="grid gap-3 sm:grid-cols-3">
        {["PRD", "Brand", "Jira"].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[rgba(10,10,10,0.5)] p-4"
          >
            <p className="font-serif-display text-2xl text-[var(--gold)]">
              {item}
            </p>
            <div className="mt-4 h-1 rounded bg-[var(--gold-faint)]" />
            <div className="mt-2 h-1 w-2/3 rounded bg-[var(--border-gold)]" />
          </div>
        ))}
      </div>
      </ArtifactCard>
    </div>
  );
}

export function DeployMockup() {
  return (
    <div className="pointer-events-none w-full" aria-hidden="true">
      <ArtifactCard title="Terminal">
      <div className="font-mono-text space-y-2 text-xs text-[var(--text-secondary)]">
        <p>$ murmur deploy idea-name</p>
        <p className="text-[var(--gold-bright)]">
          ✓ Deployed → idea-name.murmur.studio
        </p>
        <p className="text-[var(--text-tertiary)]">Pack C only · placeholder</p>
      </div>
      </ArtifactCard>
    </div>
  );
}
