"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  downloadMacMessage,
  signDownloadMac,
  verifySignedDownloadUrl,
} = require("./signed-url.cjs");
const { LicenseError } = require("./errors.cjs");

const KEY = "test-bundle-signing-key-not-a-placeholder";

describe("signed download URL (CLIENT-CONTRACT §7)", () => {
  it("MACs petKey|owner|jti|exp when jti is present", () => {
    assert.equal(downloadMacMessage({ petKey: "red_panda", owner: "76561198000000000", jti: "jti-1", exp: 1755411300 }), "red_panda|76561198000000000|jti-1|1755411300");
  });

  it("omits jti from the MAC only when it is absent", () => {
    assert.equal(downloadMacMessage({ petKey: "cat", owner: "owner1", exp: 1 }), "cat|owner1|1");
  });

  it("signs with HMAC-SHA256 over UTF-8 key bytes, URL-safe base64 no padding", () => {
    const sig = signDownloadMac("red_panda|owner|jti-1|100", KEY);
    assert.match(sig, /^[A-Za-z0-9_-]+$/);
    assert.ok(!sig.includes("="));
  });

  it("accepts a URL whose query includes jti and a matching MAC", () => {
    const exp = 1755411300;
    const message = downloadMacMessage({
      petKey: "red_panda",
      owner: "steam:owner",
      jti: "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
      exp,
    });
    const sig = signDownloadMac(message, KEY);
    const url =
      "https://cdn.enterprisepet.example/bundles/red_panda.zip" +
      "?owner=steam%3Aowner&jti=3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80" +
      `&exp=${exp}&sig=${sig}`;
    const parsed = verifySignedDownloadUrl(url, {
      signingKey: KEY,
      jti: "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
      petKey: "red_panda",
      owner: "steam:owner",
    });
    assert.equal(parsed.jti, "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80");
  });

  it("fails closed when jti is missing from a jti-bound URL", () => {
    assert.throws(
      () =>
        verifySignedDownloadUrl("https://cdn.enterprisepet.example/bundles/red_panda.zip?owner=o&exp=1&sig=x", {
          jti: "need-me",
        }),
      (err) => err instanceof LicenseError && err.code === "signed_url_invalid"
    );
  });

  it("fails closed on a bad MAC", () => {
    const url =
      "https://cdn.enterprisepet.example/bundles/red_panda.zip?owner=o&jti=j&exp=1&sig=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    assert.throws(
      () => verifySignedDownloadUrl(url, { signingKey: KEY, jti: "j" }),
      (err) => err instanceof LicenseError && err.code === "signed_url_invalid"
    );
  });
});
