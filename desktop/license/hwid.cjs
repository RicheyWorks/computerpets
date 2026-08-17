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
 * Opaque, stable per-machine id. The backend does not define a fingerprint
 * algorithm — we only have to reproduce the same string on verify and download.
 *
 * @param {{
 *   userDataDir?: string,
 *   platform?: NodeJS.Platform,
 *   readFile?: typeof fs.readFileSync,
 *   writeFile?: typeof fs.writeFileSync,
 *   exec?: typeof execSync,
 *   fallbackId?: string,
 * }} [opts]
 * @returns {string}
 */
function resolveHwid(opts = {}) {
  const userDataDir = opts.userDataDir;
  const persistFile = userDataDir ? path.join(userDataDir, "hwid.txt") : null;
  const readFile = opts.readFile || fs.readFileSync;
  const writeFile = opts.writeFile || fs.writeFileSync;

  if (persistFile) {
    try {
      const existing = String(readFile(persistFile, "utf8")).trim();
      if (existing) return assertHwid(existing);
    } catch {
      /* first run */
    }
  }

  const raw = readMachineSource(opts) || opts.fallbackId || crypto.randomUUID();
  const id = crypto.createHash("sha256").update(`computerpets:${opts.platform || process.platform}:${raw}`, "utf8").digest("hex");
  assertHwid(id);

  if (persistFile) {
    try {
      fs.mkdirSync(path.dirname(persistFile), { recursive: true });
      writeFile(persistFile, id, "utf8");
    } catch {
      /* still return the computed id this process */
    }
  }
  return id;
}

function readMachineSource(opts) {
  const platform = opts.platform || process.platform;
  const readFile = opts.readFile || fs.readFileSync;
  const exec = opts.exec || execSync;

  if (platform === "linux") {
    for (const file of ["/etc/machine-id", "/var/lib/dbus/machine-id"]) {
      try {
        const text = String(readFile(file, "utf8")).trim();
        if (text) return text;
      } catch {
        /* try next */
      }
    }
    return null;
  }

  if (platform === "darwin") {
    try {
      const out = String(exec("ioreg -rd1 -c IOPlatformExpertDevice", { encoding: "utf8", timeout: 3000 }));
      const match = out.match(/"IOPlatformUUID"\s*=\s*"([^"]+)"/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  if (platform === "win32") {
    try {
      const out = String(
        exec("reg query HKLM\\SOFTWARE\\Microsoft\\Cryptography /v MachineGuid", {
          encoding: "utf8",
          timeout: 3000,
        })
      );
      const match = out.match(/MachineGuid\s+REG_SZ\s+([0-9a-fA-F-]+)/);
      return match ? match[1] : null;
    } catch {
      return os.hostname();
    }
  }

  return os.hostname();
}

module.exports = { MAX_HWID_LENGTH, assertHwid, resolveHwid };
