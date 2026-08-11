import { EarlyAccessCTA } from "@/components/sections/EarlyAccessCTA";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Packs } from "@/components/sections/Packs";
import { Pipeline } from "@/components/sections/Pipeline";
import { StackStrip } from "@/components/sections/StackStrip";
import { StudioLog } from "@/components/sections/StudioLog";
import { features } from "@/config/features";

export function FullLandingPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <HowItWorks />
        <Pipeline />
        <Packs />
        {features.studioLog ? <StudioLog /> : null}
        <StackStrip />
        <FAQ />
        <EarlyAccessCTA />
      </main>
      <Footer />
    </>
  );
}
