// The last network consent lines (cloud talk, voice, license unlock and downloads, STUN) speak plain words and
// name the website, with the same gates; the warning colour is a named variable that passes WCAG AA; the
// last old-style plate words are gone; web gpu.ts says why it stays.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const require = createRequire(import.meta.url);
const lib = (rel) => import(pathToFileURL(join(root, "src", "lib", rel)).href);
const R = (name) => join(repo, "desktop", "renderer", name);
const JARGON = /https request|as any client|network address|license hash|signed bundle|the talk host|the voice host|STUN host|ice server|name the host/i;
const PLAIN_NET = /This computer's internet address (also )?goes to .+, like visiting any website\./;

function overlayMind() {
  const window = {
    PetWeatherAreas: require(R("weather-areas.js")),
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    URL, URLSearchParams, AbortController, setTimeout, clearTimeout,
    fetch: async () => ({ ok: true, json: async () => ({}) }),
  };
  window.window = window;
  vm.runInContext(readFileSync(R("mind.js"), "utf8"), vm.createContext(window));
  return window.PetMind;
}

test("cloud talk names the AI website in plain words, the same on web and overlay, with the same gate", async () => {
  const T = await lib("pets/talk-net.ts");
  const WA = await lib("pets/weather-areas.ts");
  const Mind = overlayMind();
  assert.equal(
    T.talkHonesty({ plugin: "xai" }),
    "This sends what you typed, your pet's name, and how hungry, happy, and rested it is to xAI, an AI website, so your pet can answer. It also sends your key for xAI, if you saved one. This computer's internet address also goes to xAI, like visiting any website.",
  );
  for (const plugin of ["xai", "openai", "anthropic", "google", "groq", "openrouter"]) {
    const line = T.talkHonesty({ plugin });
    assert.equal(Mind.talkHonesty({ plugin }), line, `${plugin} web and overlay`);
    assert.match(line, PLAIN_NET);
    assert.doesNotMatch(line, JARGON);
    assert.equal(T.talkMaySend({ plugin }, true), true);
    assert.equal(T.talkMaySend({ plugin }, false), false);
    assert.equal(Mind.talkMaySend({ plugin }, true), true);
  }
  const custom = { plugin: "custom", baseUrl: "https://my-ai.example.test/v1" };
  assert.match(T.talkHonesty(custom), /to my-ai\.example\.test, the AI website you set up, so your pet can answer\./);
  assert.equal(T.talkHonesty({ plugin: "local" }), "");
  assert.equal(T.talkHonesty({ plugin: "custom", baseUrl: "http://127.0.0.1:11434/v1" }), "");
  assert.equal(T.talkMayLeave(WA.plainNetLine("xAI"), { plugin: "xai" }), false, "the address sentence alone does not open talk");
});

test("cloud voice names the AI website and what it sends; the talk line does not open a voice send", async () => {
  const T = await lib("pets/talk-net.ts");
  const line = T.voiceHonesty("xai");
  assert.equal(
    line,
    "This sends the words your pet will say to xAI, an AI website, so it can turn them into a voice. It also sends your key for xAI, if you saved one. This computer's internet address also goes to xAI, like visiting any website.",
  );
  assert.match(T.voiceHonesty("openai"), /^This sends the words your pet will say to OpenAI, an AI website,/);
  assert.doesNotMatch(line, JARGON);
  assert.equal(T.voiceMayLeave(line, "xai"), true);
  assert.equal(T.voiceMayLeave(T.talkHonesty({ plugin: "xai" }), "xai"), false);
  assert.equal(T.voiceHonesty("browser"), "");
});

test("STUN names the helper website in plain words", async () => {
  const P = await lib("multiplayer/p2p.ts");
  const line = P.stunNetLine("stun.example.test");
  assert.equal(
    line,
    "This asks stun.example.test, a website that helps computers find each other, so you can play together. This computer's internet address goes to stun.example.test, like visiting any website.",
  );
  assert.doesNotMatch(line, JARGON);
});

