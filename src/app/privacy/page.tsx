import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getLegalMarkdown } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy · Murmur",
  description:
    "How SprintZero Studios collects, uses, and protects personal data when you use Murmur.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Privacy Policy"
      markdown={getLegalMarkdown("privacy.md")}
    />
  );
}
