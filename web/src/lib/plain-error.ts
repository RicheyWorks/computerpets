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

/**
 * Server side: log the raw error and hand back a HouseError carrying only the
 * plain sentence (no cause, no code), so nothing raw crosses the wire.
 */
export function toHouseError(err: unknown, fallback: string = UNKNOWN_LINE, log: PlainLog = consoleLog): HouseError {
  if (err instanceof HouseError) return err;
  if (isHouseError(err)) return new HouseError((err as Error).message);
  return new HouseError(plainMessage(err, fallback, log));
}