test("license lines say what goes to the license and download websites, the same in main, the page, and the blotter", () => {
  require(R("weather-areas.js"));
  const page = require(R("license-net.js"));
  const main = require(join(repo, "desktop", "license", "license-net.cjs"));
  const py = readFileSync(join(repo, "client", "computerpets_client", "license", "license_net.py"), "utf8");
  const backend = "https://user:secret@license.example.test/api/verify?hwid=raw-id";
  const cdn = "https://cdn.example.test/bundles/pet.zip?sig=abc";
  const lines = {
    unlock: main.licenseHonesty(backend),
    download: main.downloadTalkHonesty(backend),
    bundle: main.bundleHonesty(cdn),
  };
  assert.equal(
    lines.unlock,
    "This asks license.example.test, the license website, to check your license. It sends what you typed for your license and a scrambled code made from this computer's ID. The ID itself stays here. This computer's internet address also goes to license.example.test, like visiting any website. A download tied to this computer sends that same code.",
  );
  assert.equal(
    lines.download,
    "This asks license.example.test, the license website, for your pet. It sends your saved license and the pass from unlocking. This computer's internet address also goes to license.example.test, like visiting any website. It does not send the code made from this computer's ID.",
  );
  assert.equal(
    lines.bundle,
    "This gets your pet's files from cdn.example.test, the download website, with the link the license website gave. This computer's internet address also goes to cdn.example.test, like visiting any website. It does not send the code made from this computer's ID.",
  );
  assert.equal(page.licenseHonesty(backend), lines.unlock);
  assert.equal(page.downloadTalkHonesty(backend), lines.download);
  assert.equal(page.bundleHonesty(cdn), lines.bundle);
  for (const k of ["LOCAL_STAYS", "DOWNLOAD_LOCAL", "BUNDLE_LOCAL", "BUNDLE_IDLE"]) {
    assert.equal(page[k], main[k], k);
    assert.ok(py.includes(`${k} = ${JSON.stringify(main[k])}`), `python ${k}`);
    assert.doesNotMatch(main[k], JARGON, k);
  }
  for (const [k, v] of Object.entries(lines)) {
    assert.doesNotMatch(v, JARGON, k);
    assert.equal(v.includes("secret") || v.includes("raw-id") || v.includes("sig=") || v.includes("/api"), false, k);
    const lead = v.slice(0, v.indexOf(" This computer's")).replace(/license\.example\.test|cdn\.example\.test/g, "{target['label']}");
    assert.ok(py.includes(lead), `python ${k} lead`);
  }
  assert.equal(main.licenseMaySend(backend, lines.unlock), true);
  assert.equal(main.downloadMayPost(backend, lines.unlock), false, "the unlock line does not open the unbound download");
  assert.equal(main.licenseMaySend(backend, lines.download), false, "the download line does not open the unlock");
  assert.equal(main.bundleMayFetch(cdn, main.plainNetLine("cdn.example.test")), false, "the address sentence alone does not open the bundle");
  const settings = readFileSync(R("settings.html"), "utf8");
  assert.ok(settings.includes(`id="licenseNet">${main.LOCAL_STAYS}</p>`));
  assert.ok(settings.includes(`id="bundleNet">${main.BUNDLE_IDLE}</p>`));
  assert.doesNotMatch(settings, /name the host before it leaves/);
});

