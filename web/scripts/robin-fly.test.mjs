import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/robin-fly.js"));
const OverlayCall = createRequire(import.meta.url)(join(root, "../desktop/renderer/call-guests.js"));
const R = await import(pathToFileURL(join(root, "src/lib/pets/robin-fly.ts")).href);
const G = await import(pathToFileURL(join(root, "src/lib/pets/call-guests.ts")).href);
const flySrc = readFileSync(join(root, "src/components/desk/robin-fly.tsx"), "utf8");
const visitSrc = readFileSync(join(root, "src/components/desk/house-visit.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");

test("/demo robin dest is one real frame and flies like the overlay", () => {
  const play = ["play/1.png", "play/2.png"];
  const sit = ["sit/1.png", "sit/2.png"];
  const fly = R.beginRobinFly(800, 480, true);
  const src = R.destSrc(fly, { play, sit });
  assert.equal(src, Overlay.destSrc(fly, { play, sit }));
  assert.notEqual(src, "");
  assert.ok(src.includes("play/"));
  assert.equal(R.DEST_PX, Overlay.DEST_PX);
  assert.equal(R.wingBeat(0.2, "enter") < 1, true);
  assert.equal(R.wingBeat(0.2, "stay"), 1);
  assert.deepEqual(G.walkersOf(["hummingbird", "robin", "cat"], "red_panda"), ["cat"]);
  assert.deepEqual(OverlayCall.walkersOf(["hummingbird", "robin", "cat"], "red_panda"), ["cat"]);
  assert.equal(G.shouldRobinFly(["robin"], "red_panda"), true);
  assert.match(flySrc, /destSrc/);
  assert.match(flySrc, /paintBrickFrame/);
  assert.doesNotMatch(flySrc, /setAttribute\(\s*"src"/);
  assert.match(visitSrc, /ROBIN_KEY/);
  assert.match(roomSrc, /RobinFlyer/);
});

test("/demo robin lands, stays, sings, and leaves", () => {
  let fly = R.beginRobinFly(800, 480, true);
  for (let i = 0; i < 200 && fly.phase !== "stay"; i++) fly = R.stepRobinFly(fly, 0.05, 800, 480, {});
  assert.equal(fly.phase, "stay");
  assert.equal(R.shouldSing(fly), true);
  fly = R.markSung(fly);
  assert.equal(R.shouldSing(fly), false);
  fly = R.stepRobinFly(fly, R.MIN_STAY_S + 0.05, 800, 480, {});
  assert.equal(fly.phase, "leave");
});
