import { bondTitle, type CareStats } from "./care.ts";

/** Java listens here. The living desk keeps 8080. */
export const JAVA_PORT = 8081;
export const DESK_PORT = 8080;

/** Quiet public door. Not /actuator rooms. Not /pet/feed. */
export const HEARTBEAT_URL = `http://127.0.0.1:${JAVA_PORT}/api/public/heartbeat`;

/** Advertised X-ad routes. Java answers 409. Care stays on this machine. */
export const ADVERTISED_CARE = {
  feed: "/pet/feed",
  play: "/pet/play",
  rest: "/pet/rest",
} as const;

/** Conflict. Not 200, and not 401. A missing license is not why feed fails. */
export const CARE_DOOR_STATUS = 409;

export type CareVerb = keyof typeof ADVERTISED_CARE;

export function careDoorRefusal(verb: CareVerb) {
  const path = ADVERTISED_CARE[verb];
  return {
    status: CARE_DOOR_STATUS,
    title: "Care is local",
    detail: `Care is local. ${path} is not a door.`,
    door: "local" as const,
    performed: false,
    verb,
  };
}

export const KEEPER_CARE = [
  { id: "feed" as const, label: "Feed" },
  { id: "snack" as const, label: "Treat" },
  { id: "play" as const, label: "Play" },
  { id: "rest" as const, label: "Rest" },
  { id: "talk" as const, label: "Talk" },
  { id: "hide" as const, label: "Hide" },
  { id: "call" as const, label: "Call back" },
  { id: "clean" as const, label: "Clean" },
  { id: "bath" as const, label: "Bath" },
  { id: "medicine" as const, label: "Medicine" },
  { id: "praise" as const, label: "Praise" },
  { id: "special" as const, label: "Special" },
  { id: "shed" as const, label: "Shed" },
];

/** Poster HUD width on the Windows overlay. Empty glass is still click-through. */
export const HUD_WIDTH = 280;
export const HUD_WIDTH_COLLAPSED = 168;

export const KEEPER_KICKER = "Keeper card";
export const VOICE_TRUTH = "Rui, Soot, Wedge, Heart, Hook, Dee, Brick, Drake, Vee, Drum, Sip, Echo, Peck, Quill, Keel, Ember, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Rue, Wick, Burr, Floss, Bloom, Vesper, Nori, Saffron, Bandit, Jade, Bluff, Sash, Lula, Coral, Blush, Atlas, Cup, Sepia, Chamber, Pulse, Ochre, Tenant, Ledger, Anchor, Kite, Door, Felt, Vein, Fan, Mast, Disk, Moth, Arm, Snap, Well, Dew, Comb, Milk, Ghost, Spark, Dart, Twig, Column, Seven, Fold, Brood, Wax, Frill, Cap, Lattice, Horn, Ring, Mane, Puff, Flame, Starter, Pact, Gleam, Choir, Drift, Shard, Dusk, Knot, Brine, Beacon, Hush, Arca, Reed, Pebble, Eft, Dapple, Slip, Pinch, Whorl, Hinge, Latch, Prickle, Boot, Reach, Spot, Orb, Pane, Hold, Loom, and Leap talk with house cry first; system speech is the backup.";
/** Web Turn off hides the pet on this page; Sit again brings them back (the overlay's own line names desktop.ps1). */
export const QUIT_TRUTH = "Turns the pet off on this page. Press Sit again to bring them back.";

export type HeartbeatStatus = "UP" | "DOWN";

export type Heartbeat = {
  status: HeartbeatStatus;
  profile: string | null;
  uptimeSeconds: number | null;
  port: number | null;
  careDoor: "local";
  /** False only before the page has asked at all (the page asks only when there is a sign a house server runs). */
  checked?: boolean;
};

export const UNREAD_HEARTBEAT: Heartbeat = {
  status: "DOWN",
  profile: null,
  uptimeSeconds: null,
  port: JAVA_PORT,
  careDoor: "local",
};

export function parseHeartbeat(raw: unknown): Heartbeat {
  if (!raw || typeof raw !== "object") return { ...UNREAD_HEARTBEAT };
  const o = raw as Record<string, unknown>;
  const status = o.status === "UP" ? "UP" : "DOWN";
  const profile = typeof o.profile === "string" && o.profile.trim() ? o.profile.trim() : null;
  const uptimeSeconds = typeof o.uptimeSeconds === "number" && Number.isFinite(o.uptimeSeconds)
    ? Math.max(0, Math.round(o.uptimeSeconds))
    : null;
  const port = typeof o.port === "number" && Number.isFinite(o.port) ? o.port : JAVA_PORT;
  return { status, profile, uptimeSeconds, port, careDoor: "local" };
}

