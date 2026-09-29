"use strict";

const fs = require("fs");
const path = require("path");
const { LicenseError } = require("./errors.cjs");
const { decryptLicense } = require("./decrypt.cjs");
const { resolveHwidDetail, peekHwid, assertHwid } = require("./hwid.cjs");
const { createLicenseClient, normalizeBackendUrl } = require("./client.cjs");
const { getSignedBundle, postLicenseHash, postUnboundDownload } = require("./license-net.cjs");
const { alreadyCurrent } = require("./bundle-zip.cjs");

const STORE_NAME = "license.json";
const DEFAULT_BACKEND = "http://127.0.0.1:8081";
const NO_LICENSE_MESSAGE = "No license on this computer yet. Unlock a pet first, then download it.";
const NO_TOKEN_MESSAGE =
  "The sign-in from the last unlock is not on this computer anymore, so nothing was downloaded. Unlock again, then download. Pets still work without it.";
const FIELDS_MISSING_MESSAGE = "Fill in the Steam ID and the App ID first. Pets still work without it.";
const NO_APP_ID_MESSAGE =
  "This copy has no Steam App ID set, so Steam cannot unlock it yet. Pets still work without it.";
const STEAM_APPID_FILE = "steam_appid.txt";

/**
 * The Steam App ID this copy was set up with, or "". ComputerPets has no Steam page, so the House window hides
 * its App ID box unless one of these is there: COMPUTERPETS_STEAM_APP_ID, or a steam_appid.txt (the file a
 * Steam build keeps beside its program) in one of dirs. Digits only; anything else counts as none.
 * @param {NodeJS.ProcessEnv} env
 * @param {string[]} dirs
 * @param {(file: string, enc: "utf8") => string} readFile
 */
function configuredSteamAppId(env, dirs, readFile) {
  const digits = (raw) => {
    const text = String(raw == null ? "" : raw).trim();
    return /^\d{1,12}$/.test(text) ? text : "";
  };
  const fromEnv = digits(env && env.COMPUTERPETS_STEAM_APP_ID);
  if (fromEnv) return fromEnv;
  for (const dir of dirs || []) {
    if (!dir) continue;
    try {
      const found = digits(readFile(path.join(dir, STEAM_APPID_FILE), "utf8"));
      if (found) return found;
    } catch {
      /* no file here */
    }
  }
  return "";
}

