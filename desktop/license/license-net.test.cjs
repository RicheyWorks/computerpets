"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { licenseHonesty, licenseMaySend, licenseHostName, LOCAL_STAYS, plainNetLine, bundleHonesty, bundleMayFetch, bundleHostName, BUNDLE_LOCAL, BUNDLE_IDLE, downloadTalkHonesty, downloadMayPost, DOWNLOAD_LOCAL, postLicenseHash, postUnboundDownload, getSignedBundle } = require("./license-net.cjs");
const { LicenseError } = require("./errors.cjs");

describe("license hash names the backend host", () => {
  it("uses the shared network sentence and leaves the path off the line", () => {
    const dirty = "https://user:secret@license.example.test:8443/api/verify?hwid=raw-id#frag";
    const line = licenseHonesty(dirty);
    assert.equal(licenseHostName(dirty), "license.example.test");
    assert.equal(
      line,
      `This asks license.example.test, the license website, to check your license. It sends what you typed for your license and a scrambled code made from this computer's ID. The ID itself stays here. ${plainNetLine("license.example.test")} A download tied to this computer sends that same code.`
    );
    assert.equal(line.includes("secret"), false);
    assert.equal(line.includes("raw-id"), false);
    assert.equal(line.includes("/api"), false);
    assert.equal(line.includes("8443"), false);
    assert.equal(line.includes("frag"), false);
    assert.equal(licenseMaySend(dirty, line), true);
    assert.equal(licenseMaySend(dirty, ""), false);
    assert.equal(licenseMaySend(dirty, plainNetLine("other.example.test")), false);
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
    assert.ok(send.indexOf("paintLicenseNet") < send.indexOf("postLicenseHash"));
    assert.ok(send.indexOf("postLicenseHash") < send.indexOf("licenseUnlock"));
    assert.ok(send.lastIndexOf("licenseDownload") > send.indexOf("postLicenseHash"));
    assert.equal(send.includes("licenseMaySend"), false);
    assert.equal(settings.slice(0, settings.indexOf("async function sendLicense")).includes("licenseUnlock("), false);
    assert.match(settings, /id="licenseNet"/);
    assert.match(settings, /device fingerprint/);
    assert.match(settings, /raw id is not sent/);
    const unlock = dialog.slice(dialog.indexOf("def _unlock(self"), dialog.indexOf("def _on_ok"));
    const download = dialog.slice(dialog.indexOf("def _download(self"), dialog.indexOf("def _clear"));
    const begin = dialog.slice(dialog.indexOf("def _begin_unlock"), dialog.indexOf("def _unlock(self"));
    const worker = dialog.slice(dialog.indexOf("def run"), dialog.indexOf("class UnlockDialog"));
    assert.ok(unlock.indexOf("_paint_net") < unlock.indexOf("post_license_hash"));
    assert.ok(unlock.indexOf("post_license_hash") < unlock.indexOf("_begin_unlock"));
    assert.equal(unlock.includes("license_may_send"), false);
    assert.ok(begin.includes("UnlockWorker"));
    assert.ok(worker.indexOf('["unlock"]') >= 0);
    assert.ok(download.indexOf("post_license_hash") < download.indexOf('["download"]') || download.indexOf("def go") < download.indexOf("post_license_hash"));
    assert.equal(download.includes("_hash_may_leave"), false);
    assert.match(dialog, /device fingerprint/);
    assert.match(dialog, /raw id is not sent/);
    assert.equal(dialog.includes("licenseUnlock"), false);
  });
});

