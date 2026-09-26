import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { StickyCta } from "./StickyCta";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-full bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
