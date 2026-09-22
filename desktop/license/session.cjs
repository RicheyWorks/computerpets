"use strict";

const fs = require("fs");
const path = require("path");
const { LicenseError } = require("./errors.cjs");
const { decryptLicense } = require("./decrypt.cjs");
const { resolveHwidDetail, peekHwid, assertHwid } = require("./hwid.cjs");
const { createLicenseClient, normalizeBackendUrl } = require("./client.cjs");
const { bundleHostName, bundleMayFetch, downloadMayPost, licenseHostName, licenseMaySend } = require("./license-net.cjs");

const STORE_NAME = "license.json";
const DEFAULT_BACKEND = "http://127.0.0.1:8081";

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

function shownLicenseLine(input) {
  return input && typeof input.licenseLine === "string" ? input.licenseLine : "";
}

function shownCdnLine(input) {
  return input && typeof input.cdnLine === "string" ? input.cdnLine : "";
}

function assertHashNamed(backendUrl, shown) {
  if (licenseMaySend(backendUrl, shown)) return;
  const host = licenseHostName(backendUrl) || "the license host";
  throw new LicenseError(
    "license_net_unnamed",
    `the license hash was not sent to ${host}. name that host before it leaves.`
  );
}

function assertDownloadNamed(backendUrl, shown) {
  if (downloadMayPost(backendUrl, shown)) return;
  const host = licenseHostName(backendUrl) || "the license host";
  throw new LicenseError(
    "download_net_unnamed",
    `this download was not sent to ${host}. name that host before it leaves.`
  );
}

function assertBundleNamed(downloadUrl, shown) {
  if (bundleMayFetch(downloadUrl, shown)) return;
  const host = bundleHostName(downloadUrl) || "the bundle host";
  throw new LicenseError(
    "cdn_net_unnamed",
    `the signed bundle was not fetched from ${host}. name that host before it leaves.`
  );
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

  function deviceMark(allowRead, allowWeakFallback) {
    if (typeof opts.hwid === "string" && opts.hwid) {
      return { id: assertHwid(opts.hwid), source: "caller", read: "caller", rawLeavesMachine: false };
    }
    const peeked = peekHwid({ userDataDir: opts.userDataDir, readFile });
    if (!allowRead || peeked.read === "stored") return peeked;
    return resolveHwidDetail({
      userDataDir: opts.userDataDir,
      readFile,
      writeFile,
      allowWeakFallback: allowWeakFallback === true,
    });
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

    let mark = { id: "", source: null, read: "unread", rawLeavesMachine: false };
    try {
      mark = deviceMark(false);
    } catch {
      mark = { id: "", source: "hwid.txt", read: "rejected", rawLeavesMachine: false };
    }

    return {
      unlocked: Boolean(payload),
      backendUrl,
      provider: store.provider || "steam",
      fields: store.fields && typeof store.fields === "object" ? store.fields : {},
      hwid: mark.id,
      hwidMark: {
        read: mark.read,
        source: mark.source,
        rawLeavesMachine: false,
        phoneHome: "hash-on-unlock-and-bound-download",
      },
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
    assertHashNamed(backendUrl, shownLicenseLine(input));
    const provider = typeof input.provider === "string" && input.provider ? input.provider : "steam";
    const deviceId = deviceMark(true, input.allowWeakFallback === true).id;
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

    const downloaded = await requestDownload(
      next,
      payload,
      deviceId,
      secret,
      input.allowWeakFallback === true,
      shownLicenseLine(input),
      shownCdnLine(input)
    );
    return { ...publicStatus(), download: downloaded };
  }

  async function readBundle(downloadUrl, shown) {
    if (!bundleMayFetch(downloadUrl, shown)) {
      return { ok: false, status: 0, bytes: 0, held: true };
    }
    try {
      const bundle = await client.fetchBundle(downloadUrl);
      return { ...bundle, held: false };
    } catch (err) {
      return {
        ok: false,
        status: 0,
        bytes: 0,
        held: false,
        error: err instanceof LicenseError ? err.message : String(err.message || err),
      };
    }
  }

  async function requestDownload(storeArg, payloadArg, deviceIdArg, secretArg, allowWeakFallback, shownLine, shownCdn) {
    const store = storeArg || load();
    const secret = secretArg || licenseSecret(env);
    const payload = payloadArg || decryptLicense(store.license.ciphertext, store.license.iv, secret, { now });
    const bound = Boolean(payload.hwid);
    const backendUrl = normalizeBackendUrl(store.backendUrl || defaultBackendUrl(env));
    const shown = typeof shownLine === "string" ? shownLine : "";
    if (bound) assertHashNamed(backendUrl, shown);
    else assertDownloadNamed(backendUrl, shown);
    const deviceId = deviceIdArg || (bound ? deviceMark(true, allowWeakFallback === true).id : "");

    if (bound && payload.hwid !== deviceId) {
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

    const bundle = await readBundle(manifest.downloadUrl, typeof shownCdn === "string" ? shownCdn : "");

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

  async function download(input = {}) {
    const allow = input && input.allowWeakFallback === true;
    return requestDownload(null, null, null, null, allow, shownLicenseLine(input), shownCdnLine(input));
  }

  async function fetchSigned(input = {}) {
    const store = load();
    const last = store.lastDownload;
    const downloadUrl = last && typeof last.downloadUrl === "string" ? last.downloadUrl : "";
    if (!downloadUrl) {
      throw new LicenseError("signed_url_invalid", "downloadUrl missing");
    }
    assertBundleNamed(downloadUrl, shownCdnLine(input));
    const bundle = await readBundle(downloadUrl, shownCdnLine(input));
    const next = { ...last, bundle };
    save({ ...store, lastDownload: next });
    return next;
  }

  function clear() {
    save({});
    return publicStatus();
  }

  return {
    status: publicStatus,
    unlock,
    download,
    fetchSigned,
    clear,
    hwid: () => deviceMark(true).id,
  };
}

module.exports = { createLicenseSession, defaultBackendUrl, DEFAULT_BACKEND };
