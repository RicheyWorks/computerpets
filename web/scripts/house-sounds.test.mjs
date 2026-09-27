import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { SPECIES } from "../src/lib/pets/catalog.ts";
import * as S from "../src/lib/pets/house-sounds.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
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

test("any catalog species cry path; unknown keys stay silent", () => {
  assert.equal(SPECIES.length, 221);
  assert.equal(S.voiceSrc("crow"), "/sounds/crow.wav");
  assert.equal(S.voiceSrc("red_panda"), "/sounds/red_panda.wav");
  assert.equal(S.voiceSrc(""), "");
  assert.equal(S.voiceSrc("not_a_pet"), "");
  assert.equal(S.overlayVoiceSrc("crow"), "sounds/crow.wav");
  assert.equal(S.overlayVoiceSrc("red_panda"), "sounds/red_panda.wav");
  assert.equal(S.overlayVoiceSrc(""), "");
  assert.equal(S.overlayVoiceSrc("not_a_pet"), "");
  assert.equal(Overlay.voiceSrc("crow"), "/sounds/crow.wav");
  assert.equal(Overlay.voiceSrc("red_panda"), "/sounds/red_panda.wav");
  assert.equal(Overlay.voiceSrc(""), "");
  assert.equal(Overlay.voiceSrc("not_a_pet"), "");
  assert.equal(Overlay.overlayVoiceSrc("crow"), "sounds/crow.wav");
  assert.equal(Overlay.overlayVoiceSrc("red_panda"), "sounds/red_panda.wav");
  assert.equal(Overlay.overlayVoiceSrc(""), "");
  assert.equal(Overlay.overlayVoiceSrc("not_a_pet"), "");
  assert.equal(S.isVoiceKey("crow"), true);
  assert.equal(S.isVoiceKey("moss"), true);
  assert.equal(S.isVoiceKey("yeast"), true);
  assert.equal(S.isVoiceKey("diatom"), true);
  assert.equal(S.isVoiceKey("luna"), true);
  assert.equal(S.isVoiceKey(""), false);
  assert.equal(S.isVoiceKey("not_a_pet"), false);
  assert.equal(S.isVoiceKey("toString"), false);
  assert.equal(Overlay.isVoiceKey("crow"), true);
  assert.equal(Overlay.isVoiceKey("not_a_pet"), false);
  // A catalog kind with no cry on disk still gets a path (Jaw the crocodile has no legal field tape yet).
  assert.equal(existsSync(join(root, "public/sounds", "crocodile.wav")), false);
  assert.equal(existsSync(join(root, "../desktop/renderer/sounds", "crocodile.wav")), false);
  for (const row of SPECIES) {
    assert.equal(S.isVoiceKey(row.key), true, row.key);
    assert.equal(Overlay.isVoiceKey(row.key), true, row.key);
    assert.equal(S.voiceSrc(row.key), `/sounds/${row.key}.wav`, row.key);
    assert.equal(Overlay.overlayVoiceSrc(row.key), `sounds/${row.key}.wav`, row.key);
  }
  assert.match(S.SOUND_LICENSE, /Grok Imagine/);
  assert.match(Overlay.SOUND_LICENSE, /Grok Imagine/);
  assert.match(S.SOUND_LICENSE, /Not CC0 zoo tapes/);
  assert.equal(Overlay.SPECIES_KEYS.length, 221);
});

test("desk audio playVoice reports play outcome for TTS backup", () => {
  const src = readFileSync(join(root, "src/lib/pets/desk-audio.ts"), "utf8");
  assert.match(src, /Promise<boolean>/);
  assert.match(src, /audio\.play\(\)\.then/);
  assert.match(src, /export function playVoice\(key: string, guestKey = key\): Promise<boolean>/);
});
