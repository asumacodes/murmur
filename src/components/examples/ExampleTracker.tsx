"use client";

import { useEffect } from "react";
import { trackExampleViewed } from "@/lib/analytics/events";

export function ExampleTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackExampleViewed(slug);
  }, [slug]);
  return null;
}
