import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Everyone may crawl the marketing pages. AI search crawlers are named
 * explicitly so answer engines can cite Murmur; API routes stay out.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      {
        userAgent: ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User", "Google-Extended", "Applebot-Extended"],
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
