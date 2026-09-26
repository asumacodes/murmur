import { stack } from "@/content/home";

export function StackStrip() {
  const items = [...stack.items, ...stack.items];
  return (
    <section aria-label="Built on" className="border-y border-line bg-bg-2 py-8">
      <div className="wrap flex flex-col gap-5 md:flex-row md:items-center">
        <p className="eyebrow shrink-0 md:w-40">{stack.eyebrow}</p>
        <div className="edge-fade-x relative flex-1 overflow-hidden">
          <ul className="animate-marquee flex w-max items-center gap-10 pr-10 [--marquee-duration:36s] hover:[animation-play-state:paused]">
            {items.map((item, i) => (
              <li key={`${item.name}-${i}`} className="flex items-baseline gap-2.5 whitespace-nowrap" aria-hidden={i >= stack.items.length}>
                <span className="font-display text-2xl font-semibold tracking-[-0.03em] text-fg">{item.name}</span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-fg-3">{item.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
