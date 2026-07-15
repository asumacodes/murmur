import { comingSoon } from "@/content/coming-soon";

export function ComingSoonFooter() {
  const { footer } = comingSoon;

  return (
    <footer className="coming-soon-footer cs-reveal">
      <p className="coming-soon-footer-legal">
        <a href={footer.privacy.href} className="coming-soon-footer-link">
          {footer.privacy.label}
        </a>
        <span aria-hidden="true" className="coming-soon-footer-sep">
          {" "}
          /{" "}
        </span>
        <a href={footer.terms.href} className="coming-soon-footer-link">
          {footer.terms.label}
        </a>
      </p>
      <a
        href={`mailto:${footer.contact}`}
        className="coming-soon-footer-link coming-soon-footer-contact"
      >
        {footer.contact}
      </a>
    </footer>
  );
}
