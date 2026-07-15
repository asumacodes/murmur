import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistBody = {
  email?: unknown;
};

export async function POST(request: Request) {
  let body: WaitlistBody;

  try {
    body = (await request.json()) as WaitlistBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;

  if (!apiKey) {
    console.error("[waitlist] BUTTONDOWN_API_KEY is not configured");
    return NextResponse.json(
      { error: "Waitlist is temporarily unavailable." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        tags: ["murmur-launch"],
      }),
    });

    if (response.ok) {
      return NextResponse.json({ ok: true });
    }

    // Already subscribed / duplicate
    if (response.status === 400 || response.status === 409) {
      const payload = (await response.json().catch(() => null)) as {
        detail?: string | unknown;
        email_address?: string[];
      } | null;

      const detail =
        typeof payload?.detail === "string"
          ? payload.detail.toLowerCase()
          : JSON.stringify(payload ?? {}).toLowerCase();

      if (
        detail.includes("already") ||
        detail.includes("exist") ||
        detail.includes("duplicate") ||
        response.status === 409
      ) {
        return NextResponse.json({ ok: true, alreadySubscribed: true }, { status: 200 });
      }

      return NextResponse.json(
        { error: "Could not subscribe with that email." },
        { status: 400 },
      );
    }

    console.error("[waitlist] Buttondown error", response.status, await response.text());
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  } catch (error) {
    console.error("[waitlist] Request failed", error);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
