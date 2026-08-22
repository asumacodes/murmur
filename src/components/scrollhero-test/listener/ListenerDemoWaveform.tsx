"use client";

/**
 * Visual stand-in for listener/WaveformVisualizer — same bar count and sizing,
 * animated via GSAP in useBeat01RecordingDemo (no mic / Web Audio API).
 */
const BAR_COUNT = 8;
const BAR_HEIGHT = 32;

export function ListenerDemoWaveform() {
  return (
    <div
      className="flex h-8 items-end justify-center gap-1.5"
      aria-hidden="true"
    >
      {Array.from({ length: BAR_COUNT }, (_, index) => (
        <span
          key={index}
          className="listener-demo-wave-bar block w-1.5 origin-bottom rounded-full bg-[var(--gold)] will-change-transform"
          style={{
            height: `${BAR_HEIGHT}px`,
            transform: "scaleY(0.35)",
          }}
        />
      ))}
    </div>
  );
}