/** Nothing asked yet: the line says "not checked" and offers Check (see createHeartbeatPoll's gate). */
export const UNCHECKED_HEARTBEAT: Heartbeat = { ...UNREAD_HEARTBEAT, checked: false };

/** One heartbeat read every 15 seconds, however many keeper surfaces show it. */
export const HEARTBEAT_POLL_MS = 15_000;
/** A known house server that stops answering is asked less and less often: 15 s, 30 s, 1 min … up to 8 min. */
export const HEARTBEAT_BACKOFF_MAX_SKIPS = 31;

/** This browser has seen a house server answer (so the page may ask on its own). */
export const HOUSE_SERVER_SEEN_KEY = "computerpets.houseServer.seen";

/**
 * The browser forgets a house server that has stopped answering: after this many visits in a row where it never
 * answered, or this long since it last answered, the page stops asking on its own (Check still asks).
 */
export const HOUSE_SERVER_FORGET_VISITS = 3;
export const HOUSE_SERVER_FORGET_MS = 3 * 24 * 60 * 60 * 1000;

type SeenStore = { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void; removeItem?: (k: string) => void };

/** What the browser remembers: when the house server last answered, and visits since with no answer. */
export type HouseServerSeen = { at: number; missed: number };

/** Read the record; the first cut stored "1" (seen, time unknown), which reads as seen just now. */
export function readHouseServerSeen(store: SeenStore | null = seenStore(), now = Date.now()): HouseServerSeen | null {
  try {
    const raw = store?.getItem(HOUSE_SERVER_SEEN_KEY);
    if (!raw) return null;
    if (raw === "1") return { at: now, missed: 0 };
    const v = JSON.parse(raw) as Partial<HouseServerSeen> | null;
    const at = Number(v?.at);
    const missed = Number(v?.missed ?? 0);
    if (!Number.isFinite(at) || !Number.isFinite(missed) || missed < 0) return null;
    return { at, missed: Math.floor(missed) };
  } catch {
    return null;
  }
}

function forgetHouseServer(store: SeenStore | null) {
  try {
    if (store?.removeItem) store.removeItem(HOUSE_SERVER_SEEN_KEY);
    else store?.setItem(HOUSE_SERVER_SEEN_KEY, "");
  } catch {
    /* nothing to forget */
  }
}

function seenStore(): SeenStore | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
}

/**
 * A sign a house server runs for this browser: it has answered here, not too long ago, and has not stayed silent for
 * HOUSE_SERVER_FORGET_VISITS visits in a row. A server that stopped for good is forgotten (the record is removed),
 * so a keeper who no longer runs it gets no more refused requests.
 */
export function houseServerSeen(store: SeenStore | null = seenStore(), now = Date.now()): boolean {
  const seen = readHouseServerSeen(store, now);
  if (!seen) return false;
  if (seen.missed >= HOUSE_SERVER_FORGET_VISITS || now - seen.at >= HOUSE_SERVER_FORGET_MS) {
    forgetHouseServer(store);
    return false;
  }
  return true;
}

/** Remember that a house server answered here (now), so later visits ask on their own. */
export function rememberHouseServer(store: SeenStore | null = seenStore(), now = Date.now()): void {
  try {
    store?.setItem(HOUSE_SERVER_SEEN_KEY, JSON.stringify({ at: now, missed: 0 } satisfies HouseServerSeen));
  } catch {
    /* private mode: the keeper presses Check again next time */
  }
}

/** One more visit where the house server never answered (the poll calls it once per page, on its first miss). */
export function houseServerMissed(store: SeenStore | null = seenStore(), now = Date.now()): void {
  const seen = readHouseServerSeen(store, now);
  if (!seen) return;
  try {
    store?.setItem(HOUSE_SERVER_SEEN_KEY, JSON.stringify({ at: seen.at, missed: seen.missed + 1 } satisfies HouseServerSeen));
  } catch {
    /* private mode */
  }
}

type HeartbeatFetch = (url: string, init?: RequestInit) => Promise<{ json: () => Promise<unknown> }>;

