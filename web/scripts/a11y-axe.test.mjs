// Accessibility, in a real browser (the access pass, September 2026). axe-core runs on every main page at a laptop
// (1366×768) and a phone (390×844) size, signed out and, with the stand-in session, signed in; a new serious or
// critical violation fails, and so does a moderate `region` (content outside every landmark). Known and kept on
// purpose: axe's target-size on the drawn scene itself (a walking pet's hit box, a desk plant, a called guest), which
// the other pets and the care row pass over as they move; every other target is held to 24×24 by the sweep in
// phone-desk-layout.test.mjs. Then the keyboard on the desk: the skip link is the first Tab stop and takes the focus
// to the care buttons (the page elsewhere), a desk plant draws a focus ring, a care word pressed with Enter keeps the
// focus through the busy spell (it fell to the page and Tab started again at the top), and Escape closes a drawer
// and gives the focus to its summary. With reduced motion asked for, the desk plants stand still.
// Starts the Vite dev server in-process and drives the system Chrome or Edge (playwright-core, no downloaded
// browser); skips, and says why, when no browser is found. A11Y_URL / A11Y_SIGNED_IN_URL use running dev servers.

import { after, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createServer as netServer } from "node:net";
import { join } from "node:path";

const WEB = join(import.meta.dirname, "..");

export const A11Y_PAGES = [
  "/", "/meet", "/catalog", "/login", "/mind", "/demo", "/demo/rui", "/admin", "/live", "/no-such-room",
  "/snakes", "/sea", "/garden", "/hive", "/grid", "/study", "/log",
];
export const A11Y_SIGNED_IN = ["/collection", "/hatch", "/nest", "/pets/rui"];
export const A11Y_SIZES = [
  { w: 1366, h: 768 },
  { w: 390, h: 844, phone: true },
];
/** The WCAG 2.0 to 2.2 A and AA rules and axe's best practices; only serious and critical ones fail. */
export const A11Y_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
/**
 * The drawn scene: moving hit boxes other moving art passes over (see the top of this file). Each is 112 to 176 px
 * across; axe counts what is left uncovered at the moment it looks (a pet walking in front of a plant, a called guest
 * beside another, the care row over a plant on a phone). A bigger invisible hit area would only cover more of its
 * neighbours, so they are kept as drawn (the access pass 2 notes in docs/APP-HARNESS.md).
 */
export const A11Y_SCENE = "[data-pet-hit], [data-plant], .called-guest";
/** Moderate rules held too: every piece of a page sits in a landmark (/demo's desk strips did not). */
export const A11Y_ALSO = ["region"];

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

const browserPath = findBrowser();
const skip = browserPath ? false : "no Chrome or Edge found (set PHONE_LAYOUT_BROWSER)";
const routeTree = join(WEB, "src", "routeTree.gen.ts");
const axeSource = () => readFileSync(join(WEB, "node_modules", "axe-core", "axe.min.js"), "utf8");
let shared = null;
let standIn = null;

async function site() {
  if (shared) return shared;
  const { chromium } = await import("playwright-core");
  const routeTreeBefore = readFileSync(routeTree, "utf8");
  let server = null;
  let url = process.env.A11Y_URL || "";
  if (!url) {
    const { createServer } = await import("vite");
    server = await createServer({ root: WEB, logLevel: "silent", server: { host: "127.0.0.1", port: 0, strictPort: false } });
    await server.listen();
    url = server.resolvedUrls?.local?.[0] || `http://127.0.0.1:${server.config.server.port}/`;
  }
  const browser = await chromium.launch({ executablePath: browserPath, headless: true, args: ["--no-sandbox", "--no-first-run"] });
  shared = { url: url.replace(/\/$/, ""), server, browser, routeTreeBefore };
  return shared;
}

