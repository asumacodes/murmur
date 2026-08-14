import type { FaqItem } from "@/content/faq";

const SITE = "https://www.trymurmur.studio";

/** Organization — the publisher. SprintZero Studios owns Murmur. */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SprintZero Studios",
  legalName: "SprintZero Studios (OPC) Private Limited",
  url: SITE,
  logo: `${SITE}/icons/icon-512.png`,
  description:
    "SprintZero Studios builds Murmur, voice-to-project-foundation software, and ships MVPs in 72-hour sprints.",
  foundingLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chandigarh",
      addressCountry: "IN",
    },
  },
  sameAs: [
    "https://x.com/trymurmurhq",
    "https://x.com/AsumaCodes",
    "https://github.com/asumacodes",
  ],
} as const;

/**
 * SoftwareApplication — Murmur itself.
 * No aggregateRating (would require real reviews).
 * No offers until KAN-65 checkout exists (waitlist-only today).
 */
export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Murmur",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE,
  description:
    "Murmur turns a five-minute voice memo into a complete project foundation: a validated PRD, brand kit, Jira board, and Confluence space, in minutes.",
  publisher: {
    "@type": "Organization",
    name: "SprintZero Studios",
    url: SITE,
  },
} as const;

/** FAQPage — built from real faq.ts content to avoid duplication. */
export function buildFaqSchema(faq: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
