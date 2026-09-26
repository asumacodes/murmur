"use client";

import { useState } from "react";
import {
  trackReferralLinkCopied,
  trackReferralShared,
  trackWaitlistIdeaShared,
} from "@/lib/analytics/events";
import type { JoinResult } from "./useWaitlistSubmit";

const SHARE_TEXT =
  "I just joined the Murmur waitlist: talk through an idea, get the PRD, brand kit and Jira board back in under 10 minutes.";

export function SuccessPanel({
  result,
  location,
  compact = false,
}: {
  result: JoinResult;
  location: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [idea, setIdea] = useState("");
  const [ideaState, setIdeaState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const url = result.referralUrl;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(SHARE_TEXT);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackReferralLinkCopied(location);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  async function sendIdea(event: React.FormEvent) {
    event.preventDefault();
    if (idea.trim().length < 3 || ideaState === "sending") return;
    setIdeaState("sending");
    try {
      const res = await fetch("/api/waitlist-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: result.email, code: result.code, idea }),
      });
      if (!res.ok) throw new Error();
      trackWaitlistIdeaShared(idea.trim().length);
      setIdeaState("sent");
    } catch {
      setIdeaState("error");
    }
  }

  return (
    <div className="text-left" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ok/15 text-ok">
          <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="font-display text-xl font-semibold tracking-[-0.02em] text-fg">
            {result.alreadySubscribed ? "You're already on the list." : "You're on the list."}
          </p>
          <p className="text-sm text-fg-2">Invites go out in batches. Your first idea is free when yours lands.</p>
        </div>
      </div>

      <div className={compact ? "mt-4" : "mt-6"}>
        <p className="eyebrow">Share Murmur · your link</p>
        <div className="mt-2 flex items-stretch gap-2">
          <code className="flex min-w-0 flex-1 items-center truncate rounded-xl border border-line bg-surface-2 px-3 font-mono text-[0.8rem] text-fg-2">
            {url.replace(/^https:\/\/(www\.)?/, "")}
          </code>
          <button
            type="button"
            onClick={copy}
            className="shrink-0 rounded-xl border border-line-2 bg-surface-2 px-3.5 text-sm font-medium text-fg transition hover:border-fg-3"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <a
            href={`https://x.com/intent/post?text=${encodedText}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackReferralShared("x", location)}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-fg-2 transition hover:border-line-2 hover:text-fg"
          >
            Post on X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackReferralShared("linkedin", location)}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-fg-2 transition hover:border-line-2 hover:text-fg"
          >
            Share on LinkedIn
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${url}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackReferralShared("whatsapp", location)}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-fg-2 transition hover:border-line-2 hover:text-fg"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {!compact ? (
        <form onSubmit={sendIdea} className="mt-6 border-t border-line pt-5">
          <label htmlFor={`idea-${location}`} className="eyebrow">
            Optional · what would you build first?
          </label>
          {ideaState === "sent" ? (
            <p className="mt-2 text-sm text-fg-2">Got it. It goes straight to the founder&apos;s inbox.</p>
          ) : (
            <>
              <textarea
                id={`idea-${location}`}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                maxLength={1200}
                rows={3}
                placeholder="A one-liner is plenty. It helps us plan invite batches."
                className="mt-2 w-full resize-none rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-sm text-fg outline-none placeholder:text-fg-3 focus:border-signal"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-fg-3">{ideaState === "error" ? "Couldn't send that. Try again?" : "Read by a human, never shared."}</span>
                <button
                  type="submit"
                  disabled={idea.trim().length < 3 || ideaState === "sending"}
                  className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition disabled:cursor-not-allowed disabled:border disabled:border-line-2 disabled:bg-transparent disabled:text-fg-3"
                >
                  {ideaState === "sending" ? "Sending…" : "Send"}
                </button>
              </div>
            </>
          )}
        </form>
      ) : null}
    </div>
  );
}
