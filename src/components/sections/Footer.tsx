"use client";

import { useRef } from "react";
import { MurmurMark } from "@/components/brand/MurmurMark";
import { Container } from "@/components/ui";
import { footerLinks } from "@/content/home";
import { features } from "@/config/features";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { PREMIUM_EASE, scrollEnterSoft } from "@/lib/motion";

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
        <div className="footer-main-grid grid gap-8 lg:grid-cols-[1.2fr_1fr_auto] lg:items-start lg:gap-10 lg:text-left">
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
              className="gold-link mt-5 inline-block text-sm"
            >
              A SprintZero Studio product →
            </a>
          </div>

          <hr aria-hidden="true" className="footer-mobile-divider lg:hidden" />

          <div className="footer-reveal footer-link-grid grid grid-cols-3 gap-6 opacity-0">
            {Object.entries(footerLinkGroups).map(([group, links]) => (
              <nav key={group} aria-label={`Footer ${group} links`}>
                <p className="font-mono-text mb-4 text-xs uppercase tracking-[0.14em] text-[var(--gold)]">
                  {group}
                </p>
                <ul className="grid gap-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="focus-ring rounded-sm text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <hr aria-hidden="true" className="footer-mobile-divider lg:hidden" />

          <div className="footer-reveal footer-social-block w-fit opacity-0 lg:justify-self-end">
            <ul className="footer-social grid gap-3">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link focus-ring rounded-sm text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
                  >
                    {item.label}
                    {item.handle ? ` · ${item.handle}` : null} ↗
                  </a>
                </li>
              ))}
            </ul>
            <p className="footer-location font-mono-text mt-6 text-sm text-[var(--text-tertiary)]">
              Made in Chandigarh · 2026
            </p>
          </div>
        </div>

        <div className="footer-bar">
          <span>© 2026 SprintZero Studio</span>
          <span>v0.5 · early access</span>
        </div>
      </Container>
    </footer>
  );
}
