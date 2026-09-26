"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureFirstTouchOnce, captureReferral } from "@/lib/analytics/first-touch";
import { trackPageViewed } from "@/lib/analytics/events";
import { initPostHog } from "@/lib/analytics/posthog-client";
import { WaitlistProvider } from "@/components/cta/WaitlistProvider";
import { RevealObserver } from "@/components/motion/RevealObserver";

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    trackPageViewed(pathname, { theme: document.documentElement.dataset.theme });
  }, [pathname, searchParams]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
    captureFirstTouchOnce(); // durable first-touch; survives the OAuth hop into the app
    captureReferral();
  }, []);

  return (
    <WaitlistProvider>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      <RevealObserver />
      {children}
    </WaitlistProvider>
  );
}
