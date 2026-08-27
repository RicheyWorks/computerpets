/** Keeper-chosen weather areas. The house does not guess a city. */
(function (root) {
  const NO_AREA = "no area set";
  const AREA_LABEL = "Weather area";
  const AREA_PLACEHOLDER = "A city or place — weather, not radio";
  const AREA_TRUTH = "Weather area. Named places you add. Not the radio station.";
  const GEOCODE_HOST = "geocoding-api.open-meteo.com";
  const FORECAST_HOST = "api.open-meteo.com";
  const MAX_AREAS = 8;
  const AREA_NAME_CHARS = 48;

  function blankAreas() {
    return { areas: [], currentId: null };
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
    return { id, name, query: query || name, lat, lon };
  }

  function parseAreas(raw) {
    const next = blankAreas();
    if (!raw || typeof raw !== "object") return next;
    const list = Array.isArray(raw.weatherAreas) ? raw.weatherAreas : Array.isArray(raw.areas) ? raw.areas : [];
    next.areas = list.map(parseArea).filter(Boolean).slice(0, MAX_AREAS);
    const want = typeof raw.currentAreaId === "string" ? raw.currentAreaId : typeof raw.currentId === "string" ? raw.currentId : null;
    next.currentId = want && next.areas.some((a) => a.id === want) ? want : next.areas[0] ? next.areas[0].id : null;
    return next;
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
    return house;
  }

  function removeArea(areas, id) {
    const house = parseAreas(areas);
    house.areas = house.areas.filter((a) => a.id !== id);
    if (house.currentId === id) house.currentId = house.areas[0] ? house.areas[0].id : null;
    return house;
  }

  function pickArea(areas, id) {
    const house = parseAreas(areas);
    if (house.areas.some((a) => a.id === id)) house.currentId = id;
    return house;
  }

  function renameArea(areas, id, name) {
    const house = parseAreas(areas);
    const label = clipName(name);
    house.areas = house.areas.map((a) => (a.id === id && label ? { ...a, name: label } : a));
    return house;
  }

  function geocodeUrl(query) {
    const q = clipName(query);
    if (!q) return "";
    return `https://${GEOCODE_HOST}/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
  }

  function forecastUrl(lat, lon) {
    const la = num(lat);
    const lo = num(lon);
    if (la == null || lo == null) return "";
    return `https://${FORECAST_HOST}/v1/forecast?latitude=${la}&longitude=${lo}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto`;
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

  function plateLine(areas, live, unread) {
    const area = currentArea(areas);
    if (!area) return NO_AREA;
    if (unread) return `${area.name} · unread`;
    if (!live) return `${area.name} · looking up`;
    return `${area.name} · ${live.label}`;
  }

  const api = {
    NO_AREA,
    AREA_LABEL,
    AREA_PLACEHOLDER,
    AREA_TRUTH,
    GEOCODE_HOST,
    FORECAST_HOST,
    MAX_AREAS,
    blankAreas,
    parseArea,
    parseAreas,
    currentArea,
    addArea,
    removeArea,
    pickArea,
    renameArea,
    geocodeUrl,
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
