// The access pass (September 2026): the overlay's keeper card is a valid description list, its small print reads at
// WCAG AA on the plate, and the pet and a visiting guest are named for a screen reader.
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

const read = (f) => readFileSync(join(__dirname, f), "utf8");

function contrast(a, b) {
  const lum = (h) => {
    const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

test("each keeper meter bar is its own <dd>", () => {
  const html = read("index.html");
  for (const id of ["bar-hunger", "bar-energy", "bar-bond"]) {
    assert.match(html, new RegExp(`<dd class="keeper-meter-bar"><i id="${id}"></i></dd>`), id);
  }
  assert.match(read("styles.css"), /\.keeper-meters dd\.keeper-meter-bar \{\s*grid-column: 1 \/ -1;/);
});

test("the plate's muted words and the keeper's vital line read at 4.5:1 on the plate", () => {
  const css = read("styles.css");
  const muted = css.match(/--plate-muted: (#[0-9a-f]{6})/i)[1];
  assert.ok(contrast(muted, "#403e3d") >= 4.5, muted);
  const vital = css.match(/#hud-vital,\s*\.keeper-vital \{[^}]*color: (#[0-9a-f]{6})/i)[1];
  assert.ok(contrast(vital, "#1d1a17") >= 4.5, vital);
});

test("the pet and a guest carry a name", () => {
  const js = read("pet.js");
  assert.match(js, /pet\.setAttribute\("aria-label", window\.PetRoster\.choiceText\(next\)\)/);
  assert.match(js, /guestEl\.setAttribute\("aria-label", window\.PetRoster\.choiceText\(g\)\)/);
});
