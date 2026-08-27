import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const S = await import(join(root, "src/lib/pets/house-sounds.ts"));
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/house-sounds.js"));

test("five species voices and honest footstep defaults", () => {
  assert.deepEqual([...S.VOICE_KEYS], ["red_panda", "hummingbird", "cat", "dog", "chickadee"]);
  assert.deepEqual([...S.STEP_KINDS], ["species", "soft", "tap", "claw", "wood", "mute"]);
  assert.equal(S.stepDefault("red_panda"), "soft");
  assert.equal(S.stepDefault("dog"), "tap");
  assert.equal(S.stepDefault("hummingbird"), "claw");
  assert.equal(S.stepOf("species", "", "red_panda"), "soft");
  assert.equal(S.stepOf("wood", "", "red_panda"), "wood");
  assert.equal(S.stepOf("species", "mute", "dog"), "mute");
  assert.equal(S.voiceSrc("hummingbird"), "/sounds/hummingbird.wav");
  assert.equal(Overlay.overlayVoiceSrc("chickadee"), "sounds/chickadee.wav");
  for (const key of S.VOICE_KEYS) {
    assert.equal(existsSync(join(root, "public/sounds", `${key}.wav`)), true, key);
    assert.equal(existsSync(join(root, "../desktop/renderer/sounds", `${key}.wav`)), true, key);
  }
  for (const step of ["soft", "tap", "claw", "wood"]) {
    assert.equal(existsSync(join(root, "public/sounds", `step-${step}.wav`)), true, step);
  }
});
