import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    return NextResponse.json({ ok: true });
  }

  // TODO(verify in Phase 5): confirm this actually matches Resend's
  // duplicate-contact error message with a real repeat submission.
  const message = (error.message ?? "").toLowerCase();
  if (message.includes("already") || message.includes("exist")) {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  console.error("[subscribe] Resend error", error);
  return NextResponse.json(
    { error: "Something went wrong. Try again." },
    { status: 500 },
  );
}
