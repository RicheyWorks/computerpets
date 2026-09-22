"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { licenseHonesty, licenseMaySend, licenseHostName, LOCAL_STAYS, clientNetLine, bundleHonesty, bundleMayFetch, bundleHostName, BUNDLE_LOCAL, BUNDLE_IDLE } = require("./license-net.cjs");

describe("license hash names the backend host", () => {
  it("uses the shared network sentence and leaves the path off the line", () => {
    const dirty = "https://user:secret@license.example.test:8443/api/verify?hwid=raw-id#frag";
    const line = licenseHonesty(dirty);
    assert.equal(licenseHostName(dirty), "license.example.test");
    assert.equal(
      line,
      `this unlock sends the license hash. ${clientNetLine("license.example.test")} a bound download sends that same hash.`
    );
    assert.equal(line.includes("secret"), false);
    assert.equal(line.includes("raw-id"), false);
    assert.equal(line.includes("/api"), false);
    assert.equal(line.includes("8443"), false);
    assert.equal(line.includes("frag"), false);
    assert.equal(licenseMaySend(dirty, line), true);
    assert.equal(licenseMaySend(dirty, ""), false);
    assert.equal(licenseMaySend(dirty, clientNetLine("other.example.test")), false);
    assert.equal(licenseHonesty("http://127.0.0.1:8081"), "");
    assert.equal(licenseHonesty("http://localhost:8081"), "");
    assert.equal(licenseHonesty("http://[::1]:8081"), "");
    assert.equal(licenseMaySend("http://127.0.0.1:8081", ""), true);
    assert.equal(LOCAL_STAYS.includes("does not leave"), true);
    assert.equal(LOCAL_STAYS.includes("https request"), false);
  });

  it("paints the line before unlock or a bound download, and does not post on open", () => {
    const settings = fs.readFileSync(path.join(__dirname, "..", "renderer", "settings.html"), "utf8");
    const dialog = fs.readFileSync(path.join(__dirname, "..", "..", "client", "computerpets_client", "unlock_dialog.py"), "utf8");
    const send = settings.slice(settings.indexOf("async function sendLicense"), settings.indexOf('getElementById("unlock")'));
    assert.ok(send.indexOf("paintLicenseNet") < send.indexOf("licenseMaySend"));
    assert.ok(send.indexOf("licenseMaySend") < send.indexOf("licenseUnlock"));
    assert.ok(send.indexOf("licenseMaySend") < send.indexOf("licenseDownload"));
    assert.equal(settings.slice(0, settings.indexOf("async function sendLicense")).includes("licenseUnlock("), false);
    assert.match(settings, /id="licenseNet"/);
    assert.match(settings, /device fingerprint/);
    assert.match(settings, /raw id is not sent/);
    const unlock = dialog.slice(dialog.indexOf("def _unlock"), dialog.indexOf("def _on_ok"));
    const download = dialog.slice(dialog.indexOf("def _download"), dialog.indexOf("def _clear"));
    const worker = dialog.slice(dialog.indexOf("def run"), dialog.indexOf("class UnlockDialog"));
    assert.ok(unlock.indexOf("_hash_may_leave") < unlock.indexOf("UnlockWorker"));
    assert.ok(worker.indexOf('["unlock"]') >= 0);
    assert.ok(download.indexOf("_hash_may_leave") < download.indexOf('["download"]'));
    assert.match(dialog, /device fingerprint/);
    assert.match(dialog, /raw id is not sent/);
    assert.equal(dialog.includes("licenseUnlock"), false);
  });
});

describe("signed bundle names the CDN host", () => {
  it("uses the shared network sentence and leaves the path off the line", () => {
    const dirty = "https://user:secret@cdn.example.test:8443/bundles/red_panda.zip?owner=o&jti=j&exp=1&sig=abc&hwid=raw-id#frag";
    const line = bundleHonesty(dirty);
    assert.equal(bundleHostName(dirty), "cdn.example.test");
    assert.equal(
      line,
      `this download gets the signed bundle. ${clientNetLine("cdn.example.test")} the license hash is not on that request.`
    );
    assert.equal(line.includes("secret"), false);
    assert.equal(line.includes("raw-id"), false);
    assert.equal(line.includes("/bundles"), false);
    assert.equal(line.includes("8443"), false);
    assert.equal(line.includes("frag"), false);
    assert.equal(line.includes("hwid"), false);
    assert.equal(bundleMayFetch(dirty, line), true);
    assert.equal(bundleMayFetch(dirty, ""), false);
    assert.equal(bundleMayFetch(dirty, clientNetLine("other.example.test")), false);
    assert.equal(bundleHonesty("http://127.0.0.1:9/bundles/pet.zip"), "");
    assert.equal(bundleHonesty("http://localhost/pet.zip"), "");
    assert.equal(bundleHonesty("http://[::1]/pet.zip"), "");
    assert.equal(bundleHonesty("file:///tmp/red_panda.zip"), "");
    assert.equal(bundleMayFetch("http://127.0.0.1:9/pet.zip", ""), true);
    assert.equal(bundleMayFetch("file:///tmp/red_panda.zip", ""), true);
    assert.equal(BUNDLE_LOCAL.includes("does not leave"), true);
    assert.equal(BUNDLE_LOCAL.includes("https request"), false);
    assert.equal(BUNDLE_IDLE.includes("https request"), false);
    assert.equal(licenseHonesty(dirty).includes("signed bundle"), false);
  });

  it("paints the CDN line before the bundle GET and does not fetch on open", () => {
    const settings = fs.readFileSync(path.join(__dirname, "..", "renderer", "settings.html"), "utf8");
    const dialog = fs.readFileSync(path.join(__dirname, "..", "..", "client", "computerpets_client", "unlock_dialog.py"), "utf8");
    const finish = settings.slice(settings.indexOf("async function finishBundle"), settings.indexOf("function shownLicenseLine"));
    assert.ok(finish.indexOf("paintBundleNet") < finish.indexOf("bundleMayFetch"));
    assert.ok(finish.indexOf("bundleMayFetch") < finish.indexOf("licenseFetchBundle"));
    const boot = settings.slice(settings.indexOf("licenseStatus().then"), settings.indexOf('backend.addEventListener'));
    assert.equal(boot.includes("licenseFetchBundle"), false);
    assert.match(settings, /id="bundleNet"/);
    const fetchHeld = dialog.slice(dialog.indexOf("def _fetch_if_held"), dialog.indexOf("def _hash_may_leave"));
    assert.ok(fetchHeld.indexOf("_paint_bundle") < fetchHeld.indexOf('["fetch_signed"]'));
    const onOk = dialog.slice(dialog.indexOf("def _on_ok"), dialog.indexOf("def _on_fail"));
    assert.ok(onOk.indexOf("_paint_status") < onOk.indexOf("_fetch_if_held"));
    const download = dialog.slice(dialog.indexOf("def _download(self"), dialog.indexOf("def _clear"));
    assert.ok(download.indexOf('["download"]') < download.indexOf("_fetch_if_held"));
    const init = dialog.slice(dialog.indexOf("class UnlockDialog"), dialog.indexOf("def _mark_text"));
    assert.equal(init.includes("fetch_signed"), false);
  });
});
