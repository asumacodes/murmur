"use client";

import { useEffect, useRef, useState } from "react";
import { navItems } from "@/content/home";
import { GhostButton, VersionChip } from "@/components/ui";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { sectionSpyIds } from "@/lib/motion";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const activeSection = useScrollSpy(sectionSpyIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMobileLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key === "Tab") {
        const focusable = [
          menuButtonRef.current,
          ...(mobileNavRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []),
        ].filter(Boolean) as HTMLElement[];

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!first || !last) {
          return;
        }

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled
          ? "border-b border-[var(--border-subtle)] bg-[rgba(20,20,20,0.96)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="murmur-container flex h-20 items-center justify-between gap-6">
        <a href="#top" className="focus-ring rounded-lg">
          <span className="font-serif-display text-3xl italic text-[var(--gold)]">
            Murmur
          </span>
        </a>

        <nav className="hidden md:block" aria-label="Primary navigation">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;

              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className="focus-ring nav-link rounded-sm text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden md:block">
          <VersionChip />
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="focus-ring rounded-full border border-[var(--border-gold)] px-4 py-2 text-sm text-[var(--gold)] md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          ref={mobileNavRef}
          aria-label="Mobile navigation"
          className="murmur-container mb-4 grid gap-2 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 md:hidden"
        >
          <ul className="grid gap-2">
            {navItems.map((item, index) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;

              return (
                <li key={item.href}>
                  <a
                    ref={index === 0 ? firstMobileLinkRef : undefined}
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`focus-ring block rounded-2xl px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-[rgba(201,169,110,0.1)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[rgba(201,169,110,0.06)] hover:text-[var(--text-primary)]"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <GhostButton href="#early-access" onClick={() => setOpen(false)}>
            Join early access
          </GhostButton>
        </nav>
      ) : null}
    </header>
  );
}
