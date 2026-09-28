// Phone desk and site layout, in a real browser. At every phone size below: the hello, the species plaque, the room
// rail and the care buttons never overlap, the pet's speech bubble (the pet's and the guests' lines) paints on top of
// the panels it crosses and never over the care buttons, every care button is on the screen (a landscape phone too),
// the room rail rests on whole rows (no label cut in half), and the site header fits: no clipped or wrapped item,
// and its Menu opens, closes on Escape (focus back on Menu), on a tap outside and on tabbing out. The site pages a new
// keeper meets (/meet, /catalog, /collection, /login, /hatch, /log, /pets/<key>) are checked at a phone and a laptop
// size: the header fits, nothing scrolls sideways, and no page throws (a hydration mismatch included).
// Starts the Vite dev server in-process and drives the system Chrome or Edge (playwright-core, no downloaded
// browser). Skips, and says why, when no browser is found.
// PHONE_LAYOUT_URL=http://127.0.0.1:8097/ uses an already running dev server instead.
import { after, test } from "node:test";
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
  // The header's own controls (the name, Menu, Sign in); the open menu list is checked on its own.
  const head = [...document.querySelectorAll("header a, header button")]
    .filter((el) => !el.closest("[data-site-menu]"))
    .map((el) => ({ name: (el.textContent || "").trim().replace(/\s+/g, " "), box: box(el) }))
    .filter((h) => h.box);
  const careButtons = careEl ? [...careEl.querySelectorAll("button")].map((el) => ({ name: (el.textContent || "").trim(), box: box(el) })).filter((c) => c.box) : [];
  const scroller = document.scrollingElement || document.documentElement;
  return {
    phone: !!room,
    aside,
    rail,
    care,
    hello,
    plaque,
    bubbles,
    head,
    careButtons,
    vw: innerWidth,
    vh: innerHeight,
    pageScroll: scroller.scrollHeight - innerHeight,
    fitted: !!document.querySelector("[data-desk-aside]")?.style.maxHeight,
  };
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
  // The header sits over the room: its controls never cover the panels below it.
  for (const h of m.head || []) {
    for (const part of ["aside", "rail", "hello", "plaque"]) {
      const px = overlaps(h.box, m[part]);
      if (px) bad.push(`${label}: header "${h.name}" overlaps the ${part} (${px} px²)`);
    }
  }
  // Every care button is on the screen, with no page scroll to reach it (the shell does not scroll on the desk).
  for (const c of m.careButtons || []) {
    if (c.box.t < -0.5 || c.box.b > m.vh + 0.5 || c.box.l < -0.5 || c.box.r > m.vw + 0.5) bad.push(`${label}: care button "${c.name}" is off the screen ${JSON.stringify(c.box)}`);
  }
  if (m.pageScroll > 1) bad.push(`${label}: the desk page scrolls ${m.pageScroll}px`);
  for (const bubble of m.bubbles) {
    if (overlaps(bubble.box, m.care)) bad.push(`${label}: speech bubble "${bubble.text}" covers the care buttons`);
    for (const [name, onTop] of Object.entries(bubble.hits)) {
      if (name.endsWith("Top") || onTop) continue;
      bad.push(`${label}: speech bubble "${bubble.text}" is under the ${name} (${bubble.hits[`${name}Top`]})`);
    }
  }
  return bad;
}

