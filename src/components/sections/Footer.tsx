import { Container } from "@/components/ui";
import { footerLinks } from "@/content/home";
import { features } from "@/config/features";

const footerLinkGroups = {
  ...footerLinks,
  studio: footerLinks.studio.filter(
    (link) => features.studioLog || link.href !== "#studio-log",
  ),
};

const socialLinks: { label: string; href: string; handle?: string }[] = [
  {
    label: "YouTube",
    handle: "@AsumaCodes",
    href: "https://www.youtube.com/@AsumaCodes",
  },
  { label: "X", handle: "@AsumaCodes", href: "https://x.com/AsumaCodes" },
  { label: "GitHub", href: "https://github.com/asumacodes" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-12">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_auto] lg:items-start">
          <div>
            <p className="font-serif-display text-4xl italic text-[var(--gold)]">
              Murmur
            </p>
            <p className="mt-3 text-[var(--text-secondary)]">
              Speak. Transcribe. Ship.
            </p>
            <a
              href="https://sprintzero.studio"
              className="gold-link mt-5 inline-block text-sm"
            >
              A SprintZero Studio product →
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6">
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

          <div className="w-fit lg:justify-self-end">
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
