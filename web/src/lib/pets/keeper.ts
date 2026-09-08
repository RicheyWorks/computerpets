import { bondTitle, type CareStats } from "./care.ts";

/** Java listens here. The living desk keeps 8080. */
export const JAVA_PORT = 8081;
export const DESK_PORT = 8080;

/** Quiet public door. Not /actuator rooms. Not /pet/feed. */
export const HEARTBEAT_URL = `http://127.0.0.1:${JAVA_PORT}/api/public/heartbeat`;

/** Advertised X-ad routes. They are the contract to grow into, not doors we ship. */
export const ADVERTISED_CARE = {
  feed: "/pet/feed",
  play: "/pet/play",
  rest: "/pet/rest",
} as const;

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
export const VOICE_TRUTH = "Rui, Soot, Wedge, Heart, Hook, Dee, Brick, and Drake talk with house cry first; system speech is the backup.";
export const QUIT_TRUTH = "Turns the overlay off. Start again with .\\desktop.ps1.";

export type HeartbeatStatus = "UP" | "DOWN";

export type Heartbeat = {
  status: HeartbeatStatus;
  profile: string | null;
  uptimeSeconds: number | null;
  port: number | null;
  careDoor: "local";
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

export function formatUptime(seconds: number | null) {
  if (seconds == null) return "unread";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (hours < 48) return rem ? `${hours}h ${rem}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function heartbeatLine(beat: Heartbeat) {
  const profile = beat.profile ?? "unread";
  const up = formatUptime(beat.uptimeSeconds);
  const port = beat.port ?? JAVA_PORT;
  return `Java ${port} · ${beat.status} · ${profile} · ${up}`;
}

export function careTruth() {
  return "Care is local. /pet/feed is not a door.";
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
