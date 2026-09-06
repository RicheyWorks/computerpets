"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { createLicenseClient } = require("./client.cjs");
const { createContractTestDouble } = require("./contract-test-double.cjs");
const { LicenseError } = require("./errors.cjs");

const SECRET = Buffer.alloc(32, 7).toString("base64");
const SIGNING = "test-bundle-signing-key-not-a-placeholder";

describe("license client (verify + download)", () => {
  it("POSTs the Steam wire shape with hwid, then downloads with Bearer + jti URL", async () => {
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const client = createLicenseClient({ fetchImpl: backend.fetchImpl });

    const verified = await client.verify({
      backendUrl: "http://127.0.0.1:8080",
      provider: "steam",
      fields: {
        steamId: "76561198000000000",
        appId: "123456",
        petType: "red_panda",
        hwid: "device-abc-123",
      },
    });

    assert.equal(verified.status, "success");
    assert.equal(verified.provider, "steam");
    assert.ok(verified.license.ciphertext);
    assert.ok(verified.license.iv);
    assert.ok(verified.auth.token.startsWith("Bearer ") === false);

    const verifyCall = backend.calls[0];
    assert.equal(verifyCall.method, "POST");
    assert.equal(verifyCall.path, "/api/verify/steam");
    assert.deepEqual(verifyCall.body, {
      steamId: "76561198000000000",
      appId: "123456",
      petType: "red_panda",
      hwid: "device-abc-123",
    });

    const manifest = await client.download({
      backendUrl: "http://127.0.0.1:8080",
      petKey: "red_panda",
      ciphertext: verified.license.ciphertext,
      iv: verified.license.iv,
      hwid: "device-abc-123",
      token: verified.auth.token,
      expect: { jti: verified.auth.token.slice("test.".length), petKey: "red_panda", owner: "76561198000000000" },
      signingKey: SIGNING,
    });

    assert.match(manifest.downloadUrl, /[?&]jti=/);
    assert.equal(manifest.jti, verified.auth.token.slice("test.".length));

    const downloadCall = backend.calls[1];
    assert.equal(downloadCall.path, "/api/download/red_panda");
    assert.equal(downloadCall.headers.Authorization, `Bearer ${verified.auth.token}`);
    assert.equal(downloadCall.body.hwid, "device-abc-123");
    assert.equal(downloadCall.body.ciphertext, verified.license.ciphertext);
    assert.equal(downloadCall.body.iv, verified.license.iv);

    const bundle = await client.fetchBundle(manifest.downloadUrl);
    assert.equal(bundle.ok, true);
    assert.ok(bundle.bytes > 0);
  });

  it("fails closed when the backend is missing", async () => {
    const client = createLicenseClient({
      fetchImpl: async () => {
        throw new Error("ECONNREFUSED");
      },
    });
    await assert.rejects(
      () =>
        client.verify({
          backendUrl: "http://127.0.0.1:9",
          provider: "steam",
          fields: { steamId: "1", appId: "2", hwid: "dev" },
        }),
      (err) => err instanceof LicenseError && err.code === "unreachable"
    );
  });

  it("fails closed on an empty backend URL", async () => {
    const client = createLicenseClient({ fetchImpl: async () => new Response() });
    await assert.rejects(
      () => client.verify({ backendUrl: "  ", provider: "steam", fields: { steamId: "1", appId: "2" } }),
      (err) => err instanceof LicenseError && err.code === "missing_backend"
    );
  });

  it("fails closed when Steam denies ownership", async () => {
    const backend = createContractTestDouble({
      licenseSecret: SECRET,
      denySteamIds: ["76561198000000000"],
    });
    const client = createLicenseClient({ fetchImpl: backend.fetchImpl });
    await assert.rejects(
      () =>
        client.verify({
          backendUrl: "http://127.0.0.1:8080",
          provider: "steam",
          fields: { steamId: "76561198000000000", appId: "123456", hwid: "dev" },
        }),
      (err) => err instanceof LicenseError && err.code === "denied"
    );
  });

  it("fails closed on a revoked jti at download", async () => {
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const client = createLicenseClient({ fetchImpl: backend.fetchImpl });
    const verified = await client.verify({
      backendUrl: "http://127.0.0.1:8080",
      provider: "steam",
      fields: { steamId: "1", appId: "2", petType: "red_panda", hwid: "dev" },
    });
    const jti = verified.auth.token.slice("test.".length);
    backend.revoked.add(jti);

    await assert.rejects(
      () =>
        client.download({
          backendUrl: "http://127.0.0.1:8080",
          petKey: "red_panda",
          ciphertext: verified.license.ciphertext,
          iv: verified.license.iv,
          hwid: "dev",
          token: verified.auth.token,
          expect: { jti },
        }),
      (err) => err instanceof LicenseError && err.code === "revoked"
    );
  });

  it("fails closed when download hwid does not match the bound license", async () => {
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const client = createLicenseClient({ fetchImpl: backend.fetchImpl });
    const verified = await client.verify({
      backendUrl: "http://127.0.0.1:8080",
      provider: "steam",
      fields: { steamId: "1", appId: "2", petType: "red_panda", hwid: "device-abc-123" },
    });

    await assert.rejects(
      () =>
        client.download({
          backendUrl: "http://127.0.0.1:8080",
          petKey: "red_panda",
          ciphertext: verified.license.ciphertext,
          iv: verified.license.iv,
          hwid: "other-device",
          token: verified.auth.token,
        }),
      (err) => err instanceof LicenseError && err.code === "hwid_mismatch"
    );
  });
});