export type HeartbeatPoll = {
  current: () => Heartbeat;
  /** True once the house server has answered in this session (any parsed reply, UP or DOWN). */
  answered: () => boolean;
  subscribe: (fn: (beat: Heartbeat) => void) => () => void;
  read: () => Promise<Heartbeat>;
  /** The keeper pressed Check: ask once now, whatever the gate says; an answer turns the regular poll on. */
  check: () => Promise<Heartbeat>;
};

/**
 * An interval that only runs while the page is showing. A hidden tab (another tab in front, a
 * minimized window) pauses it; showing the page again resumes it, and with `onResume` runs the
 * work once right away so a meter or a heartbeat is not a full period stale. It lives beside the
 * heartbeat poll that uses it; with no document (node tests) it just runs.
 */
export type VisibleDoc = {
  hidden: boolean;
  addEventListener: (type: "visibilitychange", fn: () => void) => void;
  removeEventListener: (type: "visibilitychange", fn: () => void) => void;
};

export type EveryVisibleOpts = {
  /** Defaults to the page's document; null means "always showing" (tests, node). */
  doc?: VisibleDoc | null;
  setIntervalImpl?: (fn: () => void, ms: number) => unknown;
  clearIntervalImpl?: (id: unknown) => void;
  /** Run `fn` once when the page shows again, before the interval restarts. */
  onResume?: boolean;
};

function pageDoc(): VisibleDoc | null {
  return typeof document !== "undefined" ? (document as unknown as VisibleDoc) : null;
}

/** Start `fn` every `ms` while the page shows. Returns stop (clears the interval and the listener). */
export function everyVisible(fn: () => void, ms: number, opts: EveryVisibleOpts = {}): () => void {
  const doc = opts.doc === undefined ? pageDoc() : opts.doc;
  const every = opts.setIntervalImpl ?? ((f, m) => setInterval(f, m));
  const clear = opts.clearIntervalImpl ?? ((id) => clearInterval(id as ReturnType<typeof setInterval>));
  let id: unknown = null;
  let stopped = false;
  const start = () => {
    if (id == null && !stopped) id = every(fn, ms);
  };
  const pause = () => {
    if (id != null) {
      clear(id);
      id = null;
    }
  };
  const onVis = () => {
    if (!doc || stopped) return;
    if (doc.hidden) {
      pause();
      return;
    }
    if (id != null) return;
    if (opts.onResume) fn();
    start();
  };
  if (!doc || !doc.hidden) start();
  doc?.addEventListener("visibilitychange", onVis);
  return () => {
    stopped = true;
    pause();
    doc?.removeEventListener("visibilitychange", onVis);
  };
}

/**
 * One shared heartbeat poll: the first subscriber starts one interval, the last one stops it, and every
 * subscriber sees the same beat. An unreachable service reads as UNREAD_HEARTBEAT ("DOWN").
 * `answered()` remembers whether the server ever replied this session, so a keeper who never ran one
 * reads "House server not running (optional)" and DOWN is kept for a server that answered, then stopped.
 * A hidden page pauses the interval; showing it again reads once right away and resumes.
 */