function freePort() {
  return new Promise((resolve, reject) => {
    const s = netServer();
    s.once("error", reject);
    s.listen(0, "127.0.0.1", () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });
}

/** The stand-in session (auth off, the dev keeper on in-memory PGLite, a seeded kennel), as phone-desk-layout uses. */
async function standInSite() {
  if (standIn) return standIn;
  if (process.env.A11Y_SIGNED_IN_URL) {
    standIn = { url: process.env.A11Y_SIGNED_IN_URL.replace(/\/$/, ""), child: null };
    return standIn;
  }
  const port = await freePort();
  const vite = join(WEB, "node_modules", "vite", "bin", "vite.js");
  const child = spawn(process.execPath, [vite, "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: WEB,
    env: { ...process.env, VITE_AUTH_ENABLED: "false", DATABASE_URL: "", COMPUTERPETS_DEV_SEED: "kennel", BROWSER: "none" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  let log = "";
  child.stdout.on("data", (d) => (log += d));
  child.stderr.on("data", (d) => (log += d));
  standIn = { url: `http://127.0.0.1:${port}`, child };
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`the stand-in dev server stopped: ${log.slice(-400)}`);
    const ok = await fetch(`${standIn.url}/login`).then((r) => r.ok, () => false);
    if (ok) return standIn;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`the stand-in dev server did not start: ${log.slice(-400)}`);
}

after(async () => {
  const child = standIn?.child;
  if (child && child.exitCode === null) {
    const gone = new Promise((r) => child.once("exit", r));
    child.kill();
    await Promise.race([gone, new Promise((r) => setTimeout(r, 5_000))]);
  }
  if (shared) {
    await shared.browser.close().catch(() => {});
    if (shared.server) await shared.server.close();
    if (readFileSync(routeTree, "utf8") !== shared.routeTreeBefore) writeFileSync(routeTree, shared.routeTreeBefore);
  }
});

/** Opens a page and waits for React to take it over (the header's link has its props). */
async function open(ctx, url) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 180_000 });
  await page.waitForFunction(() => {
    const a = document.querySelector("header a");
    return !!a && Object.keys(a).some((k) => k.startsWith("__reactProps"));
  }, null, { timeout: 180_000 });
  await page.waitForTimeout(1200);
  return page;
}

/** Runs in the page: axe's serious and critical violations, less the drawn scene's target-size. */
async function axeRun([tags, scene, also]) {
  const res = await window.axe.run(document, { runOnly: { type: "tag", values: tags }, resultTypes: ["violations"] });
  const out = [];
  for (const v of res.violations) {
    if (v.impact !== "serious" && v.impact !== "critical" && !also.includes(v.id)) continue;
    const nodes = v.nodes.filter((n) => {
      if (v.id !== "target-size") return true;
      const el = document.querySelector(n.target[0]);
      return !(el && el.matches(scene));
    });
    for (const n of nodes) out.push(`${v.impact} ${v.id}: ${n.target.join(" ")} ${n.html.slice(0, 100)} (${(n.failureSummary || "").replace(/\s+/g, " ").slice(0, 160)})`);
  }
  return out;
}

async function sweep(base, pages) {
  const { browser } = await site();
  const axe = axeSource();
  const bad = [];
  for (const size of A11Y_SIZES) {
    const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h }, isMobile: !!size.phone, hasTouch: !!size.phone });
    for (const path of pages) {
      const page = await open(ctx, base + path);
      await page.addScriptTag({ content: axe });
      for (const line of await page.evaluate(axeRun, [A11Y_TAGS, A11Y_SCENE, A11Y_ALSO])) bad.push(`${size.w}×${size.h} ${path}: ${line}`);
      await page.close();
    }
    await ctx.close();
  }
  return bad;
}

