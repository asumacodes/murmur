"use client";

import { useEffect } from "react";
import { Hero } from "@/components/sections/Hero";
import { ScrollHero } from "@/components/sections/ScrollHero";
import { ScrollHeroMobile } from "@/components/sections/ScrollHeroMobile";
import { markCinematicIntroComplete } from "@/lib/cinematicIntro";

/**
 * Mobile (< md): classic Hero — no pin, gate opens on mount.
 * Desktop (md+): pinned scroll-hero; reduced-motion falls back to stacked beats.
 */
function MobileClassicHero() {
  useEffect(() => {
    markCinematicIntroComplete();
  }, []);

  return (
    <div className="block md:hidden">
      <Hero />
    </div>
  );
}

function ScrollHeroDesktop() {
  return (
    <div id="scroll-hero-intro" className="hidden md:block">
      <div className="block motion-reduce:hidden">
        <ScrollHero />
      </div>
      <ScrollHeroMobile className="hidden motion-reduce:block" />
    </div>
  );
}

export function ScrollHeroExperience() {
  return (
    <>
      <ScrollHeroDesktop />
      <MobileClassicHero />
    </>
  );
}

/** Standalone scroll-hero test route — same desktop/mobile split as production. */
export function ScrollHeroStandalone() {
  return (
    <>
      <ScrollHeroDesktop />
      <MobileClassicHero />
    </>
  );
}
