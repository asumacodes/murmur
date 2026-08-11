"use client";

import { FormEvent, useRef, useState } from "react";

export type SubscribeStatus = "idle" | "loading" | "success" | "error";

type UseSubscribeFormOptions = {
  /** Analytics / CTA location passed to the click tracker by the caller */
  onSubmitStart?: () => void;
};

export function useSubscribeForm({ onSubmitStart }: UseSubscribeFormOptions = {}) {
  const submitGuardRef = useRef(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitGuardRef.current || status === "loading") {
      return;
    }
    submitGuardRef.current = true;
    onSubmitStart?.();

    setStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("subscribe failed");
      }

      setStatus("success");
      setEmail("");
    } catch {
      submitGuardRef.current = false;
      setStatus("error");
    }
  }

  function onEmailChange(value: string) {
    setEmail(value);
    if (status === "error") {
      setStatus("idle");
    }
  }

  return {
    email,
    status,
    handleSubmit,
    onEmailChange,
  };
}
