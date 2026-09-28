"use strict";

/**
 * Unlock and a bound download say the license website's name before the code made from this
 * computer's ID is sent there. An unbound download says that name before it asks; it sends no such code.
 * Downloading your pet's files says the download website's name before it asks for them.
 * Each line names the website in plain words and says what goes to it, with the weather-areas
 * `plainNetLine` address sentence. A loopback host stays on this computer.
 * The path, the query, the fragment, and any userinfo stay off the line.
 */
const { plainNetLine } = require("../renderer/weather-areas.js");
const { LicenseError } = require("./errors.cjs");

const LOCAL_STAYS = "Unlocking stays on this computer. The code made from this computer's ID does not leave.";
const DOWNLOAD_LOCAL = "This download stays on this computer. It talks to this computer. It does not send the code made from this computer's ID.";
const BUNDLE_IDLE = "Your pet's files are not downloaded until this line names the website.";
const BUNDLE_LOCAL = "This download stays on this computer. Your pet's files come from this computer.";

const LOOPBACK = new Set(["127.0.0.1", "localhost", "::1"]);

function licenseHostName(raw) {
  try {
    return new URL(String(raw || "").trim()).hostname.replace(/^\[|\]$/g, "") || "";
  } catch {
    return "";
  }
}

function isLoopbackHost(host) {
  return LOOPBACK.has(String(host || "").toLowerCase());
}

/**
 * @returns {{ local: boolean, label: string } | null}
 */
function licenseTarget(backendUrl) {
  const host = licenseHostName(backendUrl);
  if (!host) return null;
  return { local: isLoopbackHost(host), label: host };
}

/** Empty when this unlock does not leave the computer, or the shared sentence is missing. */
function licenseHonesty(backendUrl) {
  const target = licenseTarget(backendUrl);
  if (!target || target.local) return "";
  const net = plainNetLine(target.label);
  if (!net) return "";
  return `This asks ${target.label}, the license website, to check your license. It sends what you typed for your license and a scrambled code made from this computer's ID. The ID itself stays here. ${net} A download tied to this computer sends that same code.`;
}

/**
 * A remote hash leaves only when that line is shown.
 * Loopback, and a URL that is not a host, do not need the line.
 * @param {string} backendUrl
 * @param {unknown} shown
 */
function licenseMaySend(backendUrl, shown) {
  const target = licenseTarget(backendUrl);
  if (!target || target.local) return true;
  const line = licenseHonesty(backendUrl);
  const net = plainNetLine(target.label);
  if (!line || !net || typeof shown !== "string") return false;
  return shown.indexOf(line) !== -1 && shown.indexOf(net) !== -1;
}

/**
 * The only unlock-hash POST, including a bound download that sends that same hash.
 * A miss rejects and does not call `request`, so the caller does not read an OS id
 * or write `hwid.txt` inside that request. A loopback backend still calls `request`.
 * That post stays on this computer.
 * @template T
 * @param {unknown} shown
 * @param {string} backendUrl
 * @param {() => T | Promise<T>} request
 * @returns {Promise<T>}
 */
function postLicenseHash(shown, backendUrl, request) {
  if (!licenseMaySend(backendUrl, shown)) {
    // A miss needs a named host (no host never leaves), so the error always names it.
    const host = licenseHostName(backendUrl);
    return Promise.reject(
      new LicenseError(
        "license_net_unnamed",
        `Nothing was sent to ${host}. This page has to name the license website first.`
      )
    );
  }
  return Promise.resolve().then(request);
}

/**
 * Empty when this download does not leave the computer, or the shared sentence is missing.
 * The hash sentence is a different line. This one does not say a hash is sent.
 */
function downloadTalkHonesty(backendUrl) {
  const target = licenseTarget(backendUrl);
  if (!target || target.local) return "";
  const net = plainNetLine(target.label);
  if (!net) return "";
  return `This asks ${target.label}, the license website, for your pet. It sends your saved license and the pass from unlocking. ${net} It does not send the code made from this computer's ID.`;
}

/**
 * An unbound remote POST leaves only when that line is shown.
 * Loopback, and a URL that is not a host, do not need the line.
 * @param {string} backendUrl
 * @param {unknown} shown
 */
