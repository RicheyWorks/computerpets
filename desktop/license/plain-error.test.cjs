const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const P = require("./plain-error.cjs");
const { LicenseError } = require("./errors.cjs");
const { createLicenseClient } = require("./client.cjs");
const { NO_LICENSE_MESSAGE } = require("./session.cjs");

const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const settingsSrc = readFileSync(join(__dirname, "..", "renderer", "settings.html"), "utf8");

const RAW = /ECONN|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|getaddrinfo|fetch failed|AbortError|TypeError|CERT_|certificate has expired|unable to verify|backend is unreachable|timed out|socket|undici|\n\s+at /;

function sys(code, message) {
  return Object.assign(new Error(message), { code });
}

function undici(code, message) {
  return new TypeError("fetch failed", { cause: sys(code, message) });
}

function assertPlain(result, code, pattern) {
  assert.equal(result.code, code);
  assert.match(result.message, pattern);
  assert.doesNotMatch(result.message, RAW, result.message);
}

test("refused, reset, and bare 'fetch failed' say the house server could not be reached", () => {
  const want = /^Couldn't reach the house server at house\.example:8081\. Pets still work without it\.$/;
  for (const err of [
    undici("ECONNREFUSED", "connect ECONNREFUSED 10.0.0.9:8081"),
    undici("ECONNRESET", "read ECONNRESET"),
    sys("ECONNREFUSED", "connect ECONNREFUSED 127.0.0.1:8081"),
    new TypeError("fetch failed"),
  ]) {
    assertPlain(P.plainLicenseError(err, { host: "house.example:8081" }), "unreachable", want);
  }
});

