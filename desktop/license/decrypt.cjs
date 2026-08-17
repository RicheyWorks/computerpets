"use strict";

const crypto = require("crypto");
const { LicenseError } = require("./errors.cjs");

const AES_KEY_BYTES = 32;
const GCM_IV_BYTES = 12;
const GCM_TAG_BYTES = 16;

const REQUIRED_FIELDS = ["jti", "owner", "pet", "validUntil", "issuedAt"];

/**
 * RFC 4648 standard Base64 (not URL-safe). Fail closed on junk.
 * @param {string} value
 * @param {string} label
 * @returns {Buffer}
 */
function decodeStandardBase64(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new LicenseError("decrypt_failed", `${label} missing`);
  }
  const trimmed = value.trim().replace(/\s+/g, "");
  if (trimmed.includes("-") || trimmed.includes("_")) {
    throw new LicenseError("decrypt_failed", `${label} must be standard base64, not URL-safe`);
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(trimmed)) {
    throw new LicenseError("decrypt_failed", `${label} is not valid base64`);
  }
  const buf = Buffer.from(trimmed, "base64");
  if (buf.length === 0) {
    throw new LicenseError("decrypt_failed", `${label} is not valid base64`);
  }
  const normalize = (s) => s.replace(/=+$/, "");
  if (normalize(buf.toString("base64")) !== normalize(trimmed)) {
    throw new LicenseError("decrypt_failed", `${label} is not valid base64`);
  }
  return buf;
}

/**
 * LICENSE_SECRET_KEY is standard Base64 of exactly 32 bytes. No KDF.
 * @param {string | undefined | null} secretB64
 * @returns {Buffer}
 */
function decodeLicenseKey(secretB64) {
  if (typeof secretB64 !== "string" || !secretB64.trim()) {
    throw new LicenseError("missing_secret", "LICENSE_SECRET_KEY is missing");
  }
  let key;
  try {
    key = decodeStandardBase64(secretB64, "LICENSE_SECRET_KEY");
  } catch (err) {
    if (err instanceof LicenseError && err.code === "decrypt_failed") {
      throw new LicenseError("missing_secret", "LICENSE_SECRET_KEY is not valid base64");
    }
    throw err;
  }
  if (key.length !== AES_KEY_BYTES) {
    throw new LicenseError(
      "missing_secret",
      `LICENSE_SECRET_KEY must decode to ${AES_KEY_BYTES} bytes (AES-256). Got ${key.length}`
    );
  }
  return key;
}

/**
 * Decrypt a license issued by LicenseService (AES-256-GCM, 12-byte IV,
 * 128-bit tag appended to the ciphertext, no AAD, UTF-8 JSON).
 *
 * @param {string} ciphertextB64
 * @param {string} ivB64
 * @param {string} secretB64
 * @param {{ now?: () => number }} [opts]
 * @returns {{ jti: string, owner: string, pet: string, validUntil: string, issuedAt: string, hwid: string | null }}
 */
function decryptLicense(ciphertextB64, ivB64, secretB64, opts = {}) {
  const key = decodeLicenseKey(secretB64);
  const iv = decodeStandardBase64(ivB64, "iv");
  const packed = decodeStandardBase64(ciphertextB64, "ciphertext");

  if (iv.length !== GCM_IV_BYTES) {
    throw new LicenseError("decrypt_failed", `iv must be ${GCM_IV_BYTES} bytes, got ${iv.length}`);
  }
  if (packed.length <= GCM_TAG_BYTES) {
    throw new LicenseError("decrypt_failed", "ciphertext too short to contain a GCM tag");
  }

  const tag = packed.subarray(packed.length - GCM_TAG_BYTES);
  const ciphertext = packed.subarray(0, packed.length - GCM_TAG_BYTES);

  let plaintext;
  try {
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv, { authTagLength: GCM_TAG_BYTES });
    decipher.setAuthTag(tag);
    plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  } catch {
    throw new LicenseError("decrypt_failed", "license ciphertext failed authentication");
  }

  let payload;
  try {
    payload = JSON.parse(plaintext.toString("utf8"));
  } catch {
    throw new LicenseError("decrypt_failed", "license plaintext is not JSON");
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new LicenseError("decrypt_failed", "license payload is not an object");
  }

  for (const field of REQUIRED_FIELDS) {
    if (typeof payload[field] !== "string" || !payload[field]) {
      throw new LicenseError("decrypt_failed", `license payload missing ${field}`);
    }
  }

  const validUntilMs = Date.parse(payload.validUntil);
  if (Number.isNaN(validUntilMs)) {
    throw new LicenseError("decrypt_failed", "license validUntil is not ISO-8601");
  }
  const now = typeof opts.now === "function" ? opts.now() : Date.now();
  if (validUntilMs <= now) {
    throw new LicenseError("expired", "license expired", { validUntil: payload.validUntil });
  }

  return {
    jti: payload.jti,
    owner: payload.owner,
    pet: payload.pet,
    validUntil: payload.validUntil,
    issuedAt: payload.issuedAt,
    hwid: typeof payload.hwid === "string" && payload.hwid ? payload.hwid : null,
  };
}

module.exports = {
  AES_KEY_BYTES,
  GCM_IV_BYTES,
  GCM_TAG_BYTES,
  decodeStandardBase64,
  decodeLicenseKey,
  decryptLicense,
};
