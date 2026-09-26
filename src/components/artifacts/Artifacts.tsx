import type { ReactNode } from "react";
import { brandFontFamily } from "@/lib/brand-fonts";
import { hostOf, paletteOf, type RunExample } from "@/content/runs";

/* ---------- helpers ---------- */

export function shortStack(value: string, max = 30) {
  const cut = value.split(/\s\(|:\s|\s—\s|;\s|,\s|\.\s/)[0].trim();
  return cut.length > max ? `${cut.slice(0, max - 1).trim()}…` : cut;
}

export function clampText(text: string | undefined, max: number) {
  if (!text) return "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]$/, "")}…`;
}


export function ArtifactFrame({
  n,
  title,
  meta,
  status,
  children,
  className = "",
}: {
  n: string;
  title: string;
  meta?: ReactNode;
  status?: "waiting" | "writing" | "done";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card flex flex-col overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="font-mono text-[0.68rem] text-fg-3">{n}</span>
          <span className="truncate text-[0.9rem] font-medium text-fg">{title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {meta ? <span className="hidden font-mono text-[0.68rem] text-fg-3 sm:inline">{meta}</span> : null}
          {status ? <StatusPill status={status} /> : null}
        </div>
      </div>
      <div className="relative flex-1 p-4 sm:p-5">{children}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: "waiting" | "writing" | "done" }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-ok/12 px-2 py-0.5 font-mono text-[0.65rem] text-ok">
        <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M2.5 6.5l2.2 2.2L9.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Done
      </span>
    );
  }
  if (status === "writing") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-soft px-2 py-0.5 font-mono text-[0.65rem] text-signal">
        <span className="rec-dot !size-1.5" aria-hidden="true" />
        Writing
      </span>
    );
  }
  return <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.65rem] text-fg-3">Up next</span>;
}

/* ---------- artifacts ---------- */

