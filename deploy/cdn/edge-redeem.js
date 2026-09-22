/**
 * Fail-closed CDN edge redeem for ComputerPets signed download URLs.
 *
 * CLIENT-CONTRACT §7 / ADR 0063: before serving zip bytes, call
 *   GET {HOUSE_API_BASE}/api/bundles/{petKey}/redeem?owner=&jti=&exp=&sig=
 * with the keeper's address as X-Forwarded-For. House verifies HMAC and
 * consumes the one-time IP-bound grant. This worker does **not** hold
 * BUNDLE_SIGNING_KEY.
 *
 * Shapes supported:
 * - Pure helpers (unit-tested without AWS)
 * - AWS Lambda@Edge origin-request / viewer-request (`handler`)
 * - Cloudflare Worker (`workerFetch`) when HOUSE_API_BASE is set
 *
 * Packaging into a live CloudFront association is the keeper's account —
 * this repo does not require `terraform apply`.
 *
 * CommonJS so Node tests and Lambda@Edge (nodejs18.x) load the same file.
 */
"use strict";

const DEFAULT_TIMEOUT_MS = 4000;

/**
 * @param {string} querystring CloudFront-style "a=1&b=2" (no leading ?)
 * @returns {Record<string, string>}
 */
function parseQuery(querystring) {
  const out = Object.create(null);
  if (!querystring || typeof querystring !== "string") {
    return out;
  }
  for (const part of querystring.split("&")) {
    if (!part) continue;
    const eq = part.indexOf("=");
    const rawKey = eq === -1 ? part : part.slice(0, eq);
    const rawVal = eq === -1 ? "" : part.slice(eq + 1);
    let key;
    let val;
    try {
      key = decodeURIComponent(rawKey.replace(/\+/g, " "));
      val = decodeURIComponent(rawVal.replace(/\+/g, " "));
    } catch {
      continue;
    }
    if (key) out[key] = val;
  }
  return out;
}

/**
 * Catalog pet key: prefer pet= query; else legacy {petKey}.zip basename.
 * @param {string} uri Path only, e.g. /bundles/red_panda-win-1.0.0.zip
 * @param {Record<string, string>} query
 * @returns {string}
 */
function resolvePetKey(uri, query) {
  if (query && typeof query.pet === "string" && query.pet.trim()) {
    return query.pet.trim();
  }
  const path = typeof uri === "string" ? uri : "";
  const file = path.split("/").filter(Boolean).pop() || "";
  if (file.endsWith(".zip")) {
    return file.slice(0, -4);
  }
  return file;
}

/**
 * @param {{ uri?: string, querystring?: string, clientIp?: string }} request
 * @returns {{ ok: true, petKey: string, owner: string, jti: string, exp: string, sig: string, clientIp: string }
 *   | { ok: false, status: number, reason: string }}
 */
function extractRedeemFields(request) {
  const query = parseQuery(request && request.querystring);
  const petKey = resolvePetKey(request && request.uri, query);
  const owner = query.owner || "";
  const jti = query.jti || "";
  const exp = query.exp || "";
  const sig = query.sig || "";
  const clientIp =
    request && typeof request.clientIp === "string" && request.clientIp.trim()
      ? request.clientIp.trim()
      : "";

  if (!petKey) {
    return { ok: false, status: 403, reason: "missing pet key" };
  }
  if (!owner || !jti || !exp || !sig) {
    return { ok: false, status: 403, reason: "missing signed query fields" };
  }
  if (!/^\d+$/.test(exp)) {
    return { ok: false, status: 403, reason: "download grant exp invalid" };
  }
  return { ok: true, petKey, owner, jti, exp, sig, clientIp };
}

/**
 * @param {string} houseApiBase
 * @param {{ petKey: string, owner: string, jti: string, exp: string, sig: string }} fields
 * @returns {string}
 */
function buildRedeemUrl(houseApiBase, fields) {
  const base = String(houseApiBase || "").replace(/\/+$/, "");
  if (!base) {
    throw new Error("HOUSE_API_BASE required");
  }
  const q = new URLSearchParams({
    owner: fields.owner,
    jti: fields.jti,
    exp: fields.exp,
    sig: fields.sig,
  });
  return `${base}/api/bundles/${encodeURIComponent(fields.petKey)}/redeem?${q.toString()}`;
}

/**
 * @param {number} status
 * @param {string} bodyText
 * @returns {{ allow: false, status: number, body: string, reason: string }}
 */
function deny(status, bodyText, reason) {
  return {
    allow: false,
    status,
    body: bodyText,
    reason: reason || bodyText,
  };
}

