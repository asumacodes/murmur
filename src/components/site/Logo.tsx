/** The Murmur mark: a five-bar voice pulse. Bars dance on hover of the parent `.group`. */
export function MurmurMark({ className = "", animated = false }: { className?: string; animated?: boolean }) {
  const bars = [
    { x: 1, h: 8 },
    { x: 6.5, h: 15 },
    { x: 12, h: 22 },
    { x: 17.5, h: 15 },
    { x: 23, h: 8 },
  ];
  return (
    <svg viewBox="0 0 27 24" className={className} aria-hidden="true">
      {bars.map((bar, i) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={(24 - bar.h) / 2}
          width="3"
          height={bar.h}
          rx="1.5"
          fill={i === 2 ? "var(--signal)" : "currentColor"}
          className={animated ? "bar-dance" : "origin-center transition-transform duration-300 group-hover:[animation:bar-dance_0.9s_ease-in-out_infinite]"}
          style={{ animationDelay: `${(i * 0.11).toFixed(2)}s`, transformOrigin: "center", transformBox: "fill-box" }}
        />
      ))}
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`group inline-flex items-center gap-2 ${className}`}>
      <MurmurMark className="h-5 w-auto text-fg" />
      <span className="font-display text-[1.35rem] font-semibold leading-none tracking-[-0.04em] text-fg">
        murmur
      </span>
    </span>
  );
}