function hex(h) {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}
function luminance([r, g, b]) {
  const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
const over = (rgb, alpha, under) => rgb.map((c, i) => alpha * c + (1 - alpha) * under[i]);

test("the warning colour is a named variable and passes WCAG AA on every card, light and dark", () => {
  const webCss = readFileSync(join(root, "src", "styles.css"), "utf8");
  const deskCss = readFileSync(R("styles.css"), "utf8");
  assert.doesNotMatch(webCss + deskCss, /#c79a5a/i);
  assert.match(webCss, /\.keeper-heartbeat\[data-heartbeat="DOWN"\] \{\s*color: var\(--color-warn\);/);
  assert.match(deskCss, /\.keeper-heartbeat\[data-heartbeat="DOWN"\] \{\s*color: var\(--color-warn\);/);
  const dark = webCss.match(/@theme \{[\s\S]*?--color-warn: (#[0-9a-f]{6});/i)[1];
  const paper = webCss.match(/\.paper-card \{[\s\S]*?--color-warn: (#[0-9a-f]{6});/i)[1];
  const desk = deskCss.match(/:root \{\s*--color-warn: (#[0-9a-f]{6});/i)[1];
  assert.equal(desk, dark, "overlay and web use the same dark warning colour");
  // Card and HUD backgrounds (see-through edges): check over black and over a white window behind the glass.
  const cards = { plain: [[12, 11, 10], 0.92], blotter: [[58, 48, 38], 0.94], moss: [[24, 36, 28], 0.94], ember: [[48, 28, 22], 0.94], dusk: [[28, 26, 42], 0.94], frost: [[28, 34, 40], 0.94] };
  for (const [name, [rgb, a]] of Object.entries(cards)) {
    for (const under of [[0, 0, 0], [255, 255, 255]]) {
      const ratio = contrast(hex(dark), over(rgb, a, under));
      assert.ok(ratio >= 4.5, `${name} over ${under[0] ? "white" : "black"}: ${ratio.toFixed(2)}`);
    }
  }
  assert.ok(contrast(hex(paper), hex("#e8dfd0")) >= 4.5, "light paper");
  assert.ok(contrast(hex("#c79a5a"), over([58, 48, 38], 0.94, [255, 255, 255])) < 4.5, "the old amber failed on blotter over a white window");
});

test("the last old-style plate words are plain on web and overlay", async () => {
  const WA = await lib("pets/weather-areas.ts");
  const N = await lib("pets/news.ts");
  const M = await lib("pets/market.ts");
  const OWA = require(R("weather-areas.js"));
  const ON = require(R("news.js"));
  const OM = require(R("market.js"));
  assert.equal(WA.FAVORITES_EMPTY, "Nothing saved yet. Tap ☆ next to a place to keep it here.");
  assert.equal(N.FAVORITES_EMPTY, "Nothing saved yet. Tap ☆ next to a headline or topic to keep it here.");
  assert.equal(M.FAVORITES_EMPTY, "Nothing saved yet. Tap ☆ next to a coin or NFT to keep it here.");
  assert.equal(OWA.FAVORITES_EMPTY, WA.FAVORITES_EMPTY);
  assert.equal(ON.FAVORITES_EMPTY, N.FAVORITES_EMPTY);
  assert.equal(OM.FAVORITES_EMPTY, M.FAVORITES_EMPTY);
  assert.equal(WA.FORECAST_WAITS, "open to see the weather");
  assert.equal(OWA.FORECAST_WAITS, WA.FORECAST_WAITS);
  assert.equal(OWA.FORECAST_LOOKING, WA.FORECAST_LOOKING);
  assert.equal(OM.PRICE_LOOKING, M.PRICE_LOOKING);
  assert.equal(OM.SEARCHING, M.SEARCHING);
  const ticker = { marketTickers: [{ symbol: "ETH", kind: "crypto", geckoId: "ethereum", name: "Ethereum" }] };
  assert.equal(M.plateLine(M.parseMarket(ticker), null, false, false), "ETH · getting the price…");
  assert.equal(OM.plateLine(OM.parseMarket(ticker), null, false, false), "ETH · getting the price…");
  const sources = [
    join(root, "src", "components", "desk", "desk-plates.tsx"),
    join(root, "src", "lib", "pets", "weather-areas.ts"),
    join(root, "src", "lib", "pets", "market.ts"),
    join(root, "src", "lib", "pets", "news.ts"),
    R("weather-areas.js"), R("market.js"), R("news.js"), R("desk-house.js"), R("pet.js"), R("index.html"),
  ];
  for (const f of sources) {
    const text = readFileSync(f, "utf8");
    assert.doesNotMatch(text, /looking up|forecast waits|No favorites yet/, f);
  }
});

test("web gpu.ts stays for parity and says so; no web page imports it", () => {
  const gpu = readFileSync(join(root, "src", "lib", "pets", "gpu.ts"), "utf8");
  assert.match(gpu, /Why this file stays although no web component imports it/);
  assert.match(gpu, /desktop\/renderer\/gpu\.js/);
  assert.match(gpu, /client\/computerpets_client\/gpu\.py/);
  const card = readFileSync(join(root, "src", "components", "desk", "keeper-card.tsx"), "utf8");
  assert.doesNotMatch(card, /pets\/gpu/);
});

test("the ADR index says the user-facing decisions in plain words", () => {
  const readme = readFileSync(join(repo, "docs", "adr", "README.md"), "utf8");
  assert.match(readme, /## In plain words: the ones you can see in the app/);
  assert.match(readme, /Nothing leaves without saying so first/);
  assert.match(readme, /a scrambled code\s+made from this computer's ID, never the ID itself/);
});
