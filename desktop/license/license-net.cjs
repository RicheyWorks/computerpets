"use strict";

/**
 * Unlock and a bound download name the backend host before the license hash leaves.
 * An unbound download names that host before the POST leaves. That POST has no hash.
 * A signed bundle GET names the CDN host before that request leaves.
 * The sentence is weather-areas `clientNetLine`. A loopback host stays on this computer.
 * The path, the query, the fragment, and any userinfo stay off the line.
 */
const { clientNetLine } = require("../renderer/weather-areas.js");
const { LicenseError } = require("./errors.cjs");

const LICENSE_HOST_NAME = "the license host";
const LOCAL_STAYS = "this unlock stays on this computer. the license hash does not leave.";
const DOWNLOAD_LOCAL = "this download stays on this computer. it talks to this computer. the license hash is not on that request.";
const BUNDLE_HOST_NAME = "the bundle host";
const BUNDLE_IDLE = "a signed bundle is not fetched until this line names the host.";
const BUNDLE_LOCAL = "this download stays on this computer. the signed bundle does not leave.";

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
  return { local: isLoopbackHost(host), label: host || LICENSE_HOST_NAME };
}

/** Empty when this unlock does not leave the computer, or the shared sentence is missing. */
function licenseHonesty(backendUrl) {
  const target = licenseTarget(backendUrl);
  if (!target || target.local) return "";
  const net = clientNetLine(target.label);
  if (!net) return "";
  return `this unlock sends the license hash. ${net} a bound download sends that same hash.`;
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
  const net = clientNetLine(target.label);
  if (!line || !net || typeof shown !== "string") return false;
  return shown.indexOf(line) !== -1 && shown.indexOf(net) !== -1;
}

/**
 * The only unlock-hash POST, including a bound download that sends that same hash.
 * A miss rejects and does not call `request`, so the caller does not read an OS id
 * or write `hwid.txt` inside that request. A loopback backend still calls `request`.
 * That post stays on this computer.
 * @param {unknown} shown
 * @param {string} backendUrl
 * @param {() => unknown} request
 */
function postLicenseHash(shown, backendUrl, request) {
  if (!licenseMaySend(backendUrl, shown)) {
    const host = licenseHostName(backendUrl) || LICENSE_HOST_NAME;
    return Promise.reject(
      new LicenseError(
        "license_net_unnamed",
        `the license hash was not sent to ${host}. name that host before it leaves.`
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
  const net = clientNetLine(target.label);
  if (!net) return "";
  return `this download talks to ${target.label}. ${net} the license hash is not on that request.`;
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
  const net = clientNetLine(target.label);
  if (!line || !net || typeof shown !== "string") return false;
  return shown.indexOf(line) !== -1 && shown.indexOf(net) !== -1;
}

/**
 * The only unbound download POST. A miss rejects and does not call `request`.
 * That POST has no hash and does not read an OS id. A loopback backend still calls `request`.
 * @param {unknown} shown
 * @param {string} backendUrl
 * @param {() => unknown} request
 */
function postUnboundDownload(shown, backendUrl, request) {
  if (!downloadMayPost(backendUrl, shown)) {
    const host = licenseHostName(backendUrl) || LICENSE_HOST_NAME;
    return Promise.reject(
      new LicenseError(
        "download_net_unnamed",
        `this download was not sent to ${host}. name that host before it leaves.`
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
  return { local: false, label: host || BUNDLE_HOST_NAME };
}

/** Empty when this download does not leave the computer, or the shared sentence is missing. */
function bundleHonesty(downloadUrl) {
  const target = bundleTarget(downloadUrl);
  if (!target || target.local) return "";
  const net = clientNetLine(target.label);
  if (!net) return "";
  return `this download gets the signed bundle. ${net} the license hash is not on that request.`;
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
  const net = clientNetLine(target.label);
  if (!line || !net || typeof shown !== "string") return false;
  return shown.indexOf(line) !== -1 && shown.indexOf(net) !== -1;
}

/**
 * The only signed-bundle GET. A miss does not call `request` and does not scrub the signed query.
 * `strict` rejects with the session gate. Otherwise the miss is a held read.
 * A loopback CDN or a file URL still calls `request`. That read stays on this computer.
 * @param {unknown} shown
 * @param {string} downloadUrl
 * @param {() => unknown} request
 * @param {boolean} [strict]
 */
function getSignedBundle(shown, downloadUrl, request, strict) {
  if (!bundleMayFetch(downloadUrl, shown)) {
    if (strict) {
      const host = bundleHostName(downloadUrl) || BUNDLE_HOST_NAME;
      return Promise.reject(
        new LicenseError(
          "cdn_net_unnamed",
          `the signed bundle was not fetched from ${host}. name that host before it leaves.`
        )
      );
    }
    return Promise.resolve({ ok: false, status: 0, bytes: 0, held: true });
  }
  return Promise.resolve().then(request);
}

module.exports = {
  LICENSE_HOST_NAME,
  LOCAL_STAYS,
  DOWNLOAD_LOCAL,
  BUNDLE_HOST_NAME,
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
  clientNetLine,
};
