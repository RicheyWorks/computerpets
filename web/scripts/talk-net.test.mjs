import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const N = await import(join(root, "src/lib/pets/talk-net.ts"));
const W = await import(join(root, "src/lib/pets/weather-areas.ts"));
const voiceSrc = readFileSync(join(root, "src/lib/ai/voice.ts"), "utf8");
const talkSrc = readFileSync(join(root, "src/lib/pets/talk.ts"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const mindPage = readFileSync(join(root, "src/routes/mind.tsx"), "utf8");
const petSrc = readFileSync(join(repo, "desktop/renderer/pet.js"), "utf8");

test("cloud talk names the host with the shared sentence", () => {
  const xai = N.talkHonesty({ plugin: "xai" });
  assert.equal(xai, `this talk sends the keeper line. ${W.clientNetLine("api.x.ai")}`);
  assert.equal(N.talkHonesty({ plugin: "openai" }).includes("api.openai.com"), true);
  assert.equal(N.talkHonesty({ plugin: "anthropic" }).includes("api.anthropic.com"), true);
  assert.equal(
    N.talkHonesty({ plugin: "google" }).includes("generativelanguage.googleapis.com"),
    true,
  );
  const custom = N.talkHonesty({
    plugin: "custom",
    baseUrl: "https://mind.example.test/hook?key=secret#room",
  });
  assert.equal(custom, `this talk sends the keeper line. ${W.clientNetLine("mind.example.test")}`);
  assert.equal(custom.includes("secret"), false);
  assert.equal(custom.includes("/hook"), false);
  assert.equal(N.talkHonesty({ plugin: "local" }), "");
  assert.equal(N.talkHonesty({ plugin: "ollama", baseUrl: "http://127.0.0.1:11434" }), "");
  assert.equal(N.talkHonesty({ plugin: "lmstudio" }), "");
  assert.equal(N.talkMaySend({ plugin: "xai" }, false), false);
  assert.equal(N.talkMaySend({ plugin: "xai" }, true), true);
  assert.equal(N.talkMaySend({ plugin: "ollama" }, false), true);
  assert.equal(N.talkMaySend({ plugin: "local" }, false), true);
});

test("cloud voice names api.x.ai and api.openai.com and leaves speechSynthesis local", () => {
  assert.equal(N.voiceHonesty("browser"), "");
  assert.equal(N.voiceHonesty("none"), "");
  assert.equal(N.voiceHonesty("xai"), `this voice sends the spoken line. ${W.clientNetLine("api.x.ai")}`);
  assert.equal(
    N.voiceHonesty("openai"),
    `this voice sends the spoken line. ${W.clientNetLine("api.openai.com")}`,
  );
  assert.equal(N.voiceMaySend("xai", false), false);
  assert.equal(N.voiceMaySend("openai", true), true);
  assert.equal(N.voiceMaySend("browser", false), true);
  assert.match(voiceSrc, /https:\/\/api\.x\.ai\/v1\/tts/);
  assert.match(voiceSrc, /https:\/\/api\.openai\.com\/v1\/audio\/speech/);
  assert.equal(N.VOICE_URLS.xai, "https://api.x.ai/v1/tts");
  assert.equal(N.VOICE_URLS.openai, "https://api.openai.com/v1/audio/speech");
});

test("the house calls the cloud only after the posted line matches", () => {
  const talkAt = talkSrc.indexOf("talkMaySend(spend.mind");
  const runAt = talkSrc.indexOf("await runMind");
  const voiceAt = talkSrc.indexOf("voiceMaySend(spend.voice");
  const speakAt = talkSrc.indexOf("await speakWithPlugin");
  assert.ok(talkAt > 0 && talkAt < runAt);
  assert.ok(voiceAt > 0 && voiceAt < speakAt);
  assert.match(talkSrc, /data\.talkLine === talkHonesty/);
  assert.match(talkSrc, /data\.voiceLine === voiceHonesty/);
  assert.match(roomSrc, /const \[talkAsked, setTalkAsked\] = useState\(false\)/);
  assert.match(roomSrc, /id="hud-talk-net"/);
  assert.match(roomSrc, /id="hud-voice-net"/);
  assert.match(roomSrc, /if \(pendingTalk\.current == null\) return/);
  const beforeTalk = roomSrc.slice(0, roomSrc.indexOf("async function sendTalk"));
  assert.doesNotMatch(beforeTalk, /converseWithPet\(/);
  assert.match(mindPage, /id="mind-talk-net"/);
  assert.match(mindPage, /if \(!pendingTest\.current\) return/);
  const bootAt = petSrc.indexOf("window.PetRoster.loadHouseRoster");
  const bootBody = petSrc.slice(bootAt, petSrc.indexOf("bindGuiHarness"));
  assert.doesNotMatch(bootBody, /talkAsked = true/);
  assert.doesNotMatch(bootBody, /askMind\(/);
});
