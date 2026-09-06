"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const { decryptLicense, decodeLicenseKey, GCM_IV_BYTES } = require("./decrypt.cjs");
const { encryptLicense } = require("./contract-test-double.cjs");
const { LicenseError } = require("./errors.cjs");

const SECRET = Buffer.alloc(32, 7).toString("base64");

function payload(over = {}) {
  const now = Date.now();
  return {
    jti: "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
    owner: "76561198000000000",
    pet: "red_panda",
    validUntil: new Date(now + 86400_000).toISOString(),
    issuedAt: new Date(now).toISOString(),
    hwid: "device-abc-123",
    ...over,
  };
}

describe("decryptLicense (CLIENT-CONTRACT §3)", () => {
  it("decrypts AES-256-GCM with no KDF, 12-byte IV, and appended 16-byte tag", () => {
    const body = payload();
    const enc = encryptLicense(body, SECRET);
    const iv = Buffer.from(enc.iv, "base64");
    const packed = Buffer.from(enc.ciphertext, "base64");
    assert.equal(iv.length, GCM_IV_BYTES);
    assert.ok(packed.length > 16);

    const got = decryptLicense(enc.ciphertext, enc.iv, SECRET);
    assert.equal(got.jti, body.jti);
    assert.equal(got.owner, body.owner);
    assert.equal(got.pet, body.pet);
    assert.equal(got.hwid, body.hwid);
    assert.equal(got.validUntil, body.validUntil);
    assert.equal(got.issuedAt, body.issuedAt);
  });

  it("reads unbound hwid as null", () => {
    const enc = encryptLicense(payload({ hwid: null }), SECRET);
    assert.equal(decryptLicense(enc.ciphertext, enc.iv, SECRET).hwid, null);
  });

  it("uses LICENSE_SECRET_KEY bytes directly (32-byte key, no salt)", () => {
    const key = decodeLicenseKey(SECRET);
    assert.equal(key.length, 32);
    assert.deepEqual(key, Buffer.alloc(32, 7));
  });

  it("fails closed on tampered ciphertext", () => {
    const enc = encryptLicense(payload(), SECRET);
    const buf = Buffer.from(enc.ciphertext, "base64");
    buf[0] ^= 0xff;
    assert.throws(
      () => decryptLicense(buf.toString("base64"), enc.iv, SECRET),
      (err) => err instanceof LicenseError && err.code === "decrypt_failed"
    );
  });

  it("fails closed on the wrong key", () => {
    const enc = encryptLicense(payload(), SECRET);
    const other = Buffer.alloc(32, 9).toString("base64");
    assert.throws(
      () => decryptLicense(enc.ciphertext, enc.iv, other),
      (err) => err instanceof LicenseError && err.code === "decrypt_failed"
    );
  });

  it("fails closed on a short IV", () => {
    const enc = encryptLicense(payload(), SECRET);
    const shortIv = crypto.randomBytes(8).toString("base64");
    assert.throws(
      () => decryptLicense(enc.ciphertext, shortIv, SECRET),
      (err) => err instanceof LicenseError && err.code === "decrypt_failed"
    );
  });

  it("fails closed on expired validUntil", () => {
    const enc = encryptLicense(payload({ validUntil: new Date(Date.now() - 1000).toISOString() }), SECRET);
    assert.throws(
      () => decryptLicense(enc.ciphertext, enc.iv, SECRET),
      (err) => err instanceof LicenseError && err.code === "expired"
    );
  });

  it("fails closed when LICENSE_SECRET_KEY is missing", () => {
    const enc = encryptLicense(payload(), SECRET);
    assert.throws(
      () => decryptLicense(enc.ciphertext, enc.iv, ""),
      (err) => err instanceof LicenseError && err.code === "missing_secret"
    );
  });

  it("fails closed on URL-safe base64 (contract is standard RFC 4648)", () => {
    const enc = encryptLicense(payload(), SECRET);
    const urlSafe = enc.ciphertext.replace(/\+/g, "-").replace(/\//g, "_");
    if (urlSafe === enc.ciphertext) {
      assert.throws(
        () => decryptLicense("abc-def_ghi", enc.iv, SECRET),
        (err) => err instanceof LicenseError && err.code === "decrypt_failed"
      );
      return;
    }
    assert.throws(
      () => decryptLicense(urlSafe, enc.iv, SECRET),
      (err) => err instanceof LicenseError && err.code === "decrypt_failed"
    );
  });

  it("fails closed when required payload fields are missing", () => {
    const enc = encryptLicense({ owner: "x", pet: "red_panda", validUntil: payload().validUntil, issuedAt: payload().issuedAt }, SECRET);
    assert.throws(
      () => decryptLicense(enc.ciphertext, enc.iv, SECRET),
      (err) => err instanceof LicenseError && err.code === "decrypt_failed"
    );
  });
});
