import { features } from "@/config/features";
import { ScrollTrigger } from "@/lib/gsap";

/** Fired once when the scroll-hero pin scrub finishes (or on reduced-motion skip). */
export const CINEMATIC_INTRO_COMPLETE_EVENT = "murmur:cinematic-intro-complete";

let cinematicIntroComplete = !features.scrollHero;

export function isCinematicIntroGateOpen(): boolean {
  return cinematicIntroComplete || isPastCinematicIntro();
}

export function isPastCinematicIntro(): boolean {
  if (!features.scrollHero) {
    return true;
  }

  const root = document.getElementById("scroll-hero-intro");
  if (!root) {
    return true;
  }

  const pinSection = root.querySelector<HTMLElement>("[data-scroll-hero-pin]");
  const spacer = pinSection?.parentElement;
  if (spacer?.classList.contains("pin-spacer")) {
    return spacer.getBoundingClientRect().bottom <= window.innerHeight * 0.15;
  }

  return root.getBoundingClientRect().bottom <= window.innerHeight * 0.15;
}

export function markCinematicIntroComplete(): void {
  if (cinematicIntroComplete) {
    return;
  }

  cinematicIntroComplete = true;
  window.dispatchEvent(new CustomEvent(CINEMATIC_INTRO_COMPLETE_EVENT));
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

/** Run immediately if intro is done, otherwise on the completion event. */
export function whenCinematicIntroGateOpen(run: () => void): void {
  if (isCinematicIntroGateOpen()) {
    run();
    return;
  }

  const onOpen = () => {
    window.removeEventListener(CINEMATIC_INTRO_COMPLETE_EVENT, onOpen);
    run();
  };
  window.addEventListener(CINEMATIC_INTRO_COMPLETE_EVENT, onOpen);
}
