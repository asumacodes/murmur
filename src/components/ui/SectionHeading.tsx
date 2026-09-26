import type { ReactNode } from "react";

export function Eyebrow({ children, className = "", dot = false }: { children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <p className={`eyebrow inline-flex items-center gap-2 ${className}`}>
      {dot ? <span className="rec-dot text-signal" aria-hidden="true" /> : <span className="h-px w-5 bg-fg-3/60" aria-hidden="true" />}
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  sub,
  align = "left",
  id,
  className = "",
  size = "1",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  accent?: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
  size?: "1" | "2";
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-4xl ${className}`}>
      {eyebrow ? (
        <div data-reveal className={centered ? "flex justify-center" : ""}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      ) : null}
      <h2 id={id} data-reveal style={{ ["--reveal-i" as string]: 1 }} className={`${size === "1" ? "display-1" : "display-2"} balance mt-4`}>
        {title}
        {accent ? (
          <>
            {" "}
            <span className="serif-accent text-fg-2">{accent}</span>
          </>
        ) : null}
      </h2>
      {sub ? (
        <p data-reveal style={{ ["--reveal-i" as string]: 2 }} className={`lede mt-5 max-w-2xl ${centered ? "mx-auto" : ""}`}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}
