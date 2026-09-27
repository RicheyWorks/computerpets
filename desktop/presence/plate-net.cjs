"use strict";

/**
 * News RSS, market quotes, and Radio Find name the host in the plate before
 * the renderer calls main. Main fetches only when that same painted line is
 * on the IPC payload. A loopback URL stays on this computer.
 * News and quotes use the kid-plain weather-areas `plainNetLine` ("This
 * computer's internet address also goes to Google News, like visiting any
 * website."). Radio Find is in Rui's music block and keeps `clientNetLine`.
 * The path, the query, and the fragment stay off the line.
 */
const { clientNetLine, plainNetLine, PLAIN_NET_HEAD, PLAIN_NET_TAIL } = require("../renderer/weather-areas.js");

const NEWS_HOST = "Google News";
const RADIO_HOST = "the radio host";
const QUOTE_HOST = "CoinGecko";
const TERMINAL_HOST = "GeckoTerminal";
const STOCK_HOST = "Yahoo Finance";

const NEWS_LEAD = "This asks Google News, a news website, for headlines. It sends the topic you picked, if there is one.";
const RADIO_LEAD = "this find sends the station look-up.";
const QUOTE_LEAD = "This asks price websites for the prices on your saved list. It sends the names on that list.";
const LOOK_LEAD = "This asks CoinGecko, a price website, to find the name you typed. It sends what you typed.";
const LOCAL_STAYS = "this read stays on this computer.";

const LOOPBACK = new Set(["127.0.0.1", "localhost", "::1"]);

/** The two network-address sentence shapes. Same gate, different words. */
const PLAIN = { line: plainNetLine, head: PLAIN_NET_HEAD, tail: PLAIN_NET_TAIL };
const CLIENT = {
  line: clientNetLine,
  head: "this computer's network address goes with the https request to ",
  tail: ", as any client.",
};

const GATES = {
  news: { lead: NEWS_LEAD, host: NEWS_HOST, form: PLAIN },
  radio: { lead: RADIO_LEAD, host: RADIO_HOST, form: CLIENT },
  quote: { lead: QUOTE_LEAD, host: QUOTE_HOST, form: PLAIN },
  terminal: { lead: QUOTE_LEAD, host: TERMINAL_HOST, form: PLAIN },
  stock: { lead: QUOTE_LEAD, host: STOCK_HOST, form: PLAIN },
  look: { lead: LOOK_LEAD, host: QUOTE_HOST, form: PLAIN },
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
 * `form` is the sentence shape (kid-plain by default; radio passes the older one).
 * @param {unknown} shown
 * @param {string} hostLabel
 * @param {{ line: (host: string) => string, head: string, tail: string }} [form]
 */
function phraseNames(shown, hostLabel, form = PLAIN) {
  if (typeof shown !== "string" || !hostLabel) return false;
  if (shown.indexOf(form.line(hostLabel)) !== -1) return true;
  const head = form.head;
  const tail = form.tail;
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

function lineAllows(shown, hostLabel, lead, form = PLAIN) {
  if (typeof shown !== "string" || !lead || shown.indexOf(lead) === -1) return false;
  return phraseNames(shown, hostLabel, form);
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
  return lineAllows(shown, gate.host, gate.lead, gate.form);
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
  plainNetLine,
  isLoopbackUrl,
  phraseNames,
  lineAllows,
  mayFetch,
};
