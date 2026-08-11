import type { ReactNode } from "react";

type StepArtifactProps = {
  children: ReactNode;
  tilt?: "cw" | "ccw" | "none";
  variant?: "cream" | "dark";
  flat?: boolean;
  className?: string;
};

const tiltClass = {
  cw: "rotate-[1.75deg]",
  ccw: "-rotate-[1.75deg]",
  none: "rotate-0",
} as const;

export function StepArtifact({
  children,
  tilt = "cw",
  variant = "dark",
  flat = false,
  className = "",
}: StepArtifactProps) {
  return (
    <div
      className={`step-artifact-wrap mx-auto w-full max-w-[22rem] lg:ml-auto lg:mr-0 ${
        flat ? "" : "group/tilt"
      } ${className}`}
    >
      <div
        className={`step-artifact origin-center transition-transform duration-500 ease-[var(--ease-out)] motion-reduce:!transform-none [&_.listener]:mx-auto [&_.listener]:w-[min(280px,100%)] [&_.listener]:rotate-0 ${
          flat
            ? "rotate-0"
            : `${tiltClass[tilt]} pointer-fine:group-hover/tilt:rotate-0 pointer-fine:group-hover/tilt:scale-[1.015] pointer-fine:group-focus-within/tilt:rotate-0 pointer-fine:group-focus-within/tilt:scale-[1.015]`
        } step-artifact--${variant}`}
      >
        {children}
      </div>
    </div>
  );
}