export function CompetitorList({ run, limit = 4 }: { run: RunExample; limit?: number }) {
  const list = run.research.competitors.slice(0, limit);
  return (
    <ul className="grid gap-3">
      {list.map((c) => (
        <li key={c.name} className="flex gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 font-display text-sm font-semibold text-fg-2">
            {c.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-[0.9rem] font-medium text-fg">{clampText(c.name, 40)}</span>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="truncate font-mono text-[0.68rem] text-fg-3 underline decoration-line-2 underline-offset-2 hover:text-signal"
              >
                {hostOf(c.url)} ↗
              </a>
            </div>
            <p className="mt-0.5 line-clamp-2 text-[0.82rem] leading-snug text-fg-2">{c.positioning}</p>
          </div>
        </li>
      ))}
      {run.research.competitors.length > limit ? (
        <li className="font-mono text-[0.7rem] text-fg-3">+{run.research.competitors.length - limit} more in the full map</li>
      ) : null}
    </ul>
  );
}

export function PrdSummary({ run, mustLimit = 4 }: { run: RunExample; mustLimit?: number }) {
  const must = run.prd.features.must_have.slice(0, mustLimit);
  const wont = run.prd.features.wont_have[0];
  const metric = run.prd.successMetrics[0];
  return (
    <div className="grid gap-4">
      <p className="font-display text-[1.12rem] font-semibold leading-snug tracking-[-0.015em] text-fg">
        {clampText(run.prd.oneLiner, 190)}
      </p>
      <div>
        <p className="eyebrow !text-[0.64rem]">Must have</p>
        <ul className="mt-2 grid gap-1.5">
          {must.map((f) => (
            <li key={f.title} className="flex items-start gap-2 text-[0.86rem] text-fg-2">
              <span className="mt-[0.35rem] size-2.5 shrink-0 rounded-[3px] border border-signal/70 bg-signal-soft" aria-hidden="true" />
              {f.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {metric ? (
          <div className="rounded-xl border border-line bg-surface-2 p-3">
            <p className="eyebrow !text-[0.62rem]">Success metric</p>
            <p className="mt-1.5 text-[0.82rem] font-medium text-fg">{metric.metric}</p>
            <p className="mt-0.5 line-clamp-2 text-[0.78rem] text-fg-3">{metric.target}</p>
          </div>
        ) : null}
        {wont ? (
          <div className="rounded-xl border border-line bg-surface-2 p-3">
            <p className="eyebrow !text-[0.62rem]">Won&apos;t have</p>
            <p className="mt-1.5 text-[0.82rem] font-medium text-fg line-through decoration-signal/60">{wont.title}</p>
            <p className="mt-0.5 line-clamp-2 text-[0.78rem] text-fg-3">{wont.rationale || wont.description}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/**
 * The brand kit as a specimen: the run's own neutral as the page, its type
 * setting its own tagline, then the palette once (no repeated strips).
 */
export function BrandKit({ run, large = false }: { run: RunExample; large?: boolean }) {
  const p = run.brand.colorPalette;
  const palette = paletteOf(run);
  const heading = brandFontFamily(run.brand.typography.heading);
  const body = brandFontFamily(run.brand.typography.body);
  // Ink = whichever brand colour reads best on the brand's own neutral.
  const [ink, second] = [p.primary, p.secondary].sort((a, b) => contrast(b, p.neutral) - contrast(a, p.neutral));
  const mark = contrast(second, p.neutral) >= 2.2 ? second : ink;
  return (
    <div className="grid gap-3">
      <div className="relative overflow-hidden rounded-xl border border-line p-4 sm:p-5" style={{ background: p.neutral, color: ink }}>
        <div className="flex items-start justify-between gap-3">
          <span className={`leading-[0.8] ${large ? "text-[5rem]" : "text-[3.4rem]"}`} style={{ fontFamily: heading, color: mark, fontWeight: 600 }}>
            Aa
          </span>
          <span className="pt-1 text-right text-[0.64rem] font-medium uppercase tracking-[0.16em] opacity-70" style={{ fontFamily: body }}>
            {run.brand.brandName.split(":")[0]}
          </span>
        </div>
        <p className={`mt-4 leading-[1.08] ${large ? "text-[1.9rem]" : "text-[1.3rem]"}`} style={{ fontFamily: heading, fontWeight: 600, letterSpacing: "-0.01em" }}>
          {run.brand.tagline}
        </p>
        <span className="mt-4 block h-1 w-12 rounded-full" style={{ background: p.accent }} aria-hidden="true" />
      </div>

      <ul className="grid grid-cols-4 gap-2">
        {palette.map((c) => (
          <li key={c.name} className="min-w-0">
            <span className="block h-10 rounded-lg border border-line" style={{ background: c.hex }} />
            <span className="mt-1.5 block truncate text-[0.72rem] font-medium text-fg">{c.name}</span>
            <span className="block truncate font-mono text-[0.62rem] uppercase text-fg-3">{c.hex}</span>
          </li>
        ))}
      </ul>

      <p className="flex items-center justify-between gap-3 border-t border-line pt-3 text-[0.75rem] text-fg-3">
        <span className="truncate">
          <span style={{ fontFamily: heading }} className="text-fg">
            {run.brand.typography.heading}
          </span>{" "}
          / <span style={{ fontFamily: body }}>{run.brand.typography.body}</span> / <span className="font-mono">{run.brand.typography.mono}</span>
        </span>
        <span className="shrink-0">{run.brand.brandValues.length} brand values</span>
      </p>
    </div>
  );
}

export function EngineeringSummary({ run, tasks = 3 }: { run: RunExample; tasks?: number }) {
  const order = ["frontend", "backend", "database", "auth", "llm", "infra"];
  const stack = order
    .filter((k) => run.engineering.techStack[k])
    .map((k) => [k, shortStack(run.engineering.techStack[k])] as const)
    .slice(0, 5);
  return (
    <div className="grid gap-4">
      <dl className="grid gap-1.5">
        {stack.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3 border-b border-dashed border-line pb-1.5 last:border-0">
            <dt className="font-mono text-[0.66rem] uppercase tracking-[0.1em] text-fg-3">{k}</dt>
            <dd className="truncate text-right text-[0.8rem] text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex gap-2">
        <span className="rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-[0.72rem] text-fg-2">
          <strong className="font-semibold text-fg">{run.engineering.components.length}</strong> components
        </span>
        <span className="rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-[0.72rem] text-fg-2">
          <strong className="font-semibold text-fg">{run.engineering.dataModels.length}</strong> data models
        </span>
        <span className="rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-[0.72rem] text-fg-2">SQL schema</span>
      </div>
      {tasks > 0 ? (
        <ol className="grid gap-1 text-[0.8rem] text-fg-2">
          {run.engineering.tasks.slice(0, tasks).map((t, i) => (
            <li key={t.title} className="flex gap-2">
              <span className="font-mono text-[0.68rem] text-fg-3">{String(i + 1).padStart(2, "0")}</span>
              {t.title}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export function RoadmapPhases({ run }: { run: RunExample }) {
  const max = Math.max(...run.roadmap.map((p) => p.storyCount), 1);
  const labels = ["Now", "Next", "Later"];
  return (
    <ol className="grid gap-3">
      {run.roadmap.map((p, i) => (
        <li key={p.phase}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[0.82rem] font-medium text-fg">
              Phase {p.phase} <span className="font-normal text-fg-3">· {labels[i]}</span>
            </span>
            <span className="font-mono text-[0.68rem] text-fg-3">{p.storyCount} stories</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(p.storyCount / max) * 100}%`,
                background: i === 0 ? "var(--signal)" : i === 1 ? "var(--fg-2)" : "var(--fg-3)",
                marginLeft: `${i * 8}%`,
              }}
            />
          </div>
          <p className="mt-1 line-clamp-1 text-[0.72rem] text-fg-3">{p.epics.slice(0, 3).join(" · ")}</p>
        </li>
      ))}
    </ol>
  );
}

export function ConfluenceTree({ run }: { run: RunExample }) {
  const space = run.brand.brandName.split(":")[0];
  return (
    <div>
      <p className="flex items-center gap-2 text-[0.85rem] font-medium text-fg">
        <span className="grid size-5 place-items-center rounded bg-[#1868db] text-[0.6rem] font-bold text-white">C</span>
        {space} space
      </p>
      <ul className="mt-2.5 grid gap-1 border-l border-line pl-3">
        {run.confluence.pages.map((page) => (
          <li key={page} className="flex items-center gap-2 text-[0.8rem] text-fg-2">
            <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-fg-3" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M4 1.75h5.5L12.5 4.75v9.5h-8.5z" strokeLinejoin="round" />
              <path d="M9.25 1.75v3.25h3.25" strokeLinejoin="round" />
            </svg>
            {page}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JiraBoard({ run, epics = 4, stories = 3 }: { run: RunExample; epics?: number; stories?: number }) {
  const cols = run.jira.epics.filter((e) => e.stories.length > 0).slice(0, epics);
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[0.85rem] font-medium text-fg">
          <span className="grid size-5 place-items-center rounded bg-[#1868db] text-[0.6rem] font-bold text-white">J</span>
          {run.jira.projectKey}
          <span className="font-normal text-fg-3">
            · {run.jira.epicCount} epics · {run.jira.storyCount} stories
          </span>
        </p>
      </div>
      <div className="no-scrollbar -mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 sm:-mx-5 sm:px-5 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
        {cols.map((epic) => (
          <div key={epic.key} className="w-[15rem] shrink-0 snap-start rounded-xl border border-line bg-surface-2 p-2.5 lg:w-auto">
            <p className="flex items-center justify-between gap-2 px-1 pb-2">
              <span className="truncate text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-fg-2">{epic.title}</span>
              <span className="font-mono text-[0.62rem] text-fg-3">{epic.stories.length}</span>
            </p>
            <ul className="grid gap-1.5">
              {epic.stories.slice(0, stories).map((s) => (
                <li key={s.key} className="rounded-lg border border-line bg-surface p-2.5 shadow-[var(--card-shadow)]">
                  <p className="line-clamp-2 text-[0.78rem] leading-snug text-fg">{s.title}</p>
                  <p className="mt-1.5 flex items-center justify-between font-mono text-[0.6rem] text-fg-3">
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-sm bg-ok/80" aria-hidden="true" />
                      {s.key}
                    </span>
                    <span>P{s.phase}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
