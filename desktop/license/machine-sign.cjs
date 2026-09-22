"use strict";

const crypto = require("crypto");
const { LicenseError } = require("./errors.cjs");

/** Keep in lockstep with MachineRequestSignature.java and machine_sign.py. */
const VERSION = "computerpets-machine-v1";
const TIMESTAMP_HEADER = "X-ComputerPets-Timestamp";
const SIGNATURE_HEADER = "X-ComputerPets-Signature";

function sha256Hex(body) {
  return crypto.createHash("sha256").update(body).digest("hex");
}

function canonical({ method, path, query, timestamp, body }) {
  const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body || "", "utf8");
  return [
    VERSION,
    String(method || "POST").toUpperCase(),
    path || "",
    query || "",
    String(timestamp),
    sha256Hex(bytes),
  ].join("\n");
}

/**
 * HMAC-SHA256 over the verify POST. Key is the LICENSE_SECRET_KEY string
 * (UTF-8), not the decoded AES bytes and not BUNDLE_SIGNING_KEY.
 *
 * @param {{ key: string, method?: string, path: string, query?: string, timestamp?: string | number, body?: Buffer | string }} parts
 */
function signMachineRequest(parts) {
  if (!parts || typeof parts.key !== "string" || !parts.key) {
    throw new LicenseError("missing_secret", "LICENSE_SECRET_KEY is missing");
  }
  const timestamp = parts.timestamp == null ? String(Math.floor(Date.now() / 1000)) : String(parts.timestamp);
  const message = canonical({
    method: parts.method,
    path: parts.path,
    query: parts.query,
    timestamp,
    body: parts.body,
  });
  const signature = crypto
    .createHmac("sha256", Buffer.from(parts.key, "utf8"))
    .update(message, "utf8")
    .digest("base64url");
  return {
    timestamp,
    signature,
    headers: {
      [TIMESTAMP_HEADER]: timestamp,
      [SIGNATURE_HEADER]: signature,
    },
  };
}

module.exports = {
  VERSION,
  TIMESTAMP_HEADER,
  SIGNATURE_HEADER,
  canonical,
  signMachineRequest,
};
