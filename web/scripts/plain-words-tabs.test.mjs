import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// Kid-plain words on the keeper card and desk plates (web and overlay), closed plate headers that point
// at the next step, and web plate tabs that rove like the overlay's.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const require = createRequire(import.meta.url);
const lib = (rel) => import(pathToFileURL(join(root, "src", "lib", ...rel.split("/"))).href);
const K = await lib("pets/keeper.ts");
const G = await lib("pets/gpu.ts");
const L = await lib("ai/listener.ts");
const WA = await lib("pets/weather-areas.ts");
const N = await lib("pets/news.ts");
const desk = (rel) => join(repo, "desktop", "renderer", rel);
const OK = require(desk("keeper.js"));
const OC = require(desk("card.js"));
const OG = require(desk("gpu.js"));
const OL = require(desk("listener.js"));
const OWA = require(desk("weather-areas.js"));
const ON = require(desk("news.js"));
const read = (...p) => readFileSync(join(...p), "utf8").replace(/\r\n/g, "\n");
const html = read(desk("index.html"));
const card = read(root, "src/components/desk/keeper-card.tsx");
const plates = read(root, "src/components/desk/desk-plates.tsx");
const deskHouse = read(desk("desk-house.js"));
const pet = read(desk("pet.js"));

/** Words a child should not meet on the card or a plate header. */
const JARGON = /\bunread\b|\bJava\b|\b808[01]\b|\/pet\/|\bdoor\b|\bDOWN\b|\bRSS\b|site:|\bmalformed\b/;
const shipped = (id) => (html.match(new RegExp(`id="${id}"[^>]*>([^<]*)<`)) || [])[1];

test("heartbeat: plain words on web and overlay; the port and profile only in the tooltip", () => {
  const up = K.parseHeartbeat({ status: "UP", profile: "local", uptimeSeconds: 125, port: 8081 });
  assert.equal(K.heartbeatLine(K.UNREAD_HEARTBEAT, false), "House server not running (optional)");
  assert.equal(K.heartbeatLine(up, true), "House server running · up 2m");
  assert.equal(K.heartbeatLine(K.parseHeartbeat({ status: "UP" }), true), "House server running");
  assert.equal(K.heartbeatLine(K.UNREAD_HEARTBEAT, true), "House server stopped answering (optional). Pets still work.");
  assert.equal(K.heartbeatDetail(up), "Java 8081 · UP · local · 2m");
  assert.equal(OK.HOUSE_SERVER_STOPPED, K.HOUSE_SERVER_STOPPED);
  assert.equal(OK.HOUSE_SERVER_UP, K.HOUSE_SERVER_UP);
  assert.equal(OK.houseServerLine({ show: true, reachable: true, seen: true, uptimeSeconds: 125 }), K.heartbeatLine(up, true));
  assert.equal(OK.houseServerLine({ show: true, reachable: false, seen: true }), K.HOUSE_SERVER_STOPPED);
  assert.equal(card.match(/data-heartbeat=\{heartbeatTone\(beat, heartbeatPoll\.answered\(\)\)\} title=\{heartbeatDetail\(beat\)\}/g)?.length, 2);
  assert.doesNotMatch(card, /Desk \{DESK_PORT\}|ADVERTISED_CARE\.feed/);
});

test("care and Turn off lines: plain words; the overlay still names its real restart, the web its Sit again", () => {
  assert.equal(K.careTruth(), "Your pet's care stays on this computer.");
  assert.equal(OK.careTruth(), K.careTruth());
  assert.equal(shipped("hud-truth"), K.careTruth());
  // The developer detail stays on the API answer the house server gives, not on the card.
  assert.equal(K.careDoorRefusal("feed").detail, "Care is local. /pet/feed is not a door.");
  assert.equal(K.QUIT_TRUTH, "Turns the pet off on this page. Press Sit again to bring them back.");
  assert.equal(OK.QUIT_TRUTH, "Turns the pets off. To bring them back, type .\\desktop.ps1 again, just like the first time. If Windows says running scripts is disabled, type powershell -ExecutionPolicy Bypass -File .\\desktop.ps1 instead.");
  assert.equal(OC.QUIT_TRUTH, OK.QUIT_TRUTH);
  assert.equal(shipped("hud-off-truth"), OK.QUIT_TRUTH);
  assert.match(card, /Sit again/);
});

