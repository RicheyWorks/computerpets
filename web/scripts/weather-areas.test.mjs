import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const A = await import(join(root, "src/lib/pets/weather-areas.ts"));
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/weather-areas.js"));

test("the house does not guess a city", () => {
  assert.equal(A.NO_AREA, "no area set");
  assert.equal(A.AREA_LABEL, "Weather area");
  assert.equal(Overlay.AREA_LABEL, A.AREA_LABEL);
  assert.equal(A.plateLine(A.blankAreas(), null), "no area set");
  assert.equal(A.currentArea(A.blankAreas()), null);
  assert.equal(Overlay.NO_AREA, A.NO_AREA);
});

test("keeper areas persist and switch", () => {
  let house = A.addArea(A.blankAreas(), { name: "Portland", query: "Portland", lat: 45.5, lon: -122.6 });
  house = A.addArea(house, { name: "Oslo", query: "Oslo", lat: 59.9, lon: 10.7 });
  assert.equal(house.areas.length, 2);
  assert.equal(A.currentArea(house)?.name, "Portland");
  house = A.pickArea(house, house.areas[1].id);
  assert.equal(A.currentArea(house)?.name, "Oslo");
  house = A.renameArea(house, house.areas[1].id, "Oslo, Norway");
  assert.equal(A.currentArea(house)?.name, "Oslo, Norway");
  house = A.removeArea(house, house.areas[1].id);
  assert.equal(house.areas.length, 1);
  assert.equal(A.currentArea(house)?.name, "Portland");
});

test("Open-Meteo maps are honest and lockstep", () => {
  assert.match(A.geocodeUrl("Oslo"), /geocoding-api\.open-meteo\.com/);
  assert.match(A.forecastUrl(59.9, 10.7), /api\.open-meteo\.com/);
  assert.equal(A.geocodeUrl("   "), "");
  assert.equal(A.TYPE_A_CITY, "type a city");
  assert.equal(A.HERE_FAIL, "this computer did not share a place");
  assert.equal("ipPlaceUrl" in A, false);
  assert.equal("parseIpPlace" in A, false);
  assert.equal("IP_PLACE_HOST" in A, false);
  assert.equal("ipPlaceUrl" in Overlay, false);
  assert.equal("parseIpPlace" in Overlay, false);
  const areasSrc = readFileSync(join(root, "src/lib/pets/weather-areas.ts"), "utf8");
  const overlaySrc = readFileSync(join(root, "../desktop/renderer/weather-areas.js"), "utf8");
  assert.doesNotMatch(areasSrc, /ipwho\.is|ip-api\.com|ipinfo\.io|ipapi\.co|ipPlaceUrl|parseIpPlace/);
  assert.doesNotMatch(overlaySrc, /ipwho\.is|ip-api\.com|ipinfo\.io|ipapi\.co|ipPlaceUrl|parseIpPlace/);
  assert.match(A.reverseUrl(47.6, -122.3), /geocoding-api\.open-meteo\.com\/v1\/reverse/);
  assert.equal(Overlay.TYPE_A_CITY, A.TYPE_A_CITY);
  assert.equal(A.mapLiveSky(61, 12, 4), "rain");
  assert.equal(A.mapLiveSky(0, 12, 32), "wind");
  assert.equal(A.mapLiveSky(0, 34, 4), "heat");
  assert.equal(A.mapLiveSky(0, 18, 4), "clear");
  const live = A.parseForecast({
    current: { temperature_2m: 11.2, weather_code: 61, wind_speed_10m: 8 },
    daily: { time: ["2026-08-27"], weather_code: [61], temperature_2m_max: [14], temperature_2m_min: [8] },
  });
  assert.equal(live?.sky, "rain");
  assert.equal(live?.source, "open-meteo");
  assert.equal(Overlay.mapLiveSky(61, 12, 4), "rain");
  assert.equal(Overlay.plateLine(Overlay.blankAreas(), null), "no area set");
});

test("favorites star places and persist", () => {
  let house = A.addArea(A.blankAreas(), { name: "Portland", query: "Portland", lat: 45.5, lon: -122.6 });
  house = A.addArea(house, { name: "Oslo", query: "Oslo", lat: 59.9, lon: 10.7 });
  assert.equal(house.tab, "current");
  assert.deepEqual(house.favoriteIds, []);
  const portland = house.areas[0].id;
  const oslo = house.areas[1].id;
  house = A.toggleFavorite(house, portland);
  assert.deepEqual(house.favoriteIds, [portland]);
  assert.equal(A.isFavorite(house, portland), true);
  assert.equal(A.isFavorite(house, oslo), false);
  house = A.pickTab(house, "favorites");
  assert.equal(house.tab, "favorites");
  assert.equal(A.favoriteAreas(house).map((a) => a.name).join(","), "Portland");
  assert.equal(A.FAVORITES_EMPTY, "No favorites yet — star a place.");
  assert.deepEqual(A.WEATHER_TABS, ["current", "favorites"]);
  const patch = A.toCardPatch(house);
  assert.equal(patch.weatherTab, "favorites");
  assert.deepEqual(patch.favoriteAreaIds, [portland]);
  const round = A.parseAreas(patch);
  assert.equal(round.tab, "favorites");
  assert.deepEqual(round.favoriteIds, [portland]);
  house = A.pickArea(house, oslo);
  assert.equal(house.tab, "current");
  assert.equal(A.currentArea(house)?.name, "Oslo");
  house = A.toggleFavorite(house, portland);
  assert.deepEqual(house.favoriteIds, []);
  house = A.toggleFavorite(house, oslo);
  house = A.removeArea(house, oslo);
  assert.deepEqual(house.favoriteIds, []);
  assert.equal(Overlay.FAVORITES_EMPTY, A.FAVORITES_EMPTY);
  assert.equal(Overlay.toggleFavorite(Overlay.blankAreas(), "x").favoriteIds.length, 0);
});