export function createHeartbeatPoll(opts: {
  fetchImpl?: HeartbeatFetch;
  setIntervalImpl?: (fn: () => void, ms: number) => unknown;
  clearIntervalImpl?: (id: unknown) => void;
  url?: string;
  ms?: number;
  /** Defaults to the page's document; null means always showing. */
  doc?: VisibleDoc | null;
  /**
   * Ask on its own only when this says a house server may be running (the page's poll: it answered on this
   * browser before). Without it the poll always asks. A browser prints every refused request to its console
   * (net::ERR_CONNECTION_REFUSED) whatever the page catches, so a keeper who never ran the optional house
   * server should not be asked every 15 seconds: the line says "not checked" and Check asks once.
   */
  gate?: () => boolean;
  /** Called when the server answers (the page remembers it for the next visit). */
  onAnswer?: () => void;
  /** Called once per poll (once per page), on the first read that got no answer, if none has answered yet. */
  onMiss?: () => void;
  /** Ask a known server that stopped answering less often (doubling, up to HEARTBEAT_BACKOFF_MAX_SKIPS ticks). */
  backoff?: boolean;
  /** Clock for the resubscribe guard (a card that remounts does not ask again within one interval). */
  now?: () => number;
} = {}): HeartbeatPoll {
  const fetchImpl: HeartbeatFetch = opts.fetchImpl ?? ((url, init) => fetch(url, init));
  const every = opts.setIntervalImpl ?? ((fn, ms) => setInterval(fn, ms));
  const stop = opts.clearIntervalImpl ?? ((id) => clearInterval(id as ReturnType<typeof setInterval>));
  const url = opts.url ?? HEARTBEAT_URL;
  const ms = opts.ms ?? HEARTBEAT_POLL_MS;
  const subs = new Set<(beat: Heartbeat) => void>();
  let beat: Heartbeat = opts.gate ? UNCHECKED_HEARTBEAT : UNREAD_HEARTBEAT;
  let seen = false;
  let stopPoll: (() => void) | null = null;
  let misses = 0;
  let missTold = false;
  const now = opts.now ?? (() => Date.now());
  let lastRead = Number.NEGATIVE_INFINITY;

  async function read(): Promise<Heartbeat> {
    lastRead = now();
    try {
      const res = await fetchImpl(url, { cache: "no-store" });
      beat = parseHeartbeat(await res.json());
      seen = true;
      misses = 0;
      opts.onAnswer?.();
    } catch {
      beat = { ...UNREAD_HEARTBEAT };
      misses += 1;
      if (!seen && !missTold) {
        missTold = true;
        opts.onMiss?.();
      }
    }
    for (const fn of subs) fn(beat);
    return beat;
  }

  // The wait before the next read: one interval, or with backoff 2, 4, 8 … up to 32 intervals after misses in a row.
  const waitMs = () => (opts.backoff ? ms * Math.min(2 ** misses, HEARTBEAT_BACKOFF_MAX_SKIPS + 1) : ms);
  // Half an interval of slack, so a timer that fires a little early still counts.
  const due = () => now() - lastRead >= waitMs() - ms / 2;

  // One tick of the regular poll: a known server that stopped answering is skipped for a while (backoff).
  function tick() {
    if (opts.backoff && !due()) return;
    void read();
  }

  function startPoll() {
    if (stopPoll) return;
    stopPoll = everyVisible(tick, ms, {
      doc: opts.doc,
      setIntervalImpl: every,
      clearIntervalImpl: stop,
      onResume: true,
    });
  }

  return {
    current: () => beat,
    answered: () => seen,
    read,
    async check() {
      const got = await read();
      if (seen && subs.size) startPoll();
      return got;
    },
    subscribe(fn) {
      subs.add(fn);
      fn(beat);
      if (subs.size === 1 && (!opts.gate || opts.gate() || seen)) {
        // A card that remounts (a page change, a re-render) does not ask again inside one interval or a backoff.
        if (due()) void read();
        startPoll();
      }
      return () => {
        subs.delete(fn);
        if (!subs.size && stopPoll) {
          stopPoll();
          stopPoll = null;
        }
      };
    },
  };
}

/** The pet art's accessible name: the guest's name and what they are doing that a keeper could see. */
export function petArtLabel(name: string, state: { hidden?: boolean; asleep?: boolean; unwell?: boolean; speech?: string | null } = {}): string {
  const doing = state.hidden ? "hiding" : state.asleep ? "asleep" : state.unwell ? "unwell" : "";
  const base = doing ? `${name}, ${doing}` : name;
  return state.speech ? `${base}, saying "${state.speech}"` : base;
}

/** The companion room's accessible name. */
export function roomLabel(name: string): string {
  return `${name}'s room`;
}

/**
 * The pet's hit area as a button: its accessible name. The room's tap opens the keeper card and the
 * sit choice; a blotter or hive guest's tap picks them; a visitor or floor walker's tap says hello.
 * `state` (the art label, or "chosen") rides along in brackets.
 */
export function petTapLabel(name: string, act: "choice" | "pick" | "hello", state = ""): string {
  const base = act === "choice" ? `Choose what ${name} does` : act === "pick" ? `Pick ${name}` : `Say hello to ${name}`;
  return state && state !== name ? `${base} (${state})` : base;
}

/** Enter or Space on the pet's hit area is a tap (held-key repeats are not). */
export function isTapKey(key: string, repeat = false): boolean {
  if (repeat) return false;
  return key === "Enter" || key === " " || key === "Spacebar";
}

/** True when a read at `at` is older than `ms` (or never happened): the news plate reads once on return only then. */
export function isStale(at: number | null, now: number, ms: number): boolean {
  return at == null || now - at >= ms;
}

