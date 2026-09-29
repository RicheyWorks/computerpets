"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const os = require("os");
const path = require("path");
const fs = require("fs");
const { createLicenseSession, NO_LICENSE_MESSAGE, NO_TOKEN_MESSAGE, FIELDS_MISSING_MESSAGE, NO_APP_ID_MESSAGE, configuredSteamAppId } = require("./session.cjs");
const { createContractTestDouble, encryptLicense } = require("./contract-test-double.cjs");
const { LicenseError } = require("./errors.cjs");
const { bundleHonesty, downloadTalkHonesty, licenseHonesty } = require("./license-net.cjs");

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

// Sessions that may read an OS mark are pinned to the Linux path with a fake readFile,
// so they mean the same on every machine and never query this computer's registry or ioreg.
// The Windows MachineGuid path is covered in hwid.test.cjs with a fake exec.
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
      cdnLine: bundleHonesty("https://cdn.enterprisepet.example/bundles/red_panda.zip"),
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
    const gets = backend.calls.filter((call) => call.method === "GET");
    assert.equal(gets.length, 1);
    assert.equal(new URLSearchParams(gets[0].query).has("hwid"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(gets[0].body, "hwid"), false);
  });

  it("never writes the download sign-in in plain text: sealed with a secret store, memory-only without", async () => {
    // A reversible stand-in for the OS secret store that never echoes the token.
    const codec = {
      encrypt: (text) => Buffer.from(String(text), "utf8").map((b) => b ^ 0x5a).toString("base64"),
      decrypt: (sealed) => Buffer.from(Buffer.from(String(sealed), "base64").map((b) => b ^ 0x5a)).toString("utf8"),
    };
    const storeOf = (disk) => [...disk.files.entries()].find(([p]) => p.endsWith("license.json"))[1];
    for (const withStore of [true, false]) {
      const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
      const disk = memoryFs();
      const make = () =>
        createLicenseSession({
          userDataDir: path.join(os.tmpdir(), "cp-license-token"),
          env: { LICENSE_SECRET_KEY: SECRET, BUNDLE_SIGNING_KEY: SIGNING, COMPUTERPETS_BACKEND_URL: "http://127.0.0.1:8080" },
          fetchImpl: backend.fetchImpl,
          hwid: "device-abc-123",
          readFile: disk.readFile,
          writeFile: disk.writeFile,
          mkdir: disk.mkdir,
          codec: withStore ? () => codec : () => null,
        });
      const result = await make().unlock({ steamId: "76561198000000000", appId: "123456" });
      assert.equal(result.unlocked, true);
      const download = backend.calls.find((c) => c.path === "/api/download/red_panda");
      const token = String(download.headers.Authorization).slice("Bearer ".length);
      assert.match(token, /^test\./, "Unlock's own download still carried the sign-in");
      const raw = storeOf(disk);
      assert.equal(raw.includes(token), false, `license.json holds the plain token (store=${withStore})`);
      assert.equal(raw.includes(SECRET), false);
      const saved = JSON.parse(raw);
      assert.equal(Object.prototype.hasOwnProperty.call(saved.auth, "token"), false);
      if (withStore) assert.equal(codec.decrypt(saved.auth.sealedToken), token);
      else assert.equal(saved.auth.sealedToken, undefined);
      if (!withStore) {
        // A later run has no token to send: it says so plainly and posts nothing.
        const before = backend.calls.length;
        await assert.rejects(
          () => make().download({}),
          (err) => err instanceof LicenseError && err.code === "no_token" && err.message === NO_TOKEN_MESSAGE
        );
        assert.equal(backend.calls.length, before);
      }
    }
  });

  it("uses an older license.json's plain token once, then keeps only the seal", async () => {
    const codec = {
      encrypt: (text) => "sealed:" + Buffer.from(String(text)).reverse().toString("base64"),
      decrypt: (sealed) => Buffer.from(String(sealed).slice(7), "base64").reverse().toString("utf8"),
    };
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const issued = await (
      await backend.fetchImpl("http://127.0.0.1:8080/api/verify/steam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steamId: "76561198000000000", appId: "123456", petType: "red_panda", hwid: "device-abc-123" }),
      })
    ).json();
    const disk = memoryFs();
    const dir = path.join(os.tmpdir(), "cp-license-legacy");
    disk.writeFile(
      path.join(dir, "license.json"),
      JSON.stringify({ backendUrl: "http://127.0.0.1:8080", provider: "steam", license: issued.license, auth: issued.auth })
    );
    const session = createLicenseSession({
      userDataDir: dir,
      env: { LICENSE_SECRET_KEY: SECRET, BUNDLE_SIGNING_KEY: SIGNING },
      fetchImpl: backend.fetchImpl,
      hwid: "device-abc-123",
      readFile: disk.readFile,
      writeFile: disk.writeFile,
      mkdir: disk.mkdir,
      codec,
    });
    const last = await session.download({});
    assert.match(last.downloadUrl, /jti=/);
    const sent = backend.calls.find((c) => c.path === "/api/download/red_panda");
    assert.equal(sent.headers.Authorization, `Bearer ${issued.auth.token}`);
    const raw = disk.files.get(path.join(dir, "license.json"));
    assert.equal(raw.includes(issued.auth.token), false);
    assert.equal(codec.decrypt(JSON.parse(raw).auth.sealedToken), issued.auth.token);
  });

  it("asks for the Steam ID and App ID in plain words before anything leaves", async () => {
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const session = sessionFor(backend);
    await assert.rejects(
      () => session.unlock({ steamId: "", appId: "123456" }),
      (err) => err instanceof LicenseError && err.code === "fields_missing" && err.message === FIELDS_MISSING_MESSAGE
    );
    // No App ID typed and none set up for this copy (the House window hides the box then): said plainly.
    await assert.rejects(
      () => session.unlock({ steamId: "76561198000000000", appId: "  " }),
      (err) => err instanceof LicenseError && err.code === "fields_missing" && err.message === NO_APP_ID_MESSAGE
    );
    assert.equal(backend.calls.length, 0);
    assert.equal(session.status().steamAppId, "");
  });

  it("a Steam App ID set up for this copy (COMPUTERPETS_STEAM_APP_ID) is in status and stands in for an empty box", async () => {
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const session = sessionFor(backend, { COMPUTERPETS_STEAM_APP_ID: " 480 " });
    assert.equal(session.status().steamAppId, "480");
    const result = await session.unlock({ steamId: "76561198000000000", appId: "", petType: "red_panda", provider: "steam" });
    assert.equal(result.unlocked, true);
    const verify = backend.calls.find((c) => c.path === "/api/verify/steam");
    assert.equal(verify.body.appId, "480");
  });

  it("configuredSteamAppId: the env first, then a steam_appid.txt beside the program, digits only", () => {
    const files = new Map([[path.join("/steam/build", "steam_appid.txt"), "123456\n"], [path.join("/odd", "steam_appid.txt"), "not a number"]]);
    const read = (file) => {
      if (!files.has(file)) throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      return files.get(file);
    };
    assert.equal(configuredSteamAppId({}, ["/nowhere", "/steam/build"], read), "123456");
    assert.equal(configuredSteamAppId({ COMPUTERPETS_STEAM_APP_ID: "7" }, ["/steam/build"], read), "7");
    assert.equal(configuredSteamAppId({ COMPUTERPETS_STEAM_APP_ID: "abc" }, ["/odd"], read), "");
    assert.equal(configuredSteamAppId({}, [], read), "");
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

  it("does not read the OS machine id for status, and sends only the hash on unlock", async () => {
    const reads = [];
    const files = new Map();
    const readFile = (p) => {
      const key = String(p);
      reads.push(key);
      if (key.endsWith("machine-id")) return "machine-aaa\n";
      if (!files.has(key)) {
        const err = new Error("ENOENT");
        err.code = "ENOENT";
        throw err;
      }
      return files.get(key);
    };
    const writeFile = (p, data) => {
      files.set(String(p), String(data));
    };
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const session = createLicenseSession({
      userDataDir: path.join(os.tmpdir(), "cp-license-mark"),
      platform: "linux",
      env: { LICENSE_SECRET_KEY: SECRET, BUNDLE_SIGNING_KEY: SIGNING, COMPUTERPETS_BACKEND_URL: "http://127.0.0.1:8080" },
      fetchImpl: backend.fetchImpl,
      readFile,
      writeFile,
      mkdir: () => {},
    });

    const before = session.status();
    assert.equal(before.hwid, "");
    assert.equal(before.hwidMark.read, "unread");
    assert.equal(before.hwidMark.rawLeavesMachine, false);
    assert.equal(reads.some((item) => item.includes("machine-id")), false);

    await session.unlock({
      steamId: "76561198000000000",
      appId: "123456",
      petType: "red_panda",
      provider: "steam",
    });
    const verify = backend.calls.find((call) => call.path === "/api/verify/steam");
    assert.equal(verify.body.hwid, "eaa1f7bdd907e76c52b378ce67b87a05bb287933089e7adc50ca18399cbb53a4");
    assert.equal(String(verify.body.hwid).includes("machine-aaa"), false);
    assert.equal(session.status().hwidMark.read, "stored");
    const machineReads = reads.filter((item) => item.includes("machine-id")).length;
    session.status();
    assert.equal(reads.filter((item) => item.includes("machine-id")).length, machineReads);
  });

  it("does not read a machine id when the license is unbound", async () => {
    const now = Date.now();
    const enc = encryptLicense(
      {
        jti: "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
        owner: "76561198000000000",
        pet: "red_panda",
        validUntil: new Date(now + 86400_000).toISOString(),
        issuedAt: new Date(now).toISOString(),
        hwid: null,
      },
      SECRET
    );
    const reads = [];
    const files = new Map();
    const dir = path.join(os.tmpdir(), "cp-license-unbound");
    const store = path.join(dir, "license.json");
    files.set(
      store,
      JSON.stringify({
        backendUrl: "http://127.0.0.1:8080",
        license: { ciphertext: enc.ciphertext, iv: enc.iv },
        auth: { token: "token" },
      })
    );
    const posts = [];
    const session = createLicenseSession({
      userDataDir: dir,
      platform: "linux",
      env: { LICENSE_SECRET_KEY: SECRET, COMPUTERPETS_BACKEND_URL: "http://127.0.0.1:8080" },
      readFile: (p) => {
        const key = String(p);
        reads.push(key);
        if (key.includes("machine-id") || key.includes("MachineGuid")) throw new Error("os read");
        if (!files.has(key)) {
          const err = new Error("ENOENT");
          err.code = "ENOENT";
          throw err;
        }
        return files.get(key);
      },
      writeFile: (p, data) => {
        files.set(String(p), String(data));
      },
      mkdir: () => {},
      fetchImpl: async (url, init) => {
        if (init && String(init.method || "GET").toUpperCase() === "POST") {
          posts.push(JSON.parse(init.body));
          return new Response(
            JSON.stringify({
              petKey: "red_panda",
              downloadUrl:
                "https://cdn.enterprisepet.example/bundles/red_panda.zip?owner=76561198000000000&jti=3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80&exp=1893456000&sig=abc",
              expiresAt: "2030-01-01T00:00:00Z",
              ttlSeconds: 900,
              jti: "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
            }),
            { status: 200, headers: { "content-type": "application/json" } }
          );
        }
        return new Response("zip", { status: 200 });
      },
    });
    const downloaded = await session.download();
    assert.equal(downloaded.jti, "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80");
    assert.equal(posts.length, 1);
    assert.equal(Object.prototype.hasOwnProperty.call(posts[0], "hwid"), false);
    assert.equal(reads.some((item) => item.includes("machine-id")), false);
  });

  it("does not mint a computer-name mark or call verify until the keeper says yes", async () => {
    const reads = [];
    const files = new Map();
    const dir = path.join(os.tmpdir(), "cp-license-weak");
    const readFile = (p) => {
      const key = String(p);
      reads.push(key);
      if (!files.has(key)) {
        const err = new Error("ENOENT");
        err.code = "ENOENT";
        throw err;
      }
      return files.get(key);
    };
    const writeFile = (p, data) => {
      files.set(String(p), String(data));
    };
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const session = createLicenseSession({
      userDataDir: dir,
      platform: "linux",
      env: { LICENSE_SECRET_KEY: SECRET, BUNDLE_SIGNING_KEY: SIGNING, COMPUTERPETS_BACKEND_URL: "http://127.0.0.1:8080" },
      fetchImpl: backend.fetchImpl,
      readFile,
      writeFile,
      mkdir: () => {},
    });
    await assert.rejects(
      () =>
        session.unlock({
          steamId: "76561198000000000",
          appId: "123456",
          petType: "red_panda",
          provider: "steam",
        }),
      (err) => err instanceof LicenseError && err.code === "hwid_needs_fallback_yes" && /computer name/.test(err.message) && /random ID/.test(err.message)
    );
    assert.equal(backend.calls.length, 0);
    assert.equal([...files.keys()].some((key) => key.endsWith("hwid.txt")), false);

    const result = await session.unlock({
      steamId: "76561198000000000",
      appId: "123456",
      petType: "red_panda",
      provider: "steam",
      allowWeakFallback: true,
    });
    const verify = backend.calls.find((call) => call.path === "/api/verify/steam");
    assert.match(verify.body.hwid, /^[0-9a-f]{64}$/);
    assert.equal(result.license.hwid, verify.body.hwid);
    assert.equal([...files.keys()].some((key) => key.endsWith("hwid.txt")), true);
    const callsAfterYes = backend.calls.length;
    await session.unlock({
      steamId: "76561198000000000",
      appId: "123456",
      petType: "red_panda",
      provider: "steam",
    });
    assert.equal(backend.calls.length > callsAfterYes, true);
    assert.equal(backend.calls.at(-2).body.hwid, verify.body.hwid);
  });

  it("does not mint a mark for a bound download until the keeper says yes", async () => {
    const now = Date.now();
    const enc = encryptLicense(
      {
        jti: "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
        owner: "76561198000000000",
        pet: "red_panda",
        validUntil: new Date(now + 86400_000).toISOString(),
        issuedAt: new Date(now).toISOString(),
        hwid: "already-bound",
      },
      SECRET
    );
    const files = new Map();
    const dir = path.join(os.tmpdir(), "cp-license-bound-weak");
    files.set(
      path.join(dir, "license.json"),
      JSON.stringify({
        backendUrl: "http://127.0.0.1:8080",
        license: { ciphertext: enc.ciphertext, iv: enc.iv },
        auth: { token: "token" },
      })
    );
    const posts = [];
    const session = createLicenseSession({
      userDataDir: dir,
      platform: "linux",
      env: { LICENSE_SECRET_KEY: SECRET, COMPUTERPETS_BACKEND_URL: "http://127.0.0.1:8080" },
      readFile: (p) => {
        const key = String(p);
        if (!files.has(key)) {
          const err = new Error("ENOENT");
          err.code = "ENOENT";
          throw err;
        }
        return files.get(key);
      },
      writeFile: (p, data) => {
        files.set(String(p), String(data));
      },
      mkdir: () => {},
      fetchImpl: async (_url, init) => {
        if (init && String(init.method || "GET").toUpperCase() === "POST") posts.push(JSON.parse(init.body));
        return new Response("no", { status: 500 });
      },
    });
    await assert.rejects(
      () => session.download(),
      (err) => err instanceof LicenseError && err.code === "hwid_needs_fallback_yes"
    );
    assert.equal(posts.length, 0);
    assert.equal([...files.keys()].some((key) => key.endsWith("hwid.txt")), false);
  });

  it("does not post a license hash to a remote host until that host is named", async () => {
    const reads = [];
    const files = new Map();
    const dir = path.join(os.tmpdir(), "cp-license-remote-hash");
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const seen = [];
    const session = createLicenseSession({
      userDataDir: dir,
      platform: "linux",
      env: {
        LICENSE_SECRET_KEY: SECRET,
        BUNDLE_SIGNING_KEY: SIGNING,
        COMPUTERPETS_BACKEND_URL: "https://user:secret@license.example.test",
      },
      fetchImpl: async (url, init) => {
        seen.push(String(url));
        return backend.fetchImpl(url, init);
      },
      readFile: (p) => {
        const key = String(p);
        reads.push(key);
        if (key.includes("machine-id")) return "machine-aaa\n";
        if (!files.has(key)) {
          const err = new Error("ENOENT");
          err.code = "ENOENT";
          throw err;
        }
        return files.get(key);
      },
      writeFile: (p, data) => {
        files.set(String(p), String(data));
      },
      mkdir: () => {},
    });

    await session.status();
    assert.equal(seen.length, 0);
    assert.equal(reads.some((item) => item.includes("machine-id")), false);

    const remote = "https://user:secret@license.example.test/api?hwid=raw-id#frag";
    const line = licenseHonesty(remote);
    assert.match(line, /license\.example\.test/);
    assert.equal(line.includes("secret"), false);
    assert.equal(line.includes("raw-id"), false);
    assert.equal(line.includes("/api"), false);
    assert.equal(line.includes("#frag"), false);
    assert.equal(line.includes("frag"), false);

    await assert.rejects(
      () => session.unlock({ steamId: "76561198000000000", appId: "123456", petType: "red_panda", provider: "steam" }),
      (err) => err instanceof LicenseError && err.code === "license_net_unnamed" && /license\.example\.test/.test(err.message)
    );
    assert.equal(seen.length, 0);
    assert.equal(reads.some((item) => item.includes("machine-id")), false);
    assert.equal([...files.keys()].some((key) => key.endsWith("hwid.txt")), false);

    const other = licenseHonesty("https://other.example.test");
    await assert.rejects(
      () =>
        session.unlock({
          steamId: "76561198000000000",
          appId: "123456",
          petType: "red_panda",
          provider: "steam",
          licenseLine: other,
        }),
      (err) => err instanceof LicenseError && err.code === "license_net_unnamed"
    );
    assert.equal(seen.length, 0);

    await session.unlock({
      steamId: "76561198000000000",
      appId: "123456",
      petType: "red_panda",
      provider: "steam",
      licenseLine: line,
      hwid: undefined,
    });
    assert.equal(seen.length > 0, true);
    assert.equal(new URL(seen[0]).hostname, "license.example.test");
    const verify = backend.calls.find((call) => call.path === "/api/verify/steam");
    assert.match(verify.body.hwid, /^[0-9a-f]{64}$/);
    assert.equal(String(verify.body.hwid).includes("machine-aaa"), false);
    assert.equal(line.includes(verify.body.hwid), false);
    const download = backend.calls.find((call) => call.path === "/api/download/red_panda");
    assert.equal(download.body.hwid, verify.body.hwid);
    assert.equal(seen.some((url) => new URL(url).hostname === "cdn.enterprisepet.example"), false);
  });

  it("keeps a loopback unlock on this computer without the outbound line", async () => {
    for (const backendUrl of ["http://127.0.0.1:8080", "http://localhost:8080", "http://[::1]:8080"]) {
      const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
      const session = createLicenseSession({
        userDataDir: path.join(os.tmpdir(), "cp-license-loop"),
        env: { LICENSE_SECRET_KEY: SECRET, BUNDLE_SIGNING_KEY: SIGNING, COMPUTERPETS_BACKEND_URL: backendUrl },
        fetchImpl: backend.fetchImpl,
        hwid: "device-abc-123",
        ...memoryFs(),
      });
      const result = await session.unlock({
        steamId: "76561198000000000",
        appId: "123456",
        petType: "red_panda",
        provider: "steam",
        backendUrl,
      });
      assert.equal(result.unlocked, true);
      assert.equal(licenseHonesty(backendUrl), "");
      assert.equal(backend.calls[0].body.hwid, "device-abc-123");
    }
  });

  it("names the host before a bound download sends the hash", async () => {
    const now = Date.now();
    const dir = path.join(os.tmpdir(), "cp-license-bound-remote");
    const enc = encryptLicense(
      {
        jti: "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
        owner: "76561198000000000",
        pet: "red_panda",
        validUntil: new Date(now + 86400_000).toISOString(),
        issuedAt: new Date(now).toISOString(),
        hwid: "already-bound",
      },
      SECRET
    );
    const files = new Map();
    files.set(
      path.join(dir, "license.json"),
      JSON.stringify({
        backendUrl: "https://license.example.test",
        license: { ciphertext: enc.ciphertext, iv: enc.iv },
        auth: { token: "token" },
      })
    );
    files.set(path.join(dir, "hwid.txt"), "already-bound");
    const posts = [];
    const session = createLicenseSession({
      userDataDir: dir,
      platform: "linux",
      env: { LICENSE_SECRET_KEY: SECRET, COMPUTERPETS_BACKEND_URL: "https://license.example.test" },
      readFile: (p) => {
        const key = String(p);
        if (key.includes("machine-id")) throw new Error("os read");
        if (!files.has(key)) {
          const err = new Error("ENOENT");
          err.code = "ENOENT";
          throw err;
        }
        return files.get(key);
      },
      writeFile: (p, data) => {
        files.set(String(p), String(data));
      },
      mkdir: () => {},
      fetchImpl: async (_url, init) => {
        if (init && String(init.method || "GET").toUpperCase() === "POST") posts.push(JSON.parse(init.body));
        return new Response("no", { status: 500 });
      },
    });
    await assert.rejects(
      () => session.download(),
      (err) => err instanceof LicenseError && err.code === "license_net_unnamed"
    );
    assert.equal(posts.length, 0);

    await assert.rejects(
      () => session.download({ licenseLine: licenseHonesty("https://license.example.test") }),
      (err) => err instanceof LicenseError && err.code === "download_failed"
    );
    assert.equal(posts.length, 1);
    assert.equal(posts[0].hwid, "already-bound");
    assert.equal(Object.prototype.hasOwnProperty.call(posts[0], "machine-id"), false);
  });

  it("does not POST an unbound download to a remote host until that host is named", async () => {
    const now = Date.now();
    const enc = encryptLicense(
      {
        jti: "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
        owner: "76561198000000000",
        pet: "red_panda",
        validUntil: new Date(now + 86400_000).toISOString(),
        issuedAt: new Date(now).toISOString(),
        hwid: null,
      },
      SECRET
    );
    const files = new Map();
    const dir = path.join(os.tmpdir(), "cp-license-unbound-remote");
    files.set(
      path.join(dir, "license.json"),
      JSON.stringify({
        backendUrl: "https://user:secret@license.example.test/api/download/red_panda?hwid=raw-id#frag",
        license: { ciphertext: enc.ciphertext, iv: enc.iv },
        auth: { token: "token" },
      })
    );
    const posts = [];
    const seen = [];
    const session = createLicenseSession({
      userDataDir: dir,
      platform: "linux",
      env: { LICENSE_SECRET_KEY: SECRET, COMPUTERPETS_BACKEND_URL: "https://license.example.test" },
      readFile: (p) => {
        const key = String(p);
        if (key.includes("machine-id") || key.includes("MachineGuid")) throw new Error("os read");
        if (!files.has(key)) {
          const err = new Error("ENOENT");
          err.code = "ENOENT";
          throw err;
        }
        return files.get(key);
      },
      writeFile: (p, data) => {
        files.set(String(p), String(data));
      },
      mkdir: () => {},
      fetchImpl: async (url, init) => {
        seen.push(String(url));
        if (init && String(init.method || "GET").toUpperCase() === "POST") posts.push(JSON.parse(init.body));
        return new Response("no", { status: 500 });
      },
    });
    await session.status();
    assert.equal(seen.length, 0);

    const remote = "https://user:secret@license.example.test:8443/api/download/red_panda?hwid=raw-id#frag";
    const line = downloadTalkHonesty(remote);
    assert.equal(line.includes("sends the license hash"), false);
    assert.equal(line.includes("secret"), false);
    assert.equal(line.includes("/api"), false);
    assert.equal(line.includes("frag"), false);
    assert.match(line, /This asks license\.example\.test, the license website, for your pet\./);

    await assert.rejects(
      () => session.download(),
      (err) =>
        err instanceof LicenseError &&
        err.code === "download_net_unnamed" &&
        /license\.example\.test/.test(err.message) &&
        !err.message.includes("secret") &&
        !err.message.includes("/api") &&
        !err.message.includes("sig=")
    );
    assert.equal(posts.length, 0);
    assert.equal(seen.length, 0);

    await assert.rejects(
      () => session.download({ licenseLine: licenseHonesty(remote) }),
      (err) => err instanceof LicenseError && err.code === "download_net_unnamed"
    );
    assert.equal(posts.length, 0);

    await assert.rejects(
      () => session.download({ licenseLine: line }),
      (err) => err instanceof LicenseError && err.code === "download_failed"
    );
    assert.equal(posts.length, 1);
    assert.equal(Object.prototype.hasOwnProperty.call(posts[0], "hwid"), false);
    assert.equal(typeof posts[0].ciphertext, "string");
    assert.equal(typeof posts[0].iv, "string");
    assert.equal(new URL(seen[0]).hostname, "license.example.test");
    assert.equal(seen[0].includes("secret"), true);
  });

  it("does not GET a remote signed bundle until the CDN host is named", async () => {
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const session = sessionFor(backend);
    await session.status();
    assert.equal(backend.calls.length, 0);

    const held = await session.unlock({
      steamId: "76561198000000000",
      appId: "123456",
      petType: "red_panda",
      provider: "steam",
    });
    assert.equal(held.download.bundle.held, true);
    assert.equal(held.download.bundle.ok, false);
    assert.equal(backend.calls.some((call) => call.method === "GET"), false);
    assert.equal(held.download.downloadUrl.includes("hwid="), false);
    await session.status();
    assert.equal(backend.calls.some((call) => call.method === "GET"), false);

    await assert.rejects(
      () => session.fetchSigned({}),
      (err) =>
        err instanceof LicenseError &&
        err.code === "cdn_net_unnamed" &&
        /cdn\.enterprisepet\.example/.test(err.message) &&
        !err.message.includes("/bundles") &&
        !err.message.includes("sig=")
    );
    assert.equal(backend.calls.some((call) => call.method === "GET"), false);

    await assert.rejects(
      () => session.fetchSigned({ cdnLine: bundleHonesty("https://other.example.test/pet.zip") }),
      (err) => err instanceof LicenseError && err.code === "cdn_net_unnamed"
    );
    assert.equal(backend.calls.some((call) => call.method === "GET"), false);

    const line = bundleHonesty(held.download.downloadUrl);
    assert.equal(line.includes("secret"), false);
    assert.equal(line.includes("/bundles"), false);
    assert.equal(line.includes("hwid"), false);
    const fetched = await session.fetchSigned({ cdnLine: line });
    assert.equal(fetched.bundle.ok, true);
    assert.equal(fetched.bundle.held, false);
    const gets = backend.calls.filter((call) => call.method === "GET");
    assert.equal(gets.length, 1);
    assert.equal(new URLSearchParams(gets[0].query).has("hwid"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(gets[0].body, "hwid"), false);
  });

  it("fetches a loopback bundle without the outbound line and does not send the hash", async () => {
    const now = Date.now();
    const jti = "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80";
    const enc = encryptLicense(
      {
        jti,
        owner: "76561198000000000",
        pet: "red_panda",
        validUntil: new Date(now + 86400_000).toISOString(),
        issuedAt: new Date(now).toISOString(),
        hwid: null,
      },
      SECRET
    );
    const files = new Map();
    const dir = path.join(os.tmpdir(), "cp-license-loop-cdn");
    files.set(
      path.join(dir, "license.json"),
      JSON.stringify({
        backendUrl: "http://127.0.0.1:8080",
        license: { ciphertext: enc.ciphertext, iv: enc.iv },
        auth: { token: "token" },
      })
    );
    const seen = [];
    const session = createLicenseSession({
      userDataDir: dir,
      platform: "linux",
      env: { LICENSE_SECRET_KEY: SECRET, COMPUTERPETS_BACKEND_URL: "http://127.0.0.1:8080" },
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
      fetchImpl: async (url, init) => {
        seen.push(String(url));
        if (init && String(init.method || "GET").toUpperCase() === "POST") {
          assert.equal(JSON.parse(init.body).hwid, undefined);
          return new Response(
            JSON.stringify({
              petKey: "red_panda",
              downloadUrl: `http://user:secret@127.0.0.1:9/bundles/red_panda.zip?owner=76561198000000000&jti=${jti}&exp=1893456000&sig=abc#frag`,
              expiresAt: "2030-01-01T00:00:00Z",
              ttlSeconds: 900,
              jti,
            }),
            { status: 200, headers: { "content-type": "application/json" } }
          );
        }
        assert.equal(init && init.body, undefined);
        return new Response("zip", { status: 200 });
      },
    });
    const downloaded = await session.download();
    assert.equal(bundleHonesty(downloaded.downloadUrl), "");
    assert.equal(downloaded.bundle.ok, true);
    assert.equal(downloaded.bundle.held, false);
    const got = seen.find((url) => new URL(url).port === "9");
    assert.ok(got);
    assert.equal(new URL(got).searchParams.has("hwid"), false);
    assert.equal(got.includes("secret"), true);
    assert.equal(bundleHonesty(got).includes("secret"), false);
  });

  it("says there is no license, in plain words, when download runs before unlock or after Lock", async () => {
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const disk = memoryFs();
    const session = createLicenseSession({
      userDataDir: path.join(os.tmpdir(), "cp-license-none"),
      env: { LICENSE_SECRET_KEY: SECRET, BUNDLE_SIGNING_KEY: SIGNING, COMPUTERPETS_BACKEND_URL: "http://127.0.0.1:8080" },
      fetchImpl: backend.fetchImpl,
      hwid: "device-abc-123",
      readFile: disk.readFile,
      writeFile: disk.writeFile,
      mkdir: disk.mkdir,
    });
    const noLicense = (err) => {
      assert.ok(err instanceof LicenseError, String(err && err.stack));
      assert.equal(err.code, "no_license");
      assert.equal(err.message, NO_LICENSE_MESSAGE);
      assert.doesNotMatch(err.message, /undefined|Cannot read|ciphertext/);
      return true;
    };

    await assert.rejects(() => session.download(), noLicense);
    assert.equal(backend.calls.length, 0);

    const storeFile = path.join(os.tmpdir(), "cp-license-none", "license.json");
    disk.writeFile(storeFile, JSON.stringify({ backendUrl: "http://127.0.0.1:8080", license: { ciphertext: "", iv: "" } }));
    await assert.rejects(() => session.download(), noLicense);
    assert.equal(backend.calls.length, 0);

    await session.unlock({ steamId: "76561198000000000", appId: "123456", petType: "red_panda", provider: "steam" });
    const afterUnlock = backend.calls.length;
    assert.ok(afterUnlock > 0);
    session.clear();
    await assert.rejects(() => session.download(), noLicense);
    assert.equal(backend.calls.length, afterUnlock);
  });

  it("hands its own mkdir to the hwid mark, so an injected disk makes no real folder", async () => {
    const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
    const disk = memoryFs();
    const made = [];
    const dir = path.join(os.tmpdir(), `cp-license-nomkdir-${process.pid}-${Date.now()}`);
    const session = createLicenseSession({
      userDataDir: dir,
      env: { LICENSE_SECRET_KEY: SECRET, BUNDLE_SIGNING_KEY: SIGNING, COMPUTERPETS_BACKEND_URL: "http://127.0.0.1:8080" },
      fetchImpl: backend.fetchImpl,
      platform: "linux",
      readFile: (p, enc) => (String(p).endsWith("machine-id") ? "machine-aaa\n" : disk.readFile(p, enc)),
      writeFile: disk.writeFile,
      mkdir: (p) => {
        made.push(String(p));
      },
    });
    await session.unlock({ steamId: "76561198000000000", appId: "123456", petType: "red_panda", provider: "steam" });
    assert.ok(disk.files.has(path.join(dir, "hwid.txt")));
    assert.ok(made.includes(dir));
    assert.equal(fs.existsSync(dir), false);
  });
});

describe("an Unlock that cannot go reads no computer ID", () => {
  const UNLOCK = { steamId: "76561198000000000", appId: "123456", petType: "red_panda", provider: "steam" };
  for (const [name, extraEnv, input, code, message] of [
    ["no license key", { LICENSE_SECRET_KEY: "" }, UNLOCK, "missing_secret", null],
    ["a blank Steam ID", {}, { ...UNLOCK, steamId: " " }, "fields_missing", FIELDS_MISSING_MESSAGE],
    ["no App ID anywhere", {}, { ...UNLOCK, appId: "" }, "fields_missing", NO_APP_ID_MESSAGE],
  ]) {
    it(`${name}: no machine-id read, no hwid.txt, nothing sent`, async () => {
      const backend = createContractTestDouble({ licenseSecret: SECRET, signingKey: SIGNING });
      const disk = memoryFs();
      const reads = [];
      const execs = [];
      const dir = path.join(os.tmpdir(), "cp-license-no-read");
      const session = createLicenseSession({
        userDataDir: dir,
        platform: "linux",
        env: { LICENSE_SECRET_KEY: SECRET, COMPUTERPETS_BACKEND_URL: "http://127.0.0.1:8080", ...extraEnv },
        fetchImpl: backend.fetchImpl,
        exec: (...args) => {
          execs.push(args);
          throw new Error("no exec in this test");
        },
        readFile: (p) => {
          reads.push(String(p));
          return disk.readFile(p);
        },
        writeFile: disk.writeFile,
        mkdir: disk.mkdir,
      });
      await assert.rejects(
        () => session.unlock(input),
        (err) => err instanceof LicenseError && err.code === code && (message === null || err.message === message),
      );
      assert.deepEqual(reads.filter((p) => p.includes("machine-id")), []);
      assert.equal([...disk.files.keys()].some((p) => p.endsWith("hwid.txt")), false);
      assert.deepEqual(execs, []);
      assert.deepEqual(backend.calls, []);
    });
  }
});