describe("unbound download names the backend host", () => {
  it("uses the shared network sentence and does not say a hash is sent", () => {
    const dirty = "https://user:secret@license.example.test:8443/api/download/red_panda?hwid=raw-id#frag";
    const line = downloadTalkHonesty(dirty);
    const hash = licenseHonesty(dirty);
    assert.equal(
      hash,
      `This asks license.example.test, the license website, to check your license. It sends what you typed for your license and a scrambled code made from this computer's ID. The ID itself stays here. ${plainNetLine("license.example.test")} A download tied to this computer sends that same code.`
    );
    assert.equal(
      line,
      `This asks license.example.test, the license website, for your pet. It sends your saved license and the pass from unlocking. ${plainNetLine("license.example.test")} It does not send the code made from this computer's ID.`
    );
    assert.equal(line.includes("sends the license hash"), false);
    assert.equal(line.includes("secret"), false);
    assert.equal(line.includes("raw-id"), false);
    assert.equal(line.includes("/api"), false);
    assert.equal(line.includes("8443"), false);
    assert.equal(line.includes("frag"), false);
    assert.equal(downloadMayPost(dirty, line), true);
    assert.equal(downloadMayPost(dirty, ""), false);
    assert.equal(downloadMayPost(dirty, hash), false);
    assert.equal(downloadMayPost(dirty, plainNetLine("license.example.test")), false);
    assert.equal(downloadMayPost(dirty, plainNetLine("other.example.test")), false);
    assert.equal(downloadTalkHonesty("http://127.0.0.1:8081"), "");
    assert.equal(downloadTalkHonesty("http://localhost:8081"), "");
    assert.equal(downloadTalkHonesty("http://[::1]:8081"), "");
    assert.equal(downloadMayPost("http://127.0.0.1:8081", ""), true);
    assert.equal(DOWNLOAD_LOCAL.includes("talks to this computer"), true);
    assert.equal(DOWNLOAD_LOCAL.includes("does not send the code made from this computer's ID"), true);
    assert.equal(DOWNLOAD_LOCAL.includes("https request"), false);
    assert.equal(DOWNLOAD_LOCAL.includes("sends the license hash"), false);
  });

  it("paints the download line before an unbound POST and does not post on open", () => {
    const settings = fs.readFileSync(path.join(__dirname, "..", "renderer", "settings.html"), "utf8");
    const dialog = fs.readFileSync(path.join(__dirname, "..", "..", "client", "computerpets_client", "unlock_dialog.py"), "utf8");
    const send = settings.slice(settings.indexOf("async function sendLicense"), settings.indexOf('getElementById("unlock")'));
    assert.ok(send.indexOf("paintLicenseNet") < send.indexOf("postUnboundDownload"));
    assert.ok(send.indexOf("postUnboundDownload") < send.indexOf("licenseDownload"));
    assert.equal(send.includes("downloadMayPost"), false);
    assert.ok(settings.indexOf("downloadTalkHonesty") < settings.indexOf("async function sendLicense"));
    const boot = settings.slice(settings.indexOf("licenseStatus().then"), settings.indexOf('backend.addEventListener'));
    assert.equal(boot.includes("licenseDownload"), false);
    assert.equal(boot.includes("licenseUnlock"), false);
    const download = dialog.slice(dialog.indexOf("def _download(self"), dialog.indexOf("def _clear"));
    assert.ok(download.indexOf("_paint_net") < download.indexOf("post_unbound_download"));
    assert.ok(download.indexOf("def go") < download.indexOf("post_unbound_download"));
    assert.equal(download.includes("download_may_post"), false);
    assert.equal(download.includes("_download_may_leave"), false);
    const init = dialog.slice(dialog.indexOf("class UnlockDialog"), dialog.indexOf("def _mark_text"));
    assert.equal(init.includes('["download"]'), false);
  });
});