test("axe: no serious or critical violation on the main pages at 1366×768 and 390×844, signed out", { skip, timeout: 900_000 }, async () => {
  const { url } = await site();
  const bad = await sweep(url, A11Y_PAGES);
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("axe: no serious or critical violation on the signed-in rooms (the stand-in session)", { skip, timeout: 900_000 }, async () => {
  const { url } = await standInSite();
  const bad = await sweep(url, A11Y_SIGNED_IN);
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("keyboard on the desk: a plant's focus ring, the focus kept through a busy care word, Escape closes a drawer", { skip, timeout: 300_000 }, async () => {
  const { url, browser } = await site();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await open(ctx, `${url}/`);
  const problems = [];
  // A desk plant is a Tab stop; its keyboard focus draws a ring (the inline outline hid it).
  await page.evaluate(() => document.querySelector("[data-plant]")?.focus());
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  const ring = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el?.matches("[data-plant]")) return `focus on ${el?.tagName}`;
    const cs = getComputedStyle(el);
    return cs.outlineStyle !== "none" && Number.parseFloat(cs.outlineWidth) >= 2 ? "ring" : `no ring (${cs.outlineStyle} ${cs.outlineWidth})`;
  });
  if (ring !== "ring") problems.push(`desk plant: ${ring}`);
  // Talk with Enter makes the pet busy (every care word greys out); the focus stays in the care row and comes back.
  await page.evaluate(() => [...document.querySelectorAll("[data-desk-care] button")].find((b) => b.textContent.trim() === "Talk")?.focus());
  await page.keyboard.press("Enter");
  const during = [];
  for (let i = 0; i < 20; i += 1) {
    await page.waitForTimeout(250);
    during.push(await page.evaluate(() => (document.activeElement && document.activeElement !== document.body ? !!document.activeElement.closest("[data-desk-care]") : false)));
  }
  if (during.includes(false)) problems.push(`Talk with Enter: the focus left the care row (${during.map((d) => (d ? "row" : "page")).join(" ")})`);
  await page.waitForFunction(() => {
    const b = [...document.querySelectorAll("[data-desk-care] button")].find((x) => x.textContent.trim() === "Talk");
    return !!b && !b.disabled;
  }, null, { timeout: 30_000 });
  await page.waitForTimeout(300);
  const back = await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 40));
  if (back !== "Talk") problems.push(`after Talk the focus is on "${back}", not Talk`);
  await ctx.close();
  // Escape closes the drawer the keyboard is in (a /meet room on a phone) and focuses its summary.
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const meet = await open(phone, `${url}/meet`);
  const opened = await meet.evaluate(() => {
    const s = [...document.querySelectorAll("details:not([open]) > summary")].find((x) => x.getBoundingClientRect().height > 0);
    s?.focus();
    return !!s;
  });
  await meet.keyboard.press("Enter");
  await meet.keyboard.press("Tab");
  const inDrawer = await meet.evaluate(() => !!document.activeElement?.closest("details[open]"));
  await meet.keyboard.press("Escape");
  const shut = await meet.evaluate(() => ({ tag: document.activeElement?.tagName, open: !!document.activeElement?.closest("details")?.open }));
  if (!opened || !inDrawer || shut.tag !== "SUMMARY" || shut.open) problems.push(`/meet drawer: found ${opened}, focus inside ${inDrawer}, after Escape ${JSON.stringify(shut)}`);
  await phone.close();
  assert.deepEqual(problems, [], problems.join("\n"));
});

test("the skip link: the first Tab on a desk goes to the care buttons, elsewhere to the page", { skip, timeout: 300_000 }, async () => {
  const { url, browser } = await site();
  const problems = [];
  for (const size of A11Y_SIZES) {
    const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h }, isMobile: !!size.phone, hasTouch: !!size.phone });
    for (const [path, words, lands] of [
      ["/", "Skip to the care buttons", "care"],
      ["/demo/rui", "Skip to the care buttons", "care"],
      ["/meet", "Skip to the page", "main"],
      ["/study", "Skip to the page", "main"],
      ["/hive", "Skip to the care buttons", "care"],
    ]) {
      const page = await open(ctx, url + path);
      await page.waitForFunction((w) => document.querySelector("[data-skip-link]")?.textContent === w, words, { timeout: 30_000 }).catch(() => {});
      await page.evaluate(() => {
        (document.activeElement instanceof HTMLElement ? document.activeElement : document.body).blur();
        window.getSelection()?.removeAllRanges();
      });
      await page.keyboard.press("Tab");
      const first = await page.evaluate(() => {
        const el = document.activeElement;
        const r = el?.getBoundingClientRect();
        return { skip: !!el?.matches("[data-skip-link]"), text: el?.textContent, w: r?.width ?? 0, h: r?.height ?? 0, top: r?.top ?? -1 };
      });
      if (!first.skip || first.text !== words || first.w < 24 || first.h < 24 || first.top < 0) {
        problems.push(`${size.w}×${size.h} ${path}: the first Tab reached ${JSON.stringify(first)}`);
      }
      await page.keyboard.press("Enter");
      const at = await page.evaluate(() => {
        const el = document.activeElement;
        return { care: !!el?.closest('.blotter-care[role="toolbar"]'), main: el?.tagName === "MAIN", tag: el?.tagName, text: el?.textContent?.trim().slice(0, 30) };
      });
      if (!at[lands]) problems.push(`${size.w}×${size.h} ${path}: after Enter the focus is on ${at.tag} "${at.text}", not the ${lands}`);
      await page.close();
    }
    await ctx.close();
  }
  assert.deepEqual(problems, [], problems.join("\n"));
});

