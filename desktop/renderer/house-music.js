/** Free music + radio for Rui. Same plugin store shape as the mind bus. */
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
  const RADIO_DIR = "https://de1.api.radio-browser.info/json/stations/search";
  const RADIO_LABEL = "Radio station";
  const RADIO_PLACEHOLDER = "Station, city, or 99.9";

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

  function parseRadioQuery(query) {
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
    const place = tokens.find((t) => t.length > 2 && !/^\d/.test(t)) || "";
    return { raw, freq, place, tags, tokens };
  }

  function searchParams(extra) {
    const params = new URLSearchParams({
      limit: "16",
      hidebroken: "true",
      order: "clickcount",
      reverse: "true",
    });
    for (const [k, v] of Object.entries(extra || {})) {
      if (v) params.set(k, String(v).slice(0, 40));
    }
    return `${RADIO_DIR}?${params.toString()}`;
  }

  function radioSearchUrl(query) {
    const p = parseRadioQuery(query);
    if (!p.raw) return searchParams({ tag: "classical" });
    if (p.freq && p.place) return searchParams({ name: p.freq, tag: p.place });
    if (p.freq) return searchParams({ name: p.freq });
    return searchParams({ name: p.raw.slice(0, 40) });
  }

  function radioSearchUrls(query) {
    const p = parseRadioQuery(query);
    if (!p.raw) return [searchParams({ tag: "classical" })];
    const out = [];
    const add = (url) => {
      if (url && out.indexOf(url) < 0) out.push(url);
    };
    add(radioSearchUrl(p.raw));
    if (p.freq) add(searchParams({ name: p.freq }));
    if (p.place) {
      add(searchParams({ name: p.place }));
      add(searchParams({ tag: p.place }));
      add(searchParams({ state: p.place }));
    }
    return out.slice(0, 4);
  }

  function rankStations(stations, query) {
    const p = parseRadioQuery(query);
    const tokens = [p.freq, p.place].concat(p.tokens, p.tags).filter(Boolean);
    const list = Array.isArray(stations) ? stations.slice() : [];
    return list
      .map((st) => {
        const hay = `${st.name || ""} ${st.tags || ""}`.toLowerCase();
        let score = 0;
        for (const t of tokens) {
          if (hay.indexOf(String(t).toLowerCase()) >= 0) score += 2;
        }
        if (p.freq && hay.indexOf(p.freq) >= 0) score += 5;
        if (p.place && hay.indexOf(p.place) >= 0) score += 3;
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
      });
    }
    return out.slice(0, 16);
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

  function overlayPlaySrc(music) {
    if (!music || !music.playing || music.plugin === "off") return "";
    if (music.plugin === "house") return overlayHouseLoopSrc();
    return music.stationUrl || "";
  }

  const api = {
    MUSIC_PLUGINS,
    RADIO_CANT_REACH,
    RADIO_EMPTY,
    RADIO_LABEL,
    RADIO_PLACEHOLDER,
    HOUSE_LOOP_LICENSE,
    RADIO_DIR,
    blankMusic,
    parseMusic,
    safeStream,
    musicPreset,
    parseRadioQuery,
    radioSearchUrl,
    radioSearchUrls,
    rankStations,
    mergeStations,
    parseStations,
    houseLoopSrc,
    overlayHouseLoopSrc,
    playSrc,
    overlayPlaySrc,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHouseMusic = api;
})(typeof window !== "undefined" ? window : globalThis);
