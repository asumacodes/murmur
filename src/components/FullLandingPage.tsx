import { Comparison } from "@/components/sections/Comparison";
import { EarlyAccessCTA } from "@/components/sections/EarlyAccessCTA";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { Pipeline } from "@/components/sections/Pipeline";
import { SprintZeroBand } from "@/components/sections/SprintZeroBand";
import { StackStrip } from "@/components/sections/StackStrip";
import { StudioLog } from "@/components/sections/StudioLog";
import { features } from "@/config/features";
import { skipLinkClass } from "@/lib/styles";

export function FullLandingPage() {
  return (
    <>
      <a href="#main-content" className={skipLinkClass}>
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="overflow-x-hidden">
        <Hero />
        <HowItWorks />
        <Pipeline />
        <Comparison />
        <Pricing />
        {features.studioLog ? <StudioLog /> : null}
        <StackStrip />
        <FAQ />
        <SprintZeroBand />
        <EarlyAccessCTA />
      </main>
      <Footer />
    </>
  );
}
