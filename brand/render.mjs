#!/usr/bin/env node
/**
 * Render every Murmur brand asset to PNG, in both themes.
 *
 *   npm run brand:render                   # everything, dark + light
 *   npm run brand:render -- --theme dark   # one theme
 *   npm run brand:render -- --only og      # names containing "og"
 *   npm run brand:render -- --site-og      # also refresh src/app/opengraph-image.png from the dark OG
 *
 * Needs a Chromium for playwright-core (`npx playwright-core install chromium` once).
 * Templates live in brand/social/*.html; output goes to brand/export/<theme>/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true) : undefined;
};

/** Every asset: template, export name (keep these names stable; tools and posts reference them). */
const assets = [
  { file: "avatar.html", name: "01-brand-avatar-1000x1000", w: 1000, h: 1000 },
  { file: "x-header.html", name: "02-x-header-1500x500", w: 1500, h: 500 },
  { file: "linkedin-banner.html", name: "03-linkedin-banner-1584x396", w: 1584, h: 396 },
  { file: "og.html", name: "04-og-1200x630", w: 1200, h: 630 },
  { file: "end-card.html", name: "end-card-A-until-1-oct-1080x1920", w: 1080, h: 1920, q: { cta: "waitlist" } },
  { file: "end-card.html", name: "end-card-A-until-1-oct-1920x1080", w: 1920, h: 1080, q: { cta: "waitlist" } },
  { file: "end-card.html", name: "end-card-B-from-1-oct-1080x1920", w: 1080, h: 1920, q: { cta: "signup" } },
  { file: "end-card.html", name: "end-card-B-from-1-oct-1920x1080", w: 1920, h: 1080, q: { cta: "signup" } },
  { file: "overlay-caption.html", name: "overlay-caption-sample-1080x1920", w: 1080, h: 1920, transparent: true },
  { file: "overlay-caption.html", name: "overlay-caption-sample-1920x1080", w: 1920, h: 1080, transparent: true },
  { file: "overlay-honesty.html", name: "overlay-honesty-label-1080x1920", w: 1080, h: 1920, transparent: true },
  { file: "overlay-honesty.html", name: "overlay-honesty-label-1920x1080", w: 1920, h: 1080, transparent: true },
  { file: "overlay-hook.html", name: "overlay-hook-sample-1080x1920", w: 1080, h: 1920, transparent: true },
  { file: "overlay-hook.html", name: "overlay-hook-sample-1920x1080", w: 1920, h: 1080, transparent: true },
  { file: "foundations.html", name: "murmur-social-brand-foundations-v2.0", w: 1440, h: 1000, fullPage: true },
];

const themes = flag("theme") && flag("theme") !== true ? [flag("theme")] : ["dark", "light"];
const only = typeof flag("only") === "string" ? flag("only") : null;
const selected = assets.filter((a) => !only || a.name.includes(only));

const browser = await chromium.launch();
let count = 0;
for (const theme of themes) {
  const outDir = path.join(here, "export", theme);
  fs.mkdirSync(outDir, { recursive: true });
  for (const asset of selected) {
    const page = await browser.newPage({ viewport: { width: asset.w, height: asset.h }, deviceScaleFactor: 1 });
    const q = new URLSearchParams({ theme, w: String(asset.w), h: String(asset.h), ...(asset.q ?? {}) });
    const url = `${pathToFileURL(path.join(here, "social", asset.file)).href}?${q}`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__brandReady === true, null, { timeout: 30000 });
    const out = path.join(outDir, `${asset.name}.png`);
    await page.screenshot({ path: out, fullPage: Boolean(asset.fullPage), omitBackground: Boolean(asset.transparent) });
    await page.close();
    count++;
    console.log(`✓ ${theme}/${asset.name}.png`);
  }
}
await browser.close();

if (flag("site-og")) {
  const src = path.join(here, "export", "dark", "04-og-1200x630.png");
  const appDir = path.join(here, "..", "src", "app");
  for (const target of ["opengraph-image.png", "twitter-image.png"]) fs.copyFileSync(src, path.join(appDir, target));
  console.log("✓ refreshed src/app/opengraph-image.png + twitter-image.png from the dark OG");
}
console.log(`${count} assets rendered.`);
