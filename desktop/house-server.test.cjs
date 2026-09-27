const assert = require("node:assert/strict");
const { mkdtempSync, readFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { test } = require("node:test");
const H = require("./house-server.cjs");
const K = require("./renderer/keeper.js");

const htmlSrc = readFileSync(join(__dirname, "renderer", "index.html"), "utf8");
const petSrc = readFileSync(join(__dirname, "renderer", "pet.js"), "utf8");
const mainSrc = readFileSync(join(__dirname, "main.cjs"), "utf8");
const preloadSrc = readFileSync(join(__dirname, "preload.cjs"), "utf8");
const settingsSrc = readFileSync(join(__dirname, "renderer", "settings.html"), "utf8");
const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf8"));

function fakeFetch(answer) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    if (answer instanceof Error) throw answer;
    return answer;
  };
  return { calls, fetchImpl };
}

function jsonRes(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

const RAW_TOKENS = /unread|Java|8081|DOWN|ECONN|fetch failed/;

test("no backend URL and no license: the row is hidden and nothing is probed", async () => {
  assert.equal(H.target({}), null);
  assert.equal(H.target({ savedUrl: "", env: {}, licenseHeld: false, licenseBackendUrl: "http://127.0.0.1:8081" }), null);
  const { calls, fetchImpl } = fakeFetch(jsonRes(200, { status: "UP" }));
  const state = await H.houseServerState({ savedUrl: "", env: {}, licenseHeld: false, fetchImpl });
  assert.deepEqual(state, { show: false });
  assert.equal(calls.length, 0);
  assert.equal(K.houseServerLine(state), "");
  assert.equal(K.houseServerLine(undefined), "");
  assert.equal(K.houseServerTitle(state), "");
  assert.equal(K.poster("Rui", "grown", { hunger: 1, energy: 1, bond: 1 }).heartbeat, "");
});

test("a Backend URL saved in Settings is the one probed, not 127.0.0.1:8081", async () => {
  const { calls, fetchImpl } = fakeFetch(jsonRes(200, { status: "UP", profile: "prod", uptimeSeconds: 7200 }));
  const state = await H.houseServerState({ savedUrl: "https://house.example:9443/", env: {}, licenseHeld: false, fetchImpl, log: () => {} });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://house.example:9443/api/public/heartbeat");
  assert.equal(calls[0].init.cache, "no-store");
  assert.equal(state.show, true);
  assert.equal(state.host, "house.example:9443");
  assert.equal(state.from, "settings");
  assert.equal(state.reachable, true);
  assert.equal(K.houseServerLine(state), "House server · reachable · up 2h");
  assert.equal(K.houseServerTitle(state), "House server at house.example:9443");
});

test("the saved URL wins over the environment and the license; env and license still name a server", () => {
  const env = { COMPUTERPETS_BACKEND_URL: "http://env.example:8081" };
  assert.deepEqual(H.target({ savedUrl: "http://saved.example", env, licenseHeld: true, licenseBackendUrl: "http://lic.example" }), { base: "http://saved.example", from: "settings" });
  assert.deepEqual(H.target({ env, licenseHeld: true, licenseBackendUrl: "http://lic.example" }), { base: "http://env.example:8081", from: "env" });
  assert.deepEqual(H.target({ env: {}, licenseHeld: true, licenseBackendUrl: "http://lic.example/" }), { base: "http://lic.example", from: "license" });
  assert.deepEqual(H.target({ env: {}, licenseHeld: true }), { base: H.DEFAULT_BASE, from: "license" });
  assert.equal(H.target({ savedUrl: "ftp://nope", env: {} }), null);
  assert.equal(H.target({ savedUrl: "not a url", env: {} }), null);
});

test("an unreachable server says unreachable in plain words; the raw error goes to the log", async () => {
  const logged = [];
  const refused = new TypeError("fetch failed", { cause: Object.assign(new Error("connect ECONNREFUSED 10.0.0.9:8081"), { code: "ECONNREFUSED" }) });
  const { fetchImpl } = fakeFetch(refused);
  const state = await H.houseServerState({ savedUrl: "http://10.0.0.9:8081", fetchImpl, log: (line) => logged.push(line) });
  assert.equal(state.show, true);
  assert.equal(state.reachable, false);
  const line = K.houseServerLine(state);
  assert.equal(line, "House server · unreachable");
  assert.doesNotMatch(line, RAW_TOKENS);
  assert.match(logged.join("\n"), /ECONNREFUSED/);

  const http = await H.houseServerState({ savedUrl: "http://10.0.0.9:8081", fetchImpl: fakeFetch(jsonRes(503, {})).fetchImpl, log: () => {} });
  assert.equal(K.houseServerLine(http), "House server · unreachable");
});

test("a reachable server with no uptime still reads plainly, never 'unread'", async () => {
  const state = await H.houseServerState({ savedUrl: "http://127.0.0.1:8081", fetchImpl: fakeFetch(jsonRes(200, {})).fetchImpl });
  assert.equal(K.houseServerLine(state), "House server · reachable");
  assert.equal(K.formatUptime(null), "");
  for (const s of [state, { show: true, reachable: false }, { show: true }]) {
    assert.doesNotMatch(K.houseServerLine(s), /unread|Java|DOWN/);
  }
});

test("the Settings Backend URL is saved and cleared in house-server.json", () => {
  const dir = mkdtempSync(join(tmpdir(), "cp-house-server-"));
  try {
    assert.equal(H.readSaved(dir), "");
    assert.deepEqual(H.writeSaved(dir, " http://house.example:8081/ "), { ok: true, url: "http://house.example:8081" });
    assert.equal(H.readSaved(dir), "http://house.example:8081");
    const bad = H.writeSaved(dir, "javascript:alert(1)");
    assert.equal(bad.ok, false);
    assert.equal(bad.error.message, H.BAD_URL);
    assert.equal(H.readSaved(dir), "http://house.example:8081");
    assert.deepEqual(H.writeSaved(dir, ""), { ok: true, url: "" });
    assert.equal(H.readSaved(dir), "");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("the overlay row ships hidden and is painted from the main-process probe", () => {
  assert.match(htmlSrc, /<p id="hud-heartbeat" class="keeper-heartbeat" data-heartbeat="DOWN" hidden><\/p>/);
  assert.doesNotMatch(htmlSrc, /Java 8081 · DOWN · unread/);
  assert.doesNotMatch(petSrc, /fetch\(/);
  assert.match(petSrc, /window\.desk\s*\.houseServer\(\)/);
  assert.match(petSrc, /hudHeartbeat\.hidden = !serverLine/);
  assert.match(petSrc, /setInterval\(readHouseServer, 15_000\)/);
  assert.match(preloadSrc, /houseServer: \(\) => ipcRenderer\.invoke\("house-server-get"\)/);
  assert.match(preloadSrc, /houseServerSet:/);
  assert.match(mainSrc, /ipcMain\.handle\("house-server-get"/);
  assert.match(mainSrc, /savedUrl: HouseServer\.readSaved\(app\.getPath\("userData"\)\)/);
  assert.match(mainSrc, /ipcMain\.handle\("house-server-set"/);
  assert.match(settingsSrc, /window\.desk\.houseServerSet\(backend\.value\)/);
  assert.ok(pkg.build.files.includes("house-server.cjs"));
  assert.match(pkg.scripts.test, /house-server\.test\.cjs/);
});