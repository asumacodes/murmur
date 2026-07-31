import { useId } from "react";

type MurmurMarkProps = {
  className?: string;
  title?: string;
};

/** Gold waveform mark — matches favicon / app icon. */
export function MurmurMark({ className = "", title }: MurmurMarkProps) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#debc68" />
          <stop offset="50%" stopColor="#d3af5a" />
          <stop offset="100%" stopColor="#c9a44d" />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradientId})`}>
        <rect x="2" y="12" width="2.5" height="8" rx="1.25" />
        <rect x="6.5" y="9" width="2.5" height="14" rx="1.25" />
        <rect x="11" y="6" width="2.5" height="20" rx="1.25" />
        <rect x="15.5" y="3" width="2.5" height="26" rx="1.25" />
        <rect x="20" y="6" width="2.5" height="20" rx="1.25" />
        <rect x="24.5" y="9" width="2.5" height="14" rx="1.25" />
        <rect x="29" y="12" width="2.5" height="8" rx="1.25" />
      </g>
    </svg>
  );
}
