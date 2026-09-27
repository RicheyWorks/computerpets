import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const Connect = require(join(repo, "desktop/presence/connect-src.cjs"));

const overlayHtml = readFileSync(join(repo, "desktop/renderer/index.html"), "utf8");
const settingsHtml = readFileSync(join(repo, "desktop/renderer/settings.html"), "utf8");
const mindSrc = readFileSync(join(repo, "desktop/renderer/mind.js"), "utf8");
const listenerSrc = readFileSync(join(repo, "desktop/renderer/listener.js"), "utf8");
const newsJs = readFileSync(join(repo, "desktop/renderer/news.js"), "utf8");
const newsTs = readFileSync(join(root, "src/lib/pets/news.ts"), "utf8");
const marketJs = readFileSync(join(repo, "desktop/renderer/market.js"), "utf8");
const marketTs = readFileSync(join(root, "src/lib/pets/market.ts"), "utf8");
const musicJs = readFileSync(join(repo, "desktop/renderer/house-music.js"), "utf8");
const musicTs = readFileSync(join(root, "src/lib/pets/house-music.ts"), "utf8");
const weatherJs = readFileSync(join(repo, "desktop/renderer/weather-areas.js"), "utf8");
const weatherTs = readFileSync(join(root, "src/lib/pets/weather-areas.ts"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/ai/catalog.ts"), "utf8");
const voiceSrc = readFileSync(join(root, "src/lib/ai/voice.ts"), "utf8");
const talkSrc = readFileSync(join(root, "src/lib/pets/talk-net.ts"), "utf8");
const petSrc = readFileSync(join(repo, "desktop/renderer/pet.js"), "utf8");
const rootSrc = readFileSync(join(root, "src/routes/__root.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/routes/demo.$slug.tsx"), "utf8");
const moduleSrc = readFileSync(join(repo, "desktop/presence/connect-src.cjs"), "utf8");
const catalogPets = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");

function metaContent(html) {
  const match = html.match(/http-equiv="Content-Security-Policy"\s+content="([^"]+)"/);
  assert.ok(match, "missing CSP meta");
  return match[1];
}

function directive(policy, name) {
  const part = policy.split(";").map((s) => s.trim()).find((s) => s.startsWith(`${name} `) || s === name);
  assert.ok(part, name);
  return part.slice(name.length).trim();
}

function httpsHosts(source) {
  return [...source.matchAll(/https:\/\/([a-z0-9.-]+)/gi)].map((m) => m[1].toLowerCase());
}

function constHost(source, name) {
  const match = source.match(new RegExp(`(?:export )?const ${name} = "([^"]+)"`));
  assert.ok(match, name);
  return match[1];
}

function presetHosts(source) {
  return [...source.matchAll(/(?:base|defaultBaseUrl):\s*"https:\/\/([^"/]+)/g)].map((m) => m[1]);
}

function radioHosts(source) {
  const start = source.indexOf("RADIO_HOSTS");
  const end = source.indexOf("];", start);
  assert.ok(start !== -1 && end !== -1);
  return httpsHosts(source.slice(start, end));
}

test("overlay connect-src names the hardcoded house hosts and keeps one https: scheme", () => {
  const policy = metaContent(overlayHtml);
  assert.equal(policy, Connect.overlayCsp());
  const tokens = directive(policy, "connect-src").split(/\s+/);
  assert.deepEqual(
    tokens.filter((token) => token === "https:"),
    ["https:"],
  );
  assert.equal(Connect.KEEPER_CHOSEN_SCHEME, "https:");
  assert.match(Connect.SCHEME_REASON, /painted custom talk host/);
  assert.match(Connect.SCHEME_REASON, /redirect from a preset talk host/);
  const named = tokens.filter((token) => token.startsWith("https://")).map((token) => token.slice("https://".length));
  assert.deepEqual(named, [...Connect.FIXED_HOSTS]);
  assert.deepEqual(tokens.filter((token) => token.startsWith("http://")), [...Connect.LOOPBACK]);
  assert.equal(tokens.includes("*"), false);
  assert.equal(tokens.includes("http:"), false);
  assert.equal(directive(policy, "media-src"), Connect.MEDIA_SRC);
  assert.match(Connect.MEDIA_REASON, /station stream host/);
  assert.equal(directive(policy, "script-src"), "'self'");
  assert.equal(directive(policy, "default-src"), "'self'");
});