/** Runs in the page: every way the site header can go wrong at this size, in words. */
function headerProblems() {
  const bad = [];
  const header = document.querySelector("header");
  if (!header) return ["no site header"];
  const vw = innerWidth;
  const shown = (el) => {
    const b = el.getBoundingClientRect();
    return b.width > 0 && b.height > 0 && !el.closest("[hidden]");
  };
  // Lines one text node wraps onto (a baseline-aligned label next to it is not a wrap).
  const lines = (el) => {
    let most = 0;
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      if (!n.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      const tops = [...range.getClientRects()].filter((r) => r.width > 0).map((r) => r.top).sort((a, b) => a - b);
      const rows = tops.filter((t, i) => i === 0 || t - tops[i - 1] > 4).length;
      most = Math.max(most, rows);
    }
    return most;
  };
  const items = [...header.querySelectorAll("a, button")].filter((el) => shown(el) && !el.closest("[data-site-menu]"));
  if (!items.some((el) => el.hasAttribute("data-site-menu-button"))) bad.push("no Menu button in the header");
  for (const el of items) {
    const name = (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().replace(/\s+/g, " ");
    const b = el.getBoundingClientRect();
    if (b.left < -0.5 || b.right > vw + 0.5) bad.push(`header "${name}" runs off the screen (${Math.round(b.left)}..${Math.round(b.right)} of ${vw})`);
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflowX === "visible" && cs.overflowY === "visible") continue;
      const pb = p.getBoundingClientRect();
      if (b.left < pb.left - 0.5 || b.right > pb.right + 0.5 || b.top < pb.top - 0.5 || b.bottom > pb.bottom + 0.5) {
        bad.push(`header "${name}" is clipped by its ${p.tagName.toLowerCase()}`);
        break;
      }
    }
    const n = lines(el);
    if (n > 1) bad.push(`header "${name}" wraps onto ${n} lines`);
  }
  for (const nav of header.querySelectorAll("nav")) {
    if (shown(nav) && !nav.closest("[data-site-menu]") && nav.scrollWidth > nav.clientWidth + 1) bad.push(`a header nav scrolls sideways (${nav.scrollWidth} in ${nav.clientWidth})`);
  }
  const row = header.firstElementChild;
  if (row && row.scrollWidth > row.clientWidth + 1) bad.push(`the header row overflows (${row.scrollWidth} in ${row.clientWidth})`);
  return bad;
}

/** Runs in the page: the Menu button, its list, and where focus is. */
function menuState() {
  const button = document.querySelector("[data-site-menu-button]");
  if (!button) return null;
  const panel = document.getElementById(button.getAttribute("aria-controls") || "");
  const r = panel?.getBoundingClientRect();
  const links = panel ? [...panel.querySelectorAll("a")] : [];
  return {
    expanded: button.getAttribute("aria-expanded"),
    panel: !!panel,
    shown: !!panel && !panel.hidden && !!r && r.width > 0 && r.height > 0,
    focusInside: !!panel && panel.contains(document.activeElement),
    focusOnButton: document.activeElement === button,
    box: r ? { t: r.top, b: r.bottom, l: r.left, r: r.right } : null,
    vw: innerWidth,
    vh: innerHeight,
    navLabel: panel?.querySelector("nav")?.getAttribute("aria-label") || "",
    links: links.map((a) => a.textContent.trim()),
    current: links.filter((a) => a.getAttribute("aria-current") === "page").map((a) => a.textContent.trim()),
    cut: links
      .filter((a) => {
        const x = a.getBoundingClientRect();
        return x.left < r.left - 0.5 || x.right > r.right + 0.5 || a.scrollWidth > a.clientWidth + 1;
      })
      .map((a) => a.textContent.trim()),
  };
}

/** Runs in the page: an empty spot in the header row (not a link, a button or the open list), for a tap outside. */
function emptyHeaderSpot() {
  const row = document.querySelector("header")?.firstElementChild;
  if (!row) return null;
  const b = row.getBoundingClientRect();
  const y = b.top + b.height / 2;
  for (let x = b.left + 2; x < b.right - 2; x += 3) {
    const el = document.elementFromPoint(x, y);
    if (el && row.contains(el) && !el.closest("a, button, [data-site-menu]")) return { x, y };
  }
  return null;
}

/** Places a new keeper needs from the menu at any width. */
const MENU_MUST = ["Meet", "Desk", "Den", "Live", "Kennel", "Hatchery", "Log", "Minds"];

