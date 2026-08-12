"use client";

import { useSectionAnalytics } from "@/hooks/useSectionAnalytics";
import { analyticsSectionIds } from "@/lib/motion";

/** Null client island — runs marketing section/scroll analytics only. */
export function SectionAnalytics() {
  useSectionAnalytics(analyticsSectionIds);
  return null;
}
