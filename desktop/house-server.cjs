"use strict";

/**
 * The keeper card's house-server row (main process). Pets need no server, so
 * the row is hidden until the keeper names one: a house server address saved in
 * Settings, COMPUTERPETS_BACKEND_URL, or the backend a held license came from.
 * Only then does this probe `/api/public/heartbeat` on that host. The raw
 * failure goes to the log; the card only says reachable or unreachable.
 */

const fs = require("fs");
const path = require("path");
const Keeper = require("./renderer/keeper.js");

const FILE_NAME = "house-server.json";
const HEARTBEAT_PATH = "/api/public/heartbeat";
const DEFAULT_BASE = "http://127.0.0.1:8081";
const PROBE_TIMEOUT_MS = 4000;
const HIDDEN = Object.freeze({ show: false });
const BAD_URL = "That house server address does not start with http or https, so it was not saved.";

function normalizeBase(raw) {
  if (typeof raw !== "string" || !raw.trim()) return null;
  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/+$/, "");
}

function hostOf(base) {
  try {
    return new URL(base).host;
  } catch {
    return "";
  }
}

function envBase(env) {
  if (!env) return null;
  return normalizeBase(env.COMPUTERPETS_BACKEND_URL || env.ENTERPRISEPET_BACKEND_URL || "");
}

/**
 * Which server the row probes, or null when the keeper named none.
 * @param {{ savedUrl?: string, env?: NodeJS.ProcessEnv, licenseHeld?: boolean, licenseBackendUrl?: string }} [opts]
 * @returns {{ base: string, from: "settings" | "env" | "license" } | null}
 */
function target(opts = {}) {
  const saved = normalizeBase(opts.savedUrl || "");
  if (saved) return { base: saved, from: "settings" };
  const fromEnv = envBase(opts.env);
  if (fromEnv) return { base: fromEnv, from: "env" };
  if (opts.licenseHeld === true) {
    return { base: normalizeBase(opts.licenseBackendUrl || "") || DEFAULT_BASE, from: "license" };
  }
  return null;
}

function filePath(userDataDir) {
  return path.join(userDataDir, FILE_NAME);
}

function readSaved(userDataDir, readFile = fs.readFileSync) {
  try {
    const parsed = JSON.parse(readFile(filePath(userDataDir), "utf8"));
    return (parsed && normalizeBase(parsed.url)) || "";
  } catch {
    return "";
  }
}

/** Save (or clear, with "") the Settings house server address the row should probe. */
function writeSaved(userDataDir, raw, io = {}) {
  const writeFile = io.writeFile || fs.writeFileSync;
  const mkdir = io.mkdir || fs.mkdirSync;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  const url = normalizeBase(trimmed);
  if (trimmed && !url) {
    return { ok: false, url: readSaved(userDataDir, io.readFile), error: { code: "bad_url", message: BAD_URL } };
  }
  mkdir(userDataDir, { recursive: true });
  writeFile(filePath(userDataDir), JSON.stringify({ url: url || "" }, null, 2), "utf8");
  return { ok: true, url: url || "" };
}

/**
 * GET {base}/api/public/heartbeat. Never throws.
 * @returns {Promise<{ reachable: boolean, profile: string | null, uptimeSeconds: number | null }>}
 */
async function probe(base, opts = {}) {
  const fetchImpl = opts.fetchImpl || globalThis.fetch;
  const log = opts.log || console.warn;
  const timeoutMs = opts.timeoutMs ?? PROBE_TIMEOUT_MS;
  const down = { reachable: false, profile: null, uptimeSeconds: null };
  if (typeof fetchImpl !== "function") return down;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetchImpl(`${base}${HEARTBEAT_PATH}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: ctrl.signal,
    });
    if (!res || !res.ok) {
      log(`[house-server] ${hostOf(base)} heartbeat answered HTTP ${res ? res.status : "?"}`);
      return down;
    }
    let raw = null;
    try {
      raw = await res.json();
    } catch {
      raw = null;
    }
    const beat = Keeper.parseHeartbeat(raw);
    return { reachable: true, profile: beat.profile, uptimeSeconds: beat.uptimeSeconds };
  } catch (err) {
    const cause = err && err.cause;
    const why = (cause && (cause.code || cause.message)) || (err && (err.code || err.name || err.message)) || String(err);
    log(`[house-server] ${hostOf(base)} heartbeat failed: ${why}`);
    return down;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * The row's state: { show: false } when no server is named, else the host and
 * whether it answered.
 */
async function houseServerState(opts = {}) {
  const picked = target(opts);
  if (!picked) return { ...HIDDEN };
  const got = await probe(picked.base, opts);
  return { show: true, host: hostOf(picked.base), from: picked.from, ...got };
}

module.exports = {
  FILE_NAME,
  HEARTBEAT_PATH,
  DEFAULT_BASE,
  PROBE_TIMEOUT_MS,
  HIDDEN,
  BAD_URL,
  normalizeBase,
  hostOf,
  target,
  readSaved,
  writeSaved,
  probe,
  houseServerState,
};