import type { ReactNode } from "react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

type SectionHeaderProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  subhead?: ReactNode;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  subheadClassName?: string;
};

/**
 * Standard marketing section header: eyebrow + display title + optional subhead.
 * Pass opacity-0 / reveal target classes via className props for GSAP.
 */
export function SectionHeader({
  eyebrow,
  title,
  subhead,
  className = "",
  eyebrowClassName = "",
  titleClassName = "",
  subheadClassName = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-10 max-w-3xl lg:mb-12 ${className}`}>
      <SectionEyebrow className={eyebrowClassName}>{eyebrow}</SectionEyebrow>
      <h2
        className={`font-serif-display mt-4 text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08] ${titleClassName}`}
      >
        {title}
      </h2>
      {subhead ? (
        <p
          className={`mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] ${subheadClassName}`}
        >
          {subhead}
        </p>
      ) : null}
    </div>
  );
}
