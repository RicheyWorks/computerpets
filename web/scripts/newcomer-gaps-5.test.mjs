import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Newcomer pass 5 (September 2026): the last pass's leftovers, each pinned to the thing it describes. The Python
// client's Unlock App ID rule is tested in client/tests/test_unlock_app_id.py.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => readFileSync(join(...p), "utf8").replace(/\r\n/g, "\n");

/** hideTuck and hideTuckClear from gait.ts, run as plain JS (gait.ts imports ./shed without an extension). */
function tuckFns() {
  const src = read(root, "src/lib/pets/gait.ts");
  const grab = (name) => {
    const at = src.indexOf(`export function ${name}(`);
    assert.ok(at >= 0, name);
    const end = src.indexOf("\n}\n", at);
    return src.slice(at, end + 2).replace("export ", "");
  };
  let body = grab("hideTuck") + "\n" + grab("hideTuckClear");
  for (const [a, b] of [
    ["x: number, width: number", "x, width"],
    ["blocks: readonly TuckBlock[]", "blocks"],
    ["(at: number)", "(at)"],
    ["(fromLeft: boolean)", "(fromLeft)"],
  ]) {
    assert.ok(body.includes(a), a);
    body = body.split(a).join(b);
  }
  return new Function("SPRITE", `${body}\nreturn { hideTuck, hideTuckClear };`)(96);
}

test("a hidden pet tucks clear of the panel and the rail, not behind the plaque", () => {
  const { hideTuck, hideTuckClear } = tuckFns();
  const panel = { left: 0, right: 372 };
  const rail = { left: 1226, right: 1366 };
  // Near the left edge: the plain tuck sat at 16, under the panel. Now it sits just past it.
  assert.equal(hideTuck(200, 1366, 96, 16), 16);
  assert.equal(hideTuckClear(200, 1366, [panel, rail], 96, 16), 388);
  // Near the right edge: just before the rail.
  assert.equal(hideTuckClear(1100, 1366, [panel, rail], 96, 16), 1226 - 96 - 16);
  // No blocks: the plain tuck.
  assert.equal(hideTuckClear(200, 1366, [], 96, 16), 16);
  assert.equal(hideTuckClear(1100, 1366, [], 96, 16), 1366 - 96 - 16);
  // A block over the whole right side: it steps left of the block.
  assert.equal(hideTuckClear(700, 800, [{ left: 300, right: 800 }], 96, 16), 300 - 96 - 16);
  // Never behind a block: every answer with room is clear of all of them.
  for (let x = 0; x < 1366; x += 37) {
    const at = hideTuckClear(x, 1366, [panel, rail], 96, 16);
    assert.ok(at >= panel.right && at + 96 <= rail.left, `${x} -> ${at}`);
  }
  // No room anywhere: the plain tuck.
  assert.equal(hideTuckClear(200, 500, [{ left: 0, right: 500 }], 96, 16), 16);
  const living = read(root, "src/components/desk/living-pet.tsx");
  assert.match(living, /hideTuckClear\(/);
  assert.match(living, /\[data-desk-aside\], \[data-desk-rail\]/);
});

test("/demo's Windows strip is one line in the bottom band, clear of the care row", () => {
  const strip = read(root, "src/components/desk/windows-desk-sit.tsx");
  assert.match(strip, /\{name\} · on Windows<\/p>/);
  assert.match(strip, /min-w-0 truncate/);
  assert.match(strip, /var\(--demo-strip-room/);
  const css = read(root, "src/styles.css");
  assert.match(css, /\[data-demo-stage\] \{\s*--demo-strip-room: 36rem;/);
  assert.match(css, /--demo-strip-room: 48rem;/);
  assert.match(read(root, "src/components/desk/tablet-desk-sit.tsx"), /var\(--demo-strip-room/);
});

test("the phone sweep reads which bubble is painted on top, not which one takes a tap", () => {
  const sweep = read(root, "scripts/phone-desk-layout.test.mjs");
  // A visitor's bubble has no close, so it lets taps through; the probe turns pointer events on while it asks.
  assert.match(sweep, /o\.style\.pointerEvents = "auto";/);
  assert.match(sweep, /o\.style\.pointerEvents = pe;/);
  const visit = read(root, "src/components/desk/house-visit.tsx");
  assert.doesNotMatch(visit, /onSpeechClose/);
});

test("/nest, the kennel and /meet say what neglect and a long-press do, in plain words", () => {
  const plain = /A pet left without care too long goes away\./;
  assert.match(read(root, "src/routes/nest.tsx"), plain);
  assert.match(read(root, "src/routes/collection.tsx"), plain);
  const meet = read(root, "src/routes/meet.tsx");
  assert.match(meet, /press and hold it to reach its care buttons/);
  for (const f of ["src/routes/nest.tsx", "src/routes/collection.tsx", "src/routes/meet.tsx"]) {
    assert.doesNotMatch(read(root, f), /Neglect can close a line|A long-press tends|a tap is a choice/i, f);
  }
});
