/** Query names that would put a plugin secret on a URL. Hyphens match underscores. */
export const SECRET_QUERY_NAMES = new Set([
  "key",
  "api_key",
  "apikey",
  "access_token",
  "refresh_token",
  "id_token",
  "token",
  "secret",
  "client_secret",
  "x_goog_api_key",
  "x_api_key",
  "auth",
  "authorization",
  "bearer",
]);

export function isSecretQueryName(name) {
  const norm = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
  return SECRET_QUERY_NAMES.has(norm);
}

/** Longest name first so `api_key` wins over `key`. */
function secretNameSource() {
  return [...SECRET_QUERY_NAMES]
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/_/g, "[-_]"))
    .join("|");
}

/**
 * Strip `key=value` (and the same secret-name family) from a string.
 * A string with no such assignment is returned as typed.
 */
function stripSecretAssignments(text) {
  const source = String(text);
  const decoded = source.replace(/%3D/gi, "=").replace(/%3F/gi, "?").replace(/%26/gi, "&");
  const re = new RegExp(`(^|[^A-Za-z0-9_])(?:${secretNameSource()})=([^&#\\s/]*)`, "gi");
  if (!re.test(decoded)) return source;
  re.lastIndex = 0;
  let out = decoded.replace(re, (_match, boundary) => boundary || "");
  out = out.replace(/\?&+/g, "?").replace(/&&+/g, "&").replace(/[?&#]+$/g, "");
  return out;
}

/**
 * A path segment that is clearly a pasted key.
 * A version, a UUID, a dotted model id, and lowercase hyphen-words stay.
 */
function isPastedKeySegment(seg) {
  if (!seg) return false;
  if (
    /^(?:sk-(?:ant-)?[A-Za-z0-9_-]{10,}|AIza[0-9A-Za-z_-]{20,}|xai-[A-Za-z0-9_-]{10,}|gh[pousr]_[A-Za-z0-9]{16,}|github_pat_[A-Za-z0-9_]{16,}|ya29\.[0-9A-Za-z_-]{10,})/.test(
      seg,
    )
  ) {
    return true;
  }
  if (/^[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}$/.test(seg)) return true;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(seg)) return false;
  if (seg.length < 32) return false;
  if (!/^[A-Za-z0-9_-]+$/.test(seg)) return false;
  if (!/[A-Za-z]/.test(seg) || !/\d/.test(seg)) return false;
  if (/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(seg)) return false;
  return true;
}

/** The segment after `/key/` when that segment is the pasted secret. */
function isSecretPathValue(seg) {
  if (!seg) return false;
  if (isPastedKeySegment(seg)) return true;
  if (/[.:]/.test(seg) || /^v\d/i.test(seg)) return false;
  if (seg.length <= 24 && /^[A-Za-z][A-Za-z0-9-]*$/.test(seg) && !/\d/.test(seg) && !/[A-Z]/.test(seg.slice(1))) {
    return false;
  }
  return seg.length >= 12 && /[A-Z]/.test(seg) && /[a-z]/.test(seg) && /^[A-Za-z0-9_-]+$/.test(seg);
}

function decodeSeg(part) {
  if (!part) return "";
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
}

function scrubSecretPath(url) {
  const decoded = url.pathname.split("/").map(decodeSeg);
  const keep = [];
  for (let i = 0; i < decoded.length; i++) {
    const seg = decoded[i];
    if (seg === "") {
      keep.push("");
      continue;
    }
    const cleaned = stripSecretAssignments(seg);
    if (cleaned !== seg) {
      if (cleaned) keep.push(cleaned);
      continue;
    }
    if (isPastedKeySegment(seg)) continue;
    const next = decoded[i + 1];
    if (next && isSecretQueryName(seg) && isSecretPathValue(next)) {
      i += 1;
      continue;
    }
    keep.push(seg);
  }
  const before = decoded.join("/");
  let after = keep.join("/");
  if (after === before) return;
  if (!after.startsWith("/")) after = `/${after}`;
  if (after === "/") after = "/";
  url.pathname = after || "/";
}

function stripUserinfo(url) {
  if (url.username) url.username = "";
  if (url.password) url.password = "";
}

function hashCarriesSecretQuery(hash) {
  const body = String(hash || "").replace(/^#\??/, "");
  if (!body) return false;
  const params = new URLSearchParams(body);
  let dirty = false;
  params.forEach((_, name) => {
    if (isSecretQueryName(name)) dirty = true;
  });
  return dirty;
}

/** Drop userinfo, a pasted key path, and a pasted `key` / `api_key` query from a URL. */
export function stripSecretQuery(url) {
  stripUserinfo(url);
  scrubSecretPath(url);
  const names = new Set();
  url.searchParams.forEach((_, name) => names.add(name));
  for (const name of names) {
    if (isSecretQueryName(name)) url.searchParams.delete(name);
  }
  if (hashCarriesSecretQuery(url.hash)) url.hash = "";
}

/**
 * Same drop, on a base URL string the desk is about to store or post.
 * A URL with nothing to drop is returned as typed.
 * A non-URL loses `key=` / `api_key=` (and the same secret-name family) and is otherwise left as typed.
 */
export function scrubSecretQueryString(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return trimmed;
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return stripSecretAssignments(trimmed).trim();
  }
  const before = url.toString();
  stripSecretQuery(url);
  const after = url.toString();
  return after === before ? trimmed : after;
}
