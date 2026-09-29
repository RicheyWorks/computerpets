// Phone desk and site layout, in a real browser. At every phone size below: the hello, the species plaque, the room
// rail and the care buttons never overlap, the pet's speech bubble (the pet's and the guests' lines) paints on top of
// the panels it crosses and never over the care buttons, every care button is on the screen (a landscape phone too),
// the room rail rests on whole rows (no label cut in half), and the site header fits: no clipped or wrapped item,
// and its Menu opens, closes on Escape (focus back on Menu), on a tap outside and on tabbing out. The site pages a new
// keeper meets (/meet, /catalog, /collection, /login, /hatch, /log, /pets/<key>) are checked at a phone and a laptop
// size: the header fits, nothing scrolls sideways, and no page throws (a hydration mismatch included).
// Also: rail rows, the room's own links and Send are at least 44 px tall on a phone; the speech bubble never sits
// over the site header (sampled while the pet walks); a signed-out visit to a gated page lands on
// /login?next=<that page> and the header's Sign in remembers the page; the desk sends no request to the optional
// house server (127.0.0.1:8081) until it has answered on this browser (and stops again once it has been silent for
// three visits), and its tab says who is on the desk; /meet on a phone stays under 12,000 px, its jump index opens
// every room and together they reach all 221 guests, a search finds a guest, #room-<id> opens that room; "The house"
// on /log and /study and the keeper card's Check are 44 px on a phone; /login fits a landscape phone with its
// buttons on screen; a mistyped link gets words, a tab title and ways on; and the signed-in rooms (the kennel, the hatchery, the nest) and a kennel pet's page are
// checked at five phone sizes with a stand-in session: a second dev server with auth off (the dev keeper on
// in-memory PGLite, seeded with a six-guest kennel; no account, no database file). There the kennel comes first: the
// first card's name is on the screen without a scroll at every size (the whole card at 375×667 and 414×896), every
// panel link is 44 px, and the sign-in-off "Go to the desk" on /login is 44 px. /study and /log on a phone are
// field-note indexes: under 5,500 and 4,500 px, every note reachable (a tap opens it, Open all opens all, a search
// finds one, #note-<slug> opens on arrival). /login at 568×320 does not scroll; the not-found tab title is in the
// first server HTML; /demo/<slug> takes the phone layout with no update loop. The eighteen room pages (/snakes, /sea,
// /garden, ...) are field-note indexes too: closed drawers under 4,000 px at 375×667 (/grid 4,800, /hive 6,000 with
// the insects and bees and comb under one search), every note a 44 px tap that shows its tell, each set's Open all, search by name, #note-<slug> on
// arrival. On a phone /demo docks its weather, news and market plates in the panel (they sat over the kicker and the
// name) and they open on a tap; /mind stays under 2,400 px with every mind a tap away; /demo/<unknown> has its own
// tab title, a 404 and a 44 px "See who is awake"; /pets/<not-a-pet>'s "Back to kennel" is 44 px. A phone's /demo has a
// 44 px "Weather, news, market" jump near the top of the panel. At desktop sizes (1024×768, 1280×800, 1440×900) every
// target on /, /catalog and /demo is at least 24×24 (WCAG 2.2) with none crowding another, the rail and the panel end
// on the screen (1366×768 and 1280×720 too, the hello's Got it with them) and /demo's plates sit clear of the panel,
// as does its drawn second window. The rail shows the current guest (a guest deep in its room, on arrival and on a
// room change without a page load), the speech bubble never crosses a plate while a line shows, a landscape phone's
// plates jump is on the screen as the page opens, and signed in the panel is the one scroller on /collection, /nest
// and /catalog (desktop and phone).
// Starts the Vite dev server in-process and drives the system Chrome or Edge (playwright-core, no downloaded
// browser). Skips, and says why, when no browser is found.
// PHONE_LAYOUT_URL=http://127.0.0.1:8097/ uses an already running dev server instead.
import { after, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createServer as netServer } from "node:net";
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
    header: box(document.querySelector("[data-site-header]") || document.querySelector("header")),
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
    // A landscape phone is short: a bubble never rises over the site header (bubbleRoom in lib/pets/phone-desk.ts).
    if (overlaps(bubble.box, m.header)) bad.push(`${label}: speech bubble "${bubble.text}" sits over the site header ${JSON.stringify([bubble.box, m.header])}`);
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

/** Thumb-sized on a phone: at least this tall (and the room links this wide), in CSS px. */
export const TAP_MIN = 44;

/** Runs in the page: tap targets on a phone room below 44 px (the room's own links, Send, every rail row). */
function tapProblems(min) {
  const bad = [];
  const name = (el) => (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().replace(/\s+/g, " ").slice(0, 30);
  const seen = (el) => {
    const b = el.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  };
  const links = [...document.querySelectorAll("[data-phone-floor] [data-room-links] a, [data-phone-floor] [data-talk-send]")].filter(seen);
  if (!links.length) bad.push("no room links under the care buttons");
  for (const el of links) {
    const b = el.getBoundingClientRect();
    if (b.height < min - 0.5 || b.width < min - 0.5) bad.push(`"${name(el)}" is ${Math.round(b.width)}×${Math.round(b.height)} px, under ${min}`);
  }
  // Every link in the left panel too: the room's line ("Or pair two you already keep."), the kennel's cards.
  for (const el of [...document.querySelectorAll("[data-phone-floor] [data-desk-aside] a")].filter(seen)) {
    const b = el.getBoundingClientRect();
    if (b.height < min - 0.5) bad.push(`panel link "${name(el)}" is ${Math.round(b.width)}×${Math.round(b.height)} px, under ${min}`);
  }
  const rows = [...document.querySelectorAll("[data-phone-floor] [data-desk-rail] li > *")].filter(seen);
  if (!rows.length) bad.push("no rail rows");
  for (const el of rows) {
    const b = el.getBoundingClientRect();
    if (b.height < min - 0.5) bad.push(`rail row "${name(el)}" is ${Math.round(b.height)} px tall, under ${min}`);
  }
  return { bad, links: links.length, rows: rows.length };
}

/** WCAG 2.2 target size (minimum): a desktop-size room's pointer targets are at least 24 by 24 px. */
export const DESK_TARGET_MIN = 24;
/** The named desktop targets this pass grew (and that must not crowd each other). */
const DESK_TARGETS = "[data-plaque] a, [data-plaque] button, [data-desk-rail] a, [data-desk-rail] button, [data-room-links] a, [data-talk-send], [data-line-link], [data-desk-care] button, [data-desk-plate] > button, [data-first-hint-ok], [data-open-room]";

/**
 * Runs in the page: at a desktop size, every visible pointer target under min px (sr-only buttons until focused and
 * links inside a sentence are exempt, as WCAG allows), the named targets (rail rows, plaque links, room links, Send,
 * care buttons, plate bars) that overlap each other, and whether the rail and the left panel end on the screen.
 */
function deskTargetProblems({ min, named }) {
  const bad = [];
  const name = (el) => (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().replace(/\s+/g, " ").slice(0, 32);
  const shown = (el) => {
    const b = el.getBoundingClientRect();
    if (b.width <= 1 || b.height <= 1) return false;
    if (b.bottom <= 0 || b.top >= innerHeight || b.right <= 0 || b.left >= innerWidth) return false;
    for (let p = el; p; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) return false;
    }
    // Scrolled out of the rail or the panel (both scroll inside).
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      if (/(auto|scroll|hidden)/.test(getComputedStyle(p).overflowY)) {
        const pb = p.getBoundingClientRect();
        if (b.bottom <= pb.top + 1 || b.top >= pb.bottom - 1) return false;
      }
    }
    return true;
  };
  const inSentence = (el) => {
    const p = el.parentElement;
    return getComputedStyle(el).display === "inline" && !!p && !el.closest("[data-room-links]") && (p.textContent || "").replace(/\s+/g, " ").trim().length > (el.textContent || "").trim().length + 12;
  };
  const all = [...document.querySelectorAll("a[href], button, summary, select, input:not([type=hidden])")].filter(shown).filter((el) => !el.closest("[data-desk-plate] > div"));
  for (const el of all) {
    if (inSentence(el)) continue;
    const b = el.getBoundingClientRect();
    if (b.width < min - 0.5 || b.height < min - 0.5) bad.push(`"${name(el)}" is ${Math.round(b.width)}×${Math.round(b.height)} px, under ${min}`);
  }
  // What shows of a target: a rail guest half scrolled out of the rail is cut at the rail's edge (a tap there lands
  // on whatever is under it, not the guest), so two targets crowd only where both show.
  const seen = (el) => {
    const r = el.getBoundingClientRect();
    let b = { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (/(auto|scroll|hidden|clip)/.test(cs.overflowY) || /(auto|scroll|hidden|clip)/.test(cs.overflowX)) {
        const pb = p.getBoundingClientRect();
        b = { left: Math.max(b.left, pb.left), right: Math.min(b.right, pb.right), top: Math.max(b.top, pb.top), bottom: Math.min(b.bottom, pb.bottom) };
      }
    }
    return b;
  };
  const boxes = [...document.querySelectorAll(named)].filter(shown).map((el) => ({ el, b: seen(el) }));
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i];
      const c = boxes[j];
      if (a.el.contains(c.el) || c.el.contains(a.el)) continue;
      const x = Math.min(a.b.right, c.b.right) - Math.max(a.b.left, c.b.left);
      const y = Math.min(a.b.bottom, c.b.bottom) - Math.max(a.b.top, c.b.top);
      if (x > 1 && y > 1) bad.push(`"${name(a.el)}" and "${name(c.el)}" overlap`);
    }
  }
  const rail = document.querySelector("[data-desk-rail]");
  if (rail) {
    const top = rail.scrollTop;
    rail.scrollTop = rail.scrollHeight;
    const guests = [...rail.querySelectorAll(".den-cabinet-guest")];
    const last = guests[guests.length - 1]?.getBoundingClientRect();
    if (last && last.bottom > innerHeight + 1) bad.push(`the rail's last guest is below the screen (bottom ${Math.round(last.bottom)} of ${innerHeight})`);
    rail.scrollTop = top;
  }
  const aside = document.querySelector("[data-desk-aside]")?.getBoundingClientRect();
  if (aside && aside.bottom > innerHeight + 1) bad.push(`the left panel runs ${Math.round(aside.bottom - innerHeight)} px below the screen`);
  return { bad, targets: all.length, named: boxes.length };
}

/** The heartbeat probe's address (the optional house server): the desk asks it only after it has answered here. */
const HOUSE_SERVER = /^https?:\/\/(127\.0\.0\.1|localhost):8081\//;

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

