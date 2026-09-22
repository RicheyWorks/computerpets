"use strict";

/**
 * Unlock and a bound download name the backend host before the license hash leaves.
 * A signed bundle GET names the CDN host before that request leaves.
 * The sentence is weather-areas `clientNetLine`. A loopback host stays on this computer.
 * The path, the query, the fragment, and any userinfo stay off the line.
 */
const { clientNetLine } = require("../renderer/weather-areas.js");

const LICENSE_HOST_NAME = "the license host";
const LOCAL_STAYS = "this unlock stays on this computer. the license hash does not leave.";
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

module.exports = {
  LICENSE_HOST_NAME,
  LOCAL_STAYS,
  BUNDLE_HOST_NAME,
  BUNDLE_IDLE,
  BUNDLE_LOCAL,
  licenseHostName,
  licenseTarget,
  licenseHonesty,
  licenseMaySend,
  bundleHostName,
  bundleTarget,
  bundleHonesty,
  bundleMayFetch,
  clientNetLine,
};
