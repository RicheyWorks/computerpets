import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const M = await import(join(root, "src/lib/pets/house-music.ts"));
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/house-music.js"));

test("Rui music is house loop or free radio, no paid key", () => {
  assert.deepEqual(M.MUSIC_PLUGINS.map((p) => p.id), ["off", "house", "radio"]);
  assert.equal(M.RADIO_CANT_REACH, "can't reach");
  assert.match(M.radioSearchUrl("piano"), /radio-browser\.info/);
  assert.doesNotMatch(M.RADIO_DIR, /spotify|apple|youtube/i);
  const music = M.parseMusic({ plugin: "house", playing: true });
  assert.equal(M.playSrc(music), "/sounds/house-loop.wav");
  assert.equal(M.overlayPlaySrc(music), "sounds/house-loop.wav");
  assert.equal(M.playSrc(M.parseMusic({ plugin: "off", playing: true })), "");
  assert.equal(existsSync(join(root, "public/sounds/house-loop.wav")), true);
  assert.equal(Overlay.HOUSE_LOOP_LICENSE, M.HOUSE_LOOP_LICENSE);
  const stations = M.parseStations([{ name: "A free station", url_resolved: "https://example.test/stream", stationuuid: "s1" }]);
  assert.equal(stations[0].name, "A free station");
});
