"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, posthog } from "@/lib/analytics/posthog-client";

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    posthog?.capture("marketing_page_viewed", {
      path: pathname,
      // referrer captured automatically by posthog as $referrer;
      // UTMs auto-parsed from URL into $initial_utm_* (set-once) + $utm_* (current)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire on route/search change only
  }, [pathname, searchParams]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </>
  );
}