/** Drives the header Menu like a keeper would: keyboard, a tap, a tap outside, tabbing out. Problems in words. */
async function menuProblems(page, label, must = MENU_MUST) {
  const bad = [];
  let s = await page.evaluate(menuState);
  if (!s) return [`${label}: no Menu button`];
  if (!s.panel) return [`${label}: Menu does not point at its list (aria-controls)`];
  if (s.expanded !== "false" || s.shown) bad.push(`${label}: the menu starts open`);
  const button = page.locator("[data-site-menu-button]");
  await button.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(150);
  s = await page.evaluate(menuState);
  if (s.expanded !== "true" || !s.shown) bad.push(`${label}: Enter on Menu did not open it`);
  if (!s.focusInside) bad.push(`${label}: focus did not move into the open menu`);
  if (s.box && (s.box.l < -0.5 || s.box.r > s.vw + 0.5 || s.box.t < -0.5 || s.box.b > s.vh + 0.5)) bad.push(`${label}: the open menu runs off the screen ${JSON.stringify(s.box)}`);
  for (const want of must) if (!s.links.includes(want)) bad.push(`${label}: the menu has no ${want}`);
  if (s.cut.length) bad.push(`${label}: menu items cut: ${s.cut.join(", ")}`);
  if (!s.navLabel) bad.push(`${label}: the menu's nav has no accessible name`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  s = await page.evaluate(menuState);
  if (s.expanded !== "false" || s.shown) bad.push(`${label}: Escape did not close the menu`);
  if (!s.focusOnButton) bad.push(`${label}: Escape did not give focus back to Menu`);
  await button.click();
  await page.waitForTimeout(150);
  s = await page.evaluate(menuState);
  if (!s.shown) bad.push(`${label}: a tap on Menu did not open it`);
  const spot = await page.evaluate(emptyHeaderSpot);
  if (spot) {
    await page.mouse.click(spot.x, spot.y);
    await page.waitForTimeout(150);
    s = await page.evaluate(menuState);
    if (s.shown || s.expanded !== "false") bad.push(`${label}: a tap outside did not close the menu`);
  } else bad.push(`${label}: no empty spot in the header to tap outside the menu`);
  await button.click();
  await page.waitForTimeout(150);
  await page.evaluate(() => {
    const links = document.querySelectorAll("[data-site-menu] a");
    links[links.length - 1]?.focus();
  });
  await page.keyboard.press("Tab");
  await page.waitForTimeout(150);
  s = await page.evaluate(menuState);
  if (s.shown) bad.push(`${label}: tabbing out of the menu left it open`);
  if (s.shown) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);
  }
  return bad;
}

/** Runs in the page: rail labels the rail's edges cut through right now. */
function railCuts() {
  const rail = document.querySelector("[data-desk-rail]");
  if (!rail) return ["(no rail)"];
  const rb = rail.getBoundingClientRect();
  const top = rb.top + rail.clientTop;
  const bottom = top + rail.clientHeight;
  return [...rail.querySelectorAll("li")]
    .filter((li) => {
      const b = li.getBoundingClientRect();
      return (b.top < top - 1 && b.bottom > top + 1) || (b.top < bottom - 1 && b.bottom > bottom + 1);
    })
    .map((li) => (li.textContent || "").trim());
}