/** A free port on 127.0.0.1. */
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

let standIn = null;

/**
 * The stand-in session for the signed-in rooms (the kennel, the hatchery, the nest): a second dev server with
 * auth off (VITE_AUTH_ENABLED=false), so the page and the server both use the dev keeper ("dev-user") on the
 * embedded in-memory PGLite. No account, no cookie, no database file; it all goes when the server stops.
 * DATABASE_URL is cleared so it can never touch a real database. COMPUTERPETS_DEV_SEED=kennel hatches a small kennel
 * for the dev keeper on its first sanctuary read (lib/pets/dev-seed.server.ts; dev keeper, PGLite and sign-in off
 * only), so the rooms are checked full of cards and a pet page opens in its "in your kennel" state.
 * PHONE_LAYOUT_SIGNED_IN_URL uses a running one (start it with the same three variables).
 */
async function standInSite() {
  if (standIn) return standIn;
  if (process.env.PHONE_LAYOUT_SIGNED_IN_URL) {
    standIn = { url: process.env.PHONE_LAYOUT_SIGNED_IN_URL.replace(/\/$/, ""), child: null };
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

async function closeStandIn() {
  const child = standIn?.child;
  if (!child || child.exitCode !== null) return;
  const gone = new Promise((r) => child.once("exit", r));
  child.kill();
  await Promise.race([gone, new Promise((r) => setTimeout(r, 5_000))]);
}

/** Closes the browser and the dev servers; true when a dev server rewrote the route tree (and puts it back). */
async function closeSite() {
  await closeStandIn();
  if (!shared || shared.closed) return false;
  shared.closed = true;
  await shared.browser.close().catch(() => {});
  if (shared.server) await shared.server.close();
  const after = readFileSync(routeTree, "utf8");
  const rewritten = (!!shared.server || !!standIn?.child) && after.replace(/\r\n/g, "\n") !== shared.routeTreeBefore.replace(/\r\n/g, "\n");
  if (after !== shared.routeTreeBefore) writeFileSync(routeTree, shared.routeTreeBefore);
  return rewritten;
}

after(async () => {
  await closeSite();
  await closeStandIn();
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

test("the speech bubble's room under the header is re-read before a new line paints and when its stage resizes", () => {
  // The landscape flake: the stage shrank after hydration with no window resize, and a new line (taller than the
  // blank bubble) painted one frame with the old room, over the header. The room is now read in a layout effect,
  // capped before the paint, on the stage's own resize, and on the 400 ms tick.
  const src = readFileSync(join(WEB, "src", "components", "desk", "living-pet.tsx"), "utf8");
  const at = src.indexOf("The bubble never rises over the site header");
  assert.ok(at > 0);
  const effect = src.slice(at, src.indexOf("}, [speech]);", at));
  assert.match(effect, /useLayoutEffect\(\(\) => \{/);
  assert.match(effect, /if \(at && at\.lift > bubbleRoomRef\.current\)/);
  assert.match(effect, /window\.setInterval\(refresh, 400\)/);
  assert.match(effect, /new ResizeObserver\(refresh\)/);
  assert.match(effect, /const stage = el\.offsetParent;\n\s+if \(stage\) grow\?\.observe\(stage\);/);
  assert.match(src, /bubbleAtRef\.current = \{ x: bx, lift \};/);
});

test("phone desk: hello, plaque, rail, care buttons, speech bubbles and the header never overlap; the rail rests on whole rows; the menu works", { skip, timeout: 420_000 }, async () => {
  const { url, browser } = await site();
  const problems = [];
  const seen = [];
  for (const size of PHONE_SIZES) {
    const label = `${size.w}×${size.h} ${size.name}`;
    const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h }, isMobile: true, hasTouch: true, userAgent: size.ua });
    const houseHits = [];
    ctx.on("request", (req) => {
      if (HOUSE_SERVER.test(req.url())) houseHits.push(req.url());
    });
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
      const taps = await page.evaluate(tapProblems, TAP_MIN);
      problems.push(...taps.bad.map((p) => `${label}: ${p}`));
      problems.push(...(await menuProblems(page, label)));
      // A spoken line: Talk answers with House lines and the bubble opens.
      await page.evaluate(() => [...document.querySelectorAll("[data-desk-care] button")].find((b) => b.textContent.trim() === "Talk")?.click());
      await page.waitForSelector('[data-speech="open"]', { timeout: 15_000 });
      await page.waitForTimeout(300);
      const talk = await page.evaluate(measure);
      if (!talk.bubbles.length) problems.push(`${label}: no speech bubble after Talk`);
      problems.push(...layoutProblems(talk, `${label} (talking)`));
      // The pet keeps walking while it talks: the bubble stays under the header the whole time.
      for (let i = 0; i < 6; i++) {
        await page.waitForTimeout(250);
        const m = await page.evaluate(measure);
        for (const b of m.bubbles) if (overlaps(b.box, m.header)) problems.push(`${label}: speech bubble "${b.text}" rose over the site header ${JSON.stringify([b.box, m.header])}`);
      }
      // A long line (a guest's, or a late font) makes the bubble taller: it still ends below the header.
      await page.evaluate(() => {
        const el = document.querySelector('[data-speech="open"]');
        const text = el?.querySelector("button, p");
        if (text) text.textContent = "A long line from the pet, long enough to wrap onto four or five lines in the bubble on any phone, so its top climbs.";
      });
      await page.waitForTimeout(400);
      const long = await page.evaluate(measure);
      for (const b of long.bubbles) if (overlaps(b.box, long.header)) problems.push(`${label}: a long speech bubble sits over the site header ${JSON.stringify([b.box, long.header])}`);
      if (houseHits.length) problems.push(`${label}: the desk asked the house server nobody ran (${houseHits.length}× ${houseHits[0]})`);
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

/** /meet on a phone: a page a visitor can get through (it was ~135,000 px tall at 375×667 before the room index). */
export const MEET_PHONE_MAX_HEIGHT = 12_000;
export const MEET_GUESTS = 221;
/** [page, most px at a phone, notes, a kind one search finds]. */
export const FIELD_NOTE_PAGES = [
  ["/study", 5_500, 20, "fox"],
  ["/log", 4_500, 10, "millipede"],
];

test("/meet on a phone: short enough to get through, a jump index opens each room, search finds a guest, all 221 guests reachable; thumb-sized house links; /study and /log field notes walkable; /login fits a landscape phone; a mistyped link gets ways on and its tab title from the server; /demo takes the phone layout", { skip, timeout: 720_000 }, async () => {
  const { url, browser } = await site();
  const problems = [];
  const phone = (w, h) => browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, userAgent: IPHONE });
  const visible = (sel) => [...document.querySelectorAll(sel)].filter((e) => e.getBoundingClientRect().height > 0).map((e) => e.getAttribute("data-meet-guest"));
  const size = (sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return { w: Math.round(b.width), h: Math.round(b.height), top: Math.round(b.top), bottom: Math.round(b.bottom) };
  };
  for (const [w, h] of [[375, 667], [320, 568]]) {
    const ctx = await phone(w, h);
    const label = `/meet ${w}×${h}`;
    try {
      const page = await ctx.newPage();
      const thrown = [];
      page.on("pageerror", (err) => thrown.push(String(err?.message || err).split("\n")[0]));
      await page.goto(`${url}/meet`, { waitUntil: "load", timeout: 120_000 });
      await page.waitForSelector("[data-meet-index] a", { timeout: 60_000 });
      await page.waitForTimeout(1_200);
      const first = await page.evaluate(() => ({
        height: document.documentElement.scrollHeight,
        guests: [...new Set([...document.querySelectorAll("[data-meet-guest]")].map((e) => e.getAttribute("data-meet-guest")))],
        rooms: [...document.querySelectorAll("[data-meet-room]")].map((d) => ({ id: d.id, open: d.open })),
        chips: [...document.querySelectorAll("[data-meet-index] a")].map((a) => ({ href: a.getAttribute("href"), h: Math.round(a.getBoundingClientRect().height) })),
      }));
      if (first.height > MEET_PHONE_MAX_HEIGHT) problems.push(`${label}: the page is ${first.height}px tall (over ${MEET_PHONE_MAX_HEIGHT})`);
      if (first.guests.length !== MEET_GUESTS) problems.push(`${label}: ${first.guests.length} distinct guests on the page, wanted ${MEET_GUESTS}`);
      if (first.rooms.some((r) => r.open)) problems.push(`${label}: a room opens before anyone asks`);
      if (first.chips.length !== first.rooms.length) problems.push(`${label}: ${first.chips.length} jump links for ${first.rooms.length} rooms`);
      for (const c of first.chips) if (c.h < TAP_MIN) problems.push(`${label}: jump link ${c.href} is ${c.h}px tall`);
      // Every guest is reachable: tap each room's jump link; the room opens and its cards are on the page.
      const reached = new Set();
      if (w === 375) {
        for (const c of first.chips) {
          await page.locator(`[data-meet-index] a[href="${c.href}"]`).tap();
          await page.waitForTimeout(150);
          const room = await page.evaluate(({ href, sel }) => {
            const d = document.querySelector(href);
            const top = d ? Math.round(d.getBoundingClientRect().top) : null;
            return { open: !!d?.open, top, cards: d ? [...d.querySelectorAll(sel)].filter((e) => e.getBoundingClientRect().height > 0).map((e) => e.getAttribute("data-meet-guest")) : [] };
          }, { href: c.href, sel: "[data-meet-guest]" });
          if (!room.open) problems.push(`${label}: ${c.href} did not open its room`);
          else if (!room.cards.length) problems.push(`${label}: ${c.href} opened with no guest on the page`);
          if (room.top === null || room.top < -2 || room.top > h) problems.push(`${label}: ${c.href} left its room off the screen (top ${room.top})`);
          for (const k of room.cards) reached.add(k);
        }
        if (reached.size !== MEET_GUESTS) problems.push(`${label}: the rooms reach ${reached.size} guests, wanted ${MEET_GUESTS}`);
        // Search: a name finds its card (and says so); a miss says so in words.
        await page.fill("[data-meet-search]", "rui");
        await page.waitForTimeout(300);
        const found = await page.evaluate(visible, "[data-meet-found] [data-meet-guest]");
        const line = await page.evaluate(() => document.querySelector("[data-meet-count]")?.textContent || "");
        if (!found.includes("red_panda")) problems.push(`${label}: searching "rui" shows ${JSON.stringify(found)}`);
        if (!/1 guest matches/.test(line)) problems.push(`${label}: searching "rui" says "${line}"`);
        await page.fill("[data-meet-search]", "qqqzz");
        await page.waitForTimeout(300);
        const miss = await page.evaluate(() => document.querySelector("[data-meet-count]")?.textContent || "");
        if (!/No guest by that name/.test(miss)) problems.push(`${label}: a search with no match says "${miss}"`);
        const keeperCheck = await page.evaluate(size, "[data-heartbeat-check]");
        if (keeperCheck && (keeperCheck.h < TAP_MIN || keeperCheck.w < TAP_MIN)) problems.push(`${label}: the keeper card's Check is ${keeperCheck.w}×${keeperCheck.h}`);
      }
      for (const t of thrown) problems.push(`${label}: the page threw: ${t}`);
      await page.close();
      // A room link opens that room on arrival.
      const deep = await ctx.newPage();
      await deep.goto(`${url}/meet#room-snakes`, { waitUntil: "load", timeout: 120_000 });
      await deep.waitForSelector("[data-meet-index] a", { timeout: 60_000 });
      const snakes = await deep
        .waitForFunction(() => document.querySelector("#room-snakes")?.open === true, null, { timeout: 8_000 })
        .then(() => true, () => false);
      if (!snakes) problems.push(`${label}: /meet#room-snakes did not open the snakes room`);
      await deep.close();
    } catch (err) {
      problems.push(`${label}: ${String(err?.message || err).split("\n")[0]}`);
    }
    try {
      // "The house" under a room's title is a thumb-sized link.
      for (const path of ["/log", "/study"]) {
        const p = await ctx.newPage();
        await p.goto(`${url}${path}`, { waitUntil: "load", timeout: 120_000 });
        const house = await p.waitForSelector("[data-hero-house]", { timeout: 60_000 }).then(() => p.evaluate(size, "[data-hero-house]"), () => null);
        if (!house) problems.push(`${path} ${w}×${h}: no "The house" link`);
        else if (house.h < TAP_MIN) problems.push(`${path} ${w}×${h}: "The house" is ${house.w}×${house.h}`);
        await p.close();
      }
    } catch (err) {
      problems.push(`/log, /study ${w}×${h}: ${String(err?.message || err).split("\n")[0]}`);
    } finally {
      await ctx.close();
    }
  }
  // /login on a landscape phone: the page does not scroll and the sign-in buttons (or, sign-in off, the way back) are on the screen.
  for (const [w, h] of [[568, 320], [667, 375], [844, 390]]) {
    const ctx = await phone(w, h);
    try {
      const page = await ctx.newPage();
      await page.goto(`${url}/login?next=%2Fcollection`, { waitUntil: "load", timeout: 120_000 });
      await page.waitForSelector("h1", { timeout: 60_000 });
      await page.waitForTimeout(800);
      const fit = await page.evaluate(() => ({
        over: document.documentElement.scrollHeight - innerHeight,
        off: [...document.querySelectorAll("[data-login] button, [data-login] a")].filter((b) => b.getBoundingClientRect().bottom > innerHeight + 1 || b.getBoundingClientRect().top < 0).map((b) => b.textContent.trim()),
      }));
      if (!(await page.$("[data-login]"))) problems.push(`/login ${w}×${h}: no sign-in card ([data-login])`);
      if (fit.over > 1) problems.push(`/login ${w}×${h}: the page scrolls by ${fit.over}px`);
      if (fit.off.length) problems.push(`/login ${w}×${h}: ${fit.off.join(", ")} off the screen`);
    } catch (err) {
      problems.push(`/login ${w}×${h}: ${String(err?.message || err).split("\n")[0]}`);
    } finally {
      await ctx.close();
    }
  }
  // /study and /log on a phone: field-note indexes (they were 10,959 and 6,607 px of notes one after another).
  for (const [path, most, count, find] of FIELD_NOTE_PAGES) {
    for (const [w, h] of [[375, 667], [320, 568]]) {
      const label = `${path} ${w}×${h}`;
      const ctx = await phone(w, h);
      try {
        const page = await ctx.newPage();
        const thrown = [];
        page.on("pageerror", (err) => thrown.push(String(err?.message || err).split("\n")[0]));
        await page.goto(`${url}${path}`, { waitUntil: "load", timeout: 120_000 });
        await page.waitForSelector("[data-field-notes] [data-note]", { timeout: 60_000 });
        await page.waitForTimeout(800);
        const first = await page.evaluate(() => ({
          height: document.documentElement.scrollHeight,
          notes: [...document.querySelectorAll("[data-note]")].map((d) => ({ id: d.id, open: d.open, tell: (d.querySelector("[data-note-tell]")?.textContent || "").trim().length })),
        }));
        if (first.height > most) problems.push(`${label}: the page is ${first.height}px tall (over ${most})`);
        if (first.notes.length !== count) problems.push(`${label}: ${first.notes.length} field notes, wanted ${count}`);
        if (first.notes.some((n) => n.open)) problems.push(`${label}: a note opens before anyone asks`);
        if (first.notes.some((n) => !n.tell)) problems.push(`${label}: a note has no tell in the page`);
        if (w === 375) {
          // Every note is reachable: a tap on its name opens it with its tell on the page.
          for (const n of first.notes) {
            const summary = page.locator(`#${n.id} > summary`);
            await summary.scrollIntoViewIfNeeded();
            const tall = await summary.evaluate((s) => Math.round(s.getBoundingClientRect().height));
            if (tall < TAP_MIN) problems.push(`${label}: #${n.id}'s name is ${tall}px tall`);
            await summary.tap();
            await page.waitForTimeout(80);
            const shown = await page.evaluate((id) => {
              const d = document.getElementById(id);
              return !!d?.open && (d.querySelector("[data-note-tell]")?.getBoundingClientRect().height || 0) > 0;
            }, n.id);
            if (!shown) problems.push(`${label}: a tap on #${n.id} did not show its tell`);
          }
          // Close all, then Open all opens every note.
          await page.locator("[data-notes-all]").tap();
          await page.waitForTimeout(150);
          const closed = await page.evaluate(() => [...document.querySelectorAll("[data-note]")].filter((d) => d.open).length);
          if (closed) problems.push(`${label}: Close all left ${closed} open`);
          await page.locator("[data-notes-all]").tap();
          await page.waitForTimeout(150);
          const opened = await page.evaluate(() => [...document.querySelectorAll("[data-note]")].filter((d) => d.open).length);
          if (opened !== count) problems.push(`${label}: Open all opened ${opened} of ${count}`);
          // Search: a kind finds its one note; a miss says so in words.
          await page.fill("[data-notes-search]", find);
          await page.waitForTimeout(250);
          const found = await page.evaluate(() => ({
            open: [...document.querySelectorAll("[data-note]")].filter((d) => !d.hidden && d.getBoundingClientRect().height > 0).map((d) => d.id),
            line: document.querySelector("[data-notes-count]")?.textContent || "",
          }));
          if (found.open.length !== 1 || !/^1 note matches/.test(found.line)) problems.push(`${label}: searching "${find}" shows ${JSON.stringify(found)}`);
          await page.fill("[data-notes-search]", "qqqzz");
          await page.waitForTimeout(250);
          const miss = await page.evaluate(() => document.querySelector("[data-notes-count]")?.textContent || "");
          if (!/No guest by that name/.test(miss)) problems.push(`${label}: a search with no match says "${miss}"`);
          // A note link opens that note on arrival.
          const id = first.notes[first.notes.length - 1]?.id;
          const deep = await ctx.newPage();
          await deep.goto(`${url}${path}#${id}`, { waitUntil: "load", timeout: 120_000 });
          await deep.waitForSelector("[data-field-notes] [data-note]", { timeout: 60_000 });
          const arrived = await deep.waitForFunction((i) => document.getElementById(i)?.open === true, id, { timeout: 8_000 }).then(() => true, () => false);
          if (!arrived) problems.push(`${label}: ${path}#${id} did not open that note`);
          await deep.close();
        }
        for (const t of thrown) problems.push(`${label}: the page threw: ${t}`);
      } catch (err) {
        problems.push(`${label}: ${String(err?.message || err).split("\n")[0]}`);
      } finally {
        await ctx.close();
      }
    }
  }
  // The not-found tab title is in the first server HTML (it was "ComputerPets" until the page loaded).
  try {
    const res = await fetch(`${url}/no-such-room`);
    const html = await res.text();
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
    if (res.status !== 404) problems.push(`/no-such-room: the server answered ${res.status}, not 404`);
    if (title !== "No room here — ComputerPets") problems.push(`/no-such-room: the server's first tab title is "${title}"`);
    const meet = ((await (await fetch(`${url}/meet`)).text()).match(/<title>([^<]*)<\/title>/) || [])[1];
    if (!meet || /No room here/.test(meet)) problems.push(`/meet: the server's tab title is "${meet}"`);
  } catch (err) {
    problems.push(`/no-such-room (server HTML): ${String(err?.message || err).split("\n")[0]}`);
  }
  // /demo/<slug> on a phone: the phone layout, laid out clean, and no update loop (it looped and never took it).
  for (const [w, h] of [[375, 667], [667, 375]]) {
    const label = `/demo/rui ${w}×${h}`;
    const ctx = await phone(w, h);
    try {
      const page = await ctx.newPage();
      const loud = [];
      page.on("console", (m) => {
        if (m.type() === "error" && /Maximum update depth/.test(m.text())) loud.push(m.text().slice(0, 80));
      });
      page.on("pageerror", (err) => loud.push(String(err?.message || err).split("\n")[0]));
      await page.goto(`${url}/demo/rui`, { waitUntil: "load", timeout: 120_000 });
      const phoneFloor = await page.waitForSelector("[data-phone-floor] [data-desk-care]", { timeout: 60_000 }).then(() => true, () => false);
      if (!phoneFloor) problems.push(`${label}: the demo never took the phone layout`);
      else {
        await page.waitForTimeout(1_500);
        problems.push(...layoutProblems(await page.evaluate(measure), label));
        const others = await page.evaluate(() => ["[data-mac-extra]", "[data-linux-mark]", "[data-windows-sit]", "[data-tablet-sit]"].filter((s) => document.querySelector(s)?.getBoundingClientRect().height > 0));
        if (others.length) problems.push(`${label}: another desk's label shows over the phone (${others.join(", ")})`);
      }
      if (loud.length) problems.push(`${label}: ${loud.length}× ${loud[0]}`);
    } catch (err) {
      problems.push(`${label}: ${String(err?.message || err).split("\n")[0]}`);
    } finally {
      await ctx.close();
    }
  }
  // A mistyped link: words, a tab title and thumb-sized ways on (it was a bare "Not Found").
  {
    const ctx = await phone(375, 667);
    try {
      const page = await ctx.newPage();
      await page.goto(`${url}/no-such-room`, { waitUntil: "load", timeout: 120_000 });
      await page.waitForSelector("[data-not-found] h1", { timeout: 60_000 });
      await page.waitForFunction(() => document.title === "No room here — ComputerPets", null, { timeout: 8_000 }).catch(() => {});
      const nf = await page.evaluate(() => ({
        h1: document.querySelector("[data-not-found] h1")?.textContent || "",
        title: document.title,
        links: [...document.querySelectorAll("[data-not-found] a")].map((a) => ({ href: a.getAttribute("href"), h: Math.round(a.getBoundingClientRect().height) })),
      }));
      if (nf.h1 !== "No room by that name.") problems.push(`/no-such-room: says "${nf.h1}"`);
      if (nf.title !== "No room here — ComputerPets") problems.push(`/no-such-room: the tab says "${nf.title}"`);
      if (JSON.stringify(nf.links.map((l) => l.href)) !== JSON.stringify(["/", "/meet", "/collection"])) problems.push(`/no-such-room: ways on ${JSON.stringify(nf.links)}`);
      for (const l of nf.links) if (l.h < TAP_MIN) problems.push(`/no-such-room: ${l.href} is ${l.h}px tall`);
    } catch (err) {
      problems.push(`/no-such-room: ${String(err?.message || err).split("\n")[0]}`);
    } finally {
      await ctx.close();
    }
  }
  assert.deepEqual(problems, [], problems.join("\n"));
});

/** [room page, most px at 375×667, notes]; /hive's 20 are the insects, then bees and comb, under one search. */
export const ROOM_NOTE_PAGES = [
  ["/canopy", 4_000, 10],
  ["/cellar", 4_000, 10],
  ["/corner", 4_000, 10],
  ["/creek", 4_000, 10],
  ["/far", 4_000, 10],
  ["/garden", 4_000, 10],
  ["/grid", 4_800, 10],
  ["/hive", 6_000, 20],
  ["/meadow", 4_000, 10],
  ["/pond", 4_000, 10],
  ["/reef", 4_000, 10],
  ["/roost", 4_000, 10],
  ["/sea", 4_000, 10],
  ["/shore", 4_000, 10],
  ["/snakes", 4_000, 10],
  ["/stone", 4_000, 10],
  ["/well", 4_000, 10],
  ["/wood", 4_000, 11],
];
export const MIND_PHONE_MAX_HEIGHT = 2_400;
export const MIND_CARDS = 14;

test("the eighteen room pages' field notes on a phone: closed drawers, every note reachable, Open all, search, #note- links; /demo plates dock off the hour line; /mind is short; /demo/<unknown> gets words, a tab title and a thumb-sized way on", { skip, timeout: 900_000 }, async () => {
  const { url, browser } = await site();
  const problems = [];
  const phone = (w, h) => browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, userAgent: IPHONE });
  // The rooms listed every note one after another (6,221 to 11,181 px at 375×667); now each note is a closed drawer.
  for (const [w, h] of [[375, 667], [320, 568]]) {
    const ctx = await phone(w, h);
    try {
      for (const [path, most, count] of ROOM_NOTE_PAGES) {
        const label = `${path} ${w}×${h}`;
        const page = await ctx.newPage();
        const thrown = [];
        page.on("pageerror", (err) => thrown.push(String(err?.message || err).split("\n")[0]));
        try {
          await page.goto(`${url}${path}`, { waitUntil: "load", timeout: 120_000 });
          await page.waitForSelector("[data-field-notes] [data-note]", { timeout: 60_000 });
          await page.waitForTimeout(600);
          const first = await page.evaluate(() => ({
            height: document.documentElement.scrollHeight,
            sets: [...document.querySelectorAll("[data-field-notes]")].map((s) => [...s.querySelectorAll("[data-note]")].length),
            notes: [...document.querySelectorAll("[data-note]")].map((d) => ({
              id: d.id,
              open: d.open,
              name: (d.querySelector("summary .font-display")?.textContent || "").trim(),
              tell: (d.querySelector("[data-note-tell]")?.textContent || "").trim().length,
            })),
          }));
          const extra = w === 320 ? 400 : 0;
          if (first.height > most + extra) problems.push(`${label}: the page is ${first.height}px tall (over ${most + extra})`);
          if (first.notes.length !== count) problems.push(`${label}: ${first.notes.length} field notes, wanted ${count}`);
          if (first.notes.some((n) => n.open)) problems.push(`${label}: a note opens before anyone asks`);
          if (first.notes.some((n) => !n.tell)) problems.push(`${label}: a note has no tell in the page`);
          // One search per room: /hive's bees and comb had a second one of their own.
          if (first.sets.length !== 1) problems.push(`${label}: ${first.sets.length} field-note sections (one search should cover every note)`);
          if (w === 375) {
            for (const n of first.notes) {
              const summary = page.locator(`[id="${n.id}"] > summary`);
              await summary.scrollIntoViewIfNeeded();
              const tall = await summary.evaluate((s) => Math.round(s.getBoundingClientRect().height));
              if (tall < TAP_MIN) problems.push(`${label}: #${n.id}'s name is ${tall}px tall`);
              await summary.tap();
              await page.waitForTimeout(60);
              const shown = await page.evaluate((id) => {
                const d = document.getElementById(id);
                return !!d?.open && (d.querySelector("[data-note-tell]")?.getBoundingClientRect().height || 0) > 0;
              }, n.id);
              if (!shown) problems.push(`${label}: a tap on #${n.id} did not show its tell`);
            }
            // Each set's Close all, then Open all, opens every note in that set.
            for (let i = 0; i < first.sets.length; i += 1) {
              const all = page.locator("[data-field-notes]").nth(i).locator("[data-notes-all]");
              await all.tap();
              await page.waitForTimeout(120);
              await all.tap();
              await page.waitForTimeout(120);
              const opened = await page.evaluate((k) => [...document.querySelectorAll("[data-field-notes]")[k].querySelectorAll("[data-note]")].filter((d) => d.open).length, i);
              if (opened !== first.sets[i]) problems.push(`${label}: set ${i + 1}'s Open all opened ${opened} of ${first.sets[i]}`);
            }
            // Search: the last note's name finds it.
            const last = first.notes[first.notes.length - 1];
            const search = page.locator("[data-field-notes]").last().locator("[data-notes-search]");
            await search.fill(last.name);
            // A cold dev server can hand the page over before the search listens: type it again if the count line
            // has not moved (the check is what the search finds, not how fast the first keystroke lands).
            const moved = () => page.waitForFunction((n) => /match/.test(document.querySelector("[data-notes-count]")?.textContent || "") || !n, last.name, { timeout: 3_000 }).then(() => true, () => false);
            if (!(await moved())) {
              await search.fill("");
              await search.fill(last.name);
              await moved();
            }
            const found = await page.evaluate((id) => {
              const set = document.getElementById(id)?.closest("[data-field-notes]");
              return {
                hit: !!document.getElementById(id) && !document.getElementById(id).hidden,
                shown: set ? [...set.querySelectorAll("[data-note]")].filter((d) => !d.hidden).length : 0,
                line: set?.querySelector("[data-notes-count]")?.textContent || "",
              };
            }, last.id);
            if (!found.hit || found.shown > 2 || !/match/.test(found.line)) problems.push(`${label}: searching "${last.name}" shows ${JSON.stringify(found)}`);
            // The same search finds the first note too (on /hive: an insect, where the last is a bee).
            await search.fill(first.notes[0].name);
            await page.waitForTimeout(200);
            const firstHit = await page.evaluate((id) => !!document.getElementById(id) && !document.getElementById(id).hidden, first.notes[0].id);
            if (!firstHit) problems.push(`${label}: the search did not find "${first.notes[0].name}"`);
            await search.fill("");
            // A note link opens that note on arrival.
            const deep = await ctx.newPage();
            await deep.goto(`${url}${path}#${last.id}`, { waitUntil: "load", timeout: 120_000 });
            await deep.waitForSelector("[data-field-notes] [data-note]", { timeout: 60_000 });
            const arrived = await deep.waitForFunction((i) => document.getElementById(i)?.open === true, last.id, { timeout: 8_000 }).then(() => true, () => false);
            if (!arrived) problems.push(`${label}: ${path}#${last.id} did not open that note`);
            await deep.close();
          }
          for (const t of thrown) problems.push(`${label}: the page threw: ${t}`);
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
  // /demo on a phone: the weather, news and market plates (and the desktop's "A window") sat over the kicker and the
  // guest's name; on a phone they dock in the panel instead, thumb-sized, and open on a tap.
  for (const [w, h] of [[320, 568], [375, 667], [667, 375]]) {
    const label = `/demo/rui ${w}×${h}`;
    const ctx = await phone(w, h);
    try {
      const page = await ctx.newPage();
      await page.goto(`${url}/demo/rui`, { waitUntil: "load", timeout: 120_000 });
      await page.waitForSelector("[data-phone-floor] [data-desk-care]", { timeout: 60_000 });
      await page.waitForTimeout(1_500);
      const plates = await page.evaluate(() => {
        const box = (e) => {
          const b = e?.getBoundingClientRect();
          return b && b.width ? { t: b.top, b: b.bottom, l: b.left, r: b.right } : null;
        };
        const hit = (a, b) => a && b && Math.min(a.r, b.r) - Math.max(a.l, b.l) > 1 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 1;
        const aside = document.querySelector("[data-desk-aside]");
        const heads = [aside?.querySelector("p"), aside?.querySelector("h1")].map(box);
        const all = [...document.querySelectorAll("[data-desk-plate], [data-demo-window]")];
        return {
          docked: [...document.querySelectorAll("[data-demo-plates] [data-plate-docked]")].map((e) => e.getAttribute("data-desk-plate")),
          loose: all.filter((e) => !aside?.contains(e) && box(e)).map((e) => e.getAttribute("data-desk-plate") || "a window"),
          over: all.filter((e) => heads.some((hd) => hit(box(e), hd))).map((e) => e.getAttribute("data-desk-plate") || "a window"),
          buttons: [...document.querySelectorAll("[data-plate-docked] > button:first-child")].map((b) => Math.round(b.getBoundingClientRect().height)),
        };
      });
      if (JSON.stringify(plates.docked) !== JSON.stringify(["weather", "news", "market"])) problems.push(`${label}: docked plates ${JSON.stringify(plates.docked)}`);
      if (plates.loose.length) problems.push(`${label}: ${plates.loose.join(", ")} still float over the room`);
      if (plates.over.length) problems.push(`${label}: ${plates.over.join(", ")} sit over the kicker or the name`);
      for (const b of plates.buttons) if (b < TAP_MIN) problems.push(`${label}: a docked plate's button is ${b}px tall`);
      // A jump near the top of the panel takes a phone to the plates (they sit at the end of a long scroll).
      const jump = await page.evaluate(() => {
        const j = document.querySelector("[data-plates-jump]")?.getBoundingClientRect();
        const a = document.querySelector("[data-desk-aside]")?.getBoundingClientRect();
        const scrolled = document.querySelector("[data-desk-aside]")?.scrollTop || 0;
        return j && a ? { t: Math.round(j.top), b: Math.round(j.bottom), h: Math.round(j.height), top: Math.round(a.top), fold: Math.round(Math.min(a.bottom, innerHeight)), scrolled } : null;
      });
      if (!jump) problems.push(`${label}: no "Weather, news, market" jump ([data-plates-jump])`);
      else {
        if (jump.h < TAP_MIN) problems.push(`${label}: the plates jump is ${jump.h}px tall`);
        // On the screen as the page opens, upright and on its side. On its side the panel is only 85 to 155 px tall;
        // under the tagline the jump started at the panel's end (185 to 229 in a 68 to 208 panel at 667×375), so it
        // sits beside the name there.
        if (jump.b > jump.fold + 1 || jump.scrolled > 0) problems.push(`${label}: the plates jump is not on the screen as the page opens ${JSON.stringify(jump)}`);
        await page.locator("[data-plates-jump]").tap();
        await page.waitForTimeout(300);
        const landed = await page.evaluate(() => {
          const a = document.querySelector("[data-desk-aside]").getBoundingClientRect();
          const p = document.querySelector("[data-demo-plates]").getBoundingClientRect();
          return { inView: p.top >= a.top - 1 && p.top < Math.min(a.bottom, innerHeight) - 20, focus: document.activeElement?.closest("[data-desk-plate]")?.getAttribute("data-desk-plate") || null };
        });
        if (!landed.inView || landed.focus !== "weather") problems.push(`${label}: the plates jump did not land on the plates ${JSON.stringify(landed)}`);
        await page.evaluate(() => { document.querySelector("[data-desk-aside]").scrollTop = 0; });
      }
      if (w === 375) {
        const news = page.locator('[data-demo-plates] [data-desk-plate="news"] > button').first();
        await news.scrollIntoViewIfNeeded();
        await news.tap();
        await page.waitForTimeout(300);
        const opened = await page.evaluate(() => document.querySelector('[data-demo-plates] [data-desk-plate="news"]')?.children.length || 0);
        if (opened < 2) problems.push(`${label}: a tap on the docked news plate did not open it`);
      }
    } catch (err) {
      problems.push(`${label}: ${String(err?.message || err).split("\n")[0]}`);
    } finally {
      await ctx.close();
    }
  }
  // /mind on a phone was 3,148 px of cards one per row; now two to a row, the chosen one whole, thumb-sized.
  for (const [w, h] of [[375, 667], [320, 568]]) {
    const label = `/mind ${w}×${h}`;
    const ctx = await phone(w, h);
    try {
      const page = await ctx.newPage();
      await page.goto(`${url}/mind`, { waitUntil: "load", timeout: 120_000 });
      await page.waitForSelector("[data-mind-card]", { timeout: 60_000 });
      await page.waitForTimeout(800);
      const mind = await page.evaluate(() => ({
        height: document.documentElement.scrollHeight,
        cards: [...document.querySelectorAll("[data-mind-card]")].map((c) => ({ id: c.getAttribute("data-mind-card"), h: Math.round(c.getBoundingClientRect().height), on: c.getAttribute("aria-pressed") === "true", blurb: (c.querySelector("p.text-muted")?.getBoundingClientRect().height || 0) > 0 })),
        small: [...document.querySelectorAll("main a, main button, main summary, main select, main input")].filter((e) => {
          const b = e.getBoundingClientRect();
          return b.height > 0 && b.height < 44;
        }).map((e) => (e.textContent || e.tagName).trim().slice(0, 24)),
      }));
      const most = w === 320 ? MIND_PHONE_MAX_HEIGHT + 200 : MIND_PHONE_MAX_HEIGHT;
      if (mind.height > most) problems.push(`${label}: the page is ${mind.height}px tall (over ${most})`);
      if (mind.cards.length !== MIND_CARDS) problems.push(`${label}: ${mind.cards.length} mind cards, wanted ${MIND_CARDS}`);
      if (mind.cards.some((c) => c.h < TAP_MIN)) problems.push(`${label}: a mind card is under ${TAP_MIN}px`);
      const chosen = mind.cards.filter((c) => c.on);
      if (chosen.length !== 1 || !chosen[0].blurb) problems.push(`${label}: the chosen mind does not show what it is ${JSON.stringify(chosen)}`);
      if (mind.small.length) problems.push(`${label}: small taps ${JSON.stringify(mind.small)}`);
      if (w === 375) {
        // Every mind is reachable: a tap on another card chooses it and shows its words.
        const other = mind.cards.find((c) => !c.on);
        if (other) {
          const card = page.locator(`[data-mind-card="${other.id}"]`);
          await card.scrollIntoViewIfNeeded();
          await card.tap();
          await page.waitForTimeout(300);
          const shows = await page.evaluate((id) => {
            const c = document.querySelector(`[data-mind-card="${id}"]`);
            return c?.getAttribute("aria-pressed") === "true" && (c.querySelector("p.text-muted")?.getBoundingClientRect().height || 0) > 0;
          }, other.id);
          if (!shows) problems.push(`${label}: a tap on ${other.id} did not choose it and show its words`);
        }
      }
    } catch (err) {
      problems.push(`${label}: ${String(err?.message || err).split("\n")[0]}`);
    } finally {
      await ctx.close();
    }
  }
  // /demo/<unknown>: plain words, its own tab title (it said just "ComputerPets") and a thumb-sized way on.
  try {
    const res = await fetch(`${url}/demo/nope`);
    const html = await res.text();
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
    if (res.status !== 404) problems.push(`/demo/nope: the server answered ${res.status}, not 404`);
    if (!html.includes("No demo for that name.")) problems.push("/demo/nope: the server's first HTML lacks its words");
    if (title !== "No demo here — ComputerPets") problems.push(`/demo/nope: the server's first tab title is "${title}"`);
    const rui = ((await (await fetch(`${url}/demo/rui`)).text()).match(/<title>([^<]*)<\/title>/) || [])[1];
    if (rui !== "Rui — ComputerPets") problems.push(`/demo/rui: the server's tab title is "${rui}"`);
    const ctx = await phone(375, 667);
    try {
      const page = await ctx.newPage();
      await page.goto(`${url}/demo/nope`, { waitUntil: "load", timeout: 120_000 });
      const link = await page.waitForSelector("[data-demo-missing]", { timeout: 60_000 }).then(() => page.evaluate(() => {
        const b = document.querySelector("[data-demo-missing]").getBoundingClientRect();
        return { w: Math.round(b.width), h: Math.round(b.height) };
      }), () => null);
      if (!link) problems.push(`/demo/nope: no "See who is awake" ([data-demo-missing])`);
      else if (link.h < TAP_MIN) problems.push(`/demo/nope: "See who is awake" is ${link.w}×${link.h}`);
      if ((await page.title()) !== "No demo here — ComputerPets") problems.push(`/demo/nope: the tab says "${await page.title()}"`);
    } finally {
      await ctx.close();
    }
  } catch (err) {
    problems.push(`/demo/nope: ${String(err?.message || err).split("\n")[0]}`);
  }
  assert.deepEqual(problems, [], problems.join("\n"));
});

/** Desktop sizes the target check walks (WCAG 2.2 target size), and the pages. */
export const DESK_SIZES = [
  [1024, 768],
  [1280, 800],
  [1440, 900],
];
export const DESK_PAGES = ["/", "/catalog", "/demo/rui"];
/** Short laptop screens where the left panel ran off the bottom (the hello's Got it with it). */
export const DESK_SHORT = [
  [1366, 768],
  [1280, 720],
];

test("desktop sizes: every target at least 24×24 with no two crowding, the rail and the panel end on the screen, the hello's Got it above the care buttons, /demo's plates clear of the panel", { skip, timeout: 420_000 }, async () => {
  const { url, browser } = await site();
  const problems = [];
  for (const [w, h] of [...DESK_SIZES, ...DESK_SHORT]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    try {
      for (const path of DESK_SHORT.some(([a, b]) => a === w && b === h) ? ["/"] : DESK_PAGES) {
        const label = `${path} ${w}×${h}`;
        const page = await ctx.newPage();
        const thrown = [];
        page.on("pageerror", (err) => thrown.push(String(err?.message || err).split("\n")[0]));
        try {
          await page.goto(`${url}${path}`, { waitUntil: "load", timeout: 120_000 });
          await page.waitForSelector("[data-desk-care] button", { timeout: 60_000 });
          await page.waitForFunction(() => !!document.querySelector("[data-desk-rail]")?.style.maxHeight, null, { timeout: 8_000 }).catch(() => problems.push(`${label}: the rail was never fitted to the screen`));
          await page.waitForTimeout(1_200);
          const t = await page.evaluate(deskTargetProblems, { min: DESK_TARGET_MIN, named: DESK_TARGETS });
          problems.push(...t.bad.map((p) => `${label}: ${p}`));
          if (t.named < 30) problems.push(`${label}: only ${t.named} named targets on the screen (the rail, the plaque, the care buttons?)`);
          // The hello (first visit): its Got it is on the screen, inside the panel, and not under the care buttons.
          const hello = await page.evaluate(() => {
            const ok = document.querySelector("[data-first-hint-ok]")?.getBoundingClientRect();
            const aside = document.querySelector("[data-desk-aside]")?.getBoundingClientRect();
            return ok && aside ? { ok: { t: ok.top, b: ok.bottom }, aside: { t: aside.top, b: aside.bottom }, vh: innerHeight } : null;
          });
          if (!hello) problems.push(`${label}: no hello with a Got it`);
          else if (hello.ok.b > Math.min(hello.vh, hello.aside.b) + 1) problems.push(`${label}: the hello's Got it is cut off ${JSON.stringify(hello)}`);
          if (path === "/demo/rui") {
            const plates = await page.evaluate(() => {
              const box = (sel) => {
                const b = document.querySelector(sel)?.getBoundingClientRect();
                return b && b.width ? { t: b.top, b: b.bottom, l: b.left, r: b.right } : null;
              };
              const hit = (a, b) => a && b && Math.min(a.r, b.r) - Math.max(a.l, b.l) > 1 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 1;
              const aside = document.querySelector("[data-desk-aside]");
              const parts = {
                header: box("header"),
                kicker: box("[data-desk-aside] > p"),
                name: box("[data-desk-aside] h1"),
                plaque: box("[data-desk-aside] [data-plaque]"),
                hello: box("[data-first-hint]"),
                rail: box("[data-desk-rail]"),
                care: box("[data-desk-care]"),
              };
              const list = ["weather", "news", "market"].map((k) => ({ k, b: box(`[data-desk-plate="${k}"]`) }));
              const over = [];
              for (const p of list) {
                if (!p.b) over.push(`${p.k} is missing`);
                for (const [n, b] of Object.entries(parts)) if (hit(p.b, b)) over.push(`${p.k} sits over the ${n}`);
              }
              for (let i = 0; i < list.length; i += 1) for (let j = i + 1; j < list.length; j += 1) if (hit(list[i].b, list[j].b)) over.push(`${list[i].k} and ${list[j].k} overlap`);
              // The drawn second window ("A second window") sat behind the panel's plaque and hello (82 to 430 by 246
              // to 522 at 1024×768); it starts right of the panel now, clear of the first window and the plates.
              const b = box('[data-demo-window="b"]');
              const panel = aside?.getBoundingClientRect();
              if (!b) over.push("the second window is missing");
              else {
                if (panel && hit(b, { t: panel.top, b: panel.bottom, l: panel.left, r: panel.right })) over.push(`the second window sits behind the panel ${JSON.stringify(b)}`);
                if (hit(b, box('[data-demo-window="a"]'))) over.push("the two windows overlap");
                for (const [n, p] of Object.entries({ ...parts, ...Object.fromEntries(list.map((x) => [x.k, x.b])) })) if (hit(b, p)) over.push(`the second window sits under the ${n}`);
                if (b.r > innerWidth || b.b > innerHeight) over.push(`the second window runs off the screen ${JSON.stringify(b)}`);
              }
              return over;
            });
            problems.push(...plates.map((p) => `${label}: ${p}`));
          }
          for (const e of thrown) problems.push(`${label}: the page threw: ${e}`);
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
  assert.deepEqual(problems, [], problems.join("\n"));
});

/** Signed-out: each gated page sends the visitor to sign in, and sign-in remembers the page (safeReturnTo). */
export const GATED_PAGES = [
  ["/collection", "/login?next=%2Fcollection"],
  ["/hatch", "/login?next=%2Fhatch"],
  ["/nest", "/login?next=%2Fnest"],
  ["/pets/rui", "/login?next=%2Fpets%2Frui"],
];

test("sign-in remembers the gated page it came from; the header's Sign in remembers the page too", { skip, timeout: 300_000 }, async () => {
  const { url, browser } = await site();
  const problems = [];
  const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, userAgent: IPHONE });
  try {
    const page = await ctx.newPage();
    const thrown = [];
    page.on("pageerror", (err) => thrown.push(String(err?.message || err).split("\n")[0]));
    for (const [from, want] of GATED_PAGES) {
      await page.goto(`${url}${from}`, { waitUntil: "load", timeout: 120_000 });
      const landed = await page
        .waitForURL((u) => u.pathname === "/login", { timeout: 60_000 })
        .then(() => new URL(page.url()), () => null);
      if (!landed) problems.push(`${from}: never sent to sign in (${page.url()})`);
      else if (`${landed.pathname}${landed.search}` !== want) problems.push(`${from}: sent to ${landed.pathname}${landed.search}, wanted ${want}`);
    }
    await page.goto(`${url}/meet`, { waitUntil: "load", timeout: 120_000 });
    await page.waitForSelector("[data-site-menu-button]", { timeout: 60_000 });
    await page.waitForTimeout(800);
    const hrefs = await page.evaluate(() => [...document.querySelectorAll("header a")].filter((a) => /sign in/i.test(a.textContent || "")).map((a) => a.getAttribute("href")));
    if (!hrefs.length || !hrefs.every((h) => h === "/login?next=%2Fmeet")) problems.push(`/meet: header Sign in goes to ${JSON.stringify(hrefs)}, wanted /login?next=%2Fmeet`);
    // A hostile next= does not break the page (the value is refused in lib/auth/return-to.ts; signin-return.test.mjs).
    for (const bad of ["https%3A%2F%2Fevil.example", "%2F%2Fevil.example", "javascript%3Aalert(1)"]) {
      await page.goto(`${url}/login?next=${bad}`, { waitUntil: "load", timeout: 120_000 });
      const ok = await page.waitForSelector("h1", { timeout: 60_000 }).then(() => true, () => false);
      if (!ok) problems.push(`/login?next=${bad}: the sign-in page did not open`);
    }
    // Sign-in that came back with an error says so (Better Auth adds &error=… to errorCallbackURL).
    await page.goto(`${url}/login?next=%2Fcollection&error=access_denied`, { waitUntil: "load", timeout: 120_000 });
    await page.waitForSelector("h1", { timeout: 60_000 });
    await page.waitForTimeout(800);
    const alert = await page.evaluate(() => document.querySelector('[role="alert"]')?.textContent?.trim() || "");
    if (alert !== "Sign-in did not finish. Try again." && (await page.evaluate(() => !!document.querySelector("main button")))) problems.push(`/login?error=: says "${alert}", not that sign-in did not finish`);
    for (const t of thrown) problems.push(`the page threw: ${t}`);
  } finally {
    await ctx.close();
  }
  assert.deepEqual(problems, [], problems.join("\n"));
});

test("the desk stays quiet about the optional house server until it has answered here; the tab says who is on the desk", { skip, timeout: 300_000 }, async () => {
  const { url, browser } = await site();
  const problems = [];
  // seenBefore: answered here (a fresh record); "forgotten": answered once, then silent on three visits (keeper.ts
  // HOUSE_SERVER_FORGET_VISITS), so the desk stops asking and says nothing, like a browser it never answered.
  for (const seenBefore of [false, true, "forgotten"]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    if (seenBefore === true) await ctx.addInitScript(() => localStorage.setItem("computerpets.houseServer.seen", JSON.stringify({ at: Date.now(), missed: 0 })));
    if (seenBefore === "forgotten") await ctx.addInitScript(() => localStorage.setItem("computerpets.houseServer.seen", JSON.stringify({ at: Date.now(), missed: 3 })));
    const hits = [];
    const refused = [];
    ctx.on("request", (req) => {
      if (HOUSE_SERVER.test(req.url())) hits.push(req.url());
    });
    try {
      const page = await ctx.newPage();
      page.on("console", (msg) => {
        if (/ERR_CONNECTION_REFUSED|8081/.test(msg.text())) refused.push(msg.text().slice(0, 120));
      });
      await page.goto(`${url}/`, { waitUntil: "load", timeout: 120_000 });
      await page.waitForSelector("[data-desk-care]", { timeout: 120_000 });
      await page.waitForTimeout(6_000);
      if (!seenBefore) {
        if (hits.length) problems.push(`never answered here, yet the desk asked ${hits.length}× (${hits[0]})`);
        if (refused.length) problems.push(`never answered here, yet the console says: ${refused[0]}`);
        const title = await page.title();
        if (title !== "Rui the Red Panda — ComputerPets") problems.push(`the desk's tab says "${title}"`);
      } else if (seenBefore === "forgotten") {
        if (hits.length) problems.push(`a house server silent for three visits is still asked ${hits.length}× (${hits[0]})`);
        const left = await page.evaluate(() => localStorage.getItem("computerpets.houseServer.seen"));
        if (left !== null) problems.push(`a house server silent for three visits is still remembered (${left})`);
      } else if (!hits.length) problems.push("a house server that answered here before was never asked (the gate is shut for good)");
    } finally {
      await ctx.close();
    }
  }
  assert.deepEqual(problems, [], problems.join("\n"));
});

/** The stand-in kennel (lib/pets/dev-seed.server.ts DEV_SEED_PETS): six guests, and their tab titles. */
export const DEV_KENNEL_SIZE = 6;
export const DEV_KENNEL_TITLES = ["Mochi the Red Panda", "Pepper the Cat", "Juniper the Fox", "Bloop the Axolotl", "Tamsin the Raccoon", "Kiwi the Budgie"].map((t) => `${t} — ComputerPets`);

/** Signed-in rooms, with the stand-in session (standInSite). */
export const SIGNED_IN_PAGES = ["/collection", "/hatch", "/nest"];
export const SIGNED_IN_SIZES = PHONE_SIZES.filter((s) => ["320×568", "375×667", "414×896", "667×375", "844×390"].includes(`${s.w}×${s.h}`));
/** Where the whole first kennel card (not just its name) is on the screen before any scroll. */
export const KENNEL_WHOLE_CARD = ["375×667", "414×896"];

test("signed-in rooms (kennel, hatchery, nest) and a kennel pet's page on phones: panels, rail, care buttons and header never overlap; thumb-sized links", { skip, timeout: 600_000 }, async () => {
  const { browser } = await site();
  const { url } = await standInSite();
  const problems = [];
  let visited = 0;
  let petVisits = 0;
  let petPage = null;
  for (const size of SIGNED_IN_SIZES) {
    const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h }, isMobile: true, hasTouch: true, userAgent: size.ua });
    const hits = [];
    ctx.on("request", (req) => {
      if (HOUSE_SERVER.test(req.url())) hits.push(req.url());
    });
    try {
      for (const path of SIGNED_IN_PAGES) {
        const label = `${path} ${size.w}×${size.h} (signed in)`;
        const page = await ctx.newPage();
        const thrown = [];
        page.on("pageerror", (err) => thrown.push(String(err?.message || err).split("\n")[0]));
        try {
          await page.goto(`${url}${path}`, { waitUntil: "load", timeout: 120_000 });
          await page.waitForSelector("[data-phone-floor] [data-desk-care]", { timeout: 120_000 });
          if (new URL(page.url()).pathname !== path) throw new Error(`sent to ${page.url()} (the stand-in session is not signed in)`);
          await page
            .waitForFunction(() => !!document.querySelector("[data-desk-aside]")?.style.maxHeight, null, { timeout: 8_000 })
            .catch(() => problems.push(`${label}: the panels were never fitted above the care buttons`));
          await page.waitForTimeout(600);
          const signedIn = await page.evaluate(() => ({
            signIn: [...document.querySelectorAll("header a")].some((a) => /sign in/i.test(a.textContent || "")),
          }));
          if (signedIn.signIn) problems.push(`${label}: the header still offers Sign in`);
          problems.push(...layoutProblems(await page.evaluate(measure), label));
          problems.push(...(await page.evaluate(headerProblems)).map((p) => `${label}: ${p}`));
          if (path === "/collection") {
            // The seeded kennel: every stand-in guest has a card with a link to its own page.
            const cards = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="/pets/"]')].map((a) => a.getAttribute("href")))]);
            if (cards.length < DEV_KENNEL_SIZE) problems.push(`${label}: the kennel shows ${cards.length} pet links, wanted ${DEV_KENNEL_SIZE} (the dev seed did not run?)`);
            if (!petPage && cards.length) petPage = cards[0];
            // Kennel first: the first card's name is on the screen, inside the panel, with no scroll.
            const first = await page.evaluate(() => {
              const card = document.querySelector('[data-kennel] a[href^="/pets/"]');
              const panel = document.querySelector("[data-desk-aside]");
              if (!card || !panel) return null;
              const r = (e) => {
                const b = e.getBoundingClientRect();
                return { t: Math.round(b.top), b: Math.round(b.bottom) };
              };
              return { card: r(card), name: r(card.querySelector("p.font-display") || card), panel: r(panel), vh: innerHeight, scrolled: panel.scrollTop };
            });
            const inside = (x, box) => x.t >= box.t - 1 && x.b <= box.b + 1;
            if (!first) problems.push(`${label}: no kennel card in the panel`);
            else {
              const fold = { t: 0, b: Math.min(first.panel.b, first.vh) };
              if (first.scrolled > 0 || !inside(first.name, first.panel) || !inside(first.name, fold)) problems.push(`${label}: the first kennel card's name is not on the screen without a scroll ${JSON.stringify(first)}`);
              if (KENNEL_WHOLE_CARD.includes(`${size.w}×${size.h}`) && !inside(first.card, fold)) problems.push(`${label}: the first kennel card is cut off ${JSON.stringify(first)}`);
            }
          }
          const cuts = await page.evaluate(railCuts);
          if (cuts.length) problems.push(`${label}: the rail rests with ${cuts.join(", ")} cut in half`);
          const taps = await page.evaluate(tapProblems, TAP_MIN);
          problems.push(...taps.bad.map((p) => `${label}: ${p}`));
          for (const t of thrown) problems.push(`${label}: the page threw: ${t}`);
          visited += 1;
        } catch (err) {
          problems.push(`${label}: ${String(err?.message || err).split("\n")[0]}`);
        } finally {
          await page.close();
        }
      }
      // A pet the kennel has: its own page, "in your kennel" (the keeper's name and species in the tab), laid out.
      if (petPage) {
        const label = `${petPage.slice(0, 14)}… ${size.w}×${size.h} (signed in)`;
        const page = await ctx.newPage();
        const thrown = [];
        page.on("pageerror", (err) => thrown.push(String(err?.message || err).split("\n")[0]));
        try {
          await page.goto(`${url}${petPage}`, { waitUntil: "load", timeout: 120_000 });
          await page.waitForSelector("[data-phone-floor] [data-desk-care]", { timeout: 120_000 });
          await page.waitForFunction(() => / the .+ — ComputerPets$/.test(document.title), null, { timeout: 15_000 }).catch(() => {});
          const title = await page.title();
          if (!DEV_KENNEL_TITLES.includes(title)) problems.push(`${label}: the tab says "${title}", not a kennel pet's name`);
          const missing = await page.evaluate(() => /not in your kennel|Couldn't open your kennel/.test(document.body.innerText));
          if (missing) problems.push(`${label}: says the pet is not in the kennel`);
          await page.waitForTimeout(600);
          problems.push(...layoutProblems(await page.evaluate(measure), label));
          problems.push(...(await page.evaluate(headerProblems)).map((p) => `${label}: ${p}`));
          const taps = await page.evaluate(tapProblems, TAP_MIN);
          problems.push(...taps.bad.map((p) => `${label}: ${p}`));
          for (const t of thrown) problems.push(`${label}: the page threw: ${t}`);
          petVisits += 1;
        } catch (err) {
          problems.push(`${label}: ${String(err?.message || err).split("\n")[0]}`);
        } finally {
          await page.close();
        }
      }
      // Sign-in off (the stand-in): /login's way back to the desk is a thumb-sized link.
      {
        const page = await ctx.newPage();
        await page.goto(`${url}/login`, { waitUntil: "load", timeout: 120_000 });
        const desk = await page
          .waitForSelector("[data-login-desk]", { timeout: 60_000 })
          .then(() => page.evaluate(() => {
            const b = document.querySelector("[data-login-desk]").getBoundingClientRect();
            return { w: Math.round(b.width), h: Math.round(b.height) };
          }), () => null);
        if (!desk) problems.push(`/login ${size.w}×${size.h} (sign-in off): no "Go to the desk" ([data-login-desk])`);
        else if (desk.h < TAP_MIN) problems.push(`/login ${size.w}×${size.h} (sign-in off): "Go to the desk" is ${desk.w}×${desk.h}`);
        await page.close();
      }
      // A pet page the kennel does not have: plain words and its own tab title.
      if (size === SIGNED_IN_SIZES[0]) {
        const page = await ctx.newPage();
        await page.goto(`${url}/pets/not-a-pet`, { waitUntil: "load", timeout: 120_000 });
        const h1 = await page.waitForSelector("h1", { timeout: 60_000 }).then((h) => h.textContent(), () => "");
        if (!/not in your kennel|Couldn't open your kennel/.test(h1 || "")) problems.push(`/pets/not-a-pet: says "${h1}"`);
        const title = await page.title();
        if (title !== "Your pet — ComputerPets") problems.push(`/pets/not-a-pet: the tab says "${title}"`);
        const back = await page.evaluate(() => {
          const b = document.querySelector("[data-back-kennel]")?.getBoundingClientRect();
          return b ? { w: Math.round(b.width), h: Math.round(b.height) } : null;
        });
        if (!back) problems.push(`/pets/not-a-pet: no "Back to kennel" ([data-back-kennel])`);
        else if (back.h < TAP_MIN) problems.push(`/pets/not-a-pet: "Back to kennel" is ${back.w}×${back.h}`);
        await page.close();
      }
      if (hits.length) problems.push(`${size.w}×${size.h}: the signed-in rooms asked the house server nobody ran (${hits.length}×)`);
    } finally {
      await ctx.close();
    }
  }
  assert.equal(visited, SIGNED_IN_PAGES.length * SIGNED_IN_SIZES.length, problems.join("\n"));
  assert.equal(petVisits, SIGNED_IN_SIZES.length, `a kennel pet's page was checked at ${petVisits} sizes\n${problems.join("\n")}`);
  assert.deepEqual(problems, [], problems.join("\n"));
});

/** Guests deep in their room's list (the 20th in the house, the last on the reef and in the jungle): the rail has to scroll to them. */
export const RAIL_DEEP_GUESTS = ["ember", "door", "atlas"];
export const RAIL_SIZES = [
  { w: 375, h: 667, phone: true },
  { w: 667, h: 375, phone: true },
  { w: 1024, h: 768, phone: false },
  { w: 1280, h: 800, phone: false },
];

/** Runs in the page: the rail's current guest and whether it shows whole inside the rail and on the screen. */
function railHere() {
  const rail = document.querySelector("[data-desk-rail]");
  const here = rail?.querySelector(".den-cabinet-guest.is-here");
  if (!rail || !here) return null;
  const a = rail.getBoundingClientRect();
  const b = here.getBoundingClientRect();
  return {
    guest: (here.textContent || "").trim().slice(0, 24),
    shows: b.top >= a.top - 1 && b.bottom <= Math.min(a.bottom, innerHeight) + 1,
    row: [Math.round(b.top), Math.round(b.bottom)],
    rail: [Math.round(a.top), Math.round(a.bottom)],
    scrolled: Math.round(rail.scrollTop),
  };
}

/** Runs in the page: the plates the open speech bubble crosses (each plate clipped by the boxes that scroll it). */
function bubbleOverPlates() {
  const bub = document.querySelector('[data-speech="open"]');
  if (!bub) return null;
  const bb = (bub.firstElementChild || bub).getBoundingClientRect();
  const over = [];
  for (const plate of document.querySelectorAll("[data-desk-plate]")) {
    const r = plate.getBoundingClientRect();
    let [l, t, rr, b] = [r.left, r.top, r.right, r.bottom];
    for (let p = plate.parentElement; p; p = p.parentElement) {
      if (!/(auto|scroll|hidden|clip)/.test(getComputedStyle(p).overflowY)) continue;
      const c = p.getBoundingClientRect();
      [l, t, rr, b] = [Math.max(l, c.left), Math.max(t, c.top), Math.min(rr, c.right), Math.min(b, c.bottom)];
    }
    [t, b] = [Math.max(t, 0), Math.min(b, innerHeight)];
    if (rr - l < 2 || b - t < 2) continue;
    if (Math.min(bb.right, rr) - Math.max(bb.left, l) > 1 && Math.min(bb.bottom, b) - Math.max(bb.top, t) > 1) {
      over.push(`${plate.getAttribute("data-desk-plate")} ${JSON.stringify({ bubble: [bb.left, bb.top, bb.right, bb.bottom].map(Math.round), plate: [l, t, rr, b].map(Math.round) })}`);
    }
  }
  return over;
}

/** Runs in the page: the panel's own kicker and name lines the open speech bubble crosses (a phone on its side). */
function bubbleOverNames() {
  const bub = document.querySelector('[data-speech="open"]');
  if (!bub) return null;
  const bb = (bub.firstElementChild || bub).getBoundingClientRect();
  const over = [];
  for (const el of document.querySelectorAll("[data-desk-aside] h1, [data-desk-aside] p.uppercase.text-subtle")) {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (Math.min(bb.right, r.right) - Math.max(bb.left, r.left) > 1 && Math.min(bb.bottom, r.bottom) - Math.max(bb.top, r.top) > 1) {
      over.push(`${el.tagName === "H1" ? "name" : "kicker"} ${JSON.stringify({ bubble: [bb.left, bb.top, bb.right, bb.bottom].map(Math.round), line: [r.left, r.top, r.right, r.bottom].map(Math.round) })}`);
    }
  }
  return over;
}

/** Runs in the page: boxes inside the panel that scroll on their own (a scroller inside a scroller). */
function panelScrollers() {
  const aside = document.querySelector("[data-desk-aside]");
  if (!aside) return null;
  const inner = [...aside.querySelectorAll("*")]
    .filter((e) => /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight + 1)
    .map((e) => `${e.tagName.toLowerCase()}${[...e.attributes].filter((x) => x.name.startsWith("data-")).map((x) => `[${x.name}]`).join("")} ${e.scrollHeight}/${e.clientHeight}`);
  const a = aside.getBoundingClientRect();
  return { inner, scrolls: aside.scrollHeight > aside.clientHeight + 1, bottom: Math.round(a.bottom), vh: innerHeight };
}

test("the rail shows the current guest on arrival and on a room change; the speech bubble never crosses a plate; a landscape phone's plates jump shows without a scroll; signed in, the panel is the one scroller", { skip, timeout: 600_000 }, async () => {
  const { url, browser } = await site();
  const problems = [];
  const context = (s) => browser.newContext(s.phone ? { viewport: { width: s.w, height: s.h }, isMobile: true, hasTouch: true, userAgent: IPHONE } : { viewport: { width: s.w, height: s.h } });
  // The rail: arriving on a guest deep in its room, and moving to another room without a page load.
  for (const size of RAIL_SIZES) {
    const ctx = await context(size);
    try {
      for (const slug of RAIL_DEEP_GUESTS) {
        const label = `/demo/${slug} ${size.w}×${size.h}`;
        const page = await ctx.newPage();
        try {
          await page.goto(`${url}/demo/${slug}`, { waitUntil: "load", timeout: 120_000 });
          await page.waitForSelector("[data-desk-rail] .den-cabinet-guest.is-here", { state: "attached", timeout: 60_000 });
          await page.waitForTimeout(1_500);
          const here = await page.evaluate(railHere);
          if (!here?.shows) problems.push(`${label}: the current guest is not in the rail's view on arrival ${JSON.stringify(here)}`);
          if (size.phone) {
            const cut = await page.evaluate(railCuts);
            if (cut.length) problems.push(`${label}: the rail rests with ${cut.join(", ")} cut in half`);
          }
          if (slug === RAIL_DEEP_GUESTS[0]) {
            for (const next of RAIL_DEEP_GUESTS.slice(1)) {
              await page.evaluate((s) => {
                history.pushState(history.state, "", `/demo/${s}`);
                dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
              }, next);
              await page.waitForFunction((s) => location.pathname === `/demo/${s}`, next);
              await page.waitForTimeout(1_200);
              const moved = await page.evaluate(railHere);
              if (!moved?.shows) problems.push(`${label} then /demo/${next}: the new guest is not in the rail's view ${JSON.stringify(moved)}`);
              if (size.phone) {
                const cut = await page.evaluate(railCuts);
                if (cut.length) problems.push(`${label} then /demo/${next}: the rail rests with ${cut.join(", ")} cut in half`);
              }
            }
          }
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
  // The speech bubble: it crossed the Quotes plate and the hello at 1280×800. Sampled while a line shows (the pet
  // walks), then with the news plate dragged over the bubble on a desktop: the bubble moves off it. On a phone on
  // its side it kept off the docked plates but painted over the panel's own kicker (844×390 and 568×320).
  for (const size of [{ w: 1024, h: 768 }, { w: 1280, h: 800 }, { w: 1440, h: 900 }, { w: 375, h: 667, phone: true }, { w: 667, h: 375, phone: true }, { w: 844, h: 390, phone: true }, { w: 568, h: 320, phone: true }]) {
    const label = `/demo/rui ${size.w}×${size.h} (a line showing)`;
    const ctx = await context(size);
    const page = await ctx.newPage();
    try {
      await page.goto(`${url}/demo/rui`, { waitUntil: "load", timeout: 120_000 });
      await page.waitForSelector("[data-desk-care] button", { timeout: 60_000 });
      await page.waitForTimeout(1_200);
      const seen = new Set();
      for (let round = 0; round < 2; round += 1) {
        await page.evaluate(() => [...document.querySelectorAll("[data-desk-care] button")].find((b) => (b.textContent || "").trim() === "Talk")?.click());
        await page.waitForSelector('[data-speech="open"]', { timeout: 15_000 });
        await page.waitForTimeout(600);
        for (let i = 0; i < 8; i += 1) {
          for (const o of (await page.evaluate(bubbleOverPlates)) || []) seen.add(o);
          if (size.phone && size.w > size.h) for (const o of (await page.evaluate(bubbleOverNames)) || []) seen.add(o);
          await page.waitForTimeout(150);
        }
      }
      for (const o of [...seen].slice(0, 3)) problems.push(`${label}: the speech bubble crosses the ${o}`);
      if (!size.phone) {
        const open = await page.evaluate(() => !!document.querySelector('[data-speech="open"]'));
        if (!open) {
          await page.evaluate(() => [...document.querySelectorAll("[data-desk-care] button")].find((b) => (b.textContent || "").trim() === "Talk")?.click());
          await page.waitForSelector('[data-speech="open"]', { timeout: 15_000 });
        }
        await page.evaluate(() => {
          const bub = document.querySelector('[data-speech="open"]');
          const bb = (bub.firstElementChild || bub).getBoundingClientRect();
          const plate = document.querySelector('[data-desk-plate="news"]');
          const host = plate.offsetParent.getBoundingClientRect();
          plate.style.left = `${Math.round(bb.left + bb.width / 2 - plate.offsetWidth / 2 - host.left)}px`;
          plate.style.top = `${Math.round(bb.top + 6 - host.top)}px`;
          plate.style.right = "auto";
        });
        await page.waitForTimeout(700);
        const moved = new Set();
        for (let i = 0; i < 6; i += 1) {
          if (!(await page.evaluate(() => !!document.querySelector('[data-speech="open"]')))) break;
          for (const o of (await page.evaluate(bubbleOverPlates)) || []) moved.add(o);
          await page.waitForTimeout(150);
        }
        for (const o of [...moved].slice(0, 2)) problems.push(`${label}, a plate moved onto it: the speech bubble stays over the ${o}`);
      }
    } catch (err) {
      problems.push(`${label}: ${String(err?.message || err).split("\n")[0]}`);
    } finally {
      await ctx.close();
    }
  }
  // A landscape phone: the "Weather, news, market" jump sits beside the name, on the screen as the page opens.
  for (const [w, h] of [[568, 320], [667, 375], [844, 390]]) {
    const label = `/demo/rui ${w}×${h}`;
    const ctx = await context({ w, h, phone: true });
    const page = await ctx.newPage();
    try {
      await page.goto(`${url}/demo/rui`, { waitUntil: "load", timeout: 120_000 });
      await page.waitForSelector("[data-phone-floor] [data-plates-jump]", { timeout: 60_000 });
      await page.waitForTimeout(1_000);
      const jump = await page.evaluate(() => {
        const j = document.querySelector("[data-plates-jump]").getBoundingClientRect();
        const aside = document.querySelector("[data-desk-aside]");
        const a = aside.getBoundingClientRect();
        return { t: Math.round(j.top), b: Math.round(j.bottom), h: Math.round(j.height), top: Math.round(a.top), fold: Math.round(Math.min(a.bottom, innerHeight)), scrolled: aside.scrollTop };
      });
      if (jump.t < jump.top - 1 || jump.b > jump.fold + 1 || jump.scrolled > 0) problems.push(`${label}: the plates jump takes a scroll to reach ${JSON.stringify(jump)}`);
      if (jump.h < TAP_MIN) problems.push(`${label}: the plates jump is ${jump.h}px tall`);
    } catch (err) {
      problems.push(`${label}: ${String(err?.message || err).split("\n")[0]}`);
    } finally {
      await ctx.close();
    }
  }
  // Signed in (the stand-in kennel): the panel is the one scroller. The kennel (1353 px in a 512 px box) scrolled
  // inside a panel that scrolled too at 1024 to 1440 px wide, and the catalog's list did the same, on a phone too.
  const { url: signedIn } = await standInSite();
  for (const size of [{ w: 1024, h: 768 }, { w: 1280, h: 800 }, { w: 1440, h: 900 }, { w: 375, h: 667, phone: true }, { w: 667, h: 375, phone: true }]) {
    const ctx = await context(size);
    try {
      for (const path of ["/collection", "/nest", "/catalog"]) {
        const label = `${path} ${size.w}×${size.h} (signed in)`;
        const page = await ctx.newPage();
        const thrown = [];
        page.on("pageerror", (err) => thrown.push(String(err?.message || err).split("\n")[0]));
        try {
          await page.goto(`${signedIn}${path}`, { waitUntil: "load", timeout: 120_000 });
          await page.waitForSelector("[data-desk-care] button", { timeout: 120_000 });
          if (new URL(page.url()).pathname !== path) throw new Error(`sent to ${page.url()} (the stand-in session is not signed in)`);
          await page.waitForTimeout(1_500);
          const s = await page.evaluate(panelScrollers);
          if (!s) problems.push(`${label}: no panel`);
          else {
            for (const e of s.inner) problems.push(`${label}: ${e} scrolls inside the panel`);
            if (!s.scrolls && s.bottom > s.vh + 1) problems.push(`${label}: the panel runs off the screen (to ${s.bottom} of ${s.vh}) and does not scroll`);
          }
          if (path === "/collection") {
            const card = await page.evaluate(() => {
              const c = document.querySelector('[data-kennel] a[href^="/pets/"]');
              if (!c) return null;
              c.scrollIntoView({ block: "nearest" });
              const b = c.getBoundingClientRect();
              const a = document.querySelector("[data-desk-aside]").getBoundingClientRect();
              return { shows: b.top >= Math.max(0, a.top) - 1 && b.top < Math.min(a.bottom, innerHeight) - 16, card: [Math.round(b.top), Math.round(b.bottom)] };
            });
            if (!card?.shows) problems.push(`${label}: the first kennel card cannot be scrolled into the panel ${JSON.stringify(card)}`);
          }
          for (const t of thrown) problems.push(`${label}: the page threw: ${t}`);
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
  assert.deepEqual(problems, [], problems.join("\n"));
});

test("the in-process dev server left src/routeTree.gen.ts as checked in", { skip }, async () => {
  if (!shared) return;
  const rewritten = await closeSite();
  assert.equal(rewritten, false, "the dev server rewrote src/routeTree.gen.ts: run npm run dev once and commit the generated file");
});
