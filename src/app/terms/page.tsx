import { Container } from "@/components/ui";

export default function TermsPage() {
  return (
    <main className="section-pad">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="font-mono-text text-xs uppercase tracking-[0.15em] text-[var(--gold)]">
            Terms
          </p>
          <h1 className="font-serif-display mt-4 text-[clamp(3rem,7vw,5rem)] leading-none">
            Early access terms.
          </h1>
          <div className="mt-8 space-y-5 text-lg leading-8 text-[var(--text-secondary)]">
            <p>
              Murmur is pre-beta software. Public copy, pricing, pack scope, and
              delivery timelines may change as the pipeline is validated.
            </p>
            <p>
              Early access requests are non-binding. Paid access will require
              clear project scope, acceptance criteria, and separate commercial
              terms.
            </p>
            <p>
              A full terms page will ship before hosted beta accounts or paid
              subscriptions open.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
