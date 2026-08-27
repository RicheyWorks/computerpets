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
  const HOUSE_LOOP_LICENSE = "CC0 · house-made";
  const RADIO_DIR = "https://de1.api.radio-browser.info/json/stations/search";

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

  function radioSearchUrl(query) {
    const q = String(query || "").trim().slice(0, 40);
    const params = new URLSearchParams({
      limit: "16",
      hidebroken: "true",
      order: "clickcount",
      reverse: "true",
    });
    if (q) params.set("name", q);
    else params.set("tag", "classical");
    return `${RADIO_DIR}?${params.toString()}`;
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
    HOUSE_LOOP_LICENSE,
    RADIO_DIR,
    blankMusic,
    parseMusic,
    safeStream,
    musicPreset,
    radioSearchUrl,
    parseStations,
    houseLoopSrc,
    overlayHouseLoopSrc,
    playSrc,
    overlayPlaySrc,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHouseMusic = api;
})(typeof window !== "undefined" ? window : globalThis);
