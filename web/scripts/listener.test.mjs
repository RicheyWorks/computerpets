import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const L = await import(pathToFileURL(join(root, "src/lib/ai/listener.ts")).href);
const spend = await import(pathToFileURL(join(root, "src/lib/pets/talk-spend.ts")).href);

const card = readFileSync(join(root, "src/components/desk/keeper-card.tsx"), "utf8");
const readSrc = readFileSync(join(root, "src/lib/ai/listener-read.ts"), "utf8");
const postSrc = readFileSync(join(root, "src/lib/ai/listener-post.ts"), "utf8");
const catalog = readFileSync(join(root, "src/lib/ai/catalog.ts"), "utf8");
const deskListener = readFileSync(join(root, "..", "desktop/renderer/listener.js"), "utf8");
const post = await import(pathToFileURL(join(root, "src/lib/ai/listener-post.ts")).href);

const SECRET = "sk-live-DO-NOT-PAINT";
const PASTED = "pasted-key-VALUE-should-not-ride";
const PASTED_API = "pasted-api-key-VALUE-should-not-ride";

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
  assert.match(card, /listenerReadBody\(\{ plugin: askedPlugin, baseUrl: askedBase \}\)/);
  assert.match(card, /readMindListener\(\{ data: listenerReadBody\(\{ plugin: askedPlugin, baseUrl: askedBase \}\) \}\)/);
  assert.doesNotMatch(card, /apiKey: asked/);
  assert.match(postSrc, /\.strict\(\)/);
  assert.match(postSrc, /scrubSecretQueryString/);
  assert.match(postSrc, /secret-query\.mjs/);
  assert.doesNotMatch(postSrc, /SECRET_QUERY_NAMES/);
  assert.match(readSrc, /parseListenerRead/);
  assert.match(readSrc, /houseKeyFlags\(\)/);
  assert.match(readSrc, /signedIn: Boolean\(context\.userId\)/);
  assert.doesNotMatch(readSrc, /apiKey: data/);
  assert.equal(L.LISTENER_PRESETS.length, 14);
  for (const preset of L.LISTENER_PRESETS) {
    assert.match(catalog, new RegExp(`id: "${preset.id}"`));
    assert.match(deskListener, new RegExp(`id: "${preset.id}"`));
  }
});

test("a pasted key query on the saved listener base URL is not in the posted body", () => {
  const dirty = `https://example.test/v1beta?key=${PASTED}&api_key=${PASTED_API}&alt=sse#key=${PASTED}`;
  const body = post.listenerReadBody({ plugin: "google", baseUrl: dirty });
  const wire = JSON.stringify(body);
  assert.equal(wire.includes(PASTED), false);
  assert.equal(wire.includes(PASTED_API), false);
  assert.equal(wire.includes("key="), false);
  assert.equal(wire.includes("api_key="), false);
  assert.equal(body.plugin, "google");
  assert.equal(body.baseUrl, "https://example.test/v1beta?alt=sse");

  const keyOnly = post.listenerReadBody({
    plugin: "openai",
    baseUrl: `https://api.example.test/v1?key=${PASTED}`,
  });
  assert.equal(JSON.stringify(keyOnly).includes(PASTED), false);
  assert.equal(keyOnly.baseUrl, "https://api.example.test/v1");

  const apiKeyOnly = post.listenerReadBody({
    plugin: "openai",
    baseUrl: `https://api.example.test/v1?api_key=${PASTED_API}&alt=sse`,
  });
  assert.equal(JSON.stringify(apiKeyOnly).includes(PASTED_API), false);
  assert.equal(apiKeyOnly.baseUrl, "https://api.example.test/v1?alt=sse");

  const clean = post.listenerReadBody({
    plugin: "xai",
    baseUrl: "https://api.x.ai/v1?alt=sse#room",
  });
  assert.equal(clean.baseUrl, "https://api.x.ai/v1?alt=sse#room");
  assert.equal(clean.plugin, "xai");

  const token = "sk-test-PASTEDKEY0123456789";
  const userinfo = post.listenerReadBody({
    plugin: "openai",
    baseUrl: `https://user:${token}@api.example.test/v1/key/${token}?alt=sse`,
  });
  assert.equal(JSON.stringify(userinfo).includes(token), false);
  assert.equal(userinfo.baseUrl, "https://api.example.test/v1?alt=sse");
  const loose = post.listenerReadBody({ plugin: "custom", baseUrl: `not a url?api_key=${token}` });
  assert.equal(JSON.stringify(loose).includes(token), false);
  assert.equal(loose.baseUrl, "not a url");
  const modelPath = post.listenerReadBody({
    plugin: "google",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  });
  assert.equal(modelPath.baseUrl, "https://generativelanguage.googleapis.com/v1beta");
});

test("a pasted key query that still arrives is dropped before the house keeps the listener body", () => {
  const parsed = post.parseListenerRead({
    plugin: "google",
    baseUrl: `https://example.test/v1beta?key=${PASTED}&api_key=${PASTED_API}&alt=sse#key=${PASTED}`,
  });
  const wire = JSON.stringify(parsed);
  assert.equal(wire.includes(PASTED), false);
  assert.equal(wire.includes(PASTED_API), false);
  assert.equal(wire.includes("key="), false);
  assert.equal(wire.includes("api_key="), false);
  assert.equal(parsed.plugin, "google");
  assert.equal(parsed.baseUrl, "https://example.test/v1beta?alt=sse");
  assert.throws(() => post.parseListenerRead({ plugin: "xai", apiKey: SECRET, baseUrl: "https://api.x.ai/v1" }));
});
