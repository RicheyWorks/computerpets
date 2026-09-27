import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const S = await import(pathToFileURL(join(root, "src/lib/pets/house-sleep.ts")).href);
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/house-sleep.js"));
const C = await import(pathToFileURL(join(root, "src/lib/pets/card.ts")).href);
const cardSrc = readFileSync(join(root, "src/components/desk/keeper-card.tsx"), "utf8");
const overlayPet = readFileSync(join(root, "../desktop/renderer/pet.js"), "utf8");
const overlayHtml = readFileSync(join(root, "../desktop/renderer/index.html"), "utf8");

function oggDurationSeconds(buf, rate = 22050) {
  let last = 0n;
  for (let i = 0; i < buf.length - 27; i++) {
    if (buf[i] === 0x4f && buf[i + 1] === 0x67 && buf[i + 2] === 0x67 && buf[i + 3] === 0x53) {
      const granule = buf.readBigUInt64LE(i + 6);
      if (granule > last) last = granule;
    }
  }
  return Number(last) / rate;
}

function FakeAudio(src) {
  return {
    src,
    loop: false,
    volume: 1,
    paused: true,
    plays: 0,
    dataset: {},
    play() {
      this.paused = false;
      this.plays += 1;
      return Promise.resolve();
    },
    pause() {
      this.paused = true;
    },
  };
}

test("Sleep aid is Off or Rain and thunder, house-made, not radio", () => {
  assert.deepEqual(S.SLEEP_AID_PLUGINS.map((p) => p.id), ["off", "rain"]);
  assert.equal(S.SLEEP_AID_PLUGINS[0].name, "Off");
  assert.equal(S.SLEEP_AID_PLUGINS[1].name, "Rain and thunder");
  assert.equal(S.SLEEP_AID_LABEL, "Sleep aid");
  assert.equal(S.SLEEP_AID_LICENSE, "CC0 · house-made");
  assert.equal(S.SLEEP_AID_MUTE_TRUTH, "Music mute also quiets the bed.");
  assert.equal(Overlay.SLEEP_AID_LICENSE, S.SLEEP_AID_LICENSE);
  assert.deepEqual(
    Overlay.SLEEP_AID_PLUGINS.map((p) => p.id),
    S.SLEEP_AID_PLUGINS.map((p) => p.id),
  );
  const rain = S.parseSleepAid({ plugin: "rain", playing: true });
  assert.equal(S.playSrc(rain), "/sounds/sleep-rain.ogg");
  assert.equal(S.overlayPlaySrc(rain), "sounds/sleep-rain.ogg");
  assert.equal(Overlay.playSrc(rain), S.playSrc(rain));
  assert.equal(S.playSrc(S.parseSleepAid({ plugin: "off", playing: true })), "");
  assert.doesNotMatch(S.playSrc(rain), /radio-browser|spotify|youtube|apple/i);
  assert.equal(S.shouldPlay({ plugin: "rain", playing: true }, { music: false }), true);
  assert.equal(S.shouldPlay({ plugin: "rain", playing: true }, { music: true }), false);
  assert.equal(S.shouldPlay({ plugin: "off", playing: true }, { music: false }), false);
  assert.equal(S.shouldPlay({ plugin: "rain", playing: false }, { music: false }), false);
  assert.equal(C.blankCard().sleepAid.plugin, "off");
  assert.equal(C.blankCard().sleepAid.playing, false);
  const kept = C.parseCard({ sleepAid: { plugin: "rain", playing: true } });
  assert.equal(kept.sleepAid.plugin, "rain");
  assert.equal(kept.sleepAid.playing, true);
  assert.equal(C.parseCard({}).sleepAid.playing, false);
  assert.deepEqual([...C.MUTE_BUSES], ["talk", "special", "weather", "treats", "steps", "music"]);
  assert.equal(C.busOf("sleep"), "music");
  assert.equal(C.isMuted({ music: true }, "sleep"), true);
});

test("the storm bed is a real ~3 minute house file in overlay and /demo", () => {
  const desk = join(root, "../desktop/renderer/sounds/sleep-rain.ogg");
  const demo = join(root, "public/sounds/sleep-rain.ogg");
  assert.equal(existsSync(desk), true);
  assert.equal(existsSync(demo), true);
  assert.ok(statSync(desk).size > 200_000, "ogg is a bed, not a blip");
  assert.ok(statSync(demo).size > 200_000, "demo ogg is a bed, not a blip");
  const deskDur = oggDurationSeconds(readFileSync(desk));
  const demoDur = oggDurationSeconds(readFileSync(demo));
  assert.ok(deskDur >= 170 && deskDur <= 195, `desk duration ${deskDur}`);
  assert.ok(demoDur >= 170 && demoDur <= 195, `demo duration ${demoDur}`);
  assert.equal(S.SLEEP_AID_SECONDS, 180);
  assert.equal(existsSync(join(root, "../desktop/renderer/sounds/sleep-rain.wav")), false);
});

test("Off, mute, and Rain and thunder actually start or stop the loop", () => {
  const makeAudio = (src) => FakeAudio(src);
  let node = S.applySleepAid(null, { plugin: "off", playing: false }, {}, 0.8, { makeAudio, srcOf: S.overlayPlaySrc });
  assert.equal(node, null);
  node = S.applySleepAid(null, { plugin: "rain", playing: true }, { music: false }, 0.5, { makeAudio, srcOf: S.overlayPlaySrc });
  assert.ok(node);
  assert.equal(node.loop, true);
  assert.equal(node.src, "sounds/sleep-rain.ogg");
  assert.equal(node.paused, false);
  assert.equal(node.plays, 1);
  assert.equal(node.volume, 0.5);
  const same = S.applySleepAid(node, { plugin: "rain", playing: true }, { music: false }, 0.2, { makeAudio, srcOf: S.overlayPlaySrc });
  assert.equal(same, node);
  assert.equal(same.volume, 0.2);
  assert.equal(same.plays, 1);
  const muted = Overlay.applySleepAid(node, { plugin: "rain", playing: true }, { music: true }, 0.5, { makeAudio, srcOf: Overlay.overlayPlaySrc });
  assert.equal(muted, null);
  assert.equal(node.paused, true);
  assert.equal(node.src, "");
  const off = S.applySleepAid(FakeAudio("x"), { plugin: "off", playing: false }, { music: false }, 0.8, { makeAudio, srcOf: S.overlayPlaySrc });
  assert.equal(off, null);
  assert.match(cardSrc, /SLEEP_AID_LABEL/);
  assert.match(cardSrc, /SLEEP_AID_PLUGINS/);
  assert.match(cardSrc, /sleepPlaySrc/);
  assert.match(cardSrc, /audio\.loop = true/);
  assert.match(overlayPet, /function sitSleepAid/);
  assert.match(overlayPet, /sitSleepAid\(\)/);
  assert.match(overlayHtml, /id="hud-sleep"/);
  assert.ok(overlayHtml.indexOf("house-sleep.js") < overlayHtml.indexOf("card.js"));
  assert.doesNotMatch(cardSrc, /radio-browser.*sleep|sleep.*radio-browser/i);
});
