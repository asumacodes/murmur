# Privacy Policy · Murmur

**Effective date:** 1st August 2026
**Last updated:** 8th August 2026

This Privacy Policy explains how **SprintZero Studios (OPC) Private Limited** ("SprintZero Studios," "we," "us," or "our") collects, uses, stores, shares, and protects your personal data when you use **Murmur** (the "Service") at `www.trymurmur.studio` and `app.trymurmur.studio`.

We are the **Data Fiduciary** under India's Digital Personal Data Protection Act, 2023 ("DPDP Act") and the **Data Controller** under the EU General Data Protection Regulation ("GDPR") for the personal data described here.

By using Murmur, you agree to the practices described in this Policy. If you do not agree, please do not use the Service.

---

## 1. Who we are

Murmur is an automated pipeline that turns a voice recording into a structured project foundation: a product requirements document, brand direction, competitor analysis, and a Jira project and Confluence space created in **your own** Atlassian workspace.

**Data Fiduciary / Data Controller:**
SprintZero Studios (OPC) Private Limited
723, Sector 8, HUDA, Ambala City, Haryana - 134003
India

**Contact for privacy matters:** [privacy@trymurmur.studio](mailto:privacy@trymurmur.studio)

---

## 2. The personal data we collect

We collect only what the Service needs to function. We do not sell your personal data, and we do not use it for advertising.

**a. Account information.** When you create an account, we collect your **email address** and, if you sign in through a third-party identity provider, your **display name and profile image**. This is used to authenticate you and operate your account.

**b. Voice recordings.** When you record an idea, we store the **audio file** you create. It is the input to the pipeline and is shown back to you for review before you run it.

**c. Transcripts.** We generate a **text transcript** of your recording so you can confirm we heard you correctly and so the pipeline can process it.

**d. Generated content.** The pipeline produces a **PRD, brand direction, competitor analysis, and engineering and board data** ("run results"), which we store so you can view them in your dashboard.

**e. Atlassian connection tokens.** To create a Jira project and Confluence space in your own Atlassian workspace, we store **OAuth access and refresh tokens** for your Atlassian account. These are held in **encrypted form** (see Section 6) and are used only to create those artifacts on your behalf.

**f. Operational and usage data.** We record **run status, stage timings, and processing-cost information** for each pipeline run, to operate the Service, understand performance, prevent abuse, and manage our costs.

**g. Notification data.** If you enable completion notifications, we store the **push-notification subscription** your browser provides.

**h. Marketing sign-ups.** If you ask to be notified about availability, we store the **email address** you submit.

**i. Product and usage analytics.** To understand how our marketing site and app are used and how to improve them, we collect **product-analytics events** describing pages viewed and actions taken (for example, sign-up, connecting Atlassian, and completing a run), together with **first-touch attribution** (how you arrived, such as UTM parameters or referring site). These events are keyed to a **pseudonymous identifier** (an account identifier if you are signed in, or an anonymous device identifier before sign-in) and **not** to your name or email. We do **not** send your **recordings, transcripts, or run results** to our analytics provider, and we do **not** use session replay or advertising/cross-site tracking.

We do **not** intentionally collect special-category / sensitive personal data. Please do not include such information in your recordings.

---

## 3. Why we process your data, and our legal basis

| Purpose | DPDP basis | GDPR lawful basis |
|---|---|---|
| Creating and operating your account | Your consent | Performance of a contract (Art. 6(1)(b)) |
| Storing and transcribing your recordings; running the pipeline; producing and storing run results | Your consent | Performance of a contract (Art. 6(1)(b)) |
| Creating Jira/Confluence artifacts in your Atlassian workspace | Your consent | Performance of a contract (Art. 6(1)(b)) |
| Operational data, abuse prevention, cost management | Legitimate use / our legitimate interests | Legitimate interests (Art. 6(1)(f)) |
| Product and usage analytics, to understand and improve the Service | Legitimate use / our legitimate interests | Legitimate interests (Art. 6(1)(f)) |
| Completion notifications | Your consent | Consent (Art. 6(1)(a)) |
| Marketing sign-up emails | Your consent | Consent (Art. 6(1)(a)) |

