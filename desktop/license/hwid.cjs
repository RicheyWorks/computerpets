"use strict";

const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");
const { LicenseError } = require("./errors.cjs");

/** IssuedLicense.hwid is VARCHAR(128); verify rejects anything longer. */
const MAX_HWID_LENGTH = 128;

/**
 * @typedef {object} MachineMark
 * @property {string} platform
 * @property {string} source
 * @property {string} kind
 * @property {string} where
 * @property {string} [value] the registry value name (Windows only)
 * @property {string} why
 */

/**
 * Named machine marks Unlock may read. Listing them does not read them.
 * The raw value is not a field here. A hash of that value can leave on
 * unlock. The raw id does not.
 * @type {ReadonlyArray<Readonly<MachineMark>>}
 */
const MACHINE_MARKS = Object.freeze([
  Object.freeze({
    platform: "linux",
    source: "etc-machine-id",
    kind: "file",
    where: "/etc/machine-id",
    why: "Linux install id. Stable across boots. A device fingerprint.",
  }),
  Object.freeze({
    platform: "linux",
    source: "dbus-machine-id",
    kind: "file",
    where: "/var/lib/dbus/machine-id",
    why: "Fallback Linux install id when /etc/machine-id is missing. Same fingerprint.",
  }),
  Object.freeze({
    platform: "darwin",
    source: "io-platform-uuid",
    kind: "ioreg",
    where: "IOPlatformExpertDevice IOPlatformUUID",
    why: "Mac platform UUID from ioreg. A hardware fingerprint.",
  }),
  Object.freeze({
    platform: "win32",
    source: "machine-guid",
    kind: "registry",
    where: "HKLM\\SOFTWARE\\Microsoft\\Cryptography",
    value: "MachineGuid",
    why: "Windows install GUID, value MachineGuid. A device fingerprint.",
  }),
  Object.freeze({
    platform: "hostname",
    source: "hostname",
    kind: "hostname",
    where: "the computer name",
    why: "Used only after an in-app yes, when the named OS mark cannot be read. The name is still a fingerprint, and a rename changes it.",
  }),
  Object.freeze({
    platform: "random",
    source: "random",
    kind: "uuid",
    where: "a local random ID",
    why: "Used only after that same yes, when there is no computer name. Not stable if hwid.txt is deleted.",
  }),
]);

/** Shown when Unlock would otherwise mint a computer-name or random mark. */
const WEAK_FALLBACK_MESSAGE =
  "This computer has no stable operating-system id. Unlock waits until you say yes before it hashes the computer name. If this computer has no name, that yes hashes a random ID. A rename changes the computer-name hash. Deleting hwid.txt makes a random ID a different mark.";

/**
 * @param {unknown} hwid
 * @returns {string}
 */
function assertHwid(hwid) {
  if (typeof hwid !== "string" || !hwid) {
    throw new LicenseError("hwid_mismatch", "hwid is required for a bound license");
  }
  if (hwid.length > MAX_HWID_LENGTH) {
    throw new LicenseError("hwid_too_long", "hwid too long", { maxLength: MAX_HWID_LENGTH });
  }
  return hwid;
}

/**
 * What this platform may read, in order. Does not touch the disk or the registry.
 * @param {string} [platform]
 */
function describeMachineMarks(platform) {
  const want = platform ? String(platform) : "";
  return MACHINE_MARKS.filter((mark) => {
    if (!want) return true;
    if (mark.platform === "hostname" || mark.platform === "random") return true;
    if (want === "macos") return mark.platform === "darwin";
    if (want === "windows") return mark.platform === "win32";
    return mark.platform === want;
  }).map((mark) => ({
    platform: mark.platform,
    source: mark.source,
    kind: mark.kind,
    where: mark.where,
    ...(mark.value ? { value: mark.value } : {}),
    why: mark.why,
  }));
}

function markBySource(source) {
  return MACHINE_MARKS.find((mark) => mark.source === source) || null;
}

function hostName(opts) {
  if (typeof opts.hostname === "string" && opts.hostname) return opts.hostname;
  return os.hostname();
}

/**
 * Hash already in hwid.txt, or nothing. Does not read the OS machine id.
 * A non-empty file is the binding, including a value that is not a fresh digest.
 * @param {{ userDataDir?: string, readFile?: typeof fs.readFileSync }} [opts]
 */
function peekHwid(opts = {}) {
  const userDataDir = opts.userDataDir;
  if (!userDataDir) {
    return { id: "", source: null, read: "unread", rawLeavesMachine: false };
  }
  const persistFile = path.join(userDataDir, "hwid.txt");
  const readFile = opts.readFile || fs.readFileSync;
  try {
    const existing = String(readFile(persistFile, "utf8")).trim();
    if (!existing) return { id: "", source: null, read: "unread", rawLeavesMachine: false };
    return { id: assertHwid(existing), source: "hwid.txt", read: "stored", rawLeavesMachine: false };
  } catch (err) {
    if (err instanceof LicenseError) throw err;
    return { id: "", source: null, read: "unread", rawLeavesMachine: false };
  }
}

