import { compareRows, murmurCell, type Competitor } from "@/content/compare";
import { Cite } from "./Cite";

const headCell = "px-6 py-4 font-mono text-[0.7rem] uppercase tracking-[0.12em]";
const cellLabel = "mb-1.5 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] md:hidden";

/**
 * Murmur vs <competitor>, echoing the home page's by-hand table. ARIA table
 * roles keep row/column semantics while the layout stacks below md: each row
 * becomes a label plus two labelled cells; md+ is a three-column grid.
 */
export function CompareTable({ c }: { c: Competitor }) {
  return (
    <div role="table" aria-label={`Murmur vs ${c.name}`} className="overflow-hidden rounded-[1.5rem] border border-line">
      <div role="rowgroup" className="hidden md:block">
        <div role="row" className="grid grid-cols-[0.62fr_1fr_1fr] border-b border-line bg-surface">
          <span role="columnheader" className={`${headCell} text-fg-3`}>
            Compared on
          </span>
          <span role="columnheader" className={`${headCell} flex items-center gap-2 border-l border-line bg-signal-soft text-fg`}>
            <span className="rec-dot text-signal" aria-hidden="true" /> Murmur
          </span>
          <span role="columnheader" className={`${headCell} border-l border-line text-fg-3`}>
            {c.name}
          </span>
        </div>
      </div>

      <div role="rowgroup">
        {compareRows.map((row, i) => {
          const them = c.rows[row.key];
          return (
            <div
              key={row.key}
              role="row"
              data-reveal
              style={{ ["--reveal-i" as string]: i % 3 }}
              className="grid border-b border-line pb-5 md:grid-cols-[0.62fr_1fr_1fr] md:pb-0"
            >
              <span
                role="rowheader"
                className="px-4 pb-3 pt-5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.12em] text-fg-2 sm:px-6 md:py-5 md:font-sans md:text-[0.98rem] md:normal-case md:tracking-normal md:text-fg"
              >
                {row.label}
              </span>
              <div
                role="cell"
                className="mx-4 rounded-xl border border-signal/25 bg-signal-soft/50 px-4 py-3 sm:mx-6 md:mx-0 md:rounded-none md:border-0 md:border-l md:border-line md:bg-signal-soft/40 md:px-6 md:py-5"
              >
                <span className={`${cellLabel} text-fg`}>
                  <span className="rec-dot text-signal" aria-hidden="true" /> Murmur
                </span>
                <p className="text-[0.94rem] leading-relaxed text-fg">{murmurCell(c, row.key)}</p>
              </div>
              <div role="cell" className="px-4 pt-4 sm:px-6 md:border-l md:border-line md:py-5">
                <span className={`${cellLabel} text-fg-3`}>{c.name}</span>
                <p className="text-[0.94rem] leading-relaxed text-fg-2">
                  {them.text}
                  <Cite c={c} ids={them.src} />
                </p>
              </div>
            </div>
          );
        })}

        <div role="row" className="grid bg-surface md:grid-cols-[0.62fr_1fr_1fr]">
          <span role="rowheader" className="px-4 pb-3 pt-6 font-display text-lg font-semibold tracking-[-0.02em] text-fg sm:px-6 md:py-6">
            The short version
          </span>
          <div role="cell" className="mx-4 rounded-xl bg-signal-soft px-4 py-4 sm:mx-6 md:mx-0 md:rounded-none md:border-l md:border-line md:px-6 md:py-6">
            <span className={`${cellLabel} text-fg`}>
              <span className="rec-dot text-signal" aria-hidden="true" /> Murmur
            </span>
            <p className="font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-fg">{c.bottomLine.murmur}</p>
          </div>
          <div role="cell" className="px-4 pb-6 pt-4 sm:px-6 md:border-l md:border-line md:py-6">
            <span className={`${cellLabel} text-fg-3`}>{c.name}</span>
            <p className="font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-fg-2">{c.bottomLine.them}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