You may withdraw consent at any time (see Section 10). Withdrawing consent for core processing may mean you can no longer use the Service.

---

## 4. How long we keep your data

| Data | Retention |
|---|---|
| Account information | For as long as your account is active; deleted when you delete your account. |
| Voice recordings and transcripts | For as long as your account is active; deleted when you delete the recording or your account. |
| Run results (dashboard content) | Retained on a **tiered basis**: **1 month** on the Free and Starter plans, **6 months** on the Builder and Studio plans. When a run reaches the end of its retention period, we notify you and provide a **7-day grace window** during which the content stays available and downloadable. After the grace window, the run results are purged and the idea is removed from your Murmur history. Your underlying recording is not affected, and you can re-run the pipeline on it. |
| Operational and usage data | Retained with the associated run record; deleted when the run or your account is deleted. |
| Product and usage analytics | Retained by our analytics provider (PostHog); retention is currently configured to 12 months. |
| Atlassian tokens | Until you disconnect Atlassian or delete your account, at which point they are permanently deleted. |
| Notification subscriptions | Until you disable notifications or delete your account. |
| Marketing emails | Until you unsubscribe. |

We may retain limited personal data beyond the periods above where we are required to do so to comply with a legal, tax, accounting, or regulatory obligation, or to establish, exercise, or defend a legal claim. Any such data is retained only for as long as that obligation requires and is then deleted.

---

## 5. Who we share your data with (sub-processors)

We use a small number of trusted service providers ("Data Processors" / "sub-processors") to run the Service. Each processes personal data only on our instructions, under a written data-processing agreement.

**We do not use your data to train AI models, and we work only with sub-processors whose data-handling terms we consider appropriate for the personal data they process.**

| Provider | What it does | Data it handles | Location |
|---|---|---|---|
| **Supabase, Inc.** | Database, authentication, file storage | All stored personal data | India (Mumbai) |
| **DigitalOcean, LLC** | Hosts our pipeline engine | Audio, transcripts, tokens, and generated content while a run is processing | India (Bangalore) |
| **Vercel, Inc.** | Hosts our web application | Request data in transit | United States (compute in Mumbai) |
| **Anthropic, PBC** | AI models that generate your run results | Transcript and generated content | United States |
| **AssemblyAI, Inc.** | Transcribes your recordings | Audio and transcript | United States |
| **Resend (Plus Five Five, Inc.)** | Sends our emails | Email address | United States |
| **Cloudflare, Inc.** | DNS, email routing, and cookieless website/performance analytics | Routing and aggregate website-performance analytics | United States / global |
| **PostHog** | Product and behavioural analytics | Pseudonymous usage events and first-touch attribution (no recordings, transcripts, or run results) | European Union |

We may also disclose personal data where required by law, to enforce our Terms, or to protect the rights, safety, and security of our users, the public, or SprintZero Studios.

---

## 6. How we protect your data

We apply appropriate technical and organizational measures, including:

- **Encryption in transit.** All data moves over HTTPS/TLS.
- **Encryption at rest for your Atlassian tokens.** Stored using **AES-256-GCM authenticated encryption**, with the encryption key held only on our server and never exposed to our pipeline engine or your browser.
- **Signed, replay-protected internal requests.** Communication between our web application and pipeline engine is authenticated with HMAC-SHA256 signatures and a short validity window.
- **Access controls.** Database row-level security restricts each user's data to that user; administrative credentials are never embedded in client code.

No system is perfectly secure, but we work to protect your data in line with recognized practices and applicable law.

---

## 7. Data breach notification

Despite our safeguards, no system is perfectly secure. If a personal-data breach affecting your data occurs, we will take prompt steps to contain and assess it, and we will notify the **Data Protection Board of India** and affected users as required by, and within the timelines set out in, applicable law. Our notice will describe, to the extent known, the nature of the breach and the measures we are taking in response.

