// Reduced motion 2 and moving targets that give way (September 2026). Without a browser: the pet itself and a house
// visitor follow reduced motion on the web as in the overlay (a walk is a cut, an idle wander waits, a pose is held
// on its first frame and a once-through pose still ends on time); a moving target under the controls drawn over it
// gives way (give-way.ts) while less than a 24 px square of it can be reached; Brick and Sip are drawn only, so a tap
// goes through them. The browser half is in a11y-axe.test.mjs, the overlay half in desktop/renderer/reduced-motion-2.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = join(import.meta.dirname, "..");
const repo = join(root, "..");
const Web = await import(pathToFileURL(join(root, "src/lib/pets/calm-motion.ts")).href);
const Overlay = createRequire(import.meta.url)(join(repo, "desktop/renderer/calm-motion.js"));
const Give = await import(pathToFileURL(join(root, "src/lib/pets/give-way.ts")).href);
const desk = (f) => readFileSync(join(root, "src/components/desk", f), "utf8");

test("calmOnceS: web and overlay agree on how long a held once-through pose lasts", () => {
  for (const len of [0, 1, 2, 4, 6, 8, 12]) {
    for (const fps of [0, 2, 4, 6, 8, 10, 12]) assert.equal(Web.calmOnceS(len, fps), Overlay.calmOnceS(len, fps), `${len}/${fps}`);
  }
  assert.equal(Web.calmOnceS(8, 8), 1);
  assert.equal(Web.calmOnceS(1, 12), 0.4);
});

test("the web pet under reduced motion: read every frame, a walk is a cut, a wander waits, first frames, no hop or tilt", () => {
  const pet = desk("living-pet.tsx");
  assert.doesNotMatch(pet, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/, "read through calm-motion.ts, not once");
  assert.match(pet, /let reduced = reducedMotion\(\);/);
  assert.match(pet, /last = now;\n\s+reduced = reducedMotion\(\);/);
  assert.match(pet, /\} else if \(s\.anim === "walk" && s\.target != null && reduced\) \{[\s\S]{0,200}s\.x = s\.target;\s+landWalk\(\);/);
  assert.match(pet, /if \(reduced && cmd === "wander"\) \{[\s\S]{0,300}arrivedRef\.current\?\.\(\);\s+return;/);
  assert.match(pet, /if \(reduced && onceRef\.current\.has\(s\.anim\)\) \{[\s\S]{0,200}calmOnceS\(spritesRef\.current\[s\.anim\]\.length, fpsRef\.current\[s\.anim\]\)[\s\S]{0,80}finishOnce\(\);/);
  assert.match(pet, /const src = frames\[reduced && s\.anim !== "sleep" \? 0 : Math\.min\(s\.frame, frames\.length - 1\)\]!;/);
  assert.match(pet, /if \(!reduced\) s\.x = s\.happy\.x;/);
  assert.match(pet, /\} else if \(s\.pause > 0\) \{/, "a two-step wander's pause still counts down");
  for (const piece of [/const hopPx = s\.hop > 0 && !reduced \?/, /const water = gaitNow\?\.aquatic && !reduced \?/, /const climbRot = reduced \? 0 :/, /const stretch = reduced\n\s+\? 1/, /!reduced && \(s\.anim === "idle"/]) {
    assert.match(pet, piece);
  }
  // One landing and one end of a once-through pose, whichever way the pet got there.
  assert.equal((pet.match(/landWalk\(\);/g) || []).length, 2);
  assert.equal((pet.match(/finishOnce\(\);/g) || []).length, 2);
  // The house visitor is a LivingPet, so it follows the same rules.
  assert.match(desk("house-visit.tsx"), /<LivingPet/);
});

test("hasFreeSquare: a 24 px square needs four reachable points across and down, 8 px apart", () => {
  const grid = (rows, cols, on) => Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => on(r, c)));
  assert.equal(Give.hasFreeSquare(grid(4, 4, () => true)), true);
  assert.equal(Give.hasFreeSquare(grid(3, 12, () => true)), false, "a strip three points tall is under 24 px");
  assert.equal(Give.hasFreeSquare(grid(12, 3, () => true)), false);
  assert.equal(Give.hasFreeSquare(grid(10, 10, (r, c) => (r + c) % 2 === 0)), false, "scattered points are not a square");
  assert.equal(Give.hasFreeSquare(grid(10, 10, (r, c) => r >= 6 && c >= 6)), true, "a free corner is enough");
  assert.equal(Give.hasFreeSquare(grid(10, 10, (r, c) => r >= 7 || c >= 7)), false, "an L three points wide has no square");
  assert.equal(Give.hasFreeSquare(grid(10, 10, (r, c) => r >= 6 || c >= 6)), true, "four points wide has");
  assert.equal(Give.hasFreeSquare(grid(10, 10, (r, c) => (r >= 7 && c < 3) || (c >= 7 && r < 3))), false, "two 3-point corners are not one square");
  assert.equal(Give.hasFreeSquare([]), false);
  assert.equal(Give.GIVE_WAY_PX, 24);
});

test("the moving targets that give way, and Brick and Sip drawn only", () => {
  assert.match(desk("living-pet.tsx"), /useEffect\(\(\) => giveWay\(hitRef\.current\), \[\]\);/);
  assert.match(desk("called-guests.tsx"), /data-called=\{key\}\n[\s\S]{0,120}ref=\{giveWay\}/);
  assert.match(desk("desk-plants.tsx"), /data-plant=\{plant\.key\}[\s\S]{0,400}ref=\{giveWay\}/);
  for (const [f, cls] of [["robin-fly.tsx", "bottom-0"], ["bird-fly.tsx", "bottom-\\[18%\\]"]]) {
    const src = desk(f);
    assert.match(src, new RegExp(`className="pointer-events-none absolute ${cls} left-0 z-\\[6\\] h-28 w-28`), f);
    assert.doesNotMatch(src, /onClick|onPointer/, `${f}: nothing answers a tap`);
  }
  const give = readFileSync(join(root, "src/lib/pets/give-way.ts"), "utf8");
  // The focused target and one being held are kept; an inert target is measured as itself.
  assert.match(give, /const keep = held\.has\(el\) \|\| \(active != null && \(el === active \|\| el\.contains\(active\)\)\);/);
  assert.match(give, /if \(was\) el\.inert = false;/);
  assert.match(give, /!encloses\(c\.box, box\)/);
});
