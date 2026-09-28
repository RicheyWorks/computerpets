/** House-hand keeper card. Same truth as the desk. Java is 8081 by default; the house-server row only shows when the keeper names a server. */
(function (root) {
  const JAVA_PORT = 8081;
  const DESK_PORT = 8080;
  const HEARTBEAT_URL = "http://127.0.0.1:8081/api/public/heartbeat";
  const HOUSE_SERVER = "House server";
  const HOUSE_SERVER_HIDDEN = Object.freeze({ show: false });
  /** A named server that has not answered once this session. Plain and calm: the server is optional. */
  const NO_HOUSE_SERVER = "House server not running (optional)";
  /** A named server that answered this session, then stopped. Same words as the web heartbeat line. */
  const HOUSE_SERVER_STOPPED = "House server stopped answering (optional). Pets still work.";
  /** A named server that is answering; "· up 2h" follows when it says how long. */
  const HOUSE_SERVER_UP = "House server running";
  /** The keeper card's care line: plain words for "care never goes to the house server". */
  const CARE_TRUTH = "Your pet's care stays on this computer.";
  /** The one-time hello at the top of the keeper card (card.json firstHintSeen). Kid-plain words. */
  const FIRST_HINT_OK = "Got it";
  const ADVERTISED_CARE = { feed: "/pet/feed", play: "/pet/play", rest: "/pet/rest" };
  const CARE_DOOR_STATUS = 409;
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
  const VOICE_TRUTH = "Rui, Soot, Wedge, Heart, Hook, Dee, Brick, Drake, Vee, Drum, Sip, Echo, Peck, Quill, Keel, Ember, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Rue, Wick, Burr, Floss, Bloom, Vesper, Nori, Saffron, Bandit, Jade, Bluff, Sash, Lula, Coral, Blush, Atlas, Cup, Sepia, Chamber, Pulse, Ochre, Tenant, Ledger, Anchor, Kite, Door, Felt, Vein, Fan, Mast, Disk, Moth, Arm, Snap, Well, Dew, Comb, Milk, Ghost, Spark, Dart, Twig, Column, Seven, Fold, Brood, Wax, Frill, Cap, Lattice, Horn, Ring, Mane, Puff, Flame, Starter, Pact, Gleam, Choir, Drift, Shard, Dusk, Knot, Brine, Beacon, Hush, Arca, Reed, Pebble, Eft, Dapple, Slip, Pinch, Whorl, Hinge, Latch, Prickle, Boot, Reach, Spot, Orb, Pane, Hold, Loom, and Leap talk with house cry first; system speech is the backup.";
  const QUIT_TRUTH = "Turns the pets off. To bring them back, type .\\desktop.ps1 again, just like the first time.";

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
    if (seconds == null) return "";
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    if (hours < 48) return rem ? `${hours}h ${rem}m` : `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  }

  /**
   * The keeper card's server row. Empty (hidden) until the keeper names a
   * server in Settings, the environment, or by holding a license (main
   * process: house-server.cjs). Plain words only, the same as the web heartbeat line:
   * running (with how long) or stopped answering.
   * `seen: false` (pet.js: this server has not answered once this session) reads
   * NO_HOUSE_SERVER instead; HOUSE_SERVER_STOPPED is kept for one that answered, then stopped.
   */
  function houseServerLine(state) {
    if (!state || state.show !== true) return "";
    if (state.reachable !== true && state.seen === false) return NO_HOUSE_SERVER;
    if (state.reachable !== true) return HOUSE_SERVER_STOPPED;
    const up = formatUptime(state.uptimeSeconds);
    return up ? `${HOUSE_SERVER_UP} · up ${up}` : HOUSE_SERVER_UP;
  }

  /**
   * The server row's tone, for data-heartbeat (same values as the web card). "OFF" (not seen this
   * session; the server is optional) is neutral; only "DOWN" (answered, then stopped) is a warning.
   */
  function houseServerTone(state) {
    if (state && state.reachable === true) return "UP";
    return state && state.seen === true ? "DOWN" : "OFF";
  }

  function houseServerTitle(state) {
    if (!state || state.show !== true || !state.host) return "";
    return `${HOUSE_SERVER} at ${state.host}`;
  }

  function careTruth() {
    return CARE_TRUTH;
  }

  /**
   * The first-run hello on the keeper card, written for a child who never installed anything.
   * It points at the card, clicking and right-clicking the pet, and the tray icon by the clock.
   */
  function firstHint(name) {
    const who = String(name || "").trim() || "your pet";
    const Who = who.charAt(0).toUpperCase() + who.slice(1);
    return {
      title: `Hi! ${Who} lives on your screen now.`,
      lines: [
        `This is ${who}'s keeper card. It shows if ${who} is hungry, sleepy, or happy. Press Feed, Play, or Rest to help.`,
        `Click ${who} any time to open this card again. Right-click ${who} for more things to do.`,
        "Near the clock there is a tiny ComputerPets picture. That is the tray icon. Right-click it to pick a new friend, or pick Quit to turn the pets off.",
      ],
      ok: FIRST_HINT_OK,
    };
  }

  /** Shown until Got it is pressed once; card.json keeps firstHintSeen so it never comes back. */
  function firstHintShows(card) {
    return !(card && card.firstHintSeen === true);
  }

  /**
   * Where the pet's speech bubble goes when the keeper card may be open: over the pet (bubbleX) when that misses the
   * card, else beside the card, on its left when there is room and on its right when not. clear says the bubble
   * misses the card, so it can sit at the pet's head; clear false only when no side has room (then pet.js lifts it
   * as before). cardW 0 means the card is shut.
   * @param {{ bubbleX: number, bubbleW: number, cardX: number, cardW: number, width: number, gap?: number, edge?: number }} o
   * @returns {{ x: number, clear: boolean }}
   */
  function bubbleBesideCard({ bubbleX, bubbleW, cardX, cardW, width, gap = 8, edge = 10 }) {
    if (!cardW) return { x: bubbleX, clear: true };
    if (bubbleX + bubbleW <= cardX - gap || bubbleX >= cardX + cardW + gap) return { x: bubbleX, clear: true };
    const left = cardX - gap - bubbleW;
    if (left >= edge) return { x: left, clear: true };
    const right = cardX + cardW + gap;
    if (right + bubbleW <= width - edge) return { x: right, clear: true };
    return { x: bubbleX, clear: false };
  }

  /**
   * Opening the card stops a pet that was only wandering or idling. A walk the keeper asked for (to the food or the
   * treat, after the ribbon, to the edge to hide, back in, to a called guest) goes on: opening the card cleared its
   * target, and the order never came again, so the pet stood short of its food for good (hunger held at 78).
   */
  function cardStopsWalk(cmd) {
    return !cmd || cmd === "wander" || cmd === "idle" || cmd === "none";
  }

  /**
   * Whether a walk the keeper asked for picks up again once a window play, trick, or happy moment lets go of the
   * pet. Feed during a window play aborted the play, and its end set the pet idle with the food still its target:
   * it stood there for good (hunger held at 78), the card open or closed.
   */
  function orderWalkResumes({ cmd, target, asleep }) {
    return target != null && !asleep && !cardStopsWalk(cmd);
  }

  /**
   * Whether the pet is on a Hide or Call back walk the keeper asked for, which the idle chooser must leave alone. It
   * skipped Feed's walk but not these: a Hide walk longer than the pet's line was swapped for a wander on the next
   * 5.6 s tick and the pet never hid (leaving stayed set); a Call back walk was cut short the same way.
   */
  function keeperWalkOn({ cmd, target }) {
    return (cmd === "leave" || cmd === "enter") && target != null;
  }

  /** How long the open card stays up after the keeper's last press on it, even when the pet walks off. */
  const CARD_PRESS_HOLD_MS = 8000;

  /**
   * Whether the open card folds because the pet walks. It folded on the first step of any walk, so a care press on
   * the card (Feed, Play) folded it under the pointer, and the unread hello went with it. Now: never while the hello
   * is unread (Got it or closing the card ends that), and never within CARD_PRESS_HOLD_MS of a press on the card.
   * The keeper can always close it (Escape, the fold button).
   */
  function cardFoldsOnWalk({ helloUnread, sinceLastPress, hold = CARD_PRESS_HOLD_MS }) {
    if (helloUnread) return false;
    return !(sinceLastPress < hold);
  }

  /**
   * The open card's left edge, moved off the house plates (weather, news, market) it would cover: the first run put
   * the card at 177..491 over the weather plate at 102..392 and the Quotes plate under it. From the wanted x it tries
   * each plate's right side and left side and keeps the clear spot nearest the wanted one, on the screen; with no
   * clear spot it stays where it was wanted. Boxes are { left, top, right, bottom }.
   * @param {{ x: number, w: number, top: number, bottom: number, plates: { left: number, top: number, right: number, bottom: number }[], width: number, gap?: number, edge?: number }} o
   */
  function cardClearOfPlates({ x, w, top, bottom, plates, width, gap = 8, edge = 8 }) {
    const shown = (plates || []).filter((p) => p && p.right - p.left > 1 && p.bottom - p.top > 1 && Math.min(bottom, p.bottom) - Math.max(top, p.top) > 0);
    const hits = (cx) => shown.some((p) => Math.min(cx + w, p.right) - Math.max(cx, p.left) > 0);
    if (!w || !hits(x)) return x;
    const maxX = Math.max(edge, width - w - edge);
    const tries = [];
    for (const p of shown) tries.push(p.right + gap, p.left - gap - w);
    let best = x;
    let bestD = Infinity;
    for (const t of tries) {
      if (t < edge || t > maxX || hits(t)) continue;
      const d = Math.abs(t - x);
      if (d < bestD) {
        best = t;
        bestD = d;
      }
    }
    return best;
  }

  /**
   * Where the open card stands while the pet walks: where it stood when the walk began (x and lift held), and back
   * on the pet once it stands still. It followed the pet every frame, so with the card up during a walk (a care
   * press, the hello unread) its buttons slid out from under the pointer. `held` is the last result's `held`.
   * On a long walk the held card is on a leash (CARD_LEASH_PX): once the pet is more than that far past the card's
   * near edge the card is pulled along at that distance and held there, so the card never stands a screen away
   * from the pet it belongs to (it stayed where it was however far the pet walked). `petLeft`/`petRight` are the
   * pet's box, `w` the card's width and `width` the screen; without them the card simply holds.
   * @param {{ open: boolean, walking: boolean, held: { x: number, lift: number } | null, x: number, lift: number,
   *   petLeft?: number, petRight?: number, w?: number, width?: number, reach?: number }} o
   */
  function cardHeldSpot({ open, walking, held, x, lift, petLeft, petRight, w, width, reach }) {
    if (!open || !walking) return { x, lift, held: null };
    let h = held || { x, lift };
    if ([petLeft, petRight, w].every((n) => typeof n === "number" && isFinite(n))) {
      const r = typeof reach === "number" && reach >= 0 ? reach : CARD_LEASH_PX;
      let hx = Math.min(Math.max(h.x, petLeft - r - w), petRight + r);
      if (typeof width === "number" && width > 0) hx = Math.min(Math.max(hx, 8), Math.max(8, width - w - 8));
      if (hx !== h.x) h = { x: hx, lift: h.lift };
    }
    return { x: h.x, lift: h.lift, held: h };
  }

  /** How far (px) the held card may stand from the pet's box on a walk before it is pulled along. */
  const CARD_LEASH_PX = 160;

  /**
   * True when a line on the card can really be seen: it has a box (the card is open, the line not hidden) and that
   * box overlaps the card's own visible box (the card scrolls) and the screen. Used before a talk leaves for a mind
   * on the internet: the line naming the website must be in view, not merely present in a folded card.
   * @param {{ left: number, top: number, right: number, bottom: number } | null} line
   * @param {{ left: number, top: number, right: number, bottom: number } | null} box
   */
  function lineShows(line, box, width, height) {
    if (!line || !box) return false;
    if (!(line.right > line.left && line.bottom > line.top)) return false;
    if (!(box.right > box.left && box.bottom > box.top)) return false;
    const left = Math.max(line.left, box.left, 0);
    const right = Math.min(line.right, box.right, typeof width === "number" ? width : Infinity);
    const top = Math.max(line.top, box.top, 0);
    const bottom = Math.min(line.bottom, box.bottom, typeof height === "number" ? height : Infinity);
    return right - left >= 1 && bottom - top >= 1;
  }

  function careDoorRefusal(verb) {
    const path = ADVERTISED_CARE[verb] || "";
    return {
      status: CARE_DOOR_STATUS,
      title: "Care is local",
      detail: "Care is local. " + path + " is not a door.",
      door: "local",
      performed: false,
      verb: verb,
    };
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

  function poster(name, stage, life, house) {
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
      heartbeat: houseServerLine(house || HOUSE_SERVER_HIDDEN),
      truth: careTruth(),
      voiceTruth: VOICE_TRUTH,
      quitTruth: QUIT_TRUTH,
    };
  }

  /**
   * Tab inside the open keeper card wraps: past the last control to the first, and Shift+Tab before the
   * first to the last. Returns the index to focus, or -1 to let the page move focus as usual.
   */
  function tabWrap(count, index, shift) {
    if (!count) return -1;
    if (index < 0) return shift ? count - 1 : 0;
    if (shift) return index === 0 ? count - 1 : -1;
    return index === count - 1 ? 0 : -1;
  }

  /**
   * What a key does to the keeper card: "close" (Escape, no menu open), "tab", or "none".
   * Escape with focus on a weather, news, or market plate (`inPlate`) steps back instead: "card" (focus
   * returns to the open card; the next Escape closes it) or, with the card closed, "leave" (focus lets go).
   */
  function cardKey(ev) {
    const e = ev || {};
    if (e.key === "Escape" && e.inPlate && !e.menuOpen) return e.cardOpen ? "card" : "leave";
    if (!e.cardOpen) return "none";
    if (e.key === "Escape") return e.menuOpen ? "none" : "close";
    if (e.key === "Tab") return "tab";
    return "none";
  }

  /**
   * Arrow keys on a plate's tabs (the tablist pattern): Right and Left step (wrapping), Home and End jump.
   * Returns the tab index to focus, or -1 when the key is not a move. The tab is picked with Enter or Space.
   */
  function rovingIndex(key, at, count) {
    if (!count) return -1;
    if (key === "ArrowRight") return at < 0 ? 0 : (at + 1) % count;
    if (key === "ArrowLeft") return at <= 0 ? count - 1 : at - 1;
    if (key === "Home") return 0;
    if (key === "End") return count - 1;
    return -1;
  }

  /** After Drop removes saved line `at`: focus the line that slid into its place, else the one above, else -1. */
  function afterDrop(at, left) {
    if (!left || left <= 0) return -1;
    return Math.min(Math.max(at, 0), left - 1);
  }

  const api = {
    JAVA_PORT,
    DESK_PORT,
    HEARTBEAT_URL,
    HOUSE_SERVER,
    HOUSE_SERVER_HIDDEN,
    NO_HOUSE_SERVER,
    HOUSE_SERVER_STOPPED,
    houseServerTone,
    HOUSE_SERVER_UP,
    CARE_TRUTH,
    FIRST_HINT_OK,
    firstHint,
    firstHintShows,
    bubbleBesideCard,
    cardStopsWalk,
    orderWalkResumes,
    CARD_PRESS_HOLD_MS,
    cardFoldsOnWalk,
    cardClearOfPlates,
    cardHeldSpot,
    keeperWalkOn,
    CARD_LEASH_PX,
    lineShows,
    ADVERTISED_CARE,
    CARE_DOOR_STATUS,
    KEEPER_CARE,
    HUD_WIDTH,
    HUD_WIDTH_COLLAPSED,
    KEEPER_KICKER,
    VOICE_TRUTH,
    QUIT_TRUTH,
    UNREAD,
    parseHeartbeat,
    formatUptime,
    houseServerLine,
    houseServerTitle,
    careTruth,
    careDoorRefusal,
    bondTitle,
    meters,
    poster,
    tabWrap,
    cardKey,
    rovingIndex,
    afterDrop,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetKeeper = api;
})(typeof window !== "undefined" ? window : globalThis);
