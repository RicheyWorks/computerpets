"use strict";

const fs = require("fs");
const path = require("path");
const { LicenseError } = require("./errors.cjs");
const { decryptLicense } = require("./decrypt.cjs");
const { resolveHwid, assertHwid } = require("./hwid.cjs");
const { createLicenseClient, normalizeBackendUrl } = require("./client.cjs");

const STORE_NAME = "license.json";
const DEFAULT_BACKEND = "http://127.0.0.1:8080";

function readStore(file, readFile) {
  try {
    const parsed = JSON.parse(readFile(file, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(file, data, writeFile, mkdir) {
  mkdir(path.dirname(file), { recursive: true });
  writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

function defaultBackendUrl(env) {
  const raw = env.COMPUTERPETS_BACKEND_URL || env.ENTERPRISEPET_BACKEND_URL || DEFAULT_BACKEND;
  return normalizeBackendUrl(raw);
}

function licenseSecret(env) {
  return env.LICENSE_SECRET_KEY || env.COMPUTERPETS_LICENSE_SECRET_KEY || "";
}

/**
 * Main-process unlock session. No "always licensed" path — missing backend,
 * bad ciphertext, expiry, revoked jti, or hwid mismatch all fail closed.
 *
 * @param {{
 *   userDataDir: string,
 *   env?: NodeJS.ProcessEnv,
 *   fetchImpl?: typeof fetch,
 *   now?: () => number,
 *   hwid?: string,
 *   readFile?: typeof fs.readFileSync,
 *   writeFile?: typeof fs.writeFileSync,
 *   mkdir?: typeof fs.mkdirSync,
 * }} opts
 */
function createLicenseSession(opts) {
  if (!opts || !opts.userDataDir) {
    throw new LicenseError("missing_backend", "userDataDir is required");
  }
  const env = opts.env || process.env;
  const readFile = opts.readFile || fs.readFileSync;
  const writeFile = opts.writeFile || fs.writeFileSync;
  const mkdir = opts.mkdir || fs.mkdirSync;
  const now = opts.now || Date.now;
  const storeFile = path.join(opts.userDataDir, STORE_NAME);
  const client = createLicenseClient({ fetchImpl: opts.fetchImpl });

  function load() {
    return readStore(storeFile, readFile);
  }

  function save(data) {
    writeStore(storeFile, data, writeFile, mkdir);
  }

  function hwid() {
    if (typeof opts.hwid === "string" && opts.hwid) return assertHwid(opts.hwid);
    return resolveHwid({ userDataDir: opts.userDataDir, readFile, writeFile });
  }

  function decryptStored(store) {
    const license = store.license;
    if (!license || !license.ciphertext || !license.iv) return null;
    return decryptLicense(license.ciphertext, license.iv, licenseSecret(env), { now });
  }

  function publicStatus() {
    const store = load();
    let payload = null;
    let error = null;
    try {
      payload = decryptStored(store);
    } catch (err) {
      error = err instanceof LicenseError ? { code: err.code, message: err.message } : { code: "decrypt_failed", message: String(err.message || err) };
    }

    let backendUrl = "";
    try {
      backendUrl = store.backendUrl || defaultBackendUrl(env);
    } catch (err) {
      error = error || (err instanceof LicenseError ? { code: err.code, message: err.message } : { code: "missing_backend", message: String(err.message || err) });
    }

    return {
      unlocked: Boolean(payload),
      backendUrl,
      provider: store.provider || "steam",
      fields: store.fields && typeof store.fields === "object" ? store.fields : {},
      hwid: (() => {
        try {
          return hwid();
        } catch {
          return "";
        }
      })(),
      license: payload
        ? {
            jti: payload.jti,
            owner: payload.owner,
            pet: payload.pet,
            validUntil: payload.validUntil,
            issuedAt: payload.issuedAt,
            hwid: payload.hwid,
            provider: store.provider || null,
          }
        : null,
      lastDownload: store.lastDownload || null,
      error,
    };
  }

  /**
   * Steam (or any registered provider) against the real HTTP contract.
   * Always sends hwid so the issued license is device-bound.
   */
  async function unlock(input = {}) {
    const store = load();
    const backendUrl = normalizeBackendUrl(input.backendUrl || store.backendUrl || defaultBackendUrl(env));
    const provider = typeof input.provider === "string" && input.provider ? input.provider : "steam";
    const deviceId = hwid();
    const secret = licenseSecret(env);
    if (!secret) {
      throw new LicenseError("missing_secret", "LICENSE_SECRET_KEY is missing; cannot decrypt the issued license");
    }

    const fields = {
      petType: typeof input.petType === "string" && input.petType ? input.petType : "red_panda",
      hwid: deviceId,
    };
    if (provider === "steam") {
      if (!input.steamId || !input.appId) {
        throw new LicenseError("denied", "steamId and appId are required");
      }
      fields.steamId = String(input.steamId);
      fields.appId = String(input.appId);
    } else if (input.fields && typeof input.fields === "object") {
      Object.assign(fields, input.fields);
      fields.hwid = deviceId;
    } else {
      throw new LicenseError("denied", `unsupported provider ${provider}`);
    }

    const verified = await client.verify({ backendUrl, provider, fields });
    const payload = decryptLicense(verified.license.ciphertext, verified.license.iv, secret, { now });

    if (payload.hwid && payload.hwid !== deviceId) {
      throw new LicenseError("hwid_mismatch", "issued license hwid does not match this device");
    }

    const next = {
      backendUrl,
      provider,
      fields: { steamId: fields.steamId, appId: fields.appId, petType: fields.petType },
      license: {
        ciphertext: verified.license.ciphertext,
        iv: verified.license.iv,
        expiresAt: verified.license.expiresAt,
      },
      auth: {
        token: verified.auth.token,
        expiresAt: verified.auth.expiresAt,
      },
      lastDownload: null,
    };
    save(next);

    const downloaded = await requestDownload(next, payload, deviceId, secret);
    return { ...publicStatus(), download: downloaded };
  }

  async function requestDownload(storeArg, payloadArg, deviceIdArg, secretArg) {
    const store = storeArg || load();
    const secret = secretArg || licenseSecret(env);
    const payload = payloadArg || decryptLicense(store.license.ciphertext, store.license.iv, secret, { now });
    const deviceId = deviceIdArg || hwid();
    const backendUrl = normalizeBackendUrl(store.backendUrl || defaultBackendUrl(env));

    if (payload.hwid && payload.hwid !== deviceId) {
      throw new LicenseError("hwid_mismatch", "hardware binding mismatch");
    }

    const manifest = await client.download({
      backendUrl,
      petKey: payload.pet,
      ciphertext: store.license.ciphertext,
      iv: store.license.iv,
      hwid: payload.hwid ? deviceId : undefined,
      token: store.auth && store.auth.token,
      expect: { jti: payload.jti, petKey: payload.pet, owner: payload.owner },
      signingKey: env.BUNDLE_SIGNING_KEY || undefined,
    });

    let bundle = { ok: false, status: 0, bytes: 0, error: null };
    try {
      bundle = await client.fetchBundle(manifest.downloadUrl);
    } catch (err) {
      bundle = {
        ok: false,
        status: 0,
        bytes: 0,
        error: err instanceof LicenseError ? err.message : String(err.message || err),
      };
    }

    const lastDownload = {
      petKey: manifest.petKey || payload.pet,
      downloadUrl: manifest.downloadUrl,
      expiresAt: manifest.expiresAt || null,
      jti: manifest.jti || payload.jti,
      ttlSeconds: manifest.ttlSeconds || null,
      bundle,
    };
    save({ ...store, lastDownload });
    return lastDownload;
  }

  async function download() {
    return requestDownload();
  }

  function clear() {
    save({});
    return publicStatus();
  }

  return { status: publicStatus, unlock, download, clear, hwid };
}

module.exports = { createLicenseSession, defaultBackendUrl, DEFAULT_BACKEND };