/**
 * Call house redeem. Fail closed on any non-allow outcome.
 *
 * @param {{ uri?: string, querystring?: string, clientIp?: string }} request
 * @param {{ houseApiBase: string, fetchImpl?: typeof fetch, timeoutMs?: number }} opts
 * @returns {Promise<{ allow: true } | { allow: false, status: number, body: string, reason: string }>}
 */
async function verifyRedeem(request, opts) {
  const houseApiBase = opts && opts.houseApiBase;
  if (!houseApiBase || !String(houseApiBase).trim()) {
    return deny(503, "download grant store unavailable", "HOUSE_API_BASE missing");
  }

  const fields = extractRedeemFields(request || {});
  if (!fields.ok) {
    return deny(fields.status, fields.reason, fields.reason);
  }

  let redeemUrl;
  try {
    redeemUrl = buildRedeemUrl(houseApiBase, fields);
  } catch (e) {
    return deny(503, "download grant store unavailable", String(e && e.message ? e.message : e));
  }

  const fetchImpl = (opts && opts.fetchImpl) || globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    return deny(503, "download grant store unavailable", "fetch unavailable");
  }

  const timeoutMs =
    opts && Number.isFinite(opts.timeoutMs) && opts.timeoutMs > 0
      ? opts.timeoutMs
      : DEFAULT_TIMEOUT_MS;

  const headers = { Accept: "application/json" };
  if (fields.clientIp) {
    headers["X-Forwarded-For"] = fields.clientIp;
  }

  let res;
  try {
    const ctrl =
      typeof AbortController === "function" ? new AbortController() : null;
    const timer = ctrl
      ? setTimeout(() => ctrl.abort(), timeoutMs)
      : null;
    try {
      res = await fetchImpl(redeemUrl, {
        method: "GET",
        headers,
        signal: ctrl ? ctrl.signal : undefined,
      });
    } finally {
      if (timer) clearTimeout(timer);
    }
  } catch (e) {
    return deny(
      503,
      "download grant store unavailable",
      "redeem request failed: " + (e && e.message ? e.message : String(e))
    );
  }

  if (!res || typeof res.status !== "number") {
    return deny(503, "download grant store unavailable", "redeem response missing");
  }

  if (res.status === 200) {
    let body;
    try {
      body = typeof res.json === "function" ? await res.json() : null;
    } catch {
      return deny(503, "download grant store unavailable", "redeem body unreadable");
    }
    if (body && body.allowed === true) {
      return { allow: true };
    }
    return deny(403, "download grant denied", "redeem 200 without allowed");
  }

  if (res.status === 401 || res.status === 403 || res.status === 400) {
    return deny(res.status, "download grant denied", "house redeem " + res.status);
  }
  if (res.status === 503) {
    return deny(503, "download grant store unavailable", "house redeem 503");
  }
  return deny(403, "download grant denied", "house redeem " + res.status);
}

/**
 * Lambda@Edge entry (origin-request or viewer-request).
 * Set HOUSE_API_BASE in the published function configuration / packaging step.
 */
async function handler(event) {
  const record = event && event.Records && event.Records[0];
  const cf = record && record.cf;
  const request = cf && cf.request;
  if (!request) {
    return edgeResponse(503, "download grant store unavailable");
  }

  const houseApiBase =
    (typeof process !== "undefined" &&
      process.env &&
      process.env.HOUSE_API_BASE) ||
    "";

  const decision = await verifyRedeem(
    {
      uri: request.uri,
      querystring: request.querystring,
      clientIp: request.clientIp,
    },
    { houseApiBase }
  );

  if (decision.allow) {
    return request;
  }
  return edgeResponse(decision.status, decision.body);
}

function edgeResponse(status, body) {
  const code = String(status || 403);
  return {
    status: code,
    statusDescription: code === "503" ? "Service Unavailable" : "Forbidden",
    headers: {
      "content-type": [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      "cache-control": [{ key: "Cache-Control", value: "no-store" }],
    },
    body: body || "download grant denied",
  };
}

/**
 * Cloudflare Worker-style fetch wrapper.
 * @param {Request} request
 * @param {{ HOUSE_API_BASE?: string }} env
 */
async function workerFetch(request, env) {
  const url = new URL(request.url);
  const clientIp =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    "";
  const decision = await verifyRedeem(
    {
      uri: url.pathname,
      querystring: url.search.startsWith("?") ? url.search.slice(1) : url.search,
      clientIp: clientIp.split(",")[0].trim(),
    },
    { houseApiBase: (env && env.HOUSE_API_BASE) || "" }
  );
  if (decision.allow) {
    return fetch(request);
  }
  return new Response(decision.body, {
    status: decision.status,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

module.exports = {
  parseQuery,
  resolvePetKey,
  extractRedeemFields,
  buildRedeemUrl,
  verifyRedeem,
  handler,
  workerFetch,
  edgeResponse,
};
