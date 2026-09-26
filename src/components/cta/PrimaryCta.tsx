"use client";

import type { ReactNode } from "react";
import { ctaMode } from "@/config/features";
import { ctaCopy } from "@/content/cta";
import { trackSignupCtaClicked, trackWaitlistCtaClicked } from "@/lib/analytics/events";
import { appHref, type AppTier } from "@/lib/appUrl";
import { useWaitlist } from "./WaitlistProvider";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.85rem] gap-2",
  md: "h-11 px-5 text-[0.95rem] gap-2.5",
  lg: "h-13 px-7 text-[1rem] gap-2.5",
};

export const primaryButtonClass =
  "group/btn relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-signal font-semibold text-on-signal transition-[transform,background-color] duration-300 ease-[var(--ease-out)] hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--signal)_86%,var(--fg))] active:translate-y-0 active:scale-[0.98]";

export const ghostButtonClass =
  "group/ghost inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-line-2 bg-transparent font-medium text-fg transition-[border-color,background-color,color] duration-300 ease-[var(--ease-out)] hover:border-fg hover:bg-fg hover:text-bg";

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The primary action everywhere. Waitlist mode opens the capture dialog;
 * signup mode hands off to the app (optionally with a pricing tier).
 */
export function PrimaryCta({
  location,
  size = "md",
  tier,
  tierLabel,
  label,
  className = "",
  fullWidth = false,
  children,
  onClick,
}: {
  location: string;
  size?: Size;
  tier?: AppTier;
  tierLabel?: string;
  label?: string;
  className?: string;
  fullWidth?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}) {
  const { open } = useWaitlist();
  const text = label ?? (ctaMode === "signup" ? ctaCopy.signup.short : ctaCopy.waitlist.short);
  const classes = `${primaryButtonClass} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`;
  const inner = (
    <>
      <span className="rec-dot" aria-hidden="true" />
      <span>{children ?? text}</span>
      <Arrow />
    </>
  );

  if (ctaMode === "signup") {
    return (
      <a
        href={appHref(tier)}
        data-magnetic={size === "lg" ? "" : undefined}
        className={classes}
        onClick={() => {
          trackSignupCtaClicked(location, { tier });
          onClick?.();
        }}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      data-magnetic={size === "lg" ? "" : undefined}
      className={classes}
      aria-haspopup="dialog"
      onClick={() => {
        trackWaitlistCtaClicked(location, { tier });
        onClick?.();
        open(location, { tier, tierLabel });
      }}
    >
      {inner}
    </button>
  );
}
