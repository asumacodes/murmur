"use client";

import { faq } from "@/content/faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { trackFaqOpened } from "@/lib/analytics/events";
import { emails } from "@/lib/site";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section relative">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="The honest" accent="answers." size="2" />
            <p data-reveal className="mt-6 max-w-sm text-[0.98rem] leading-relaxed text-fg-2">
              Something missing? Email{" "}
              <a href={`mailto:${emails.hello}`} className="text-fg underline decoration-line-2 underline-offset-4 hover:decoration-signal">
                {emails.hello}
              </a>
              . A human replies within one business day.
            </p>
          </div>
        </div>
        <div className="lg:col-span-8">
          <ul className="border-t border-line">
            {faq.map((item, i) => (
              <li key={item.q} data-reveal style={{ ["--reveal-i" as string]: i % 3 }} className="border-b border-line">
                <details
                  className="group"
                  onToggle={(e) => {
                    if ((e.currentTarget as HTMLDetailsElement).open) trackFaqOpened(item.q);
                  }}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                    <span className="text-[1.08rem] font-medium text-fg transition-colors group-hover:text-fg">{item.q}</span>
                    <span
                      aria-hidden="true"
                      className="relative grid size-8 shrink-0 place-items-center rounded-full border border-line text-fg-2 transition-[transform,border-color] duration-300 group-open:rotate-45 group-open:border-signal group-open:text-signal"
                    >
                      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 pr-12 text-[0.98rem] leading-relaxed text-fg-2 [animation:fade-rise_0.4s_var(--ease-out)_both]">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
