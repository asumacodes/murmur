import { comingSoon } from "@/content/coming-soon";

export function ComingSoonHeader() {
  return (
    <header className="coming-soon-header">
      <p className="coming-soon-brand cs-reveal font-serif-display italic text-[var(--gold)]">
        {comingSoon.brand}
      </p>
    </header>
  );
}