test("no such host says the house server could not be found", () => {
  for (const err of [undici("ENOTFOUND", "getaddrinfo ENOTFOUND nope.example"), sys("EAI_AGAIN", "getaddrinfo EAI_AGAIN nope.example")]) {
    assertPlain(P.plainLicenseError(err, { host: "nope.example" }), "not_found", /^Couldn't find the house server at nope\.example\. Check the Backend URL\. Pets still work without it\.$/);
  }
});

test("timeouts and aborts say the house server took too long", () => {
  const abort = Object.assign(new Error("This operation was aborted"), { name: "AbortError", code: "ABORT_ERR" });
  for (const err of [undici("ETIMEDOUT", "connect ETIMEDOUT 10.0.0.9:8081"), undici("UND_ERR_CONNECT_TIMEOUT", "Connect Timeout Error"), abort]) {
    assertPlain(P.plainLicenseError(err, { host: "10.0.0.9:8081" }), "timeout", /^The house server at 10\.0\.0\.9:8081 took too long to answer\. Pets still work without it\.$/);
  }
});

test("TLS failures say there was a certificate problem and nothing was sent", () => {
  for (const err of [
    undici("CERT_HAS_EXPIRED", "certificate has expired"),
    undici("UNABLE_TO_VERIFY_LEAF_SIGNATURE", "unable to verify the first certificate"),
    undici("DEPTH_ZERO_SELF_SIGNED_CERT", "self-signed certificate"),
    undici("ERR_TLS_CERT_ALTNAME_INVALID", "Hostname/IP does not match certificate's altnames"),
  ]) {
    assertPlain(P.plainLicenseError(err, { host: "house.example" }), "tls", /^Couldn't make a secure connection to the house server at house\.example \(certificate problem\), so nothing was sent\. Pets still work without it\.$/);
  }
});

test("HTTP 5xx and 429 from the real client say the server had a problem or is busy, naming the host", async () => {
  const answer = (status, body) => async () => ({ ok: false, status, text: async () => JSON.stringify(body) });
  const verifyArgs = { backendUrl: "https://house.example", provider: "steam", fields: { steamId: "1" }, licenseSecret: Buffer.alloc(32, 1).toString("base64") };
  const downloadArgs = { backendUrl: "https://house.example", petKey: "cat", ciphertext: "a", iv: "b", token: "t" };
  for (const [call, args] of [["verify", verifyArgs], ["download", downloadArgs]]) {
    for (const status of [500, 502, 503]) {
      const client = createLicenseClient({ fetchImpl: answer(status, { error: "java.lang.NullPointerException at com.house.Verify" }) });
      const err = await client[call](args).then(() => null, (e) => e);
      assert.ok(err instanceof LicenseError, `${call} ${status}`);
      assertPlain(P.plainLicenseError(err), "server_error", new RegExp(`^The house server at house\\.example had a problem \\(error ${status}\\)\\. Try again later\\. Pets still work without it\\.$`));
      assert.doesNotMatch(P.plainLicenseError(err).message, /NullPointer/);
    }
    const busy = await createLicenseClient({ fetchImpl: answer(429, {}) })[call](args).then(() => null, (e) => e);
    assertPlain(P.plainLicenseError(busy), "busy", /^The house server at house\.example is busy right now\. Try again in a minute\./);
  }
});

test("a fetch that throws inside the real client names the host it aimed at", async () => {
  const client = createLicenseClient({ fetchImpl: async () => { throw undici("ECONNREFUSED", "connect ECONNREFUSED 127.0.0.1:8081"); } });
  const err = await client.verify({ backendUrl: "http://127.0.0.1:8081", provider: "steam", fields: { steamId: "1" }, licenseSecret: Buffer.alloc(32, 1).toString("base64") }).then(() => null, (e) => e);
  assert.equal(err.code, "unreachable");
  assert.equal(err.host, "127.0.0.1:8081");
  assert.match(P.rawLogLine(err), /ECONNREFUSED/);
  assertPlain(P.plainLicenseError(err), "unreachable", /^Couldn't reach the house server at 127\.0\.0\.1:8081\. Pets still work without it\.$/);
});

test("the house's own license codes keep their clear sentences", () => {
  assert.deepEqual(P.plainLicenseError(new LicenseError("no_license", NO_LICENSE_MESSAGE)), { code: "no_license", message: NO_LICENSE_MESSAGE });
  assert.deepEqual(P.plainLicenseError(new LicenseError("hwid_mismatch", "hardware binding mismatch")), { code: "hwid_mismatch", message: "hardware binding mismatch" });
  assert.deepEqual(P.plainLicenseError(new LicenseError("denied", "ownership not verified")), { code: "denied", message: "ownership not verified" });
  const unnamed = new LicenseError("cdn_net_unnamed", "the signed bundle was not fetched from cdn.example. name that host before it leaves.");
  assert.equal(P.plainLicenseError(unnamed).message, unnamed.message);
});

test("an unknown throw never shows its raw text", () => {
  const bug = new TypeError("Cannot read properties of undefined (reading 'token')");
  const plain = P.plainLicenseError(bug, { host: "house.example" });
  assert.equal(plain.code, "failed");
  assert.equal(plain.message, "Something went wrong talking to the house server at house.example. Pets still work without it.");
  assert.equal(P.plainLicenseError(new Error("x")).message, "Something went wrong talking to the house server. Pets still work without it.");
});

test("bundle refusals become sentences; caught network text is classified, never shown", () => {
  assert.equal(P.plainBundleError("bundle_sha256_missing").message, P.BUNDLE_WORDS.bundle_sha256_missing);
  assert.equal(P.plainBundleError("bundle_sha256_mismatch").message, P.BUNDLE_DEFAULT);
  assertPlain(P.plainBundleError("fetch failed", { host: "cdn.example" }), "unreachable", /cdn\.example/);
  assertPlain(P.plainBundleError("backend request timed out", { host: "cdn.example" }), "timeout", /cdn\.example/);
  const odd = P.plainBundleError("Unexpected end of JSON input", { host: "cdn.example" });
  assert.equal(odd.message, "The signed bundle was not fetched from the house server at cdn.example.");
});

test("main.cjs sends only the plain sentence to Settings and logs the raw error", () => {
  assert.match(mainSrc, /PlainError\.plainLicenseError\(err, \{ host: licenseHost\(args\[0\]\) \}\)/);
  assert.match(mainSrc, /console\.warn\(`\[license\] \$\{plain\.code\}: \$\{PlainError\.rawLogLine\(err\)\}`\)/);
  assert.match(mainSrc, /return \{ ok: false, unlocked: false, error: plain \}/);
  assert.doesNotMatch(mainSrc, /message: err\.message \|\| String\(err\)/);
  assert.match(mainSrc, /PlainError\.plainBundleError\(result\.error/);
});

test("Settings shows error text only through errorText, which refuses bare strings", () => {
  const assigns = [...settingsSrc.matchAll(/licenseErr\.textContent = ([^;]+);/g)].map((m) => m[1]);
  assert.ok(assigns.length >= 8);
  for (const rhs of assigns) {
    if (/error/.test(rhs)) assert.match(rhs, /^errorText\(/, rhs);
  }
  assert.doesNotMatch(settingsSrc, /\.error\.message :/);
  assert.match(settingsSrc, /typeof error === "object" && typeof error\.message === "string"/);
});