test("hardcoded talk, news, quote, radio, and weather hosts match the connect-src list", () => {
  const talk = presetHosts(mindSrc);
  assert.deepEqual(talk, presetHosts(listenerSrc));
  assert.deepEqual(talk, presetHosts(catalogSrc));
  assert.deepEqual(talk, [...Connect.TALK_HOSTS]);
  for (const host of httpsHosts(voiceSrc)) assert.ok(talk.includes(host), host);
  for (const host of httpsHosts(talkSrc)) assert.ok(talk.includes(host), host);

  assert.deepEqual(
    [constHost(newsJs, "NEWS_HOST"), constHost(newsJs, "TOPIC_HOST")],
    [...Connect.NEWS_HOSTS],
  );
  assert.deepEqual(
    [constHost(newsTs, "NEWS_HOST"), constHost(newsTs, "TOPIC_HOST")],
    [...Connect.NEWS_HOSTS],
  );
  assert.equal(constHost(newsJs, "X_HOST"), "x.com");
  assert.equal(Connect.FIXED_HOSTS.includes("x.com"), false);

  assert.deepEqual(
    [constHost(marketJs, "COINGECKO_HOST"), constHost(marketJs, "GECKO_TERMINAL_HOST"), constHost(marketJs, "YAHOO_HOST")],
    [...Connect.QUOTE_HOSTS],
  );
  assert.deepEqual(
    [constHost(marketTs, "COINGECKO_HOST"), constHost(marketTs, "GECKO_TERMINAL_HOST"), constHost(marketTs, "YAHOO_HOST")],
    [...Connect.QUOTE_HOSTS],
  );

  assert.deepEqual(radioHosts(musicJs), [...Connect.RADIO_HOSTS]);
  assert.deepEqual(radioHosts(musicTs), [...Connect.RADIO_HOSTS]);
  assert.equal(Connect.FIXED_HOSTS.includes("github.com"), false);

  assert.deepEqual(
    [constHost(weatherJs, "FORECAST_HOST"), constHost(weatherJs, "GEOCODE_HOST")],
    [...Connect.WEATHER_HOSTS],
  );
  assert.deepEqual(
    [constHost(weatherTs, "FORECAST_HOST"), constHost(weatherTs, "GEOCODE_HOST")],
    [...Connect.WEATHER_HOSTS],
  );

  const displayOnly = new Set(["github.com", "opensea.io", "blur.io", "magiceden.io", "rarible.com", "robinhood.com"]);
  const scanned = [
    mindSrc,
    listenerSrc,
    catalogSrc,
    voiceSrc,
    talkSrc,
    newsJs,
    newsTs,
    marketJs,
    marketTs,
    musicJs,
    musicTs,
    weatherJs,
    weatherTs,
  ].flatMap(httpsHosts);
  for (const host of scanned) {
    assert.equal(
      Connect.FIXED_HOSTS.includes(host) || displayOnly.has(host),
      true,
      host,
    );
  }
  const connect = directive(metaContent(overlayHtml), "connect-src");
  for (const host of displayOnly) assert.equal(connect.includes(host), false, host);
  assert.equal(connect.includes("stun.l.google.com"), false);
  assert.equal(connect.includes("fonts.googleapis.com"), false);
  assert.equal(connect.includes("fonts.gstatic.com"), false);
});

test("the overlay renderer fetches only painted cloud talk; the house-server probe runs in main", () => {
  const fetchers = readdirSync(join(repo, "desktop/renderer"))
    .filter((name) => name.endsWith(".js"))
    .filter((name) => readFileSync(join(repo, "desktop/renderer", name), "utf8").includes("fetch("));
  assert.deepEqual(fetchers.sort(), ["mind.js"]);
  assert.match(petSrc, /window\.desk\s*\.houseServer\(\)/);
  assert.doesNotMatch(petSrc, /https:\/\//);
  assert.ok(mindSrc.indexOf("function readTalk") < mindSrc.indexOf("fetch("));
  assert.match(mindSrc, /ADR 0048/);
  assert.match(talkSrc, /ADR 0048/);
  assert.equal(moduleSrc.includes("fetch("), false);
});

test("the minds window does not connect, and the desk document has no CSP", () => {
  const policy = metaContent(settingsHtml);
  assert.equal(policy, Connect.SETTINGS_CSP);
  assert.equal(directive(policy, "connect-src"), "'none'");
  assert.equal(policy.includes("https:"), false);
  assert.doesNotMatch(settingsHtml, /fetch\(/);
  assert.doesNotMatch(rootSrc, /Content-Security-Policy/);
  assert.doesNotMatch(demoSrc, /Content-Security-Policy/);
  const keys = [...catalogPets.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);
  assert.equal(keys.length, 221);
});
