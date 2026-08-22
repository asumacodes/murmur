"use client";

import { formatTime } from "@/lib/format/time";
import { ListenerDemoWaveform } from "@/components/scrollhero-test/listener/ListenerDemoWaveform";

/**
 * Presentation-only port of listener CaptureRecordingState
 * (components/desktop/capture/CaptureStates.tsx).
 */
type ListenerCaptureRecordingUIProps = {
  elapsedSeconds: number;
};

export function ListenerCaptureRecordingUI({
  elapsedSeconds,
}: ListenerCaptureRecordingUIProps) {
  return (
    <div className="pointer-events-none flex flex-col items-center text-center select-none">
      <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(214,59,48,0.2)] bg-[rgba(214,59,48,0.08)] px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-[var(--red-seal)] uppercase">
        <span className="size-1.5 rounded-full bg-[var(--red-seal)]" />
        Recording
      </span>

      <p
        className="font-serif-display mt-8 text-5xl tracking-tight text-[#1a1a1a] tabular-nums"
        data-sh-anchor="timer"
      >
        {formatTime(elapsedSeconds)}
      </p>

      <div className="mt-6" data-sh-anchor="waveform">
        <ListenerDemoWaveform />
      </div>

      <div
        className="mt-10 grid size-[96px] place-items-center rounded-full bg-[var(--gold)] text-white shadow-[0_8px_28px_rgba(201,169,110,0.16)]"
        data-sh-anchor="stop"
        aria-hidden="true"
      >
        <span className="block size-7 rounded-[8px] bg-white" />
      </div>

      <p className="mt-5 text-[12px] font-medium tracking-[0.16em] text-[#1a1a1a] uppercase">
        Tap to stop
      </p>
      <p className="mt-2 text-sm text-[#6b6760]">
        Take as long as you need — 15s is plenty.
      </p>
    </div>
  );
}
