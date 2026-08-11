import type { ReactNode } from "react";

export function SectionEyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-mono-text text-xs uppercase tracking-[0.15em] text-[var(--gold)] ${className}`}
    >
      {children}
    </p>
  );
}
