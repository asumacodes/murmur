"use client";

import { useId, useRef, useSyncExternalStore } from "react";
import { trackThemeToggled } from "@/lib/analytics/events";

type Theme = "light" | "dark";

export const THEME_EVENT = "mm:theme";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, currentTheme, () => "dark");
}

function applyTheme(next: Theme) {
  const root = document.documentElement;
  root.dataset.theme = next;
  try {
    localStorage.setItem("mm-theme", next);
  } catch {
    // private mode: theme just won't persist
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

/**
 * Sun/moon toggle. Where the View Transitions API exists, the new theme
 * spreads as a circle from the button; elsewhere it swaps instantly.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const maskId = `mm-moon-${useId().replace(/:/g, "")}`;

  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    trackThemeToggled(next);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (!doc.startViewTransition || reduce) {
      applyTheme(next);
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
    const y = rect ? rect.top + rect.height / 2 : 40;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = doc.startViewTransition(() => applyTheme(next));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  }

  const isDark = theme === "dark";

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`group relative grid size-10 place-items-center rounded-full border border-line text-fg-2 transition hover:border-line-2 hover:text-fg ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-[18px] overflow-visible" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <mask id={maskId}>
          <rect x="-4" y="-4" width="32" height="32" fill="white" />
          <circle
            cx={isDark ? 17 : 30}
            cy={isDark ? 7 : -6}
            r="6"
            fill="black"
            style={{ transition: "cx 0.5s var(--ease-out), cy 0.5s var(--ease-out)" }}
          />
        </mask>
        <circle
          cx="12"
          cy="12"
          r={isDark ? 7.5 : 4.5}
          fill="currentColor"
          stroke="none"
          mask={`url(#${maskId})`}
          style={{ transition: "r 0.5s var(--ease-out)" }}
        />
        <g
          style={{
            transformOrigin: "12px 12px",
            transform: isDark ? "rotate(-45deg) scale(0.4)" : "rotate(0) scale(1)",
            opacity: isDark ? 0 : 1,
            transition: "transform 0.5s var(--ease-out), opacity 0.3s",
          }}
          strokeLinecap="round"
        >
          <path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7L5.3 5.3" />
        </g>
      </svg>
    </button>
  );
}
