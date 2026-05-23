import { Container } from "@/components/ui";
import { footerLinks } from "@/content/home";

const socialLinks = [
  { label: "YouTube", href: "https://www.youtube.com/@AsumaCodes" },
  { label: "X", href: "https://x.com/AsumaCodes" },
  { label: "GitHub", href: "https://github.com/asumacodes" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-12">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
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
            {Object.entries(footerLinks).map(([group, links]) => (
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

          <div className="lg:text-right">
            <ul className="flex gap-4 lg:justify-end">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="focus-ring gold-link rounded-sm text-sm text-[var(--gold)]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-[var(--text-tertiary)]">
              Made in Chandigarh · 2026
            </p>
          </div>
        </div>

        <div className="font-mono-text mt-12 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-6 text-xs uppercase tracking-[0.12em] text-[var(--text-tertiary)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 SprintZero Studio</span>
          <span>v0.5 - early access</span>
        </div>
      </Container>
    </footer>
  );
}
