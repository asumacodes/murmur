import { SCROLL_BEATS } from "@/components/scrollhero-test/beats";
import { gsap } from "@/lib/gsap";

const BEAT_COUNT = SCROLL_BEATS.length;

/** Hold Beat 6 CTA at rest before pin releases (~10–15% of scrub at +=900%). */
export const SETTLE_HOLD_DURATION = 2.25;
export const SETTLE_END_LABEL = "settleEnd";

export type BuildBeatTimelineOptions = {
  setRecordingActive: (active: boolean) => void;
};

/** Initial hidden state for scrub film (scoped via gsap.context). */
export function initScrollHeroHiddenState() {
  SCROLL_BEATS.forEach((beat, i) => {
    gsap.set(`.sh-ghost-${i}`, {
      autoAlpha: 0,
      y: i === 0 ? 60 : 80,
    });
    gsap.set(`.sh-copy-${i}`, { autoAlpha: 0 });
    gsap.set(`.sh-copy-${i} .sh-eyebrow, .sh-copy-${i} .sh-sub`, {
      autoAlpha: 0,
      y: 20,
    });
    gsap.set(`.sh-copy-${i} .sh-word`, { autoAlpha: 0, y: 30 });

    if (beat.hasStage) {
      gsap.set(`.sh-path-${i}, .sh-label-${i}, .sh-hotspot-${i}`, {
        autoAlpha: 0,
      });
      gsap.set(`.sh-hotspot-${i}`, { scale: 0 });
      gsap.set(`.sh-label-${i}`, { y: 10 });
      gsap.set(`.sh-path-${i}`, { strokeDashoffset: 1 });
      gsap.set(`.sh-shot-${i}`, {
        autoAlpha: 0,
        y: i === 0 ? 40 : -40,
        rotateY: i === 0 ? -12 : -6,
        rotateX: 2,
        scale: i === 0 ? 0.96 : 0.94,
      });
    }
  });

  gsap.set(".sh-ship", { autoAlpha: 0, y: 30 });
  gsap.set(".sh-spine-label-0", { autoAlpha: 1 });
  for (let i = 1; i < BEAT_COUNT; i += 1) {
    gsap.set(`.sh-spine-label-${i}`, { autoAlpha: 0 });
  }
  gsap.set(".sh-spine-progress", {
    scaleY: 1 / BEAT_COUNT,
    transformOrigin: "top",
  });
}

/** End state for reduced-motion handoff (ship beat + full spine). */
export function setScrollHeroReducedMotionEndState() {
  gsap.set(
    [
      ".sh-ghost",
      ".sh-copy",
      ".sh-shot",
      ".sh-path",
      ".sh-label",
      ".sh-hotspot",
      ".sh-ship",
      ".sh-spine-label",
      ".sh-spine-dot",
    ],
    { clearProps: "all" },
  );
  gsap.set(".sh-copy-5", { autoAlpha: 1 });
  gsap.set(".sh-copy-5 .sh-eyebrow, .sh-copy-5 .sh-sub, .sh-copy-5 .sh-word", {
    autoAlpha: 1,
    y: 0,
  });
  gsap.set(".sh-ghost-5", { autoAlpha: 1, y: 0 });
  gsap.set(".sh-ship", { autoAlpha: 1, y: 0 });
  gsap.set(".sh-spine-progress", { scaleY: 1, transformOrigin: "top" });
  for (let d = 0; d < BEAT_COUNT; d += 1) {
    gsap.set(`.sh-spine-dot-${d}`, { backgroundColor: "var(--gold)" });
    gsap.set(`.sh-spine-label-${d}`, { autoAlpha: 1 });
  }
}

