"use client";

/**
 * Spoken-style Shotgun idea transcript (~94 words) — real product idea, not lorem.
 * Matches marketing hotspot meta: "94 words · 37s".
 */
export const SHOTGUN_TRANSCRIPT =
  "An application designed for road trips, where everyone in the car can contribute to one shared music queue. Call it Shotgun. The driver isn't the DJ — passengers add songs from their phones, vote on what plays next, and skip tracks the whole car agrees on. It syncs over Bluetooth or aux, keeps a history of the trip playlist, and works offline once songs are queued. Perfect for weekend drives and anyone tired of fighting over the aux cord. Build the queue together, keep the vibe going, and let the car decide what comes next.";

export const SHOTGUN_WORD_COUNT = SHOTGUN_TRANSCRIPT.trim().split(/\s+/).length;
export const SHOTGUN_DURATION_SECONDS = 37;

/**
 * Presentation-only port of listener CaptureTranscriptState
 * (components/desktop/capture/CaptureStates.tsx).
 */
export function ListenerCaptureTranscriptUI() {
  const meta = `${SHOTGUN_WORD_COUNT} words · ${SHOTGUN_DURATION_SECONDS}s`;

  return (
    <div className="pointer-events-none flex flex-col select-none">
      <p className="text-[11px] font-medium tracking-[0.18em] text-[#8a8278] uppercase">
        Transcript
      </p>
      <h2 className="font-serif-display mt-3 text-[26px] leading-tight text-[#1a1a1a]">
        Did we hear you right?
      </h2>

      <div
        className="mt-6 max-h-[8.5rem] w-full overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-[#fafaf7] p-4 text-left"
        data-sh-anchor="transcript"
      >
        <p className="line-clamp-5 whitespace-pre-wrap text-[15px] leading-relaxed text-[#1a1a1a]">
          {SHOTGUN_TRANSCRIPT}
        </p>
      </div>

      <div
        className="mt-3 flex w-full items-center justify-between text-xs text-[#8a8278]"
        data-sh-anchor="meta"
      >
        <span className="tracking-[0.06em] capitalize">{meta}</span>
        <span className="font-medium text-[var(--gold)]">Edit text</span>
      </div>

      <div className="mt-6 flex w-full flex-col gap-3">
        <div
          className="grid min-h-12 w-full place-items-center rounded-xl bg-[var(--gold)] text-sm font-medium text-white shadow-[0_8px_28px_rgba(201,169,110,0.16)]"
          data-sh-anchor="runpipeline"
          aria-hidden="true"
        >
          Run Pipeline →
        </div>
        <div className="grid min-h-12 w-full place-items-center rounded-xl border border-[rgba(0,0,0,0.08)] text-sm font-medium text-[#1a1a1a]">
          Re-record instead
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-[#8a8278]">
        The modal closes and the run continues in your workspace.
      </p>
    </div>
  );
}
