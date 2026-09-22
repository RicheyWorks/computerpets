"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

require("./weather-areas.js");
const page = require("./license-net.js");
const main = require("../license/license-net.cjs");

describe("overlay license line matches the main-process gate", () => {
  it("names the same host with the shared sentence", () => {
    const url = "https://user:secret@license.example.test/api?hwid=raw-id#room";
    assert.equal(page.licenseHonesty(url), main.licenseHonesty(url));
    assert.equal(page.licenseMaySend(url, page.licenseHonesty(url)), true);
    assert.equal(page.licenseMaySend(url, false), false);
    assert.equal(page.licenseHonesty("http://127.0.0.1:8081"), "");
    assert.equal(page.LOCAL_STAYS, main.LOCAL_STAYS);
    assert.equal(page.licenseHonesty(url).includes(path.basename("raw-id")), false);
    const bundle = "https://user:secret@cdn.example.test/bundles/pet.zip?hwid=raw-id#room";
    assert.equal(page.bundleHonesty(bundle), main.bundleHonesty(bundle));
    assert.equal(page.bundleMayFetch(bundle, page.bundleHonesty(bundle)), true);
    assert.equal(page.bundleMayFetch(bundle, false), false);
    assert.equal(page.bundleHonesty("file:///tmp/pet.zip"), "");
    assert.equal(page.BUNDLE_LOCAL, main.BUNDLE_LOCAL);
    assert.equal(page.BUNDLE_IDLE, main.BUNDLE_IDLE);
    assert.equal(page.bundleHonesty(bundle).includes("raw-id"), false);
    assert.equal(page.licenseHonesty(url), main.licenseHonesty(url));
    assert.equal(page.downloadTalkHonesty(url), main.downloadTalkHonesty(url));
    assert.equal(page.downloadMayPost(url, page.downloadTalkHonesty(url)), true);
    assert.equal(page.downloadMayPost(url, page.licenseHonesty(url)), false);
    assert.equal(page.downloadTalkHonesty("http://127.0.0.1:8081"), "");
    assert.equal(page.DOWNLOAD_LOCAL, main.DOWNLOAD_LOCAL);
    assert.equal(page.downloadTalkHonesty(url).includes("sends the license hash"), false);
  });

  it("refuses the page request inside the wrapper and keeps a loopback local", async () => {
    const url = "https://license.example.test/api/verify";
    const bundle = "https://cdn.example.test/pet.zip?owner=o&jti=j&exp=1&sig=abc";
    let calls = 0;
    const request = async () => {
      calls += 1;
      return "sent";
    };
    const hashHold = await page.postLicenseHash("", url, request);
    const downloadHold = await page.postUnboundDownload(page.licenseHonesty(url), url, request);
    const bundleHold = await page.getSignedBundle(page.bundleHonesty("https://other.example.test/pet.zip"), bundle, request);
    assert.equal(hashHold.held, true);
    assert.equal(downloadHold.held, true);
    assert.equal(bundleHold.held, true);
    assert.equal(calls, 0);
    assert.equal(await page.postLicenseHash(page.licenseHonesty(url), url, request), "sent");
    assert.equal(await page.postUnboundDownload(page.downloadTalkHonesty(url), url, request), "sent");
    assert.equal(await page.getSignedBundle(page.bundleHonesty(bundle), bundle, async () => bundle), bundle);
    assert.equal(bundle.includes("sig=abc"), true);
    assert.equal(await page.postLicenseHash("", "http://127.0.0.1:8081", async () => "local"), "local");
    assert.equal(await page.getSignedBundle("", "file:///tmp/pet.zip", async () => "file"), "file");
    assert.equal(calls, 2);
  });
});