export function buildScrollHeroBeatTimeline(
  tl: gsap.core.Timeline,
  options: BuildBeatTimelineOptions,
) {
  const { setRecordingActive } = options;

  SCROLL_BEATS.forEach((beat, i) => {
    const isFirst = i === 0;
    const isShip = !beat.hasStage;
    const shotSel = `.sh-shot-${i}`;
    const ghostSel = `.sh-ghost-${i}`;
    const copySel = `.sh-copy-${i}`;

    if (isFirst) {
      tl.to(ghostSel, { autoAlpha: 1, y: 0, duration: 1 }, 0).to(
        shotSel,
        {
          autoAlpha: 1,
          y: 0,
          rotateY: -6,
          rotateX: 2,
          scale: 1,
          duration: 1.4,
        },
        0,
      );
      tl.call(() => setRecordingActive(true), undefined, 0.8);
      tl.to(
        `${copySel} .sh-eyebrow`,
        { autoAlpha: 1, y: 0, duration: 0.6 },
        1.0,
      )
        .to(
          `${copySel} .sh-word`,
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 },
          1.2,
        )
        .to(
          `${copySel} .sh-sub`,
          { autoAlpha: 1, y: 0, duration: 0.6 },
          1.7,
        );
      tl.set(copySel, { autoAlpha: 1 }, 1.0);

      if (beat.hotspots.length) {
        tl.to(
          `.sh-hotspot-${i}`,
          { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.2 },
          2.3,
        )
          .to(
            `.sh-path-${i}`,
            {
              autoAlpha: 1,
              strokeDashoffset: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "power2.inOut",
            },
            2.5,
          )
          .to(
            `.sh-label-${i}`,
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2 },
            2.9,
          );
      }
      tl.to({}, { duration: 0.55 });
      return;
    }

    const t0 = tl.duration();
    const prev = i - 1;

    tl.to(
      `.sh-path-${prev}, .sh-label-${prev}, .sh-hotspot-${prev}`,
      { autoAlpha: 0, duration: 0.4 },
      t0,
    );

    if (SCROLL_BEATS[prev]?.hasStage) {
      tl.to(
        `.sh-shot-${prev}`,
        {
          autoAlpha: 0,
          y: 40,
          scale: 0.94,
          rotateY: -12,
          duration: 0.65,
          ease: "power2.in",
        },
        t0 + 0.25,
      );
    }

    tl.to(
      `.sh-copy-${prev}`,
      { autoAlpha: 0, y: 20, duration: 0.45 },
      t0 + 0.25,
    )
      .to(
        `.sh-ghost-${prev}`,
        { autoAlpha: 0, y: -80, duration: 0.5, ease: "power2.in" },
        t0 + 0.2,
      )
      .to(
        `.sh-spine-label-${prev}`,
        { autoAlpha: 0, duration: 0.3 },
        t0 + 0.25,
      )
      .to(
        `.sh-spine-dot-${prev}`,
        { backgroundColor: "var(--border-subtle)", duration: 0.3 },
        t0 + 0.25,
      )
      .to(
        ".sh-spine-progress",
        {
          scaleY: (i + 1) / BEAT_COUNT,
          duration: 0.7,
          ease: "power2.inOut",
        },
        t0 + 0.35,
      );

    const tIn = t0 + 0.95;

    tl.to(
      ghostSel,
      { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
      tIn,
    )
      .to(
        `.sh-spine-dot-${i}`,
        { backgroundColor: "var(--gold)", duration: 0.35 },
        tIn + 0.1,
      )
      .to(
        `.sh-spine-label-${i}`,
        { autoAlpha: 1, duration: 0.4 },
        tIn + 0.1,
      );

    if (isShip) {
      tl.to(
        ".sh-ship",
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" },
        tIn + 0.05,
      )
        .set(copySel, { autoAlpha: 1 }, tIn + 0.15)
        .to(
          `${copySel} .sh-eyebrow`,
          { autoAlpha: 1, y: 0, duration: 0.45 },
          tIn + 0.2,
        )
        .to(
          `${copySel} .sh-word`,
          { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 },
          tIn + 0.35,
        )
        .to(
          `${copySel} .sh-sub`,
          { autoAlpha: 1, y: 0, duration: 0.45 },
          tIn + 0.65,
        );
      tl.to(
        ".sh-spine-progress",
        { scaleY: 1, duration: 0.5 },
        tIn + 0.2,
      );
      for (let d = 0; d < BEAT_COUNT; d += 1) {
        tl.to(
          `.sh-spine-dot-${d}`,
          { backgroundColor: "var(--gold)", duration: 0.2 },
          tIn + 0.2,
        );
      }
      tl.to({}, { duration: SETTLE_HOLD_DURATION });
      tl.addLabel(SETTLE_END_LABEL);
      return;
    }

    tl.to(
      shotSel,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotateY: -6,
        rotateX: 2,
        duration: 0.7,
        ease: "power2.out",
      },
      tIn + 0.05,
    )
      .set(copySel, { autoAlpha: 1 }, tIn + 0.15)
      .to(
        `${copySel} .sh-eyebrow`,
        { autoAlpha: 1, y: 0, duration: 0.45 },
        tIn + 0.2,
      )
      .to(
        `${copySel} .sh-word`,
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 },
        tIn + 0.35,
      )
      .to(
        `${copySel} .sh-sub`,
        { autoAlpha: 1, y: 0, duration: 0.45 },
        tIn + 0.65,
      );

    const tAnn = tIn + 0.95;
    tl.to(
      `.sh-hotspot-${i}`,
      { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.2 },
      tAnn,
    )
      .to(
        `.sh-path-${i}`,
        {
          autoAlpha: 1,
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.inOut",
        },
        tAnn + 0.2,
      )
      .to(
        `.sh-label-${i}`,
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2 },
        tAnn + 0.6,
      );

    tl.to({}, { duration: 0.55 });
  });
}

export const SCROLL_HERO_BEAT_COUNT = BEAT_COUNT;
