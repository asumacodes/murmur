import { Closer } from "@/components/home/Closer";
import { Comparison } from "@/components/home/Comparison";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Pipeline } from "@/components/home/Pipeline";
import { Pricing } from "@/components/home/Pricing";
import { RunExplorer } from "@/components/home/RunExplorer";
import { SectionAnalytics } from "@/components/home/SectionAnalytics";
import { SprintZeroBand } from "@/components/home/SprintZeroBand";
import { StackStrip } from "@/components/home/StackStrip";
import { PageShell } from "@/components/site/PageShell";
import { faq } from "@/content/faq";
import { buildFaqSchema } from "@/lib/structured-data";

/**
 * Order is deliberate: promise → proof (real runs) → mechanism → contrast →
 * price → objections → close. The primary action is reachable from every screen.
 */
export default function Home() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(faq)) }} />
      <SectionAnalytics />
      <Hero />
      <RunExplorer />
      <HowItWorks />
      <Pipeline />
      <Comparison />
      <Pricing />
      <StackStrip />
      <Faq />
      <SprintZeroBand />
      <Closer />
    </PageShell>
  );
}
