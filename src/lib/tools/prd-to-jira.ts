/**
 * PRD (Markdown) → Jira CSV. Pure functions only: no DOM, no imports, so the
 * same code runs in the browser tool and in a plain Node test.
 *
 * Import formats (researched Sep 2026):
 * - Jira Cloud: one CSV, epics first, each row has a unique numeric
 *   "Work item ID"; children point at it through "Parent". Works for team-
 *   and company-managed spaces (Epic Link was replaced by Parent in Cloud).
 *   https://support.atlassian.com/jira-cloud-administration/docs/import-data-from-a-csv-file/
 * - Jira Data Center: epics carry an "Epic Name"; stories reference it via
 *   "Epic Link".
 *   https://support.atlassian.com/jira/kb/fix-epic-link-csv-import-format-errors-jira/
 */

export type Moscow = "must" | "should" | "could" | "wont";

export type JiraItem = {
  key: string;
  summary: string;
  description: string;
  moscow: Moscow | null;
};

export type JiraEpic = JiraItem & { stories: JiraItem[] };

export type ParseResult = {
  /** The document title when a single `#` heading introduces `##` sections. */
  title: string | null;
  epics: JiraEpic[];
  /** Plain-English notes about anything the parser skipped or changed. */
  notes: string[];
};

export type JiraFormat = "cloud" | "datacenter";
export type ChildType = "Story" | "Task";

export type CsvOptions = {
  format: JiraFormat;
  childType: ChildType;
  /** Add a Priority column from MoSCoW headings. */
  priority: boolean;
  /** Add a must-have / should-have… label from MoSCoW headings. */
  moscowLabel: boolean;
  /** Keep items that sit under a "Won't have" heading. */
  includeWont: boolean;
  /** A label added to every row, e.g. "prd-import". Sanitised for Jira. */
  extraLabel: string;
};

export const DEFAULT_OPTIONS: CsvOptions = {
  format: "cloud",
  childType: "Story",
  priority: true,
  moscowLabel: true,
  includeWont: false,
  extraLabel: "",
};

export const MOSCOW_PRIORITY: Record<Moscow, string> = {
  must: "High",
  should: "Medium",
  could: "Low",
  wont: "Lowest",
};

export const MOSCOW_LABEL: Record<Moscow, string> = {
  must: "must-have",
  should: "should-have",
  could: "could-have",
  wont: "wont-have",
};

export const MOSCOW_NAME: Record<Moscow, string> = {
  must: "Must have",
  should: "Should have",
  could: "Could have",
  wont: "Won't have",
};

/** Jira rejects summaries longer than 255 characters. */
export const SUMMARY_MAX = 255;

/* ------------------------------------------------------------------ */
/* Inline Markdown helpers                                             */
/* ------------------------------------------------------------------ */

const EMPHASIS_PAIR = /(\*\*|__|~~)(.+?)\1/g;

/** Markdown inline → plain text, for summaries. */
export function stripInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(EMPHASIS_PAIR, "$2")
    .replace(/(^|[\s(])[*_]([^\s*_](?:[^*_]*[^\s*_])?)[*_](?=[\s).,:;!?]|$)/g, "$1$2")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/^(\*\*|__)|(\*\*|__)$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[:：]$/, "")
    .trim();
}