/** The room rail rests on whole rows: at load, after a real wheel, and after being scrolled to stops between rows. */
async function railProblems(page, label) {
  const bad = [];
  const info = await page.evaluate(() => {
    const r = document.querySelector("[data-desk-rail]");
    if (!r) return null;
    return { sh: r.scrollHeight, ch: r.clientHeight, row: r.querySelector("li")?.getBoundingClientRect().height || 0, snap: getComputedStyle(r).scrollSnapType };
  });
  if (!info) return { bad: [`${label}: no room rail`], scrolls: false };
  const cuts = async (when) => {
    const c = await page.evaluate(railCuts);
    if (c.length) bad.push(`${label}: the rail rests ${when} with ${c.join(", ")} cut in half`);
  };
  await cuts("at load");
  const scrolls = info.sh > info.ch + 1;
  if (!scrolls) return { bad, scrolls };
  if (!/mandatory/.test(info.snap)) bad.push(`${label}: the rail scrolls but does not snap (${info.snap})`);
  if (info.row && Math.abs(info.ch / info.row - Math.round(info.ch / info.row)) > 0.05) bad.push(`${label}: the rail is ${info.ch}px tall, not whole ${info.row}px rows`);
  const rb = await page.locator("[data-desk-rail]").boundingBox();
  await page.mouse.move(rb.x + rb.width / 2, rb.y + rb.height / 2);
  await page.mouse.wheel(0, Math.round(info.row * 1.4));
  await page.waitForTimeout(700);
  await cuts("after a wheel");
  for (const f of [0.37, 0.61, 1]) {
    await page.evaluate((frac) => {
      const r = document.querySelector("[data-desk-rail]");
      r.scrollTop = Math.round((r.scrollHeight - r.clientHeight) * frac) + 3;
    }, f);
    await page.waitForTimeout(500);
    await cuts(`scrolled to ${Math.round(f * 100)}%`);
  }
  await page.evaluate(() => {
    document.querySelector("[data-desk-rail]").scrollTop = 0;
  });
  return { bad, scrolls };
}

const browserPath = findBrowser();
const skip = browserPath ? false : "no Chrome or Edge found (set PHONE_LAYOUT_BROWSER)";

const routeTree = join(WEB, "src", "routeTree.gen.ts");
let shared = null;

/** One dev server and one browser for every browser test in this file. */
async function site() {
  if (shared) return shared;
  const { chromium } = await import("playwright-core");
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
  shared = { url: url.replace(/\/$/, ""), server, browser, routeTreeBefore, closed: false };
  return shared;
}

/** Closes the browser and the dev server; true when the dev server rewrote the route tree (and puts it back). */
async function closeSite() {
  if (!shared || shared.closed) return false;
  shared.closed = true;
  await shared.browser.close().catch(() => {});
  if (shared.server) await shared.server.close();
  const after = readFileSync(routeTree, "utf8");
  const rewritten = !!shared.server && after.replace(/\r\n/g, "\n") !== shared.routeTreeBefore.replace(/\r\n/g, "\n");
  if (after !== shared.routeTreeBefore) writeFileSync(routeTree, shared.routeTreeBefore);
  return rewritten;
}

after(async () => {
  await closeSite();
});

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

test("phone desk: hello, plaque, rail, care buttons, speech bubbles and the header never overlap; the rail rests on whole rows; the menu works", { skip, timeout: 420_000 }, async () => {
  const { url, browser } = await site();
  const problems = [];
  const seen = [];
  for (const size of PHONE_SIZES) {
    const label = `${size.w}×${size.h} ${size.name}`;
    const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h }, isMobile: true, hasTouch: true, userAgent: size.ua });
    const page = await ctx.newPage();
    try {
      await page.goto(`${url}/`, { waitUntil: "load", timeout: 120_000 });
      await page.waitForSelector("[data-first-hint-ok]", { timeout: 120_000 });
      const fitted = await page
        .waitForFunction(() => !!document.querySelector("[data-desk-aside]")?.style.maxHeight, null, { timeout: 8_000 })
        .then(() => true, () => false);
      if (!fitted) problems.push(`${label}: the panels were never fitted above the care buttons`);
      await page.waitForTimeout(400);
      const hello = await page.evaluate(measure);
      problems.push(...layoutProblems(hello, `${label} (hello up)`));
      problems.push(...(await page.evaluate(headerProblems)).map((p) => `${label}: ${p}`));
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
      const rail = await railProblems(page, label);
      problems.push(...rail.bad);
      problems.push(...(await menuProblems(page, label)));
      // A spoken line: Talk answers with House lines and the bubble opens.
      await page.evaluate(() => [...document.querySelectorAll("[data-desk-care] button")].find((b) => b.textContent.trim() === "Talk")?.click());
      await page.waitForSelector('[data-speech="open"]', { timeout: 15_000 });
      await page.waitForTimeout(300);
      const talk = await page.evaluate(measure);
      if (!talk.bubbles.length) problems.push(`${label}: no speech bubble after Talk`);
      problems.push(...layoutProblems(talk, `${label} (talking)`));
      seen.push({ label, plaque: await page.evaluate(() => document.querySelector("[data-plaque]")?.getAttribute("data-plaque")), bubbles: talk.bubbles.length, railScrolls: rail.scrolls });
    } catch (err) {
      problems.push(`${label}: ${String(err?.message || err).split("\n")[0]}`);
    } finally {
      await ctx.close();
    }
  }
  assert.equal(seen.length, PHONE_SIZES.length, JSON.stringify({ seen, problems }, null, 1));
  assert.ok(seen.some((s) => s.railScrolls), "the rail never scrolled at any size, so its snap was not tried");
  assert.deepEqual(problems, [], problems.join("\n"));
});

