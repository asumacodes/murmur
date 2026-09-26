import { PrimaryCta } from "@/components/cta/PrimaryCta";
import { FoundingChip } from "@/components/cta/FoundingChip";

export function CtaBand({
  location,
  title = "Your idea could look like this in about eight minutes.",
  body = "Record a memo, get the research, PRD, brand kit, engineering brief, roadmap, Jira board and Confluence space. Your first idea is free.",
}: {
  location: string;
  title?: string;
  body?: string;
}) {
  return (
    <aside data-cta-zone className="card relative my-16 overflow-hidden p-6 sm:p-10">
      <div aria-hidden="true" className="absolute -right-20 -top-24 size-80 rounded-full bg-signal opacity-15 blur-[90px]" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow flex items-center gap-2">
            <span className="rec-dot text-signal" aria-hidden="true" /> Murmur
          </p>
          <p className="display-3 mt-3">{title}</p>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-fg-2">{body}</p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3">
          <PrimaryCta location={location} size="lg" />
          <FoundingChip size="sm" />
        </div>
      </div>
    </aside>
  );
}
