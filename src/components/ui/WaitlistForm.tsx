"use client";

import type { FormEvent } from "react";
import type { SubscribeStatus } from "@/hooks/useSubscribeForm";
import { focusRingClass } from "@/lib/styles";

type WaitlistFormProps = {
  email: string;
  status: SubscribeStatus;
  onEmailChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  placeholder: string;
  ctaLabel: string;
  successMessage?: string;
  errorMessage?: string;
  inputId: string;
  formAriaLabel: string;
  className?: string;
  /** Layout: stacked for waitlist section, or coming-soon page variant */
  variant?: "waitlist" | "comingSoon";
};

const defaultSuccess =
  "You\u2019re on the list. We\u2019ll email you when it\u2019s live.";
const defaultError = "Something went wrong. Try again in a moment.";

export function WaitlistForm({
  email,
  status,
  onEmailChange,
  onSubmit,
  placeholder,
  ctaLabel,
  successMessage = defaultSuccess,
  errorMessage = defaultError,
  inputId,
  formAriaLabel,
  className = "",
  variant = "waitlist",
}: WaitlistFormProps) {
  const isComingSoon = variant === "comingSoon";

  if (status === "success") {
    return (
      <p
        className={
          isComingSoon
            ? `py-3 text-center text-base text-[var(--text-primary)] ${className}`
            : `font-mono-text py-3 text-center text-base tracking-[0.06em] text-[var(--gold)] ${className}`
        }
        role="status"
        aria-live="polite"
      >
        {successMessage}
      </p>
    );
  }

  return (
    <div className={className}>
      <form
        onSubmit={onSubmit}
        className={
          isComingSoon
            ? "flex w-full flex-col gap-3 sm:flex-row sm:items-stretch"
            : "mx-auto flex w-full max-w-lg flex-col items-stretch gap-3 sm:w-fit sm:max-w-full sm:flex-row sm:items-stretch"
        }
        aria-label={formAriaLabel}
      >
        <label className="sr-only" htmlFor={inputId}>
          Email address
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder={placeholder}
          disabled={status === "loading"}
          className={
            isComingSoon
              ? "h-12 w-full min-w-0 flex-1 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 text-[0.95rem] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] transition-[border-color,box-shadow] duration-200 focus:border-[var(--gold)] focus:shadow-[0_0_0_1px_color-mix(in_srgb,var(--gold)_35%,transparent)] disabled:cursor-not-allowed disabled:opacity-70"
              : "h-12 w-full min-w-0 rounded-sm border border-[color-mix(in_srgb,var(--gold)_42%,var(--border-gold))] bg-[var(--bg-elevated)] px-4 text-[0.9375rem] text-[var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none placeholder:text-[var(--text-tertiary)] transition-[border-color,box-shadow] duration-200 focus:border-[var(--gold)] focus:shadow-[0_0_0_1px_color-mix(in_srgb,var(--gold)_35%,transparent)] disabled:cursor-not-allowed disabled:opacity-65 sm:w-[min(100%,18.75rem)] sm:flex-[0_1_18.75rem]"
          }
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={
            isComingSoon
              ? `${focusRingClass} inline-flex h-12 w-full shrink-0 items-center justify-center rounded-sm bg-[var(--text-primary)] px-6 text-[0.9375rem] font-semibold text-[var(--bg-deep)] transition-[background-color] duration-200 hover:bg-[color-mix(in_srgb,var(--text-primary)_88%,var(--gold))] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[7.5rem]`
              : `${focusRingClass} inline-flex h-12 w-full shrink-0 items-center justify-center rounded-sm bg-[var(--gold-bright)] px-6 text-[0.9375rem] font-semibold tracking-[0.01em] !text-[var(--bg-deep)] transition-[background-color] duration-200 hover:bg-[var(--gold)] hover:!text-[var(--bg-deep)] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto sm:min-w-[10rem]`
          }
        >
          {status === "loading" ? "Sending…" : ctaLabel}
        </button>
      </form>

      {status === "error" ? (
        <p
          className="mt-2 text-center font-mono-text text-[0.8125rem] text-[var(--red-seal)]"
          role="alert"
          aria-live="assertive"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
