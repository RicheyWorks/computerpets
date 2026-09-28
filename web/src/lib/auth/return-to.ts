/**
 * Where a visitor goes after signing in: back to the page that sent them to sign in, never somewhere else.
 *
 * A gated page (the kennel, the hatchery, the nest, a pet page) sends a signed-out visitor to
 * `/login?next=<that page>`. Sign-in used to end on the desk every time (`callbackURL: "/"`); now it returns to
 * `next`, but only when `next` is a same-site path. Anything that could leave the site, or trick a browser into
 * leaving it, falls back to the desk: an absolute URL (`https://…`), a protocol-relative one (`//evil.example`),
 * a backslash (`/\evil.example`, which some browsers read as `//`), a scheme (`javascript:`, `data:`), control
 * characters or whitespace tricks, the same tricks percent-encoded, or a path back to `/login` itself.
 */

/** Where a visitor lands when there is no safe page to go back to. */
export const RETURN_FALLBACK = "/";
/** The sign-in page. */
export const SIGN_IN_PATH = "/login";
/** A longer `next` is not a page on this site. */
export const RETURN_MAX = 512;

const BASE = "https://computerpets.invalid";

function looksUnsafe(s: string): boolean {
  if (!s.startsWith("/")) return true; // relative to nothing, or a scheme (javascript:, https:, data:)
  if (s.startsWith("//")) return true; // protocol-relative: another host
  if (s.includes("\\")) return true; // browsers treat \ as /, so /\host is //host
  // eslint-disable-next-line no-control-regex -- control characters are exactly what this refuses
  if (/[\u0000-\u001f\u007f\s]/.test(s)) return true; // tabs and newlines are stripped by URL parsers: "/\t/host"
  return false;
}

/** A safe same-site path (path, query and hash) to return to, or the desk. */
export function safeReturnTo(raw: unknown): string {
  if (typeof raw !== "string") return RETURN_FALLBACK;
  if (raw.length === 0 || raw.length > RETURN_MAX) return RETURN_FALLBACK;
  if (looksUnsafe(raw)) return RETURN_FALLBACK;
  // The same tricks, percent-encoded once (%2F%2F, %5C, %09) or twice, are refused too.
  let decoded = raw;
  for (let i = 0; i < 2; i += 1) {
    let next: string;
    try {
      next = decodeURIComponent(decoded);
    } catch {
      return RETURN_FALLBACK;
    }
    if (next === decoded) break;
    if (looksUnsafe(next)) return RETURN_FALLBACK;
    decoded = next;
  }
  let url: URL;
  try {
    url = new URL(raw, BASE);
  } catch {
    return RETURN_FALLBACK;
  }
  if (url.origin !== BASE) return RETURN_FALLBACK;
  if (url.pathname === SIGN_IN_PATH || url.pathname.startsWith(`${SIGN_IN_PATH}/`)) return RETURN_FALLBACK;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) return RETURN_FALLBACK;
  const out = `${url.pathname}${url.search}${url.hash}`;
  // Dot segments collapse while parsing: "/.//evil" and "/a/..//evil" come out as "//evil", another host again.
  if (looksUnsafe(out) || out.length > RETURN_MAX) return RETURN_FALLBACK;
  return out;
}

/** The sign-in page, remembering where to go back to (only when that is a safe page other than the desk). */
export function signInHref(from: unknown): string {
  const next = safeReturnTo(from);
  return next === RETURN_FALLBACK ? SIGN_IN_PATH : `${SIGN_IN_PATH}?next=${encodeURIComponent(next)}`;
}
