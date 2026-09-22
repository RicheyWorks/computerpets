import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const A = await import(join(root, "src/lib/pets/weather-areas.ts"));
const Card = await import(join(root, "src/lib/pets/card.ts"));
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
  assert.equal(A.HERE_SEND, "this click sends a place to the forecast host.");
  assert.equal(A.HERE_ASK, "send a place from this computer? a saved browser grant can answer without a new prompt. this house cannot revoke that grant.");
  assert.equal(A.HERE_YES, "Send the place");
  assert.equal(A.HERE_NO, "Don't send");
  assert.equal(A.HERE_HELD, "the place was not sent");
  assert.equal(A.HERE_KEPT, "keeping the saved place");
  assert.equal(A.HERE_SENT, "a place was sent to the forecast host");
  assert.equal(Overlay.HERE_SEND, A.HERE_SEND);
  assert.equal(Overlay.HERE_ASK, A.HERE_ASK);
  assert.equal(Overlay.HERE_YES, A.HERE_YES);
  assert.equal(Overlay.HERE_NO, A.HERE_NO);
  assert.equal(Overlay.HERE_HELD, A.HERE_HELD);
  assert.equal(Overlay.HERE_KEPT, A.HERE_KEPT);
  assert.equal(Overlay.PLACE_STEP, 0.1);
  assert.deepEqual(A.sharePlace(47.60621, -122.33207), { lat: 47.6, lon: -122.3 });
  assert.deepEqual(Overlay.sharePlace(47.60621, -122.33207), A.sharePlace(47.60621, -122.33207));
  assert.deepEqual(A.sharePlace(-33.8688, 151.2093), { lat: -33.9, lon: 151.2 });
  assert.equal(A.sharePlace(91, 0), null);
  const reverse = A.reverseUrl(47.60621, -122.33207);
  assert.match(reverse, /latitude=47\.6&longitude=-122\.3/);
  assert.doesNotMatch(reverse, /47\.606|122\.332/);
  const forecast = A.forecastUrl(37.7749, -122.4194);
  assert.match(forecast, /latitude=37\.8&longitude=-122\.4/);
  assert.doesNotMatch(forecast, /37\.7749|122\.4194/);
  assert.equal(Overlay.forecastUrl(37.7749, -122.4194), forecast);
  const typed = A.addArea(A.blankAreas(), { name: "Portland", query: "Portland", lat: 45.52, lon: -122.67 });
  assert.equal(A.locateChoice(typed).locate, false);
  assert.equal(A.locateChoice(typed).area?.name, "Portland");
  const hereOnly = A.addArea(A.blankAreas(), { id: "here", name: "This computer", query: "this computer", lat: 47.606, lon: -122.332 });
  assert.equal(A.locateChoice(hereOnly).locate, true);
  assert.equal(A.locateChoice(A.blankAreas()).locate, true);
  const both = A.pickArea(
    A.addArea(typed, { id: "here", name: "This computer", query: "this computer", lat: 47.6, lon: -122.3 }),
    "here",
  );
  assert.equal(A.currentArea(both)?.id, "here");
  assert.equal(A.locateChoice(both).locate, false);
  assert.equal(A.locateChoice(both).area?.name, "Portland");
  assert.equal(Overlay.locateChoice(both).locate, false);
  assert.equal(A.locateGate(typed, true).act, "keep");
  assert.equal(A.locateGate(hereOnly, false).act, "ask");
  assert.equal(A.locateGate(hereOnly, "yes").act, "ask");
  assert.equal(A.locateGate(A.blankAreas(), false).act, "ask");
  assert.equal(A.locateGate(A.blankAreas(), true).act, "locate");
  assert.equal(A.locateGate(both, true).act, "keep");
  assert.equal(Overlay.locateGate(A.blankAreas(), false).act, "ask");
  assert.equal(Overlay.locateGate(A.blankAreas(), true).act, "locate");
  assert.equal(Overlay.locateGate(typed, true).act, "keep");
  assert.equal(A.SAVED_HERE_ASK, "use this saved computer place for the forecast? this sends the saved place. it does not locate again.");
  assert.equal(A.SAVED_HERE_YES, "Use this saved place");
  assert.equal(A.SAVED_HERE_NO, "Don't send");
  assert.equal(A.SAVED_HERE_HELD, "the saved place was not sent");
  assert.equal(A.SAVED_HERE_SENT, "the saved place was sent to the forecast host");
  assert.equal(A.SAVED_HERE_WAIT, "saved place not sent");
  assert.equal(Overlay.SAVED_HERE_ASK, A.SAVED_HERE_ASK);
  assert.equal(Overlay.SAVED_HERE_YES, A.SAVED_HERE_YES);
  assert.equal(Overlay.SAVED_HERE_HELD, A.SAVED_HERE_HELD);
  const savedHere = A.addArea(A.blankAreas(), { id: "here", name: "This computer", query: "this computer", lat: 47.6, lon: -122.3 });
  assert.equal(A.forecastGate(savedHere, null).act, "hold");
  assert.equal(A.forecastGate(savedHere, null).locate, false);
  assert.equal(A.forecastGate(savedHere, { lat: 47.606, lon: -122.332 }).act, "hold");
  assert.equal(A.hereForecastAckOf({ lat: 47.606, lon: -122.332 }), null);
  const savedAck = A.ackSavedHere(savedHere);
  assert.deepEqual(savedAck, { lat: 47.6, lon: -122.3 });
  assert.equal(A.forecastGate(savedHere, savedAck).act, "send");
  assert.equal(A.forecastGate(savedHere, savedAck).locate, false);
  assert.deepEqual(A.forecastGate(savedHere, savedAck).ack, savedAck);
  assert.equal(A.forecastGate(savedHere, savedAck).act, "send");
  assert.equal(Overlay.forecastGate(savedHere, null).act, "hold");
  assert.equal(Overlay.forecastGate(savedHere, savedAck).act, "send");
  assert.equal(Overlay.forecastGate(savedHere, savedAck).locate, false);
  assert.equal(A.forecastGate(typed, null).act, "send");
  assert.equal(A.forecastGate(typed, savedAck).ack, null);
  assert.equal(A.forecastGate(typed, null).locate, false);
  assert.equal(A.stickHereForecastAck(typed, savedAck), null);
  const savedBack = A.pickArea(
    A.addArea(typed, { id: "here", name: "This computer", query: "this computer", lat: 47.6, lon: -122.3 }),
    "here",
  );
  assert.equal(A.forecastGate(savedBack, null).act, "hold");
  assert.equal(A.stickHereForecastAck(A.pickArea(savedBack, typed.areas[0].id), savedAck), null);
  assert.equal(A.forecastGate(A.pickArea(savedBack, typed.areas[0].id), null).act, "send");
  assert.deepEqual(A.stickHereForecastAck(savedHere, savedAck), savedAck);
  assert.equal(A.stickHereForecastAck(A.removeArea(savedHere, "here"), savedAck), null);
  assert.equal(A.ackSavedHere(typed), null);
  assert.equal(A.plateLine(savedHere, null, false, true), "This computer · saved place not sent");
  assert.equal(A.plateLine(typed, null, false, false), "Portland · looking up");
  assert.equal(Overlay.plateLine(savedHere, null, false, true), A.plateLine(savedHere, null, false, true));
  const preciseHere = {
    weatherAreas: [{ id: "here", name: "This computer", query: "this computer", lat: 47.60621, lon: -122.33207 }],
    currentAreaId: "here",
  };
  assert.equal(A.storedLivePinNeedsFuzz(preciseHere), true);
  assert.equal(Overlay.storedLivePinNeedsFuzz(preciseHere), true);
  const fuzzed = A.parseAreas(preciseHere);
  assert.equal(fuzzed.areas[0].id, "here");
  assert.equal(fuzzed.areas[0].query, "this computer");
  assert.deepEqual({ lat: fuzzed.areas[0].lat, lon: fuzzed.areas[0].lon }, { lat: 47.6, lon: -122.3 });
  assert.deepEqual(
    { lat: Overlay.parseAreas(preciseHere).areas[0].lat, lon: Overlay.parseAreas(preciseHere).areas[0].lon },
    { lat: 47.6, lon: -122.3 },
  );
  assert.equal(A.storedLivePinNeedsFuzz(A.toCardPatch(fuzzed)), false);
  const queryHere = {
    areas: [{ id: "a-old", name: "This computer", query: "this computer", lat: 40.7128, lon: -74.006 }],
  };
  assert.equal(A.storedLivePinNeedsFuzz(queryHere), true);
  assert.deepEqual(
    { lat: A.parseAreas(queryHere).areas[0].lat, lon: A.parseAreas(queryHere).areas[0].lon },
    { lat: 40.7, lon: -74 },
  );
  const typedPrecise = {
    weatherAreas: [{ id: "a-pdx", name: "Portland", query: "Portland", lat: 45.5231, lon: -122.6765 }],
    currentAreaId: "a-pdx",
  };
  assert.equal(A.storedLivePinNeedsFuzz(typedPrecise), false);
  assert.equal(A.parseAreas(typedPrecise).areas[0].lat, 45.5231);
  assert.equal(A.parseAreas(typedPrecise).areas[0].lon, -122.6765);
  assert.equal(A.storedLivePinNeedsFuzz({ weatherAreas: [{ id: "here", name: "This computer", query: "this computer", lat: 47.6, lon: -122.3 }] }), false);
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