---

## 8. Cookies and analytics

We do not use advertising cookies, and we do not sell your data or use it
for cross-site ad targeting.

We use privacy-respecting analytics to understand aggregate traffic and to
improve the Service. This includes cookieless website analytics (via
Cloudflare) and product analytics that set a first-party analytics cookie on
our own domain. This cookie is used only to measure usage of our own websites
and app (for example, to understand how visitors move from our marketing site
to the product) and is not shared with advertisers or used to track you across
other companies' websites. The information is used in an aggregated, de-identified
form and is not used to determine your individual identity.

Alongside these, we use only the essential cookies required to keep you signed
in and to operate the Service securely.

---

## 9. International data transfers

Your core data (recordings, transcripts, run results, and Atlassian tokens) is stored on infrastructure located **in India** (Mumbai and Bangalore).

Certain sub-processors, specifically **Anthropic, AssemblyAI, and Resend**, process a limited set of personal data **outside India, in the United States**. Where these transfers occur, they are governed by each provider's data-processing agreement incorporating the European Commission's **Standard Contractual Clauses**, which provide contractual safeguards for your data.

---

## 10. Your rights

Under the DPDP Act and the GDPR, you have the following rights over your personal data. You can exercise most of them directly in the Service; for the rest, contact us using the details in Section 12.

- **Right to access.** You can view all of your recordings, transcripts, and run results in your dashboard, and export documents via Confluence's native export.
- **Right to correction.** You can edit your display name and profile details in your account settings.
- **Right to erasure / to be forgotten.** You can delete an individual recording, a single run, a project, or **your entire account**, directly in the Service. Deleting your account permanently removes all Murmur-held personal data (your account, recordings, transcripts, run results, operational data, notification subscriptions, and Atlassian tokens), **except** where we are required to retain limited data to comply with a legal obligation (see Section 4).
- **Right to withdraw consent.** You can disconnect Atlassian (which permanently deletes the stored tokens), unsubscribe from emails, or delete your account at any time.
- **Right to grievance redressal (DPDP).** You can raise any concern with our Grievance Officer (Section 12) and receive a timely response.
- **Rights under the GDPR.** If you are in the EU/EEA, you additionally have the rights to restrict or object to processing, to data portability, and to lodge a complaint with your local supervisory authority.

**Important: your Atlassian workspace is yours.** The Jira project and Confluence space that Murmur creates live in **your own** Atlassian workspace, not ours. Because they are yours and under your control, deleting your Murmur account does **not** delete them. We have no ability to reach into your Atlassian workspace once your tokens are deleted. If you want those artifacts removed, you can delete them directly in your own Atlassian account at any time.

---

## 11. Children

Murmur is not directed to children. You must be at least **18 years old** to use the Service. We do not knowingly collect personal data from children.

---

## 12. Grievance Officer and contact

In line with the DPDP Act, we have designated a **Grievance Officer** to address questions and complaints about how we handle your personal data.

**Grievance Officer:** Vikrant Negi
**Entity:** SprintZero Studios (OPC) Private Limited
**Email:** [grievanceofficer@trymurmur.studio](mailto:grievanceofficer@trymurmur.studio)
**Address:** 723, Sector 8, HUDA, Ambala City, Haryana - 134003

We will acknowledge your grievance within **7 (seven) days** of receipt and work to resolve it within the period prescribed under the DPDP Act and its Rules. If you are not satisfied with our response, you have the right to escalate your complaint to the **Data Protection Board of India**.

For GDPR matters, you may also contact us at the same address. If you are in the EU/EEA and believe we have not addressed your concern, you have the right to complain to your national data protection authority.

---

## 13. Changes to this Policy

We may update this Policy as the Service evolves or as the law requires. When we make material changes, we will update the "Last updated" date above and, where appropriate, notify you. Your continued use of the Service after a change takes effect means you accept the updated Policy.

---

*This Policy is provided in good faith to describe our actual data practices. It does not constitute legal advice.*
