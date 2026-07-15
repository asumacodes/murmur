import { comingSoon } from "@/content/coming-soon";
import { NotifyForm } from "@/components/coming-soon/NotifyForm";

export function ComingSoonHero() {
  const { social } = comingSoon;

  return (
    <div className="coming-soon-hero">
      <h1 className="coming-soon-headline cs-reveal font-serif-display italic">
        {comingSoon.headline}
      </h1>

      <p className="coming-soon-subhead cs-reveal">{comingSoon.subhead}</p>

      <p className="coming-soon-hook cs-reveal">{comingSoon.differentiation}</p>

      <p className="coming-soon-status cs-reveal font-mono-text">
        {comingSoon.statusDisplay}
      </p>

      <div className="coming-soon-ctas cs-reveal">
        <a
          href={social.x.href}
          target="_blank"
          rel="noopener noreferrer"
          className="coming-soon-btn coming-soon-btn--primary focus-ring"
        >
          {social.x.label}
        </a>
        <a
          href={social.youtube.href}
          target="_blank"
          rel="noopener noreferrer"
          className="coming-soon-btn coming-soon-btn--ghost focus-ring"
        >
          {social.youtube.label}
        </a>
      </div>

      <div className="coming-soon-form-wrap cs-reveal">
        <NotifyForm />
      </div>
    </div>
  );
}
