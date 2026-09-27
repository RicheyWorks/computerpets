"use strict";

/**
 * Plain words for Unlock / Signed download failures. Network trouble (refused,
 * no such host, timeout, TLS, HTTP 5xx) becomes one sentence that names the
 * host; the raw error goes to the log, never to the Settings window. The
 * house's own license codes (expired, hwid_mismatch, denied, ...) each get one
 * plain sentence here: their thrown messages are developer or server text
 * ("license expired", "hardware binding mismatch", a server's json.error).
 * Only the codes whose messages were written for people pass through.
 */

const PETS_STILL = "Pets still work without it.";

const REFUSED = /\b(ECONNREFUSED|ECONNRESET|EHOSTUNREACH|ENETUNREACH|EPIPE|UND_ERR_SOCKET)\b|fetch failed|backend is unreachable|socket hang up|network error/i;
const NOT_FOUND = /\b(ENOTFOUND|EAI_AGAIN|EAI_NONAME)\b|getaddrinfo/i;
const TIMEOUT = /\b(ETIMEDOUT|ESOCKETTIMEDOUT|UND_ERR_CONNECT_TIMEOUT|UND_ERR_HEADERS_TIMEOUT|UND_ERR_BODY_TIMEOUT|ABORT_ERR|AbortError|TimeoutError)\b|timed out|aborted/i;
const TLS = /\b(CERT_[A-Z_]+|UNABLE_TO_VERIFY_LEAF_SIGNATURE|UNABLE_TO_GET_ISSUER_CERT(_LOCALLY)?|DEPTH_ZERO_SELF_SIGNED_CERT|SELF_SIGNED_CERT_IN_CHAIN|ERR_TLS_[A-Z_]+|ERR_SSL_[A-Z_]+|EPROTO)\b|certificate|\bTLS\b|\bSSL\b/i;

/** Bundle refusals from bundle-zip.cjs / session.cjs. They are house codes, not raw text. */
const BUNDLE_WORDS = {
  bundle_sha256_missing: "The house server did not say which bundle to expect, so nothing was installed.",
};
const BUNDLE_DEFAULT = "The downloaded bundle did not match what the house server promised, so it was not installed.";

/** House license codes (errors.cjs LicenseError): never classified as network trouble. */
const HOUSE_CODES = new Set([
  "bad_response",
  "bundle_zip_invalid",
  "cdn_net_unnamed",
  "decrypt_failed",
  "denied",
  "download_failed",
  "download_net_unnamed",
  "expired",
  "fields_missing",
  "hwid_mismatch",
  "hwid_needs_fallback_yes",
  "hwid_too_long",
  "license_net_unnamed",
  "missing_backend",
  "missing_secret",
  "no_license",
  "no_token",
  "revoked",
  "signed_url_invalid",
  "unknown_provider",
]);

/** House codes whose thrown messages are already written for people: they reach the window as-is. */
const PASSTHROUGH_CODES = new Set([
  "cdn_net_unnamed",
  "download_net_unnamed",
  "fields_missing",
  "hwid_needs_fallback_yes",
  "license_net_unnamed",
  "no_license",
  "no_token",
]);

/** One plain sentence per house code whose thrown message is developer or server text. */
function houseSentence(code, host) {
  const at = where(host);
  switch (code) {
    case "expired":
      return `This license has expired. Unlock again to get a new one. ${PETS_STILL}`;
    case "hwid_mismatch":
      return `This license belongs to a different computer, so it does not work here. Unlock again on this computer. ${PETS_STILL}`;
    case "revoked":
      return `${capital(at)} no longer accepts this license. Unlock again to get a new one. ${PETS_STILL}`;
    case "denied":
      return `${capital(at)} did not confirm that you own the game. Check the Steam ID and the App ID, then try again. ${PETS_STILL}`;
    case "decrypt_failed":
      return `The license on this computer could not be opened, so it was not used. Unlock again to get a fresh one. ${PETS_STILL}`;
    case "missing_secret":
      return `This copy of the app has no license key set up, so it cannot open a license. ${PETS_STILL}`;
    case "missing_backend":
      return `The Backend URL is not a web address. It should look like http://127.0.0.1:8081 or https://house.example. ${PETS_STILL}`;
    case "bad_response":
      return `${capital(at)} sent an answer this app does not understand. Try again later. ${PETS_STILL}`;
    case "download_failed":
      return `${capital(at)} did not hand over the download. Unlock again, then download. ${PETS_STILL}`;
    case "unknown_provider":
      return `${capital(at)} does not know this store. Pick Steam and try again. ${PETS_STILL}`;
    case "signed_url_invalid":
      return `The download link did not check out, so nothing was downloaded. Unlock again, then download. ${PETS_STILL}`;
    case "hwid_too_long":
      return `This computer's license mark is too long. Delete hwid.txt in the app's data folder, then unlock again. ${PETS_STILL}`;
    case "bundle_zip_invalid":
      return BUNDLE_DEFAULT;
    default:
      return "";
  }
}

