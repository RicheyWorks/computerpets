"use strict";

const { LicenseError } = require("./errors.cjs");
const { assertHwid } = require("./hwid.cjs");
const { verifySignedDownloadUrl } = require("./signed-url.cjs");

const DEFAULT_TIMEOUT_MS = 12_000;

function normalizeBackendUrl(raw) {
  if (typeof raw !== "string" || !raw.trim()) {
    throw new LicenseError("missing_backend", "backend base URL is missing");
  }
  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new LicenseError("missing_backend", "backend base URL is not a URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new LicenseError("missing_backend", "backend base URL must be http or https");
  }
  return url.toString().replace(/\/+$/, "");
}

function jsonHeaders(extra = {}) {
  return { Accept: "application/json", "Content-Type": "application/json", ...extra };
}

/**
 * @param {{ fetchImpl?: typeof fetch, timeoutMs?: number }} [opts]
 */
function createLicenseClient(opts = {}) {
  const fetchImpl = opts.fetchImpl || globalThis.fetch;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  if (typeof fetchImpl !== "function") {
    throw new LicenseError("missing_backend", "fetch is not available");
  }

  async function request(url, init) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    let res;
    try {
      res = await fetchImpl(url, { ...init, signal: ctrl.signal });
    } catch (err) {
      const aborted = err && (err.name === "AbortError" || err.code === "ABORT_ERR");
      throw new LicenseError(
        "unreachable",
        aborted ? "backend request timed out" : "backend is unreachable",
        err && err.message ? err.message : String(err)
      );
    } finally {
      clearTimeout(timer);
    }
    return res;
  }

  async function readBody(res) {
    const text = await res.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }

  /**
   * POST /api/verify/{provider} — body is a flat map of strings (Steam: steamId, appId, …).
   */
  async function verify({ backendUrl, provider, fields }) {
    const base = normalizeBackendUrl(backendUrl);
    if (typeof provider !== "string" || !/^[a-z0-9_]+$/.test(provider)) {
      throw new LicenseError("unknown_provider", "provider key is invalid");
    }
    if (!fields || typeof fields !== "object") {
      throw new LicenseError("denied", "verify fields missing");
    }

    const body = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value == null || value === "") continue;
      if (typeof value !== "string") {
        throw new LicenseError("denied", `verify field ${key} must be a string`);
      }
      body[key] = value;
    }
    if (typeof body.hwid === "string") assertHwid(body.hwid);

    const res = await request(`${base}/api/verify/${provider}`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(body),
    });
    const json = await readBody(res);

    if (res.status === 404) {
      throw new LicenseError("unknown_provider", json.error || "unknown provider", json);
    }
    if (res.status === 403) {
      throw new LicenseError("denied", json.error || "ownership not verified", json);
    }
    if (res.status === 400 && json.error === "hwid too long") {
      throw new LicenseError("hwid_too_long", "hwid too long", json);
    }
    if (res.status === 429) {
      throw new LicenseError("unreachable", "verify rate limited", json);
    }
    if (res.status >= 500) {
      throw new LicenseError("unreachable", json.error || "provider call failed", json);
    }
    if (!res.ok) {
      throw new LicenseError("denied", json.error || `verify failed (${res.status})`, json);
    }
    if (json.status !== "success" || !json.license || !json.auth || !json.auth.token) {
      throw new LicenseError("bad_response", "verify response is not a license issuance", json);
    }
    if (typeof json.license.ciphertext !== "string" || typeof json.license.iv !== "string") {
      throw new LicenseError("bad_response", "verify response missing license ciphertext/iv", json);
    }
    return json;
  }

  /**
   * POST /api/download/{petKey} with Bearer JWT and the opaque license (+ hwid when bound).
   */
  async function download({ backendUrl, petKey, ciphertext, iv, hwid, token, expect, signingKey }) {
    const base = normalizeBackendUrl(backendUrl);
    if (typeof petKey !== "string" || !petKey) {
      throw new LicenseError("download_failed", "petKey missing");
    }
    if (typeof token !== "string" || !token) {
      throw new LicenseError("download_failed", "auth token missing");
    }

    const body = { ciphertext, iv };
    if (typeof hwid === "string" && hwid) {
      body.hwid = assertHwid(hwid);
    }

    const res = await request(`${base}/api/download/${encodeURIComponent(petKey)}`, {
      method: "POST",
      headers: jsonHeaders({ Authorization: `Bearer ${token}` }),
      body: JSON.stringify(body),
    });
    const json = await readBody(res);

    if (res.status === 401) {
      const err = json.error || "license missing, expired, or tampered";
      const revoked = /expired|tampered|missing/i.test(err);
      throw new LicenseError(revoked ? "revoked" : "download_failed", err, json);
    }
    if (res.status === 403 && json.error === "hardware binding mismatch") {
      throw new LicenseError("hwid_mismatch", json.error, json);
    }
    if (res.status === 403) {
      throw new LicenseError("denied", json.error || "download forbidden", json);
    }
    if (res.status === 429) {
      throw new LicenseError("unreachable", "download rate limited", json);
    }
    if (!res.ok) {
      throw new LicenseError("download_failed", json.error || `download failed (${res.status})`, json);
    }
    if (typeof json.downloadUrl !== "string" || !json.downloadUrl) {
      throw new LicenseError("bad_response", "download response missing downloadUrl", json);
    }

    verifySignedDownloadUrl(json.downloadUrl, {
      jti: (expect && expect.jti) || json.jti,
      petKey: (expect && expect.petKey) || json.petKey || petKey,
      owner: expect && expect.owner,
      signingKey,
    });

    return json;
  }

  /**
   * GET the HMAC-signed CDN URL. Missing/failed CDN is reported, not invented.
   */
  async function fetchBundle(downloadUrl) {
    if (typeof downloadUrl !== "string" || !downloadUrl) {
      throw new LicenseError("signed_url_invalid", "downloadUrl missing");
    }
    const res = await request(downloadUrl, { method: "GET" });
    if (!res.ok) {
      return { ok: false, status: res.status, bytes: 0 };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return { ok: true, status: res.status, bytes: buf.length };
  }

  return { verify, download, fetchBundle, normalizeBackendUrl };
}

module.exports = { createLicenseClient, normalizeBackendUrl };
