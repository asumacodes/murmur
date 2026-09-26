import { ORG_NAME, absoluteUrl } from "@/lib/site";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

const PUBLISHED = "2026-09-26";

/** TechArticle + BreadcrumbList JSON-LD for a /templates/* page. */
export function buildTemplateSchemas({
  headline,
  description,
  path,
  name,
  about,
  modified = PUBLISHED,
}: {
  headline: string;
  description: string;
  path: string;
  /** Short name used as the last breadcrumb. */
  name: string;
  about: string[];
  modified?: string;
}) {
  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline,
    description,
    datePublished: PUBLISHED,
    dateModified: modified,
    inLanguage: "en",
    isAccessibleForFree: true,
    proficiencyLevel: "Beginner",
    author: { "@type": "Organization", name: ORG_NAME, url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: ORG_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/icons/icon-512.png") } },
    mainEntityOfPage: absoluteUrl(path),
    about,
  };
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Murmur", path: "/" },
    { name, path },
  ]);
  return [article, breadcrumbs];
}
