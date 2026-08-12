"use client";

import { useRef } from "react";
import { MurmurMark } from "@/components/brand/MurmurMark";
import { Container } from "@/components/ui";
import { footerLinks } from "@/content/home";
import { features } from "@/config/features";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { PREMIUM_EASE, scrollEnterSoft } from "@/lib/motion";
import { focusRingClass, goldLinkClass } from "@/lib/styles";

const footerLinkGroups = {
  ...footerLinks,
  studio: footerLinks.studio.filter(
    (link) => features.studioLog || link.href !== "#studio-log",
  ),
};

const socialLinks: { label: string; href: string; handle?: string }[] = [
  {
    label: "YouTube",
    handle: "@trymurmurhq",
    href: "https://www.youtube.com/@trymurmurhq",
  },
  { label: "X", handle: "@trymurmurhq", href: "https://x.com/@trymurmurhq" },
  { label: "GitHub", href: "https://github.com/asumacodes" },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useSectionReveal({
    scope: footerRef,
    scrollEnter: scrollEnterSoft,
    groups: [
      {
        selector: ".footer-reveal",
        trigger: ".footer-main-grid",
        from: { autoAlpha: 0, y: 28 },
        to: { duration: 0.85, stagger: 0.1, ease: PREMIUM_EASE },
      },
    ],
  });

  return (
    <footer ref={footerRef} className="border-t border-[var(--border-subtle)] py-12">
      <Container>
        <div className="footer-main-grid grid gap-8 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:text-center lg:grid-cols-[1.2fr_1fr_auto] lg:items-start lg:gap-10 lg:text-left">
          <div className="footer-reveal opacity-0">
            <p className="flex items-center gap-3 font-serif-display text-4xl italic text-[var(--gold)]">
              <MurmurMark className="size-9 shrink-0" />
              <span>Murmur</span>
            </p>
            <p className="mt-3 text-[var(--text-secondary)]">
              Speak. Structure. Handoff.
            </p>
            <a
              href="https://sprint0.trymurmur.studio"
              className={`${goldLinkClass} mt-5 inline-block text-sm`}
            >
              A SprintZero Studio product →
            </a>
          </div>

          <hr
            aria-hidden="true"
            className="h-0.5 w-screen max-w-none border-0 bg-[color-mix(in_srgb,var(--border-subtle)_32%,transparent)] max-lg:mx-[calc(50%-50vw)] lg:hidden"
          />

          <div className="footer-reveal grid w-full grid-cols-3 gap-6 opacity-0 max-lg:gap-[clamp(0.75rem,3vw,1.5rem)] max-lg:text-center">
            {Object.entries(footerLinkGroups).map(([group, links]) => (
              <nav key={group} aria-label={`Footer ${group} links`}>
                <p className="font-mono-text mb-4 text-xs uppercase tracking-[0.14em] text-[var(--gold)] max-lg:text-[0.625rem] max-lg:tracking-[0.1em]">
                  {group}
                </p>
                <ul className="grid gap-3 max-lg:gap-[0.65rem]">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className={`${focusRingClass} rounded-sm text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] max-lg:text-[0.8125rem]`}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <hr
            aria-hidden="true"
            className="h-0.5 w-screen max-w-none border-0 bg-[color-mix(in_srgb,var(--border-subtle)_32%,transparent)] max-lg:mx-[calc(50%-50vw)] lg:hidden"
          />

          <div className="footer-reveal w-fit opacity-0 max-lg:mx-auto lg:justify-self-end">
            <ul className="grid gap-3 max-lg:mx-auto">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${focusRingClass} rounded-sm text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]`}
                  >
                    {item.label}
                    {item.handle ? ` · ${item.handle}` : null} ↗
                  </a>
                </li>
              ))}
            </ul>
            <p className="font-mono-text mt-6 text-sm text-[var(--text-tertiary)] max-lg:mx-auto">
              Made in Chandigarh · 2026
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-6 font-mono-text text-xs font-normal tracking-[0.01em] text-[color-mix(in_srgb,var(--gold)_58%,var(--text-tertiary))] max-lg:items-center max-lg:border-[color-mix(in_srgb,var(--border-subtle)_32%,transparent)] max-lg:text-center sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 SprintZero Studio</span>
          <span>v0.5 · early access</span>
        </div>
      </Container>
    </footer>
  );
}
