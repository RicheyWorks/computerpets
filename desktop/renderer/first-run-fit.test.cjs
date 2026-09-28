// The first-run keeper card, as driven for real in Electron (desktop/first-run-drive.cjs): it fits the screen, its
// hello's button is a real target, the pet's line never paints over it, and the trick has one word everywhere.
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const K = require("./keeper.js");
const Special = require("./specials.js");

const css = readFileSync(join(__dirname, "styles.css"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const catalogSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "catalog.ts"), "utf8");
const CATALOG = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);

function rule(selector) {
  const i = css.indexOf(`${selector} {`);
  assert.ok(i >= 0, selector);
  return css.slice(i, css.indexOf("}", i));
}
const px = (block, prop) => Number((block.match(new RegExp(`\\n\\s*${prop}:\\s*(\\d+)px`)) || [])[1]);

test("the tallest keeper card's top stays on the screen (padding and border counted)", () => {
  const hud = rule("#hud");
  assert.doesNotMatch(hud, /box-sizing:\s*border-box/, "content-box: 280 is the content, as PetKeeper.HUD_WIDTH says");
  assert.equal(px(hud, "width"), K.HUD_WIDTH);
  const pad = hud.match(/padding:\s*(\d+)px (\d+)px (\d+)px/);
  const border = Number(hud.match(/border:\s*(\d+)px/)[1]);
  const bottom = px(hud, "bottom");
  const off = Number(hud.match(/max-height:\s*calc\(100vh - (\d+)px\)/)[1]);
  for (const vh of [600, 768, 1080, 1392, 2160]) {
    const tallest = vh - off + Number(pad[1]) + Number(pad[3]) + 2 * border;
    const top = vh - bottom - tallest;
    assert.ok(top >= 0, `top ${top} at ${vh}`);
  }
});

test("pet.js holds the card on the screen by its real width, not the 280 of content", () => {
  assert.match(petSrc, /hud\.offsetWidth \|\|/);
  assert.doesNotMatch(petSrc, /:\s*\(window\.PetKeeper\?\.HUD_WIDTH \?\? 280\);/);
});

test("the hello's Got it is at least 24 px tall and wide", () => {
  const ok = rule("#hud #first-hint-ok");
  assert.ok(px(ok, "min-height") >= 24);
  assert.ok(px(ok, "min-width") >= 24);
});

test("the pet's line goes beside the open card, never over it", () => {
  // Driven: pet at x 94, card at 177..491, the line at 58..278 painted over the card's words.
  assert.deepEqual(K.bubbleBesideCard({ bubbleX: 58, bubbleW: 220, cardX: 177, cardW: 314, width: 2560 }), { x: 499, clear: true });
  // Pet at the right edge: the card is held on the screen, the line goes on the card's left.
  const r = K.bubbleBesideCard({ bubbleX: 2330, bubbleW: 220, cardX: 2238, cardW: 314, width: 2560 });
  assert.deepEqual(r, { x: 2010, clear: true });
  // Card shut, or the line already misses it: unchanged.
  assert.deepEqual(K.bubbleBesideCard({ bubbleX: 58, bubbleW: 220, cardX: 0, cardW: 0, width: 2560 }), { x: 58, clear: true });
  assert.deepEqual(K.bubbleBesideCard({ bubbleX: 900, bubbleW: 220, cardX: 177, cardW: 314, width: 2560 }), { x: 900, clear: true });
  // No room on either side: pet.js lifts it as before.
  assert.equal(K.bubbleBesideCard({ bubbleX: 20, bubbleW: 220, cardX: 100, cardW: 314, width: 500 }).clear, false);
  for (let cardX = 8; cardX <= 2560 - 322; cardX += 37) {
    const s = K.bubbleBesideCard({ bubbleX: Math.max(10, cardX - 60), bubbleW: 220, cardX, cardW: 314, width: 2560 });
    assert.ok(s.clear && (s.x + 220 <= cardX || s.x >= cardX + 314), `card at ${cardX}`);
    assert.ok(s.x >= 10 && s.x + 220 <= 2550, `on screen at ${cardX}`);
  }
  assert.match(petSrc, /PetKeeper\.bubbleBesideCard\(/);
  assert.match(petSrc, /card\.collapsed \|\| spot\.clear \? 0 :/);
  assert.match(petSrc, /translate3d\(\$\{spot\.x\}px/);
});

test("the trick has one word on the card, the pet menu and the tray, and no menu has two rows alike", () => {
  assert.equal(Special.trickLabel("red_panda"), "Steal ribbon");
  assert.equal(Special.trickLabel("salamander"), "Hide trick");
  assert.equal(Special.trickLabel("grouper"), "Hide trick");
  const menuWords = [...mainSrc.slice(mainSrc.indexOf("function careMenu()"), mainSrc.indexOf("function acceptSoftwareCompositing")).matchAll(/label: "([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual([...menuWords].sort(), [...Special.CARE_WORDS].sort(), "CARE_WORDS is the menu's other words");
  for (const key of CATALOG) {
    const rows = [...menuWords, Special.trickLabel(key)].map((w) => w.toLowerCase());
    assert.equal(new Set(rows).size, rows.length, key);
  }
  assert.match(petSrc, /verb: window\.PetSpecial\?\.trickLabel\(kind\.key\)/);
  assert.match(petSrc, /specialVerb: window\.PetSpecial\?\.trickLabel\(kind\.key\)/);
  assert.match(petSrc, /hudSpecial\.textContent = \(kind && window\.PetSpecial\?\.trickLabel\(kind\.key\)\)/);
  assert.match(mainSrc, /label: lastVitals\.verb \|\| "Special"/);
});
