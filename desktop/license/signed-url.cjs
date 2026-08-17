"use strict";

const crypto = require("crypto");
const { LicenseError } = require("./errors.cjs");

/**
 * MAC input from PetBundleService: petKey|owner|jti|exp when jti is present,
 * otherwise petKey|owner|exp. exp is Unix epoch seconds.
 *
 * @param {{ petKey: string, owner: string, jti?: string | null, exp: string | number }} parts
 * @returns {string}
 */
function downloadMacMessage(parts) {
  if (!parts || !parts.petKey || parts.owner == null || parts.exp == null) {
    throw new LicenseError("signed_url_invalid", "signed URL MAC fields missing");
  }
  const exp = String(parts.exp);
  if (parts.jti) return `${parts.petKey}|${parts.owner}|${parts.jti}|${exp}`;
  return `${parts.petKey}|${parts.owner}|${exp}`;
}

/**
 * HMAC-SHA256 over UTF-8 bytes of BUNDLE_SIGNING_KEY; Base64 URL-safe, no padding.
 * @param {string} message
 * @param {string} signingKey
 * @returns {string}
 */
function signDownloadMac(message, signingKey) {
  if (typeof signingKey !== "string" || !signingKey) {
    throw new LicenseError("signed_url_invalid", "BUNDLE_SIGNING_KEY is missing");
  }
  const mac = crypto.createHmac("sha256", Buffer.from(signingKey, "utf8")).update(message, "utf8").digest();
  return mac.toString("base64url");
}

/**
 * @param {string} urlString
 * @returns {{ petKey: string, owner: string | null, jti: string | null, exp: string | null, sig: string | null }}
 */
function parseSignedDownloadUrl(urlString) {
  if (typeof urlString !== "string" || !urlString) {
    throw new LicenseError("signed_url_invalid", "downloadUrl missing");
  }
  let url;
  try {
    url = new URL(urlString);
  } catch {
    throw new LicenseError("signed_url_invalid", "downloadUrl is not a URL");
  }
  const file = url.pathname.split("/").filter(Boolean).pop() || "";
  const petKey = file.endsWith(".zip") ? file.slice(0, -4) : file;
  return {
    petKey,
    owner: url.searchParams.get("owner"),
    jti: url.searchParams.get("jti"),
    exp: url.searchParams.get("exp"),
    sig: url.searchParams.get("sig"),
  };
}

/**
 * Confirm the URL carries the license jti (always true for this backend)
 * and, when a signing key is supplied, that the HMAC matches.
 *
 * @param {string} urlString
 * @param {{ jti?: string | null, petKey?: string, owner?: string, signingKey?: string }} expect
 */
function verifySignedDownloadUrl(urlString, expect = {}) {
  const parsed = parseSignedDownloadUrl(urlString);
  if (expect.jti && parsed.jti !== expect.jti) {
    throw new LicenseError("signed_url_invalid", "signed URL jti does not match license", {
      expected: expect.jti,
      received: parsed.jti,
    });
  }
  if (!parsed.jti && expect.jti) {
    throw new LicenseError("signed_url_invalid", "signed URL missing jti");
  }
  if (expect.petKey && parsed.petKey !== expect.petKey) {
    throw new LicenseError("signed_url_invalid", "signed URL petKey does not match license");
  }
  if (expect.owner && parsed.owner !== expect.owner) {
    throw new LicenseError("signed_url_invalid", "signed URL owner does not match license");
  }
  if (expect.signingKey) {
    if (!parsed.sig || !parsed.exp || !parsed.owner || !parsed.petKey) {
      throw new LicenseError("signed_url_invalid", "signed URL missing HMAC fields");
    }
    const message = downloadMacMessage({
      petKey: parsed.petKey,
      owner: parsed.owner,
      jti: parsed.jti,
      exp: parsed.exp,
    });
    const expected = signDownloadMac(message, expect.signingKey);
    const a = Buffer.from(expected);
    const b = Buffer.from(parsed.sig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      throw new LicenseError("signed_url_invalid", "signed URL MAC mismatch");
    }
  }
  return parsed;
}

module.exports = {
  downloadMacMessage,
  signDownloadMac,
  parseSignedDownloadUrl,
  verifySignedDownloadUrl,
};
