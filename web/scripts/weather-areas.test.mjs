import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const A = await import(pathToFileURL(join(root, "src/lib/pets/weather-areas.ts")).href);
const Card = await import(pathToFileURL(join(root, "src/lib/pets/card.ts")).href);
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/weather-areas.js"));

test("the house does not guess a city", () => {
  assert.equal(A.NO_AREA, "no place yet");
  assert.equal(A.AREA_LABEL, "Weather area");
  assert.equal(Overlay.AREA_LABEL, A.AREA_LABEL);
  assert.equal(A.plateLine(A.blankAreas(), null), "no place yet");
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
  assert.equal(A.HERE_SEND, "Pressing this sends a place to Open-Meteo, a weather website.");
  assert.equal(A.HERE_ASK, "Send where this computer is? If you said yes to your browser or computer before, it may not ask again, but this app still asks you first. This app can't take back a yes you gave your browser or computer. You can change that in its settings.");
  assert.equal(A.HERE_YES, "Send the place");
  assert.equal(A.HERE_NO, "Don't send");
  assert.equal(A.HERE_HELD, "the place was not sent");
  assert.equal(A.HERE_KEPT, "keeping the saved place");
  assert.equal(A.HERE_SENT, "a place was sent to Open-Meteo");
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
  assert.equal(A.FORECAST_NET, "This computer's internet address also goes to Open-Meteo, like visiting any website.");
  assert.equal(A.plainNetLine(A.WEATHER_SITE), A.FORECAST_NET);
  assert.equal(Overlay.plainNetLine(Overlay.WEATHER_SITE), A.FORECAST_NET);
  assert.equal(Overlay.FORECAST_NET, A.FORECAST_NET);
  assert.equal(A.plainNetLine(""), "");
  assert.equal(A.plainNetLine("CoinGecko and GeckoTerminal"), "This computer's internet address also goes to CoinGecko and GeckoTerminal, like visiting any website.");
  // clientNetLine stays for radio (Rui's music block), cloud talk, license, and STUN.
  assert.equal(
    A.clientNetLine("the radio host"),
    "this computer's network address goes with the https request to the radio host, as any client.",
  );
  assert.equal(Overlay.clientNetLine("the radio host"), A.clientNetLine("the radio host"));
  assert.equal(A.GEOCODE_NET, A.plainNetLine("Open-Meteo"));
  assert.equal(Overlay.GEOCODE_NET, A.GEOCODE_NET);
  assert.equal(A.GEOCODE_LOOK, `This asks Open-Meteo, a weather website, to find the place you typed. It sends what you typed. ${A.GEOCODE_NET}`);
  assert.equal(A.GEOCODE_REVERSE, `This asks Open-Meteo, a weather website, for the name of the place you sent. It sends that place, rounded to about 11 km. ${A.GEOCODE_NET}`);
  assert.equal(Overlay.GEOCODE_LOOK, A.GEOCODE_LOOK);
  assert.equal(Overlay.GEOCODE_REVERSE, A.GEOCODE_REVERSE);
  assert.ok(A.GEOCODE_LOOK.includes(A.GEOCODE_NET));
  assert.ok(A.GEOCODE_REVERSE.includes(A.GEOCODE_NET));
  assert.equal(A.geocodeHonesty("look"), A.GEOCODE_LOOK);
  assert.equal(A.geocodeHonesty("reverse"), A.GEOCODE_REVERSE);
  assert.equal(A.geocodeHonesty("ip"), "");
  assert.equal(A.geocodeHonesty(""), "");
  assert.equal(Overlay.geocodeHonesty("look"), A.GEOCODE_LOOK);
  assert.equal(Overlay.geocodeHonesty("reverse"), A.GEOCODE_REVERSE);
  assert.equal(A.geocodeMaySend("look", false), false);
  assert.equal(A.geocodeMaySend("look", true), true);
  assert.equal(A.geocodeMaySend("reverse", false), false);
  assert.equal(A.geocodeMaySend("reverse", true), true);
  assert.equal(A.geocodeMaySend("ip", true), false);
  assert.equal(A.geocodeMaySend("look", "yes"), false);
  assert.equal(Overlay.geocodeMaySend("look", false), false);
  assert.equal(Overlay.geocodeMaySend("reverse", true), true);
  assert.equal(Overlay.geocodeMaySend("ip", true), false);
  assert.equal(
    A.SAVED_HERE_ASK,
    "Use the place this computer saved for the forecast? This sends the saved place to Open-Meteo, a weather website. This computer's internet address also goes to Open-Meteo, like visiting any website. It does not find where you are again.",
  );
  assert.ok(A.SAVED_HERE_ASK.includes(A.FORECAST_NET));
  assert.equal(A.TYPED_FORECAST, `This asks Open-Meteo, a weather website, for your forecast. It sends the place you picked. ${A.FORECAST_NET}`);
  assert.equal(
    A.SAVED_FORECAST_CONTINUE,
    `This asks Open-Meteo, a weather website, for the forecast at the saved place you already said yes to. It sends that saved place. ${A.FORECAST_NET} It does not find where you are again.`,
  );
  assert.equal(Overlay.TYPED_FORECAST, A.TYPED_FORECAST);
  assert.equal(Overlay.SAVED_FORECAST_CONTINUE, A.SAVED_FORECAST_CONTINUE);
  assert.equal(A.FORECAST_WAITS, "forecast waits");
  assert.equal(A.SAVED_HERE_YES, "Use this saved place");
  assert.equal(A.SAVED_HERE_NO, "Don't send");
  assert.equal(A.SAVED_HERE_HELD, "the saved place was not sent");
  assert.equal(A.SAVED_HERE_SENT, "the saved place was sent to Open-Meteo");
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
  assert.equal(A.forecastHonesty(A.forecastGate(typed, null)), A.TYPED_FORECAST);
  assert.equal(A.forecastHonesty(A.forecastGate(savedHere, savedAck)), A.SAVED_FORECAST_CONTINUE);
  assert.equal(A.forecastHonesty(A.forecastGate(savedHere, null)), "");
  assert.equal(A.forecastMaySend(A.forecastGate(typed, null), false), false);
  assert.equal(A.forecastMaySend(A.forecastGate(typed, null), true), true);
  assert.equal(A.forecastMaySend(A.forecastGate(savedHere, savedAck), false), false);
  assert.equal(A.forecastMaySend(A.forecastGate(savedHere, savedAck), true), true);
  assert.equal(A.forecastMaySend(A.forecastGate(savedHere, null), true), false);
  assert.equal(Overlay.forecastMaySend(A.forecastGate(typed, null), false), false);
  assert.equal(Overlay.forecastHonesty(Overlay.forecastGate(savedHere, savedAck)), A.SAVED_FORECAST_CONTINUE);
  assert.equal(A.plateLine(savedHere, null, false, true), "This computer · saved place not sent");
  assert.equal(A.plateLine(typed, null, false, false), "Portland · looking up");
  assert.equal(A.plateLine(typed, null, false, false, true), "Portland · forecast waits");
  assert.equal(Overlay.plateLine(typed, null, false, false, true), "Portland · forecast waits");
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
  const html = readFileSync(join(root, "../desktop/renderer/index.html"), "utf8");
  const plates = readFileSync(join(root, "src/components/desk/desk-plates.tsx"), "utf8");
  assert.ok(html.includes('id="weather-geocode-net"'));
  assert.ok(html.includes('id="weather-reverse-net"'));
  assert.ok(html.includes(A.GEOCODE_LOOK));
  assert.ok(html.includes(A.GEOCODE_REVERSE));
  assert.ok(plates.includes('id="weather-geocode-net"'));
  assert.ok(plates.includes('id="weather-reverse-net"'));
  assert.ok(plates.includes('geocodeHonesty("look")'));
  assert.ok(plates.includes('geocodeHonesty("reverse")'));
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
  assert.equal(Overlay.plateLine(Overlay.blankAreas(), null), "no place yet");
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

test("forecast and geocode refuse a fetch until the painted host line is present", async () => {
  const typed = A.TYPED_FORECAST;
  const saved = A.SAVED_FORECAST_CONTINUE;
  const look = A.GEOCODE_LOOK;
  const reverse = A.GEOCODE_REVERSE;
  assert.equal(typed, Overlay.TYPED_FORECAST);
  assert.equal(look, Overlay.GEOCODE_LOOK);
  assert.match(typed, /like visiting any website/);
  assert.match(look, /goes to Open-Meteo/);
  assert.match(reverse, /goes to Open-Meteo/);
  assert.equal(A.forecastMayLeave(""), false);
  assert.equal(A.forecastMayLeave(A.FORECAST_NET), false);
  assert.equal(A.forecastMayLeave(A.SAVED_HERE_ASK), false);
  assert.equal(A.forecastMayLeave(look), false);
  assert.equal(A.forecastMayLeave(typed), true);
  assert.equal(A.forecastMayLeave(saved), true);
  assert.equal(Overlay.forecastMayLeave(""), false);
  assert.equal(Overlay.forecastMayLeave(A.SAVED_HERE_ASK), false);
  assert.equal(Overlay.forecastMayLeave(look), false);
  assert.equal(Overlay.forecastMayLeave(typed), true);
  assert.equal(Overlay.forecastMayLeave(saved), true);
  assert.equal(A.geocodeLookMayLeave(""), false);
  assert.equal(A.geocodeLookMayLeave(A.GEOCODE_NET), false);
  assert.equal(A.geocodeLookMayLeave(reverse), false);
  assert.equal(A.geocodeLookMayLeave(typed), false);
  assert.equal(A.geocodeLookMayLeave(look), true);
  assert.equal(Overlay.geocodeLookMayLeave(""), false);
  assert.equal(Overlay.geocodeLookMayLeave(reverse), false);
  assert.equal(Overlay.geocodeLookMayLeave(look), true);
  assert.equal(A.geocodeReverseMayLeave(""), false);
  assert.equal(A.geocodeReverseMayLeave(look), false);
  assert.equal(A.geocodeReverseMayLeave(typed), false);
  assert.equal(A.geocodeReverseMayLeave(reverse), true);
  assert.equal(Overlay.geocodeReverseMayLeave(""), false);
  assert.equal(Overlay.geocodeReverseMayLeave(look), false);
  assert.equal(Overlay.geocodeReverseMayLeave(reverse), true);
  let calls = 0;
  const fake = async (url) => {
    calls += 1;
    return { json: async () => ({ url, current: { temperature_2m: 1, weather_code: 0, wind_speed_10m: 1 } }) };
  };
  const forecast = A.forecastUrl(47.6, -122.3);
  const geo = A.geocodeUrl("Oslo");
  const rev = A.reverseUrl(47.6, -122.3);
  assert.equal(await A.readForecast("", forecast, fake), null);
  assert.equal(await A.readForecast(A.SAVED_HERE_ASK, forecast, fake), null);
  assert.equal(await A.readForecast(look, forecast, fake), null);
  assert.equal(await A.readForecast(typed, "", fake), null);
  assert.equal(await Overlay.readForecast("", forecast, fake), null);
  assert.equal(await Overlay.readForecast(look, forecast, fake), null);
  assert.equal(await A.readGeocode("", geo, fake), null);
  assert.equal(await A.readGeocode(reverse, geo, fake), null);
  assert.equal(await A.readGeocode(typed, geo, fake), null);
  assert.equal(await A.readGeocode(look, "", fake), null);
  assert.equal(await Overlay.readGeocode("", geo, fake), null);
  assert.equal(await Overlay.readGeocode(reverse, geo, fake), null);
  assert.equal(await A.readReverse("", rev, fake), null);
  assert.equal(await A.readReverse(look, rev, fake), null);
  assert.equal(await A.readReverse(typed, rev, fake), null);
  assert.equal(await Overlay.readReverse("", rev, fake), null);
  assert.equal(await Overlay.readReverse(look, rev, fake), null);
  assert.equal(calls, 0);
  const sent = await A.readForecast(typed, forecast, fake);
  assert.match(String(sent.url), /api\.open-meteo\.com/);
  assert.equal(calls, 1);
  const savedSent = await Overlay.readForecast(saved, forecast, fake);
  assert.match(String(savedSent.url), /api\.open-meteo\.com/);
  assert.equal(calls, 2);
  const looked = await A.readGeocode(look, geo, fake);
  assert.match(String(looked.url), /geocoding-api\.open-meteo\.com\/v1\/search/);
  assert.equal(calls, 3);
  const lookedOver = await Overlay.readGeocode(look, geo, fake);
  assert.match(String(lookedOver.url), /geocoding-api\.open-meteo\.com/);
  assert.equal(calls, 4);
  const reversed = await A.readReverse(reverse, rev, fake);
  assert.match(String(reversed.url), /geocoding-api\.open-meteo\.com\/v1\/reverse/);
  assert.equal(calls, 5);
  const reversedOver = await Overlay.readReverse(reverse, rev, fake);
  assert.match(String(reversedOver.url), /\/v1\/reverse/);
  assert.equal(calls, 6);
});

test("forecast and geocode time out and deny a silent host", async () => {
  assert.equal(A.WEATHER_TIMEOUT_MS, 12_000);
  assert.equal(Overlay.WEATHER_TIMEOUT_MS, 12_000);
  assert.equal(A.WeatherTimeout.name, "WeatherTimeout");
  assert.equal(Overlay.WeatherTimeout.name, "WeatherTimeout");
  const typed = A.TYPED_FORECAST;
  const look = A.GEOCODE_LOOK;
  const reverse = A.GEOCODE_REVERSE;
  const forecast = A.forecastUrl(47.6, -122.3);
  const geo = A.geocodeUrl("Oslo");
  const rev = A.reverseUrl(47.6, -122.3);
  const hang = () => new Promise(() => {});
  const calls = [];
  await assert.rejects(
    () => A.readForecast(typed, forecast, (url) => (calls.push(url), hang()), 30),
    (err) => err instanceof A.WeatherTimeout && err.name === "WeatherTimeout",
  );
  await assert.rejects(
    () => Overlay.readForecast(typed, forecast, (url) => (calls.push(url), hang()), 30),
    (err) => err instanceof Overlay.WeatherTimeout && err.name === "WeatherTimeout",
  );
  await assert.rejects(
    () => A.readGeocode(look, geo, () => hang(), 30),
    (err) => err instanceof A.WeatherTimeout,
  );
  await assert.rejects(
    () => Overlay.readGeocode(look, geo, () => hang(), 30),
    (err) => err instanceof Overlay.WeatherTimeout,
  );
  await assert.rejects(
    () => A.readReverse(reverse, rev, () => hang(), 30),
    (err) => err instanceof A.WeatherTimeout,
  );
  await assert.rejects(
    () => Overlay.readReverse(reverse, rev, () => hang(), 30),
    (err) => err instanceof Overlay.WeatherTimeout,
  );
  assert.deepEqual(calls, [forecast, forecast]);

  let fulfilled = null;
  const late = A.readForecast(
    typed,
    forecast,
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            json: async () => ({ current: { temperature_2m: 99, weather_code: 0, wind_speed_10m: 1 } }),
          });
        }, 80);
      }),
    20,
  ).then(
    (body) => {
      fulfilled = body;
      return body;
    },
    (err) => {
      fulfilled = err;
      throw err;
    },
  );
  await assert.rejects(() => late, (err) => err instanceof A.WeatherTimeout);
  await new Promise((r) => setTimeout(r, 120));
  assert.ok(fulfilled instanceof A.WeatherTimeout);
  assert.equal(fulfilled.name, "WeatherTimeout");

  const answered = await A.readForecast(typed, forecast, async () => ({
    json: async () => ({ current: { temperature_2m: 3, weather_code: 0, wind_speed_10m: 2 } }),
  }), 200);
  assert.equal(answered.current.temperature_2m, 3);
  assert.equal(A.parseForecast(answered).tempC, 3);
});