function hostOf(url) {
  if (typeof url !== "string" || !url) return "";
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

function where(host) {
  return host ? `the house server at ${host}` : "the house server";
}

function capital(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Every raw string an error carries (message, code, cause, detail). */
function rawText(err) {
  if (err == null) return "";
  if (typeof err === "string") return err;
  const bits = [];
  const seen = new Set();
  let cur = err;
  for (let depth = 0; cur && depth < 4 && !seen.has(cur); depth += 1) {
    seen.add(cur);
    if (typeof cur === "string") {
      bits.push(cur);
      break;
    }
    for (const key of ["name", "code", "message", "errno", "syscall"]) {
      if (cur[key] != null && typeof cur[key] !== "object") bits.push(String(cur[key]));
    }
    if (typeof cur.detail === "string") bits.push(cur.detail);
    cur = cur.cause;
  }
  return bits.join(" ");
}

/** refused | notfound | timeout | tls | null */
function networkClass(err) {
  const text = rawText(err);
  if (!text) return null;
  if (TLS.test(text)) return "tls";
  if (NOT_FOUND.test(text)) return "notfound";
  if (TIMEOUT.test(text)) return "timeout";
  if (REFUSED.test(text)) return "refused";
  return null;
}

function sentence(kind, host, status) {
  const at = where(host);
  switch (kind) {
    case "notfound":
      return `Couldn't find ${at}. Check the Backend URL. ${PETS_STILL}`;
    case "timeout":
      return `${capital(at)} took too long to answer. ${PETS_STILL}`;
    case "tls":
      return `Couldn't make a secure connection to ${at} (certificate problem), so nothing was sent. ${PETS_STILL}`;
    case "server":
      return `${capital(at)} had a problem${status ? ` (error ${status})` : ""}. Try again later. ${PETS_STILL}`;
    case "busy":
      return `${capital(at)} is busy right now. Try again in a minute. ${PETS_STILL}`;
    case "refused":
    default:
      return `Couldn't reach ${at}. ${PETS_STILL}`;
  }
}

const KIND_CODES = { refused: "unreachable", notfound: "not_found", timeout: "timeout", tls: "tls", server: "server_error", busy: "busy" };

function statusOf(err) {
  if (!err || typeof err !== "object") return 0;
  const status = err.httpStatus || err.status;
  return typeof status === "number" && Number.isFinite(status) ? status : 0;
}

/**
 * @param {unknown} err
 * @param {{ host?: string }} [opts] host to name when the error does not carry one
 * @returns {{ code: string, message: string }}
 */
function plainLicenseError(err, opts = {}) {
  const host = (err && typeof err === "object" && typeof err.host === "string" && err.host) || opts.host || "";
  const code = err && typeof err === "object" && typeof err.code === "string" ? err.code : "";
  const status = statusOf(err);
  if (status >= 500) return { code: KIND_CODES.server, message: sentence("server", host, status) };
  if (status === 429) return { code: KIND_CODES.busy, message: sentence("busy", host) };
  const kind = networkClass(err);
  if (kind && (code === "unreachable" || !HOUSE_CODES.has(code))) {
    return { code: KIND_CODES[kind], message: sentence(kind, host) };
  }
  if (code === "unreachable") return { code: KIND_CODES.refused, message: sentence("refused", host) };
  if (PASSTHROUGH_CODES.has(code) && err && typeof err.message === "string" && err.message) {
    return { code, message: err.message };
  }
  const house = HOUSE_CODES.has(code) ? houseSentence(code, host) : "";
  if (house) return { code, message: house };
  return {
    code: "failed",
    message: `Something went wrong talking to ${where(host)}. ${PETS_STILL}`,
  };
}

/**
 * A bundle refusal is a string (house code or a caught message). Codes get
 * their sentence; anything else is classified like a thrown error.
 */
function plainBundleError(error, opts = {}) {
  if (error && typeof error === "object" && typeof error.message === "string" && !error.code) {
    return plainLicenseError(error, opts);
  }
  if (error && typeof error === "object" && typeof error.code === "string") {
    return plainLicenseError(error, opts);
  }
  const text = typeof error === "string" ? error : "";
  if (/^bundle_[a-z0-9_]+$/.test(text) || /^[a-z]+(_[a-z0-9]+)+$/.test(text)) {
    return { code: text, message: BUNDLE_WORDS[text] || BUNDLE_DEFAULT };
  }
  const kind = networkClass(text);
  if (kind) return { code: KIND_CODES[kind], message: sentence(kind, opts.host || "") };
  return { code: "bundle_failed", message: `The signed bundle was not fetched from ${where(opts.host || "")}.` };
}

/** Log line for the raw error: console / log only, never the window. */
function rawLogLine(err) {
  const text = rawText(err);
  return text || String(err);
}

module.exports = {
  PETS_STILL,
  HOUSE_CODES,
  PASSTHROUGH_CODES,
  houseSentence,
  BUNDLE_WORDS,
  BUNDLE_DEFAULT,
  hostOf,
  rawText,
  networkClass,
  plainLicenseError,
  plainBundleError,
  rawLogLine,
};