"use client";

import { type FormEvent, useRef, useState } from "react";
import {
  trackWaitlistCtaClicked,
  trackWaitlistFormStarted,
  trackWaitlistJoined,
  trackWaitlistSubmitted,
} from "@/lib/analytics/events";
import { readReferral } from "@/lib/analytics/first-touch";

export type SubmitStatus = "idle" | "loading" | "success" | "error";

export type JoinResult = {
  email: string;
  code: string;
  referralUrl: string;
  alreadySubscribed: boolean;
};

const startedLocations = new Set<string>();

export function useWaitlistSubmit(location: string, opts?: { tier?: string; role?: string | null }) {
  const guard = useRef(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JoinResult | null>(null);

  function onEmailChange(value: string) {
    if (value.length > 0 && !startedLocations.has(location)) {
      startedLocations.add(location);
      trackWaitlistFormStarted(location);
    }
    setEmail(value);
    if (status === "error") {
      setStatus("idle");
      setError(null);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (guard.current || status === "loading") return;
    guard.current = true;
    trackWaitlistCtaClicked("form_submit", { form_location: location, tier: opts?.tier });
    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          location,
          role: opts?.role ?? undefined,
          tier: opts?.tier,
          ref: readReferral() ?? undefined,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
        referralUrl?: string;
        alreadySubscribed?: boolean;
      };

      if (!response.ok || !data.code || !data.referralUrl) {
        throw new Error(data.error || "Something went wrong. Try again.");
      }

      trackWaitlistSubmitted(location, data.alreadySubscribed ? "duplicate" : "success");
      if (!data.alreadySubscribed) {
        trackWaitlistJoined(location, { role: opts?.role ?? null, tier: opts?.tier ?? null, referred: Boolean(readReferral()) });
      }
      setResult({
        email,
        code: data.code,
        referralUrl: data.referralUrl,
        alreadySubscribed: Boolean(data.alreadySubscribed),
      });
      setStatus("success");
    } catch (err) {
      guard.current = false;
      trackWaitlistSubmitted(location, "error");
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setStatus("error");
    }
  }

  return { email, status, error, result, onEmailChange, onSubmit };
}
