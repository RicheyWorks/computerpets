/**
 * Pure helpers for the admin ledger page: which license-service address to start
 * from, whether an answer really came from the ComputerPets license service, and
 * how a ledger timestamp reads in the viewer's own time.
 *
 * Dependency-free on purpose so node tests can import it directly.
 */

/** The Java license service on a developer's own computer. Used only when the page itself is local. */
export const DEV_API_BASE = "http://localhost:8081";

/** Said when an address answers but is not the ComputerPets license service (404, or not a license list). */
export const NOT_LICENSE_SERVICE =
  "That address answered, but it isn't the ComputerPets license service. Check the License service address.";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

function trimBase(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

/**
 * Where the License service field starts:
 * 1. `configured` (VITE_LICENSE_API_URL at build time), when it is an http(s) address;
 * 2. the page's own origin, when the page is served from a real host (the service sits behind the same site);
 * 3. DEV_API_BASE, only when the page itself runs on this computer (local development).
 * The field stays editable either way.
 */
export function pickApiBase(configured: string | undefined | null, origin: string | undefined | null): string {
  const set = typeof configured === "string" ? trimBase(configured) : "";
  if (/^https?:\/\/[^/\s]+/i.test(set)) return set;
  const here = typeof origin === "string" ? trimBase(origin) : "";
  if (/^https?:\/\//i.test(here)) {
    try {
      const host = new URL(here).hostname;
      if (!LOCAL_HOSTS.has(host)) return here;
    } catch {
      // not a URL; fall through to the dev address
    }
  }
  return DEV_API_BASE;
}

/** True when `body` is the ledger list the license service returns (an array of rows with a string jti). */
export function isLicenseList(body: unknown): boolean {
  return Array.isArray(body) && body.every((row) => !!row && typeof row === "object" && typeof (row as { jti?: unknown }).jti === "string");
}

/** True when `body` is one ledger row (an object with a string jti), as GET /api/admin/licenses/{jti} returns. */
export function isLicenseRow(body: unknown): boolean {
  return !!body && typeof body === "object" && !Array.isArray(body) && typeof (body as { jti?: unknown }).jti === "string";
}

/**
 * True when a 404 is the license service's own "no such license" answer
 * ({"error":"license not found", ...}). Any other 404 came from something else.
 */
export function isLicenseMissing(body: unknown): boolean {
  if (!body || typeof body !== "object" || Array.isArray(body)) return false;
  const error = (body as { error?: unknown }).error;
  return typeof error === "string" && /\blicense not found\b/i.test(error);
}

/**
 * True when a revoke 404 is the license service's own "not found or already revoked" answer
 * ({"revoked":false, ...}). Any other 404 came from something else.
 */
export function isRevokeMiss(body: unknown): boolean {
  return !!body && typeof body === "object" && !Array.isArray(body) && (body as { revoked?: unknown }).revoked === false;
}

/**
 * True when a revoke 200 is the license service's own confirmation for this jti
 * ({"revoked":true, "jti":<the same jti>, ...}). Any other 200 came from something else.
 */
export function isRevokeDone(body: unknown, jti: string): boolean {
  if (!body || typeof body !== "object" || Array.isArray(body)) return false;
  const row = body as { revoked?: unknown; jti?: unknown };
  return row.revoked === true && typeof row.jti === "string" && row.jti === jti;
}

/** Said after the ledger confirmed a revoke and the list came back. */
export const REVOKED_NOTE =
  "License revoked and soft-deleted. Downloads for this jti stop immediately. The row stays on the ledger.";

/**
 * Said after the ledger confirmed a revoke but the list refresh failed: the revoke stands, only the
 * list is stale. `reason` is the plain reason for the refresh (never raw text).
 */
export function revokedListStale(reason: string): string {
  return `License revoked. Downloads for this jti stop immediately. The list couldn't refresh: ${reason} This row is marked revoked here, and the list reads again in a few seconds.`;
}

/** How long after a stale list the ledger page reads the list once more (or sooner, on focus). */
export const STALE_REREAD_MS = 5_000;

type FocusTarget = {
  addEventListener: (type: "focus", fn: () => void) => void;
  removeEventListener: (type: "focus", fn: () => void) => void;
};

/**
 * Run `run` once: after `ms`, or when the window next gets focus, whichever comes first. Returns
 * cancel (a new search, a lock, or leaving the page cancels it). Never runs twice.
 */
export function rereadOnce(
  run: () => void,
  opts: {
    ms?: number;
    target?: FocusTarget | null;
    setTimeoutImpl?: (fn: () => void, ms: number) => unknown;
    clearTimeoutImpl?: (id: unknown) => void;
  } = {},
): () => void {
  const target = opts.target === undefined ? (typeof window !== "undefined" ? (window as unknown as FocusTarget) : null) : opts.target;
  const later = opts.setTimeoutImpl ?? ((fn, ms) => setTimeout(fn, ms));
  const clear = opts.clearTimeoutImpl ?? ((id) => clearTimeout(id as ReturnType<typeof setTimeout>));
  let done = false;
  const fire = () => {
    if (done) return;
    cancel();
    run();
  };
  const id = later(fire, opts.ms ?? STALE_REREAD_MS);
  target?.addEventListener("focus", fire);
  function cancel() {
    if (done) return;
    done = true;
    clear(id);
    target?.removeEventListener("focus", fire);
  }
  return cancel;
}

/** The ledger list's accessible name (a screen reader's caption for the rows below the search). */
export function ledgerCaption(count: number): string {
  if (count === 0) return "Licenses: none shown";
  return count === 1 ? "Licenses: 1 shown" : `Licenses: ${count} shown`;
}

/** Where focus lands when the page opens or locks: the search when unlocked, the admin key when locked. */
export function focusAfterGate(unlocked: boolean): "search" | "key" {
  return unlocked ? "search" : "key";
}

/**
 * Focus while a revoke is asked: Revoke opens the ask and focus goes to Confirm revoke; Keep (or Escape)
 * puts it back on that row's Revoke. null leaves focus where it is (a confirmed revoke, a lock).
 */
export function revokeAskFocus(pending: string | null, kept: string | null): "confirm" | "revoke" | null {
  if (pending) return "confirm";
  return kept ? "revoke" : null;
}

/** The rows with `jti` marked revoked locally, for when the ledger confirmed it but the list did not refresh. */
export function markRevoked<T extends { jti: string; revoked: boolean; deleted: boolean }>(rows: T[], jti: string): T[] {
  return rows.map((row) => (row.jti === jti ? { ...row, revoked: true, deleted: true } : row));
}

/**
 * A ledger timestamp in the viewer's local time (text), with the exact ISO instant kept for a tooltip.
 * `locale` / `timeZone` default to the viewer's; tests pin them.
 */
export function formatLocalWhen(
  value: string,
  opts: { locale?: string; timeZone?: string } = {},
): { text: string; iso: string } {
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) return { text: value, iso: value };
  const at = new Date(ms);
  const text = new Intl.DateTimeFormat(opts.locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: opts.timeZone,
  }).format(at);
  return { text, iso: at.toISOString().replace(".000Z", "Z") };
}
