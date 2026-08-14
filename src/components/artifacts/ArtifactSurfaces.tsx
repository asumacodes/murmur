import { artifacts } from "@/content/artifacts";

export function BrandKitPanel() {
  const { brand } = artifacts;

  return (
    <div className="flex h-full flex-col gap-6 p-5 sm:p-6" aria-hidden="true">
      <div>
        <p className="font-mono-text text-[0.58rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
          {artifacts.surfaces.brand.panelTitle}
        </p>
        <p className="font-serif-display mt-2 text-2xl italic text-[var(--gold)]">
          {brand.productName}
        </p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{brand.tagline}</p>
      </div>

      <div>
        <p className="font-mono-text mb-3 text-[0.58rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
          Palette
        </p>
        <div className="grid grid-cols-4 gap-2">
          {brand.palette.map((swatch) => (
            <div key={swatch.hex} className="min-w-0">
              <span
                className="block aspect-square rounded-sm border border-[rgba(201,169,110,0.2)]"
                style={{ background: swatch.hex }}
              />
              <p className="font-mono-text mt-1.5 truncate text-[0.55rem] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                {swatch.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="font-mono-text text-[0.58rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            Display · {brand.type.display}
          </p>
          <p className="font-serif-display mt-2 text-3xl italic leading-none text-[var(--text-primary)]">
            {brand.type.displaySample}
          </p>
        </div>
        <div>
          <p className="font-mono-text text-[0.58rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            Body · {brand.type.body}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {brand.type.bodySample}
          </p>
        </div>
      </div>

      <div>
        <p className="font-mono-text mb-2 text-[0.58rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
          Brand values
        </p>
        <ul className="space-y-1.5">
          {brand.values.map((value) => (
            <li
              key={value}
              className="border-l-2 border-[var(--gold)] pl-3 text-sm text-[var(--text-secondary)]"
            >
              {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function JiraBoardPanel() {
  const { jira } = artifacts;

  return (
    <div className="flex h-full flex-col gap-4 p-5 sm:p-6" aria-hidden="true">
      <p className="font-mono-text text-[0.58rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
        {artifacts.surfaces.jira.panelTitle}
      </p>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
        {jira.columns.map((column) => (
          <div
            key={column.name}
            className="flex min-w-0 flex-col rounded-sm border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-elevated)_70%,transparent)] p-2 sm:p-2.5"
          >
            <p className="font-mono-text mb-2 text-[0.55rem] uppercase tracking-[0.12em] text-[var(--gold)]">
              {column.name}
              <span className="ml-1.5 text-[var(--text-tertiary)]">
                {column.cards.length}
              </span>
            </p>
            <div className="flex flex-col gap-2">
              {column.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-sm border border-[color-mix(in_srgb,var(--border-gold)_40%,transparent)] bg-[color-mix(in_srgb,var(--bg-deep)_55%,transparent)] px-2 py-2"
                >
                  <p className="font-mono-text text-[0.5rem] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                    {card.epic}
                  </p>
                  <p className="mt-1 text-[0.7rem] leading-snug text-[var(--text-primary)] sm:text-xs">
                    {card.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConfluenceSpacePanel() {
  const { confluence } = artifacts;

  return (
    <div className="flex h-full flex-col gap-4 p-5 sm:p-6" aria-hidden="true">
      <div>
        <p className="font-mono-text text-[0.58rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
          {artifacts.surfaces.confluence.panelTitle}
        </p>
        <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
          {confluence.spaceName}
        </p>
      </div>
      <ul className="space-y-1 border-t border-[var(--border-subtle)] pt-3">
        {confluence.pages.map((page) => (
          <li
            key={`${page.depth}-${page.title}`}
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--gold)_6%,transparent)]"
            style={{ paddingLeft: `${0.5 + page.depth * 0.85}rem` }}
          >
            <span
              className="size-1.5 shrink-0 rounded-full bg-[var(--gold)]"
              aria-hidden="true"
            />
            <span
              className={
                page.depth === 0
                  ? "font-medium text-[var(--text-primary)]"
                  : undefined
              }
            >
              {page.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
