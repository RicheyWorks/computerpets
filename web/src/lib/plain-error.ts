/**
 * One plain sentence for any error a keeper can see on the web desk.
 *
 * The house's own deliberate lines ("Need 40 ember to hatch…", "The first guest
 * is not in this house.") are thrown as `HouseError` and pass through unchanged.
 * Everything else — ECONNREFUSED, Postgres/PGLite errors, "fetch failed",
 * timeouts, HTTP 5xx / 429, validation dumps — becomes one plain sentence, and
 * the raw error goes to the log (server console for server functions, the
 * browser console for the page). Raw text never reaches the rendered page.
 *
 * Dependency-free on purpose so node tests can import it directly.
 */

export const HOUSE_ERROR_NAME = "HouseError";

/**
 * A deliberate, user-facing line. It survives the server-function wire:
 * TanStack Start serializes thrown errors with seroval, which keeps `name` and
 * every own property, so `house: true` arrives in the browser intact.
 */
export class HouseError extends Error {
  readonly house = true;
  constructor(message: string) {
    super(message);
    this.name = HOUSE_ERROR_NAME;
  }
}

export function isHouseError(err: unknown): err is Error {
  if (!err || typeof err !== "object") return false;
  const e = err as { name?: unknown; house?: unknown; message?: unknown };
  return (e.house === true || e.name === HOUSE_ERROR_NAME) && typeof e.message === "string" && e.message.length > 0;
}

export type PlainKind =
  | "house"
  | "signin"
  | "blocked"
  | "tls"
  | "not_found"
  | "timeout"
  | "unreachable"
  | "database"
  | "busy"
  | "server"
  | "invalid"
  | "unknown";

export const PLAIN_LINES: Record<Exclude<PlainKind, "house" | "unknown">, string> = {
  signin: "Sign in to do that.",
  blocked: "That request was blocked because it came from another site.",
  tls: "Couldn't make a secure connection to the house server.",
  not_found: "Couldn't find the house server. Check the address.",
  timeout: "The house server took too long to answer. Try again in a moment.",
  unreachable: "Couldn't reach the house server. Check your connection and try again.",
  database: "The house records aren't answering right now. Try again in a moment.",
  busy: "The house is busy right now. Try again in a minute.",
  server: "The house server had a problem. Try again later.",
  invalid: "That request didn't look right. Reload the page and try again.",
};

export const UNKNOWN_LINE = "Something went wrong. Try again in a moment.";

const TLS = /\b(CERT_[A-Z_]+|UNABLE_TO_VERIFY_LEAF_SIGNATURE|UNABLE_TO_GET_ISSUER_CERT(?:_LOCALLY)?|DEPTH_ZERO_SELF_SIGNED_CERT|SELF_SIGNED_CERT_IN_CHAIN|ERR_TLS_[A-Z_]+|ERR_SSL_[A-Z_]+)\b|certificate/i;
const NOT_FOUND = /\b(ENOTFOUND|EAI_AGAIN|EAI_NONAME)\b|getaddrinfo/i;
const TIMEOUT = /\b(ETIMEDOUT|ESOCKETTIMEDOUT|UND_ERR_CONNECT_TIMEOUT|UND_ERR_HEADERS_TIMEOUT|UND_ERR_BODY_TIMEOUT|TimeoutError|AbortError|ABORT_ERR)\b|timed? ?out|timeout exceeded|was aborted/i;
const UNREACHABLE = /\b(ECONNREFUSED|ECONNRESET|EHOSTUNREACH|ENETUNREACH|EPIPE|UND_ERR_SOCKET)\b|fetch failed|failed to fetch|networkerror|load failed|network request failed|socket hang up|connection terminated/i;
const DATABASE = /relation "[^"]*" does not exist|column "[^"]*" does not exist|duplicate key value|violates [a-z ]*constraint|syntax error at or near|password authentication failed|database "[^"]*" does not exist|too many clients|terminating connection|pglite|DatabaseError|could not serialize access/i;
const BUSY = /\b429\b|too many requests|rate limit/i;
const SERVER = /\b50[0-9]\b|internal server error|bad gateway|service unavailable|gateway timeout/i;
const PG_CODE = /^[0-9A-Z]{5}$/;