function readStore(file, readFile) {
  try {
    const parsed = JSON.parse(readFile(file, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** True when license.json holds an issued license (ciphertext + iv). */
function hasStoredLicense(store) {
  const license = store && store.license;
  return Boolean(
    license &&
      typeof license.ciphertext === "string" &&
      license.ciphertext &&
      typeof license.iv === "string" &&
      license.iv
  );
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
 *   platform?: NodeJS.Platform | string,
 *   exec?: typeof import("child_process").execSync,
 *   steamDirs?: string[],
 *   codec?: { encrypt(text: string): string, decrypt(sealed: string): string } | null
 *     | (() => ({ encrypt(text: string): string, decrypt(sealed: string): string } | null)),
 * }} opts
 *
 * The download sign-in (auth.token) is never written in plain text: license.json keeps
 * auth.sealedToken when a codec (the OS secret store) is there, and no token at all when it is not.
 * This run still holds the token in memory, so Unlock's own download works either way.
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
  /** @type {{ token: string, ciphertext: string } | null} */
  let heldToken = null;

  function load() {
    return readStore(storeFile, readFile);
  }

  function tokenCodec() {
    let codec = null;
    try {
      codec = typeof opts.codec === "function" ? opts.codec() : opts.codec;
    } catch {
      codec = null;
    }
    return codec && typeof codec.encrypt === "function" && typeof codec.decrypt === "function" ? codec : null;
  }

  /** What license.json may keep of the sign-in: a sealed token, or only its expiry. */
  function diskAuth(auth) {
    if (!auth || typeof auth !== "object") return auth;
    const expiresAt = auth.expiresAt == null ? null : auth.expiresAt;
    if (typeof auth.token !== "string" || !auth.token) {
      return typeof auth.sealedToken === "string" && auth.sealedToken ? { sealedToken: auth.sealedToken, expiresAt } : { expiresAt };
    }
    const codec = tokenCodec();
    let sealed = "";
    if (codec) {
      try {
        sealed = String(codec.encrypt(auth.token) || "");
      } catch {
        sealed = "";
      }
    }
    return sealed && sealed !== auth.token ? { sealedToken: sealed, expiresAt } : { expiresAt };
  }

  function save(data) {
    const out = data && typeof data === "object" ? { ...data } : {};
    if (out.auth) out.auth = diskAuth(out.auth);
    writeStore(storeFile, out, writeFile, mkdir);
  }

  /** The sign-in for a download: in memory, sealed on disk, or an older plain license.json. */
  function tokenOf(store) {
    const auth = store && store.auth;
    if (auth && typeof auth.token === "string" && auth.token) return auth.token;
    if (auth && typeof auth.sealedToken === "string" && auth.sealedToken) {
      const codec = tokenCodec();
      if (codec) {
        try {
          const opened = String(codec.decrypt(auth.sealedToken) || "");
          if (opened) return opened;
        } catch {
          /* a seal this store cannot open: fall through */
        }
      }
    }
    const license = store && store.license;
    if (heldToken && license && license.ciphertext === heldToken.ciphertext) return heldToken.token;
    return "";
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
      mkdir,
      platform: opts.platform,
      exec: opts.exec,
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
      // An issued license sits in license.json (even when this run cannot decrypt it).
      held: hasStoredLicense(store),
      backendUrl,
      provider: store.provider || "steam",
      fields: store.fields && typeof store.fields === "object" ? store.fields : {},
      // The App ID this copy was set up with (env or steam_appid.txt), "" when none: the House window shows its box then.
      steamAppId: configuredSteamAppId(env, opts.steamDirs || [], readFile),
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
    const provider = typeof input.provider === "string" && input.provider ? input.provider : "steam";
    const allowWeak = input.allowWeakFallback === true;
    const opened = await postLicenseHash(shownLicenseLine(input), backendUrl, async () => {
      const deviceId = deviceMark(true, allowWeak).id;
      const secret = licenseSecret(env);
      if (!secret) {
        throw new LicenseError("missing_secret", "LICENSE_SECRET_KEY is missing; cannot decrypt the issued license");
      }

      const fields = {
        petType: typeof input.petType === "string" && input.petType ? input.petType : "red_panda",
        hwid: deviceId,
      };
      if (provider === "steam") {
        // The App ID box is hidden when this copy has none set up; the configured one stands in for an empty box.
        const appId = String(input.appId || "").trim() || configuredSteamAppId(env, opts.steamDirs || [], readFile);
        if (!String(input.steamId || "").trim()) {
          throw new LicenseError("fields_missing", FIELDS_MISSING_MESSAGE);
        }
        if (!appId) throw new LicenseError("fields_missing", NO_APP_ID_MESSAGE);
        fields.steamId = String(input.steamId);
        fields.appId = appId;
      } else if (input.fields && typeof input.fields === "object") {
        Object.assign(fields, input.fields);
        fields.hwid = deviceId;
      } else {
        throw new LicenseError("denied", `unsupported provider ${provider}`);
      }

      const verified = await client.verify({ backendUrl, provider, fields, licenseSecret: secret });
      return { deviceId, secret, fields, verified };
    });
    const { deviceId, secret, fields, verified } = opened;
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
    heldToken = { token: verified.auth.token, ciphertext: verified.license.ciphertext };
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

  /**
   * @typedef {object} BundleRead
   * @property {boolean} ok
   * @property {number} status
   * @property {number} bytes
   * @property {boolean} [held] true when the download website was not named, so nothing was asked
   * @property {string} [update] install | replace | current | refuse
   * @property {string} [error]
   * @property {string} [petKey]
   * @property {string} [version]
   * @property {string | null} [platform]
   * @property {string} [sha256]
   */

  /** @returns {Promise<BundleRead>} */
  function readBundle(downloadUrl, shown, strict, expect) {
    return getSignedBundle(
      shown,
      downloadUrl,
      async () => {
        try {
          const bundle = await client.fetchBundle(downloadUrl, expect);
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
      },
      strict === true
    );
  }

  function catalogExpect(manifest, store) {
    const local =
      store && store.installedBundle && typeof store.installedBundle === "object"
        ? store.installedBundle
        : null;
    return {
      petKey: typeof manifest.petKey === "string" ? manifest.petKey : null,
      version: typeof manifest.version === "string" ? manifest.version : null,
      platform: typeof manifest.platform === "string" ? manifest.platform : null,
      sha256: typeof manifest.sha256 === "string" ? manifest.sha256 : null,
      local,
    };
  }

  async function requestDownload(storeArg, payloadArg, deviceIdArg, secretArg, allowWeakFallback, shownLine, shownCdn) {
    const store = storeArg || load();
    // Never unlocked, or Lock cleared it: say so before any decrypt or POST.
    if (!hasStoredLicense(store)) {
      throw new LicenseError("no_license", NO_LICENSE_MESSAGE);
    }
    const secret = secretArg || licenseSecret(env);
    const payload = payloadArg || decryptLicense(store.license.ciphertext, store.license.iv, secret, { now });
    const bound = Boolean(payload.hwid);
    const backendUrl = normalizeBackendUrl(store.backendUrl || defaultBackendUrl(env));
    const shown = typeof shownLine === "string" ? shownLine : "";
    const post = bound ? postLicenseHash : postUnboundDownload;
    const token = tokenOf(store);
    const manifest = await post(shown, backendUrl, async () => {
      const deviceId = deviceIdArg || (bound ? deviceMark(true, allowWeakFallback === true).id : "");
      if (bound && payload.hwid !== deviceId) {
        throw new LicenseError("hwid_mismatch", "hardware binding mismatch");
      }
      if (!token) throw new LicenseError("no_token", NO_TOKEN_MESSAGE);
      return client.download({
        backendUrl,
        petKey: payload.pet,
        ciphertext: store.license.ciphertext,
        iv: store.license.iv,
        hwid: payload.hwid ? deviceId : undefined,
        token,
        expect: { jti: payload.jti, petKey: payload.pet, owner: payload.owner },
        signingKey: env.BUNDLE_SIGNING_KEY || undefined,
      });
    });

    const expect = catalogExpect(manifest, store);
    /** @type {BundleRead} */
    let bundle;
    if (alreadyCurrent(expect)) {
      bundle = {
        ok: true,
        status: 0,
        bytes: 0,
        held: false,
        update: "current",
        petKey: expect.petKey,
        version: expect.version,
        platform: expect.platform,
        sha256: expect.sha256,
      };
    } else if (expect.version && !expect.sha256) {
      bundle = {
        ok: false,
        status: 0,
        bytes: 0,
        held: false,
        update: "refuse",
        error: "bundle_sha256_missing",
      };
    } else {
      bundle = await readBundle(manifest.downloadUrl, typeof shownCdn === "string" ? shownCdn : "", false, expect);
    }

    const lastDownload = {
      petKey: manifest.petKey || payload.pet,
      downloadUrl: manifest.downloadUrl,
      expiresAt: manifest.expiresAt || null,
      jti: manifest.jti || payload.jti,
      ttlSeconds: manifest.ttlSeconds || null,
      version: typeof manifest.version === "string" ? manifest.version : null,
      platform: typeof manifest.platform === "string" ? manifest.platform : null,
      sha256: typeof manifest.sha256 === "string" ? manifest.sha256 : null,
      filename: typeof manifest.filename === "string" ? manifest.filename : null,
      bundle,
    };
    const nextStore = { ...store, lastDownload };
    if (bundle && bundle.ok && (bundle.update === "install" || bundle.update === "replace" || bundle.update === "current")) {
      if (bundle.sha256 && bundle.version && bundle.petKey) {
        nextStore.installedBundle = {
          petKey: bundle.petKey,
          version: bundle.version,
          platform: bundle.platform || null,
          sha256: bundle.sha256,
        };
      }
    }
    // save() seals or drops a plain token an older license.json still carried.
    save(nextStore);
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
    const expect = catalogExpect(last || {}, store);
    const bundle = await readBundle(downloadUrl, shownCdnLine(input), true, expect);
    const next = { ...last, bundle };
    const nextStore = { ...store, lastDownload: next };
    if (bundle && bundle.ok && (bundle.update === "install" || bundle.update === "replace" || bundle.update === "current")) {
      if (bundle.sha256 && bundle.version && bundle.petKey) {
        nextStore.installedBundle = {
          petKey: bundle.petKey,
          version: bundle.version,
          platform: bundle.platform || null,
          sha256: bundle.sha256,
        };
      }
    }
    save(nextStore);
    return next;
  }

  function clear() {
    heldToken = null;
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

module.exports = {
  createLicenseSession,
  defaultBackendUrl,
  DEFAULT_BACKEND,
  NO_LICENSE_MESSAGE,
  NO_TOKEN_MESSAGE,
  FIELDS_MISSING_MESSAGE,
  NO_APP_ID_MESSAGE,
  configuredSteamAppId,
};
