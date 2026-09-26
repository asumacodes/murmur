import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page doesn't exist. Head back to Murmur.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <PageShell>
      <div className="wrap grid min-h-[80vh] place-items-center pt-24 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-signal">404 · nothing recorded here</p>
          <h1 className="display-1 mt-5">
            Dead air<span className="serif-accent text-fg-2">.</span>
          </h1>
          <p className="lede mx-auto mt-5 max-w-md">This page doesn&apos;t exist, or hasn&apos;t been built yet.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex h-11 items-center rounded-full bg-signal px-5 font-semibold text-on-signal">
              Back to Murmur
            </Link>
            <Link href="/examples" className="inline-flex h-11 items-center rounded-full border border-line-2 px-5 text-fg">
              See real runs
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
