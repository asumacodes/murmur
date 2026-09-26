import { NextResponse } from "next/server";

/**
 * Same-origin proxy for the app's public founding counter. The app sends no
 * CORS headers, and caching here keeps a marketing traffic spike off it.
 */
export const revalidate = 120;

const APP_ORIGIN = (process.env.NEXT_PUBLIC_APP_URL || "https://app.trymurmur.studio").replace(/\/$/, "");

export async function GET() {
  try {
    const res = await fetch(`${APP_ORIGIN}/api/founding`, {
      next: { revalidate },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as { ok?: boolean; claimed?: unknown; cap?: unknown };
    const claimed = Number(data.claimed);
    const cap = Number(data.cap);
    if (!data.ok || !Number.isFinite(claimed) || !Number.isFinite(cap) || cap <= 0) {
      throw new Error("bad payload");
    }
    return NextResponse.json(
      { claimed, cap, left: Math.max(0, cap - claimed) },
      { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" } },
    );
  } catch {
    // The UI hides the counter entirely rather than show a made-up number.
    return NextResponse.json({ unavailable: true }, { status: 503 });
  }
}
