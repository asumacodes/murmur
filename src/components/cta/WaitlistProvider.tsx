"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ctaMode } from "@/config/features";
import { ctaCopy, roles } from "@/content/cta";
import { trackWaitlistModalOpened } from "@/lib/analytics/events";
import { FoundingChip } from "./FoundingChip";
import { WaitlistForm } from "./WaitlistForm";

type OpenOptions = { tier?: string; tierLabel?: string };

type WaitlistContextValue = {
  open: (location: string, options?: OpenOptions) => void;
};

const WaitlistContext = createContext<WaitlistContextValue>({ open: () => {} });

export function useWaitlist() {
  return useContext(WaitlistContext);
}

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<{ location: string; tier?: string; tierLabel?: string; key: number } | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  const open = useCallback((location: string, options?: OpenOptions) => {
    if (ctaMode !== "waitlist") return;
    trackWaitlistModalOpened(location, { tier: options?.tier });
    setJoined(false);
    setState({ location, tier: options?.tier, tierLabel: options?.tierLabel, key: Date.now() });
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !state) return;
    if (!dialog.open) dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [state]);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.setAttribute("data-closing", "");
    window.setTimeout(() => {
      dialog.removeAttribute("data-closing");
      dialog.close();
      setState(null);
    }, 220);
  }, []);

  const onJoined = useCallback(() => setJoined(true), []);

  return (
    <WaitlistContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="waitlist-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        className="waitlist-dialog m-0 max-h-none w-full max-w-none bg-transparent p-0 text-fg backdrop:bg-transparent sm:m-auto sm:w-[min(32rem,calc(100vw-2rem))]"
      >
        {state ? (
          <div key={state.key} className="waitlist-sheet card fixed inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-b-none px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:relative sm:inset-auto sm:rounded-[1.5rem] sm:p-7">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-2 sm:hidden" aria-hidden="true" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow flex items-center gap-2 text-signal">
                  <span className="rec-dot" aria-hidden="true" /> Waitlist
                  {state.tierLabel ? <span className="text-fg-3">· {state.tierLabel} plan</span> : null}
                </p>
                <h2 id="waitlist-dialog-title" className="display-3 mt-2">
                  {joined ? "Nice. Now bring a friend." : ctaCopy.waitlist.dialogTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-fg-2 transition hover:border-line-2 hover:text-fg"
              >
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {!joined ? (
              <>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-2">{ctaCopy.waitlist.dialogBody}</p>
                <fieldset className="mt-5">
                  <legend className="eyebrow">I&apos;m a… (optional)</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        aria-pressed={role === r.id}
                        onClick={() => setRole((cur) => (cur === r.id ? null : r.id))}
                        className="rounded-full border border-line px-3 py-1.5 text-sm text-fg-2 transition hover:border-line-2 hover:text-fg aria-pressed:border-signal aria-pressed:bg-signal-soft aria-pressed:text-fg"
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </>
            ) : null}

            <div className="mt-5">
              <WaitlistForm
                key={state.key}
                location={state.location}
                variant="dialog"
                tier={state.tier}
                role={role}
                autoFocus
                onSuccess={onJoined}
              />
            </div>

            {!joined ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-3">
                  {ctaCopy.waitlist.reassurance.map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <span className="size-1 rounded-full bg-fg-3" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <FoundingChip size="sm" />
              </div>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </WaitlistContext.Provider>
  );
}
