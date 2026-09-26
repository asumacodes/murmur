#!/usr/bin/env node
/**
 * Capture real screens of the public example runs for the site's "In the app" view.
 *
 *   node scripts/capture-runs.mjs                 # all runs
 *   node scripts/capture-runs.mjs --only aavaas   # one run
 *
 * Uses a saved, logged-in browser session (Playwright storage state). By default it
 * reuses murmur-motion's: CAPTURE_STATE=../murmur-motion/auth/state.json. Nothing here
 * logs in, reads passwords or prints tokens.
 *
 * Output: public/runs/<slug>/<screen>.jpg + public/runs/<slug>/manifest.json.
 * Every capture runs a privacy gate first (emails, keys, tokens, account menus) and is
 * skipped if anything sensitive is visible. Review every image before committing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATE = path.resolve(root, process.env.CAPTURE_STATE || "../murmur-motion/auth/state.json");
const APP = "https://app.trymurmur.studio";
/** The owner's Atlassian site: ATLASSIAN_SITE_URL, else ATLASSIAN_SITE from murmur-motion's local .env. */
function atlassianSite() {
  let site = process.env.ATLASSIAN_SITE_URL;
  const motionEnv = path.resolve(root, "../murmur-motion/.env");
  if (!site && fs.existsSync(motionEnv)) {
    site = fs.readFileSync(motionEnv, "utf8").match(/^ATLASSIAN_SITE=(.+)$/m)?.[1]?.trim();
  }
  if (!site) {
    console.error("Set ATLASSIAN_SITE_URL (e.g. https://your-site.atlassian.net).");
    process.exit(1);
  }
  return (/^https?:\/\//i.test(site) ? site : `https://${site}`).replace(/\/$/, "");
}
const ATLASSIAN = atlassianSite();

/** Only runs the owner approved for publication. */
const RUNS = [
  { slug: "creature-clash", idea: "8caa27da-08f0-4d62-a8c0-a7e73314456e", key: "CREAT67", board: 1184 },
  { slug: "shipreel", idea: "ce733836-fc65-403c-9551-3a0335400fb2", key: "SHIPR89", board: 1182 },
  { slug: "aavaas", idea: "77f74cac-f3b1-491c-98b3-6833929c2dca", key: "AAVAA66", board: 1183 },
  { slug: "fin-matter", idea: "9a378229-5904-4df0-b1a2-e0f0c33af0c6", key: "FINMA90", board: 1148 },
];

const APP_TABS = [
  { name: "prd", label: "PRD" },
  { name: "competitors", label: "Competitor map" },
  { name: "brand", label: "Brand kit" },
  { name: "engineering", label: "Engineering brief" },
];

const VIEWPORT = { width: 1440, height: 1800 };
const SCALE = 1.25;

// Hide anything that identifies a person or account. Applied before the first paint.
const PRIVACY_CSS = `
  [data-testid="atlassian-navigation--secondary-actions--profile--trigger"],
  [data-testid="confluence-account-menu--trigger"],
  [data-testid="filters.ui.filters.assignee.stateless.assignee-filter"],
  [data-testid$="assignee-field-static.avatar"],
  [data-testid="presence-avatar-group--avatar-group"],
  [data-testid*="byline"], [data-testid*="contributors"], [data-testid*="avatar"],
  [data-vc="atlassian-navigation-secondary-actions"],
  [aria-label*="Upgrade"], [data-testid*="upgrade"],
  img[src*="avatar"], img[src*="gravatar"] { visibility: hidden !important; }
`;

const BLOCKLIST = [/[\w.+-]+@[\w-]+\.[\w.-]+/, /api[\s_-]?key/i, /\btoken\b/i, /\bsecret\b/i, /service_role/i, /supabase\.co/i, /\bdodo\b/i];
// Real product text that legitimately contains a blocked word.
const ALLOW = [
  /deployment and secrets/i,
  /environment secrets/i,
  /requires own API keys/i,
  /no API key needed/i,
  /Higgsfield API keys, LLM API keys/i,
  /BYO LLM API key/i,
];

async function gate(page) {
  const text = await page.evaluate(() => document.body.innerText);
  const hits = [];
  for (const re of BLOCKLIST) {
    const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
    let m;
    while ((m = g.exec(text))) {
      const around = text.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60);
      if (!ALLOW.some((a) => a.test(around))) hits.push(m[0]);
    }
  }
  return [...new Set(hits)];
}

async function settle(page, ms = 2200) {
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(ms);
}

