import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const G = await import(join(root, "src/lib/pets/call-guests.ts"));
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/call-guests.js"));
const roster = createRequire(import.meta.url)(join(root, "../desktop/renderer/roster.json"));
const roomsSrc = readFileSync(join(root, "src/lib/pets/rooms.ts"), "utf8");

const cardSrc = readFileSync(join(root, "src/components/desk/keeper-card.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const platesSrc = readFileSync(join(root, "src/components/desk/desk-plates.tsx"), "utf8");
const music = await import(join(root, "src/lib/pets/house-music.ts"));
const OverlayMusic = createRequire(import.meta.url)(join(root, "../desktop/renderer/house-music.js"));

test("Call lockstep uses the existing dens, not invented groups", () => {
  assert.equal(roster.length, 220);
  assert.match(roomsSrc, /id: "garden"/);
  assert.match(roomsSrc, /id: "roost"/);
  assert.equal(Overlay.CALL_GROUPS.length, G.CALL_GROUPS.length);
  assert.deepEqual(
    G.CALL_GROUPS.map((g) => g.id),
    Overlay.CALL_GROUPS.map((g) => g.id),
  );
  const plants = ["moss", "maidenhair", "ginkgo", "oak", "water_lily", "orchid", "saguaro", "venus_flytrap", "pitcher", "sundew"];
  assert.deepEqual(G.matchCall("plant", roster), plants);
  assert.deepEqual(Overlay.matchCall("plant", roster), plants);
  assert.deepEqual(G.matchCall("Rui", roster), ["red_panda"]);
  assert.deepEqual(G.callKeys("", roster, "roost"), G.CALL_GROUPS.find((g) => g.id === "roost").keys.slice());
  assert.deepEqual(G.callKeys("Rui", roster, "roost"), ["red_panda"]);
});

test("/demo Call sits dropdown, type-in, den picker, and called walkers", () => {
  assert.match(cardSrc, /Call guest dropdown/);
  assert.match(cardSrc, /Call by name or group/);
  assert.match(cardSrc, /Call by den/);
  assert.match(cardSrc, /Call \{FLY_BIRD_NAME\}/);
  assert.match(cardSrc, /onCallGuests/);
  assert.match(cardSrc, /if \(card\.collapsed && !stayOpen\) return null/);
  assert.match(roomSrc, /CalledGuests/);
  assert.match(roomSrc, /setCardOpenTick/);
  assert.match(roomSrc, /collapsed: false/);
});

test("radio search splits 99.9 seattle fm and labels the box", () => {
  const q = music.parseRadioQuery("99.9 seattle fm");
  assert.equal(q.freq, "99.9");
  assert.equal(q.place, "seattle");
  const urls = music.radioSearchUrls("99.9 seattle fm");
  assert.ok(urls.some((u) => /name=99\.9/.test(u)));
  assert.ok(urls.some((u) => /seattle/i.test(u)));
  assert.ok(urls.some((u) => /countrycode=US/.test(u)));
  assert.ok(!urls.some((u) => /tag=seattle/.test(u)));
  assert.equal(music.RADIO_LABEL, OverlayMusic.RADIO_LABEL);
  assert.equal(music.RADIO_EMPTY, OverlayMusic.RADIO_EMPTY);
  assert.match(cardSrc, /RADIO_LABEL/);
  assert.match(cardSrc, /RADIO_PLACEHOLDER/);
  assert.match(platesSrc, /AREA_LABEL/);
  assert.match(platesSrc, /Weather area/);
});
