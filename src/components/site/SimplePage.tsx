import Link from "next/link";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { PageShell } from "./PageShell";

/** Shared chrome for the quieter pages: about, contact, legal. */
export function SimplePage({
  eyebrow,
  title,
  children,
  back = true,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  back?: boolean;
}) {
  return (
    <PageShell>
      <div className="wrap pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-[46rem]">
          {back ? (
            <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-fg-3 transition-colors hover:text-fg">
              <span aria-hidden="true">←</span> Murmur
            </Link>
          ) : null}
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="display-2 balance mt-4">{title}</h1>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </PageShell>
  );
}
