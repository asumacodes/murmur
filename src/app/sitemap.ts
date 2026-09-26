import type { MetadataRoute } from "next";
import { runs } from "@/content/runs";
import { SITE_URL } from "@/lib/site";

/** Real lastmod dates only: bump CONTENT_UPDATED when page copy changes. */
const CONTENT_UPDATED = "2026-09-26";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], lastModified = CONTENT_UPDATED) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page("", 1, "weekly"),
    page("/examples", 0.9, "weekly"),
    ...runs.map((r) => page(`/examples/${r.slug}`, 0.8, "monthly")),
    page("/tools/prd-to-jira-csv", 0.8, "monthly"),
    page("/templates/prd", 0.8, "monthly"),
    page("/templates/technical-design-document", 0.7, "monthly"),
    page("/compare/chatprd", 0.6, "monthly"),
    page("/compare/atlassian-rovo", 0.6, "monthly"),
    page("/about", 0.5, "monthly"),
    page("/contact", 0.4, "yearly"),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
  ];
}
