import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const T = await import(join(root, "src/lib/pets/talk-spend.ts"));
const C = await import(join(root, "src/lib/pets/care.ts"));

const talkSrc = readFileSync(join(root, "src/lib/pets/talk.ts"), "utf8");
const spendSrc = readFileSync(join(root, "src/lib/pets/talk-spend.ts"), "utf8");
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
  assert.equal([...speciesSrc.matchAll(/\{ key: "/g)].length, 190);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.match(hatchSrc, /persistLocal=\{false\}/);
  assert.match(nestSrc, /persistLocal=\{false\}/);
  assert.match(kennelSrc, /persistLocal=\{false\}/);
  assert.match(catalogSrc, /persistLocal=\{false\}/);
  assert.match(petSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(deskSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(liveSrc, /persistLocal=\{false\}/);
});
