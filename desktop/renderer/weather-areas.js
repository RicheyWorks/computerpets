/** Keeper-chosen weather areas. The house does not guess a city and does not ask an IP place service. A live fix is rounded before it leaves. A saved typed area is kept. A live locate waits for an in-app yes. A later locate in the session waits for a fresh yes. A stored live pin is rounded on load. A saved live pin does not forecast until the keeper says to use that place. A later forecast of that pin, or of a typed city, waits until the weather panel is open on the current place and the line says this computer's network address goes with the https request. */
(function (root) {
  const NO_AREA = "no area set";
  const AREA_LABEL = "Weather area";
  const AREA_PLACEHOLDER = "A city or place — weather, not radio";
  const AREA_TRUTH = "Weather area. Named places you add. Not the radio station.";
  const TYPE_A_CITY = "type a city";
  const HERE_FAIL = "this computer did not share a place";
  const HERE_SEND = "this click sends a place to the forecast host.";
  const HERE_ASK = "send a place from this computer? a prior browser allow can satisfy the next locate without a new os or browser prompt. the house still asks in the app. this house cannot revoke that grant.";
  const HERE_YES = "Send the place";
  const HERE_NO = "Don't send";
  const HERE_HELD = "the place was not sent";
  const HERE_KEPT = "keeping the saved place";
  const HERE_SENT = "a place was sent to the forecast host";
  // Any HTTPS client shows its network address to the host. This is not a city lookup.
  const FORECAST_NET = "this computer's network address goes with the https request, as any client.";
  const SAVED_HERE_ASK = `use this saved computer place for the forecast? this sends the saved place. ${FORECAST_NET} it does not locate again.`;
  const SAVED_HERE_YES = "Use this saved place";
  const SAVED_HERE_NO = "Don't send";
  const SAVED_HERE_HELD = "the saved place was not sent";
  const SAVED_HERE_SENT = "the saved place was sent to the forecast host";
  const SAVED_HERE_WAIT = "saved place not sent";
  const TYPED_FORECAST = `this forecast sends the named place. ${FORECAST_NET}`;
  const SAVED_FORECAST_CONTINUE = `this forecast continues the saved place you already allowed. ${FORECAST_NET} it does not locate again.`;
  const FORECAST_WAITS = "forecast waits";
  // A tenth of a degree is about 11 km. Rounding is not anonymity.
  const PLACE_STEP = 0.1;
  const CANT_REACH = "can't reach";
  const FAVORITES_EMPTY = "No favorites yet — star a place.";
  const GEOCODE_HOST = "geocoding-api.open-meteo.com";
  const FORECAST_HOST = "api.open-meteo.com";
  const MAX_AREAS = 8;
  const MAX_FAVORITES = 24;
  const AREA_NAME_CHARS = 48;
  const WEATHER_TABS = ["current", "favorites"];

  function blankAreas() {
    return { areas: [], currentId: null, tab: "current", favoriteIds: [] };
  }

  function clipName(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, AREA_NAME_CHARS);
  }

  function num(n) {
    const v = Number(n);
    return Number.isFinite(v) ? v : null;
  }

  function hash(text) {
    let n = 0;
    for (let i = 0; i < text.length; i++) n = (n * 31 + text.charCodeAt(i)) | 0;
    return Math.abs(n).toString(36);
  }

  function parseTab(raw) {
    return raw === "favorites" ? "favorites" : "current";
  }

  function parseArea(raw) {
    if (!raw || typeof raw !== "object") return null;
    const lat = num(raw.lat);
    const lon = num(raw.lon);
    if (lat == null || lon == null) return null;
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
    const query = clipName(raw.query || raw.name);
    const name = clipName(raw.name) || query;
    if (!name) return null;
    const id = typeof raw.id === "string" && raw.id ? raw.id : `a-${hash(`${name}|${lat}|${lon}`)}`;
    const area = { id, name, query: query || name, lat, lon };
    if (!isLiveFix(area)) return area;
    const place = sharePlace(lat, lon);
    if (!place) return area;
    area.lat = place.lat;
    area.lon = place.lon;
    return area;
  }

  function parseAreas(raw) {
    const next = blankAreas();
    if (!raw || typeof raw !== "object") return next;
    const list = Array.isArray(raw.weatherAreas) ? raw.weatherAreas : Array.isArray(raw.areas) ? raw.areas : [];
    next.areas = list.map(parseArea).filter(Boolean).slice(0, MAX_AREAS);
    const want = typeof raw.currentAreaId === "string" ? raw.currentAreaId : typeof raw.currentId === "string" ? raw.currentId : null;
    next.currentId = want && next.areas.some((a) => a.id === want) ? want : next.areas[0] ? next.areas[0].id : null;
    next.tab = parseTab(raw.weatherTab != null ? raw.weatherTab : raw.tab);
    const favRaw = Array.isArray(raw.favoriteAreaIds) ? raw.favoriteAreaIds : Array.isArray(raw.favoriteIds) ? raw.favoriteIds : [];
    const known = new Set(next.areas.map((a) => a.id));
    next.favoriteIds = favRaw.filter((x) => typeof x === "string" && x && known.has(x)).slice(0, MAX_FAVORITES);
    return next;
  }

  function toCardPatch(areas) {
    const house = areas && typeof areas === "object" && Array.isArray(areas.areas) ? areas : parseAreas(areas);
    return {
      weatherAreas: house.areas,
      currentAreaId: house.currentId,
      weatherTab: house.tab,
      favoriteAreaIds: house.favoriteIds,
    };
  }

  function currentArea(areas) {
    if (!areas || !areas.areas || !areas.areas.length) return null;
    return areas.areas.find((a) => a.id === areas.currentId) || areas.areas[0] || null;
  }

  function addArea(areas, area) {
    const house = parseAreas(areas);
    const next = parseArea(area);
    if (!next) return house;
    const exists = house.areas.findIndex((a) => a.id === next.id || (a.lat === next.lat && a.lon === next.lon));
    if (exists >= 0) house.areas[exists] = { ...house.areas[exists], ...next };
    else house.areas = house.areas.concat(next).slice(0, MAX_AREAS);
    if (!house.currentId) house.currentId = next.id;
    house.tab = "current";
    return house;
  }

  function removeArea(areas, id) {
    const house = parseAreas(areas);
    house.areas = house.areas.filter((a) => a.id !== id);
    house.favoriteIds = house.favoriteIds.filter((x) => x !== id);
    if (house.currentId === id) house.currentId = house.areas[0] ? house.areas[0].id : null;
    return house;
  }

  function pickArea(areas, id) {
    const house = parseAreas(areas);
    if (house.areas.some((a) => a.id === id)) {
      house.currentId = id;
      if (house.tab === "favorites") house.tab = "current";
    }
    return house;
  }

  function renameArea(areas, id, name) {
    const house = parseAreas(areas);
    const label = clipName(name);
    house.areas = house.areas.map((a) => (a.id === id && label ? { ...a, name: label } : a));
    return house;
  }

  function pickTab(areas, tab) {
    const house = parseAreas(areas);
    house.tab = parseTab(tab);
    return house;
  }

  function toggleFavorite(areas, id) {
    const house = parseAreas(areas);
    if (!house.areas.some((a) => a.id === id)) return house;
    if (house.favoriteIds.includes(id)) house.favoriteIds = house.favoriteIds.filter((x) => x !== id);
    else house.favoriteIds = house.favoriteIds.concat(id).slice(0, MAX_FAVORITES);
    return house;
  }

  function isFavorite(areas, id) {
    return parseAreas(areas).favoriteIds.includes(id);
  }

  function favoriteAreas(areas) {
    const house = parseAreas(areas);
    return house.favoriteIds.map((id) => house.areas.find((a) => a.id === id)).filter(Boolean);
  }

  function tabLabel(tab) {
    return parseTab(tab) === "favorites" ? "Favorites" : "Current";
  }

  function isLiveFix(area) {
    if (!area) return false;
    return area.id === "here" || area.query === "this computer";
  }

  /**
   * Round a fix to a place before it can leave. A tenth of a degree.
   * This is not anonymity. The forecast host still receives a place.
   */
  function sharePlace(lat, lon) {
    const la = num(lat);
    const lo = num(lon);
    if (la == null || lo == null) return null;
    if (la < -90 || la > 90 || lo < -180 || lo > 180) return null;
    const places = Math.round(1 / PLACE_STEP);
    const round = (v) => {
      const n = Number((Math.round(v * places) / places).toFixed(1));
      return Object.is(n, -0) ? 0 : n;
    };
    let latR = round(la);
    let lonR = round(lo);
    if (latR > 90) latR = 90;
    if (latR < -90) latR = -90;
    if (lonR > 180) lonR = 180;
    if (lonR < -180) lonR = -180;
    return { lat: latR, lon: lonR };
  }

  /** A place the keeper typed. A live "here" fix is not one. */
  function typedArea(areas) {
    const house = parseAreas(areas);
    const typed = house.areas.filter((a) => !isLiveFix(a));
    if (!typed.length) return null;
    return typed.find((a) => a.id === house.currentId) || typed[0];
  }

  /**
   * Prefer a saved typed area. Do not start a live locate when one is present.
   * A cached geolocation grant is not consulted on that path.
   */
  function locateChoice(areas) {
    const saved = typedArea(areas);
    if (saved) return { locate: false, area: saved };
    return { locate: true, area: null };
  }

  /**
   * A live locate needs a fresh in-app yes before geolocation is armed.
   * A saved typed area does not. A cached origin grant is not that yes.
   * confirmed must be the boolean true from the keeper's Send button.
   */
  function locateGate(areas, confirmed) {
    const choice = locateChoice(areas);
    if (!choice.locate) return { act: "keep", area: choice.area };
    if (confirmed === true) return { act: "locate", area: null };
    return { act: "ask", area: null };
  }

  /** A stored live pin still has digits finer than a tenth of a degree. */
  function storedLivePinNeedsFuzz(raw) {
    if (!raw || typeof raw !== "object") return false;
    const list = Array.isArray(raw.weatherAreas) ? raw.weatherAreas : Array.isArray(raw.areas) ? raw.areas : [];
    for (const row of list) {
      if (!row || typeof row !== "object") continue;
      const query = clipName(row.query || "");
      if (row.id !== "here" && query !== "this computer") continue;
      const lat = num(row.lat);
      const lon = num(row.lon);
      const place = sharePlace(lat, lon);
      if (!place) continue;
      if (place.lat !== lat || place.lon !== lon) return true;
    }
    return false;
  }

  function geocodeUrl(query) {
    const q = clipName(query);
    if (!q) return "";
    return `https://${GEOCODE_HOST}/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
  }

  function reverseUrl(lat, lon) {
    const place = sharePlace(lat, lon);
    if (!place) return "";
    return `https://${GEOCODE_HOST}/v1/reverse?latitude=${place.lat.toFixed(1)}&longitude=${place.lon.toFixed(1)}&language=en&format=json`;
  }

  function parseReverse(json) {
    const list = json && Array.isArray(json.results) ? json.results : json && json.name ? [json] : [];
    return parseGeocode({ results: list })[0] || null;
  }

  function forecastUrl(lat, lon) {
    const place = sharePlace(lat, lon);
    if (!place) return "";
    return `https://${FORECAST_HOST}/v1/forecast?latitude=${place.lat.toFixed(1)}&longitude=${place.lon.toFixed(1)}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto`;
  }

  function parseGeocode(json) {
    if (!json || typeof json !== "object" || !Array.isArray(json.results)) return [];
    const out = [];
    for (const row of json.results) {
      if (!row || typeof row !== "object") continue;
      const lat = num(row.latitude);
      const lon = num(row.longitude);
      const name = clipName(row.name);
      if (lat == null || lon == null || !name) continue;
      const bits = [name, clipName(row.admin1), clipName(row.country)].filter(Boolean);
      const label = bits.join(", ");
      out.push({
        id: `a-${hash(`${label}|${lat}|${lon}`)}`,
        name: label,
        query: name,
        lat,
        lon,
      });
    }
    return out;
  }

  function mapLiveSky(code, tempC, windKmh) {
    const wmo = Math.round(Number(code));
    const temp = num(tempC);
    const wind = num(windKmh);
    if (Number.isFinite(wmo)) {
      if (wmo >= 95 || (wmo >= 80 && wmo <= 82) || (wmo >= 51 && wmo <= 67) || (wmo >= 71 && wmo <= 77) || (wmo >= 85 && wmo <= 86)) {
        if (wind != null && wind >= 40) return "wind";
        return "rain";
      }
    }
    if (wind != null && wind >= 28) return "wind";
    if (temp != null && temp >= 32) return "heat";
    return "clear";
  }

  function skyLabel(sky, tempC) {
    const name = sky === "rain" ? "Rain" : sky === "wind" ? "Wind" : sky === "heat" ? "Heat" : "Clear";
    if (tempC == null || !Number.isFinite(tempC)) return name;
    return `${name} · ${Math.round(tempC)}°`;
  }

  function parseForecast(json) {
    if (!json || typeof json !== "object" || !json.current || typeof json.current !== "object") return null;
    const current = json.current;
    const tempC = num(current.temperature_2m);
    const windKmh = num(current.wind_speed_10m);
    const sky = mapLiveSky(current.weather_code, tempC, windKmh);
    const dailyRaw = json.daily && typeof json.daily === "object" ? json.daily : null;
    const days = [];
    if (dailyRaw && Array.isArray(dailyRaw.time)) {
      for (let i = 0; i < dailyRaw.time.length; i++) {
        const maxC = Array.isArray(dailyRaw.temperature_2m_max) ? num(dailyRaw.temperature_2m_max[i]) : null;
        const minC = Array.isArray(dailyRaw.temperature_2m_min) ? num(dailyRaw.temperature_2m_min[i]) : null;
        const dCode = Array.isArray(dailyRaw.weather_code) ? dailyRaw.weather_code[i] : null;
        days.push({ day: String(dailyRaw.time[i] || ""), sky: mapLiveSky(dCode, maxC, null), maxC, minC });
      }
    }
    return { sky, tempC, windKmh, label: skyLabel(sky, tempC), daily: days, source: "open-meteo" };
  }

  /**
   * A stored yes for one saved live pin. Digits must already be a tenth of a degree.
   * A precise ack is not kept. This is not a locate and not a browser grant.
   */
  function hereForecastAckOf(raw) {
    if (!raw || typeof raw !== "object") return null;
    const lat = num(raw.lat);
    const lon = num(raw.lon);
    if (lat == null || lon == null) return null;
    const place = sharePlace(lat, lon);
    if (!place) return null;
    if (place.lat !== lat || place.lon !== lon) return null;
    return { lat: place.lat, lon: place.lon };
  }

  /**
   * A typed city may go to the forecast host. A saved live pin does not,
   * until the keeper has acknowledged that exact place. The ack sticks for
   * that pin. It is not a geolocation arm and not a reverse lookup.
   * The same ack still allows a later forecast. That is not a new question.
   * The page calls forecastMaySend before the request, so a later read
   * waits until the weather panel is open. forecastHonesty names the
   * network address on that send. There is no forecast timer.
   */
  function forecastGate(areas, ack) {
    const area = currentArea(parseAreas(areas));
    if (!area) return { act: "none", area: null, ack: null, locate: false };
    if (!isLiveFix(area)) return { act: "send", area, ack: null, locate: false };
    const pin = sharePlace(area.lat, area.lon);
    const saved = hereForecastAckOf(ack);
    if (pin && saved && pin.lat === saved.lat && pin.lon === saved.lon) {
      return { act: "send", area, ack: saved, locate: false };
    }
    return { act: "hold", area, ack: null, locate: false };
  }

  /** The rounded place of the current live pin, for the keeper's forecast yes. */
  function ackSavedHere(areas) {
    const area = currentArea(parseAreas(areas));
    if (!area || !isLiveFix(area)) return null;
    return sharePlace(area.lat, area.lon);
  }

  /**
   * Keep an ack only while the current area is still that live pin.
   * Clearing the pin or picking another area drops it.
   */
  function stickHereForecastAck(areas, ack) {
    const gate = forecastGate(areas, ack);
    return gate.act === "send" && gate.ack ? gate.ack : null;
  }

  /**
   * The forecast host is called only while the keeper can see the honesty line.
   * A closed plate, a load, and the favorites tab are not that view.
   * This does not ask again and does not locate.
   */
  function forecastMaySend(gate, panelOpen) {
    return panelOpen === true && !!gate && gate.act === "send" && !!gate.area;
  }

  /** The line in the open weather panel for a typed city or an acknowledged pin. */
  function forecastHonesty(gate) {
    if (!gate || gate.act !== "send" || !gate.area) return "";
    return gate.ack ? SAVED_FORECAST_CONTINUE : TYPED_FORECAST;
  }

  function plateLine(areas, live, unread, held, waiting) {
    const area = currentArea(areas);
    if (!area) return NO_AREA;
    if (held) return `${area.name} · ${SAVED_HERE_WAIT}`;
    if (unread) return `${area.name} · unread`;
    if (!live) return waiting ? `${area.name} · ${FORECAST_WAITS}` : `${area.name} · looking up`;
    return `${area.name} · ${live.label}`;
  }

  const api = {
    NO_AREA,
    AREA_LABEL,
    AREA_PLACEHOLDER,
    AREA_TRUTH,
    TYPE_A_CITY,
    HERE_FAIL,
    HERE_SEND,
    HERE_ASK,
    HERE_YES,
    HERE_NO,
    HERE_HELD,
    HERE_KEPT,
    HERE_SENT,
    FORECAST_NET,
    SAVED_HERE_ASK,
    SAVED_HERE_YES,
    SAVED_HERE_NO,
    SAVED_HERE_HELD,
    SAVED_HERE_SENT,
    SAVED_HERE_WAIT,
    TYPED_FORECAST,
    SAVED_FORECAST_CONTINUE,
    FORECAST_WAITS,
    PLACE_STEP,
    CANT_REACH,
    FAVORITES_EMPTY,
    GEOCODE_HOST,
    FORECAST_HOST,
    MAX_AREAS,
    MAX_FAVORITES,
    WEATHER_TABS,
    blankAreas,
    parseArea,
    parseAreas,
    toCardPatch,
    currentArea,
    addArea,
    removeArea,
    pickArea,
    renameArea,
    pickTab,
    toggleFavorite,
    isFavorite,
    favoriteAreas,
    tabLabel,
    geocodeUrl,
    sharePlace,
    typedArea,
    locateChoice,
    locateGate,
    hereForecastAckOf,
    forecastGate,
    forecastMaySend,
    forecastHonesty,
    ackSavedHere,
    stickHereForecastAck,
    storedLivePinNeedsFuzz,
    reverseUrl,
    parseReverse,
    forecastUrl,
    parseGeocode,
    mapLiveSky,
    skyLabel,
    parseForecast,
    plateLine,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetWeatherAreas = api;
})(typeof window !== "undefined" ? window : globalThis);
