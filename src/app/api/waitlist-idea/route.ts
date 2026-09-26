import { NextResponse } from "next/server";
import { Resend } from "resend";
import { referralCodeFor } from "@/lib/referral";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_IDEA = 1200;

/**
 * Optional post-signup step: "what would you build first?". Mailed to the
 * founder's inbox so it can inform invite batches. The referral code returned
 * by /api/subscribe acts as a light proof that this email just signed up.
 */
export async function POST(request: Request) {
  let body: { email?: unknown; code?: unknown; idea?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body.code === "string" ? body.code : "";
  const idea = typeof body.idea === "string" ? body.idea.trim().slice(0, MAX_IDEA) : "";

  if (!EMAIL_RE.test(email) || code !== referralCodeFor(email) || idea.length < 3) {
    return NextResponse.json({ error: "Could not save that." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const inbox = process.env.WAITLIST_IDEAS_TO || "hey@trymurmur.studio";
  if (!apiKey || !from) {
    console.error("[waitlist-idea] Resend is not configured");
    return NextResponse.json({ error: "Unavailable." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: inbox,
    replyTo: email,
    subject: `Waitlist idea · ${code}`,
    text: `A waitlist signup shared what they'd build first.\n\nFrom: ${email}\nCode: ${code}\n\n${idea}`,
  });

  if (error) {
    console.error("[waitlist-idea] send failed", error);
    return NextResponse.json({ error: "Could not save that." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
