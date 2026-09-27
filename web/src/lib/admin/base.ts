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
