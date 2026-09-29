// The kennel targets pass: /demo/<unknown> is a real 404, desktop-size targets are at least 24×24 (WCAG 2.2), the
// left panel and the room rail end on the screen, /demo's plates start clear of the panel, /hive has one search for
// the insects and bees and comb, and a phone's /demo has a jump to its plates. The real-browser checks are in
// phone-desk-layout.test.mjs.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (p) => readFileSync(join(root, p), "utf8");
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/desk-plates.js"));
const P = await import(pathToFileURL(join(root, "src/lib/pets/desk-plates.ts")).href);
const Desk = await import(pathToFileURL(join(root, "src/lib/pets/phone-desk.ts")).href);

/** Window sizes the plate spots are checked over (the desktop sizes and the odd ones). */
export const SIZES = [
  [800, 480],
  [1024, 768],
  [1280, 720],
  [1280, 800],
  [1366, 768],
  [1440, 900],
  [1920, 1080],
];

const overlap = (a, b) => Math.min(a.x + P.PLATE_W, b.x + P.PLATE_W) - Math.max(a.x, b.x) > 0 && Math.min(a.y + P.PLATE_H, b.y + P.PLATE_H) - Math.max(a.y, b.y) > 0;

test("/demo/<unknown> is a real 404: the route's loader throws notFound and the not-found view keeps its words and 44 px link", () => {
  const s = src("src/routes/demo.$slug.tsx");
  assert.match(s, /import \{ createFileRoute, Link, notFound \} from "@tanstack\/react-router";/);
  assert.match(s, /loader: \(\{ params \}\) => \{\s*if \(!livingBySlug\(params\.slug\)\) throw notFound\(\);/);
  assert.match(s, /notFoundComponent: DemoMissing,/);
  assert.match(s, /if \(!kind\) return <DemoMissing \/>;/);
  assert.match(s, /function DemoMissing\(\) \{[\s\S]*?data-demo-missing className="inline-flex min-h-11 items-center/);
  assert.match(s, /: "No demo here — ComputerPets"/);
});

test("without keepOff the plate spots are the same as ever, web and desktop", () => {
  for (const O of [P, Overlay]) {
    const w = O.defaultSpot("weather", 1280, 800);
    assert.deepEqual([w.x, w.y], [51.2, 64]);
    const n = O.defaultSpot("news", 1280, 800);
    assert.deepEqual([n.x, n.y], [1280 - 288 - 102.4, 64]);
    const m = O.defaultSpot("market", 1280, 800);
    assert.deepEqual([m.x, m.y], [51.2, 304]);
    assert.deepEqual(O.defaultSpot("weather", 1280, 800, null), w);
  }
  assert.equal(P.KEEP_GAP, 16);
  assert.equal(Overlay.KEEP_GAP, P.KEEP_GAP);
});

test("with keepOff the plates start clear of the panel, the rail and the header, never on each other, in lockstep with the desktop overlay", () => {
  for (const [w, h] of SIZES) {
    // The /demo room at that size: the panel's right edge, the rail's width from the right, the header's bottom.
    for (const keep of [{ left: 352, right: 208, top: 57 }, { left: 400, right: 176, top: 65 }, { left: 0, right: 0, top: 0 }]) {
      const web = P.PLATE_KEYS.map((k) => P.defaultSpot(k, w, h, keep));
      const desk = Overlay.PLATE_KEYS.map((k) => Overlay.defaultSpot(k, w, h, keep));
      assert.deepEqual(web, desk, `${w}×${h} ${JSON.stringify(keep)}`);
      for (const p of web) {
        assert.ok(p.x >= 8 && p.x <= w - P.PLATE_W - 8 + 1e-9, `${p.key} x ${p.x} at ${w}×${h}`);
        assert.ok(p.y >= keep.top + 8 || p.y === h - P.PLATE_H - 8, `${p.key} under the header at ${w}×${h}`);
      }
      // Room to spare between the panel and the rail: every plate between them and none on another.
      if (w - keep.left - keep.right >= P.PLATE_W + 2 * P.KEEP_GAP) {
        for (const p of web) assert.ok(p.x >= keep.left + P.KEEP_GAP && p.x + P.PLATE_W <= w - keep.right - P.KEEP_GAP + 1e-9, `${p.key} ${p.x} at ${w}×${h}`);
        assert.ok(!overlap(web[0], web[1]) && !overlap(web[1], web[2]) && !overlap(web[0], web[2]), `${w}×${h} plates overlap`);
      }
    }
  }
  // 1024×768: no room for two side by side, so news goes under the weather plate.
  const [weather, news] = ["weather", "news"].map((k) => P.defaultSpot(k, 1024, 768, { left: 352, right: 208, top: 57 }));
  assert.equal(weather.x, 368);
  assert.equal(news.y, weather.y + P.PLATE_H + 8);
  // A moved plate stays where it was put.
  const store = { getItem: () => JSON.stringify([{ key: "weather", x: 20, y: 30 }]) };
  const [w0] = P.loadPlates(1280, 800, store, { left: 400, right: 200, top: 60 });
  assert.deepEqual([w0.x, w0.y], [20, 30]);
  const [o0] = Overlay.loadPlates(1280, 800, store, { left: 400, right: 200, top: 60 });
  assert.deepEqual([o0.x, o0.y], [20, 30]);
});

test("the web room measures its panel, rail and header for the plates; the desktop overlay passes nothing, so its spots stay", () => {
  const plates = src("src/components/desk/desk-plates.tsx");
  assert.match(plates, /function roomKeepOff\(\): KeepOff \| null \{/);
  for (const sel of ["[data-desk-aside]", "[data-desk-rail]", "header"]) assert.ok(plates.includes(`box("${sel}")`), sel);
  assert.equal((plates.match(/loadPlates\(window\.innerWidth, window\.innerHeight, undefined, roomKeepOff\(\)\)/g) || []).length, 2);
  const pet = readFileSync(join(root, "../desktop/renderer/pet.js"), "utf8");
  const calls = pet.match(/loadPlates\([^)]*\)/g) || [];
  assert.equal(calls.length, 2);
  for (const c of calls) assert.equal(c.replace(/^loadPlates\(|\)$/g, ""), "window.innerWidth, window.innerHeight", c);
});

test("deskFit: the panel and the rail end above what sits under them, and above the screen's bottom otherwise", () => {
  const aside = { top: 120, left: 32, right: 352 };
  const rail = { top: 140, left: 1072, right: 1248 };
  const care = { top: 700, left: 440, right: 840 };
  // The care buttons sit between the two: both run to the screen's bottom (less the gap).
  let fit = Desk.deskFit({ aside, rail, below: [care], viewH: 800, gap: 8 });
  assert.deepEqual(fit, { asideMax: 800 - 120 - 8, railMax: 800 - 140 - 8 });
  // A narrow screen puts the care buttons under the panel: the panel ends above them.
  fit = Desk.deskFit({ aside, rail, below: [{ top: 600, left: 200, right: 700 }], viewH: 800, gap: 8 });
  assert.equal(fit.asideMax, 600 - 120 - 8);
  assert.equal(fit.railMax, 800 - 140 - 8);
  // The room links under the rail.
  fit = Desk.deskFit({ aside, rail, below: [care, { top: 740, left: 1000, right: 1250 }], viewH: 800, gap: 8 });
  assert.equal(fit.railMax, 740 - 140 - 8);
  // Never under the phone minimum.
  fit = Desk.deskFit({ aside, rail, below: [{ top: 130, left: 0, right: 2000 }], viewH: 800 });
  assert.deepEqual(fit, { asideMax: Desk.PHONE_FIT_MIN, railMax: Desk.PHONE_FIT_MIN });
});

test("the desktop room fits its panel and rail to the screen, scrolls inside them, and puts the hello first on a short screen", () => {
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /deskFit as fitDesk/);
  assert.match(room, /!hand && !pad && deskFit \? \{ maxHeight: deskFit\.asideMax \}/);
  assert.match(room, /data-rail-fit=\{!hand && !pad && deskFit \? "" : undefined\}/);
  assert.match(room, /!hand && !pad && deskFit \? \{ maxHeight: deskFit\.railMax \}/);
  assert.match(room, /\{\(hand \|\| deskFold\) && hintUp && !stats\.hidden \? null : \(/);
  assert.match(room, /folded=\{hand \|\| deskFold\}/);
  assert.match(room, /plaqueNeedsLine\(aside\.scrollHeight, aside\.clientHeight\)/);
});

test("desktop targets are at least 24×24: the plaque links, the rail rows, the room links, Send, Open the room", () => {
  const css = src("src/styles.css");
  assert.match(css, /:is\(\.den-cabinet-room, \.den-cabinet-guest\):not\(\[data-phone-floor\] \*\) \{[^}]*min-height: 1\.5rem;[^}]*min-width: 1\.5rem;/);
  assert.match(css, /:is\(\[data-line-link\], \[data-room-links\] a, \[data-talk-send\], \[data-open-room\]\):not\(\[data-phone-floor\] \*\) \{[^}]*min-height: 1\.5rem;[^}]*min-width: 1\.5rem;/);
  assert.match(css, /\[data-rail-fit\] \.den-cabinet-drawer \{\s*max-height: none;\s*overflow: visible;/);
  assert.match(src("src/routes/catalog.tsx"), /<Link to=\{room\.path\} data-open-room /);
  const sweep = src("scripts/phone-desk-layout.test.mjs");
  assert.match(sweep, /export const DESK_TARGET_MIN = 24;/);
  assert.match(sweep, /export const DESK_SIZES = \[\s*\[1024, 768\],\s*\[1280, 800\],\s*\[1440, 900\],\s*\];/);
  assert.match(sweep, /export const DESK_PAGES = \["\/", "\/catalog", "\/demo\/rui"\];/);
});

test("/hive: one search covers the insects and bees and comb", () => {
  const fn = src("src/components/desk/field-notes.tsx");
  assert.match(fn, /export type FieldNoteSet = \{ kicker: string; heading: string; intro\?: ReactNode; notes: readonly FieldNote\[\] \};/);
  assert.match(fn, /more\?: FieldNoteSet;/);
  assert.match(fn, /data-notes-more hidden=\{searching && !more\.notes\.some/);
  const hive = src("src/routes/hive.tsx");
  assert.equal((hive.match(/<FieldNotes\b/g) || []).length, 1);
  assert.match(hive, /<FieldNotes notes=\{INSECT_GUIDE\} heading="The insects, told apart\." more=\{BEES_AND_COMB\} \/>/);
  assert.match(hive, /const BEES_AND_COMB: FieldNoteSet = \{\s*notes: BEE_GUIDE,\s*kicker: "Bees and comb",/);
});

test("a phone's /demo has a 44 px jump to its weather, news and market plates near the top of the panel", () => {
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /const platesJump =\s*demoWindow && hand \? \(\s*<button\s+type="button"\s+data-plates-jump/);
  assert.match(room, /data-plates-jump[\s\S]{0,700}?scrollIntoView\(\{ block: "start" \}\)[\s\S]{0,400}?focus\(\{ preventScroll: true \}\)[\s\S]{0,300}?min-h-11[\s\S]{0,300}?Weather, news, market/);
  // Upright it follows the tagline; on a landscape phone it sits beside the name (kennel-scroll.test.mjs).
  assert.match(room, /<p className="mt-3 max-w-sm text-sm text-muted">\{kind\.tagline\}<\/p>\n\s+\{landJump \? null : platesJump\}/);
  assert.match(room, /<div data-demo-plates role="group" aria-label="Weather, news, market" className="mt-5 max-w-sm scroll-mt-2 space-y-2">/);
  // The jump sits before the plaque and the plates, right after the tagline.
  assert.ok(room.indexOf("data-plates-jump") < room.indexOf("<SpeciesPlaque speciesKey={kind.key} compact paper folded"));
  assert.ok(room.indexOf("data-plates-jump") < room.indexOf("<div data-demo-plates"));
});
