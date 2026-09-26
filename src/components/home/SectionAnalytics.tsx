"use client";

import { useSectionAnalytics } from "@/hooks/useSectionAnalytics";

const HOME_SECTIONS = ["runs", "how-it-works", "pipeline", "comparison", "pricing", "faq", "sprintzero", "closer"] as const;

/** Null island: section-view + scroll-depth events for the home page funnel. */
export function SectionAnalytics() {
  useSectionAnalytics(HOME_SECTIONS);
  return null;
}
