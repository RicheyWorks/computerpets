// House lines is the mind for anyone not signed in, and for a fresh install with no pick. A signed-in keeper
// who picked nothing keeps the old default (xAI Grok, which still needs the house key). A pick is kept as is.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const S = await import(pathToFileURL(join(root, "src/lib/ai/settings.ts")).href);
const T = await import(pathToFileURL(join(root, "src/lib/ai/test-line.ts")).href);
const { nameListener } = await import(pathToFileURL(join(root, "src/lib/ai/listener.ts")).href);
const { bindTalkSpend } = await import(pathToFileURL(join(root, "src/lib/pets/talk-spend.ts")).href);
const KEY = "computerpets.mind.v1";

function memStore(seed) {
  const map = new Map(seed ? [[KEY, JSON.stringify(seed)]] : []);
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k), raw: map };
}
function install(seed) {
  const local = memStore(seed);
  globalThis.window = { localStorage: local, sessionStorage: memStore(), addEventListener() {}, removeEventListener() {} };
  S.resetMindStoreForTests();
  return local;
}

test("a fresh install picks nothing: House lines for a guest, the old default for a signed-in keeper", () => {
  install();
  const live = S.loadMindSettings();
  assert.equal(live.picked, false);
  assert.deepEqual(live.default, { plugin: "local" });
  assert.deepEqual(S.effectiveDefault(live, false), { plugin: "local" });
  assert.deepEqual(S.effectiveDefault(live, true), { plugin: "xai", model: "grok-4.5" });
  // Signed in, but the house has no key for it: House lines answer, so the page shows House lines.
  assert.deepEqual(S.effectiveDefault(live, true, false), { plugin: "local" });
  assert.deepEqual(S.bindingFor(live, "red_panda"), { plugin: "local" });
  assert.equal(S.askedBinding(live, "red_panda"), null);
});

test("a pick is kept exactly as before, for a guest and a signed-in keeper", async () => {
  const local = install();
  await S.saveMindSettings({ ...S.loadMindSettings(), picked: true, default: { plugin: "openai", model: "gpt-4.1-mini" } });
  assert.match(local.raw.get(KEY), /"picked":true/);
  S.resetMindStoreForTests();
  const live = S.loadMindSettings();
  assert.equal(live.picked, true);
  for (const signedIn of [false, true]) assert.deepEqual(S.effectiveDefault(live, signedIn), { plugin: "openai", model: "gpt-4.1-mini" });
  assert.equal(S.askedBinding(live, "red_panda").plugin, "openai");
  // Picking xAI Grok on purpose stays a pick too.
  await S.saveMindSettings({ ...live, picked: true, default: { plugin: "xai", model: "grok-4.5" } });
  S.resetMindStoreForTests();
  assert.equal(S.effectiveDefault(S.loadMindSettings(), false).plugin, "xai");
});

test("changing only the voice does not turn the default into a pick", async () => {
  install();
  await S.saveMindSettings({ ...S.loadMindSettings(), voice: "none" });
  S.resetMindStoreForTests();
  const live = S.loadMindSettings();
  assert.equal(live.voice, "none");
  assert.equal(live.picked, false);
  assert.equal(S.effectiveDefault(live, false).plugin, "local");
});

test("an older save of the stock xAI Grok default reads as no pick; any other older save is a pick", () => {
  install({ default: { plugin: "xai", model: "grok-4.5" }, voice: "browser", pets: {} });
  assert.equal(S.loadMindSettings().picked, false);
  assert.equal(S.effectiveDefault(S.loadMindSettings(), false).plugin, "local");
  install({ default: { plugin: "anthropic", model: "claude-sonnet-4-5" }, voice: "browser", pets: {} });
  assert.equal(S.loadMindSettings().picked, true);
  install({ default: { plugin: "xai", model: "grok-4-fast" }, voice: "browser", pets: {} });
  assert.equal(S.loadMindSettings().picked, true);
  install({ default: { plugin: "local" }, voice: "browser", pets: {} });
  assert.equal(S.effectiveDefault(S.loadMindSettings(), true).plugin, "local");
});

test("one animal's own mind still wins over the default", () => {
  install({ default: { plugin: "xai", model: "grok-4.5" }, voice: "browser", pets: { red_panda: { plugin: "ollama", model: "llama3.2" } } });
  const live = S.loadMindSettings();
  assert.equal(S.bindingFor(live, "red_panda").plugin, "ollama");
  assert.equal(S.askedBinding(live, "red_panda").plugin, "ollama");
  assert.equal(S.bindingFor(live, "cat").plugin, "local");
});

test("the house agrees: a guest gets House lines; a signed-in keeper with no pick gets xAI only with the house key", () => {
  assert.equal(bindTalkSpend({ mind: { plugin: "local" }, signedIn: false }, { XAI_API_KEY: "k" }).mind.plugin, "local");
  assert.equal(bindTalkSpend({ mind: { plugin: "xai" }, signedIn: false }, { XAI_API_KEY: "k" }).mind.plugin, "local");
  assert.equal(nameListener({ door: "desk", signedIn: true, houseKeys: { xai: true } }).id, "xai");
  assert.equal(nameListener({ door: "desk", signedIn: true, houseKeys: {} }).id, "local");
  assert.equal(nameListener({ door: "desk", signedIn: false, houseKeys: { xai: true } }).id, "local");
});

test("/mind shows the mind that will answer; the desk asks for it; a guest's AI pick says House lines answer", () => {
  const page = readFileSync(join(root, "src/routes/mind.tsx"), "utf8");
  assert.match(page, /const shown = effectiveDefault\(draft, signedIn, houseDefaultKey\);/);
  assert.match(page, /const active = shown\.plugin === preset\.id;/);
  assert.match(page, /readMindListener\(\{ data: \{\} \}\)/);
  assert.match(page, /picked: true,/);
  assert.match(page, /\{guestNote\(selected\.name\)\}/);
  assert.doesNotMatch(page, /draft\.default\./);
  assert.equal(T.guestNote("xAI Grok"), "xAI Grok only answers for a signed-in keeper. Until you sign in, House lines answer.");
  const room = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
  assert.match(room, /const mind = useMindBinding\(kind\.key, signedIn\);/);
  const card = readFileSync(join(root, "src/components/desk/keeper-card.tsx"), "utf8");
  assert.match(card, /const asked = useAskedBinding\(guestKey\);/);
});

test("/mind says which card answers in words: In use, or Picked while a guest's AI waits for sign-in", () => {
  const page = readFileSync(join(root, "src/routes/mind.tsx"), "utf8");
  const at = page.indexOf("MIND_PRESETS.map((preset)");
  const card = page.slice(at, page.indexOf("</section>", at));
  assert.match(card, /const active = shown\.plugin === preset\.id;/);
  assert.match(card, /aria-pressed=\{active\}/);
  assert.match(card, /data-mind-card=\{preset\.id\}/);
  assert.match(card, /\{active \? \(\n[^\n]*\n\s+<span data-mind-in-use[^>]*>\n\s+\{guestPickedAi \? "Picked" : "In use"\}/);
  assert.match(page, /const guestPickedAi = !isPending && !signedIn && selected\.kind !== "local";/);
});