test("GPU, listener, and forecast lines never say 'unread'; web, overlay, and index.html agree", () => {
  const mac = G.sampleFromProbe({ nvidiaCsv: "Apple M2, [N/A], 16, 542, [N/A], [N/A]" }, { platform: "darwin", nowMs: 1790000000000 });
  assert.equal(G.gpuLine(G.UNREAD_GPU), "GPU · no reading");
  assert.equal(G.gpuLine(mac), "GPU Apple M2 · — · 16% · 542 MiB/— · —");
  assert.equal(OG.gpuLine(mac), G.gpuLine(mac));
  assert.deepEqual({ ...OG.GPU_WORDS }, { ...G.GPU_WORDS });
  assert.equal(OG.GPU_NO_VALUE, G.GPU_NO_VALUE);
  assert.equal(shipped("hud-gpu-line"), G.gpuLine(G.UNREAD_GPU));
  assert.equal(L.UNREAD_LISTENER.line, "Listening · not sure");
  assert.equal(OL.UNREAD.line, L.UNREAD_LISTENER.line);
  assert.equal(L.UNREAD_LISTENER.id, "unread", "the id is not shown and stays");
  const seattle = WA.addArea(WA.blankAreas(), { name: "Seattle", lat: 47.6, lon: -122.3 });
  assert.equal(WA.plateLine(seattle, null, true), "Seattle · can't reach");
  assert.equal(OWA.plateLine(seattle, null, true), "Seattle · can't reach");
  assert.equal(WA.skyLabel("clear", 8, ""), "Sky not known · 8°");
  assert.equal(OWA.skyLabel("clear", 8, ""), "Sky not known · 8°");
  assert.equal(WA.dayLabel(null), "sky not known");
  assert.match(deskHouse, /liveBits\.push\(para\(`\$\{area\.name\} · \$\{A\.CANT_REACH \|\| "can't reach"\}`\)\)/);
  const lines = [
    G.gpuLine(G.UNREAD_GPU), G.gpuLine(mac), ...Object.values(G.GPU_WORDS), L.UNREAD_LISTENER.line,
    WA.plateLine(seattle, null, true), WA.skyLabel("clear", 8, ""), K.careTruth(), K.QUIT_TRUTH,
    K.heartbeatLine(K.UNREAD_HEARTBEAT, true), K.heartbeatLine(K.UNREAD_HEARTBEAT, false), N.TOPIC_TRUTH,
  ];
  assert.deepEqual(lines.filter((s) => JARGON.test(s)), []);
  assert.equal(N.TOPIC_TRUTH, ON.TOPIC_TRUTH);
  assert.match(html, new RegExp(N.TOPIC_TRUTH.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("closed weather and news headers point at opening the plate, like Quotes", () => {
  assert.equal(WA.NO_AREA_WAITS, "open to add a place");
  assert.equal(OWA.NO_AREA_WAITS, WA.NO_AREA_WAITS);
  assert.equal(WA.NO_AREA, "no place yet");
  assert.equal(WA.plateLine(WA.blankAreas(), null, false, false, false, true), "open to add a place");
  assert.equal(WA.plateLine(WA.blankAreas(), null), "no place yet", "open, the panel says what to type");
  assert.equal(OWA.plateLine(OWA.blankAreas(), null, false, false, false, true), WA.NO_AREA_WAITS);
  assert.equal(N.NEWS_WAITS, "open to see headlines");
  assert.equal(ON.NEWS_WAITS, N.NEWS_WAITS);
  assert.equal(N.newsLine([], false, true), "open to see headlines");
  assert.equal(N.newsLine([], false, false), "no headlines yet");
  assert.equal(N.newsLine([], true, true), "can't reach", "a failed read still says so");
  assert.equal(N.newsLine([{ title: "A real headline", url: "https://example.com" }], false, true), "A real headline");
  assert.equal(ON.newsLine([], false, true), N.NEWS_WAITS);
  assert.equal(shipped("weather-line"), WA.NO_AREA_WAITS);
  assert.equal(shipped("news-line"), N.NEWS_WAITS);
  assert.match(plates, /plateLine\(areas, live, unread, shownGate\.act === "hold", forecastWaiting, !open\)/);
  assert.match(plates, /: items, unread, !open\)\}/);
  assert.match(deskHouse, /line\.textContent = A\.plateLine\(areas, live, unread, held, waiting, !panelOpen\);/);
  assert.match(deskHouse, /line\.textContent = N\.newsLine\(items, unread, !newsBody \|\| newsBody\.hidden\);/);
  // Opening or closing the overlay news plate repaints its header.
  assert.match(pet, /if \(open\) fetchNews\(\);\n\s+\/\/ Repaint either way[^\n]*\n\s+paintHousePlates\(\);/);
});

test("web plate tabs: aria-selected without aria-pressed, one Tab stop, and the overlay's arrow keys", () => {
  const tabs = plates.split(/role="tab"\s/).slice(1).map((s) => s.slice(0, s.indexOf("onClick")));
  assert.equal(tabs.length, 2);
  for (const t of tabs) {
    assert.doesNotMatch(t, /aria-pressed/);
    assert.match(t, /aria-selected=\{tab === id\}/);
    assert.match(t, /tabIndex=\{tab === id \? 0 : -1\}/);
  }
  assert.equal(plates.match(/role="tablist" aria-label="(Weather|News) sections" onKeyDown=\{onPlateTabKey\}/g)?.length, 2);
  assert.match(plates, /function onPlateTabKey\(e: ReactKeyboardEvent<HTMLDivElement>\) \{\n\s+const tabs = \[\.\.\.e\.currentTarget\.querySelectorAll<HTMLButtonElement>\('\[role="tab"\]'\)\];\n\s+const next = tabKey\(e\.key, tabs\.indexOf\(e\.target as HTMLButtonElement\), tabs\.length\);\n\s+if \(next < 0\) return;\n\s+e\.preventDefault\(\);/);
  for (const key of ["ArrowRight", "ArrowLeft", "Home", "End", "ArrowUp", "ArrowDown", "Enter", " ", "Tab"]) {
    for (const at of [-1, 0, 1, 3]) assert.equal(K.tabKey(key, at, 4), OK.rovingIndex(key, at, 4), `${key} at ${at}`);
  }
  assert.equal(K.tabKey("ArrowRight", 3, 4), 0, "wraps");
  assert.equal(K.tabKey("ArrowDown", 1, 4), -1, "up and down stay with the page");
});
