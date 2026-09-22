"use strict";

/**
 * Overlay news, quote, and radio IPC reads leave from main.
 * A host that never answers used to hold that IPC open, and the plate
 * stayed on "looking up". This deadline covers the headers and the body.
 * A timeout is unread. It does not invent a payload and it does not call
 * another host.
 */

const PLATE_TIMEOUT_MS = 12_000;

class PlateTimeout extends Error {
  constructor() {
    super("plate request timed out");
    this.name = "PlateTimeout";
  }
}

function isPlateTimeout(err) {
  return !!(
    err &&
    (err.name === "PlateTimeout" ||
      err.name === "AbortError" ||
      err.name === "TimeoutError" ||
      err.code === "ABORT_ERR")
  );
}

/** Keeper-facing deny. ok stays false so the plate says can't reach. */
function unread(extra) {
  return { ok: false, error: "unread", ...extra };
}

function parseJson(text) {
  if (typeof text !== "string" || !text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * One outbound plate read. The timer covers headers and the body.
 * A timeout rejects with PlateTimeout. The caller does not get a body.
 * @param {string} url
 * @param {RequestInit & { cache?: string }} [init]
 * @param {{ fetchImpl?: typeof fetch, timeoutMs?: number }} [opts]
 */
function fetchPlate(url, init, opts) {
  const fetchImpl = (opts && opts.fetchImpl) || globalThis.fetch;
  const timeoutMs = opts && typeof opts.timeoutMs === "number" ? opts.timeoutMs : PLATE_TIMEOUT_MS;
  if (typeof fetchImpl !== "function") return Promise.reject(new PlateTimeout());

  const ctrl = new AbortController();
  let settled = false;
  let timer;

  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      ctrl.abort();
      reject(new PlateTimeout());
    }, timeoutMs);

    Promise.resolve()
      .then(() => fetchImpl(url, { ...(init || {}), signal: ctrl.signal }))
      .then(async (res) => {
        const text = res && typeof res.text === "function" ? await res.text() : "";
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({
          ok: !!(res && res.ok),
          status: res && typeof res.status === "number" ? res.status : 0,
          text: typeof text === "string" ? text : "",
        });
      })
      .catch((err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (isPlateTimeout(err)) reject(new PlateTimeout());
        else reject(err);
      });
  });
}

/**
 * Radio Browser directory read. A timeout stops on the host that hung.
 * It does not call the next directory host. A fast HTTP failure still
 * walks the existing mirrors; that walk is not a timeout fallback.
 * @param {string} url
 * @param {{
 *   hosts?: string[],
 *   urlsOnHost?: (urls: string[], host: string) => string[],
 *   init?: RequestInit,
 *   fetchImpl?: typeof fetch,
 *   timeoutMs?: number,
 * }} [opts]
 */
async function readRadioDirectory(url, opts) {
  const hosts = (opts && opts.hosts) || [];
  const urlsOnHost = opts && opts.urlsOnHost;
  const list = hosts.length ? hosts : [];
  let lastErr = null;
  if (!list.length) throw new Error("unread");
  for (const host of list) {
    const mapped = typeof urlsOnHost === "function" ? urlsOnHost([url], host) : [];
    const next = (mapped && mapped[0]) || url;
    try {
      const res = await fetchPlate(next, opts && opts.init, {
        fetchImpl: opts && opts.fetchImpl,
        timeoutMs: opts && opts.timeoutMs,
      });
      if (!res.ok) {
        lastErr = new Error(`radio ${res.status}`);
        continue;
      }
      const json = parseJson(res.text);
      if (json == null) {
        lastErr = new Error("unread");
        continue;
      }
      return json;
    } catch (err) {
      if (isPlateTimeout(err)) throw new PlateTimeout();
      lastErr = err;
    }
  }
  throw lastErr || new Error("unread");
}

module.exports = {
  PLATE_TIMEOUT_MS,
  PlateTimeout,
  isPlateTimeout,
  unread,
  parseJson,
  fetchPlate,
  readRadioDirectory,
};
