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

/** Drop a pasted `key` / `api_key` (and the same kind of secret) from a URL. */
export function stripSecretQuery(url) {
  const names = new Set();
  url.searchParams.forEach((_, name) => names.add(name));
  for (const name of names) {
    if (isSecretQueryName(name)) url.searchParams.delete(name);
  }
  if (hashCarriesSecretQuery(url.hash)) url.hash = "";
}

/**
 * Same drop, on a base URL string the desk is about to post.
 * A URL with no secret query is returned as typed. A string that is not a URL is left as typed.
 */
export function scrubSecretQueryString(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return trimmed;
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return trimmed;
  }
  const before = url.toString();
  stripSecretQuery(url);
  const after = url.toString();
  return after === before ? trimmed : after;
}
