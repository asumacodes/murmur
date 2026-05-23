import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div">;

export function Container({ className = "", ...props }: ContainerProps) {
  return <div className={`murmur-container ${className}`} {...props} />;
}

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

type ButtonLinkProps = ComponentPropsWithoutRef<"a">;

export function GoldButton({ className = "", ...props }: ButtonLinkProps) {
  return (
    <a
      className={`focus-ring inline-flex items-center justify-center rounded-full bg-[var(--gold-bright)] px-5 py-3 text-sm font-semibold text-[var(--bg-deep)] transition duration-200 hover:bg-[var(--gold)] ${className}`}
      {...props}
    />
  );
}

export function GhostButton({ className = "", ...props }: ButtonLinkProps) {
  return (
    <a
      className={`focus-ring inline-flex items-center justify-center rounded-full border border-[var(--border-gold)] px-5 py-3 text-sm font-semibold text-[var(--gold)] transition duration-200 hover:border-[var(--gold)] hover:bg-[rgba(201,169,110,0.08)] ${className}`}
      {...props}
    />
  );
}

export function VersionChip({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-mono-text inline-flex rounded-full border border-[var(--border-gold)] px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--gold)] ${className}`}
    >
      v0.5
    </span>
  );
}

export function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-grid size-7 shrink-0 place-items-center rounded-full border border-[var(--border-gold)] ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 16 16" className="ml-0.5 size-2.5 fill-current text-[var(--text-primary)]">
        <path d="M4 3.5v9l8-4.5-8-4.5z" />
      </svg>
    </span>
  );
}

export function ArtifactCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-[var(--border-gold)] bg-[rgba(245,241,232,0.04)] p-5 shadow-2xl shadow-black/30 ${className}`}
    >
      <div className="font-mono-text mb-4 text-[0.68rem] uppercase tracking-[0.14em] text-[var(--gold)]">
        {title}
      </div>
      {children}
    </div>
  );
}
