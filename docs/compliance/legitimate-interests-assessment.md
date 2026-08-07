# Legitimate Interests Assessment (LIA) — Murmur

**Internal record — not for publication.** Keep this on file (e.g. in the Confluence compliance space). Produce it if a data protection authority asks how you justified processing on a legitimate-interests basis.

**Controller:** SprintZero Studios (OPC) Private Limited
**Prepared by:** Vikrant Negi
**Date:** 1st August 2026
**Processing assessed:** Operational, security/abuse-prevention, and cost/analytics data associated with pipeline runs (Privacy Policy Section 3, row "Operational data, abuse prevention, cost management").
**Legal basis under assessment:** GDPR Art. 6(1)(f) legitimate interests; DPDP Act "legitimate use."

---

## The data in scope

Run status, pipeline stage timings, processing-cost/token metrics, and run-event records tied to each pipeline run. This is largely technical/operational metadata associated with a user's runs; it is not the content of recordings or generated documents (those rest on contractual necessity, assessed separately).

---

## Part 1 — Purpose test (is there a legitimate interest?)

Yes. The interests pursued are:

1. **Operating and maintaining the Service** — knowing whether runs succeed, stall, or fail, and where, is necessary to keep the pipeline working and to diagnose faults.
2. **Security and abuse prevention** — detecting and preventing misuse of the free tier, automated abuse, and anomalous usage that could degrade the Service for others or impose runaway cost.
3. **Cost management and unit economics** — a solo-operator business must understand per-run cost to price sustainably and avoid insolvency-by-usage.

These are real, present, and specific interests of the controller (and, for security, also of other users). They are lawful and not speculative.

---

## Part 2 — Necessity test (is the processing necessary for that interest?)

Yes. Each purpose genuinely requires this data and cannot reasonably be achieved by less intrusive means:

- Operational health **cannot** be monitored without stage/status/timing signals.
- Abuse prevention **requires** usage and run-frequency signals to distinguish normal use from abuse; the alternative (no monitoring) would leave the free tier and cost exposure undefended.
- Cost management **requires** per-run cost metrics; there is no less-intrusive substitute for measuring the thing being managed.

The data collected is proportionate — it is operational metadata, not additional personal content collected specifically for these purposes.

---

## Part 3 — Balancing test (do the individual's interests override?)

On balance, no — the processing does not override the data subject's rights and freedoms, for these reasons:

- **Low intrusion.** The data is technical run metadata, tied to activity the user deliberately initiated (running a pipeline). It is not sensitive, not behavioural-tracking across the web, and not used for profiling or advertising.
- **Reasonable expectations.** A user running an automated pipeline reasonably expects the operator to record whether the run worked and what it cost — this is ordinary service operation, not a surprising secondary use.
- **No targeting or ad use.** The data is never used for targeted advertising or sold. Website analytics via Cloudflare are cookieless. Product analytics (PostHog) set a first-party, own-domain analytics cookie and process de-identified usage data (a pseudonymous user identifier, not name or email); this is assessed under legitimate interests and detailed in the full analytics LIA update (pending, Phase 5).
- **Retention is bounded.** The data is retained with the associated run record and deleted when the run or the account is deleted (Privacy Policy Section 4) — it does not persist independently.
- **Safeguards.** Row-level security restricts each user's data to that user; data is encrypted in transit; core storage is in India.
- **Rights preserved.** The user can delete runs and their account, which removes this data; they can object; and the grievance mechanism is available.

**Conclusion:** The legitimate interests are not overridden by the interests or fundamental rights of the data subject. Art. 6(1)(f) / DPDP legitimate use is an appropriate basis for this processing.

---

## Review

Reassess if: the data categories expand, the data begins to be used for a new purpose (e.g. profiling, marketing, or model training), retention is extended, or the user base grows materially. Otherwise review annually.
