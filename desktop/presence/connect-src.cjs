"use strict";

/**
 * Overlay and minds-window Content-Security-Policy.
 * This module does not fetch and does not open a socket.
 * The living policy is the meta tag. This list is what that tag must name.
 */

/** Preset cloud-talk and cloud-voice hosts. A custom base is not in this list. */
const TALK_HOSTS = [
  "api.x.ai",
  "api.openai.com",
  "api.anthropic.com",
  "generativelanguage.googleapis.com",
  "api.groq.com",
  "openrouter.ai",
  "api.together.xyz",
  "api.fireworks.ai",
  "api.deepseek.com",
  "api.mistral.ai",
];

const NEWS_HOSTS = ["en.wikipedia.org", "news.google.com"];

const QUOTE_HOSTS = ["api.coingecko.com", "api.geckoterminal.com", "query1.finance.yahoo.com"];

const RADIO_HOSTS = [
  "de1.api.radio-browser.info",
  "de2.api.radio-browser.info",
  "fi1.api.radio-browser.info",
];

const WEATHER_HOSTS = ["api.open-meteo.com", "geocoding-api.open-meteo.com"];

const FIXED_HOSTS = [...TALK_HOSTS, ...NEWS_HOSTS, ...QUOTE_HOSTS, ...RADIO_HOSTS, ...WEATHER_HOSTS];

/**
 * A painted custom talk host, and a redirect from a preset talk host, are not
 * a closed list. The meta policy is fixed when the document loads, so those
 * hosts cannot be appended later. The scheme stays. A new literal host still
 * has to be added here and on the meta tag together.
 */
const KEEPER_CHOSEN_SCHEME = "https:";

const SCHEME_REASON =
  "The https: scheme stays because a painted custom talk host, and a redirect from a preset talk host, are not a closed list. CSP is fixed when the document loads.";

/**
 * A station stream host is the station URL. It is not one of the directory hosts.
 * House loops stay on this computer ('self' or blob).
 */
const MEDIA_SRC = "'self' https: http: blob:";

const MEDIA_REASON =
  "media-src keeps https: and http: because a station stream host is the station URL. A house loop stays on this computer.";

const LOOPBACK = ["http://127.0.0.1:*", "http://localhost:*"];

function connectSrc() {
  return [
    "'self'",
    KEEPER_CHOSEN_SCHEME,
    ...FIXED_HOSTS.map((host) => `https://${host}`),
    ...LOOPBACK,
  ].join(" ");
}

function overlayCsp() {
  return [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self'",
    `connect-src ${connectSrc()}`,
    `media-src ${MEDIA_SRC}`,
  ].join("; ");
}

/**
 * The minds window saves prefs and calls main over IPC.
 * It does not fetch. connect-src 'none' refuses a later script from leaving.
 */
const SETTINGS_CSP = [
  "default-src 'self'",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'none'",
  "media-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

module.exports = {
  TALK_HOSTS,
  NEWS_HOSTS,
  QUOTE_HOSTS,
  RADIO_HOSTS,
  WEATHER_HOSTS,
  FIXED_HOSTS,
  KEEPER_CHOSEN_SCHEME,
  SCHEME_REASON,
  MEDIA_SRC,
  MEDIA_REASON,
  LOOPBACK,
  connectSrc,
  overlayCsp,
  SETTINGS_CSP,
};