/**
 * clip: crop to a region in CSS px. Atlassian screens drop the global top bar, and Jira
 * also drops its sidebar (it lists the account's other, unpublished spaces).
 */
async function shoot(page, file, clip) {
  await page.screenshot({ path: file, type: "jpeg", quality: 80, animations: "disabled", ...(clip ? { clip } : {}) });
}

const ATLASSIAN_TOP = 54;
const JIRA_SIDEBAR = 322;

const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
if (!fs.existsSync(STATE)) {
  console.error(`No saved session at ${STATE}. Run \`npm run capture:login\` in murmur-motion first.`);
  process.exit(1);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: STATE, viewport: VIEWPORT, deviceScaleFactor: SCALE, colorScheme: "light" });
await ctx.addInitScript((css) => {
  const inject = () => {
    const s = document.createElement("style");
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
}, PRIVACY_CSS);

for (const run of RUNS.filter((r) => !only || r.slug === only)) {
  const dir = path.join(root, "public", "runs", run.slug);
  fs.mkdirSync(dir, { recursive: true });
  const manifest = { slug: run.slug, capturedAt: new Date().toISOString().slice(0, 10), screens: [] };
  const page = await ctx.newPage();

  // 1. The run in the Murmur app, one artifact at a time.
  await page.goto(`${APP}/ideas/${run.idea}`, { waitUntil: "domcontentloaded" });
  await settle(page);
  if (/\/login/.test(page.url())) throw new Error("Session expired: run capture:login in murmur-motion.");
  for (const tab of APP_TABS) {
    const button = page.getByRole("button", { name: new RegExp(`^${tab.label}`) }).first();
    await button.click();
    await page.waitForTimeout(1600);
    // Hide the in-app feedback prompt ("Did this land?") without answering it.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll("div, section, aside")) {
        if (el.childElementCount > 0 && /^\s*Did this land\?/.test(el.innerText) && el.innerText.length < 80) {
          el.style.display = "none";
        }
      }
    });
    const hits = await gate(page);
    if (hits.length) {
      console.warn(`  ✗ ${run.slug}/${tab.name}: privacy gate (${hits.join(", ")}), skipped`);
      continue;
    }
    await shoot(page, path.join(dir, `${tab.name}.jpg`));
    manifest.screens.push({ name: tab.name, source: "app", label: tab.label });
    console.log(`  ✓ ${run.slug}/${tab.name}`);
  }

  // 2. The Jira backlog Murmur created.
  await page.goto(`${ATLASSIAN}/jira/software/c/projects/${run.key}/boards/${run.board}/backlog`, { waitUntil: "domcontentloaded" });
  await settle(page, 5000);
  {
    const hits = await gate(page);
    if (hits.length) console.warn(`  ✗ ${run.slug}/jira: privacy gate (${hits.join(", ")}), skipped`);
    else {
      await shoot(page, path.join(dir, "jira.jpg"), { x: JIRA_SIDEBAR, y: ATLASSIAN_TOP, width: VIEWPORT.width - JIRA_SIDEBAR, height: VIEWPORT.height - ATLASSIAN_TOP });
      manifest.screens.push({ name: "jira", source: "jira", label: "Jira backlog" });
      console.log(`  ✓ ${run.slug}/jira`);
    }
  }

  // 3. The Confluence roadmap page Murmur wrote.
  const search = await ctx.request.get(`${ATLASSIAN}/wiki/rest/api/content?spaceKey=${run.key}&type=page&limit=25`);
  const pages = search.ok() ? (await search.json()).results ?? [] : [];
  const roadmap = pages.find((p) => /roadmap/i.test(p.title));
  if (roadmap) {
    await page.goto(`${ATLASSIAN}/wiki/spaces/${run.key}/pages/${roadmap.id}`, { waitUntil: "domcontentloaded" });
    await settle(page, 5000);
    const hits = await gate(page);
    if (hits.length) console.warn(`  ✗ ${run.slug}/confluence: privacy gate (${hits.join(", ")}), skipped`);
    else {
      await shoot(page, path.join(dir, "confluence.jpg"), { x: 0, y: ATLASSIAN_TOP, width: VIEWPORT.width, height: VIEWPORT.height - ATLASSIAN_TOP });
      manifest.screens.push({ name: "confluence", source: "confluence", label: roadmap.title });
      console.log(`  ✓ ${run.slug}/confluence (${roadmap.title})`);
    }
  }

  fs.writeFileSync(path.join(dir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  await page.close();
}
await browser.close();
