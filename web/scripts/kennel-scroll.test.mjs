// The kennel scroll pass: the room rail scrolls the current guest into view (on arrival and on a room change, a
// phone's rail still on whole rows), the drawn second window on a desktop /demo starts clear of the panel, signed in
// the panel is the one scroller (the room's list no longer scrolls inside it), the pet's speech bubble steps around
// the weather, news and market plates, a landscape phone's "Weather, news, market" jump sits beside the name, and no
// care bar shows two buttons with the same word. The real-browser checks are in phone-desk-layout.test.mjs.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (p) => readFileSync(join(root, p), "utf8");
const load = (p) => import(pathToFileURL(join(root, p)).href);
const Desk = await load("src/lib/pets/phone-desk.ts");
const Win = await load("src/lib/pets/demo-windows.ts");
const Labels = await load("src/lib/pets/care-labels.ts");
const Traits = await load("src/lib/pets/traits.ts");
const Treats = await load("src/lib/pets/treats.ts");

/** The desktop sizes the drawn windows are checked at, with the panel's right edge there (measured on /demo/rui). */
export const WINDOW_SIZES = [
  [1024, 768, 352],
  [1280, 800, 352],
  [1440, 900, 352],
  [1920, 1080, 352],
];

test("railScrollFor leaves a showing row alone, centres a hidden one, lands on whole rows on a phone and stays in range", () => {
  // Already whole in view: unchanged.
  assert.equal(Desk.railScrollFor({ scrollTop: 0, viewH: 400, scrollH: 1200, rowTop: 120, rowH: 32 }), 0);
  assert.equal(Desk.railScrollFor({ scrollTop: 200, viewH: 400, scrollH: 1200, rowTop: 200, rowH: 32 }), 200);
  // The 20th guest far below the rail's end: in the middle of the rail.
  assert.equal(Desk.railScrollFor({ scrollTop: 0, viewH: 400, scrollH: 1200, rowTop: 800, rowH: 32 }), 616);
  // Above the view: back up to it.
  assert.equal(Desk.railScrollFor({ scrollTop: 700, viewH: 400, scrollH: 1200, rowTop: 100, rowH: 32 }), 0);
  // Never past the end.
  assert.equal(Desk.railScrollFor({ scrollTop: 0, viewH: 400, scrollH: 1200, rowTop: 1168, rowH: 32 }), 800);
  // A phone rail (44 px rows, 4 rows tall): whole rows, the row whole inside.
  for (let i = 0; i < 40; i += 1) {
    const rowTop = i * 44;
    const next = Desk.railScrollFor({ scrollTop: 0, viewH: 176, scrollH: 40 * 44, rowTop, rowH: 44, snap: 44 });
    assert.equal(next % 44, 0, `row ${i}: ${next} is not on a whole row`);
    assert.ok(rowTop >= next && rowTop + 44 <= next + 176, `row ${i}: ${next} does not show it`);
  }
});

test("bubbleDodge keeps a clear bubble where it is and moves a crossing one clear of every plate, inside the room", () => {
  const plates = [
    { left: 900, top: 120, right: 1188, bottom: 158 },
    { left: 900, top: 166, right: 1188, bottom: 204 },
    { left: 900, top: 212, right: 1188, bottom: 250 },
  ];
  const clear = (p, w, h) => plates.every((q) => Math.min(p.x + w, q.right) - Math.max(p.x, q.left) <= 0 || Math.min(p.top + h, q.bottom) - Math.max(p.top, q.top) <= 0);
  assert.deepEqual(Desk.bubbleDodge({ x: 300, top: 200, w: 220, h: 56, plates, width: 1280 }), { x: 300, top: 200 });
  for (const x of [700, 820, 950, 1040]) {
    for (const top of [100, 150, 190, 230]) {
      const got = Desk.bubbleDodge({ x, top, w: 220, h: 56, plates, width: 1280, minTop: 72, maxTop: 600 });
      assert.ok(clear(got, 220, 56), `${x},${top} -> ${JSON.stringify(got)} still crosses a plate`);
      assert.ok(got.x >= 10 && got.x + 220 <= 1270, `${JSON.stringify(got)} leaves the room`);
      assert.ok(got.top >= 72 && got.top <= 600, `${JSON.stringify(got)} leaves the band`);
    }
  }
  // A plate as wide as the room: under it (above is past the header line).
  const wall = [{ left: 0, top: 100, right: 400, bottom: 300 }];
  assert.deepEqual(Desk.bubbleDodge({ x: 50, top: 150, w: 300, h: 50, plates: wall, width: 400, minTop: 80 }), { x: 50, top: 308 });
  // Nowhere clear in the band: as low as it may go, below the plate where it can.
  assert.deepEqual(Desk.bubbleDodge({ x: 50, top: 150, w: 300, h: 50, plates: wall, width: 400, minTop: 80, maxTop: 200 }), { x: 50, top: 200 });
});