test("reduced motion: the plants stand still, and Brick and Sip are drawn still where they rest", { skip, timeout: 300_000 }, async () => {
  const { url, browser } = await site();
  // The places each piece is drawn at, sampled over 7.5 s of /demo/rui (Brick and Sip fly in as it opens).
  const sample = async (reducedMotion) => {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion });
    const page = await open(ctx, `${url}/demo/rui`);
    const seen = { plants: new Set(), robin: new Set(), bird: new Set() };
    for (let i = 0; i < 30; i += 1) {
      const at = await page.evaluate(() => {
        const shown = (sel) => {
          const el = document.querySelector(sel);
          return el && el.style.visibility !== "hidden" && el.style.transform ? el.style.transform : null;
        };
        return {
          plants: [...document.querySelectorAll("[data-plant]")].map((el) => el.style.transform).join(" | "),
          robin: shown("[data-robin]"),
          bird: shown("[data-bird]"),
        };
      });
      for (const k of ["plants", "robin", "bird"]) if (at[k]) seen[k].add(at[k]);
      await page.waitForTimeout(250);
    }
    await ctx.close();
    return { plants: seen.plants.size, robin: seen.robin.size, bird: seen.bird.size };
  };
  const moving = await sample("no-preference");
  const calm = await sample("reduce");
  // Without the setting they move (so the check below is a real one); with it, one still spot each (a bird that
  // moves on to a new hover spot is drawn there at once: two).
  assert.ok(moving.plants > 1 && moving.robin > 3 && moving.bird > 3, `the scene did not move without reduced motion: ${JSON.stringify(moving)}`);
  assert.ok(calm.plants === 1 && calm.robin === 1 && calm.bird >= 1 && calm.bird <= 2, `reduced motion still moves: ${JSON.stringify(calm)}`);
});