describe("signed bundle names the CDN host", () => {
  it("uses the shared network sentence and leaves the path off the line", () => {
    const dirty = "https://user:secret@cdn.example.test:8443/bundles/red_panda.zip?owner=o&jti=j&exp=1&sig=abc&hwid=raw-id#frag";
    const line = bundleHonesty(dirty);
    assert.equal(bundleHostName(dirty), "cdn.example.test");
    assert.equal(
      line,
      `This gets your pet's files from cdn.example.test, the download website, with the link the license website gave. ${plainNetLine("cdn.example.test")} It does not send the code made from this computer's ID.`
    );
    assert.equal(line.includes("secret"), false);
    assert.equal(line.includes("raw-id"), false);
    assert.equal(line.includes("/bundles"), false);
    assert.equal(line.includes("8443"), false);
    assert.equal(line.includes("frag"), false);
    assert.equal(line.includes("hwid"), false);
    assert.equal(bundleMayFetch(dirty, line), true);
    assert.equal(bundleMayFetch(dirty, ""), false);
    assert.equal(bundleMayFetch(dirty, plainNetLine("other.example.test")), false);
    assert.equal(bundleHonesty("http://127.0.0.1:9/bundles/pet.zip"), "");
    assert.equal(bundleHonesty("http://localhost/pet.zip"), "");
    assert.equal(bundleHonesty("http://[::1]/pet.zip"), "");
    assert.equal(bundleHonesty("file:///tmp/red_panda.zip"), "");
    assert.equal(bundleMayFetch("http://127.0.0.1:9/pet.zip", ""), true);
    assert.equal(bundleMayFetch("file:///tmp/red_panda.zip", ""), true);
    assert.equal(BUNDLE_LOCAL.includes("come from this computer"), true);
    assert.equal(BUNDLE_LOCAL.includes("https request"), false);
    assert.equal(BUNDLE_IDLE.includes("https request"), false);
    assert.equal(licenseHonesty(dirty).includes("signed bundle"), false);
  });

  it("paints the CDN line before the bundle GET and does not fetch on open", () => {
    const settings = fs.readFileSync(path.join(__dirname, "..", "renderer", "settings.html"), "utf8");
    const dialog = fs.readFileSync(path.join(__dirname, "..", "..", "client", "computerpets_client", "unlock_dialog.py"), "utf8");
    const finish = settings.slice(settings.indexOf("async function finishBundle"), settings.indexOf("function shownLicenseLine"));
    assert.ok(finish.indexOf("paintBundleNet") < finish.indexOf("getSignedBundle"));
    assert.ok(finish.indexOf("getSignedBundle") < finish.indexOf("licenseFetchBundle"));
    assert.equal(finish.includes("bundleMayFetch"), false);
    const boot = settings.slice(settings.indexOf("licenseStatus().then"), settings.indexOf('backend.addEventListener'));
    assert.equal(boot.includes("licenseFetchBundle"), false);
    assert.match(settings, /id="bundleNet"/);
    const fetchHeld = dialog.slice(dialog.indexOf("def _fetch_if_held"), dialog.indexOf("def _paint_status"));
    assert.ok(fetchHeld.indexOf("_paint_bundle") < fetchHeld.indexOf("get_signed_bundle"));
    assert.ok(fetchHeld.indexOf("get_signed_bundle") < fetchHeld.indexOf('["fetch_signed"]'));
    assert.equal(fetchHeld.includes("bundle_may_fetch"), false);
    const onOk = dialog.slice(dialog.indexOf("def _on_ok"), dialog.indexOf("def _on_fail"));
    assert.ok(onOk.indexOf("_paint_status") < onOk.indexOf("_fetch_if_held"));
    const download = dialog.slice(dialog.indexOf("def _download(self"), dialog.indexOf("def _clear"));
    assert.ok(download.indexOf('["download"]') < download.indexOf("_fetch_if_held"));
    const init = dialog.slice(dialog.indexOf("class UnlockDialog"), dialog.indexOf("def _mark_text"));
    assert.equal(init.includes("fetch_signed"), false);
  });
});

