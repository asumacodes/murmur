import type { Metadata } from "next";
import { Container, GoldButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found · Murmur",
  description: "That page doesn't exist. Head back to Murmur.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center py-24">
      <Container className="text-center">
        <p className="font-mono-text text-xs uppercase tracking-[0.16em] text-[var(--gold)]">
          404
        </p>
        <h1 className="font-serif-display mt-4 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.1]">
          This page took a wrong turn.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[var(--text-secondary)]">
          The page you&apos;re after doesn&apos;t exist, or hasn&apos;t been
          built yet. Murmur is a work in progress.
        </p>
        <div className="mt-8 flex justify-center">
          <GoldButton href="/">Back to Murmur →</GoldButton>
        </div>
      </Container>
    </main>
  );
}