/**
 * Arrow keys inside one roving group (the sit menu, the walkers on /meet): Right or Down steps forward,
 * Left or Up steps back, both wrap; Home and End jump to the ends. Returns the index to focus, or -1
 * when the key is not a move (Tab and every other key are left to the page).
 */
export function rovingIndex(key: string, at: number, count: number): number {
  if (count <= 0) return -1;
  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      return at < 0 ? 0 : (at + 1) % count;
    case "ArrowLeft":
    case "ArrowUp":
      return at <= 0 ? count - 1 : at - 1;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return -1;
  }
}

/**
 * Arrow keys on a plate's tabs (a horizontal tablist), the same as the overlay's keeper.js rovingIndex:
 * Right and Left step (wrapping), Home and End jump; Up and Down are left to the page. Returns the tab
 * index to focus, or -1 when the key is not a move. The tab is picked with Enter or Space (a click).
 */
export function tabKey(key: string, at: number, count: number): number {
  if (key !== "ArrowRight" && key !== "ArrowLeft" && key !== "Home" && key !== "End") return -1;
  return rovingIndex(key, at, count);
}

/** A key inside the sit menu: "close" for Escape, the index to focus for a move, or null for anything else. */
export function menuKey(key: string, at: number, count: number): number | "close" | null {
  if (key === "Escape" || key === "Esc") return "close";
  const next = rovingIndex(key, at, count);
  return next < 0 ? null : next;
}

export type VisibleTimelineOpts = {
  /** Defaults to the page's document; null means "always showing" (tests, node). */
  doc?: VisibleDoc | null;
  setTimeoutImpl?: (fn: () => void, ms: number) => unknown;
  clearTimeoutImpl?: (id: unknown) => void;
  now?: () => number;
};

/**
 * Steps that run at set points of shown time: each `at` ms after the start, counting only while the page
 * shows. A hidden tab freezes the clock and showing it again picks up where it stopped, so a visitor who
 * was about to walk in still walks in when the keeper is back. Returns stop.
 */
export function visibleTimeline(
  steps: ReadonlyArray<{ at: number; run: () => void }>,
  opts: VisibleTimelineOpts = {},
): () => void {
  const doc = opts.doc === undefined ? pageDoc() : opts.doc;
  const later = opts.setTimeoutImpl ?? ((f, m) => setTimeout(f, m));
  const clear = opts.clearTimeoutImpl ?? ((id) => clearTimeout(id as ReturnType<typeof setTimeout>));
  const now = opts.now ?? (() => Date.now());
  const queue = [...steps].sort((a, b) => a.at - b.at);
  let shown = 0;
  let since = 0;
  let id: unknown = null;
  let next = 0;
  let stopped = false;
  const arm = () => {
    if (stopped || id != null || next >= queue.length || (doc && doc.hidden)) return;
    since = now();
    id = later(fire, Math.max(0, queue[next]!.at - shown));
  };
  const fire = () => {
    id = null;
    shown = Math.max(shown + (now() - since), queue[next]!.at);
    while (!stopped && next < queue.length && queue[next]!.at <= shown) queue[next++]!.run();
    arm();
  };
  const pause = () => {
    if (id == null) return;
    clear(id);
    id = null;
    shown += now() - since;
  };
  const onVis = () => {
    if (!doc || stopped) return;
    if (doc.hidden) pause();
    else arm();
  };
  arm();
  doc?.addEventListener("visibilitychange", onVis);
  return () => {
    stopped = true;
    pause();
    doc?.removeEventListener("visibilitychange", onVis);
  };
}

/**
 * The page's one heartbeat poll. It starts on the first subscribe (in an effect), never at import, and only
 * when a house server answered on this browser before; otherwise nothing is asked until the keeper presses
 * Check, so a keeper who never ran the optional house server sees no refused requests in the console.
 */
export const heartbeatPoll = createHeartbeatPoll({
  gate: () => houseServerSeen(),
  onAnswer: () => rememberHouseServer(),
  onMiss: () => houseServerMissed(),
  backoff: true,
});

