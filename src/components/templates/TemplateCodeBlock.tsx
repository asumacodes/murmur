"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ghostButtonClass, primaryButtonClass } from "@/components/cta/PrimaryCta";
import { trackTemplateAction } from "@/lib/analytics/events";

type Props = { templateName: string; filename: string; markdown: string };

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for insecure contexts and older browsers.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

function downloadFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.8" />
      <path d="M10.5 3.2V3a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.3" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 8.5l3.2 3L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Copy + Download buttons. Used in the hero and in the code block toolbar. */
export function TemplateActions({ templateName, filename, markdown, size = "md" }: Props & { size?: "sm" | "md" }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const sizing = size === "sm" ? "h-9 px-4 text-[0.85rem] gap-2" : "h-11 px-5 text-[0.95rem] gap-2.5";

  const onCopy = async () => {
    const ok = await writeClipboard(markdown);
    setStatus(ok ? "copied" : "failed");
    if (ok) trackTemplateAction(templateName, "copy");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2200);
  };

  const onDownload = () => {
    downloadFile(filename, markdown);
    trackTemplateAction(templateName, "download");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={onCopy} className={`${primaryButtonClass} ${sizing}`}>
        {status === "copied" ? <CheckIcon /> : <CopyIcon />}
        <span>{status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy"}</span>
      </button>
      <button type="button" onClick={onDownload} className={`${ghostButtonClass} ${sizing}`}>
        <DownloadIcon />
        <span>Download .md</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied" ? "Template copied to clipboard" : status === "failed" ? "Copy failed. Select the text and copy it manually." : ""}
      </span>
    </div>
  );
}

/** Light Markdown colouring: headings, HTML comments, fences, table rules and **bold**. */
function highlight(markdown: string) {
  const out: ReactNode[] = [];
  let inComment = false;
  let inFence = false;
  const lines = markdown.replace(/\n$/, "").split("\n");

  lines.forEach((line, i) => {
    let node: ReactNode;
    const key = `l${i}`;
    const trimmed = line.trimStart();

    if (inComment || trimmed.startsWith("<!--")) {
      node = (
        <span key={key} className="italic text-fg-3">
          {line}
        </span>
      );
      inComment = !line.includes("-->");
    } else if (trimmed.startsWith("```")) {
      inFence = !inFence;
      node = (
        <span key={key} className="text-fg-3">
          {line}
        </span>
      );
    } else if (inFence) {
      node = (
        <span key={key} className="text-fg-2">
          {line}
        </span>
      );
    } else if (/^#{1,2}\s/.test(line)) {
      node = (
        <span key={key} className="font-semibold text-signal">
          {line}
        </span>
      );
    } else if (/^#{3,6}\s/.test(line)) {
      node = (
        <span key={key} className="font-semibold text-fg">
          {line}
        </span>
      );
    } else if (/^\|[\s|:-]+\|$/.test(line)) {
      node = (
        <span key={key} className="text-fg-3">
          {line}
        </span>
      );
    } else {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      node = (
        <span key={key} className="text-fg-2">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
              <span key={j} className="text-fg">
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </span>
      );
    }

    out.push(node);
    if (i < lines.length - 1) out.push("\n");
  });

  return { nodes: out, lineCount: lines.length };
}

/** The full template in a collapsible, horizontally scrollable code block. */
export function TemplateCodeBlock({ templateName, filename, markdown }: Props) {
  const [expanded, setExpanded] = useState(false);
  const regionId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const { nodes, lineCount } = highlight(markdown);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    // Collapsing from far down the page: bring the block's top back into view.
    const el = rootRef.current;
    if (!next && el && el.getBoundingClientRect().top < 0) {
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -96, immediate: true });
      else el.scrollIntoView({ block: "start" });
    }
  };

  return (
    <div ref={rootRef} className="scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-[var(--card-shadow)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 sm:px-5">
        <p className="flex min-w-0 items-center gap-2.5 font-mono text-[0.78rem] text-fg-2">
          <span className="grid size-6 shrink-0 place-items-center rounded-md border border-line-2 text-[0.6rem] font-semibold text-fg-3" aria-hidden="true">
            MD
          </span>
          <span className="truncate text-fg">{filename}</span>
          <span className="shrink-0 text-fg-3">· {lineCount} lines</span>
        </p>
        <TemplateActions templateName={templateName} filename={filename} markdown={markdown} size="sm" />
      </div>

      <div className="relative">
        <pre
          id={regionId}
          tabIndex={0}
          aria-label={`${filename}, Markdown template`}
          className={`overflow-x-auto px-4 py-5 font-mono text-[0.78rem] leading-[1.7] sm:px-6 sm:text-[0.8rem] ${
            expanded ? "" : "max-h-[34rem] overflow-y-hidden"
          }`}
        >
          <code>{nodes}</code>
        </pre>
        {expanded ? null : (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface-2 via-surface-2/85 to-transparent" />
        )}
      </div>

      <div className={`flex justify-center border-t border-line px-4 py-3 ${expanded ? "" : "-mt-px"}`}>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={regionId}
          onClick={toggle}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-fg-2 transition hover:bg-surface-3 hover:text-fg"
        >
          {expanded ? "Collapse" : `Show all ${lineCount} lines`}
          <svg viewBox="0 0 16 16" className={`size-3 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