/** Lighter clean-up for descriptions: keep URLs, drop emphasis markers. */
function cleanDescriptionLine(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]*)\)/g, "$1 ($2)")
    .replace(/\[([^\]]+)\]\(([^)]*)\)/g, "$1 ($2)")
    .replace(EMPHASIS_PAIR, "$2")
    .replace(/`([^`]*)`/g, "$1")
    .trimEnd();
}

function normaliseQuotes(text: string) {
  return text.replace(/[\u2018\u2019\u02bc]/g, "'");
}

const MOSCOW_HAVE = /^(must|should|could|won'?t|will\s+not)[\s-]*haves?\b[\s:–—-]*(.*)$/i;
const MOSCOW_WORD = /^(must|should|could|won'?t)\s*(?:\(.*\))?$/i;

/**
 * Detects a MoSCoW heading ("Must have", "Should-haves", "Won't have (v1)",
 * or just "Must"). `bare` is true when the heading is only the bucket name.
 */
export function moscowOf(heading: string): { moscow: Moscow; bare: boolean } | null {
  const text = normaliseQuotes(stripInline(heading));
  const have = MOSCOW_HAVE.exec(text);
  const word = have ? null : MOSCOW_WORD.exec(text);
  const m = have ?? word;
  if (!m) return null;
  const w = m[1].toLowerCase();
  const moscow: Moscow = w.startsWith("must") ? "must" : w.startsWith("should") ? "should" : w.startsWith("could") ? "could" : "wont";
  const rest = have ? have[2].replace(/[()[\]]/g, "").trim() : "";
  const bare = rest === "" || /^(features?|requirements?|items?|scope|stories)$/i.test(rest);
  return { moscow, bare };
}

const BOLD_LEAD_SEP = /^(\*\*|__)(.+?)\1\s*(?:[:：]|[–—]|\s-\s)\s*(.*)$/;
const BOLD_LEAD_COLON_INSIDE = /^(\*\*|__)(.+?)[:：]\1\s*(.*)$/;

/**
 * Splits "Title: description" (or "Title — description", or a bold lead-in)
 * into a summary and a description. URLs and times ("10:30") never split.
 */
export function splitTitle(raw: string): { summary: string; description: string } {
  const text = raw.trim();
  const bold = BOLD_LEAD_COLON_INSIDE.exec(text) ?? BOLD_LEAD_SEP.exec(text);
  if (bold) {
    return { summary: stripInline(bold[2]), description: cleanDescriptionLine(bold[3].trim()) };
  }

  let cut = -1;
  let sepLength = 0;
  const colon = /[:：](?=\s|$)/g;
  let m: RegExpExecArray | null;
  while ((m = colon.exec(text))) {
    // A colon inside a Markdown link's URL is not a separator.
    if (/\]\([^)]*$/.test(text.slice(0, m.index))) continue;
    cut = m.index;
    sepLength = 1;
    break;
  }
  const dash = /\s[–—]\s/.exec(text);
  if (dash && (cut === -1 || dash.index < cut)) {
    cut = dash.index;
    sepLength = dash[0].length;
  }
  if (cut > 0 && cut <= 160) {
    const summary = stripInline(text.slice(0, cut));
    const description = cleanDescriptionLine(text.slice(cut + sepLength).trim());
    if (summary) return { summary, description };
  }
  return { summary: stripInline(text), description: "" };
}

/* ------------------------------------------------------------------ */
/* Parser                                                              */
/* ------------------------------------------------------------------ */

const HEADING = /^ {0,3}(#{1,6})[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/;
const BULLET = /^([ \t]*)(?:[-*+•▪◦‣]|\d{1,3}[.)])[ \t]+(.*)$/;
const HR = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/;
const FENCE = /^ {0,3}(```|~~~)/;
const EPIC_PREFIX = /^(?:\*\*|__)?\s*epic(?:\s*#?\d+)?\s*(?:\*\*|__)?\s*[:：]\s*(?:\*\*|__)?\s*/i;
const STORY_PREFIX = /^(?:\*\*|__)?\s*(?:user\s+)?story(?:\s*#?\d+)?\s*(?:\*\*|__)?\s*[:：]\s*(?:\*\*|__)?\s*/i;
const CHECKBOX = /^\[[ xX]\]\s+/;

function indentWidth(ws: string) {
  let n = 0;
  for (const ch of ws) n += ch === "\t" ? 4 : 1;
  return n;
}

type Draft = JiraItem & { lines: string[]; fromHeading?: boolean };
type EpicDraft = Draft & { stories: Draft[]; fallback?: boolean };

function finishText(lines: string[]) {
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function pushLine(target: Draft, line: string, paragraphBreak: boolean) {
  if (paragraphBreak && target.lines.length && target.lines[target.lines.length - 1] !== "") target.lines.push("");
  target.lines.push(line);
}

export function parsePrdMarkdown(markdown: string): ParseResult {
  const lines = markdown.replace(/\r\n?/g, "\n").replace(/\u00a0/g, " ").split("\n");

  // Pre-pass: which heading levels are epics?
  const headings: { level: number; index: number }[] = [];
  {
    let inCode = false;
    lines.forEach((line, index) => {
      if (FENCE.test(line)) inCode = !inCode;
      else if (!inCode) {
        const h = HEADING.exec(line);
        if (h && stripInline(h[2])) headings.push({ level: h[1].length, index });
      }
    });
  }
  const h1 = headings.filter((h) => h.level === 1);
  const firstH2 = headings.find((h) => h.level === 2);
  const titleMode = h1.length === 1 && firstH2 !== undefined && h1[0].index < firstH2.index;
  const minLevel = headings.length ? Math.min(...headings.map((h) => h.level)) : 1;
  const epicMaxLevel = titleMode ? 2 : Math.max(2, minLevel);
  const epicMinLevel = titleMode ? 2 : minLevel;
  const storyLevel = epicMaxLevel + 1;

  // Assigned inside closures too, so no narrowing from the initialiser.
  let title = null as string | null;
  const epics: EpicDraft[] = [];
  let epic = null as EpicDraft | null;
  let story = null as Draft | null;
  let storyIndent = 0;
  let sectionMoscow = null as Moscow | null;
  let moscowCtx = null as Moscow | null;
  let fenced = false;
  let blank = false;
  let seq = 0;
  let fallbackStories = 0;
  const fallbackName = () => title ?? "Backlog";

  const newEpic = (summary: string, moscow: Moscow | null, fallback = false): EpicDraft => {
    const e: EpicDraft = { key: `e${++seq}`, summary, description: "", moscow, lines: [], stories: [], fallback };
    epics.push(e);
    epic = e;
    story = null;
    return e;
  };

  const ensureEpic = (): EpicDraft => {
    if (epic) return epic;
    return newEpic(fallbackName(), sectionMoscow, true);
  };

  const newStory = (raw: string, indent: number, fromHeading: boolean) => {
    const target = ensureEpic();
    if (target.fallback) fallbackStories++;
    const { summary, description } = splitTitle(raw);
    const s: Draft = { key: `s${++seq}`, summary, description: "", moscow: moscowCtx, lines: description ? [description] : [], fromHeading };
    target.stories.push(s);
    story = s;
    storyIndent = indent;
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");

    if (fenced) {
      const target = story ?? epic;
      if (target) pushLine(target, rawLine, false);
      if (FENCE.test(line)) fenced = false;
      continue;
    }
    if (FENCE.test(line)) {
      fenced = true;
      const target = story ?? epic;
      if (target) pushLine(target, rawLine.trim(), blank);
      blank = false;
      continue;
    }
    if (!line.trim()) {
      blank = true;
      continue;
    }
    if (HR.test(line)) {
      blank = true;
      continue;
    }

    const h = HEADING.exec(line);
    if (h) {
      const level = h[1].length;
      const text = stripInline(h[2]);
      blank = false;
      if (!text) continue;

      if (titleMode && level === 1) {
        title = text;
        epic = null;
        story = null;
        sectionMoscow = null;
        moscowCtx = null;
        continue;
      }

      const mo = moscowOf(text);
      const isEpicLevel = level >= epicMinLevel && level <= epicMaxLevel;
      if (isEpicLevel || (level === storyLevel && !epic && mo?.bare)) {
        const name = stripInline(text.replace(EPIC_PREFIX, "")) || text;
        sectionMoscow = mo?.moscow ?? null;
        moscowCtx = sectionMoscow;
        newEpic(mo?.bare && title ? `${title}: ${name}` : name, sectionMoscow);
        continue;
      }
      if (level === storyLevel) {
        if (mo?.bare) {
          // "### Must have" inside an epic: a priority bucket, not a story.
          moscowCtx = mo.moscow;
          story = null;
          continue;
        }
        const saved = moscowCtx;
        if (mo) moscowCtx = mo.moscow;
        newStory(text.replace(STORY_PREFIX, ""), 0, true);
        moscowCtx = saved;
        continue;
      }
      // Deeper headings are just text inside whatever is open.
      const target = story ?? epic;
      if (target) pushLine(target, text, true);
      continue;
    }

    const bullet = BULLET.exec(line);
    const indent = bullet ? indentWidth(bullet[1]) : indentWidth(/^[ \t]*/.exec(line)?.[0] ?? "");
    let content = (bullet ? bullet[2] : line.trim()).replace(CHECKBOX, "");
    content = content.replace(/^>\s?/, "");

    // Flat lists: "Epic: Name" starts an epic.
    if ((!bullet || indent === 0) && EPIC_PREFIX.test(content)) {
      const name = stripInline(content.replace(EPIC_PREFIX, ""));
      if (name) {
        const { summary, description } = splitTitle(name);
        const e = newEpic(summary, sectionMoscow);
        if (description) e.lines.push(description);
        moscowCtx = sectionMoscow;
        blank = false;
        continue;
      }
    }

    // "Story: Title" (bulleted or not) is always a new story.
    if (STORY_PREFIX.test(content)) {
      newStory(content.replace(STORY_PREFIX, ""), bullet ? indent : 0, false);
      blank = false;
      continue;
    }

    if (bullet) {
      const current = story;
      if (current && (current.fromHeading || indent > storyIndent)) {
        pushLine(current, `- ${cleanDescriptionLine(content)}`, false);
      } else {
        newStory(content, indent, false);
      }
      blank = false;
      continue;
    }

    // Plain paragraph text.
    const text = cleanDescriptionLine(content);
    const current = story as Draft | null;
    if (current && (current.fromHeading || !blank || indent >= 2)) {
      pushLine(current, text, blank);
    } else if (epic) {
      story = null;
      pushLine(epic, text, blank);
    }
    // Text before any heading is the document's intro: ignored.
    blank = false;
  }

  // Finalise: descriptions, summary length, empty epics.
  const notes: string[] = [];
  const skipped: string[] = [];
  let truncated = 0;
  let untitled = 0;

  const finish = (d: Draft): JiraItem | null => {
    let description = finishText(d.lines);
    let summary = d.summary.trim();
    if (!summary && description) {
      summary = stripInline(description.split("\n")[0]);
      untitled++;
    }
    if (!summary) return null;
    if (summary.length > SUMMARY_MAX) {
      description = description ? `${summary}\n\n${description}` : summary;
      summary = `${summary.slice(0, SUMMARY_MAX - 1).trimEnd()}…`;
      truncated++;
    }
    return { key: d.key, summary, description, moscow: d.moscow };
  };

  const out: JiraEpic[] = [];
  for (const e of epics) {
    const stories = e.stories.map(finish).filter((s): s is JiraItem => s !== null);
    if (!stories.length) {
      skipped.push(e.summary);
      continue;
    }
    const head = finish(e);
    if (!head) continue;
    out.push({ ...head, stories });
  }

  if (skipped.length) {
    const names = skipped.slice(0, 4).map((s) => `“${s.length > 40 ? `${s.slice(0, 39)}…` : s}”`);
    const more = skipped.length > 4 ? ` and ${skipped.length - 4} more` : "";
    notes.push(
      `Skipped ${skipped.length} heading${skipped.length === 1 ? "" : "s"} with no bullets under ${skipped.length === 1 ? "it" : "them"}: ${names.join(", ")}${more}.`,
    );
  }
  if (fallbackStories) {
    notes.push(
      `${fallbackStories} ${fallbackStories === 1 ? "story" : "stories"} came before any heading, so ${fallbackStories === 1 ? "it was" : "they were"} grouped under an epic called “${fallbackName()}”. Rename it below.`,
    );
  }
  if (truncated) {
    notes.push(
      `${truncated} ${truncated === 1 ? "summary was" : "summaries were"} longer than Jira's ${SUMMARY_MAX}-character limit, so the full text moved into the description.`,
    );
  }
  if (untitled) {
    notes.push(`${untitled} ${untitled === 1 ? "item had" : "items had"} no title, so the first line of the description is used.`);
  }

  return { title, epics: out, notes };
}

/* ------------------------------------------------------------------ */
/* CSV                                                                 */
/* ------------------------------------------------------------------ */

/** RFC 4180 field escaping. */
export function csvEscape(value: string | number | null | undefined): string {
  const s = value == null ? "" : String(value).replace(/\r\n?/g, "\n");
  return /[",\n]|^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: (string | number)[][]): string {
  return rows.map((r) => r.map(csvEscape).join(",")).join("\r\n") + "\r\n";
}

/** Jira labels cannot contain spaces. */
export function sanitizeLabel(label: string): string {
  return label
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[,"'\\]/g, "")
    .slice(0, 255);
}

export type PlannedRow = {
  key: string;
  epicKey: string;
  kind: "epic" | "story";
  /** Work item ID (Cloud). Sequential, epics first. */
  id: number;
  type: string;
  summary: string;
  description: string;
  parentId: number | null;
  parentSummary: string | null;
  /** Data Center only: the unique Epic Name this epic is created with. */
  epicName: string | null;
  priority: string;
  labels: string[];
};

export type CsvPlan = {
  rows: PlannedRow[];
  epicCount: number;
  storyCount: number;
  /** Stories left out because their summary is empty. */
  emptySkipped: number;
  /** Items hidden because they are Won't have. */
  wontHidden: number;
};

export function planRows(epics: JiraEpic[], options: CsvOptions): CsvPlan {
  const extra = sanitizeLabel(options.extraLabel);
  let wontHidden = 0;
  let emptySkipped = 0;

  const keptEpics = epics
    .filter((e) => {
      if (!options.includeWont && e.moscow === "wont") {
        wontHidden += 1 + e.stories.length;
        return false;
      }
      return true;
    })
    .map((e) => ({
      ...e,
      stories: e.stories.filter((s) => {
        if (!options.includeWont && s.moscow === "wont") {
          wontHidden++;
          return false;
        }
        if (!s.summary.trim()) {
          emptySkipped++;
          return false;
        }
        return true;
      }),
    }));

  const labelsFor = (m: Moscow | null) => {
    const out: string[] = [];
    if (options.moscowLabel && m) out.push(MOSCOW_LABEL[m]);
    if (extra && !out.includes(extra)) out.push(extra);
    return out;
  };
  const priorityFor = (m: Moscow | null) => (options.priority && m ? MOSCOW_PRIORITY[m] : "");

  const usedNames = new Set<string>();
  const uniqueName = (name: string) => {
    let candidate = name;
    let n = 2;
    while (usedNames.has(candidate.toLowerCase())) candidate = `${name} (${n++})`;
    usedNames.add(candidate.toLowerCase());
    return candidate;
  };

  const rows: PlannedRow[] = [];
  const epicRows = new Map<string, PlannedRow>();
  let id = 0;
  for (const e of keptEpics) {
    const summary = e.summary.trim() || "Untitled epic";
    const row: PlannedRow = {
      key: e.key,
      epicKey: e.key,
      kind: "epic",
      id: ++id,
      type: "Epic",
      summary,
      description: e.description,
      parentId: null,
      parentSummary: null,
      epicName: uniqueName(summary),
      priority: priorityFor(e.moscow),
      labels: labelsFor(e.moscow),
    };
    rows.push(row);
    epicRows.set(e.key, row);
  }
  let storyCount = 0;
  for (const e of keptEpics) {
    const parent = epicRows.get(e.key)!;
    for (const s of e.stories) {
      storyCount++;
      rows.push({
        key: s.key,
        epicKey: e.key,
        kind: "story",
        id: ++id,
        type: options.childType,
        summary: s.summary.trim(),
        description: s.description,
        parentId: parent.id,
        parentSummary: parent.epicName,
        epicName: null,
        priority: priorityFor(s.moscow),
        labels: labelsFor(s.moscow),
      });
    }
  }

  return { rows, epicCount: keptEpics.length, storyCount, emptySkipped, wontHidden };
}

export type CsvPart = "all" | "epics" | "stories";

export function buildCsv(plan: CsvPlan, options: CsvOptions, part: CsvPart = "all"): { header: string[]; csv: string } {
  const rows = plan.rows.filter((r) => part === "all" || (part === "epics" ? r.kind === "epic" : r.kind === "story"));
  const withPriority = options.priority && plan.rows.some((r) => r.priority);
  const labelColumns = Math.max(0, ...plan.rows.map((r) => r.labels.length));
  const tail = (r: PlannedRow) => [
    ...(withPriority ? [r.priority] : []),
    ...Array.from({ length: labelColumns }, (_, i) => r.labels[i] ?? ""),
  ];
  const tailHeader = [...(withPriority ? ["Priority"] : []), ...Array.from({ length: labelColumns }, () => "Labels")];

  if (options.format === "cloud") {
    const header = ["Work item ID", "Work type", "Summary", "Description", "Parent", ...tailHeader];
    const body = rows.map((r) => [r.id, r.type, r.summary, r.description, r.parentId ?? "", ...tail(r)]);
    return { header, csv: toCsv([header, ...body]) };
  }

  const header = ["Issue Type", "Summary", "Epic Name", "Epic Link", "Description", ...tailHeader];
  const body = rows.map((r) => [
    r.type,
    r.summary,
    r.kind === "epic" ? (r.epicName ?? r.summary) : "",
    r.kind === "story" ? (r.parentSummary ?? "") : "",
    r.description,
    ...tail(r),
  ]);
  return { header, csv: toCsv([header, ...body]) };
}

export function csvFileName(title: string | null, format: JiraFormat, part: CsvPart = "all") {
  const base =
    (title ?? "prd")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "prd";
  const suffix = part === "all" ? "" : `-${part}`;
  return `${base}-jira-${format === "cloud" ? "cloud" : "datacenter"}${suffix}.csv`;
}