type Loose = {
  name?: unknown;
  code?: unknown;
  message?: unknown;
  status?: unknown;
  statusCode?: unknown;
  httpStatus?: unknown;
  severity?: unknown;
  routine?: unknown;
  issues?: unknown;
  cause?: unknown;
};

/** Every raw string an error carries: name, code, message, and its cause chain. */
export function rawText(err: unknown): string {
  if (err == null) return "";
  if (typeof err === "string") return err;
  if (typeof err !== "object") return String(err);
  const bits: string[] = [];
  const seen = new Set<unknown>();
  let cur: unknown = err;
  for (let depth = 0; cur && depth < 4 && !seen.has(cur); depth += 1) {
    seen.add(cur);
    if (typeof cur === "string") {
      bits.push(cur);
      break;
    }
    if (typeof cur !== "object") break;
    const e = cur as Loose;
    for (const v of [e.name, e.code, e.message]) {
      if (typeof v === "string" || typeof v === "number") bits.push(String(v));
    }
    cur = e.cause;
  }
  return bits.join(" ");
}

function statusOf(err: unknown): number {
  if (!err || typeof err !== "object") return 0;
  const e = err as Loose;
  for (const v of [e.status, e.statusCode, e.httpStatus]) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return 0;
}

function isPgError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as Loose;
  return typeof e.code === "string" && PG_CODE.test(e.code) && (typeof e.severity === "string" || typeof e.routine === "string");
}

