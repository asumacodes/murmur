"use client";

import { useEffect, useRef, useState } from "react";
import { navItems } from "@/content/home";
import { GhostButton, VersionChip } from "@/components/ui";
import { features } from "@/config/features";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { sectionSpyIds } from "@/lib/motion";

const headerNavItems = navItems.filter(
  (item) => features.studioLog || item.href !== "#studio-log",
);

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    >
      {open ? (
        <>
          <path d="M6 6l12 12M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const firstDrawerLinkRef = useRef<HTMLAnchorElement>(null);
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
    firstDrawerLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key === "Tab") {
        const focusable = [
          menuButtonRef.current,
          ...(drawerRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []),
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
      className={`site-header fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled
          ? "border-b border-[var(--border-subtle)] bg-[rgba(20,20,20,0.96)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="murmur-container flex h-20 items-center justify-between gap-4">
        <a href="#top" className="focus-ring flex items-center gap-2.5 rounded-lg">
          <span className="font-serif-display text-3xl italic text-[var(--gold)]">
            Murmur
          </span>
          <VersionChip />
        </a>

        <nav className="hidden md:block" aria-label="Primary navigation">
          <ul className="flex items-center gap-8">
            {headerNavItems.map((item) => {
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

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <GhostButton href="#early-access" className="text-sm">
              Join early access
            </GhostButton>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="mobile-menu-trigger focus-ring flex size-10 items-center justify-center rounded-sm border border-[var(--border-gold)] text-[var(--gold)] md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      <div
        className={`mobile-nav-backdrop md:hidden ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <nav
        id="mobile-nav-drawer"
        ref={drawerRef}
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={`mobile-nav-drawer md:hidden ${open ? "is-open" : ""}`}
      >
        <div className="mobile-nav-drawer-head">
          <span className="font-serif-display text-2xl italic text-[var(--gold)]">Murmur</span>
          <VersionChip />
        </div>

        <ul className="mobile-nav-list">
          {headerNavItems.map((item, index) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <li key={item.href}>
                <a
                  ref={index === 0 ? firstDrawerLinkRef : undefined}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`mobile-nav-link ${isActive ? "is-active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mobile-nav-cta">
          <GhostButton href="#early-access" className="mobile-nav-cta-btn" onClick={() => setOpen(false)}>
            Join early access
          </GhostButton>
        </div>
      </nav>
    </header>
  );
}
