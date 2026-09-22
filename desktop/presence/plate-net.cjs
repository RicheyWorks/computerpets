"use strict";

/**
 * News RSS, market quotes, and Radio Find name the host in the plate before
 * the renderer calls main. Main fetches only when that same painted line is
 * on the IPC payload. A loopback URL stays on this computer.
 * The sentence is weather-areas `clientNetLine`. The path, the query, and
 * the fragment stay off the line.
 */
const { clientNetLine } = require("../renderer/weather-areas.js");

const NEWS_HOST = "the news host";
const RADIO_HOST = "the radio host";
const QUOTE_HOST = "the quote host";
const TERMINAL_HOST = "the terminal host";
const STOCK_HOST = "the stock host";

const NEWS_LEAD = "this news send reads the rss feed.";
const RADIO_LEAD = "this find sends the station look-up.";
const QUOTE_LEAD = "this quote sends the saved list.";
const LOOK_LEAD = "this look-up sends the typed name.";
const LOCAL_STAYS = "this read stays on this computer.";

const LOOPBACK = new Set(["127.0.0.1", "localhost", "::1"]);

const GATES = {
  news: { lead: NEWS_LEAD, host: NEWS_HOST },
  radio: { lead: RADIO_LEAD, host: RADIO_HOST },
  quote: { lead: QUOTE_LEAD, host: QUOTE_HOST },
  terminal: { lead: QUOTE_LEAD, host: TERMINAL_HOST },
  stock: { lead: QUOTE_LEAD, host: STOCK_HOST },
  look: { lead: LOOK_LEAD, host: QUOTE_HOST },
};

function hostOf(raw) {
  try {
    return new URL(String(raw || "").trim()).hostname.replace(/^\[|\]$/g, "").toLowerCase();
  } catch {
    return "";
  }
}

function isLoopbackUrl(raw) {
  const host = hostOf(raw);
  return !!host && LOOPBACK.has(host);
}

/**
 * The painted line names this host when it carries the shared sentence
 * for that host alone, or for that host inside a combined plate phrase.
 * @param {unknown} shown
 * @param {string} hostLabel
 */
function phraseNames(shown, hostLabel) {
  if (typeof shown !== "string" || !hostLabel) return false;
  if (shown.indexOf(clientNetLine(hostLabel)) !== -1) return true;
  const head = "this computer's network address goes with the https request to ";
  const tail = ", as any client.";
  let from = 0;
  while (from < shown.length) {
    const start = shown.indexOf(head, from);
    if (start === -1) return false;
    const end = shown.indexOf(tail, start);
    if (end === -1) return false;
    const phrase = shown.slice(start + head.length, end);
    const parts = phrase.split(/, and |, | and /);
    if (parts.some((part) => part.trim() === hostLabel)) return true;
    from = end + tail.length;
  }
  return false;
}

function lineAllows(shown, hostLabel, lead) {
  if (typeof shown !== "string" || !lead || shown.indexOf(lead) === -1) return false;
  return phraseNames(shown, hostLabel);
}

/**
 * A remote URL leaves only when the painted line for that kind is present.
 * An empty list does not leave. Loopback does not need the outbound sentence.
 * @param {string} kind
 * @param {unknown} shown
 * @param {string | string[]} urls
 */
function mayFetch(kind, shown, urls) {
  const gate = GATES[kind];
  if (!gate) return false;
  const list = (Array.isArray(urls) ? urls : [urls]).filter((url) => typeof url === "string" && url);
  if (!list.length) return true;
  const remote = list.filter((url) => !isLoopbackUrl(url));
  if (!remote.length) return true;
  return lineAllows(shown, gate.host, gate.lead);
}

module.exports = {
  NEWS_HOST,
  RADIO_HOST,
  QUOTE_HOST,
  TERMINAL_HOST,
  STOCK_HOST,
  NEWS_LEAD,
  RADIO_LEAD,
  QUOTE_LEAD,
  LOOK_LEAD,
  LOCAL_STAYS,
  clientNetLine,
  isLoopbackUrl,
  phraseNames,
  lineAllows,
  mayFetch,
};
