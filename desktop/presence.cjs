"use strict";

const path = require("path");

/**
 * Presence files that may live under the overlay userData directory.
 * Not the keeper's Desktop, Documents, or any other host path.
 * A license machine id is not a presence read and is not on this list.
 * Unlock reads that id only when hwid.txt has no hash.
 * mind.json may hold mind prefs. A plugin key is not stored there in plain text.
 */
const HOUSE_FILES = Object.freeze(["card.json", "mind.json"]);

/**
 * Geolocation is not a standing grant. It opens only for one weather-button
 * locate, then closes. Electron 35's PermissionManager::ResetPermission is
 * empty, so a grant Chromium already cached in the renderer cannot be
 * revoked mid-session. This flag is the live check: false once the locate
 * ends or WEATHER_LOCATE_MS passes. Callers do not watch and do not re-query.
 * An IP place service is not a fallback when that fix is missing.
 * maximumAge 0 does not flush a permission grant. Chromium can still
 * answer getCurrentPosition from an origin grant it already cached,
 * without a new browser prompt. Electron 35 cannot revoke that cache.
 * An in-app yes is not a revoke. Callers arm only after that yes, and
 * only when no typed area is saved. A saved typed area does not arm this grant.
 * One yes covers one read. After that locate, or after Don't send, the next
 * getCurrentPosition waits for a fresh in-app yes. A timer or a panel reopen
 * does not note that yes. A prior browser allow can still satisfy the next
 * locate without a new OS or browser prompt. This does not revoke the grant.
 */
const WEATHER_LOCATE_MS = 120_000;
let weatherLocateUntil = 0;
let weatherLocateYes = false;

/** The Send the place button. A cached Chromium grant is not this yes. */
function noteWeatherLocateYes() {
  weatherLocateYes = true;
}

/** Don't send, and any path that must not leave a yes armed. */
function holdWeatherLocate() {
  weatherLocateYes = false;
}

function allowNavigation() {
  return false;
}

function armWeatherLocate(now = Date.now()) {
  const at = Number(now);
  const base = Number.isFinite(at) ? at : Date.now();
  weatherLocateUntil = base + WEATHER_LOCATE_MS;
  return weatherLocateUntil;
}

function clearWeatherLocate() {
  weatherLocateUntil = 0;
}

function weatherLocateOpen(now = Date.now()) {
  const at = Number(now);
  const base = Number.isFinite(at) ? at : Date.now();
  return weatherLocateUntil > base;
}

function allowPermission(permission, now = Date.now()) {
  if (String(permission || "") !== "geolocation") return false;
  return weatherLocateOpen(now);
}

function weatherLocateOptions() {
  return { maximumAge: 0, timeout: WEATHER_LOCATE_MS, enableHighAccuracy: false };
}

function closeWeatherLocate(hooks) {
  clearWeatherLocate();
  if (!hooks || typeof hooks.clear !== "function") return Promise.resolve();
  try {
    return Promise.resolve(hooks.clear()).then(
      () => {},
      () => {},
    );
  } catch {
    return Promise.resolve();
  }
}

function requestWeatherFix(geo, opts) {
  return new Promise((resolve) => {
    if (!geo || typeof geo.getCurrentPosition !== "function") {
      resolve(null);
      return;
    }
    let settled = false;
    const done = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    try {
      geo.getCurrentPosition(
        (pos) => {
          const coords = pos && pos.coords;
          const lat = coords ? Number(coords.latitude) : NaN;
          const lon = coords ? Number(coords.longitude) : NaN;
          done(Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null);
        },
        () => done(null),
        opts,
      );
    } catch {
      done(null);
    }
  });
}

/**
 * IP place is not a location grant. There is no keeper control that asks
 * to use the network's city, so this returns nothing. A consent argument
 * does not open a lookup. Callers must not fetch a network city.
 * @returns {null}
 */
function ipPlace() {
  return null;
}

/**
 * Presence does not read a machine id. License binding is desktop/license/hwid.cjs.
 * This does not open machine-id, MachineGuid, or the Mac platform UUID.
 */
function readMachineMark() {
  return { read: false, raw: null, id: "" };
}

/**
 * One weather-button fix. Arms geolocation only after noteWeatherLocateYes, asks once, then clears.
 * A second call in the same session does not call getCurrentPosition until that yes is noted again.
 * Does not call watchPosition. maximumAge is 0, so a cached position is not a silent re-read.
 * A cached origin grant can still satisfy the call after the fresh yes. This does not revoke it.
 * `hooks.arm` / `hooks.clear` are how the overlay tells the Electron session.
 * @param {{ getCurrentPosition?: Function } | null | undefined} geo
 * @param {{ arm?: Function, clear?: Function } | null | undefined} [hooks]
 */
function readWeatherHere(geo, hooks) {
  if (!weatherLocateYes) return Promise.resolve(null);
  weatherLocateYes = false;
  armWeatherLocate();
  let pending = Promise.resolve();
  if (hooks && typeof hooks.arm === "function") {
    try {
      pending = Promise.resolve(hooks.arm());
    } catch (err) {
      pending = Promise.reject(err);
    }
  }
  const opts = weatherLocateOptions();
  return pending.then(() => requestWeatherFix(geo, opts)).then(
    (fix) => closeWeatherLocate(hooks).then(() => fix),
    (err) => closeWeatherLocate(hooks).then(() => {
      throw err;
    }),
  );
}

