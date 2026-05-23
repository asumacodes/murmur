import type { ReactNode } from "react";

type StepArtifactProps = {
  children: ReactNode;
  tilt?: "cw" | "ccw" | "none";
  variant?: "cream" | "dark";
  flat?: boolean;
  className?: string;
};

export function StepArtifact({
  children,
  tilt = "cw",
  variant = "dark",
  flat = false,
  className = "",
}: StepArtifactProps) {
  return (
    <div className={`step-artifact-wrap ${flat ? "step-artifact-wrap--flat" : ""} ${className}`}>
      <div
        className={`step-artifact step-artifact--${tilt} step-artifact--${variant}`}
      >
        {children}
      </div>
    </div>
  );
}
