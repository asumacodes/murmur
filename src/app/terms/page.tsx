import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getLegalMarkdown } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service — Murmur",
  description:
    "Terms governing your use of Murmur, operated by SprintZero Studios (OPC) Private Limited.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Terms of Service"
      markdown={getLegalMarkdown("terms.md")}
    />
  );
}
