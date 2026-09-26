import { createHash } from "node:crypto";

/**
 * Stable, non-reversible referral code for a waitlist email. Server-only.
 * Lowercase base36, 8 chars — matches REF_RE in first-touch.ts.
 */
export function referralCodeFor(email: string): string {
  const salt = process.env.REFERRAL_SALT || "murmur-waitlist-v1";
  const digest = createHash("sha256").update(`${salt}:${email.trim().toLowerCase()}`).digest();
  return BigInt(`0x${digest.subarray(0, 8).toString("hex")}`).toString(36).padStart(8, "0").slice(0, 8);
}
