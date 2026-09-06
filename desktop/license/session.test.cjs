"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const os = require("os");
const path = require("path");
const fs = require("fs");
const { createLicenseSession } = require("./session.cjs");
const { createContractTestDouble } = require("./contract-test-double.cjs");
const { LicenseError } = require("./errors.cjs");

const SECRET = Buffer.alloc(32, 7).toString("base64");
const SIGNING = "test-bundle-signing-key-not-a-placeholder";

function memoryFs() {
  const files = new Map();
  return {
    readFile: (p) => {
      if (!files.has(String(p))) {
        const err = new Error("ENOENT");
        err.code = "ENOENT";
        throw err;
      }
      return files.get(String(p));
    },
    writeFile: (p, data) => {
      files.set(String(p), String(data));
    },
    mkdir: () => {},
    files,
  };
}

function sessionFor(backend, extraEnv = {}, hwid = "device-abc-123") {
  const disk = memoryFs();
  return createLicenseSession({
    userDataDir: path.join(os.tmpdir(), "cp-license-session"),
    env: { LICENSE_SECRET_KEY: SECRET, BUNDLE_SIGNING_KEY: SIGNING, COMPUTERPETS_BACKEND_URL: "http://127.0.0.1:8080", ...extraEnv },
    fetchImpl: backend.fetchImpl,
    hwid,
    readFile: disk.readFile,
    writeFile: disk.writeFile,
    mkdir: disk.mkdir,
  });
}

describe("license session", () => {
  it("unlocks against a mocked backend using the published contract", async () => {
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const session = sessionFor(backend);

    const result = await session.unlock({
      steamId: "76561198000000000",
      appId: "123456",
      petType: "red_panda",
      provider: "steam",
    });

    assert.equal(result.unlocked, true);
    assert.equal(result.license.pet, "red_panda");
    assert.equal(result.license.owner, "76561198000000000");
    assert.equal(result.license.hwid, "device-abc-123");
    assert.ok(result.license.jti);
    assert.equal(result.download.jti, result.license.jti);
    assert.match(result.download.downloadUrl, /jti=/);
    assert.equal(result.download.bundle.ok, true);

    const verify = backend.calls.find((c) => c.path === "/api/verify/steam");
    assert.equal(verify.body.hwid, "device-abc-123");
    const download = backend.calls.find((c) => c.path === "/api/download/red_panda");
    assert.equal(download.body.hwid, "device-abc-123");
    assert.ok(String(download.headers.Authorization).startsWith("Bearer "));
  });

  it("fails closed without LICENSE_SECRET_KEY — no always-licensed stub", async () => {
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const session = sessionFor(backend, { LICENSE_SECRET_KEY: "", COMPUTERPETS_LICENSE_SECRET_KEY: "" });
    await assert.rejects(
      () => session.unlock({ steamId: "1", appId: "2" }),
      (err) => err instanceof LicenseError && err.code === "missing_secret"
    );
    assert.equal(session.status().unlocked, false);
  });

  it("fails closed when the backend URL is missing", async () => {
    const disk = memoryFs();
    const session = createLicenseSession({
      userDataDir: path.join(os.tmpdir(), "cp-license-session"),
      env: { LICENSE_SECRET_KEY: SECRET, COMPUTERPETS_BACKEND_URL: "", ENTERPRISEPET_BACKEND_URL: "" },
      fetchImpl: async () => new Response(),
      hwid: "device-abc-123",
      readFile: disk.readFile,
      writeFile: disk.writeFile,
      mkdir: disk.mkdir,
    });
    await assert.rejects(
      () => session.unlock({ steamId: "1", appId: "2", backendUrl: "not-a-url" }),
      (err) => err instanceof LicenseError && err.code === "missing_backend"
    );
  });

  it("does not treat a persisted file as licensed if decrypt fails", () => {
    const disk = memoryFs();
    const store = path.join(os.tmpdir(), "cp-license-session", "license.json");
    disk.writeFile(
      store,
      JSON.stringify({
        license: { ciphertext: "dGFtcGVyZWQ=", iv: Buffer.alloc(12).toString("base64") },
        auth: { token: "nope" },
      })
    );
    const session = createLicenseSession({
      userDataDir: path.join(os.tmpdir(), "cp-license-session"),
      env: { LICENSE_SECRET_KEY: SECRET },
      fetchImpl: async () => new Response(),
      hwid: "device-abc-123",
      readFile: disk.readFile,
      writeFile: disk.writeFile,
      mkdir: disk.mkdir,
    });
    const status = session.status();
    assert.equal(status.unlocked, false);
    assert.equal(status.error.code, "decrypt_failed");
  });
});
