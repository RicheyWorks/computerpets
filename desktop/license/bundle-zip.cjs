"use strict";

/**
 * Pet-bundle zip layout (computerpets.bundle/v1) and fail-closed update rules.
 * Mirrors src/main/java/com/enterprisepet/bundle/BundleZipContract.java.
 */

const crypto = require("crypto");
const { LicenseError } = require("./errors.cjs");

const FORMAT = "computerpets.bundle/v1";
const MANIFEST_NAME = "manifest.json";
const VERSION_RE = /^[A-Za-z0-9._+-]{1,64}$/;
const SHA256_RE = /^[0-9a-f]{64}$/;
const MEMBER_PATH_RE = /^(sprites|cries|meta)\/[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/;
const PLATFORMS = new Set(["win", "mac", "linux", "any"]);

function blankToNull(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function sha256Hex(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function constantTimeEquals(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) {
    const len = Math.max(left.length, right.length);
    let diff = left.length ^ right.length;
    for (let i = 0; i < len; i++) {
      const lb = i < left.length ? left[i] : 0;
      const rb = i < right.length ? right[i] : 0;
      diff |= lb ^ rb;
    }
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

function normalizeExpect(raw) {
  const expect = raw && typeof raw === "object" ? raw : {};
  const localRaw = expect.local && typeof expect.local === "object" ? expect.local : null;
  return {
    petKey: blankToNull(expect.petKey),
    version: blankToNull(expect.version),
    platform: blankToNull(expect.platform),
    sha256: blankToNull(expect.sha256),
    local: localRaw
      ? {
          petKey: blankToNull(localRaw.petKey),
          version: blankToNull(localRaw.version),
          platform: blankToNull(localRaw.platform),
          sha256: blankToNull(localRaw.sha256),
        }
      : null,
  };
}

function claimsCatalogIntegrity(expect) {
  return Boolean(expect.version || expect.sha256);
}

function alreadyCurrent(raw) {
  const expect = normalizeExpect(raw);
  if (!claimsCatalogIntegrity(expect)) return false;
  if (!expect.sha256 || !expect.version || !expect.petKey) return false;
  if (!SHA256_RE.test(expect.sha256)) return false;
  const local = expect.local;
  if (!local || !local.sha256 || !local.version || !local.petKey) return false;
  if (expect.petKey !== local.petKey) return false;
  if (expect.version !== local.version) return false;
  if (!constantTimeEquals(expect.sha256, local.sha256)) return false;
  if (expect.platform && local.platform && expect.platform !== local.platform) return false;
  return true;
}

function refuse(code) {
  return {
    action: "refuse",
    error: code,
    petKey: null,
    version: null,
    platform: null,
    sha256: null,
    memberCount: 0,
    accepted: false,
  };
}

function readU16(buf, offset) {
  return buf.readUInt16LE(offset);
}

function readU32(buf, offset) {
  return buf.readUInt32LE(offset);
}

/**
 * Minimal stored-deflate / store zip reader for contract checks (no symlink / zip64).
 * @param {Buffer} zipBytes
 * @returns {Map<string, Buffer>}
 */
function readZipMembers(zipBytes) {
  if (!Buffer.isBuffer(zipBytes) || zipBytes.length < 22) {
    throw new LicenseError("bundle_zip_invalid", "zip could not be read");
  }
  const members = new Map();
  let offset = 0;
  while (offset + 30 <= zipBytes.length) {
    const sig = readU32(zipBytes, offset);
    if (sig === 0x02014b50 || sig === 0x06054b50) break; // central / EOCD
    if (sig !== 0x04034b50) {
      throw new LicenseError("bundle_zip_invalid", "zip could not be read");
    }
    const method = readU16(zipBytes, offset + 8);
    const compSize = readU32(zipBytes, offset + 18);
    const nameLen = readU16(zipBytes, offset + 26);
    const extraLen = readU16(zipBytes, offset + 28);
    const nameStart = offset + 30;
    const nameEnd = nameStart + nameLen;
    const dataStart = nameEnd + extraLen;
    const dataEnd = dataStart + compSize;
    if (dataEnd > zipBytes.length) {
      throw new LicenseError("bundle_zip_invalid", "zip could not be read");
    }
    const name = zipBytes.slice(nameStart, nameEnd).toString("utf8");
    if (!name || name.endsWith("/")) {
      offset = dataEnd;
      continue;
    }
    if (name.includes("\\") || name.startsWith("/") || name.includes("..")) {
      throw new LicenseError("bundle_zip_invalid", "unsafe zip member path");
    }
    if (members.has(name)) {
      throw new LicenseError("bundle_zip_invalid", "duplicate zip member");
    }
    let body;
    if (method === 0) {
      body = zipBytes.slice(dataStart, dataEnd);
    } else if (method === 8) {
      try {
        body = require("zlib").inflateRawSync(zipBytes.slice(dataStart, dataEnd));
      } catch {
        throw new LicenseError("bundle_zip_invalid", "zip could not be read");
      }
    } else {
      throw new LicenseError("bundle_zip_invalid", "zip could not be read");
    }
    members.set(name, body);
    offset = dataEnd;
  }
  if (members.size === 0) {
    throw new LicenseError("bundle_zip_invalid", "zip is empty");
  }
  return members;
}

function readLayout(zipBytes) {
  const members = readZipMembers(zipBytes);
  const manifestBytes = members.get(MANIFEST_NAME);
  if (!manifestBytes) {
    throw new LicenseError("bundle_zip_invalid", "manifest.json missing at zip root");
  }
  let root;
  try {
    root = JSON.parse(manifestBytes.toString("utf8"));
  } catch {
    throw new LicenseError("bundle_zip_invalid", "manifest.json is not JSON");
  }
  if (!root || typeof root !== "object" || Array.isArray(root)) {
    throw new LicenseError("bundle_zip_invalid", "manifest.json must be an object");
  }
  for (const field of Object.keys(root)) {
    if (!["format", "petKey", "version", "platform", "files"].includes(field)) {
      throw new LicenseError("bundle_zip_invalid", "manifest has unknown field");
    }
  }
  if (root.format !== FORMAT) {
    throw new LicenseError("bundle_zip_invalid", "unsupported bundle format");
  }
  const petKey = blankToNull(root.petKey);
  if (!petKey) {
    throw new LicenseError("bundle_zip_invalid", "manifest petKey missing");
  }
  const version = blankToNull(root.version);
  if (!version || !VERSION_RE.test(version)) {
    throw new LicenseError("bundle_zip_invalid", "manifest version invalid");
  }
  const platform = blankToNull(root.platform);
  if (!platform || !PLATFORMS.has(platform)) {
    throw new LicenseError("bundle_zip_invalid", "manifest platform invalid");
  }
  if (!Array.isArray(root.files) || root.files.length === 0) {
    throw new LicenseError("bundle_zip_invalid", "manifest files missing");
  }
  const declared = new Set();
  let hasSprite = false;
  for (const row of root.files) {
    if (!row || typeof row !== "object") {
      throw new LicenseError("bundle_zip_invalid", "manifest files row invalid");
    }
    const path = blankToNull(row.path);
    const fileSha = blankToNull(row.sha256);
    if (!path || !MEMBER_PATH_RE.test(path)) {
      throw new LicenseError("bundle_zip_invalid", "manifest file path invalid");
    }
    if (!fileSha || !SHA256_RE.test(fileSha)) {
      throw new LicenseError("bundle_zip_invalid", "manifest file sha256 invalid");
    }
    if (declared.has(path)) {
      throw new LicenseError("bundle_zip_invalid", "duplicate manifest file path");
    }
    declared.add(path);
    const body = members.get(path);
    if (!body) {
      throw new LicenseError("bundle_zip_invalid", "declared file missing from zip");
    }
    if (!constantTimeEquals(sha256Hex(body), fileSha)) {
      throw new LicenseError("bundle_zip_invalid", "member sha256 mismatch");
    }
    if (path.startsWith("sprites/")) hasSprite = true;
  }
  if (!hasSprite) {
    throw new LicenseError("bundle_zip_invalid", "bundle needs at least one sprites/ member");
  }
  for (const name of members.keys()) {
    if (name === MANIFEST_NAME) continue;
    if (!declared.has(name)) {
      throw new LicenseError("bundle_zip_invalid", "undeclared zip member");
    }
  }
  return {
    petKey: petKey.toLowerCase(),
    version,
    platform,
    memberCount: declared.size,
  };
}

function acceptBundleBytes(zipBytes, rawExpect) {
  const expect = normalizeExpect(rawExpect);
  if (!claimsCatalogIntegrity(expect)) {
    return {
      action: "opaque",
      error: null,
      petKey: null,
      version: null,
      platform: null,
      sha256: null,
      memberCount: 0,
      accepted: true,
    };
  }
  if (!expect.sha256 || !SHA256_RE.test(expect.sha256)) {
    return refuse("bundle_sha256_missing");
  }
  if (!expect.version || !VERSION_RE.test(expect.version)) {
    return refuse("bundle_version_missing");
  }
  if (!expect.petKey) {
    return refuse("bundle_pet_missing");
  }
  if (!Buffer.isBuffer(zipBytes) || zipBytes.length === 0) {
    return refuse("bundle_zip_missing");
  }
  const digest = sha256Hex(zipBytes);
  if (!constantTimeEquals(digest, expect.sha256)) {
    return refuse("bundle_sha256_mismatch");
  }
  let layout;
  try {
    layout = readLayout(zipBytes);
  } catch (err) {
    if (err instanceof LicenseError && typeof err.code === "string") {
      return refuse(err.code);
    }
    return refuse("bundle_zip_invalid");
  }
  if (expect.petKey !== layout.petKey) return refuse("bundle_pet_mismatch");
  if (expect.version !== layout.version) return refuse("bundle_version_mismatch");
  if (expect.platform && expect.platform !== layout.platform) {
    return refuse("bundle_platform_mismatch");
  }
  const local = expect.local;
  if (
    local &&
    expect.petKey === local.petKey &&
    expect.version === local.version &&
    constantTimeEquals(expect.sha256, local.sha256) &&
    (!local.platform || local.platform === layout.platform)
  ) {
    return {
      action: "current",
      error: null,
      petKey: layout.petKey,
      version: layout.version,
      platform: layout.platform,
      sha256: expect.sha256,
      memberCount: layout.memberCount,
      accepted: true,
    };
  }
  return {
    action: !local || !local.petKey ? "install" : "replace",
    error: null,
    petKey: layout.petKey,
    version: layout.version,
    platform: layout.platform,
    sha256: expect.sha256,
    memberCount: layout.memberCount,
    accepted: true,
  };
}

module.exports = {
  FORMAT,
  MANIFEST_NAME,
  sha256Hex,
  alreadyCurrent,
  acceptBundleBytes,
  readLayout,
};
