"use strict";

// Minds window save: a Base URL talk would refuse is named before saving, and a mind.json
// that could not be written says "Not saved" instead of "Saved".
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const MIND_SRC = fs.readFileSync(path.join(__dirname, "mind.js"), "utf8");
const SETTINGS = fs.readFileSync(path.join(__dirname, "settings.html"), "utf8").replace(/\r\n/g, "\n");
const MAIN = fs.readFileSync(path.join(__dirname, "..", "main.cjs"), "utf8").replace(/\r\n/g, "\n");

function loadMind(desk) {
  const memory = () => {
    const m = new Map();
    return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
  };
  const window = {
    PetWeatherAreas: require("./weather-areas.js"),
    localStorage: memory(),
    sessionStorage: memory(),
    URL,
    URLSearchParams,
    AbortController,
    setTimeout,
    clearTimeout,
    desk,
  };
  window.window = window;
  vm.runInNewContext(MIND_SRC, window, { filename: "mind.js" });
  return window.PetMind;
}

test("baseUrlProblem names each Base URL talk would refuse, in plain words", () => {
  const M = loadMind();
  const cases = [
    ["xai", "api.x.ai/v1", /not a web address/],
    ["xai", "ftp://api.x.ai/v1", /not a web address/],
    ["openai", "https://me:hunter2@api.openai.com/v1", /name and password/],
    ["xai", "http://localhost:8080/v1", /only works with Ollama, LM Studio, or Custom/],
    ["openai", "http://api.openai.com/v1", /must start with https/],
    ["custom", "https://192.168.1.20/v1", /private network address/],
    ["custom", "https://10.0.0.5/v1", /private network address/],
  ];
  for (const [id, raw, want] of cases) {
    const problem = M.baseUrlProblem(raw, id);
    assert.match(problem, want, `${id} ${raw}: ${problem}`);
    assert.match(problem, /^[A-Z].*\.$/, "one whole sentence");
    // Talk agrees: the same mind would fall back to house lines (a name and password are stripped, never sent).
    if (!/name and password/.test(problem)) assert.equal(M.talkTarget({ plugin: id, baseUrl: raw }), null, `${id} ${raw} talk would still go`);
  }
  for (const [id, raw] of [
    ["xai", "https://api.x.ai/v1"],
    ["ollama", "http://127.0.0.1:11434/v1"],
    ["lmstudio", "http://localhost:1234/v1"],
    ["custom", "https://llm.example.com/v1"],
    ["local", "anything at all"],
    ["xai", ""],
  ]) {
    assert.equal(M.baseUrlProblem(raw, id), "", `${id} ${raw}`);
  }
  // Every preset's own base passes.
  for (const p of M.PRESETS) assert.equal(M.baseUrlProblem(p.base || "", p.id), "", p.id);
});

test("save reports saved:false when the desk refuses, and passes main's answer through", async () => {
  const refused = loadMind({ mindGet: () => null, mindSet: () => Promise.reject(new Error("ipc down")) });
  assert.deepEqual({ ...(await refused.save({ default: { plugin: "local" }, voice: "browser", pets: {} })) }, { kept: "none", saved: false });
  const notWritten = loadMind({ mindGet: () => null, mindSet: async () => ({ kept: "plain", saved: false }) });
  assert.deepEqual({ ...(await notWritten.save({ default: { plugin: "local" }, voice: "browser", pets: {} })) }, { kept: "plain", saved: false });
});

test("main writeMind says saved:false when mind.json could not be written", () => {
  const start = MAIN.indexOf("function writeMind(");
  const body = MAIN.slice(start, MAIN.indexOf("\n}\n", start));
  assert.match(body, /catch \{[\s\S]*saved: false \};/);
  assert.match(body, /return \{ kept: result\.kept, saved: true \};/);
});

test("the Minds window checks the Base URL before saving and never says Saved for an unwritten mind", () => {
  const start = SETTINGS.indexOf('document.getElementById("save").addEventListener');
  const body = SETTINGS.slice(start, SETTINGS.indexOf("\n      });", start));
  const check = body.indexOf("baseUrlProblem(base.value, plugin.value)");
  const save = body.indexOf("window.PetMind.save(s)");
  assert.ok(check > 0 && save > check, "the Base URL is checked before save");
  assert.match(body, /if \(problem\) \{\s*mindErr\.textContent = problem;\s*return;/);
  assert.match(body, /result\.saved === false\) \{[\s\S]{0,200}mindErr\.textContent = "Not saved\.[^"]*";\s*return;/);
  assert.ok(body.indexOf("paintKey(kept)") > body.indexOf("result.saved === false"), "an unwritten mind does not repaint the key line as if saved");
  assert.match(SETTINGS, /<p class="err" id="mindErr"><\/p>/);
});
