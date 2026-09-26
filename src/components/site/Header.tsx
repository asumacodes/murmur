"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ctaMode } from "@/config/features";
import { ctaCopy } from "@/content/cta";
import { navItems, spyIds } from "@/content/nav";
import { PrimaryCta } from "@/components/cta/PrimaryCta";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { appLoginHref } from "@/lib/appUrl";
import { Wordmark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const NO_SPY: readonly string[] = [];

function hrefFor(href: string, isHome: boolean) {
  return isHome && href.startsWith("/#") ? href.slice(1) : href;
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(isHome ? spyIds : NO_SPY);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="wrap pt-3 sm:pt-4">
          <div
            className={`flex h-14 items-center justify-between gap-3 rounded-full border pl-4 pr-2 transition-[background-color,border-color,box-shadow] duration-500 sm:pl-5 ${
              scrolled || open
                ? "glass border-line shadow-[var(--card-shadow)]"
                : "border-transparent bg-transparent"
            }`}
          >
            <Link href="/" aria-label="Murmur home" className="rounded-full">
              <Wordmark />
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = item.id ? active === item.id : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={hrefFor(item.href, isHome)}
                        aria-current={isActive ? (item.id ? "location" : "page") : undefined}
                        className="relative isolate rounded-full px-3.5 py-2 text-[0.9rem] text-fg-2 transition-[color,background-color] duration-200 hover:bg-[color-mix(in_srgb,var(--fg)_7%,transparent)] hover:text-fg aria-[current]:text-fg"
                      >
                        {isActive ? (
                          <span className="absolute inset-0 -z-10 rounded-full bg-surface-3/70" aria-hidden="true" />
                        ) : null}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <ThemeToggle />
              {ctaMode === "signup" ? (
                <a
                  href={appLoginHref()}
                  className="hidden rounded-full px-3.5 py-2 text-[0.9rem] text-fg-2 transition-colors hover:text-fg md:inline-flex"
                >
                  {ctaCopy.signIn}
                </a>
              ) : null}
              <span className="hidden sm:block">
                <PrimaryCta location="nav" size="sm" />
              </span>
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="grid size-10 place-items-center rounded-full border border-line text-fg lg:hidden"
              >
                <span className="relative block h-3 w-4" aria-hidden="true">
                  <span
                    className={`absolute left-0 h-[1.5px] w-4 rounded bg-current transition-transform duration-300 ${
                      open ? "top-1.5 rotate-45" : "top-0"
                    }`}
                  />
                  <span
                    className={`absolute left-0 h-[1.5px] w-4 rounded bg-current transition-transform duration-300 ${
                      open ? "top-1.5 -rotate-45" : "top-3"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        inert={!open}
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col bg-bg px-[var(--gutter)] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 transition-[opacity,visibility] duration-400 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="flex-1">
          <ul className="grid gap-1">
            {[...navItems, { label: "FAQ", href: "/#faq", id: "faq" }].map((item, i) => (
              <li
                key={item.href}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                className={`transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                <Link
                  href={hrefFor(item.href, isHome)}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between border-b border-line py-4 font-display text-[2rem] font-semibold tracking-[-0.03em] text-fg"
                >
                  {item.label}
                  <span className="font-mono text-xs text-fg-3">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid gap-3">
          <PrimaryCta location="nav_mobile" size="lg" fullWidth onClick={() => setOpen(false)} />
          {ctaMode === "signup" ? (
            <a href={appLoginHref()} className="py-2 text-center text-sm text-fg-2">
              Already have an account? {ctaCopy.signIn}
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}
