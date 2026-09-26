"use client";

import { useEffect, useId } from "react";
import { ctaCopy } from "@/content/cta";
import { SuccessPanel } from "./SuccessPanel";
import { useWaitlistSubmit } from "./useWaitlistSubmit";

type Variant = "hero" | "dialog" | "closer";

export function WaitlistForm({
  location,
  variant = "hero",
  tier,
  role,
  autoFocus = false,
  onSuccess,
}: {
  location: string;
  variant?: Variant;
  tier?: string;
  role?: string | null;
  autoFocus?: boolean;
  onSuccess?: () => void;
}) {
  const inputId = useId();
  const errorId = useId();
  const { email, status, error, result, onEmailChange, onSubmit } = useWaitlistSubmit(location, { tier, role });

  useEffect(() => {
    if (status === "success") onSuccess?.();
  }, [status, onSuccess]);

  if (status === "success" && result) {
    return (
      <div className={variant === "dialog" ? "" : "card p-5 sm:p-6"}>
        <SuccessPanel result={result} location={location} compact={variant === "hero"} />
      </div>
    );
  }

  const isPill = variant !== "dialog";

  return (
    <form onSubmit={onSubmit} noValidate={false} aria-label="Join the Murmur waitlist" className="w-full">
      <div
        className={
          isPill
            ? "group relative flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:border sm:border-line-2 sm:bg-glass sm:p-1.5 sm:shadow-[var(--card-shadow)] sm:transition-[border-color,box-shadow] sm:duration-300 sm:focus-within:border-fg-3 sm:focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--fg)_8%,transparent)]"
            : "flex flex-col gap-2.5"
        }
      >
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          autoFocus={autoFocus}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder={ctaCopy.waitlist.placeholder}
          aria-invalid={status === "error"}
          aria-describedby={error ? errorId : undefined}
          disabled={status === "loading"}
          className={
            isPill
              ? "h-13 w-full min-w-0 rounded-full border border-line-2 bg-glass px-5 text-[0.98rem] text-fg outline-none placeholder:text-fg-3 transition focus:border-fg-3 sm:h-12 sm:flex-1 sm:border-0 sm:bg-transparent sm:pl-5 sm:focus:border-0"
              : "h-12 w-full rounded-xl border border-line-2 bg-surface-2 px-4 text-[0.98rem] text-fg outline-none placeholder:text-fg-3 transition focus:border-fg-3 focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--fg)_8%,transparent)]"
          }
        />
        <button
          type="submit"
          data-magnetic={isPill ? "" : undefined}
          disabled={status === "loading"}
          className={`group/btn relative inline-flex h-13 shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-signal px-6 text-[0.98rem] font-semibold text-on-signal transition-[transform,background-color] duration-300 hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--signal)_86%,var(--fg))] active:translate-y-0 active:scale-[0.98] disabled:opacity-70 sm:h-12 ${
            isPill ? "" : "rounded-xl"
          }`}
        >
          <span className="rec-dot text-on-signal" aria-hidden="true" />
          <span>{status === "loading" ? "Saving your spot…" : ctaCopy.waitlist.button}</span>
          <svg viewBox="0 0 16 16" className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-2.5 text-sm text-[#e5484d] sm:pl-5">
          {error}
        </p>
      ) : null}
    </form>
  );
}