function downloadMayPost(backendUrl, shown) {
  const target = licenseTarget(backendUrl);
  if (!target || target.local) return true;
  const line = downloadTalkHonesty(backendUrl);
  const net = plainNetLine(target.label);
  if (!line || !net || typeof shown !== "string") return false;
  return shown.indexOf(line) !== -1 && shown.indexOf(net) !== -1;
}

/**
 * The only unbound download POST. A miss rejects and does not call `request`.
 * That POST has no hash and does not read an OS id. A loopback backend still calls `request`.
 * @template T
 * @param {unknown} shown
 * @param {string} backendUrl
 * @param {() => T | Promise<T>} request
 * @returns {Promise<T>}
 */
function postUnboundDownload(shown, backendUrl, request) {
  if (!downloadMayPost(backendUrl, shown)) {
    const host = licenseHostName(backendUrl);
    return Promise.reject(
      new LicenseError(
        "download_net_unnamed",
        `Nothing was sent to ${host}. This page has to name the license website first.`
      )
    );
  }
  return Promise.resolve().then(request);
}

function bundleUrl(raw) {
  try {
    return new URL(String(raw || "").trim());
  } catch {
    return null;
  }
}

function bundleHostName(raw) {
  const url = bundleUrl(raw);
  if (!url || url.protocol === "file:") return "";
  return url.hostname.replace(/^\[|\]$/g, "") || "";
}

/**
 * @returns {{ local: boolean, label: string } | null}
 */
function bundleTarget(downloadUrl) {
  const raw = String(downloadUrl || "").trim();
  if (!raw) return null;
  const url = bundleUrl(raw);
  if (!url || url.protocol === "file:") return { local: true, label: "" };
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!host || isLoopbackHost(host)) return { local: true, label: host };
  return { local: false, label: host };
}

/** Empty when this download does not leave the computer, or the shared sentence is missing. */
function bundleHonesty(downloadUrl) {
  const target = bundleTarget(downloadUrl);
  if (!target || target.local) return "";
  const net = plainNetLine(target.label);
  if (!net) return "";
  return `This gets your pet's files from ${target.label}, the download website, with the link the license website gave. ${net} It does not send the code made from this computer's ID.`;
}

/**
 * A remote bundle leaves only when that line is shown.
 * Loopback, a file URL, and a URL that is not a host do not need the line.
 * @param {string} downloadUrl
 * @param {unknown} shown
 */
function bundleMayFetch(downloadUrl, shown) {
  const target = bundleTarget(downloadUrl);
  if (!target || target.local) return true;
  const line = bundleHonesty(downloadUrl);
  const net = plainNetLine(target.label);
  if (!line || !net || typeof shown !== "string") return false;
  return shown.indexOf(line) !== -1 && shown.indexOf(net) !== -1;
}

/**
 * The only signed-bundle GET. A miss does not call `request` and does not scrub the signed query.
 * `strict` rejects with the session gate. Otherwise the miss is a held read.
 * A loopback CDN or a file URL still calls `request`. That read stays on this computer.
 * @template T
 * @param {unknown} shown
 * @param {string} downloadUrl
 * @param {() => T | Promise<T>} request
 * @param {boolean} [strict]
 * @returns {Promise<T | { ok: false, status: 0, bytes: 0, held: true }>}
 */
function getSignedBundle(shown, downloadUrl, request, strict) {
  if (!bundleMayFetch(downloadUrl, shown)) {
    if (strict) {
      const host = bundleHostName(downloadUrl);
      return Promise.reject(
        new LicenseError(
          "cdn_net_unnamed",
          `Your pet's files were not downloaded from ${host}. This page has to name the download website first.`
        )
      );
    }
    return Promise.resolve({ ok: false, status: 0, bytes: 0, held: true });
  }
  return Promise.resolve().then(request);
}

module.exports = {
  LOCAL_STAYS,
  DOWNLOAD_LOCAL,
  BUNDLE_IDLE,
  BUNDLE_LOCAL,
  licenseHostName,
  licenseTarget,
  licenseHonesty,
  licenseMaySend,
  postLicenseHash,
  downloadTalkHonesty,
  downloadMayPost,
  postUnboundDownload,
  bundleHostName,
  bundleTarget,
  bundleHonesty,
  bundleMayFetch,
  getSignedBundle,
  plainNetLine,
};