function isValidation(err: unknown, text: string): boolean {
  if (err && typeof err === "object") {
    const e = err as Loose;
    if (e.name === "ZodError" || Array.isArray(e.issues)) return true;
  }
  return /^\s*\[\s*\{[\s\S]*"code"\s*:/.test(text) || /\binvalid input\b/i.test(text);
}

/** Which plain sentence an error gets. `house` means its own message is shown as-is. */
export function classify(err: unknown): PlainKind {
  if (isHouseError(err)) return "house";
  const name = err && typeof err === "object" ? (err as Loose).name : undefined;
  const message = err && typeof err === "object" ? (err as Loose).message : err;
  const status = statusOf(err);
  if (name === "UnauthorizedError" || message === "Unauthorized" || status === 401) return "signin";
  if (name === "CrossSiteRequestError" || (status === 403 && typeof message === "string" && message.startsWith("Forbidden"))) {
    return "blocked";
  }
  const text = rawText(err);
  if (TLS.test(text)) return "tls";
  if (NOT_FOUND.test(text)) return "not_found";
  if (TIMEOUT.test(text) || (typeof name === "string" && /Timeout$/.test(name))) return "timeout";
  if (UNREACHABLE.test(text)) return "unreachable";
  if (isPgError(err) || DATABASE.test(text)) return "database";
  if (status === 429 || BUSY.test(text)) return "busy";
  if (status >= 500 || SERVER.test(text)) return "server";
  if (isValidation(err, text)) return "invalid";
  return "unknown";
}

export type PlainLog = (label: string, err: unknown) => void;

const consoleLog: PlainLog = (label, err) => {
  console.error(label, err);
};

/**
 * The one sentence a keeper sees for `err`. House lines pass through; anything
 * else is logged raw and replaced. `fallback` is the surface's own line for an
 * error nothing recognizes (e.g. "The draw failed.").
 */
export function plainMessage(err: unknown, fallback: string = UNKNOWN_LINE, log: PlainLog = consoleLog): string {
  const kind = classify(err);
  if (kind === "house") return (err as Error).message;
  log(`[plain-error] ${kind}:`, err);
  if (kind === "unknown") return fallback || UNKNOWN_LINE;
  return PLAIN_LINES[kind];
}

/** What a page could not load, said before the plain reason. */
export const LOAD_LINES = {
  kennel: "Couldn't load your kennel.",
  ember: "Couldn't load your ember.",
  desk: "Couldn't load your guests for the desk.",
  signin: "Couldn't start sign-in.",
  nest: "Couldn't load the nest.",
} as const;

export type LoadWhat = keyof typeof LOAD_LINES;

/** The retry button's words, one place for every load problem. */
export const RETRY_LABEL = "Try again";

/**
 * "Couldn't load your kennel." plus the plain reason, for a page whose first load
 * failed. House lines pass through; anything else is logged raw and replaced, so a
 * failed load never passes for an empty kennel, zero ember, or the default guest.
 */
export function loadProblem(what: LoadWhat, err: unknown, log: PlainLog = consoleLog): string {
  return `${LOAD_LINES[what]} ${plainMessage(err, "Try again in a moment.", log)}`;
}

/** A care act the house could not save: said plainly, and the meters stay where they were. */
export const CARE_NOT_SAVED = {
  play: "The play wasn't saved, so the meters didn't change.",
  feed: "The feeding wasn't saved, so the meters didn't change.",
  rest: "The rest wasn't saved, so the meters didn't change.",
  clean: "The cleaning wasn't saved, so the meters didn't change.",
  medicine: "The medicine wasn't saved, so the meters didn't change.",
} as const;

export type CareNotSavedAct = keyof typeof CARE_NOT_SAVED;

/**
 * True when the companion room itself says a failed save (its quiet line with Try again), so the page
 * around it must not also toast it. Anything else (a shed, say) the page still reports.
 */
export function roomReportsCare(action: string): action is CareNotSavedAct {
  return Object.prototype.hasOwnProperty.call(CARE_NOT_SAVED, action);
}

/** "The feeding wasn't saved…" plus the plain reason. Raw text goes to the log only. */
export function careNotSaved(act: CareNotSavedAct, err: unknown, log: PlainLog = consoleLog): string {
  return `${CARE_NOT_SAVED[act]} ${plainMessage(err, "Try again in a moment.", log)}`;
}

/** Why a mind (AI plugin) test did not answer, in plain words. */
export const MIND_LINES = {
  key: "The mind's service did not accept the API key. Check the key for this plugin.",
  busy: "The mind's service is rate limiting this key right now. Try again in a minute.",
  address: "The mind's service answered, but not at that address or for that model. Check the Base URL and the model.",
  server: "The mind's service had a problem. Try again later.",
  timeout: "The mind took too long to answer.",
  unreachable: "Couldn't reach the mind's service. Check the Base URL and that the service is running.",
  not_found: "Couldn't find the mind's service. Check the Base URL.",
  tls: "Couldn't make a secure connection to the mind's service.",
  url: "The Base URL was refused before anything was sent. Use an https address (http only for a mind on this computer) with no name or password in it.",
  empty: "The mind answered with nothing.",
  unknown: "Something went wrong on the way to the mind's service.",
} as const;

export type MindProblemKind = keyof typeof MIND_LINES;

/** Plugin failures (web/src/lib/ai/complete.ts) read "<plugin> <status>"; safe-url refusals are short words. */
const MIND_STATUS = /^[\w.-]+ (\d{3})$/;
const MIND_URL_REFUSED = /^(missing url|bad url|userinfo|protocol|localhost blocked|https only|private host)$/;

/** Which plain reason a mind test failure gets. */
export function mindProblemKind(err: unknown): MindProblemKind {
  const e = err && typeof err === "object" ? (err as Loose) : null;
  const message = (typeof err === "string" ? err : typeof e?.message === "string" ? e.message : "").trim();
  const hit = MIND_STATUS.exec(message);
  const status = hit ? Number(hit[1]) : statusOf(err);
  if (status === 401 || status === 403) return "key";
  if (status === 429) return "busy";
  if (status === 404) return "address";
  if (status >= 500) return "server";
  if (MIND_URL_REFUSED.test(message)) return "url";
  if (message === "empty") return "empty";
  const kind = classify(err);
  if (kind === "tls" || kind === "not_found" || kind === "timeout" || kind === "unreachable") return kind;
  if (kind === "busy") return "busy";
  if (kind === "server") return "server";
  return "unknown";
}

/**
 * The Minds page test line when the mind did not answer: the plain reason, then the promise that
 * house lines still speak. The raw error goes to the log only.
 */
export function mindProblem(err: unknown, log: PlainLog = consoleLog): string {
  log("[mind] test did not answer:", err);
  return `The mind did not answer. ${MIND_LINES[mindProblemKind(err)]} House lines will.`;
}

/** A talk turn that failed: the pet still says a house line, and this quiet line says why. */
export const TALK_LINES = {
  mind: "The mind did not answer, so that was a house line.",
  house: "The talk didn't reach the house, so that was a house line.",
} as const;

/**
 * Why a companion-room talk turn fell back to a house line. When a plugin was involved (a mind other
 * than the house, or a server voice) the Minds reasons apply (key, rate limit, address, timeout…);
 * otherwise the plain house reason. The raw error goes to the log only.
 */
export function talkProblem(err: unknown, viaPlugin: boolean, log: PlainLog = consoleLog): string {
  if (viaPlugin) {
    log("[talk] the mind did not answer:", err);
    return `${TALK_LINES.mind} ${MIND_LINES[mindProblemKind(err)]}`;
  }
  return `${TALK_LINES.house} ${plainMessage(err, "Try again in a moment.", log)}`;
}

/** Sound the keeper turned on that did not play. */
export const SOUND_LINES = {
  music: "Couldn't play the music.",
  sleep: "Couldn't play the sleep sounds.",
} as const;

export type SoundWhat = keyof typeof SOUND_LINES;

export const SOUND_REASONS = {
  blocked: "The browser is holding sound until you click or tap the page.",
  unsupported: "This browser can't play that sound or station.",
  unreachable: "Couldn't reach the station. Check your connection.",
  unknown: "Try again in a moment.",
} as const;

const quietLog: PlainLog = () => {};

/**
 * True when play() was cut short on purpose (the sound was paused, switched, or the card closed).
 * That is not a failure and says nothing.
 */
export function soundInterrupted(err: unknown): boolean {
  const name = err && typeof err === "object" ? (err as Loose).name : undefined;
  return name === "AbortError";
}

/** "Couldn't play the music." plus why (browser holding sound, format, network). Raw error to the log only. */
export function soundProblem(what: SoundWhat, err: unknown, log: PlainLog = consoleLog): string {
  log(`[sound] ${what} did not play:`, err);
  const name = err && typeof err === "object" ? (err as Loose).name : undefined;
  if (name === "NotAllowedError") return `${SOUND_LINES[what]} ${SOUND_REASONS.blocked}`;
  if (name === "NotSupportedError") return `${SOUND_LINES[what]} ${SOUND_REASONS.unsupported}`;
  const kind = classify(err);
  if (kind === "unreachable" || kind === "not_found" || kind === "timeout" || kind === "tls") {
    return `${SOUND_LINES[what]} ${SOUND_REASONS.unreachable}`;
  }
  if (kind === "house") return `${SOUND_LINES[what]} ${plainMessage(err, SOUND_REASONS.unknown, quietLog)}`;
  return `${SOUND_LINES[what]} ${SOUND_REASONS.unknown}`;
}

/** A desk plate (forecast, headlines, price) that could not load. */
export const PLATE_LINES = {
  forecast: "Couldn't load the forecast.",
  headlines: "Couldn't load the headlines.",
  newer: "Couldn't load newer headlines; these are from earlier.",
  price: "Couldn't load the price.",
  floor: "Couldn't load the floor price.",
} as const;

export type PlateWhat = keyof typeof PLATE_LINES;

/** Plates read outside services (Open-Meteo, Wikipedia, RSS, CoinGecko, Yahoo), so no "house server" words. */
export const PLATE_REASONS = {
  timeout: "The service took too long to answer.",
  unreachable: "Couldn't reach the service. Check your connection.",
  answer: "The service answered with something the plate couldn't read.",
  unknown: "Try again in a moment.",
} as const;

/**
 * "Couldn't load the forecast." plus a plain reason. `err` null means the service answered but the plate
 * could not read it (an error page, a rate-limit body, an empty feed). Raw error to the log only.
 */
export function plateProblem(what: PlateWhat, err: unknown, log: PlainLog = consoleLog): string {
  if (err == null) return `${PLATE_LINES[what]} ${PLATE_REASONS.answer}`;
  log(`[plate] ${what} did not load:`, err);
  const kind = classify(err);
  const reason =
    kind === "timeout"
      ? PLATE_REASONS.timeout
      : kind === "unreachable" || kind === "not_found" || kind === "tls"
        ? PLATE_REASONS.unreachable
        : PLATE_REASONS.unknown;
  return `${PLATE_LINES[what]} ${reason}`;
}

/**
 * Server side: log the raw error and hand back a HouseError carrying only the
 * plain sentence (no cause, no code), so nothing raw crosses the wire.
 */
export function toHouseError(err: unknown, fallback: string = UNKNOWN_LINE, log: PlainLog = consoleLog): HouseError {
  if (err instanceof HouseError) return err;
  if (isHouseError(err)) return new HouseError((err as Error).message);
  return new HouseError(plainMessage(err, fallback, log));
}