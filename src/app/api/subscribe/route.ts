import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WELCOME_TEXT = `You're on the Murmur waitlist.

Murmur turns a five-minute voice memo into a complete project foundation: a validated PRD, brand kit, Jira board, and Confluence space. It's being built carefully, so there's no launch date to promise yet. When it opens, you'll be among the first to get in.

That's the only email you'll get from us until there's something real to share. No drip, no filler.

Murmur
a SprintZero Studio product
https://www.trymurmur.studio`;

type SubscribeBody = {
  email?: unknown;
};

export async function POST(request: Request) {
  let body: SubscribeBody;

  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[subscribe] RESEND_API_KEY is not configured");
    return NextResponse.json(
      { error: "Notify list is temporarily unavailable." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
    // Requires a Contact Property named "source" to already exist in the
    // Resend dashboard — created once during setup, not by this route.
    properties: { source: "coming-soon" },
  });

  if (!error) {
    // Welcome email — the single "one welcome email now" the footnote promises.
    // Fire on a genuinely new contact only. A send failure must NOT fail the
    // signup: the contact is already saved, so we log and still return ok.
    const from = process.env.RESEND_FROM;
    if (!from) {
      console.error("[subscribe] RESEND_FROM is not configured — skipping welcome email");
    } else {
      const { error: sendError } = await resend.emails.send({
        from,
        to: email,
        replyTo: "hey@trymurmur.studio",
        subject: "You're on the Murmur waitlist",
        text: WELCOME_TEXT,
      });
      if (sendError) {
        console.error("[subscribe] welcome email failed", sendError);
      }
    }
    return NextResponse.json({ ok: true });
  }

  // TODO(verify in Phase 5): confirm this actually matches Resend's
  // duplicate-contact error message with a real repeat submission.
  const message = (error.message ?? "").toLowerCase();
  if (message.includes("already") || message.includes("exist")) {
    // Duplicate signup — contact already exists, so no welcome email re-send.
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  console.error("[subscribe] Resend error", error);
  return NextResponse.json(
    { error: "Something went wrong. Try again." },
    { status: 500 },
  );
}