export function formatUptime(seconds: number | null) {
  if (seconds == null) return "";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (hours < 48) return rem ? `${hours}h ${rem}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

/** The heartbeat line before the page has asked (no sign of a house server yet). The keeper card offers Check. */
export const HOUSE_SERVER_UNCHECKED = "House server not checked (optional)";
/** The heartbeat line before the house server has ever answered this session. Plain and calm: it is optional. */
export const NO_HOUSE_SERVER = "House server not running (optional)";
/** The house server answered this session, then stopped (or said it is down). Same words on the overlay. */
export const HOUSE_SERVER_STOPPED = "House server stopped answering (optional). Pets still work.";
/** The house server is answering; "· up 2h" follows when it says how long. Same words on the overlay. */
export const HOUSE_SERVER_UP = "House server running";
/** The keeper card's care line: plain words for "care never goes to the house server". */
export const CARE_TRUTH = "Your pet's care stays on this computer.";

/**
 * The keeper card's heartbeat line, in plain words. `answered` is whether the server replied this session:
 * until it has, a DOWN beat reads NO_HOUSE_SERVER; HOUSE_SERVER_STOPPED is kept for a server that answered
 * and then stopped. Ports, the profile, and raw UP/DOWN live in heartbeatDetail (the line's tooltip).
 */
export function heartbeatLine(beat: Heartbeat, answered = true) {
  if (beat.checked === false) return HOUSE_SERVER_UNCHECKED;
  if (!answered && beat.status !== "UP") return NO_HOUSE_SERVER;
  if (beat.status !== "UP") return HOUSE_SERVER_STOPPED;
  const up = formatUptime(beat.uptimeSeconds);
  return up ? `${HOUSE_SERVER_UP} · up ${up}` : HOUSE_SERVER_UP;
}

/**
 * The heartbeat line's tone, for its `data-heartbeat` attribute (same values as the overlay row).
 * "OFF": never answered this session. The server is optional, so this is neutral, not a warning.
 * "DOWN": it answered this session, then stopped. Only this one is styled as a warning.
 * "UP": running.
 */
export type HeartbeatTone = "UP" | "DOWN" | "OFF";
export function heartbeatTone(beat: Heartbeat, answered = true): HeartbeatTone {
  if (beat.status === "UP") return "UP";
  return answered ? "DOWN" : "OFF";
}

/** The technical detail behind the heartbeat line, for its tooltip only: "Java 8081 · UP · local · 2m". */
export function heartbeatDetail(beat: Heartbeat) {
  const port = beat.port ?? JAVA_PORT;
  const bits = [`Java ${port}`, beat.checked === false ? "not checked" : beat.status];
  if (beat.profile) bits.push(beat.profile);
  const up = formatUptime(beat.uptimeSeconds);
  if (up) bits.push(up);
  return bits.join(" · ");
}

export function careTruth() {
  return CARE_TRUTH;
}

export type KeeperMeters = {
  hunger: number;
  rest: number;
  bond: number;
  bondTitle: string;
};

export function keeperMeters(stats: Pick<CareStats, "hunger" | "energy" | "bond">): KeeperMeters {
  return {
    hunger: stats.hunger,
    rest: stats.energy,
    bond: stats.bond,
    bondTitle: bondTitle(stats.bond),
  };
}

/** One house face: name, stage, bond title, meters. Not a nametag. */
export function keeperPoster(
  name: string,
  stage: string,
  stats: Pick<CareStats, "hunger" | "energy" | "bond">,
  beat: Heartbeat = UNREAD_HEARTBEAT,
) {
  const meters = keeperMeters(stats);
  return {
    kicker: KEEPER_KICKER,
    name,
    stage,
    bondTitle: meters.bondTitle,
    hunger: meters.hunger,
    rest: meters.rest,
    bond: meters.bond,
    verbs: KEEPER_CARE.map((verb) => verb.id),
    heartbeat: heartbeatLine(beat),
    truth: careTruth(),
    voiceTruth: VOICE_TRUTH,
    quitTruth: QUIT_TRUTH,
  };
}

export const GRID_LIVE = [
  { key: "cyber_dragon", name: "Arc", slug: "arc" },
  { key: "volt_dragon", name: "Volt", slug: "volt" },
  { key: "trace_dragon", name: "Trace", slug: "trace" },
  { key: "flux_dragon", name: "Flux", slug: "flux" },
  { key: "spark_dragon", name: "Spark", slug: "crackle" },
  { key: "ion_dragon", name: "Ion", slug: "ion" },
  { key: "gauss_dragon", name: "Gauss", slug: "gauss" },
  { key: "relay_dragon", name: "Relay", slug: "relay" },
  { key: "fuse_dragon", name: "Fuse", slug: "fuse" },
  { key: "ground_dragon", name: "Ground", slug: "ground" },
] as const;
