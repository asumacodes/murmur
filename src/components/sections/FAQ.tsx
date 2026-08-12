"use client";

import { useRef, useState } from "react";
import { Container, SectionHeader } from "@/components/ui";
import { faq, type FaqItem } from "@/content/faq";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";
import { focusRingClass } from "@/lib/styles";

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useSectionReveal({
    scope: sectionRef,
    scrollEnter,
    groups: [
      {
        selector: ".faq-header > *",
        trigger: ".faq-header",
        from: { autoAlpha: 0, y: 40 },
        to: { duration: 0.95, stagger: 0.12, ease: PREMIUM_EASE },
      },
      {
        selector: ".faq-item",
        from: { autoAlpha: 0, y: 36 },
        to: { duration: 0.85, stagger: 0.1, ease: PREMIUM_EASE },
        batch: true,
      },
    ],
  });

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="pt-[clamp(3rem,6vw,5rem)] pb-[clamp(2.75rem,5.5vw,4.5rem)]"
    >
      <Container>
        <SectionHeader
          className="faq-header !max-w-none"
          eyebrowClassName="opacity-0"
          titleClassName="opacity-0"
          eyebrow="FAQ"
          title="The honest answers."
        />

        <div className="faq-list w-full border-b border-[var(--border-subtle)]">
          {faq.map((item, index) => (
            <FaqAccordionItem
              key={item.q}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FaqAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.killTweensOf(panel);

      // Initial mount: lock closed without tweening.
      if (!readyRef.current) {
        readyRef.current = true;
        gsap.set(panel, {
          height: isOpen ? "auto" : 0,
          autoAlpha: isOpen ? 1 : 0,
          y: isOpen ? 0 : 6,
        });
        return;
      }

      if (isOpen) {
        if (reduceMotion) {
          gsap.set(panel, { height: "auto", autoAlpha: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          panel,
          { height: 0, autoAlpha: 0, y: 6 },
          {
            height: "auto",
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: PREMIUM_EASE,
            overwrite: true,
          },
        );
        return;
      }

      if (reduceMotion) {
        gsap.set(panel, { height: 0, autoAlpha: 0, y: 6 });
        return;
      }

      gsap.to(panel, {
        height: 0,
        autoAlpha: 0,
        y: 6,
        duration: 0.35,
        ease: PREMIUM_EASE,
        overwrite: true,
      });
    },
    { dependencies: [isOpen] },
  );

  return (
    <div className="faq-item border-t border-[var(--border-subtle)] opacity-0">
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className={`${focusRingClass} flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left sm:py-7`}
        >
          <span
            className={`font-serif-display text-[clamp(1.2rem,2.2vw,1.55rem)] leading-[1.3] transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpen
                ? "text-[var(--gold)]"
                : "text-[var(--text-primary)] hover:text-[var(--gold)]"
            }`}
          >
            {item.q}
          </span>
          <span
            className={`relative size-3.5 shrink-0 before:absolute before:top-1.5 before:left-0 before:h-0.5 before:w-3.5 before:bg-[var(--gold)] after:absolute after:top-0 after:left-1.5 after:h-3.5 after:w-0.5 after:origin-center after:bg-[var(--gold)] after:transition-[transform,opacity] after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpen ? "after:scale-y-0 after:opacity-0" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </h3>

      <div
        id={panelId}
        ref={panelRef}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <p className="pb-7 pr-12 text-[1.05rem] leading-7 text-[var(--text-secondary)]">
          {item.a}
        </p>
      </div>
    </div>
  );
}
