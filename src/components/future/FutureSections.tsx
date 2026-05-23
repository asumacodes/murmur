import { features } from "@/config/features";
import { Container, SectionEyebrow } from "@/components/ui";

const futureSections = [
  {
    enabled: features.caseStudies,
    eyebrow: "Case studies",
    title: "Real starts, once real users exist.",
  },
  {
    enabled: features.testimonials,
    eyebrow: "Testimonials",
    title: "Borrowed trust belongs here later.",
  },
  {
    enabled: features.demoVideo,
    eyebrow: "Demo video",
    title: "The full pipeline walkthrough.",
  },
  {
    enabled: features.exactPricing,
    eyebrow: "Pricing",
    title: "Final tiers after Stripe is wired.",
  },
  {
    enabled: features.comparisonTable,
    eyebrow: "Comparison",
    title: "Murmur versus doing it manually.",
  },
  {
    enabled: features.faq,
    eyebrow: "FAQ",
    title: "Questions from the actual waitlist.",
  },
];

export function FutureSections() {
  const enabledSections = futureSections.filter((section) => section.enabled);

  if (enabledSections.length === 0) {
    return null;
  }

  return (
    <>
      {enabledSections.map((section) => (
        <section key={section.eyebrow} className="section-pad">
          <Container>
            <SectionEyebrow>{section.eyebrow}</SectionEyebrow>
            <h2 className="font-serif-display mt-4 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05]">
              {section.title}
            </h2>
            <p className="mt-5 max-w-2xl text-[var(--text-secondary)]">
              This section is intentionally gated until Murmur has real content
              to support it.
            </p>
          </Container>
        </section>
      ))}
    </>
  );
}