describe("license requests leave only through the refusing wrapper", () => {
  const remote = "https://user:secret@license.example.test/api/verify?hwid=raw-id#frag";
  const bundle = "https://user:secret@cdn.example.test/bundles/red_panda.zip?owner=o&jti=j&exp=1&sig=abc#frag";

  it("does not post the hash, read an id, or say can't reach when the line is missing", async () => {
    let calls = 0;
    await assert.rejects(
      () => postLicenseHash("", remote, async () => { calls += 1; return "sent"; }),
      (err) => err instanceof LicenseError && err.code === "license_net_unnamed" && !/can't reach|unreachable|sig=/.test(err.message)
    );
    await assert.rejects(
      () => postLicenseHash(plainNetLine("other.example.test"), remote, async () => { calls += 1; return "sent"; }),
      (err) => err instanceof LicenseError && err.code === "license_net_unnamed"
    );
    assert.equal(calls, 0);
    assert.equal(await postLicenseHash(licenseHonesty(remote), remote, async () => "sent"), "sent");
    assert.equal(await postLicenseHash("", "http://127.0.0.1:8081", async () => "local"), "local");
  });

  it("does not post an unbound download when the hash line is the only line", async () => {
    let calls = 0;
    const line = downloadTalkHonesty(remote);
    await assert.rejects(
      () => postUnboundDownload("", remote, async () => { calls += 1; }),
      (err) => err instanceof LicenseError && err.code === "download_net_unnamed" && !/can't reach|unreachable/.test(err.message)
    );
    await assert.rejects(
      () => postUnboundDownload(licenseHonesty(remote), remote, async () => { calls += 1; }),
      (err) => err instanceof LicenseError && err.code === "download_net_unnamed"
    );
    assert.equal(calls, 0);
    assert.equal(await postUnboundDownload(line, remote, async () => "posted"), "posted");
    assert.equal(await postUnboundDownload("", "http://127.0.0.1:8081", async () => "local"), "local");
  });

  it("does not GET a signed bundle, and does not drop owner jti exp or sig, when the line is wrong", async () => {
    let calls = 0;
    const seen = [];
    const request = async () => {
      calls += 1;
      seen.push(bundle);
      return { ok: true, status: 200, bytes: 4, held: false };
    };
    const held = await getSignedBundle("", bundle, request, false);
    assert.equal(held.held, true);
    assert.equal(calls, 0);
    await assert.rejects(
      () => getSignedBundle(bundleHonesty("https://other.example.test/pet.zip"), bundle, request, true),
      (err) => err instanceof LicenseError && err.code === "cdn_net_unnamed" && !/sig=|owner=|jti=|can't reach/.test(err.message)
    );
    assert.equal(calls, 0);
    const fetched = await getSignedBundle(bundleHonesty(bundle), bundle, request, true);
    assert.equal(fetched.ok, true);
    assert.equal(seen[0].includes("owner=o"), true);
    assert.equal(seen[0].includes("jti=j"), true);
    assert.equal(seen[0].includes("exp=1"), true);
    assert.equal(seen[0].includes("sig=abc"), true);
    assert.equal(await getSignedBundle("", "http://127.0.0.1:9/pet.zip", async () => "local"), "local");
  });

  it("calls verify, download, and fetchBundle only from inside the wrapper", () => {
    const session = fs.readFileSync(path.join(__dirname, "session.cjs"), "utf8");
    const unlock = session.slice(session.indexOf("async function unlock"), session.indexOf("function readBundle"));
    assert.ok(unlock.indexOf("postLicenseHash") < unlock.indexOf("client.verify"));
    assert.equal(unlock.includes("licenseMaySend"), false);
    const download = session.slice(session.indexOf("async function requestDownload"), session.indexOf("async function download"));
    assert.ok(download.indexOf("postLicenseHash") < download.indexOf("client.download"));
    assert.ok(download.indexOf("postUnboundDownload") < download.indexOf("client.download"));
    assert.equal(download.includes("downloadMayPost"), false);
    const bundleRead = session.slice(session.indexOf("function readBundle"), session.indexOf("async function requestDownload"));
    assert.ok(bundleRead.indexOf("getSignedBundle") < bundleRead.indexOf("client.fetchBundle"));
    assert.equal(bundleRead.includes("bundleMayFetch"), false);
    assert.equal(session.includes("assertHashNamed"), false);
  });
});
