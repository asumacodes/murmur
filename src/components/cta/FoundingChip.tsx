"use client";

import { useEffect, useState } from "react";
import { features } from "@/config/features";

type Founding = { claimed: number; cap: number; left: number };

let cache: Promise<Founding | null> | null = null;

function loadFounding(): Promise<Founding | null> {
  if (!cache) {
    cache = fetch("/api/founding")
      .then((r) => (r.ok ? (r.json() as Promise<Founding>) : null))
      .then((d) => (d && Number.isFinite(d.left) ? d : null))
      .catch(() => null);
  }
  return cache;
}

/** Live count from the app. Renders nothing unless the number is real. */
export function useFounding() {
  const [data, setData] = useState<Founding | null>(null);
  useEffect(() => {
    if (!features.foundingCounter) return;
    let alive = true;
    loadFounding().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, []);
  return data;
}

export function FoundingChip({ size = "md", className = "" }: { size?: "sm" | "md"; className?: string }) {
  const data = useFounding();
  if (!data || data.left <= 0) return null;

  const pct = Math.round((data.claimed / data.cap) * 100);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 font-mono text-fg-2 ${
        size === "sm" ? "px-2.5 py-1 text-[0.68rem]" : "px-3 py-1.5 text-[0.72rem]"
      } ${className}`}
      title={`${data.claimed} of ${data.cap} founding spots claimed`}
    >
      <span className="relative inline-flex h-1.5 w-10 overflow-hidden rounded-full bg-line-2" aria-hidden="true">
        <span className="absolute inset-y-0 left-0 rounded-full bg-signal" style={{ width: `${Math.max(pct, 4)}%` }} />
      </span>
      <span>
        <strong className="font-semibold text-fg">{data.left}</strong> of {data.cap} founding spots left
      </span>
    </span>
  );
}
