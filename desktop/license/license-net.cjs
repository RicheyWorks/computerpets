"use strict";

/**
 * Unlock and a bound download name the backend host before the license hash leaves.
 * The sentence is weather-areas `clientNetLine`. A loopback backend stays on this computer.
 * The path, the query, the fragment, and any userinfo stay off the line.
 */
const { clientNetLine } = require("../renderer/weather-areas.js");

const LICENSE_HOST_NAME = "the license host";
const LOCAL_STAYS = "this unlock stays on this computer. the license hash does not leave.";

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

module.exports = {
  LICENSE_HOST_NAME,
  LOCAL_STAYS,
  licenseHostName,
  licenseTarget,
  licenseHonesty,
  licenseMaySend,
  clientNetLine,
};
