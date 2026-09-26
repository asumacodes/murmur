import { sourceNumber, type Competitor } from "@/content/compare";

/** Footnote markers linking to the page's Sources list, e.g. [1][3]. */
export function Cite({ c, ids }: { c: Competitor; ids?: readonly string[] }) {
  if (!ids?.length) return null;
  const refs = ids.map((id) => ({ id, n: sourceNumber(c, id) })).sort((a, b) => a.n - b.n);
  return (
    // Plain inline span led by a word joiner (U+2060), so the marker never wraps away from the word it cites.
    <span className="relative -top-[0.45em] whitespace-nowrap font-mono text-[0.66em] leading-none">
      {"⁠"}
      {refs.map(({ id, n }) => {
        return (
          <a
            key={id}
            href={`#source-${id}`}
            aria-label={`Source ${n}: ${c.sources[id].title}`}
            className="ml-[0.2em] rounded-sm text-fg-3 transition-colors hover:text-signal"
          >
            [{n}]
          </a>
        );
      })}
    </span>
  );
}
