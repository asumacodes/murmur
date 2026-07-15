import { Container } from "@/components/ui";

export default function PrivacyPage() {
  return (
    <main className="section-pad">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="font-mono-text text-xs uppercase tracking-[0.15em] text-[var(--gold)]">
            Privacy
          </p>
          <h1 className="font-serif-display mt-4 text-[clamp(3rem,7vw,5rem)] leading-none">
            Privacy-first by default.
          </h1>
          <div className="mt-8 space-y-5 text-lg leading-8 text-[var(--text-secondary)]">
            <p>
              Murmur is coming soon. If you join the launch list, we store your
              email via Buttondown solely to tell you when Murmur is ready —
              one email, no drip sequences. Unsubscribe anytime.
            </p>
            <p>
              The product direction is local-first recording and transcription
              for voice intake, with clear consent before any third-party
              service is used.
            </p>
            <p>
              A full privacy policy will ship before hosted beta accounts are
              opened.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
