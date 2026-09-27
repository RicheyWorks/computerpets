import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const N = await import(pathToFileURL(join(root, "src/lib/pets/talk-net.ts")).href);
const W = await import(pathToFileURL(join(root, "src/lib/pets/weather-areas.ts")).href);
const voiceSrc = readFileSync(join(root, "src/lib/ai/voice.ts"), "utf8");
const talkSrc = readFileSync(join(root, "src/lib/pets/talk.ts"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const mindPage = readFileSync(join(root, "src/routes/mind.tsx"), "utf8");
const petSrc = readFileSync(join(repo, "desktop/renderer/pet.js"), "utf8");
const mindSrc = readFileSync(join(repo, "desktop/renderer/mind.js"), "utf8");

test("cloud talk names the AI website in plain words and says what it sends", () => {
  const xai = N.talkHonesty({ plugin: "xai" });
  assert.equal(
    xai,
    "This sends what you typed, your pet's name, and how hungry, happy, and rested it is to xAI, an AI website, so your pet can answer. It also sends your key for xAI, if you saved one. This computer's internet address also goes to xAI, like visiting any website.",
  );
  assert.equal(xai.includes(W.plainNetLine("xAI")), true);
  assert.doesNotMatch(xai, /https request|as any client|keeper line|talk host/);
  assert.equal(N.talkHonesty({ plugin: "openai" }).includes("to OpenAI, an AI website,"), true);
  assert.equal(N.talkHonesty({ plugin: "anthropic" }).includes("to Anthropic, an AI website,"), true);
  assert.equal(N.talkHonesty({ plugin: "google" }).includes("to Google Gemini, an AI website,"), true);
  assert.equal(N.talkHonesty({ plugin: "mistral" }).includes(W.plainNetLine("Mistral")), true);
  const custom = N.talkHonesty({
    plugin: "custom",
    baseUrl: "https://mind.example.test/hook?key=secret#room",
  });
  assert.equal(custom, N.talkLine("mind.example.test"));
  assert.equal(custom.includes("to mind.example.test, the AI website you set up, so your pet can answer."), true);
  assert.equal(custom.includes(W.plainNetLine("mind.example.test")), true);
  assert.deepEqual(N.aiSite("constructor"), { name: "constructor", who: "constructor, the AI website you set up" });
  assert.deepEqual(N.aiSite(""), { name: "the AI website you set up", who: "the AI website you set up" });
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

test("cloud voice names xAI and OpenAI in plain words and leaves speechSynthesis local", () => {
  assert.equal(N.voiceHonesty("browser"), "");
  assert.equal(N.voiceHonesty("none"), "");
  assert.equal(
    N.voiceHonesty("xai"),
    "This sends the words your pet will say to xAI, an AI website, so it can turn them into a voice. It also sends your key for xAI, if you saved one. This computer's internet address also goes to xAI, like visiting any website.",
  );
  assert.equal(N.voiceHonesty("openai"), N.voiceLine("api.openai.com"));
  assert.equal(N.voiceHonesty("openai").includes("to OpenAI, an AI website,"), true);
  assert.equal(N.voiceMaySend("xai", false), false);
  assert.equal(N.voiceMaySend("openai", true), true);
  assert.equal(N.voiceMaySend("browser", false), true);
  assert.match(voiceSrc, /https:\/\/api\.x\.ai\/v1\/tts/);
  assert.match(voiceSrc, /https:\/\/api\.openai\.com\/v1\/audio\/speech/);
  assert.equal(N.VOICE_URLS.xai, "https://api.x.ai/v1/tts");
  assert.equal(N.VOICE_URLS.openai, "https://api.openai.com/v1/audio/speech");
});

test("a missing host line does not open a remote talk or a cloud voice", async () => {
  let talks = 0;
  let voices = 0;
  const xai = { plugin: "xai" };
  const local = { text: "house", source: "local" };
  const held = await N.readTalk("", xai, async () => {
    talks += 1;
    return { text: "cloud", source: "xai" };
  }, local);
  assert.equal(talks, 0);
  assert.equal(held.source, "local");
  const wrongHost = await N.readTalk(N.talkHonesty({ plugin: "openai" }), xai, async () => {
    talks += 1;
    return { text: "cloud", source: "xai" };
  }, local);
  assert.equal(talks, 0);
  assert.equal(wrongHost.text, "house");
  assert.equal(N.talkMayLeave(N.voiceHonesty("xai"), xai), false);
  const sent = await N.readTalk(N.talkHonesty(xai), xai, async () => {
    talks += 1;
    return { text: "cloud", source: "xai" };
  }, local);
  assert.equal(talks, 1);
  assert.equal(sent.source, "xai");
  const loop = await N.readTalk("", { plugin: "ollama", baseUrl: "http://127.0.0.1:11434" }, async () => {
    talks += 1;
    return { text: "here", source: "ollama" };
  }, local);
  assert.equal(talks, 2);
  assert.equal(loop.source, "ollama");
  const quiet = await N.readVoice("", "xai", async () => {
    voices += 1;
    return "data:audio";
  });
  assert.equal(voices, 0);
  assert.equal(quiet, undefined);
  const talkNotVoice = await N.readVoice(N.talkHonesty(xai), "xai", async () => {
    voices += 1;
    return "data:audio";
  });
  assert.equal(voices, 0);
  assert.equal(talkNotVoice, undefined);
  const openaiLine = await N.readVoice(N.voiceHonesty("openai"), "xai", async () => {
    voices += 1;
    return "data:audio";
  });
  assert.equal(voices, 0);
  assert.equal(openaiLine, undefined);
  const spoken = await N.readVoice(N.voiceHonesty("xai"), "xai", async () => {
    voices += 1;
    return "data:audio";
  });
  assert.equal(voices, 1);
  assert.equal(spoken, "data:audio");
  const browser = await N.readVoice("", "browser", async () => {
    voices += 1;
    return "nope";
  });
  assert.equal(browser, undefined);
  assert.equal(voices, 1);
  assert.equal(N.voiceMayLeave(N.voiceHonesty("openai"), "openai"), true);
  assert.equal(N.voiceMayLeave("", "browser"), true);
});

test("cloud talk and cloud voice time out and deny a silent host", async () => {
  assert.equal(N.TALK_TIMEOUT_MS, 12_000);
  assert.equal(N.VOICE_TIMEOUT_MS, 12_000);
  assert.equal(N.TalkTimeout.name, "TalkTimeout");
  assert.equal(N.VoiceTimeout.name, "VoiceTimeout");
  const xai = { plugin: "xai" };
  const local = { text: "house", source: "local" };
  const hang = () => new Promise(() => {});
  await assert.rejects(
    () => N.readTalk(N.talkHonesty(xai), xai, hang, local, 30),
    (err) => err instanceof N.TalkTimeout && err.name === "TalkTimeout",
  );
  await assert.rejects(
    () => N.readVoice(N.voiceHonesty("xai"), "xai", hang, 30),
    (err) => err instanceof N.VoiceTimeout && err.name === "VoiceTimeout",
  );

  let fulfilled = null;
  const late = N.readTalk(
    N.talkHonesty(xai),
    xai,
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ text: "late cloud", source: "xai" });
        }, 80);
      }),
    local,
    20,
  ).then(
    (body) => {
      fulfilled = body;
      return body;
    },
    (err) => {
      fulfilled = err;
      throw err;
    },
  );
  await assert.rejects(() => late, (err) => err instanceof N.TalkTimeout);
  await new Promise((r) => setTimeout(r, 120));
  assert.ok(fulfilled instanceof N.TalkTimeout);
  assert.equal(fulfilled.name, "TalkTimeout");

  let voiceFulfilled = null;
  const lateVoice = N.readVoice(
    N.voiceHonesty("openai"),
    "openai",
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("data:audio/late");
        }, 80);
      }),
    20,
  ).then(
    (body) => {
      voiceFulfilled = body;
      return body;
    },
    (err) => {
      voiceFulfilled = err;
      throw err;
    },
  );
  await assert.rejects(() => lateVoice, (err) => err instanceof N.VoiceTimeout);
  await new Promise((r) => setTimeout(r, 120));
  assert.ok(voiceFulfilled instanceof N.VoiceTimeout);

  const answered = await N.readTalk(
    N.talkHonesty(xai),
    xai,
    async () => ({ text: "cloud", source: "xai" }),
    local,
    200,
  );
  assert.equal(answered.source, "xai");
  assert.equal(await N.readTalk("", xai, hang, local, 30), local);
  assert.equal(await N.readVoice("", "xai", hang, 30), undefined);

  let loopCalls = 0;
  const loopHang = N.readTalk(
    "",
    { plugin: "ollama", baseUrl: "http://127.0.0.1:11434" },
    async () => {
      loopCalls += 1;
      await new Promise((r) => setTimeout(r, 40));
      return { text: "here", source: "ollama" };
    },
    local,
    15,
  );
  assert.equal((await loopHang).source, "ollama");
  assert.equal(loopCalls, 1);

  assert.match(mindSrc, /TALK_TIMEOUT_MS/);
  assert.match(mindSrc, /AbortController/);
  assert.match(mindSrc, /TalkTimeout/);
  assert.match(talkSrc, /isTalkTimeout/);
  assert.match(talkSrc, /isVoiceTimeout/);
  assert.match(voiceSrc, /signal/);
  assert.doesNotMatch(talkSrc, /can't reach/);
});

