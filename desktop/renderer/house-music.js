/** Free music + radio for Rui. Same plugin store shape as the mind bus. Find waits until the radio form shows this computer's network address on that https request. readRadioSearch also refuses when that painted line is missing. A host that never answers times out after twelve seconds. That miss rejects so the plate can say can't reach. A late body is not parsed. A timeout does not call the next directory host. openStationStream refuses a station audio open when the painted stream-host line is missing. A house loop is not that open. */
(function (root) {
  const MUSIC_PLUGINS = [
    { id: "off", name: "Quiet", blurb: "No music.", license: "" },
    { id: "house", name: "House loop", blurb: "A short house-made loop. Rui can dance.", license: "CC0 · house-made" },
    {
      id: "radio",
      name: "Radio Browser",
      blurb: "A free public station directory. No key. Play/stop on the card.",
      license: "Station license varies. Streams are free to hear.",
    },
  ];
  const RADIO_CANT_REACH = "can't reach";
  const RADIO_EMPTY = "no station from that look-up";
  const HOUSE_LOOP_LICENSE = "CC0 · house-made";
  const RADIO_UA = "ComputerPets/0.2 (https://github.com/RicheyWorks/computerpets)";
  const RADIO_HOSTS = [
    "https://de1.api.radio-browser.info",
    "https://de2.api.radio-browser.info",
    "https://fi1.api.radio-browser.info",
  ];
  const RADIO_DIR = `${RADIO_HOSTS[0]}/json/stations/search`;
  const RADIO_LABEL = "Radio station";
  const RADIO_PLACEHOLDER = "Station, city, or 99.9";
  const RADIO_LOCAL = "Local";

  /** Typed city names only. The house does not guess a city they did not name. */
  const KNOWN_PLACES = {
    seattle: { city: "Seattle", state: "Washington", countrycode: "US" },
  };

  const COUNTRY_CODES = {
    "united states": "US",
    usa: "US",
    us: "US",
    "united kingdom": "GB",
    uk: "GB",
    canada: "CA",
    australia: "AU",
    germany: "DE",
    france: "FR",
    japan: "JP",
    ireland: "IE",
    mexico: "MX",
  };

  function blankMusic() {
    return { plugin: "off", stationId: "", stationName: "", stationUrl: "", playing: false };
  }

  function safeStream(raw) {
    try {
      const url = new URL(String(raw || ""));
      if (url.protocol !== "https:" && url.protocol !== "http:") return "";
      if (url.username || url.password) return "";
      return url.toString();
    } catch {
      return "";
    }
  }

  function parseMusic(raw) {
    const next = blankMusic();
    if (!raw || typeof raw !== "object") return next;
    const id = String(raw.plugin || "");
    next.plugin = MUSIC_PLUGINS.some((p) => p.id === id) ? id : "off";
    next.stationId = typeof raw.stationId === "string" ? raw.stationId : "";
    next.stationName = typeof raw.stationName === "string" ? raw.stationName.slice(0, 80) : "";
    next.stationUrl = safeStream(raw.stationUrl);
    next.playing = !!raw.playing && next.plugin !== "off";
    return next;
  }

  function musicPreset(id) {
    return MUSIC_PLUGINS.find((p) => p.id === id) || MUSIC_PLUGINS[0];
  }

  function countryCodeOf(raw) {
    const key = String(raw || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    if (!key) return "";
    if (/^[a-z]{2}$/.test(key)) return key.toUpperCase();
    return COUNTRY_CODES[key] || "";
  }

  function parseAreaPlace(area) {
    if (!area || typeof area !== "object") return { city: "", state: "", countrycode: "", lat: null, lon: null };
    const name = String(area.name || area.query || "")
      .replace(/\s+/g, " ")
      .trim();
    const bits = name
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const city = String(area.query || bits[0] || "").trim();
    let state = "";
    let country = "";
    for (const bit of bits.slice(1)) {
      if (countryCodeOf(bit)) country = bit;
      else if (!state) state = bit;
    }
    const lat = Number(area.lat);
    const lon = Number(area.lon);
    return {
      city,
      state,
      countrycode: countryCodeOf(country) || countryCodeOf(area.countrycode) || "",
      lat: Number.isFinite(lat) ? lat : null,
      lon: Number.isFinite(lon) ? lon : null,
    };
  }

  function knownPlace(token) {
    const key = String(token || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    return KNOWN_PLACES[key] || null;
  }

  function resolvePlace(place, area) {
    const named = knownPlace(place);
    if (named) return { city: named.city, state: named.state, countrycode: named.countrycode };
    const fromArea = parseAreaPlace(area);
    if (place && fromArea.city && fromArea.city.toLowerCase() === String(place).toLowerCase()) {
      return { city: fromArea.city, state: fromArea.state, countrycode: fromArea.countrycode };
    }
    if (!place) return { city: fromArea.city, state: fromArea.state, countrycode: fromArea.countrycode };
    const city = String(place)
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
    return { city, state: "", countrycode: "" };
  }

  function parseRadioQuery(query, area) {
    const raw = String(query || "").replace(/\s+/g, " ").trim().slice(0, 80);
    const freqMatch = raw.match(/\b(\d{2,3}\.\d)\b/);
    const freq = freqMatch ? freqMatch[1] : "";
    const tags = [];
    if (/\bfm\b/i.test(raw)) tags.push("fm");
    if (/\bam\b/i.test(raw)) tags.push("am");
    const tokens = raw
      .toLowerCase()
      .split(/[^a-z0-9.]+/)
      .filter((t) => t && t !== freq && t !== "fm" && t !== "am");
    const isCall = (t) => /^[kw][a-z0-9]{2,4}$/i.test(t);
    const call = tokens.find(isCall) || "";
    const named = tokens.find((t) => knownPlace(t));
    const places = tokens.filter((t) => t.length > 2 && !/^\d/.test(t) && t !== call);
    const place = named || places[places.length - 1] || "";
    const resolved = resolvePlace(place, area);
    return {
      raw,
      freq,
      place,
      tags,
      tokens,
      call,
      city: resolved.city,
      state: resolved.state,
      countrycode: resolved.countrycode,
    };
  }

  function searchParams(extra, host) {
    const params = new URLSearchParams({
      limit: "24",
      hidebroken: "true",
      order: "clickcount",
      reverse: "true",
    });
    for (const [k, v] of Object.entries(extra || {})) {
      if (v != null && v !== "") params.set(k, String(v).slice(0, 40));
    }
    const base = `${host || RADIO_HOSTS[0]}/json/stations/search`;
    return `${base}?${params.toString()}`;
  }

  function localAreaParams(area) {
    const place = parseAreaPlace(area);
    if (!place.city && !place.state && !place.countrycode) return null;
    const extra = {};
    if (place.city) extra.city = place.city;
    if (place.state) extra.state = place.state;
    if (place.countrycode) extra.countrycode = place.countrycode;
    return extra;
  }

  function radioSearchUrl(query, area) {
    const urls = radioSearchUrls(query, area);
    return urls[0] || "";
  }

  function radioSearchUrls(query, area) {
    const p = parseRadioQuery(query, area);
    const out = [];
    const add = (extra) => {
      if (!extra || !Object.keys(extra).length) return;
      const url = searchParams(extra);
      if (url && out.indexOf(url) < 0) out.push(url);
    };
    if (!p.raw) {
      const local = localAreaParams(area);
      if (local) {
        add(local);
        if (local.city) add({ name: local.city, countrycode: local.countrycode, state: local.state });
      }
      return out.slice(0, 4);
    }
    if (p.freq && (p.city || p.state || p.countrycode)) {
      add({ name: p.freq, city: p.city, state: p.state, countrycode: p.countrycode });
      add({ name: p.freq, state: p.state, countrycode: p.countrycode });
    }
    if (p.freq) add({ name: p.freq });
    if (p.city || p.state || p.countrycode) {
      add({ city: p.city, state: p.state, countrycode: p.countrycode });
      add({ name: p.city || p.place, state: p.state, countrycode: p.countrycode });
    }
    if (p.call) add({ name: p.call.toUpperCase(), countrycode: p.countrycode, state: p.state });
    if (!p.freq && p.raw && !p.place && !p.call) add({ name: p.raw.slice(0, 40) });
    if (!out.length && p.raw) add({ name: p.raw.slice(0, 40) });
    return out.slice(0, 4);
  }

  function kmBetween(aLat, aLon, bLat, bLon) {
    if (![aLat, aLon, bLat, bLon].every((n) => Number.isFinite(n))) return null;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(bLat - aLat);
    const dLon = toRad(bLon - aLon);
    const s =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }

  function rankStations(stations, query, area) {
    const p = parseRadioQuery(query, area);
    const tokens = [p.freq, p.place, p.city, p.state, p.countrycode].concat(p.tokens, p.tags).filter(Boolean);
    const list = Array.isArray(stations) ? stations.slice() : [];
    const here = parseAreaPlace(area);
    return list
      .map((st) => {
        const hay = `${st.name || ""} ${st.tags || ""} ${st.state || ""} ${st.country || ""} ${st.countrycode || ""} ${st.city || ""}`.toLowerCase();
        let score = 0;
        for (const t of tokens) {
          if (hay.indexOf(String(t).toLowerCase()) >= 0) score += 2;
        }
        if (p.freq && hay.indexOf(p.freq) >= 0) score += 5;
        if (p.place && hay.indexOf(String(p.place).toLowerCase()) >= 0) score += 3;
        if (p.city && hay.indexOf(String(p.city).toLowerCase()) >= 0) score += 4;
        if (p.state && hay.indexOf(String(p.state).toLowerCase()) >= 0) score += 3;
        if (p.countrycode && String(st.countrycode || "").toUpperCase() === p.countrycode) score += 2;
        const km = kmBetween(here.lat, here.lon, Number(st.geo_lat), Number(st.geo_long));
        if (km != null) {
          if (km <= 80) score += 6;
          else if (km <= 250) score += 3;
          else if (km <= 600) score += 1;
        }
        return { st, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((row) => row.st);
  }

  function mergeStations(batches) {
    const seen = Object.create(null);
    const out = [];
    for (const list of Array.isArray(batches) ? batches : []) {
      for (const st of Array.isArray(list) ? list : []) {
        if (!st || !st.id || seen[st.id]) continue;
        seen[st.id] = true;
        out.push(st);
      }
    }
    return out;
  }

  function parseStations(json) {
    if (!Array.isArray(json)) return [];
    const out = [];
    for (const row of json) {
      if (!row || typeof row !== "object") continue;
      const url = safeStream(row.url_resolved || row.url);
      const name = String(row.name || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 72);
      if (!url || !name) continue;
      out.push({
        id: String(row.stationuuid || row.changeuuid || name),
        name,
        url,
        tags: String(row.tags || "").slice(0, 60),
        city: String(row.state || row.city || "").slice(0, 40),
        state: String(row.state || "").slice(0, 40),
        country: String(row.country || "").slice(0, 40),
        countrycode: String(row.countrycode || "").slice(0, 4),
        geo_lat: Number(row.geo_lat),
        geo_long: Number(row.geo_long),
      });
    }
    return out.slice(0, 24);
  }

  function urlsOnHost(urls, host) {
    return (Array.isArray(urls) ? urls : []).map((url) => {
      try {
        const parsed = new URL(url);
        return `${host}${parsed.pathname}${parsed.search}`;
      } catch {
        return "";
      }
    }).filter(Boolean);
  }

  function houseLoopSrc() {
    return "/sounds/house-loop.wav";
  }

  function overlayHouseLoopSrc() {
    return "sounds/house-loop.wav";
  }

  function playSrc(music) {
    if (!music || !music.playing || music.plugin === "off") return "";
    if (music.plugin === "house") return houseLoopSrc();
    return music.stationUrl || "";
  }

  function sharedNet(host) {
    let areas = root.PetWeatherAreas;
    if (!areas && typeof module !== "undefined" && module.exports) {
      try {
        areas = require("./weather-areas.js");
        root.PetWeatherAreas = areas;
      } catch (err) {
        areas = null;
      }
    }
    if (!areas || typeof areas.clientNetLine !== "function") return "";
    return areas.clientNetLine(host);
  }

  const RADIO_NET = sharedNet("the radio host");
  const RADIO_FIND = RADIO_NET ? `this find sends the station look-up. ${RADIO_NET}` : "";

  function radioHonesty() {
    return RADIO_FIND;
  }

  function radioMaySend(lineInView) {
    return lineInView === true && !!RADIO_NET && RADIO_FIND.indexOf(RADIO_NET) !== -1;
  }

  function radioSearchMayLeave(shown) {
    if (!RADIO_FIND) return false;
    return typeof shown === "string" && shown.indexOf(RADIO_FIND) !== -1;
  }

  /** Twelve seconds covers headers and the body. Matches weather page and overlay plate IPC. */
  const RADIO_TIMEOUT_MS = 12_000;

  /** A silent radio host. Callers flip the plate to unread / "can't reach". */
  class RadioTimeout extends Error {
    constructor() {
      super("radio request timed out");
      this.name = "RadioTimeout";
    }
  }

  function isRadioTimeout(err) {
    return !!(
      err &&
      (err.name === "RadioTimeout" ||
        err.name === "AbortError" ||
        err.name === "TimeoutError" ||
        err.code === "ABORT_ERR")
    );
  }

  /**
   * One outbound radio JSON read. The timer covers headers and the body.
   * A timeout rejects with RadioTimeout. The caller does not get a body.
   * A late body after the deadline is not parsed.
   */
  function readRadioJson(url, fetchImpl, timeoutMs) {
    const go = typeof fetchImpl === "function" ? fetchImpl : fetch;
    if (typeof go !== "function") return Promise.reject(new RadioTimeout());
    const ms = typeof timeoutMs === "number" ? timeoutMs : RADIO_TIMEOUT_MS;
    const ctrl = new AbortController();
    let settled = false;
    let timer;

    return new Promise(function (resolve, reject) {
      timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        ctrl.abort();
        reject(new RadioTimeout());
      }, ms);

      Promise.resolve()
        .then(function () {
          return go(url, { cache: "no-store", headers: { Accept: "application/json" }, signal: ctrl.signal });
        })
        .then(function (res) {
          return res && typeof res.json === "function" ? res.json() : null;
        })
        .then(function (json) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(json);
        })
        .catch(function (err) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (isRadioTimeout(err)) reject(new RadioTimeout());
          else reject(err);
        });
    });
  }

  function readRadioSearch(shown, query, area, fetchImpl, timeoutMs) {
    if (!radioSearchMayLeave(shown)) return Promise.resolve(null);
    const urls = radioSearchUrls(query, area);
    if (!urls.length) return Promise.resolve([]);
    const ms = typeof timeoutMs === "number" ? timeoutMs : RADIO_TIMEOUT_MS;
    return Promise.all(
      urls.map(function (url) {
        return readRadioJson(url, fetchImpl, ms)
          .then(function (json) {
            return parseStations(json);
          })
          .catch(function (err) {
            if (isRadioTimeout(err)) throw new RadioTimeout();
            return null;
          });
      }),
    ).then(function (batches) {
      if (batches.every(function (b) {
        return b == null;
      })) {
        throw new Error("unread");
      }
      const merged = mergeStations(batches.filter(Boolean));
      return rankStations(merged, query, area).slice(0, 16);
    });
  }

  const STREAM_HOST_NAME = "the station stream host";

  function streamHostName(raw) {
    const safe = safeStream(raw);
    if (!safe) return "";
    try {
      return new URL(safe).hostname || "";
    } catch (err) {
      return "";
    }
  }

  function streamHostLabel(hostname) {
    const host = String(hostname || "").trim();
    return host || STREAM_HOST_NAME;
  }

  function streamHostPhrase(music) {
    if (!music || music.plugin !== "radio" || !music.playing) return "";
    const safe = safeStream(music.stationUrl);
    if (!safe) return "";
    return streamHostLabel(streamHostName(safe));
  }

  function streamHonesty(music) {
    const host = streamHostPhrase(music);
    if (!host) return "";
    const net = sharedNet(host);
    if (!net) return "";
    return `this play opens the station stream. ${net}`;
  }

  function streamMaySend(music, lineInView) {
    const host = streamHostPhrase(music);
    const line = streamHonesty(music);
    if (!host || !line || lineInView !== true) return false;
    const net = sharedNet(host);
    return !!net && line.indexOf(net) !== -1;
  }

  /** A station stream leaves only when the painted line names that stream host. */
  function streamMayLeave(shown, music) {
    const line = streamHonesty(music);
    if (!line || typeof shown !== "string") return false;
    return shown.indexOf(line) !== -1;
  }

  /**
   * The only station-stream open. A miss returns null and does not construct Audio
   * or assign src. A house loop is not this open.
   */
  function openStationStream(shown, music, src, makeAudio) {
    if (!streamMayLeave(shown, music) || !src || typeof makeAudio !== "function") return null;
    return makeAudio(src);
  }

  function overlayPlaySrc(music) {
    if (!music || !music.playing || music.plugin === "off") return "";
    if (music.plugin === "house") return overlayHouseLoopSrc();
    return music.stationUrl || "";
  }

  /** The guest whose card carries the full music block. Same as web house-music.ts. */
  const HOUSE_MUSIC_OWNER = "red_panda";
  const HOUSE_MUSIC_LABEL = "House music";

  /** Shared Pause/Play shows off the owner's card when there is something to play. */
  function sharedMusicShows(guestKey, music) {
    if (!music || guestKey === HOUSE_MUSIC_OWNER) return false;
    if (music.plugin === "house") return true;
    return music.plugin === "radio" && !!music.stationUrl;
  }

  /** Said on another guest's card when there is nothing for the shared Pause/Play to play yet. */
  const MUSIC_PICK_HINT = "Pick music on Rui's card.";

  /** Off, or radio with no station: only the owner's block can pick. Same as web house-music.ts. */
  function sharedMusicHint(guestKey, music) {
    if (!music || guestKey === HOUSE_MUSIC_OWNER) return "";
    if (music.plugin === "off" || (music.plugin === "radio" && !music.stationUrl)) return MUSIC_PICK_HINT;
    return "";
  }

  /** What the shared Pause/Play shows and commits. Same rule as the owner's Play button. */
  function houseMusicToggle(music, streamAsked) {
    const remote = music.plugin === "radio" && !!music.stationUrl;
    const audible = !!music.playing && music.plugin !== "off" && (!remote || streamAsked === true);
    return {
      audible,
      label: audible ? "Pause music" : "Play music",
      next: Object.assign({}, music, { playing: !audible && music.plugin !== "off" }),
    };
  }

  const api = {
    MUSIC_PLUGINS,
    RADIO_CANT_REACH,
    RADIO_EMPTY,
    RADIO_LABEL,
    RADIO_PLACEHOLDER,
    RADIO_LOCAL,
    HOUSE_LOOP_LICENSE,
    RADIO_DIR,
    RADIO_UA,
    RADIO_HOSTS,
    KNOWN_PLACES,
    blankMusic,
    parseMusic,
    safeStream,
    musicPreset,
    parseRadioQuery,
    parseAreaPlace,
    resolvePlace,
    radioSearchUrl,
    radioSearchUrls,
    urlsOnHost,
    rankStations,
    mergeStations,
    parseStations,
    houseLoopSrc,
    overlayHouseLoopSrc,
    playSrc,
    overlayPlaySrc,
    HOUSE_MUSIC_OWNER,
    HOUSE_MUSIC_LABEL,
    sharedMusicShows,
    houseMusicToggle,
    MUSIC_PICK_HINT,
    sharedMusicHint,
    RADIO_NET,
    RADIO_FIND,
    radioHonesty,
    radioMaySend,
    radioSearchMayLeave,
    RADIO_TIMEOUT_MS,
    RadioTimeout,
    readRadioSearch,
    STREAM_HOST_NAME,
    streamHostName,
    streamHostLabel,
    streamHostPhrase,
    streamHonesty,
    streamMaySend,
    streamMayLeave,
    openStationStream,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHouseMusic = api;
})(typeof window !== "undefined" ? window : globalThis);
