"use strict";

const crypto = require("crypto");
const { LicenseError } = require("./errors.cjs");

/** Keep in lockstep with MachineRequestSignature.java and machine_sign.py. */
const VERSION = "computerpets-machine-v1";
const TIMESTAMP_HEADER = "X-ComputerPets-Timestamp";
const NONCE_HEADER = "X-ComputerPets-Nonce";
const SIGNATURE_HEADER = "X-ComputerPets-Signature";
const NONCE_PATTERN = /^[A-Za-z0-9_-]{16,128}$/;

function sha256Hex(body) {
  return crypto.createHash("sha256").update(body).digest("hex");
}

function randomNonce() {
  return crypto.randomBytes(16).toString("base64url");
}

function canonical({ method, path, query, timestamp, nonce, body }) {
  const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body || "", "utf8");
  return [
    VERSION,
    String(method || "POST").toUpperCase(),
    path || "",
    query || "",
    String(timestamp),
    String(nonce),
    sha256Hex(bytes),
  ].join("\n");
}

/**
 * HMAC-SHA256 over the verify POST. Key is the LICENSE_SECRET_KEY string
 * (UTF-8), not the decoded AES bytes and not BUNDLE_SIGNING_KEY.
 *
 * @param {{ key: string, method?: string, path: string, query?: string, timestamp?: string | number, nonce?: string, body?: Buffer | string }} parts
 */
function signMachineRequest(parts) {
  if (!parts || typeof parts.key !== "string" || !parts.key) {
    throw new LicenseError("missing_secret", "LICENSE_SECRET_KEY is missing");
  }
  const timestamp = parts.timestamp == null ? String(Math.floor(Date.now() / 1000)) : String(parts.timestamp);
  const nonce = parts.nonce == null ? randomNonce() : String(parts.nonce);
  if (!NONCE_PATTERN.test(nonce)) {
    throw new LicenseError("denied", "machine nonce is not 16-128 chars of [A-Za-z0-9_-]");
  }
  const message = canonical({
    method: parts.method,
    path: parts.path,
    query: parts.query,
    timestamp,
    nonce,
    body: parts.body,
  });
  const signature = crypto
    .createHmac("sha256", Buffer.from(parts.key, "utf8"))
    .update(message, "utf8")
    .digest("base64url");
  return {
    timestamp,
    nonce,
    signature,
    headers: {
      [TIMESTAMP_HEADER]: timestamp,
      [NONCE_HEADER]: nonce,
      [SIGNATURE_HEADER]: signature,
    },
  };
}

module.exports = {
  VERSION,
  TIMESTAMP_HEADER,
  NONCE_HEADER,
  SIGNATURE_HEADER,
  canonical,
  signMachineRequest,
};
