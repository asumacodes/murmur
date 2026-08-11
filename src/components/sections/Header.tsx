"use client";

import { useEffect, useRef, useState } from "react";
import { MurmurMark } from "@/components/brand/MurmurMark";
import { navItems } from "@/content/home";
import { GhostButton, VersionChip } from "@/components/ui";
import { features } from "@/config/features";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { trackWaitlistCtaClicked } from "@/lib/analytics/events";
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
          <MurmurMark className="size-7 shrink-0" />
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
            <GhostButton
              href="#early-access"
              className="text-sm"
              onClick={() => trackWaitlistCtaClicked("nav")}
            >
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
        className={`fixed inset-0 z-40 bg-black/55 transition-opacity duration-[280ms] ease-[var(--ease)] md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <nav
        id="mobile-nav-drawer"
        ref={drawerRef}
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-50 flex h-dvh w-[min(100%,20rem)] flex-col border-l border-[var(--border-gold)] bg-[var(--bg-elevated)] px-5 pt-5 pb-6 transition-transform duration-[320ms] ease-[var(--ease)] will-change-transform md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center gap-[0.65rem] border-b border-[var(--border-subtle)] pb-5">
          <span className="flex items-center gap-2">
            <MurmurMark className="size-6 shrink-0" />
            <span className="font-serif-display text-2xl italic text-[var(--gold)]">
              Murmur
            </span>
          </span>
          <VersionChip />
        </div>

        <ul className="m-0 grid list-none gap-[0.35rem] py-5">
          {headerNavItems.map((item, index) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <li key={item.href}>
                <a
                  ref={index === 0 ? firstDrawerLinkRef : undefined}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`block rounded px-3 py-[0.85rem] text-[0.9375rem] text-[var(--text-secondary)] transition-[background-color,color] duration-200 ease-[var(--ease)] hover:bg-[rgba(201,169,110,0.08)] hover:text-[var(--text-primary)] ${
                    isActive
                      ? "bg-[rgba(201,169,110,0.08)] text-[var(--text-primary)]"
                      : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto flex justify-center">
          <GhostButton
            href="#early-access"
            className="max-lg:min-w-[min(100%,16rem)] max-lg:max-w-[calc(100%-2rem)]"
            onClick={() => {
              trackWaitlistCtaClicked("nav");
              setOpen(false);
            }}
          >
            Join early access
          </GhostButton>
        </div>
      </nav>
    </header>
  );
}
