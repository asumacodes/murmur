import type { Metadata } from "next";
import { SimplePage } from "@/components/site/SimplePage";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Murmur is a product of SprintZero Studios, built in public by a solo founder in Chandigarh. No fake scarcity, no invented metrics.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <SimplePage eyebrow={about.eyebrow} title={about.headline}>
      <div className="space-y-5 text-[1.08rem] leading-relaxed text-fg-2">
        {about.body.map((para) => (
          <p key={para.slice(0, 32)}>{para}</p>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-2">
        {about.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-4 py-2 text-sm text-fg-2 transition hover:border-line-2 hover:text-fg"
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </SimplePage>
  );
}