test("the house calls the cloud only after the posted line matches", () => {
  const talkAt = talkSrc.indexOf("await readTalk(");
  const runAt = talkSrc.indexOf("runMind(turn, spend.mind");
  const voiceAt = talkSrc.indexOf("await readVoice(");
  const speakAt = talkSrc.indexOf("speakWithPlugin(reply.text");
  assert.ok(talkAt > 0 && talkAt < runAt);
  assert.ok(voiceAt > 0 && voiceAt < speakAt);
  assert.match(talkSrc, /data\.talkLine/);
  assert.match(talkSrc, /data\.voiceLine/);
  assert.doesNotMatch(talkSrc, /can't reach/);
  assert.match(roomSrc, /const \[talkAsked, setTalkAsked\] = useState\(false\)/);
  assert.match(roomSrc, /id="hud-talk-net"/);
  assert.match(roomSrc, /id="hud-voice-net"/);
  assert.match(roomSrc, /if \(pendingTalk\.current == null\) return/);
  const beforeTalk = roomSrc.slice(0, roomSrc.indexOf("async function sendTalk"));
  assert.doesNotMatch(beforeTalk, /converseWithPet\(/);
  assert.match(mindPage, /id="mind-talk-net"/);
  assert.match(mindPage, /if \(!pendingTest\.current\) return/);
  const askAt = petSrc.indexOf("async function askMind");
  const askBody = petSrc.slice(askAt, askAt + 800);
  assert.match(askBody, /shown: talkShown\(\)/);
  assert.doesNotMatch(askBody, /lineInView:/);
  const runAtMind = mindSrc.indexOf("async function run");
  const runBody = mindSrc.slice(runAtMind, mindSrc.indexOf("window.PetMind"));
  assert.ok(runBody.indexOf("readTalk") < runBody.indexOf("fetch("));
  assert.doesNotMatch(runBody, /lineInView === true/);
  const bootAt = petSrc.indexOf("window.PetRoster.loadHouseRoster");
  const bootBody = petSrc.slice(bootAt, petSrc.indexOf("bindGuiHarness"));
  assert.doesNotMatch(bootBody, /talkAsked = true/);
  assert.doesNotMatch(bootBody, /askMind\(/);
});
