"use client";

import { FormEvent, useState } from "react";
import { comingSoon } from "@/content/coming-soon";

type FormStatus = "idle" | "loading" | "success" | "already" | "error";

export function NotifyForm() {
  const { notify } = comingSoon;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const feedback =
    status === "success"
      ? notify.success
      : status === "already"
        ? notify.alreadySubscribed
        : status === "error"
          ? notify.error
          : null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") {
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        alreadySubscribed?: boolean;
        error?: string;
      };

      if (response.ok && data.ok) {
        setStatus(data.alreadySubscribed ? "already" : "success");
        setEmail("");
        return;
      }

      if (response.status === 409 || data.alreadySubscribed) {
        setStatus("already");
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const isDone = status === "success" || status === "already";

  return (
    <div className="coming-soon-notify">
      {isDone ? (
        <p
          className="coming-soon-notify-done"
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      ) : (
        <form
          className="coming-soon-notify-form"
          onSubmit={onSubmit}
          aria-label="Launch notification signup"
        >
          <label className="sr-only" htmlFor="coming-soon-email">
            Email address
          </label>
          <input
            id="coming-soon-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "error") {
                setStatus("idle");
              }
            }}
            placeholder={notify.placeholder}
            disabled={status === "loading"}
            className="coming-soon-notify-input"
          />
          <button
            type="submit"
            className="coming-soon-notify-submit focus-ring"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending…" : notify.cta}
          </button>
        </form>
      )}

      <p className="coming-soon-notify-footnote">{notify.footnote}</p>

      {status === "error" ? (
        <p className="coming-soon-notify-error" role="alert" aria-live="assertive">
          {notify.error}
        </p>
      ) : null}
    </div>
  );
}
