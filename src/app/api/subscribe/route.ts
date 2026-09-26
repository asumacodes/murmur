import { NextResponse } from "next/server";
import { Resend } from "resend";
import { referralCodeFor } from "@/lib/referral";
import { SITE_URL } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_RE = /^[a-z0-9_:-]{1,40}$/i;
const REF_RE = /^[a-z0-9]{6,12}$/;
const ROLES = new Set(["founder", "pm", "agency", "engineer", "other"]);

function welcomeText(referralUrl: string) {
  return `You're on the Murmur waitlist.

Murmur turns a voice memo into a project foundation in under 10 minutes: competitor research, a PRD, a brand kit, an engineering brief, a roadmap, and a Jira board and Confluence space in your own Atlassian site.

Invites go out in batches. When yours lands, your first idea is free.

Know someone who'd use it? Here's your link:
${referralUrl}

This is the only email until your invite. No drip, no filler.

Murmur
a SprintZero Studios product
trymurmur.studio`;
}

type SubscribeBody = {
  email?: unknown;
  location?: unknown;
  role?: unknown;
  ref?: unknown;
  tier?: unknown;
};

export async function POST(request: Request) {
  let body: SubscribeBody;

  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const location = typeof body.location === "string" && TOKEN_RE.test(body.location) ? body.location : "site";
  const role = typeof body.role === "string" && ROLES.has(body.role) ? body.role : null;
  const ref = typeof body.ref === "string" && REF_RE.test(body.ref) ? body.ref : null;
  const tier = typeof body.tier === "string" && TOKEN_RE.test(body.tier) ? body.tier : null;

  const code = referralCodeFor(email);
  const referralUrl = `${SITE_URL}/?ref=${code}`;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[subscribe] RESEND_API_KEY is not configured");
    return NextResponse.json({ error: "The waitlist is temporarily unavailable." }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  // "source" is the only custom contact property that exists in Resend, so
  // attribution is packed into it: location|role|tier|ref (ref = who referred them).
  const source = [location, role, tier && `tier:${tier}`, ref && `ref:${ref}`, `code:${code}`]
    .filter(Boolean)
    .join("|")
    .slice(0, 200);

  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
    properties: { source },
  });

  if (!error) {
    const from = process.env.RESEND_FROM;
    if (!from) {
      console.error("[subscribe] RESEND_FROM is not configured; skipping welcome email");
    } else {
      const { error: sendError } = await resend.emails.send({
        from,
        to: email,
        replyTo: "hey@trymurmur.studio",
        subject: "You're on the Murmur waitlist",
        text: welcomeText(referralUrl),
      });
      if (sendError) {
        console.error("[subscribe] welcome email failed", sendError);
      }
    }
    return NextResponse.json({ ok: true, code, referralUrl });
  }

  const message = (error.message ?? "").toLowerCase();
  if (message.includes("already") || message.includes("exist")) {
    return NextResponse.json({ ok: true, alreadySubscribed: true, code, referralUrl });
  }

  console.error("[subscribe] Resend error", error);
  return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
}
