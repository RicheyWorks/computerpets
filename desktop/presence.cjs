"use strict";

const path = require("path");

/**
 * Presence files that may live under the overlay userData directory.
 * Not the keeper's Desktop, Documents, or any other host path.
 * License hwid is a separate door and is not on this list.
 */
const HOUSE_FILES = Object.freeze(["card.json", "mind.json"]);

/** The weather button is the one machine grant. Everything else stays denied. */
const ALLOWED_PERMISSIONS = new Set(["geolocation"]);

function allowNavigation() {
  return false;
}

function allowPermission(permission) {
  return ALLOWED_PERMISSIONS.has(String(permission || ""));
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
  ALLOWED_PERMISSIONS,
  allowNavigation,
  allowPermission,
  houseFile,
  scrubWindow,
  scrubWindows,
  refuseFileDrop,
  listHostFolder,
  windowCaption,
  hostPathLabel,
};
