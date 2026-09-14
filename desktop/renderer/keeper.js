/** House-hand keeper card. Same truth as the desk. Java is 8081. */
(function (root) {
  const JAVA_PORT = 8081;
  const DESK_PORT = 8080;
  const HEARTBEAT_URL = "http://127.0.0.1:8081/api/public/heartbeat";
  const ADVERTISED_CARE = { feed: "/pet/feed", play: "/pet/play", rest: "/pet/rest" };
  const KEEPER_CARE = [
    { id: "feed", label: "Feed" },
    { id: "snack", label: "Treat" },
    { id: "play", label: "Play" },
    { id: "rest", label: "Rest" },
    { id: "talk", label: "Talk" },
    { id: "hide", label: "Hide" },
    { id: "call", label: "Call back" },
    { id: "clean", label: "Clean" },
    { id: "bath", label: "Bath" },
    { id: "medicine", label: "Medicine" },
    { id: "praise", label: "Praise" },
    { id: "special", label: "Special" },
    { id: "shed", label: "Shed" },
  ];
  const HUD_WIDTH = 280;
  const HUD_WIDTH_COLLAPSED = 168;
  const KEEPER_KICKER = "Keeper card";
  const VOICE_TRUTH = "Rui, Soot, Wedge, Heart, Hook, Dee, Brick, Drake, Vee, Drum, Sip, Echo, Peck, Quill, Keel, Ember, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Rue, Wick, Burr, Floss, Bloom, Vesper, Nori, Saffron, Bandit, Jade, Bluff, Sash, Lula, Coral, Blush, Atlas, Cup, Sepia, Chamber, Pulse, Ochre, Tenant, Ledger, Anchor, Kite, Door, Felt, Vein, Fan, Mast, Disk, Moth, Arm, Snap, Well, Dew, Comb, Milk, Ghost, Spark, Dart, Twig, Column, Seven, and Fold talk with house cry first; system speech is the backup.";
  const QUIT_TRUTH = "Turns the overlay off. Start again with .\\desktop.ps1.";

  const UNREAD = {
    status: "DOWN",
    profile: null,
    uptimeSeconds: null,
    port: JAVA_PORT,
    careDoor: "local",
  };

  function parseHeartbeat(raw) {
    if (!raw || typeof raw !== "object") return Object.assign({}, UNREAD);
    const status = raw.status === "UP" ? "UP" : "DOWN";
    const profile = typeof raw.profile === "string" && raw.profile.trim() ? raw.profile.trim() : null;
    const uptimeSeconds =
      typeof raw.uptimeSeconds === "number" && Number.isFinite(raw.uptimeSeconds)
        ? Math.max(0, Math.round(raw.uptimeSeconds))
        : null;
    const port = typeof raw.port === "number" && Number.isFinite(raw.port) ? raw.port : JAVA_PORT;
    return { status, profile, uptimeSeconds, port, careDoor: "local" };
  }

  function formatUptime(seconds) {
    if (seconds == null) return "unread";
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    if (hours < 48) return rem ? `${hours}h ${rem}m` : `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  }

  function heartbeatLine(beat) {
    const profile = beat.profile || "unread";
    const up = formatUptime(beat.uptimeSeconds);
    const port = beat.port || JAVA_PORT;
    return `Java ${port} · ${beat.status} · ${profile} · ${up}`;
  }

  function careTruth() {
    return "Care is local. /pet/feed is not a door.";
  }

  function bondTitle(bond) {
    if (bond >= 100) return "Soul";
    if (bond >= 75) return "Devoted";
    if (bond >= 50) return "Friend";
    if (bond >= 25) return "Known";
    return "New";
  }

  function meters(life) {
    return {
      hunger: life && typeof life.hunger === "number" ? life.hunger : 0,
      rest: life && typeof life.energy === "number" ? life.energy : 0,
      bond: life && typeof life.bond === "number" ? life.bond : 0,
      bondTitle: bondTitle(life && typeof life.bond === "number" ? life.bond : 0),
    };
  }

  function poster(name, stage, life, beat) {
    const m = meters(life);
    return {
      kicker: KEEPER_KICKER,
      name: name || "",
      stage: stage || "",
      bondTitle: m.bondTitle,
      hunger: m.hunger,
      rest: m.rest,
      bond: m.bond,
      verbs: KEEPER_CARE.map((verb) => verb.id),
      heartbeat: heartbeatLine(beat || UNREAD),
      truth: careTruth(),
      voiceTruth: VOICE_TRUTH,
      quitTruth: QUIT_TRUTH,
    };
  }

  const api = {
    JAVA_PORT,
    DESK_PORT,
    HEARTBEAT_URL,
    ADVERTISED_CARE,
    KEEPER_CARE,
    HUD_WIDTH,
    HUD_WIDTH_COLLAPSED,
    KEEPER_KICKER,
    VOICE_TRUTH,
    QUIT_TRUTH,
    UNREAD,
    parseHeartbeat,
    formatUptime,
    heartbeatLine,
    careTruth,
    bondTitle,
    meters,
    poster,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetKeeper = api;
})(typeof window !== "undefined" ? window : globalThis);