test("the drawn windows on a desktop /demo: the second starts right of the panel, clear of the first, on the screen", () => {
  for (const [w, h, panelRight] of WINDOW_SIZES) {
    const a = Win.firstWindowSpot(w, h);
    const b = Win.secondWindowSpot(w, h, panelRight);
    const hit = (p, q) => Math.min(p.left + p.width, q.left + q.width) - Math.max(p.left, q.left) > 0 && Math.min(p.top + p.height, q.top + q.height) - Math.max(p.top, q.top) > 0;
    assert.ok(b.left >= panelRight + Win.DEMO_WINDOW_GAP, `${w}×${h}: the second window starts at ${b.left}, under the panel (to ${panelRight})`);
    assert.ok(!hit(a, b), `${w}×${h}: the windows overlap`);
    assert.ok(b.left + b.width <= w && b.top + b.height <= h, `${w}×${h}: the second window runs off the stage`);
  }
  // With no panel measured yet it keeps its old left (8%).
  assert.equal(Win.secondWindowSpot(1000, 800).left, 80);
  const plate = src("src/components/desk/demo-window-plate.tsx");
  assert.match(plate, /import \{ secondWindowSpot, type DemoWindowBox \} from "@\/lib\/pets\/demo-windows";/);
  assert.match(plate, /stage\.querySelector\("\[data-desk-aside\]"\)\?\.getBoundingClientRect\(\)/);
  assert.doesNotMatch(plate, /left-\[8%\] top-\[32%\]/);
});

test("no care bar shows two buttons with the same word (the trick says it is the trick where it clashed), all 221 guests", () => {
  const keys = Object.keys(Traits.TRAITS);
  assert.equal(keys.length, 221);
  const tend = ["Rest", "Clean", "Bath", "Medicine", "Praise"];
  const clashed = [];
  for (const key of keys) {
    const treat = Treats.treatFor(key).verb;
    const verb = Traits.traitFor(key).verb;
    const trick = Labels.distinctLabel(verb, [...Labels.CARE_WORDS, treat, ...tend]);
    if (trick !== verb) clashed.push(key);
    const words = ["Feed", treat, "Play", trick, ...tend, "Talk", "Hide"].map((x) => x.toLowerCase());
    assert.equal(new Set(words).size, words.length, `${key}: ${words.join(", ")}`);
  }
  // The five that clashed: the phoenix ("Ember" twice), the koala ("Gum"), the nexus ("Count"), the salamander and the grouper ("Hide").
  assert.equal(clashed.length, 5, clashed.join(", "));
  assert.equal(Labels.distinctLabel("Ember", ["Feed", "Ember"]), "Ember trick");
  assert.equal(Labels.distinctLabel("hide", ["Hide"]), "hide trick");
  assert.equal(Labels.distinctLabel("Climb", ["Feed", "Play"]), "Climb");
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /const trickWord = distinctLabel\(trait\.verb, \[\.\.\.CARE_WORDS, treatFor\(kind\.key\)\.verb,/);
  assert.match(room, /specialVerb: trickWord,/);
  assert.match(room, /label: trickWord,/);
});

test("the rail's scroll-into-view effect, the one-scroller rules (in the utilities layer) and the landscape jump are wired", () => {
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /import \{[^}]*\brailScrollFor\b[^}]*\} from "@\/lib\/pets\/phone-desk";/);
  assert.match(room, /const railRoom = roomOf\(kind\.key\)\.id;/);
  assert.match(room, /rail\.querySelector<HTMLElement>\("\.den-cabinet-guest\.is-here"\)/);
  assert.match(room, /snap: hand \? /);
  assert.match(room, /\}, \[railRoom, kind\.key, hand, pad, fit, deskFit\]\);/);
  assert.match(room, /data-aside-fit=\{!hand && !pad && deskFit \? "" : undefined\}/);
  assert.match(room, /const landJump = demoWindow && hand && handOrient === "sit";/);
  assert.match(room, /<div data-name-row className=/);
  assert.match(room, /\{landJump \? null : platesJump\}/);
  for (const p of ["src/routes/collection.tsx", "src/routes/catalog.tsx", "src/routes/nest.tsx"]) assert.match(src(p), /data-aside-list/, p);
  const css = src("src/styles.css");
  const utilities = css.slice(css.lastIndexOf("@layer utilities {"));
  assert.match(utilities, /\[data-phone-floor\] \[data-aside-list\],\s*\[data-aside-fit\] \[data-aside-list\] \{\s*max-height: none;\s*overflow: visible;/);
  assert.match(utilities, /\[data-phone-floor\] \[data-kennel\] > \.paper-card \{\s*padding: 0\.75rem;/);
  // Not in the components layer, where the list's own max-h and overflow-y-auto classes won.
  const components = css.slice(css.indexOf("@layer components {"), css.lastIndexOf("@layer utilities {"));
  assert.doesNotMatch(components, /\[data-aside-list\]/);
  assert.doesNotMatch(components, /\[data-phone-floor\] \[data-kennel\] \{/);
  const pet = src("src/components/desk/living-pet.tsx");
  assert.match(pet, /import \{[^}]*\bbubbleDodge\b[^}]*\} from "@\/lib\/pets\/phone-desk";/);
  assert.match(pet, /querySelectorAll<HTMLElement>\("\[data-desk-plate\]"\)/);
});
