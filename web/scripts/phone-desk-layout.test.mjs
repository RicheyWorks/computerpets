// Phone desk layout, in a real browser: at every phone size below, the hello, the species plaque, the room rail
// and the care buttons never overlap, and the pet's speech bubble (the pet's and the guests' lines) paints on top
// of the panels it crosses and never over the care buttons. Starts the Vite dev server in-process and drives the
// system Chrome or Edge (playwright-core, no downloaded browser). Skips, and says why, when no browser is found.
// PHONE_LAYOUT_URL=http://127.0.0.1:8097/ uses an already running dev server instead.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WEB = join(import.meta.dirname, "..");
const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const ANDROID = "Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36";

/** Widths 320 to 414, short and tall; two landscape phones. */
export const PHONE_SIZES = [
  { w: 320, h: 568, ua: IPHONE, name: "iPhone SE (1st)" },
  { w: 360, h: 640, ua: ANDROID, name: "small Android" },
  { w: 375, h: 667, ua: IPHONE, name: "iPhone SE" },
  { w: 375, h: 812, ua: IPHONE, name: "iPhone mini" },
  { w: 360, h: 800, ua: ANDROID, name: "tall Android" },
  { w: 390, h: 844, ua: IPHONE, name: "iPhone" },
  { w: 414, h: 736, ua: IPHONE, name: "iPhone Plus" },
  { w: 414, h: 896, ua: IPHONE, name: "iPhone Max" },
  { w: 667, h: 375, ua: IPHONE, name: "iPhone SE landscape" },
  { w: 844, h: 390, ua: IPHONE, name: "iPhone landscape" },
];

function findBrowser() {
  const env = process.env.PHONE_LAYOUT_BROWSER || process.env.CHROME_PATH;
  const list = [
    env,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  return list.find((p) => p && existsSync(p)) || null;
}

/** Runs in the page: the visible boxes of each part, clipped to the panel that scrolls them. */
function measure() {
  const box = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return b.width > 0 && b.height > 0 ? { t: b.top, b: b.bottom, l: b.left, r: b.right } : null;
  };
  const clip = (a, c) => {
    if (!a || !c) return a;
    const r = { t: Math.max(a.t, c.t), b: Math.min(a.b, c.b), l: Math.max(a.l, c.l), r: Math.min(a.r, c.r) };
    return r.b > r.t && r.r > r.l ? r : null;
  };
  const room = document.querySelector("[data-phone-floor]");
  const aside = box(document.querySelector("[data-desk-aside]"));
  const rail = box(document.querySelector("[data-desk-rail]"));
  const careEl = document.querySelector("[data-desk-care]");
  const care = box(careEl?.querySelector("[class*=blotter-care]") || careEl);
  const hello = clip(box(document.querySelector("[data-first-hint]")), aside);
  const plaque = clip(box(document.querySelector("[data-plaque]")), aside);
  const open = [...document.querySelectorAll('[data-speech="open"]')];
  const bubbles = open
    .map((el) => {
      const b = box(el.firstElementChild || el);
      if (!b) return null;
      const hits = {};
      for (const [name, other] of Object.entries({ aside, rail, hello, plaque })) {
        if (!other) continue;
        const c = clip(b, other);
        if (!c) continue;
        const top = document.elementFromPoint((c.l + c.r) / 2, (c.t + c.b) / 2);
        // On top of the panel: this bubble, or another speech bubble crossing it (two speakers), wins the tap.
        hits[name] = !!(top && open.some((b) => b.contains(top)));
        if (!hits[name]) hits[`${name}Top`] = top ? `${top.tagName}.${String(top.className).slice(0, 40)}` : "none";
      }
      return { box: b, hits, text: (el.textContent || "").trim().slice(0, 40) };
    })
    .filter(Boolean);
  return { phone: !!room, aside, rail, care, hello, plaque, bubbles, fitted: !!document.querySelector("[data-desk-aside]")?.style.maxHeight };
}

function overlaps(a, b) {
  if (!a || !b) return 0;
  const w = Math.min(a.r, b.r) - Math.max(a.l, b.l);
  const h = Math.min(a.b, b.b) - Math.max(a.t, b.t);
  return w > 1 && h > 1 ? Math.round(w * h) : 0;
}

/** Every overlap on the phone desk, in words. Empty when the layout is clean. */
export function layoutProblems(m, label) {
  const bad = [];
  if (!m.phone) return [`${label}: the desk did not take the phone layout`];
  for (const part of ["aside", "rail", "care"]) if (!m[part]) bad.push(`${label}: no ${part}`);
  const pairs = [
    ["aside", "rail"],
    ["aside", "care"],
    ["rail", "care"],
    ["hello", "rail"],
    ["hello", "care"],
    ["plaque", "rail"],
    ["plaque", "care"],
  ];
  for (const [a, b] of pairs) {
    const px = overlaps(m[a], m[b]);
    if (px) bad.push(`${label}: ${a} overlaps ${b} (${px} px²) ${JSON.stringify([m[a], m[b]])}`);
  }
  for (const bubble of m.bubbles) {
    if (overlaps(bubble.box, m.care)) bad.push(`${label}: speech bubble "${bubble.text}" covers the care buttons`);
    for (const [name, onTop] of Object.entries(bubble.hits)) {
      if (name.endsWith("Top") || onTop) continue;
      bad.push(`${label}: speech bubble "${bubble.text}" is under the ${name} (${bubble.hits[`${name}Top`]})`);
    }
  }
  return bad;
}

