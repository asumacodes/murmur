import type { Claim, Competitor } from "@/content/compare";
import { Cite } from "./Cite";

function Points({ c, items, tone }: { c: Competitor; items: Claim[]; tone: "them" | "murmur" }) {
  return (
    <ul className="mt-6 grid gap-4">
      {items.map((item) => (
        <li key={item.text} className={`flex gap-3 text-[0.98rem] leading-relaxed ${tone === "murmur" ? "text-fg" : "text-fg-2"}`}>
          <span aria-hidden="true" className={`mt-[0.62em] size-1.5 shrink-0 rounded-full ${tone === "murmur" ? "bg-signal" : "bg-fg-3"}`} />
          <span>
            {item.text}
            <Cite c={c} ids={item.src} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** The fair part: when the other tool is the better call, then when Murmur is. */
export function ChooseCards({ c }: { c: Competitor }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article data-reveal className="card p-6 sm:p-8">
        <p className="eyebrow">Pick {c.shortName} if</p>
        <h3 className="display-3 mt-3">When to choose {c.shortName} instead</h3>
        <Points c={c} items={c.chooseThem} tone="them" />
      </article>
      <article
        data-reveal
        style={{ ["--reveal-i" as string]: 1 }}
        className="relative overflow-hidden rounded-[var(--radius-card)] border border-signal/40 bg-signal-soft p-6 shadow-[var(--card-shadow)] sm:p-8"
      >
        <p className="eyebrow flex items-center gap-2">
          <span className="rec-dot text-signal" aria-hidden="true" /> Pick Murmur if
        </p>
        <h3 className="display-3 mt-3">When Murmur fits better</h3>
        <Points c={c} items={c.chooseMurmur} tone="murmur" />
      </article>
    </div>
  );
}