test("loading the desk card rounds a stored live pin and keeps a typed place", () => {
  const mem = {};
  const prev = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem(k) {
        return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
      },
      setItem(k, v) {
        mem[k] = String(v);
      },
    },
  };
  mem[Card.CARD_STORE] = JSON.stringify({
    weatherAreas: [{ id: "here", name: "This computer", query: "this computer", lat: 47.60621, lon: -122.33207 }],
    currentAreaId: "here",
  });
  const card = Card.loadCard();
  assert.equal(card.weatherAreas[0].lat, 47.6);
  assert.equal(card.weatherAreas[0].lon, -122.3);
  const saved = JSON.parse(mem[Card.CARD_STORE]);
  assert.equal(saved.weatherAreas[0].lat, 47.6);
  assert.equal(saved.weatherAreas[0].lon, -122.3);
  mem[Card.CARD_STORE] = JSON.stringify({
    weatherAreas: [{ id: "a-pdx", name: "Portland", query: "Portland", lat: 45.5231, lon: -122.6765 }],
    currentAreaId: "a-pdx",
  });
  const before = mem[Card.CARD_STORE];
  const typed = Card.loadCard();
  assert.equal(typed.weatherAreas[0].lat, 45.5231);
  assert.equal(mem[Card.CARD_STORE], before);
  mem[Card.CARD_STORE] = JSON.stringify({
    weatherAreas: [{ id: "here", name: "This computer", query: "this computer", lat: 47.6, lon: -122.3 }],
    currentAreaId: "here",
    hereForecastAck: { lat: 47.6, lon: -122.3 },
  });
  const acked = Card.loadCard();
  assert.deepEqual(acked.hereForecastAck, { lat: 47.6, lon: -122.3 });
  mem[Card.CARD_STORE] = JSON.stringify({
    weatherAreas: [{ id: "here", name: "This computer", query: "this computer", lat: 47.6, lon: -122.3 }],
    currentAreaId: "here",
    hereForecastAck: { lat: 47.60621, lon: -122.33207 },
  });
  const preciseAck = Card.loadCard();
  assert.equal(preciseAck.hereForecastAck, null);
  mem[Card.CARD_STORE] = JSON.stringify({
    weatherAreas: [
      { id: "here", name: "This computer", query: "this computer", lat: 47.6, lon: -122.3 },
      { id: "a-pdx", name: "Portland", query: "Portland", lat: 45.5, lon: -122.6 },
    ],
    currentAreaId: "a-pdx",
    hereForecastAck: { lat: 47.6, lon: -122.3 },
  });
  const moved = Card.loadCard();
  assert.equal(moved.currentAreaId, "a-pdx");
  assert.equal(moved.hereForecastAck, null);
  if (prev === undefined) delete globalThis.window;
  else globalThis.window = prev;
});
