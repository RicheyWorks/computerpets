const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const W = require("./weather.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const webWeather = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "weather.ts"), "utf8");
const catalogSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "catalog.ts"), "utf8");

const CATALOG = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);

test("the overlay keeps the house sky clock", () => {
  const windDay = new Date(2026, 7, 17);
  const heatDay = new Date(2024, 5, 9);
  assert.equal(W.weatherOf(new Date(2026, 7, 17, 8)), W.weatherOf(new Date(2026, 7, 17, 22)));
  assert.equal(W.weatherOf(windDay), "wind");
  assert.equal(W.weatherOf(heatDay), "heat");
  assert.equal(W.weatherLabel("rain"), "Rain");
  assert.equal(W.weatherLabel("clear"), "Clear");
  assert.equal(CATALOG.length, 221);
});

test("Drake swims the rain on the overlay. Soot walks the wind. A snake sits the heat.", () => {
  assert.equal(W.weatherIdle("goldfish", "rain"), "wander");
  assert.equal(W.weatherIdle("mallard", "rain"), "wander");
  assert.equal(W.weatherIdle("canada_goose", "rain"), "wander");
  assert.equal(W.weatherIdle("red_panda", "rain"), "sit");
  assert.equal(W.weatherIdle("crow", "wind"), "wander");
  assert.equal(W.weatherIdle("pileated", "wind"), "wander");
  assert.equal(W.weatherIdle("robin", "wind"), "wander");
  assert.equal(W.weatherIdle("phoenix", "wind"), "wander");
  assert.equal(W.weatherIdle("red_panda", "wind"), null);
  assert.equal(W.weatherIdle("ball_python", "heat"), "sit");
  assert.equal(W.weatherIdle("cat", "heat"), "sit");
  assert.equal(W.weatherIdle("cyber_dragon", "heat"), "sit");
  assert.equal(W.weatherIdle("volt_dragon", "heat"), "sit");
  assert.equal(W.weatherIdle("trace_dragon", "heat"), "sit");
  assert.equal(W.weatherIdle("flux_dragon", "heat"), "sit");
  assert.equal(W.weatherIdle("spark_dragon", "heat"), "sit");
  assert.equal(W.weatherIdle("ion_dragon", "heat"), "sit");
  assert.equal(W.weatherIdle("gauss_dragon", "heat"), "sit");
  assert.equal(W.weatherIdle("relay_dragon", "heat"), "sit");
  assert.equal(W.weatherIdle("fuse_dragon", "heat"), "sit");
  assert.equal(W.weatherIdle("ground_dragon", "heat"), "sit");
  assert.equal(W.weatherIdle("red_panda", "clear"), null);
});

test("the overlay weather line is the house copy", () => {
  assert.equal(W.weatherLine("mallard", "rain"), "Proper weather. At last.");
  assert.equal(W.weatherLine("canada_goose", "rain"), "Proper weather. At last.");
  assert.equal(W.weatherLine("red_panda", "rain"), "It is raining outside. I will stay in, thanks.");
  assert.equal(W.weatherLine("pileated", "wind"), "The air has opinions.");
  assert.equal(W.weatherLine("robin", "wind"), "The air has opinions.");
  assert.equal(W.weatherLine("budgie", "wind"), "The air has opinions.");
  assert.equal(W.weatherLine("ball_python", "heat"), "Heat. I was waiting for this clause.");
  assert.equal(W.weatherLine("cyber_dragon", "heat"), "The glow is reserved. Heat is weather I already keep.");
  assert.equal(W.weatherLine("volt_dragon", "heat"), "The coil is reserved. Heat is weather I already keep.");
  assert.equal(W.weatherLine("trace_dragon", "heat"), "The path is reserved. Heat is weather I already keep.");
  assert.equal(W.weatherLine("flux_dragon", "heat"), "The field is reserved. Heat is weather I already keep.");
  assert.equal(W.weatherLine("spark_dragon", "heat"), "The crackle is reserved. Heat is weather I already keep.");
  assert.equal(W.weatherLine("ion_dragon", "heat"), "The haze is reserved. Heat is weather I already keep.");
  assert.equal(W.weatherLine("gauss_dragon", "heat"), "The filings are reserved. Heat is weather I already keep.");
  assert.equal(W.weatherLine("relay_dragon", "heat"), "The click is reserved. Heat is weather I already keep.");
  assert.equal(W.weatherLine("fuse_dragon", "heat"), "The filament is reserved. Heat is weather I already keep.");
  assert.equal(W.weatherLine("ground_dragon", "heat"), "The strap is reserved. Heat is weather I already keep.");
  assert.equal(W.weatherLine("red_panda", "clear"), null);
  assert.match(webWeather, /key === "mallard"/);
  assert.match(webWeather, /key === "pileated"/);
  assert.match(webWeather, /key === "robin"/);
});

test("the overlay idle and greet sit the shared sky, not the old three swimmers", () => {
  assert.match(htmlSrc, /weather\.js/);
  assert.match(petSrc, /PetWeather\?\.weatherIdle/);
  assert.match(petSrc, /PetWeather\?\.weatherLine/);
  assert.match(petSrc, /PetWeather\?\.weatherOf/);
  assert.doesNotMatch(petSrc, /\["goldfish", "axolotl", "penguin"\]/);
  assert.doesNotMatch(petSrc, /\["iguana", "turtle", "cat", "dragon"\]/);
  const greet = petSrc.slice(petSrc.indexOf("const back ="), petSrc.indexOf("if (!life.hidden) issue"));
  assert.match(greet, /skyTalk/);
  assert.match(greet, /weatherLine/);
});
