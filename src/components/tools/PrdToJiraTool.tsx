"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { ghostButtonClass, primaryButtonClass } from "@/components/cta/PrimaryCta";
import { trackToolUsed } from "@/lib/analytics/events";
import {
  DEFAULT_OPTIONS,
  buildCsv,
  csvFileName,
  parsePrdMarkdown,
  planRows,
  sanitizeLabel,
  type ChildType,
  type CsvOptions,
  type CsvPart,
  type JiraEpic,
  type JiraFormat,
  type JiraItem,
  type PlannedRow,
} from "@/lib/tools/prd-to-jira";

const TOOL = "prd_to_jira_csv";

const PLACEHOLDER = `# Checkout revamp

## Payments
- Apple Pay: one-tap pay on iOS Safari
- Save cards for returning buyers
  - Tokenized, no raw card numbers stored

## Must have
- Guest checkout
- Order confirmation email

Epic: Reporting
- Weekly revenue digest`;

const btnPrimary = `${primaryButtonClass} h-11 gap-2 px-5 text-[0.95rem] disabled:pointer-events-none disabled:opacity-45`;
const btnGhost = `${ghostButtonClass} h-10 px-4 text-[0.88rem]`;
const btnGhostSm = `${ghostButtonClass} h-9 px-3.5 text-[0.82rem]`;

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

function StepLabel({ n, id, children }: { n: string; id?: string; children: ReactNode }) {
  return (
    <h2 id={id} tabIndex={id ? -1 : undefined} className="flex items-baseline gap-3 outline-none">
      <span className="font-mono text-xs text-signal">{n}</span>
      <span className="text-[1.05rem] font-semibold tracking-[-0.01em] text-fg">{children}</span>
    </h2>
  );
}

function Legend({ children }: { children: ReactNode }) {
  return <legend className="mb-2.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fg-3">{children}</legend>;
}

function Icon({ d, className = "size-4" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  download: "M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10",
  copy: "M5.5 5.5V3.25c0-.4.34-.75.75-.75h6.5c.41 0 .75.35.75.75v6.5c0 .41-.34.75-.75.75H10.5M3.25 5.5h6.5c.41 0 .75.34.75.75v6.5c0 .41-.34.75-.75.75h-6.5a.75.75 0 0 1-.75-.75v-6.5c0-.41.34-.75.75-.75Z",
  check: "M3.5 8.5 6.5 11.5 12.5 4.5",
  trash: "M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.4c.03.34.31.6.65.6h4.5c.34 0 .62-.26.65-.6l.6-8.4",
  spark: "M8 2v3M8 11v3M2 8h3M11 8h3M4 4l1.8 1.8M10.2 10.2 12 12M12 4l-1.8 1.8M5.8 10.2 4 12",
  info: "M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM8 7.5v3.5M8 5h.01",
  lock: "M4.5 7V5.25a3.5 3.5 0 1 1 7 0V7M3.75 7h8.5c.41 0 .75.34.75.75v5.5c0 .41-.34.75-.75.75h-8.5a.75.75 0 0 1-.75-.75v-5.5c0-.41.34-.75.75-.75Z",
};

const priorityTone: Record<string, string> = {
  High: "border-[var(--signal-line)] bg-signal-soft text-fg",
  Medium: "border-line-2 bg-surface-2 text-fg",
  Low: "border-line bg-transparent text-fg-2",
  Lowest: "border-line bg-transparent text-fg-3",
};

function scrollToEl(el: HTMLElement | null) {
  if (!el) return;
  const top = el.getBoundingClientRect().top;
  if (top > 0 && top < window.innerHeight * 0.6) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -96 });
  else window.scrollTo({ top: window.scrollY + top - 96, behavior: "smooth" });
}

/** Edits apply to the parsed model by key; the CSV is always derived from it. */
function patchItem(epics: JiraEpic[], key: string, patch: Partial<JiraItem>): JiraEpic[] {
  return epics.map((e) =>
    e.key === key
      ? { ...e, ...patch }
      : e.stories.some((s) => s.key === key)
        ? { ...e, stories: e.stories.map((s) => (s.key === key ? { ...s, ...patch } : s)) }
        : e,
  );
}

