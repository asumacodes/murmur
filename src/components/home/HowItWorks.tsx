import { howItWorks, stages } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

function SpeakVisual() {
  return (
    <div className="relative flex h-full items-center justify-center" aria-hidden="true">
      <div className="relative grid size-20 place-items-center">
        <span className="absolute inset-0 rounded-full bg-signal/25 [animation:ping-ring_2.2s_var(--ease-out)_infinite]" />
        <span className="absolute inset-0 rounded-full bg-signal/20 [animation:ping-ring_2.2s_var(--ease-out)_0.7s_infinite]" />
        <span className="relative grid size-16 place-items-center rounded-full bg-signal text-on-signal">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21" />
          </svg>
        </span>
      </div>
      <div className="absolute bottom-4 left-1/2 flex h-8 -translate-x-1/2 items-end gap-[3px]">
        {Array.from({ length: 22 }, (_, i) => (
          <span
            key={i}
            className="bar-dance w-[3px] rounded-full bg-fg/70"
            style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${((i % 7) * 0.12).toFixed(2)}s`, animationDuration: `${(0.8 + (i % 5) * 0.15).toFixed(2)}s` }}
          />
        ))}
      </div>
      <span className="absolute right-4 top-4 rounded-full border border-line px-2 py-0.5 font-mono text-[0.66rem] text-fg-2">
        <span className="rec-dot mr-1.5 !size-1.5 text-signal" />
        0:49
      </span>
    </div>
  );
}

function StagesVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 px-5" aria-hidden="true">
      {stages.slice(1).map((s, i) => (
        <div key={s.id} className="flex items-center gap-2.5">
          <span
            className="size-2 rounded-full bg-line-2 [animation:stage-light_6.4s_linear_infinite]"
            style={{ animationDelay: `${(i * 0.8).toFixed(2)}s` }}
          />
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
            <span
              className="block h-full w-full origin-left rounded-full bg-fg-2/70 [animation:stage-fill_6.4s_linear_infinite]"
              style={{ animationDelay: `${(i * 0.8).toFixed(2)}s` }}
            />
          </span>
          <span className="w-24 truncate font-mono text-[0.62rem] uppercase tracking-[0.08em] text-fg-3">{s.name}</span>
        </div>
      ))}
    </div>
  );
}

function WorkspaceVisual() {
  const cols = [3, 2, 2];
  return (
    <div className="grid h-full grid-cols-3 gap-2 p-4" aria-hidden="true">
      {cols.map((count, c) => (
        <div key={c} className="rounded-lg border border-line bg-surface-2/60 p-1.5">
          <span className="mb-1.5 block h-1.5 w-2/3 rounded-full bg-fg-3/40" />
          <div className="grid gap-1.5">
            {Array.from({ length: count }, (_, i) => (
              <span
                key={i}
                className="block rounded-md border border-line bg-surface p-1.5 shadow-[var(--card-shadow)] [animation:card-drop_5s_var(--ease-out)_infinite]"
                style={{ animationDelay: `${(c * 0.35 + i * 0.22).toFixed(2)}s` }}
              >
                <span className="block h-1 w-4/5 rounded-full bg-fg-3/50" />
                <span className="mt-1 block h-1 w-1/2 rounded-full bg-fg-3/30" />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const visuals = [SpeakVisual, StagesVisual, WorkspaceVisual];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="section relative border-t border-line bg-bg-2">
      <div className="wrap">
        <SectionHeading id="how-title" eyebrow={howItWorks.eyebrow} title={howItWorks.title} accent={howItWorks.titleAccent} />
        <ol className="mt-14 grid gap-4 md:grid-cols-3">
          {howItWorks.steps.map((step, i) => {
            const Visual = visuals[i];
            return (
              <li
                key={step.n}
                data-reveal
                style={{ ["--reveal-i" as string]: i }}
                className="card spotlight group flex flex-col overflow-hidden"
              >
                <div className="relative h-44 border-b border-line bg-bg/40">
                  <Visual />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-signal">{step.n}</span>
                    <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-fg-3">
                      {step.meta}
                    </span>
                  </div>
                  <h3 className="display-3 mt-4">{step.title}</h3>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-fg-2">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