/** The pages a new keeper meets beyond the desk (signed out: the kennel, the hatchery and a pet page ask to sign in). */
export const SITE_PAGES = ["/meet", "/catalog", "/collection", "/login", "/hatch", "/log", "/pets/rui"];
export const SITE_SIZES = [
  { w: 320, h: 568, ua: IPHONE, name: "small phone", phone: true },
  { w: 1280, h: 800, name: "laptop", phone: false },
];

test("site pages: the header fits and its menu works at phone and laptop sizes, nothing scrolls sideways, no page throws", { skip, timeout: 420_000 }, async () => {
  const { url, browser } = await site();
  const problems = [];
  let visited = 0;
  const sizes = [...SITE_SIZES, { w: 1024, h: 768, name: "small laptop", phone: false, only: "/meet" }, { w: 414, h: 896, ua: IPHONE, name: "big phone", phone: true, only: "/log" }];
  for (const size of sizes) {
    const ctx = await browser.newContext({
      viewport: { width: size.w, height: size.h },
      ...(size.phone ? { isMobile: true, hasTouch: true, userAgent: size.ua } : {}),
    });
    try {
      let menuTried = false;
      for (const path of size.only ? [size.only] : SITE_PAGES) {
        const label = `${path} ${size.w}×${size.h}`;
        const page = await ctx.newPage();
        const thrown = [];
        page.on("pageerror", (err) => thrown.push(String(err?.message || err).split("\n")[0]));
        try {
          await page.goto(`${url}${path}`, { waitUntil: "load", timeout: 120_000 });
          await page.waitForSelector("[data-site-menu-button]", { timeout: 60_000 });
          await page.waitForTimeout(1_200);
          problems.push(...(await page.evaluate(headerProblems)).map((p) => `${label}: ${p}`));
          const wide = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
          if (wide > 1) problems.push(`${label}: the page scrolls sideways by ${wide}px`);
          if (!menuTried) {
            menuTried = true;
            problems.push(...(await menuProblems(page, label)));
          }
          for (const t of thrown) problems.push(`${label}: the page threw: ${t}`);
          visited += 1;
        } catch (err) {
          problems.push(`${label}: ${String(err?.message || err).split("\n")[0]}`);
        } finally {
          await page.close();
        }
      }
    } finally {
      await ctx.close();
    }
  }
  assert.equal(visited, SITE_PAGES.length * SITE_SIZES.length + 2, problems.join("\n"));
  assert.deepEqual(problems, [], problems.join("\n"));
});

test("the in-process dev server left src/routeTree.gen.ts as checked in", { skip }, async () => {
  if (!shared) return;
  const rewritten = await closeSite();
  assert.equal(rewritten, false, "the dev server rewrote src/routeTree.gen.ts: run npm run dev once and commit the generated file");
});
