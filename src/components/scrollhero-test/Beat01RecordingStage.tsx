"use client";

import { useLayoutEffect, useRef } from "react";
import { ListenerCaptureRecordingUI } from "@/components/scrollhero-test/listener/ListenerCaptureRecordingUI";
import { ListenerDashboardMock } from "@/components/scrollhero-test/listener/ListenerDashboardMock";
import { useBeat01RecordingDemo } from "@/hooks/useBeat01RecordingDemo";

type Beat01RecordingStageProps = {
  active?: boolean;
  onLayout?: () => void;
};

export function Beat01RecordingStage({
  active = false,
  onLayout,
}: Beat01RecordingStageProps) {
  const scope = useRef<HTMLDivElement>(null);
  const { elapsedSeconds } = useBeat01RecordingDemo(scope, active);

  useLayoutEffect(() => {
    onLayout?.();
  }, [onLayout]);

  return (
    <div
      ref={scope}
      className="beat01-recording-stage relative h-full w-full overflow-hidden"
      aria-hidden="true"
    >
      <ListenerDashboardMock />

      {/* Scrim — matches listener CaptureLauncherModal overlay */}
      <div className="absolute inset-0 bg-[rgba(26,26,26,0.45)]" />

      {/* Modal shell — listener recording width (520px) scaled to stage */}
      <div className="absolute inset-0 flex items-center justify-center p-[4%]">
        <div className="relative w-[min(520px,54%)] rounded-3xl border border-[rgba(0,0,0,0.08)] bg-white px-[34px] pt-9 pb-[30px] shadow-[0_24px_80px_rgba(26,26,26,0.22)]">
          <span className="absolute top-[18px] right-5 text-[15px] text-[#8a8278]">
            ×
          </span>
          <ListenerCaptureRecordingUI elapsedSeconds={elapsedSeconds} />
        </div>
      </div>
    </div>
  );
}