const browserPath = findBrowser();

test("the checked-in route tree is in the generator's order, so npm run dev leaves git status clean", () => {
  const src = readFileSync(join(WEB, "src", "routeTree.gen.ts"), "utf8");
  const paths = [...src.matchAll(/^import \{ Route as \w+ \} from '\.\/routes\/([^']+)'$/gm)].map((m) => m[1]);
  assert.deepEqual(paths.slice(0, 2), ["__root", "index"]);
  const flat = paths.slice(2).filter((p) => !p.includes(".") && !p.includes("/") && !p.includes("$"));
  assert.ok(flat.length >= 20, `found ${flat.length} rooms`);
  assert.deepEqual(flat, [...flat].sort(), "top-level routes are alphabetical, the way TanStack Router writes them");
  const firstNested = paths.findIndex((p, i) => i >= 2 && (p.includes(".") || p.includes("/")));
  assert.ok(paths.slice(firstNested).every((p) => p.includes(".") || p.includes("/")), "nested routes come after the flat ones");
});

test("phone desk: hello, plaque, rail, care buttons and speech bubbles never overlap", { skip: browserPath ? false : "no Chrome or Edge found (set PHONE_LAYOUT_BROWSER)", timeout: 300_000 }, async () => {
  const { chromium } = await import("playwright-core");
  const routeTree = join(WEB, "src", "routeTree.gen.ts");
  const routeTreeBefore = readFileSync(routeTree, "utf8");
  let server = null;
  let url = process.env.PHONE_LAYOUT_URL || "";
  if (!url) {
    const { createServer } = await import("vite");
    server = await createServer({ root: WEB, logLevel: "silent", server: { host: "127.0.0.1", port: 0, strictPort: false } });
    await server.listen();
    url = server.resolvedUrls?.local?.[0] || `http://127.0.0.1:${server.config.server.port}/`;
  }
  const browser = await chromium.launch({ executablePath: browserPath, headless: true, args: ["--no-sandbox", "--no-first-run"] });
  const problems = [];
  const seen = [];
  let routeTreeRewritten = false;
  try {
    for (const size of PHONE_SIZES) {
      const label = `${size.w}×${size.h} ${size.name}`;
      const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h }, isMobile: true, hasTouch: true, userAgent: size.ua });
      const page = await ctx.newPage();
      try {
        await page.goto(url, { waitUntil: "load", timeout: 120_000 });
        await page.waitForSelector("[data-first-hint-ok]", { timeout: 120_000 });
        const fitted = await page
          .waitForFunction(() => !!document.querySelector("[data-desk-aside]")?.style.maxHeight, null, { timeout: 8_000 })
          .then(() => true, () => false);
        if (!fitted) problems.push(`${label}: the panels were never fitted above the care buttons`);
        await page.waitForTimeout(400);
        const hello = await page.evaluate(measure);
        problems.push(...layoutProblems(hello, `${label} (hello up)`));
        // Got it can be reached: scrolled into its panel, a tap at its middle lands on it.
        const reach = await page.evaluate(() => {
          const ok = document.querySelector("[data-first-hint-ok]");
          ok.scrollIntoView({ block: "nearest" });
          const b = ok.getBoundingClientRect();
          const top = document.elementFromPoint((b.left + b.right) / 2, (b.top + b.bottom) / 2);
          return top === ok || ok.contains(top);
        });
        if (!reach) problems.push(`${label}: Got it is covered`);
        await page.evaluate(() => document.querySelector("[data-first-hint-ok]").click());
        await page.waitForSelector("[data-plaque]", { timeout: 10_000 });
        await page.waitForTimeout(500);
        const after = await page.evaluate(measure);
        problems.push(...layoutProblems(after, `${label} (plaque)`));
        // A spoken line: Talk answers with House lines and the bubble opens.
        await page.evaluate(() => [...document.querySelectorAll("[data-desk-care] button")].find((b) => b.textContent.trim() === "Talk")?.click());
        await page.waitForSelector('[data-speech="open"]', { timeout: 15_000 });
        await page.waitForTimeout(300);
        const talk = await page.evaluate(measure);
        if (!talk.bubbles.length) problems.push(`${label}: no speech bubble after Talk`);
        problems.push(...layoutProblems(talk, `${label} (talking)`));
        seen.push({ label, plaque: await page.evaluate(() => document.querySelector("[data-plaque]")?.getAttribute("data-plaque")), bubbles: talk.bubbles.length });
      } catch (err) {
        problems.push(`${label}: ${String(err?.message || err).split("\n")[0]}`);
      } finally {
        await ctx.close();
      }
    }
  } finally {
    await browser.close();
    if (server) await server.close();
    // The dev server regenerates the route tree when its order drifts; leave the checkout as it was, and say so.
    const after = readFileSync(routeTree, "utf8");
    routeTreeRewritten = !!server && after.replace(/\r\n/g, "\n") !== routeTreeBefore.replace(/\r\n/g, "\n");
    if (after !== routeTreeBefore) writeFileSync(routeTree, routeTreeBefore);
  }
  assert.equal(routeTreeRewritten, false, "the dev server rewrote src/routeTree.gen.ts: run npm run dev once and commit the generated file");
  assert.equal(seen.length, PHONE_SIZES.length, JSON.stringify({ seen, problems }, null, 1));
  assert.deepEqual(problems, [], problems.join("\n"));
});
