import { ScrollTrigger } from "@/lib/gsap";
import { scrollEnter } from "@/lib/motion";

type ScrollEnterRevealOptions = {
  trigger: Element;
  start?: string;
  onEnter: () => void;
};

export function createScrollEnterReveal({
  trigger,
  start = scrollEnter.start,
  onEnter,
}: ScrollEnterRevealOptions): ScrollTrigger {
  return ScrollTrigger.create({
    trigger,
    start,
    once: true,
    invalidateOnRefresh: true,
    onEnter,
  });
}

/** After batching triggers, refresh and replay any that are already in view. */
export function activateScrollEnterReveals(
  triggers: ScrollTrigger[],
  onEnterForTrigger: (trigger: Element) => void,
) {
  ScrollTrigger.refresh();
  for (const st of triggers) {
    if (st.isActive && st.trigger instanceof Element) {
      onEnterForTrigger(st.trigger);
    }
  }
}
