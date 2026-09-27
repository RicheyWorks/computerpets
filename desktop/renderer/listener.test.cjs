const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const L = require("./listener.js");
const html = readFileSync(join(__dirname, "index.html"), "utf8");
const pet = readFileSync(join(__dirname, "pet.js"), "utf8");
const css = readFileSync(join(__dirname, "styles.css"), "utf8");

const SECRET = "sk-live-DO-NOT-PAINT";

test("overlay names a cloud mind only when hasKey is strictly true", () => {
  const heard = L.nameListener({ door: "overlay", plugin: "xai", hasKey: true, apiKey: SECRET });
  assert.equal(heard.line, "Listening · xAI Grok");
  assert.equal(heard.id, "xai");
  assert.equal(JSON.stringify(heard).includes(SECRET), false);

  const bare = L.nameListener({ door: "overlay", plugin: "xai" });
  assert.equal(bare.line, "Listening · House lines");

  const painted = L.nameListener({ door: "overlay", plugin: "openai", hasKey: SECRET });
  assert.equal(painted.id, "local");
  assert.equal(painted.line.includes(SECRET), false);
});

test("guests, the blotter, and unknown plugins stay House lines", () => {
  const guest = L.nameListener({
    door: "desk",
    plugin: "xai",
    signedIn: false,
    houseKeys: { xai: true },
    apiKey: SECRET,
  });
  assert.equal(guest.id, "local");
  assert.equal(JSON.stringify(guest).includes(SECRET), false);

  const blotter = L.nameListener({ door: "blotter", plugin: "xai", hasKey: true, houseKeys: { xai: true } });
  assert.equal(blotter.line, "Listening · House lines");

  const unknown = L.nameListener({ door: "overlay", plugin: SECRET, hasKey: true });
  assert.equal(unknown.id, "local");
  assert.equal(unknown.line.includes(SECRET), false);
});

test("a signed-in desk uses house key flags, not a client key string", () => {
  const yes = L.nameListener({ door: "desk", plugin: "xai", signedIn: true, houseKeys: { xai: true } });
  assert.equal(yes.line, "Listening · xAI Grok");

  const no = L.nameListener({
    door: "desk",
    plugin: "xai",
    signedIn: true,
    houseKeys: { xai: SECRET },
    hasKey: true,
  });
  assert.equal(no.id, "local");
  assert.equal(no.line.includes(SECRET), false);

  const implied = L.nameListener({ door: "desk", signedIn: true, houseKeys: { xai: true } });
  assert.equal(implied.id, "xai");
});

test("local plugins are named only when the URL is safe, and the URL stays off the line", () => {
  assert.equal(L.nameListener({ door: "overlay", plugin: "ollama" }).line, "Listening · Ollama");
  const custom = L.nameListener({
    door: "overlay",
    plugin: "custom",
    baseUrl: "https://mind.example/hook?token=" + SECRET,
  });
  assert.equal(custom.line, "Listening · Custom webhook");
  assert.equal(custom.line.includes(SECRET), false);
  assert.equal(JSON.stringify(custom).includes(SECRET), false);

  const meta = L.nameListener({ door: "overlay", plugin: "custom", baseUrl: "http://169.254.169.254/latest" });
  assert.equal(meta.id, "local");
  assert.equal(meta.line.includes("169.254"), false);

  const userinfo = L.nameListener({ door: "overlay", plugin: "ollama", baseUrl: "http://user:" + SECRET + "@127.0.0.1:11434" });
  assert.equal(userinfo.id, "local");
  assert.equal(userinfo.line.includes(SECRET), false);
});

test("presentListener drops extra fields and refuses a forged line", () => {
  const ok = L.presentListener({ id: "local", name: "House lines", line: "Listening · House lines" });
  assert.equal(ok.id, "local");
  const leaked = L.presentListener({ id: "xai", name: "xAI Grok", line: "Listening · xAI Grok", apiKey: SECRET });
  assert.equal(leaked.id, "unread");
  assert.equal(JSON.stringify(leaked).includes(SECRET), false);
  const forged = L.presentListener({ id: "xai", name: "xAI Grok", line: "Listening · " + SECRET });
  assert.equal(forged.line, "Listening · not sure");
});

test("the overlay card paints the listener and does not write the key into the DOM", () => {
  assert.match(html, /id="hud-listener"/);
  assert.match(html, /Listening · House lines/);
  assert.match(html, /listener\.js/);
  assert.match(pet, /PetListener\.nameListener/);
  assert.match(pet, /hasKey: key\.length > 0/);
  assert.match(pet, /hudListener\.textContent = heard\.line/);
  assert.doesNotMatch(pet, /hudListener\.textContent = binding\.apiKey/);
  assert.doesNotMatch(pet, /data-listener", binding\.apiKey/);
  assert.match(css, /\.keeper-listener/);
  assert.equal(L.PRESETS.length, 14);
});
