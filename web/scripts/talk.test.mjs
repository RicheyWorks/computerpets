import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const T = await import(pathToFileURL(join(root, "src/lib/pets/talk-spend.ts")).href);
const P = await import(pathToFileURL(join(root, "src/lib/pets/talk-post.ts")).href);
const C = await import(pathToFileURL(join(root, "src/lib/pets/care.ts")).href);

const talkSrc = readFileSync(join(root, "src/lib/pets/talk.ts"), "utf8");
const spendSrc = readFileSync(join(root, "src/lib/pets/talk-spend.ts"), "utf8");
const postSrc = readFileSync(join(root, "src/lib/pets/talk-post.ts"), "utf8");
const safeUrlSrc = readFileSync(join(root, "src/lib/ai/safe-url.ts"), "utf8");
const secretQuerySrc = readFileSync(join(root, "src/lib/ai/secret-query.mjs"), "utf8");
const mindPageSrc = readFileSync(join(root, "src/routes/mind.tsx"), "utf8");
const overlayMind = readFileSync(join(repo, "desktop/renderer/mind.js"), "utf8");
const overlayMindFile = readFileSync(join(repo, "desktop/mind-secret.cjs"), "utf8");
const overlayPet = readFileSync(join(repo, "desktop/renderer/pet.js"), "utf8");
const speciesSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const deskSrc = readFileSync(join(root, "src/components/desk/desk-stage.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const hatchSrc = readFileSync(join(root, "src/routes/hatch.tsx"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const kennelSrc = readFileSync(join(root, "src/routes/collection.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/routes/catalog.tsx"), "utf8");
const petSrc = readFileSync(join(root, "src/routes/pets.$key.tsx"), "utf8");

const HOUSE = {
  XAI_API_KEY: "HOUSE_XAI",
  OPENAI_API_KEY: "HOUSE_OAI",
};

const now = 1_700_000_000_000;
const DAY = 86400000;

test("unsigned xai does not spend the house key", () => {
  const out = T.bindTalkSpend({ mind: { plugin: "xai" }, voice: "xai", signedIn: false }, HOUSE);
  assert.equal(out.mind.plugin, "local");
  assert.equal(out.mind.apiKey, undefined);
  assert.equal(out.voice, "browser");
  assert.equal(out.voiceKey, undefined);
});

test("unsigned mind that would have fallen through to env stays quiet", () => {
  const bare = T.bindTalkSpend({ signedIn: false }, HOUSE);
  assert.equal(bare.mind.plugin, "local");
  assert.equal(bare.mind.apiKey, undefined);
  assert.equal(bare.voiceKey, undefined);

  const emptyKey = T.bindTalkSpend(
    { mind: { plugin: "openai", apiKey: "" }, voice: "openai", signedIn: false },
    HOUSE,
  );
  assert.equal(emptyKey.mind.plugin, "local");
  assert.equal(emptyKey.mind.apiKey, undefined);
  assert.equal(emptyKey.voiceKey, undefined);
});

test("client apiKey cannot unlock XAI_API_KEY or OPENAI_API_KEY", () => {
  const guest = T.bindTalkSpend(
    { mind: { plugin: "xai", apiKey: "sk-attacker" }, voice: "openai", signedIn: false },
    HOUSE,
  );
  assert.equal(guest.mind.plugin, "local");
  assert.equal(guest.mind.apiKey, undefined);
  assert.equal(guest.voiceKey, undefined);
  assert.notEqual(guest.mind.apiKey, HOUSE.XAI_API_KEY);
  assert.notEqual(guest.voiceKey, HOUSE.OPENAI_API_KEY);

  const keeper = T.bindTalkSpend(
    { mind: { plugin: "openai", apiKey: "sk-attacker" }, voice: "xai", signedIn: true },
    HOUSE,
  );
  assert.equal(keeper.mind.plugin, "openai");
  assert.equal(keeper.mind.apiKey, HOUSE.OPENAI_API_KEY);
  assert.notEqual(keeper.mind.apiKey, "sk-attacker");
  assert.equal(keeper.voiceKey, HOUSE.XAI_API_KEY);
  assert.notEqual(keeper.voiceKey, "sk-attacker");
});

test("signed-in talk still spends the house key", () => {
  const grok = T.bindTalkSpend({ mind: { plugin: "xai" }, voice: "browser", signedIn: true }, HOUSE);
  assert.equal(grok.mind.plugin, "xai");
  assert.equal(grok.mind.apiKey, HOUSE.XAI_API_KEY);
  assert.equal(grok.voice, "browser");
  assert.equal(grok.voiceKey, undefined);

  const implied = T.bindTalkSpend({ signedIn: true }, HOUSE);
  assert.equal(implied.mind.plugin, "xai");
  assert.equal(implied.mind.apiKey, HOUSE.XAI_API_KEY);
});

test("unsigned talk does not read process.env house keys", () => {
  const prevX = process.env.XAI_API_KEY;
  const prevO = process.env.OPENAI_API_KEY;
  process.env.XAI_API_KEY = "PROCESS_XAI";
  process.env.OPENAI_API_KEY = "PROCESS_OAI";
  try {
    const out = T.bindTalkSpend({ mind: { plugin: "xai" }, voice: "xai", signedIn: false });
    assert.equal(out.mind.plugin, "local");
    assert.equal(out.mind.apiKey, undefined);
    assert.equal(out.voiceKey, undefined);
    assert.notEqual(out.mind.apiKey, process.env.XAI_API_KEY);
    assert.notEqual(out.voiceKey, process.env.OPENAI_API_KEY);
  } finally {
    if (prevX === undefined) delete process.env.XAI_API_KEY;
    else process.env.XAI_API_KEY = prevX;
    if (prevO === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = prevO;
  }
});

const SECRET = "sk-talk-post-secret";

test("house talk body never carries apiKey", () => {
  const body = P.talkBody({
    message: "hello",
    hunger: 70,
    mood: 72,
    energy: 68,
    hygiene: 80,
    name: "Rui",
    species: "red_panda",
    speak: false,
    mind: {
      plugin: "xai",
      model: "grok-4.5",
      baseUrl: "https://api.x.ai/v1",
      apiKey: SECRET,
    },
    voice: "none",
  });
  const wire = JSON.stringify(body);
  assert.equal(wire.includes(SECRET), false);
  assert.equal(wire.includes("apiKey"), false);
  assert.equal(Object.hasOwn(body, "apiKey"), false);
  assert.equal(Object.hasOwn(body.mind, "apiKey"), false);
  assert.deepEqual(body.mind, {
    plugin: "xai",
    model: "grok-4.5",
    baseUrl: "https://api.x.ai/v1",
  });
  assert.deepEqual(Object.keys(P.mindForHouse({ plugin: "openai", apiKey: SECRET })).sort(), ["plugin"]);
});

const PASTED = "pasted-key-VALUE-should-not-ride";
const PASTED_API = "pasted-api-key-VALUE-should-not-ride";
const SECRET_QUERY = [
  "key",
  "api_key",
  "api-key",
  "apikey",
  "access_token",
  "refresh_token",
  "id_token",
  "token",
  "secret",
  "client_secret",
  "x-goog-api-key",
  "x-api-key",
  "auth",
  "authorization",
  "bearer",
];

function pastedBase(originPath) {
  const url = new URL(originPath);
  for (const name of SECRET_QUERY) {
    url.searchParams.set(name, name === "api_key" ? PASTED_API : `${PASTED}-${name}`);
  }
  url.searchParams.set("alt", "sse");
  url.hash = `key=${PASTED}`;
  return url.toString();
}

test("a pasted key query on the base URL is not in the posted talk body", () => {
  const dirty = pastedBase("https://example.test/v1beta");
  const body = P.talkBody({
    message: "hello key",
    hunger: 70,
    mood: 72,
    energy: 68,
    hygiene: 80,
    name: "Rui",
    species: "red_panda",
    speak: false,
    mind: {
      plugin: "google",
      model: "gemini-2.5-flash",
      baseUrl: dirty,
      apiKey: SECRET,
    },
    voice: "none",
  });
  const wire = JSON.stringify(body);
  assert.equal(wire.includes(PASTED), false);
  assert.equal(wire.includes(PASTED_API), false);
  assert.equal(wire.includes(SECRET), false);
  assert.equal(wire.includes("apiKey"), false);
  assert.equal(body.message, "hello key");
  assert.equal(body.hunger, 70);
  assert.equal(body.mind.model, "gemini-2.5-flash");
  assert.equal(body.mind.plugin, "google");
  assert.equal(body.mind.baseUrl, "https://example.test/v1beta?alt=sse");
  assert.equal(body.mind.baseUrl.includes("key="), false);
  assert.equal(body.mind.baseUrl.includes("api_key="), false);

  const keyOnly = P.talkBody({
    hunger: 1,
    mood: 2,
    energy: 3,
    name: "Rui",
    species: "red_panda",
    mind: { plugin: "openai", baseUrl: `https://api.example.test/v1?key=${PASTED}` },
  });
  assert.equal(JSON.stringify(keyOnly).includes(PASTED), false);
  assert.equal(keyOnly.mind.baseUrl, "https://api.example.test/v1");

  const apiKeyOnly = P.talkBody({
    hunger: 1,
    mood: 2,
    energy: 3,
    name: "Rui",
    species: "red_panda",
    mind: { plugin: "openai", baseUrl: `https://api.example.test/v1?api_key=${PASTED_API}&alt=sse` },
  });
  assert.equal(JSON.stringify(apiKeyOnly).includes(PASTED_API), false);
  assert.equal(apiKeyOnly.mind.baseUrl, "https://api.example.test/v1?alt=sse");

  const clean = P.talkBody({
    hunger: 1,
    mood: 2,
    energy: 3,
    name: "Rui",
    species: "red_panda",
    mind: { plugin: "xai", model: "grok-4.5", baseUrl: "https://api.x.ai/v1?alt=sse#room" },
  });
  assert.equal(clean.mind.baseUrl, "https://api.x.ai/v1?alt=sse#room");
  assert.equal(clean.mind.model, "grok-4.5");

  const token = "sk-test-PASTEDKEY0123456789";
  const userinfo = P.talkBody({
    hunger: 1,
    mood: 2,
    energy: 3,
    name: "Rui",
    species: "red_panda",
    mind: { plugin: "openai", baseUrl: `https://user:${token}@api.example.test/v1/key/${token}` },
  });
  assert.equal(JSON.stringify(userinfo).includes(token), false);
  assert.equal(userinfo.mind.baseUrl, "https://api.example.test/v1");
  const loose = P.talkBody({
    hunger: 1,
    mood: 2,
    energy: 3,
    name: "Rui",
    species: "red_panda",
    mind: { plugin: "custom", baseUrl: `not a url?key=${token}&alt=sse` },
  });
  assert.equal(JSON.stringify(loose).includes(token), false);
  assert.equal(loose.mind.baseUrl, "not a url?alt=sse");
  const modelPath = P.talkBody({
    hunger: 1,
    mood: 2,
    energy: 3,
    name: "Rui",
    species: "red_panda",
    mind: { plugin: "google", model: "gemini-2.5-flash", baseUrl: "https://example.test/v1beta/models/gemini-2.5-flash" },
  });
  assert.equal(modelPath.mind.baseUrl, "https://example.test/v1beta/models/gemini-2.5-flash");
  assert.equal(modelPath.mind.model, "gemini-2.5-flash");
});

test("a pasted key query that still arrives is dropped before the house keeps the talk body", () => {
  const parsed = P.parseTalkBody({
    message: "hello",
    hunger: 70,
    mood: 72,
    energy: 68,
    mind: {
      plugin: "google",
      model: "gemini-2.5-flash",
      apiKey: SECRET,
      baseUrl: `https://example.test/v1beta?key=${PASTED}&api_key=${PASTED_API}&alt=sse#key=${PASTED}`,
    },
  });
  const wire = JSON.stringify(parsed);
  assert.equal(wire.includes(PASTED), false);
  assert.equal(wire.includes(PASTED_API), false);
  assert.equal(wire.includes(SECRET), false);
  assert.equal(wire.includes("apiKey"), false);
  assert.equal(parsed.message, "hello");
  assert.equal(parsed.mind.model, "gemini-2.5-flash");
  assert.equal(parsed.mind.baseUrl, "https://example.test/v1beta?alt=sse");
});

test("a posted apiKey is dropped before the house spends it", () => {
  const parsed = P.parseTalkBody({
    apiKey: SECRET,
    message: "hello",
    hunger: 70,
    mood: 72,
    energy: 68,
    mind: { plugin: "xai", model: "grok-4.5", apiKey: SECRET },
    voice: "xai",
  });
  const wire = JSON.stringify(parsed);
  assert.equal(wire.includes(SECRET), false);
  assert.equal(wire.includes("apiKey"), false);
  assert.equal(Object.hasOwn(parsed, "apiKey"), false);
  assert.equal(Object.hasOwn(parsed.mind, "apiKey"), false);
  assert.equal(parsed.mind.plugin, "xai");
  assert.equal(parsed.mind.model, "grok-4.5");
});

test("desk talk drops a pasted secret model and keeps a normal model id", () => {
  const token = "sk-test-PASTEDKEY0123456789";
  const opaque = "AbCdEfGh1234567890IjKlMnOp1234567890";
  const posted = P.talkBody({
    message: "hello",
    hunger: 70,
    mood: 72,
    energy: 68,
    name: "Rui",
    species: "red_panda",
    mind: { plugin: "openai", model: token, baseUrl: "https://api.openai.com/v1" },
  });
  assert.equal(JSON.stringify(posted).includes(token), false);
  assert.equal(posted.mind.model, undefined);
  assert.equal(posted.mind.plugin, "openai");
  assert.equal(posted.mind.baseUrl, "https://api.openai.com/v1");

  const parsed = P.parseTalkBody({
    message: "hello",
    hunger: 70,
    mood: 72,
    energy: 68,
    mind: {
      plugin: "google",
      model: `gemini-2.5-flash?api_key=${token}`,
      baseUrl: "https://example.test/v1beta",
    },
  });
  assert.equal(JSON.stringify(parsed).includes(token), false);
  assert.equal(parsed.mind.model, undefined);
  assert.equal(parsed.mind.baseUrl, "https://example.test/v1beta");

  const kept = P.parseTalkBody({
    message: "hello",
    hunger: 70,
    mood: 72,
    energy: 68,
    mind: {
      plugin: "together",
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      baseUrl: "https://api.together.xyz/v1",
    },
  });
  assert.equal(kept.mind.model, "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo");
  const ordinary = P.talkBody({
    message: "hello",
    hunger: 70,
    mood: 72,
    energy: 68,
    name: "Rui",
    species: "red_panda",
    mind: { plugin: "anthropic", model: "claude-sonnet-4-5" },
  });
  assert.equal(ordinary.mind.model, "claude-sonnet-4-5");
  const long = P.talkBody({
    message: "hello",
    hunger: 70,
    mood: 72,
    energy: 68,
    name: "Rui",
    species: "red_panda",
    mind: { plugin: "openai", model: `key=${opaque}` },
  });
  assert.equal(JSON.stringify(long).includes(opaque), false);
  assert.equal(long.mind.model, undefined);
});

test("desk and overlay talk do not put apiKey on a house body or query", () => {
  assert.match(postSrc, /delete copy\.apiKey/);
  assert.match(postSrc, /delete mindCopy\.apiKey/);
  assert.match(postSrc, /scrubSecretQueryString/);
  assert.match(postSrc, /secret-query\.mjs/);
  assert.doesNotMatch(postSrc, /SECRET_QUERY_NAMES/);
  assert.match(safeUrlSrc, /secret-query\.mjs/);
  assert.doesNotMatch(safeUrlSrc, /SECRET_QUERY_NAMES/);
  assert.match(secretQuerySrc, /export function scrubSecretQueryString/);
  assert.match(secretQuerySrc, /export function stripSecretQuery/);
  assert.match(secretQuerySrc, /SECRET_QUERY_NAMES/);
  const sharedBlock = secretQuerySrc.slice(
    secretQuerySrc.indexOf("export const SECRET_QUERY_NAMES"),
    secretQuerySrc.indexOf("export function isSecretQueryName"),
  );
  const sharedNames = [...sharedBlock.matchAll(/"([a-z_]+)"/g)].map((m) => m[1]);
  const overlayBlock = overlayMind.slice(
    overlayMind.indexOf("const SECRET_QUERY_NAMES"),
    overlayMind.indexOf("function isSecretQueryName"),
  );
  const overlayNames = [...overlayBlock.matchAll(/"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(overlayNames, sharedNames);
  const diskBlock = overlayMindFile.slice(
    overlayMindFile.indexOf("const SECRET_QUERY_NAMES"),
    overlayMindFile.indexOf("function isSecretQueryName"),
  );
  const diskNames = [...diskBlock.matchAll(/"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(diskNames, sharedNames);
  assert.match(overlayMind, /scrubSecretQueryString/);
  assert.match(overlayMindFile, /scrubSecretQueryString/);
  assert.match(overlayMindFile, /baseUrlsNeedRewrite/);
  assert.doesNotMatch(postSrc, /apiKey:\s*z\./);
  assert.doesNotMatch(postSrc, /URLSearchParams/);
  assert.doesNotMatch(postSrc, /searchParams/);
  assert.doesNotMatch(talkSrc, /apiKey:\s*z\./);
  assert.match(talkSrc, /parseTalkBody/);

  for (const [label, src] of [
    ["desk", roomSrc],
    ["mind", mindPageSrc],
  ]) {
    const calls = src.split("converseWithPet(").slice(1);
    assert.ok(calls.length >= 1, label);
    for (const call of calls) {
      const head = call.slice(0, 220);
      assert.match(head, /data:\s*talkBody\(/, label);
      assert.doesNotMatch(head, /apiKey/, label);
    }
  }

  const ask = overlayPet.slice(overlayPet.indexOf("async function askMind"), overlayPet.indexOf("function gaitProfile"));
  assert.doesNotMatch(ask, /apiKey/);
  assert.doesNotMatch(ask, /converseWithPet/);
  assert.doesNotMatch(overlayMind, /converseWithPet/);
  assert.doesNotMatch(overlayMind, /localhost:8080/);
  assert.doesNotMatch(overlayMind, /\/api\/pets/);
  assert.doesNotMatch(overlayMind, /body:\s*JSON\.stringify\(\{[^}]*apiKey/);
});

test("talk peeks for a keeper and binds spend; the desk still talks", () => {
  assert.match(talkSrc, /optionalAuthMiddleware/);
  assert.match(talkSrc, /bindTalkSpend/);
  assert.match(talkSrc, /signedIn: Boolean\(context\.userId\)/);
  assert.doesNotMatch(talkSrc, /if \(mind\.apiKey\) return mind\.apiKey/);
  assert.doesNotMatch(talkSrc, /process\.env\.XAI_API_KEY \? "xai"/);
  assert.match(spendSrc, /Client `apiKey` is stripped/);
  assert.match(roomSrc, /label: "Talk"/);
  assert.match(roomSrc, /converseWithPet/);
  assert.match(deskSrc, /typedTalk/);
  assert.doesNotMatch(roomSrc, /token shop/i);
  assert.doesNotMatch(roomSrc, /buy tokens/i);
  assert.doesNotMatch(roomSrc, /paywall/i);
});

test("adult Luna still does not eat; sanctuary and desk time stay", () => {
  const grownBorn = now - 2 * DAY;
  const adult = {
    ...C.blankCare(grownBorn),
    hunger: 40,
    lastTick: now - 3 * 3600 * 1000,
    bornAt: grownBorn,
  };
  assert.equal(C.adultLuna("luna", adult, now), true);
  assert.equal(C.applyFeedFor("luna", adult, now).hunger, 40);
  assert.equal([...speciesSrc.matchAll(/\{ key: "/g)].length, 221);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.match(hatchSrc, /persistLocal=\{false\}/);
  assert.match(nestSrc, /persistLocal=\{false\}/);
  assert.match(kennelSrc, /persistLocal=\{false\}/);
  assert.match(catalogSrc, /persistLocal=\{false\}/);
  assert.match(petSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(deskSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(liveSrc, /persistLocal=\{false\}/);
});
