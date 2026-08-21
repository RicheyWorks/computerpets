import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = await import(join(root, "src/lib/pets/weather.ts"));
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/weather.js"));

const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const roomsSrc = readFileSync(join(root, "src/lib/pets/rooms.ts"), "utf8");
const weatherSrc = readFileSync(join(root, "src/lib/pets/weather.ts"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const overlayPetSrc = readFileSync(join(root, "../desktop/renderer/pet.js"), "utf8");
const overlayHtml = readFileSync(join(root, "../desktop/renderer/index.html"), "utf8");
const blotterWeather = readFileSync(join(root, "../client/computerpets_client/weather.py"), "utf8");
const blotterApp = readFileSync(join(root, "../client/computerpets_client/app.py"), "utf8");

const KEYS = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);
const ROOM_COUNT = [...roomsSrc.matchAll(/path: "\//g)].length;

const RAIN_SWIM = ["goldfish", "axolotl", "penguin", "mallard", "canada_goose"];
const WIND_WALK = [
  "budgie",
  "parrot",
  "toucan",
  "phoenix",
  "crow",
  "raven",
  "red_tail",
  "chickadee",
  "hummingbird",
  "pileated",
  "robin",
];

test("the house keeps one sky clock", () => {
  const windDay = new Date(2026, 7, 17);
  const heatDay = new Date(2024, 5, 9);
  assert.equal(W.weatherOf(new Date(2026, 7, 17, 8)), W.weatherOf(new Date(2026, 7, 17, 22)));
  assert.equal(W.weatherOf(windDay), "wind");
  assert.equal(W.weatherOf(heatDay), "heat");
  assert.equal(W.weatherLabel("wind"), "Wind");
  assert.equal(Overlay.weatherOf(windDay), W.weatherOf(windDay));
  assert.equal(Overlay.weatherOf(heatDay), W.weatherOf(heatDay));
  assert.equal(Overlay.weatherLabel("heat"), "Heat");
});

test("Drake swims the rain. Soot walks the wind. The snakes sit the heat.", () => {
  for (const key of RAIN_SWIM) {
    assert.equal(W.weatherIdle(key, "rain"), "wander", key);
    assert.equal(Overlay.weatherIdle(key, "rain"), "wander", key);
  }
  assert.equal(W.weatherIdle("red_panda", "rain"), "sit");
  assert.equal(W.weatherIdle("turtle", "rain"), "sit");
  assert.equal(Overlay.weatherIdle("red_panda", "rain"), "sit");
  for (const key of WIND_WALK) {
    assert.equal(W.weatherIdle(key, "wind"), "wander", key);
    assert.equal(Overlay.weatherIdle(key, "wind"), "wander", key);
  }
  assert.equal(W.weatherIdle("barn_owl", "wind"), null);
  assert.equal(W.weatherIdle("red_panda", "wind"), null);
  assert.equal(W.weatherIdle("red_panda", "clear"), null);
  assert.equal(W.weatherIdle("ball_python", "heat"), "sit");
  assert.equal(W.weatherIdle("milk_snake", "heat"), "sit");
  assert.equal(W.weatherIdle("cat", "heat"), "sit");
  assert.equal(Overlay.weatherIdle("ball_python", "heat"), "sit");
  assert.equal(Overlay.weatherIdle("phoenix", "wind"), "wander");
});

test("the weather line is the same house copy", () => {
  assert.equal(W.weatherLine("mallard", "rain"), "Proper weather. At last.");
  assert.equal(W.weatherLine("canada_goose", "rain"), "Proper weather. At last.");
  assert.equal(W.weatherLine("goldfish", "rain"), "Proper weather. At last.");
  assert.equal(W.weatherLine("red_panda", "rain"), "The blotter is honest about rain.");
  assert.equal(W.weatherLine("crow", "wind"), "The air has opinions.");
  assert.equal(W.weatherLine("pileated", "wind"), "The air has opinions.");
  assert.equal(W.weatherLine("robin", "wind"), "The air has opinions.");
  assert.equal(W.weatherLine("red_panda", "wind"), "Something moved that was not me.");
  assert.equal(W.weatherLine("ball_python", "heat"), "Heat. I was waiting for this clause.");
  assert.equal(W.weatherLine("red_panda", "clear"), null);
  assert.equal(Overlay.weatherLine("mallard", "rain"), W.weatherLine("mallard", "rain"));
  assert.equal(Overlay.weatherLine("pileated", "wind"), W.weatherLine("pileated", "wind"));
  assert.equal(Overlay.weatherLine("ball_python", "heat"), W.weatherLine("ball_python", "heat"));
});

test("desk, /demo, and /live sit the same sky; overlay and blotter keep it", () => {
  assert.equal(KEYS.length, 210);
  assert.equal(ROOM_COUNT, 19);
  assert.match(roomSrc, /weatherIdle\(kind\.key, weatherOf\(\)\)/);
  assert.match(roomSrc, /weatherLine\(kind\.key, weatherOf\(\)\)/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(liveSrc, /CompanionRoom/);
  assert.match(overlayHtml, /weather\.js/);
  assert.match(overlayPetSrc, /PetWeather\?\.weatherIdle/);
  assert.match(overlayPetSrc, /PetWeather\?\.weatherLine/);
  assert.doesNotMatch(overlayPetSrc, /\["goldfish", "axolotl", "penguin"\]/);
  assert.doesNotMatch(overlayPetSrc, /\["iguana", "turtle", "cat", "dragon"\]/);
  assert.match(blotterWeather, /"mallard"/);
  assert.match(blotterWeather, /"canada_goose"/);
  assert.match(blotterWeather, /"pileated"/);
  assert.match(blotterWeather, /"robin"/);
  assert.match(blotterApp, /weather_idle/);
  assert.match(blotterApp, /weather_line/);
  assert.match(weatherSrc, /key === "mallard"/);
  assert.match(weatherSrc, /key === "pileated"/);
});
