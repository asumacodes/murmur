import Link from "next/link";
import { footerLinks } from "@/content/nav";
import { emails, socials } from "@/lib/site";
import { MurmurMark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

function Column({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 grid gap-2.5">
        {links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-[0.95rem] text-fg-2 transition-colors hover:text-fg"
              >
                {link.label}
                {external ? <span aria-hidden="true"> ↗</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-2">
      <div className="wrap pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <p className="display-3">
              Your next idea is <span className="serif-accent text-signal">one memo</span> away.
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-fg-2">
              Murmur is built in public by a one-person studio in Chandigarh. Questions go to a human:{" "}
              <a href={`mailto:${emails.hello}`} className="text-fg underline decoration-line-2 underline-offset-4 hover:decoration-signal">
                {emails.hello}
              </a>
            </p>
            <div className="mt-6 flex items-center gap-2">
              <ThemeToggle />
              <a href={socials.x} target="_blank" rel="noopener noreferrer" aria-label="Murmur on X" className="grid size-10 place-items-center rounded-full border border-line text-fg-2 transition hover:border-line-2 hover:text-fg">
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                  <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3zm-1.08 16.2h1.7L7.4 4.73H5.58l11.09 14.47z" />
                </svg>
              </a>
              <a href={socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="AsumaCodes on YouTube" className="grid size-10 place-items-center rounded-full border border-line text-fg-2 transition hover:border-line-2 hover:text-fg">
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                  <path d="M21.6 7.2a2.5 2.5 0 00-1.77-1.77C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 001.77-1.77A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3L10 15z" />
                </svg>
              </a>
              <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="AsumaCodes on GitHub" className="grid size-10 place-items-center rounded-full border border-line text-fg-2 transition hover:border-line-2 hover:text-fg">
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <Column title="Product" links={footerLinks.product} />
            <Column title="Resources" links={footerLinks.resources} />
            <Column title="Company" links={footerLinks.company} />
            <Column title="Legal" links={footerLinks.legal} />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-xs text-fg-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} SprintZero Studios (OPC) Private Limited · Chandigarh, India</p>
          <p className="font-mono">Voice → transcript → research → PRD → brand → tech design → Confluence → roadmap → Jira</p>
        </div>
      </div>

      <div className="pointer-events-none select-none px-[var(--gutter)]" aria-hidden="true">
        <div className="mx-auto flex max-w-[1320px] items-end gap-[2vw] pb-[1vw]">
          <MurmurMark className="h-[11vw] w-auto text-fg opacity-90" />
          <span className="font-display text-[19vw] font-semibold leading-[0.75] tracking-[-0.06em] text-fg [font-variation-settings:'wdth'_80]">
            murmur
          </span>
        </div>
      </div>
    </footer>
  );
}
