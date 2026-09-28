const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const P = require("./plain-error.cjs");
const { LicenseError } = require("./errors.cjs");
const { createLicenseClient } = require("./client.cjs");
const { NO_LICENSE_MESSAGE, NO_TOKEN_MESSAGE, FIELDS_MISSING_MESSAGE } = require("./session.cjs");

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
    assertPlain(P.plainLicenseError(err, { host: "nope.example" }), "not_found", /^Couldn't find the house server at nope\.example\. Check the house server address\. Pets still work without it\.$/);
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

test("house codes written for people keep their sentences", () => {
  assert.deepEqual(P.plainLicenseError(new LicenseError("no_license", NO_LICENSE_MESSAGE)), { code: "no_license", message: NO_LICENSE_MESSAGE });
  assert.deepEqual(P.plainLicenseError(new LicenseError("no_token", NO_TOKEN_MESSAGE)), { code: "no_token", message: NO_TOKEN_MESSAGE });
  assert.deepEqual(P.plainLicenseError(new LicenseError("fields_missing", FIELDS_MISSING_MESSAGE)), { code: "fields_missing", message: FIELDS_MISSING_MESSAGE });
  const unnamed = new LicenseError("cdn_net_unnamed", "Your pet's files were not downloaded from cdn.example. This page has to name the download website first.");
  assert.equal(P.plainLicenseError(unnamed).message, unnamed.message);
});

test("house codes that carry developer or server text get one plain sentence each", () => {
  const DEV = /license expired|hardware binding|hwid does|hwid too|ownership not verified|LICENSE_SECRET_KEY|ciphertext|issuance|base64|GCM|MAC|provider key|NullPointer|java\./;
  const cases = [
    ["expired", "license expired", /^This license has expired\. Unlock again to get a new one\. Pets still work without it\.$/],
    ["hwid_mismatch", "hardware binding mismatch", /^This license belongs to a different computer, so it does not work here\. Unlock again on this computer\./],
    ["hwid_mismatch", "issued license hwid does not match this device", /^This license belongs to a different computer/],
    ["denied", "ownership not verified", /^The house server at house\.example did not confirm that you own the game\. Check the Steam ID and the App ID/],
    ["revoked", "license missing, expired, or tampered", /^The house server at house\.example no longer accepts this license\./],
    ["decrypt_failed", "license ciphertext failed authentication", /^The license on this computer could not be opened/],
    ["missing_secret", "LICENSE_SECRET_KEY is missing; cannot decrypt the issued license", /^This copy of the app has no license key set up/],
    ["missing_backend", "backend base URL is not a URL", /^The house server address needs to be a web address, like http:\/\/127\.0\.0\.1:8081/],
    ["bad_response", "verify response is not a license issuance", /^The house server at house\.example sent an answer this app does not understand\./],
    ["download_failed", "java.lang.NullPointerException", /^The house server at house\.example did not hand over the download\./],
    ["unknown_provider", "provider key is invalid", /^The house server at house\.example does not know this store\./],
    ["signed_url_invalid", "signed URL MAC mismatch", /^The download link did not check out/],
    ["hwid_too_long", "hwid too long", /^This computer's license mark is too long\./],
    ["bundle_zip_invalid", "manifest.json missing at zip root", new RegExp(`^${P.BUNDLE_DEFAULT.replace(/[.()]/g, "\\$&")}$`)],
  ];
  for (const [code, raw, want] of cases) {
    const plain = P.plainLicenseError(new LicenseError(code, raw), { host: "house.example" });
    assert.equal(plain.code, code);
    assert.match(plain.message, want, `${code}: ${plain.message}`);
    assert.doesNotMatch(plain.message, DEV, `${code} leaked: ${plain.message}`);
    assert.doesNotMatch(plain.message, RAW, plain.message);
  }
  // Every house code either passes a people-written sentence or has its own sentence.
  for (const code of P.HOUSE_CODES) assert.ok(P.PASSTHROUGH_CODES.has(code) || P.houseSentence(code, "") !== "", code);
});

test("a server's own 403 words never reach the window", async () => {
  const client = createLicenseClient({ fetchImpl: async () => ({ ok: false, status: 403, text: async () => JSON.stringify({ error: "Steam API key rejected (403) by com.house.SteamVerifier" }) }) });
  const err = await client.verify({ backendUrl: "https://house.example", provider: "steam", fields: { steamId: "1", appId: "2" }, licenseSecret: Buffer.alloc(32, 1).toString("base64") }).then(() => null, (e) => e);
  assert.equal(err.code, "denied");
  const plain = P.plainLicenseError(err);
  assert.doesNotMatch(plain.message, /Steam API key|com\.house/);
  assert.match(plain.message, /did not confirm that you own the game/);
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
  assert.equal(odd.message, "Your pet's files were not downloaded from the house server at cdn.example.");
});

test("main.cjs sends only the plain sentence to Settings and logs the raw error", () => {
  assert.match(mainSrc, /PlainError\.plainLicenseError\(err, \{ host: licenseHost\(args\[0\]\) \}\)/);
  assert.match(mainSrc, /console\.warn\(`\[license\] \$\{plain\.code\}: \$\{PlainError\.rawLogLine\(err\)\}`\)/);
  assert.match(mainSrc, /return \{ ok: false, unlocked: false, error: plain \}/);
  assert.doesNotMatch(mainSrc, /message: err\.message \|\| String\(err\)/);
  assert.match(mainSrc, /PlainError\.plainBundleError\(result\.error/);
  // license-status's stored-license refusal goes through the same plain words.
  assert.match(mainSrc, /typeof result\.error\.code === "string"[\s\S]{0,300}PlainError\.plainLicenseError\(result\.error/);
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