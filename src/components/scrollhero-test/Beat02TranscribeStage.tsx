"use client";

import { useLayoutEffect } from "react";
import { ListenerCaptureTranscriptUI } from "@/components/scrollhero-test/listener/ListenerCaptureTranscriptUI";
import { ListenerDashboardMock } from "@/components/scrollhero-test/listener/ListenerDashboardMock";

type Beat02TranscribeStageProps = {
  onLayout?: () => void;
};

/**
 * Static Listener transcript-confirm stage for scroll-hero Beat 2.
 * Shell matches CaptureLauncherModal non-edge (transcript) padding.
 */
export function Beat02TranscribeStage({ onLayout }: Beat02TranscribeStageProps) {
  useLayoutEffect(() => {
    onLayout?.();
  }, [onLayout]);

  return (
    <div
      className="beat02-transcribe-stage relative h-full w-full overflow-hidden"
      aria-hidden="true"
    >
      <ListenerDashboardMock />

      <div className="absolute inset-0 bg-[rgba(26,26,26,0.45)]" />

      <div className="absolute inset-0 flex items-center justify-center p-[4%]">
        <div className="relative w-[min(520px,54%)] rounded-3xl border border-[rgba(0,0,0,0.08)] bg-white px-8 pt-9 pb-8 shadow-[0_24px_80px_rgba(26,26,26,0.22)]">
          <span className="absolute top-[18px] right-5 text-[15px] text-[#8a8278]">
            ×
          </span>
          <ListenerCaptureTranscriptUI />
        </div>
      </div>
    </div>
  );
}