/**
 * Resolve one house file under userData. Refuses absolute names, `..`,
 * and anything that is not card.json or mind.json.
 * @param {string} userDataDir
 * @param {string} name
 * @returns {string | null}
 */
function houseFile(userDataDir, name) {
  if (typeof userDataDir !== "string" || !userDataDir.trim()) return null;
  if (typeof name !== "string" || !HOUSE_FILES.includes(name)) return null;
  if (name.includes("/") || name.includes("\\") || name.includes("..")) return null;
  const root = path.resolve(userDataDir);
  const full = path.resolve(root, name);
  const prefix = root.endsWith(path.sep) ? root : root + path.sep;
  if (!full.startsWith(prefix)) return null;
  if (path.basename(full) !== name) return null;
  return full;
}

function scrubWindow(row) {
  if (!row || typeof row !== "object") return null;
  const id = row.id == null ? "" : String(row.id);
  const x = Number(row.x);
  const y = Number(row.y);
  const width = Number(row.width);
  const height = Number(row.height);
  if (!id || ![x, y, width, height].every(Number.isFinite)) return null;
  if (windowCaption(row) != null) return null;
  if (hostPathLabel(row.path, false) !== "") return null;
  return { id, x, y, width, height };
}

/**
 * Presence does not list a host folder. Desktop, Documents, Downloads,
 * and every other path return an empty list. This does not touch the disk.
 * @param {string} [_name]
 * @returns {{ listed: false, names: [] }}
 */
function listHostFolder(_name) {
  return { listed: false, names: [] };
}

/**
 * Window glass has no title and no document name.
 * @param {object | null | undefined} [_row]
 * @returns {null}
 */
function windowCaption(_row) {
  return null;
}

/**
 * A host path is omitted unless the keeper has already consented.
 * There is no consent control on the glass, the desk, or the blotter.
 * @param {unknown} value
 * @param {boolean} consent
 * @returns {string}
 */
function hostPathLabel(value, consent) {
  if (consent !== true) return "";
  if (typeof value !== "string") return "";
  return value.trim();
}

const FIELD_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

function isFocusedField(event) {
  if (!event || typeof event !== "object") return false;
  if (event.focused === true || event.field === true) return true;
  const target = event.target;
  if (!target || typeof target !== "object") return false;
  if (target.isContentEditable === true) return true;
  const tag = String(target.tagName || target.tag || "").toUpperCase();
  if (FIELD_TAGS.has(tag)) return true;
  if (typeof target.closest === "function") {
    try {
      return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * The key name on an event, or "" when there is none. Only compared with "Escape"; never stored.
 * @param {{ key?: unknown } | null | undefined} event
 * @returns {string}
 */
function keyText(event) {
  if (!event || typeof event !== "object" || !("key" in event)) return "";
  const value = event.key;
  return typeof value === "string" ? value : "";
}

/**
 * A key outside a focused field is not a presence log.
 * A focused field keeps the character. This does not read it.
 * Escape outside a field may dismiss a menu. The key text is not returned.
 * There is no global hook and no keystroke buffer.
 * @param {{ key?: string, focused?: boolean, field?: boolean, target?: object } | null | undefined} event
 * @returns {{ record: false, field: boolean, toggle: false | "dismiss" }}
 */
function classifyKey(event) {
  if (isFocusedField(event)) return { record: false, field: true, toggle: false };
  if (keyText(event) === "Escape") return { record: false, field: false, toggle: "dismiss" };
  return { record: false, field: false, toggle: false };
}

/**
 * Refuse a keystroke log. The buffer is not appended. The key is not returned.
 * @param {unknown} [_buffer]
 * @param {unknown} [_event]
 * @returns {{ record: false, keys: [] }}
 */
function recordKeystroke(_buffer, _event) {
  return { record: false, keys: [] };
}

function scrubWindows(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const row of list) {
    const next = scrubWindow(row);
    if (next) out.push(next);
  }
  return out;
}

function transferTypes(transfer) {
  if (!transfer || transfer.types == null) return [];
  try {
    return Array.from(transfer.types).map((t) => String(t));
  } catch {
    return [];
  }
}

/**
 * A host file drop is not a gift and not a place. Never read the path or the bytes.
 * `files` is true when the drag is a file (or a uri-list that can carry a path).
 * @param {{ types?: Iterable<string>, files?: { length?: number }, fileCount?: number } | null | undefined} transfer
 */
function refuseFileDrop(transfer) {
  const types = transferTypes(transfer);
  let fileCount = 0;
  if (transfer && typeof transfer.fileCount === "number") fileCount = transfer.fileCount;
  else if (transfer && transfer.files && typeof transfer.files.length === "number") fileCount = transfer.files.length;
  const uri = types.includes("text/uri-list") || types.includes("application/x-moz-file");
  const hasFiles = fileCount > 0 || types.includes("Files") || uri;
  return { accept: false, read: false, files: hasFiles };
}

module.exports = {
  HOUSE_FILES,
  WEATHER_LOCATE_MS,
  allowNavigation,
  allowPermission,
  armWeatherLocate,
  clearWeatherLocate,
  noteWeatherLocateYes,
  holdWeatherLocate,
  weatherLocateOpen,
  weatherLocateOptions,
  ipPlace,
  readMachineMark,
  readWeatherHere,
  houseFile,
  scrubWindow,
  scrubWindows,
  refuseFileDrop,
  listHostFolder,
  windowCaption,
  hostPathLabel,
  classifyKey,
  recordKeystroke,
};