test("a 280 px screen, 200 % zoom on a laptop, and print", { skip, timeout: 300_000 }, async () => {
  const { url, browser } = await site();
  const problems = [];
  // 280 px wide: nothing runs past the right edge (Sign in did, by 20 px).
  const narrow = await browser.newContext({ viewport: { width: 280, height: 653 } });
  for (const path of ["/", "/meet", "/login", "/demo/rui"]) {
    const page = await open(narrow, url + path);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > 280) problems.push(`280 px ${path}: the page is ${sw} px wide`);
    await page.close();
  }
  await narrow.close();
  // 1366×768 at 200 %: a 683×384 window, under the room's 520 px floor. The mouse wheel scrolls the desk down to
  // its care buttons (the page would not scroll, and they sat under the bottom edge).
  const zoom = await browser.newContext({ viewport: { width: 683, height: 384 } });
  for (const path of ["/", "/demo/rui"]) {
    const page = await open(zoom, url + path);
    await page.mouse.move(500, 250); // the floor, clear of the plaque and the rail (they scroll on their own)
    for (let i = 0; i < 4; i += 1) await page.mouse.wheel(0, 400);
    await page.waitForTimeout(400);
    const off = await page.evaluate(() => {
      const out = [];
      for (const b of document.querySelectorAll('.blotter-care[role="toolbar"] button')) {
        const r = b.getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight + 1) out.push(`${b.textContent} ${Math.round(r.top)}-${Math.round(r.bottom)}`);
      }
      return out;
    });
    if (off.length) problems.push(`683×384 ${path}: care buttons off the screen after scrolling: ${off.join(", ")}`);
    await page.close();
  }
  await zoom.close();
  // Print: dark ink, no header, and every drawer open for the print (closed again after).
  const paper = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const study = await open(paper, `${url}/study`);
  const shut = await study.evaluate(() => document.querySelectorAll("details:not([open])").length);
  const during = await study.evaluate(() => {
    window.dispatchEvent(new Event("beforeprint"));
    return document.querySelectorAll("details:not([open])").length;
  });
  const afterPrint = await study.evaluate(() => {
    window.dispatchEvent(new Event("afterprint"));
    return document.querySelectorAll("details:not([open])").length;
  });
  if (!(shut > 0 && during === 0 && afterPrint === shut)) problems.push(`print drawers: ${shut} closed, ${during} during the print, ${afterPrint} after`);
  await study.emulateMedia({ media: "print" });
  const ink = await study.evaluate(() => ({
    p: getComputedStyle(document.querySelector("main p")).color,
    header: getComputedStyle(document.querySelector("[data-site-header]")).display,
  }));
  if (ink.p !== "rgb(29, 26, 23)" || ink.header !== "none") problems.push(`print: ${JSON.stringify(ink)}`);
  await paper.close();
  assert.deepEqual(problems, [], problems.join("\n"));
});

test("the pieces the keyboard fixes stand on", () => {
  const care = readFileSync(join(WEB, "src", "components", "desk", "blotter-care.tsx"), "utf8");
  assert.match(care, /tabIndex=\{-1\}/);
  assert.match(care, /if \(document\.activeElement === e\.currentTarget\) pressedRef\.current = mark\.label;/);
  const shell = readFileSync(join(WEB, "src", "components", "app-shell.tsx"), "utf8");
  assert.match(shell, /export function closeDrawerOnEscape\(/);
  assert.match(shell, /document\.addEventListener\("keydown", onKey\)/);
  const css = readFileSync(join(WEB, "src", "styles.css"), "utf8");
  assert.match(css, /\[data-plant\]:focus-visible \{\s*outline: 2px solid var\(--color-primary\) !important;/);
  assert.match(css, /--color-subtle: #8c857b;/);
  assert.match(css, /\.paper-card \{[^}]*--color-subtle: #625a50;/);
});

test("the pieces the axe fixes stand on, and the phone Hide line sits in the room's note", () => {
  const read = (...p) => readFileSync(join(WEB, "src", ...p), "utf8");
  const room = read("components", "desk", "companion-room.tsx");
  // A phone hide: the pet's line goes into the note under the hidden stage, not into a bubble over the plaque.
  assert.match(room, /const speechInNote = hand && stats\.hidden && !!speech;/);
  assert.match(room, /speech=\{speechInNote \? null : speech\}/);
  assert.match(room, /data-hidden-speech[^>]*hidden=\{!speechInNote\}[^>]*aria-live="polite"/);
  // A meter bar is a <dd> of its own row (a bare <i> inside a <dl> row broke the list).
  assert.match(read("components", "desk", "keeper-card.tsx"), /<dd className="keeper-meter-bar">/);
  // The desk's plates are not a second banner or an unnamed aside.
  for (const f of ["mac-desk-extra.tsx", "linux-desk-extra.tsx", "tablet-desk-sit.tsx", "windows-desk-sit.tsx"]) {
    assert.doesNotMatch(read("components", "desk", f), /<(header|aside|nav)\b/, f);
  }
  // A link inside a sentence is underlined, not only colored.
  assert.match(read("routes", "study.tsx"), /to="\/snakes" className="text-fg underline underline-offset-2/);
});