const WMO_PINS = [
  [0, "Clear"],
  [1, "Mostly clear"],
  [2, "Partly cloudy"],
  [3, "Overcast"],
  [45, "Fog"],
  [61, "Rain"],
  [71, "Snow"],
  [95, "Thunderstorm"],
];

test("the forecast says the WMO code in words; overcast is not clear (web and overlay)", () => {
  for (const surface of [A, Overlay]) {
    for (const [code, word] of WMO_PINS) {
      assert.equal(surface.skyWord(code), word, `WMO ${code}`);
      const live = surface.parseForecast({
        current: { temperature_2m: 8.4, weather_code: code, wind_speed_10m: 5 },
        daily: { time: ["2026-09-27"], weather_code: [code], temperature_2m_max: [16.5], temperature_2m_min: [8] },
      });
      assert.equal(live.word, word);
      assert.equal(live.label, `${word} · 8°`);
      assert.equal(live.daily[0].word, word);
      assert.equal(surface.dayLabel(live.daily[0]), word.toLowerCase());
    }
    // The four art skies are unchanged: overcast and fog stay calm, snow and storms stay wet.
    assert.equal(surface.mapLiveSky(3, 8, 5), "clear");
    assert.equal(surface.mapLiveSky(45, 8, 5), "clear");
    assert.equal(surface.mapLiveSky(71, 0, 5), "rain");
    assert.equal(surface.mapLiveSky(95, 20, 5), "rain");
    // Wind and heat are added after the word.
    assert.equal(surface.parseForecast({ current: { temperature_2m: 8, weather_code: 3, wind_speed_10m: 30 } }).label, "Overcast, windy · 8°");
    assert.equal(surface.parseForecast({ current: { temperature_2m: 35, weather_code: 0, wind_speed_10m: 2 } }).label, "Clear, hot · 35°");
    // No code or an unknown code is not "Clear".
    assert.equal(surface.parseForecast({ current: { temperature_2m: 8, wind_speed_10m: 2 } }).label, "Sky not known · 8°");
    assert.equal(surface.parseForecast({ current: { temperature_2m: 8, weather_code: 42, wind_speed_10m: 2 } }).label, "Sky not known · 8°");
    assert.equal(surface.skyWord(null), "");
    assert.equal(surface.skyWord(""), "");
    assert.equal(surface.skyWord(3.5), "");
    // The house sky (no forecast word) keeps its four names.
    assert.equal(surface.skyLabel("clear", 12), "Clear · 12°");
    assert.equal(surface.skyLabel("rain", null), "Rain");
  }
  assert.deepEqual({ ...Overlay.WMO_WORDS }, { ...A.WMO_WORDS });
  const plates = readFileSync(join(root, "src/components/desk/desk-plates.tsx"), "utf8");
  assert.ok(plates.includes("dayLabel(d)"));
  assert.ok(!plates.includes("{d.day} · {d.sky}"));
});