/**
 * @param {string} raw
 * @param {string} platform
 */
function hashMark(raw, platform) {
  return crypto.createHash("sha256").update(`computerpets:${platform}:${raw}`, "utf8").digest("hex");
}

/**
 * Read one named OS mark. The raw string stays in this function's return
 * and must not be logged, stored, or sent. Callers hash it.
 * A miss does not read the computer name.
 * @returns {{ raw: string | null, source: string | null }}
 */
function readMachineSource(opts) {
  const platform = opts.platform || process.platform;
  const readFile = opts.readFile || fs.readFileSync;
  const exec = opts.exec || execSync;

  if (platform === "linux") {
    for (const source of ["etc-machine-id", "dbus-machine-id"]) {
      const mark = markBySource(source);
      try {
        const text = String(readFile(mark.where, "utf8")).trim();
        if (text) return { raw: text, source };
      } catch {
        /* try next */
      }
    }
    return { raw: null, source: null };
  }

  if (platform === "darwin") {
    try {
      const out = String(exec("ioreg -rd1 -c IOPlatformExpertDevice", { encoding: "utf8", timeout: 3000 }));
      const match = out.match(/"IOPlatformUUID"\s*=\s*"([^"]+)"/);
      return match ? { raw: match[1], source: "io-platform-uuid" } : { raw: null, source: null };
    } catch {
      return { raw: null, source: null };
    }
  }

  if (platform === "win32") {
    const mark = markBySource("machine-guid");
    try {
      const out = String(
        exec(`reg query ${mark.where} /v ${mark.value}`, {
          encoding: "utf8",
          timeout: 3000,
        })
      );
      const match = out.match(/MachineGuid\s+REG_SZ\s+([0-9a-fA-F-]+)/);
      return match ? { raw: match[1], source: "machine-guid" } : { raw: null, source: null };
    } catch {
      return { raw: null, source: null };
    }
  }

  return { raw: null, source: null };
}

/**
 * Computer name, then a caller fallback, then a random ID.
 * Called only after the keeper says yes.
 * An explicit empty hostname means this computer has no name.
 * @returns {{ raw: string, source: string }}
 */
function weakMaterial(opts) {
  if (typeof opts.hostname === "string") {
    if (opts.hostname) return { raw: opts.hostname, source: "hostname" };
  } else {
    const name = hostName(opts);
    if (name) return { raw: name, source: "hostname" };
  }
  if (opts.fallbackId) return { raw: String(opts.fallbackId), source: "fallback" };
  return { raw: crypto.randomUUID(), source: "random" };
}

/**
 * Stable license mark. A stored hwid.txt wins and is not rewritten.
 * The OS id is read only when that file is missing. The return has no raw field.
 * @param {{
 *   userDataDir?: string,
 *   platform?: NodeJS.Platform | string,
 *   readFile?: typeof fs.readFileSync,
 *   writeFile?: typeof fs.writeFileSync,
 *   mkdir?: typeof fs.mkdirSync,
 *   exec?: typeof execSync,
 *   fallbackId?: string,
 *   hostname?: string,
 *   allowWeakFallback?: boolean,
 * }} [opts]
 */
function resolveHwidDetail(opts = {}) {
  const stored = peekHwid(opts);
  if (stored.read === "stored") return stored;

  const platform = opts.platform || process.platform;
  const found = readMachineSource({ ...opts, platform });
  let raw = found.raw;
  let source = found.source;
  if (!raw) {
    if (opts.allowWeakFallback !== true) {
      throw new LicenseError("hwid_needs_fallback_yes", WEAK_FALLBACK_MESSAGE);
    }
    const weak = weakMaterial(opts);
    raw = weak.raw;
    source = weak.source;
  }
  const id = hashMark(raw, platform);
  assertHwid(id);

  const userDataDir = opts.userDataDir;
  if (userDataDir) {
    const persistFile = path.join(userDataDir, "hwid.txt");
    const writeFile = opts.writeFile || fs.writeFileSync;
    // An injected writer owns its storage. Only make a real folder when the real
    // disk is the writer, or when the caller hands its own mkdir too.
    const mkdir = opts.mkdir || (opts.writeFile ? null : fs.mkdirSync);
    try {
      if (mkdir) mkdir(path.dirname(persistFile), { recursive: true });
      writeFile(persistFile, id, "utf8");
    } catch {
      /* still return the computed id this process */
    }
  }
  return { id, source, read: "machine", rawLeavesMachine: false };
}

/**
 * Opaque, stable per-machine id. Same digest recipe as before:
 * sha256("computerpets:" + platform + ":" + raw). A stored file is returned as-is.
 * @param {Parameters<typeof resolveHwidDetail>[0]} [opts]
 * @returns {string}
 */
function resolveHwid(opts = {}) {
  return resolveHwidDetail(opts).id;
}

module.exports = {
  MAX_HWID_LENGTH,
  MACHINE_MARKS,
  WEAK_FALLBACK_MESSAGE,
  assertHwid,
  describeMachineMarks,
  peekHwid,
  resolveHwid,
  resolveHwidDetail,
};
