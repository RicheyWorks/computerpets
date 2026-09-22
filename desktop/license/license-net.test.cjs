"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { licenseHonesty, licenseMaySend, licenseHostName, LOCAL_STAYS, clientNetLine } = require("./license-net.cjs");

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
