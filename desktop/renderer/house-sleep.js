/** House sleep-aid beds. Local file, same door as the house loop. Not radio. */
(function (root) {
  const SLEEP_AID_PLUGINS = [
    { id: "off", name: "Off", blurb: "No sleep aid.", license: "" },
    {
      id: "rain",
      name: "Rain and thunder",
      blurb: "A house-made storm bed. About three minutes, then it loops.",
      license: "CC0 · house-made",
    },
  ];
  const SLEEP_AID_LABEL = "Sleep aid";
  const SLEEP_AID_LICENSE = "CC0 · house-made";
  const SLEEP_AID_MUTE_TRUTH = "Music mute also quiets the bed.";
  const SLEEP_AID_SECONDS = 180;
  const SLEEP_RAIN_FILE = "sleep-rain.ogg";

  function blankSleepAid() {
    return { plugin: "off", playing: false };
  }

  function parseSleepAid(raw) {
    const next = blankSleepAid();
    if (!raw || typeof raw !== "object") return next;
    const id = String(raw.plugin || "");
    next.plugin = SLEEP_AID_PLUGINS.some((p) => p.id === id) ? id : "off";
    next.playing = !!raw.playing && next.plugin !== "off";
    return next;
  }

  function sleepAidPreset(id) {
    return SLEEP_AID_PLUGINS.find((p) => p.id === id) || SLEEP_AID_PLUGINS[0];
  }

  function shouldPlay(aid, mutes) {
    const next = parseSleepAid(aid);
    if (!next.playing || next.plugin === "off") return false;
    if (mutes && mutes.music) return false;
    return true;
  }

  function rainSrc() {
    return `/sounds/${SLEEP_RAIN_FILE}`;
  }

  function overlayRainSrc() {
    return `sounds/${SLEEP_RAIN_FILE}`;
  }

  function playSrc(aid) {
    const next = parseSleepAid(aid);
    if (!next.playing || next.plugin === "off") return "";
    if (next.plugin === "rain") return rainSrc();
    return "";
  }

  function overlayPlaySrc(aid) {
    const next = parseSleepAid(aid);
    if (!next.playing || next.plugin === "off") return "";
    if (next.plugin === "rain") return overlayRainSrc();
    return "";
  }

  function stopNode(node) {
    if (!node) return null;
    if (typeof node.pause === "function") node.pause();
    node.src = "";
    return null;
  }

  function applySleepAid(node, aid, mutes, volume, opts) {
    const pickSrc = opts && opts.srcOf ? opts.srcOf : overlayPlaySrc;
    const src = shouldPlay(aid, mutes) ? pickSrc(aid) : "";
    if (!src) return stopNode(node);
    const vol = Math.max(0, Math.min(1, Number(volume) || 0));
    if (node && node.dataset && node.dataset.src === src) {
      node.volume = vol;
      return node;
    }
    stopNode(node);
    const makeAudio =
      opts && opts.makeAudio
        ? opts.makeAudio
        : typeof Audio !== "undefined"
          ? (nextSrc) => new Audio(nextSrc)
          : null;
    if (!makeAudio) return null;
    const next = makeAudio(src);
    if (!next.dataset) next.dataset = {};
    next.dataset.src = src;
    next.loop = true;
    next.volume = vol;
    if (typeof next.play === "function") {
      const played = next.play();
      if (played && typeof played.catch === "function") played.catch(() => {});
    }
    return next;
  }

  const api = {
    SLEEP_AID_PLUGINS,
    SLEEP_AID_LABEL,
    SLEEP_AID_LICENSE,
    SLEEP_AID_MUTE_TRUTH,
    SLEEP_AID_SECONDS,
    SLEEP_RAIN_FILE,
    blankSleepAid,
    parseSleepAid,
    sleepAidPreset,
    shouldPlay,
    rainSrc,
    overlayRainSrc,
    playSrc,
    overlayPlaySrc,
    applySleepAid,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHouseSleep = api;
})(typeof window !== "undefined" ? window : globalThis);
