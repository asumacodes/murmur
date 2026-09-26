import type { FaqItem } from "@/content/faq";

/**
 * Copy for the /templates/* pages. Body strings support a tiny inline syntax
 * rendered by <Rich>: **bold**, *italic*, `code` and [label](/href).
 */

/** A weak-vs-stronger pair. `strongSource` marks text quoted verbatim from a real run. */
export type Contrast = {
  weak: string;
  strong: string;
  strongSource?: { label: string; href: string };
  /** Optional anatomy of the strong version, e.g. the four parts of a metric. */
  breakdown?: { label: string; value: string }[];
};

/** A verbatim quote from a published Murmur run; `title` is the item it belongs to (e.g. a feature). */
export type RunQuote = { title?: string; text: string; label: string; href: string };

export type GuideEntry = {
  id: string;
  title: string;
  /** The Markdown heading this entry explains, shown as a mono tag. */
  heading: string;
  body: string[];
  contrast?: Contrast;
  quote?: RunQuote;
};

export type OutlineItem = { title: string; note: string };

export type TemplateContent = {
  /** Analytics id passed to trackTemplateAction. */
  slug: string;
  filename: string;
  markdown: string;
  outline: OutlineItem[];
  guide: GuideEntry[];
  faq: FaqItem[];
};
