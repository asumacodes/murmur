/*
 * Murmur brand runtime for the social templates.
 * - ?theme=dark|light      sets <html data-theme>
 * - ?cta=waitlist|signup   swaps CTA copy ([data-cta])
 * - ?text=…                overrides [data-text] (captions, hooks, labels)
 * - [data-mark]            becomes the five-bar mark
 * - [data-arrow]           becomes the CTA arrow
 * - canvas[data-flock]     draws the particle "flock" motif (same formation as the site hero)
 * Sets window.__brandReady = true once fonts and images are loaded and everything is drawn.
 */
(function () {
  const params = new URLSearchParams(location.search);
  const theme = params.get("theme") === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;

  const CTA = {
    waitlist: "Get early access",
    signup: "Get started free",
  };

  const MARK = `<svg viewBox="0 0 27 24" aria-hidden="true">
    <rect x="1" y="8" width="3" height="8" rx="1.5" fill="currentColor"/>
    <rect x="6.5" y="4.5" width="3" height="15" rx="1.5" fill="currentColor"/>
    <rect x="12" y="1" width="3" height="22" rx="1.5" fill="var(--signal)"/>
    <rect x="17.5" y="4.5" width="3" height="15" rx="1.5" fill="currentColor"/>
    <rect x="23" y="8" width="3" height="8" rx="1.5" fill="currentColor"/>
  </svg>`;

  const ARROW = `<svg class="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  /** The hero's "voice" formation: a waveform of bars made of particles. */
  function drawFlock(canvas) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    const r = rng(Number(canvas.dataset.seed || 1337));
    const bars = Number(canvas.dataset.bars || 46);
    const count = Number(canvas.dataset.count || Math.round((w * h) / 22));
    const size = Number(canvas.dataset.size || 1.4);
    const fg = cssVar("--fg");
    const signal = cssVar("--signal");
    const heights = [];
    let total = 0;
    for (let b = 0; b < bars; b++) {
      const x = (b + 0.5) / bars - 0.5;
      const env = 0.22 + 0.78 * Math.exp(-x * x * 9);
      const hh = env * (0.45 + 0.55 * Math.abs(Math.sin(b * 1.7) * Math.cos(b * 0.53))) + 0.04;
      heights.push(hh);
      total += hh;
    }
    const barW = w / bars;
    for (let i = 0; i < count; i++) {
      let t = r() * total;
      let b = 0;
      while (b < bars - 1 && t > heights[b]) {
        t -= heights[b];
        b++;
      }
      const x = (b + 0.5) * barW + (r() - 0.5) * barW * 0.42;
      const y = h / 2 + (r() * 2 - 1) * heights[b] * (h / 2) * 0.96;
      const accent = r() > 0.94;
      ctx.globalAlpha = 0.45 + r() * 0.55;
      ctx.fillStyle = accent ? signal : fg;
      ctx.beginPath();
      ctx.arc(x, y, size * (0.6 + r() * 0.8), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function hydrate() {
    const cta = params.get("cta") === "signup" ? "signup" : "waitlist";
    document.querySelectorAll("[data-cta]").forEach((el) => (el.textContent = CTA[cta]));
    const text = params.get("text");
    if (text) document.querySelectorAll("[data-text]").forEach((el) => (el.innerHTML = text));
    document.querySelectorAll("[data-mark]").forEach((el) => (el.innerHTML = MARK));
    document.querySelectorAll("[data-arrow]").forEach((el) => (el.outerHTML = ARROW));
    document.querySelectorAll("canvas[data-flock]").forEach(drawFlock);
  }

  // Size: ?w=&h= (or the artboard's data-w/data-h). Portrait vs landscape layouts key off html.portrait.
  const art = document.querySelector(".artboard");
  if (art) {
    const w = Number(params.get("w") || art.dataset.w || 1080);
    const h = Number(params.get("h") || art.dataset.h || 1080);
    art.style.setProperty("--w", `${w}px`);
    art.style.setProperty("--h", `${h}px`);
    document.documentElement.classList.add(h > w ? "portrait" : w > h ? "landscape" : "square");
  }

  // Wait for embedded images (e.g. the foundations sheet's previews) to finish loading.
  function imagesReady() {
    return [...document.images].every((img) => img.complete);
  }

  window.__brandReady = false;
  document.fonts.ready.then(() => {
    hydrate();
    const done = () => requestAnimationFrame(() => (window.__brandReady = true));
    const poll = () => (imagesReady() ? done() : setTimeout(poll, 80));
    poll();
  });
})();
