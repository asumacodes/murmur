import type { FaqItem } from "@/content/faq";
import { ORG_NAME, SITE_URL, socials } from "@/lib/site";

/** Organization — the publisher. One name everywhere: "SprintZero Studios". */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#org`,
  name: ORG_NAME,
  legalName: "SprintZero Studios (OPC) Private Limited",
  url: SITE_URL,
  logo: `${SITE_URL}/icons/icon-512.png`,
  description:
    "SprintZero Studios builds Murmur, software that turns a voice memo into a complete project foundation.",
  foundingLocation: {
    "@type": "Place",
    address: { "@type": "PostalAddress", addressLocality: "Chandigarh", addressCountry: "IN" },
  },
  sameAs: [socials.x, socials.founderX, socials.github, socials.youtube],
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Murmur",
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#org` },
} as const;

/**
 * SoftwareApplication — Murmur. Prices mirror the app's billing config
 * (listener/lib/billing/dodo-products.config.ts). No aggregateRating: there
 * are no public reviews yet, and inventing one is not an option.
 */
export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#app`,
  name: "Murmur",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Product management",
  operatingSystem: "Web, iOS, Android (PWA)",
  url: SITE_URL,
  description:
    "Murmur turns a voice memo into a project foundation in under 10 minutes: competitor research with citations, a PRD, a brand kit, an engineering brief, a roadmap, and a Jira board and Confluence space in your own Atlassian site.",
  featureList: [
    "Voice memo capture and transcription",
    "Competitor and market research with source links",
    "Product requirements document (PRD)",
    "Brand kit: name notes, tagline, palette, typography, logo direction",
    "Engineering brief: architecture, data models, SQL schema, tech stack",
    "Roadmap in three phases",
    "Jira project with epics and stories",
    "Confluence space with six pages",
  ],
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0",
    highPrice: "79",
    offerCount: 5,
    offers: [
      { "@type": "Offer", name: "First idea", price: "0", priceCurrency: "USD" },
      { "@type": "Offer", name: "Pay as you go", price: "7", priceCurrency: "USD" },
      { "@type": "Offer", name: "Starter", price: "19", priceCurrency: "USD" },
      { "@type": "Offer", name: "Builder", price: "49", priceCurrency: "USD" },
      { "@type": "Offer", name: "Studio", price: "79", priceCurrency: "USD" },
    ],
  },
  publisher: { "@id": `${SITE_URL}/#org` },
} as const;

export function buildFaqSchema(faq: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