export function PrdToJiraTool({ exampleMarkdown, exampleName }: { exampleMarkdown: string; exampleName: string }) {
  const uid = useId();
  const [source, setSource] = useState("");
  const [parsedFrom, setParsedFrom] = useState<string | null>(null);
  const [epics, setEpics] = useState<JiraEpic[] | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [title, setTitle] = useState<string | null>(null);
  const [options, setOptions] = useState<CsvOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);
  const [undo, setUndo] = useState<{ epics: JiraEpic[]; message: string } | null>(null);
  const reviewRef = useRef<HTMLElement>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const timer = copyTimer;
    return () => window.clearTimeout(timer.current);
  }, []);

  const plan = useMemo(() => (epics ? planRows(epics, options) : null), [epics, options]);
  const output = useMemo(() => (plan ? buildCsv(plan, options) : null), [plan, options]);

  const set = <K extends keyof CsvOptions>(key: K, value: CsvOptions[K]) => setOptions((o) => ({ ...o, [key]: value }));
  const counts = (p = plan) => ({ epics: p?.epicCount ?? 0, stories: p?.storyCount ?? 0 });

  const runParse = (text: string, action: "convert" | "load_example") => {
    const result = parsePrdMarkdown(text);
    setEpics(result.epics);
    setNotes(result.notes);
    setTitle(result.title);
    setParsedFrom(text);
    setUndo(null);
    const p = planRows(result.epics, options);
    trackToolUsed(TOOL, { action, ...counts(p), format: options.format });
    if (action === "convert") {
      requestAnimationFrame(() => {
        scrollToEl(reviewRef.current);
        reviewRef.current?.querySelector<HTMLElement>("h2[tabindex]")?.focus({ preventScroll: true });
      });
    }
  };

  const convert = () => {
    if (source.trim()) runParse(source, "convert");
  };

  const loadExample = () => {
    setSource(exampleMarkdown);
    runParse(exampleMarkdown, "load_example");
  };

  const clear = () => {
    setSource("");
    setEpics(null);
    setNotes([]);
    setTitle(null);
    setParsedFrom(null);
    setUndo(null);
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output.csv);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = output.csv;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    trackToolUsed(TOOL, { action: "copy", ...counts(), format: options.format });
  };

  const download = (part: CsvPart = "all") => {
    if (!plan) return;
    const { csv } = buildCsv(plan, options, part);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = csvFileName(title, options.format, part);
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    trackToolUsed(TOOL, { action: "download", ...counts(), format: options.format, part });
  };

  const edit = (key: string, patch: Partial<JiraItem>) => setEpics((prev) => (prev ? patchItem(prev, key, patch) : prev));

  const remove = (row: PlannedRow) => {
    if (!epics) return;
    if (row.kind === "epic") {
      const epic = epics.find((e) => e.key === row.key);
      setUndo({ epics, message: `Deleted epic “${row.summary}”${epic?.stories.length ? ` and ${plural(epic.stories.length, "story", "stories")}` : ""}.` });
      setEpics(epics.filter((e) => e.key !== row.key));
    } else {
      setUndo({ epics, message: `Deleted “${row.summary || "untitled story"}”.` });
      setEpics(epics.map((e) => (e.key === row.epicKey ? { ...e, stories: e.stories.filter((s) => s.key !== row.key) } : e)));
    }
  };

  const move = (storyKey: string, fromKey: string, toKey: string) => {
    setEpics((prev) => {
      if (!prev || fromKey === toKey) return prev;
      const story = prev.find((e) => e.key === fromKey)?.stories.find((s) => s.key === storyKey);
      if (!story) return prev;
      return prev.map((e) =>
        e.key === fromKey
          ? { ...e, stories: e.stories.filter((s) => s.key !== storyKey) }
          : e.key === toKey
            ? // Moving into a MoSCoW bucket epic adopts that bucket's priority.
              { ...e, stories: [...e.stories, e.moscow ? { ...story, moscow: e.moscow } : story] }
            : e,
      );
    });
  };

  const stale = epics !== null && parsedFrom !== source;
  const epicRows = plan?.rows.filter((r) => r.kind === "epic") ?? [];
  const storiesByEpic = new Map<string, PlannedRow[]>();
  plan?.rows.forEach((r) => {
    if (r.kind === "story") storiesByEpic.set(r.epicKey, [...(storiesByEpic.get(r.epicKey) ?? []), r]);
  });
  const showPriority = !!output?.header.includes("Priority");
  const showLabels = !!output?.header.includes("Labels");
  const cloud = options.format === "cloud";
  const cleanLabel = sanitizeLabel(options.extraLabel);

  return (
    <div className="grid gap-4">
      {/* ---------- 01 + 02: input and settings ---------- */}
      <div className="card overflow-hidden">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StepLabel n="01">Paste your PRD</StepLabel>
              <div className="flex items-center gap-2">
                {source ? (
                  <button type="button" onClick={clear} className="h-9 rounded-full px-3 text-[0.82rem] text-fg-3 transition-colors hover:text-fg">
                    Clear
                  </button>
                ) : null}
                <button type="button" onClick={loadExample} className={btnGhostSm}>
                  <Icon d={ICONS.spark} className="size-3.5 text-signal" />
                  Load a real example
                </button>
              </div>
            </div>
            <label htmlFor={`${uid}-src`} className="sr-only">
              PRD or feature list in Markdown
            </label>
            <textarea
              id={`${uid}-src`}
              data-lenis-prevent
              value={source}
              onChange={(e) => setSource(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  convert();
                }
              }}
              placeholder={PLACEHOLDER}
              spellCheck={false}
              aria-describedby={`${uid}-hint`}
              className="mt-4 block h-72 w-full resize-y rounded-2xl border border-line bg-bg-2 p-4 font-mono text-[0.82rem] leading-relaxed text-fg transition-colors placeholder:text-fg-3/70 hover:border-line-2 focus:border-[var(--signal-line)] focus:outline-none sm:h-[23rem]"
            />
            <ul id={`${uid}-hint`} className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[0.7rem] text-fg-3">
              <li>
                <span className="text-fg-2">## Heading</span> → epic
              </li>
              <li>
                <span className="text-fg-2">- bullet</span> → story
              </li>
              <li>
                <span className="text-fg-2">Title: text</span> → description
              </li>
              <li>
                <span className="text-fg-2">Epic: Name</span> → epic
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
              <button type="button" onClick={convert} disabled={!source.trim()} className={btnPrimary}>
                Convert to Jira CSV
                <Icon d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" className="size-3.5" />
              </button>
              <p className="flex items-center gap-1.5 text-[0.8rem] text-fg-3">
                <Icon d={ICONS.lock} className="size-3.5" />
                Runs in your browser. Nothing is uploaded.
              </p>
            </div>
          </div>

          <div className="border-t border-line bg-bg-2/50 p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
            <StepLabel n="02">Jira settings</StepLabel>

            <fieldset className="mt-5">
              <Legend>Jira version</Legend>
              <div className="grid gap-2">
                {(
                  [
                    ["cloud", "Jira Cloud", "Parent", "Team-managed and company-managed spaces. Stories point at their epic's Work item ID."],
                    ["datacenter", "Jira Data Center", "Epic Link", "Self-hosted Jira. Epics get an Epic Name; stories reference it in Epic Link."],
                  ] as [JiraFormat, string, string, string][]
                ).map(([value, name, tag, body]) => {
                  const checked = options.format === value;
                  return (
                    <label
                      key={value}
                      className={`relative block cursor-pointer rounded-2xl border p-3.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal ${
                        checked ? "border-[var(--signal-line)] bg-signal-soft" : "border-line bg-surface hover:border-line-2"
                      }`}
                    >
                      <input type="radio" name={`${uid}-format`} value={value} checked={checked} onChange={() => set("format", value)} className="sr-only" />
                      <span className="flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className={`grid size-4 shrink-0 place-items-center rounded-full border ${checked ? "border-signal" : "border-line-2"}`}
                        >
                          {checked ? <span className="size-2 rounded-full bg-signal" /> : null}
                        </span>
                        <span className="text-[0.93rem] font-medium text-fg">{name}</span>
                        <span className="ml-auto rounded-full border border-line px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-fg-3">
                          {tag}
                        </span>
                      </span>
                      <span className="mt-1.5 block pl-[1.625rem] text-[0.8rem] leading-snug text-fg-2">{body}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <Legend>Bullets become</Legend>
              <div className="inline-flex rounded-full border border-line bg-surface p-1">
                {(["Story", "Task"] as ChildType[]).map((t) => {
                  const checked = options.childType === t;
                  return (
                    <label
                      key={t}
                      className={`cursor-pointer rounded-full px-4 py-1.5 text-[0.85rem] font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${
                        checked ? "bg-fg text-bg" : "text-fg-2 hover:text-fg"
                      }`}
                    >
                      <input type="radio" name={`${uid}-child`} value={t} checked={checked} onChange={() => set("childType", t)} className="sr-only" />
                      {t}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <Legend>MoSCoW headings</Legend>
              <div className="grid gap-2.5">
                {(
                  [
                    ["priority", "Priority column", "Must → High, Should → Medium, Could → Low"],
                    ["moscowLabel", "Label", "must-have, should-have, could-have"],
                    ["includeWont", "Include Won't-have items", "Skipped by default"],
                  ] as ["priority" | "moscowLabel" | "includeWont", string, string][]
                ).map(([key, name, hint]) => (
                  <label key={key} className="flex cursor-pointer items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={options[key]}
                      onChange={(e) => set(key, e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 cursor-pointer accent-signal"
                    />
                    <span className="text-[0.88rem] leading-snug text-fg">
                      {name}
                      <span className="block text-[0.76rem] text-fg-3">{hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <label htmlFor={`${uid}-label`} className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fg-3">
                Label every item <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <input
                id={`${uid}-label`}
                value={options.extraLabel}
                onChange={(e) => set("extraLabel", e.target.value)}
                placeholder="e.g. prd-import"
                autoComplete="off"
                className="h-10 w-full rounded-xl border border-line bg-surface px-3 text-[0.88rem] text-fg placeholder:text-fg-3/70 hover:border-line-2 focus:border-[var(--signal-line)] focus:outline-none"
              />
              {cleanLabel && cleanLabel !== options.extraLabel.trim() ? (
                <p className="mt-1.5 font-mono text-[0.7rem] text-fg-3">Jira labels can&apos;t contain spaces → {cleanLabel}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- 03: review and export ---------- */}
      <section ref={reviewRef} aria-labelledby={`${uid}-review`} className="card min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <StepLabel n="03" id={`${uid}-review`}>
              Review &amp; export
            </StepLabel>
            {plan ? (
              <>
                <p className="display-3 mt-3" aria-live="polite">
                  {plural(plan.epicCount, "epic")} <span className="text-fg-3">·</span> {plural(plan.storyCount, "story", "stories")}
                </p>
                <p className="mt-2 text-[0.85rem] text-fg-2">
                  {cloud ? (
                    <>
                      Each story&apos;s <span className="font-mono text-[0.8rem] text-fg">Parent</span> is its epic&apos;s{" "}
                      <span className="font-mono text-[0.8rem] text-fg">Work item ID</span>. Epics come first, as Jira requires.
                    </>
                  ) : (
                    <>
                      Each story&apos;s <span className="font-mono text-[0.8rem] text-fg">Epic Link</span> matches its epic&apos;s{" "}
                      <span className="font-mono text-[0.8rem] text-fg">Epic Name</span>. Epics come first.
                    </>
                  )}
                </p>
              </>
            ) : (
              <p className="mt-3 max-w-xl text-[0.92rem] text-fg-2">Your epics and stories appear here. Rename, move or delete anything before you export.</p>
            )}
          </div>
          {plan && output ? (
            <div className="flex flex-wrap items-center gap-2.5">
              <button type="button" onClick={copy} disabled={!plan.rows.length} className={`${btnGhost} disabled:opacity-45`}>
                <Icon d={copied ? ICONS.check : ICONS.copy} className={`size-4 ${copied ? "text-ok" : ""}`} />
                <span aria-live="polite">{copied ? "Copied" : "Copy CSV"}</span>
              </button>
              <button type="button" onClick={() => download()} disabled={!plan.rows.length} className={btnPrimary}>
                <Icon d={ICONS.download} className="size-4" />
                Download .csv
              </button>
            </div>
          ) : null}
        </div>

        {stale ? (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--signal-line)] bg-signal-soft px-4 py-3 text-[0.85rem] text-fg">
            <Icon d={ICONS.info} className="size-4 shrink-0 text-signal" />
            <span className="min-w-0 flex-1">You changed the PRD after converting. Convert again to refresh (this replaces edits made below).</span>
            <button type="button" onClick={convert} disabled={!source.trim()} className={btnGhostSm}>
              Convert again
            </button>
          </div>
        ) : null}

        {plan && (notes.length || plan.wontHidden || plan.emptySkipped) ? (
          <ul className="mt-5 grid gap-1.5">
            {[
              ...notes,
              ...(plan.wontHidden ? [`${plural(plan.wontHidden, "Won't-have item")} left out. Tick “Include Won't-have items” to export them.`] : []),
              ...(plan.emptySkipped ? [`${plural(plan.emptySkipped, "story", "stories")} with an empty summary will be skipped.`] : []),
            ].map((n) => (
              <li key={n} className="flex gap-2 text-[0.84rem] leading-snug text-fg-2">
                <Icon d={ICONS.info} className="mt-0.5 size-3.5 shrink-0 text-fg-3" />
                {n}
              </li>
            ))}
          </ul>
        ) : null}

        {undo ? (
          <div role="status" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-2.5 text-[0.85rem] text-fg-2">
            <span className="min-w-0">{undo.message}</span>
            <span className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setEpics(undo.epics);
                  setUndo(null);
                }}
                className="rounded-full px-3 py-1 font-medium text-fg underline decoration-line-2 underline-offset-4 hover:decoration-signal"
              >
                Undo
              </button>
              <button type="button" onClick={() => setUndo(null)} aria-label="Dismiss" className="grid size-7 place-items-center rounded-full text-fg-3 hover:text-fg">
                <Icon d="M4 4l8 8M12 4l-8 8" className="size-3.5" />
              </button>
            </span>
          </div>
        ) : null}

        {!plan ? (
          <EmptyState onExample={loadExample} exampleName={exampleName} />
        ) : !plan.rows.length ? (
          <div className="mt-6 rounded-2xl border border-dashed border-line-2 p-6 text-[0.92rem] text-fg-2">
            No epics or stories found. Start epics with <code className="font-mono text-fg">## Heading</code> or <code className="font-mono text-fg">Epic: Name</code>, and put
            each story on a <code className="font-mono text-fg">- bullet</code> underneath.
          </div>
        ) : (
          <>
            <div className="relative mt-6 overflow-x-auto rounded-2xl border border-line" role="region" aria-label="Epics and stories preview" tabIndex={0}>
              <table className="w-full min-w-[60rem] border-collapse text-left text-[0.86rem]">
                <thead>
                  <tr className="border-b border-line bg-surface-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fg-3">
                    {cloud ? (
                      <th scope="col" className="w-14 px-3 py-2.5 font-medium">
                        ID
                      </th>
                    ) : null}
                    <th scope="col" className={`w-20 py-2.5 font-medium ${cloud ? "px-2" : "px-3"}`}>
                      Type
                    </th>
                    <th scope="col" className="px-2 py-2.5 font-medium">
                      Summary
                    </th>
                    <th scope="col" className="px-2 py-2.5 font-medium">
                      Description
                    </th>
                    <th scope="col" className="w-52 px-2 py-2.5 font-medium">
                      {cloud ? "Parent" : "Epic Link"}
                    </th>
                    {showPriority ? (
                      <th scope="col" className="w-24 px-2 py-2.5 font-medium">
                        Priority
                      </th>
                    ) : null}
                    {showLabels ? (
                      <th scope="col" className="w-32 px-2 py-2.5 font-medium">
                        Labels
                      </th>
                    ) : null}
                    <th scope="col" className="w-12 px-2 py-2.5">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                {epicRows.map((epic) => (
                  <tbody key={epic.key} className="border-b border-line last:border-b-0">
                    <Row row={epic} epics={epicRows} cloud={cloud} showPriority={showPriority} showLabels={showLabels} onEdit={edit} onRemove={remove} onMove={move} />
                    {(storiesByEpic.get(epic.key) ?? []).map((story) => (
                      <Row
                        key={story.key}
                        row={story}
                        epics={epicRows}
                        cloud={cloud}
                        showPriority={showPriority}
                        showLabels={showLabels}
                        onEdit={edit}
                        onRemove={remove}
                        onMove={move}
                      />
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
            <p className="mt-2 font-mono text-[0.68rem] text-fg-3 sm:hidden">Swipe the table sideways to see every column →</p>

            {!cloud ? (
              <div className="mt-5 rounded-2xl border border-line bg-surface-2 p-4 text-[0.85rem] leading-relaxed text-fg-2">
                <p>
                  If Data Center&apos;s importer says it <em>cannot add value to CustomField Epic Link</em>, import the epics first, then the stories.
                  Atlassian recommends that order.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => download("epics")} className={btnGhostSm}>
                    <Icon d={ICONS.download} className="size-3.5" /> Epics only
                  </button>
                  <button type="button" onClick={() => download("stories")} className={btnGhostSm}>
                    <Icon d={ICONS.download} className="size-3.5" /> Stories only
                  </button>
                </div>
              </div>
            ) : null}

            <details className="group mt-5">
              <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-[0.86rem] font-medium text-fg-2 hover:text-fg [&::-webkit-details-marker]:hidden">
                <Icon d="M6 4l4 4-4 4" className="size-3.5 transition-transform group-open:rotate-90" />
                View raw CSV
                <span className="font-mono text-[0.7rem] text-fg-3">{output?.header.length} columns</span>
              </summary>
              <pre
                data-lenis-prevent
                className="mt-3 max-h-80 overflow-auto rounded-2xl border border-line bg-bg-2 p-4 font-mono text-[0.74rem] leading-relaxed text-fg-2"
              >
                {output?.csv}
              </pre>
            </details>
          </>
        )}
      </section>
    </div>
  );
}

function Row({
  row,
  epics,
  cloud,
  showPriority,
  showLabels,
  onEdit,
  onRemove,
  onMove,
}: {
  row: PlannedRow;
  epics: PlannedRow[];
  cloud: boolean;
  showPriority: boolean;
  showLabels: boolean;
  onEdit: (key: string, patch: Partial<JiraItem>) => void;
  onRemove: (row: PlannedRow) => void;
  onMove: (storyKey: string, fromKey: string, toKey: string) => void;
}) {
  const isEpic = row.kind === "epic";
  const field =
    "block w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 transition-colors hover:border-line focus:border-[var(--signal-line)] focus:bg-surface-2 focus:outline-none";
  const what = isEpic ? "epic" : "story";

  return (
    <tr className={`align-top ${isEpic ? "bg-surface-2/70" : ""}`}>
      {cloud ? <td className="px-3 py-2.5 font-mono text-[0.75rem] text-fg-3">{row.id}</td> : null}
      <td className={`py-2 ${cloud ? "px-2" : "px-3"}`}>
        <span
          className={`inline-flex items-center rounded-full border px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.08em] ${
            isEpic ? "border-[var(--signal-line)] bg-signal-soft text-fg" : "border-line text-fg-2"
          }`}
        >
          {row.type}
        </span>
      </td>
      <td className="min-w-[15rem] px-2 py-1.5">
        <div className="flex items-start">
          {!isEpic ? <span aria-hidden="true" className="ml-1 mr-0.5 mt-1.5 inline-block h-3 w-3 shrink-0 rounded-bl-md border-b border-l border-line-2" /> : null}
          {/* One logical line that wraps, so long summaries stay readable. */}
          <textarea
            value={row.summary}
            onChange={(e) => onEdit(row.key, { summary: e.target.value.replace(/\s*\n\s*/g, " ") })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            aria-label={`Summary of ${what} ${row.id}`}
            maxLength={255}
            rows={Math.max(1, Math.ceil(row.summary.length / 34))}
            className={`${field} field-sizing-content resize-none leading-snug ${isEpic ? "font-semibold text-fg" : "text-fg"}`}
          />
        </div>
      </td>
      <td className="min-w-[17rem] px-2 py-1.5">
        <DescriptionCell value={row.description} label={`description of ${what} ${row.id}`} field={field} onChange={(description) => onEdit(row.key, { description })} />
      </td>
      <td className="min-w-[12rem] px-2 py-1.5">
        {isEpic ? (
          <span className="block px-2 py-1.5 font-mono text-[0.75rem] text-fg-3">
            {!cloud && row.epicName !== row.summary ? <span title="Epic Name, made unique">Epic Name: {row.epicName}</span> : "·"}
          </span>
        ) : (
          <select
            value={row.epicKey}
            onChange={(e) => onMove(row.key, row.epicKey, e.target.value)}
            aria-label={`Epic for story ${row.id}`}
            className="block w-full max-w-[13rem] cursor-pointer truncate rounded-lg border border-line bg-surface px-2 py-1.5 text-[0.8rem] text-fg-2 hover:border-line-2 focus:border-[var(--signal-line)] focus:outline-none"
          >
            {epics.map((e) => (
              <option key={e.key} value={e.key}>
                {cloud ? `${e.id} · ${e.summary}` : e.epicName}
              </option>
            ))}
          </select>
        )}
      </td>
      {showPriority ? (
        <td className="px-2 py-2">
          {row.priority ? (
            <span className={`inline-flex rounded-full border px-2 py-1 text-[0.72rem] font-medium ${priorityTone[row.priority] ?? "border-line text-fg-2"}`}>{row.priority}</span>
          ) : (
            <span className="px-2 text-fg-3">·</span>
          )}
        </td>
      ) : null}
      {showLabels ? (
        <td className="min-w-[7.5rem] px-2 py-2">
          <span className="flex flex-wrap gap-1">
            {row.labels.map((l) => (
              <span key={l} className="whitespace-nowrap rounded-md bg-surface-3 px-1.5 py-0.5 font-mono text-[0.66rem] text-fg-2">
                {l}
              </span>
            ))}
          </span>
        </td>
      ) : null}
      <td className="px-2 py-1.5 text-right">
        <button
          type="button"
          onClick={() => onRemove(row)}
          aria-label={`Delete ${what} “${row.summary}”${isEpic ? " and its stories" : ""}`}
          title={isEpic ? "Delete epic and its stories" : "Delete story"}
          className="grid size-8 place-items-center rounded-full text-fg-3 transition-colors hover:bg-surface-3 hover:text-fg"
        >
          <Icon d={ICONS.trash} className="size-4" />
        </button>
      </td>
    </tr>
  );
}

/** Clamped read view; click (or Enter) to edit in a textarea that grows with its text. */
function DescriptionCell({ value, label, field, onChange }: { value: string; label: string; field: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <textarea
        data-lenis-prevent
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          const end = e.currentTarget.value.length;
          e.currentTarget.setSelectionRange(end, end);
        }}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") e.currentTarget.blur();
        }}
        aria-label={label.charAt(0).toUpperCase() + label.slice(1)}
        rows={5}
        className={`${field} field-sizing-content max-h-72 min-h-[5.5rem] resize-y text-[0.82rem] leading-snug text-fg-2`}
      />
    );
  }
  return (
    <button type="button" onClick={() => setEditing(true)} className={`${field} cursor-text text-left text-[0.82rem] leading-snug`}>
      <span className="sr-only">Edit {label}: </span>
      {value ? <span className="line-clamp-3 whitespace-pre-line text-fg-2">{value}</span> : <span className="text-fg-3/70">Add a description</span>}
    </button>
  );
}

function EmptyState({ onExample, exampleName }: { onExample: () => void; exampleName: string }) {
  const rows: [string, string, string, string][] = [
    ["1", "Epic", "Payments", ""],
    ["2", "Story", "Apple Pay", "1"],
    ["3", "Story", "Save cards", "1"],
  ];
  return (
    <div className="mt-6 grid gap-6 rounded-2xl border border-dashed border-line-2 p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div aria-hidden="true" className="min-w-0 overflow-hidden font-mono text-[0.72rem]">
        <div className="grid grid-cols-[2.5rem_4rem_minmax(0,1fr)_3.5rem] gap-2 border-b border-line pb-2 uppercase tracking-[0.1em] text-fg-3">
          <span>ID</span>
          <span>Type</span>
          <span>Summary</span>
          <span>Parent</span>
        </div>
        {rows.map(([id, type, summary, parent]) => (
          <div key={id} className="grid grid-cols-[2.5rem_4rem_minmax(0,1fr)_3.5rem] items-center gap-2 border-b border-line py-2 text-fg-2 last:border-b-0">
            <span className="text-fg-3">{id}</span>
            <span className={type === "Epic" ? "text-signal" : ""}>{type}</span>
            <span className={`truncate ${type === "Epic" ? "text-fg" : "pl-3"}`}>{summary}</span>
            <span className={parent ? "text-fg" : "text-fg-3"}>{parent ? `→ ${parent}` : "·"}</span>
          </div>
        ))}
      </div>
      <div className="md:max-w-xs">
        <p className="text-[0.92rem] leading-relaxed text-fg-2">
          Paste a PRD and press Convert, or load the real <span className="text-fg">{exampleName}</span> PRD that Murmur wrote from a voice memo.
        </p>
        <button type="button" onClick={onExample} className={`${btnGhostSm} mt-4`}>
          <Icon d={ICONS.spark} className="size-3.5 text-signal" />
          Load a real example
        </button>
      </div>
    </div>
  );
}
