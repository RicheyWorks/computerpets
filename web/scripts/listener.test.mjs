import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const L = await import(join(root, "src/lib/ai/listener.ts"));
const spend = await import(join(root, "src/lib/pets/talk-spend.ts"));

const card = readFileSync(join(root, "src/components/desk/keeper-card.tsx"), "utf8");
const readSrc = readFileSync(join(root, "src/lib/ai/listener-read.ts"), "utf8");
const catalog = readFileSync(join(root, "src/lib/ai/catalog.ts"), "utf8");
const deskListener = readFileSync(join(root, "..", "desktop/renderer/listener.js"), "utf8");

const SECRET = "sk-live-DO-NOT-PAINT";

test("desk guests are House lines even when the saved plugin is xAI", () => {
  const heard = L.nameListener({
    door: "desk",
    plugin: "xai",
    signedIn: false,
    houseKeys: { xai: true },
    hasKey: true,
  });
  assert.equal(heard.line, "Listening · House lines");
  assert.equal(JSON.stringify(heard).includes(SECRET), false);
});

test("a signed-in desk names the cloud plugin only when the house flag is true", () => {
  const yes = L.nameListener({ door: "desk", plugin: "anthropic", signedIn: true, houseKeys: { anthropic: true } });
  assert.equal(yes.line, "Listening · Anthropic");
  const no = L.nameListener({ door: "desk", plugin: "anthropic", signedIn: true, houseKeys: { anthropic: false }, hasKey: true });
  assert.equal(no.id, "local");
  const implied = L.nameListener({ door: "desk", signedIn: true, houseKeys: { xai: true } });
  assert.equal(implied.id, "xai");
  const quiet = L.nameListener({ door: "desk", signedIn: true, houseKeys: {} });
  assert.equal(quiet.id, "local");
});

test("houseKeyFlags are booleans and do not copy the secret", () => {
  const flags = spend.houseKeyFlags({ XAI_API_KEY: SECRET, OPENAI_API_KEY: "  ", GEMINI_API_KEY: "" });
  assert.equal(flags.xai, true);
  assert.equal(flags.openai, false);
  assert.equal(flags.google, false);
  assert.equal(JSON.stringify(flags).includes(SECRET), false);
  const heard = L.nameListener({ door: "desk", plugin: "xai", signedIn: true, houseKeys: flags });
  assert.equal(heard.line, "Listening · xAI Grok");
  assert.equal(JSON.stringify(heard).includes(SECRET), false);
});

test("the line never carries a URL, a model, or an unknown plugin id", () => {
  const custom = L.nameListener({
    door: "overlay",
    plugin: "custom",
    baseUrl: `https://hooks.example/mind?token=${SECRET}`,
    hasKey: true,
  });
  assert.equal(custom.line, "Listening · Custom webhook");
  assert.equal(JSON.stringify(custom).includes(SECRET), false);
  const meta = L.nameListener({ door: "desk", plugin: "ollama", signedIn: true, baseUrl: "http://169.254.169.254/" });
  assert.equal(meta.id, "local");
  const unknown = L.nameListener({ door: "overlay", plugin: SECRET, hasKey: true });
  assert.equal(unknown.line.includes(SECRET), false);
  const blotter = L.nameListener({ door: "blotter", plugin: "xai", hasKey: true, signedIn: true, houseKeys: { xai: true } });
  assert.equal(blotter.line, "Listening · House lines");
});

test("presentListener refuses a payload that smuggles a key", () => {
  const leaked = L.presentListener({ id: "xai", name: "xAI Grok", line: "Listening · xAI Grok", apiKey: SECRET });
  assert.equal(leaked.id, "unread");
  assert.equal(JSON.stringify(leaked).includes(SECRET), false);
  const ok = L.presentListener(L.nameListener({ door: "overlay", plugin: "ollama" }));
  assert.equal(ok.line, "Listening · Ollama");
});

test("the keeper card asks the server without sending a key", () => {
  assert.match(card, /keeper-listener/);
  assert.match(card, /UNREAD_LISTENER/);
  assert.match(card, /readMindListener\(\{ data: \{ plugin: askedPlugin, baseUrl: askedBase \} \}\)/);
  assert.doesNotMatch(card, /apiKey: asked/);
  assert.match(readSrc, /\.strict\(\)/);
  assert.match(readSrc, /houseKeyFlags\(\)/);
  assert.match(readSrc, /signedIn: Boolean\(context\.userId\)/);
  assert.doesNotMatch(readSrc, /apiKey: data/);
  assert.equal(L.LISTENER_PRESETS.length, 14);
  for (const preset of L.LISTENER_PRESETS) {
    assert.match(catalog, new RegExp(`id: "${preset.id}"`));
    assert.match(deskListener, new RegExp(`id: "${preset.id}"`));
  }
});
