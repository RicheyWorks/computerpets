// The signed-in keeper path, end to end with a stand-in house: the real /mind page, the real talk and
// listener server functions (run in-process by a stand-in @tanstack/react-start), a stand-in session, and a
// stand-in AI website (fetch). The house keys are test doubles; no real key and no network are used.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { mountSetup } from "./mount-setup.mjs";

const STUBS = join(import.meta.dirname, "mount-stubs");
const XAI_DOUBLE = "test-double-xai-key";
const OPENAI_DOUBLE = "test-double-openai-key";
const KEY = "computerpets.mind.v1";

let m;
let calls = [];
const saved = {};

function standInAi(url, init) {
  const u = String(url);
  const body = JSON.parse(init?.body || "{}");
  calls.push({ url: u, auth: init?.headers?.Authorization, model: body.model });
  const who = u.startsWith("https://api.x.ai/") ? "grok double" : u.startsWith("https://api.openai.com/") ? "gpt double" : null;
  if (!who) return Promise.resolve(new Response("no", { status: 404 }));
  const text = `Hello from the ${who}.`;
  return Promise.resolve(new Response(JSON.stringify({ choices: [{ message: { content: text } }] }), { status: 200, headers: { "content-type": "application/json" } }));
}

before(async () => {
  m = await mountSetup({
    stubs: {
      "@tanstack/react-start": join(STUBS, "react-start.mjs"),
      "@tanstack/react-router": join(STUBS, "react-router.mjs"),
      "@/lib/auth/middleware": join(STUBS, "auth-middleware.mjs"),
      "@/lib/auth/use-current-user": join(STUBS, "use-current-user.mjs"),
    },
  });
  for (const k of ["XAI_API_KEY", "OPENAI_API_KEY"]) saved[k] = process.env[k];
  saved.fetch = globalThis.fetch;
  globalThis.fetch = standInAi;
});

after(() => {
  for (const k of ["XAI_API_KEY", "OPENAI_API_KEY"]) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  globalThis.fetch = saved.fetch;
  delete globalThis.__stubSession;
});

async function settle(times = 4) {
  for (let i = 0; i < times; i++) await m.React.act(async () => { await new Promise((r) => setTimeout(r, 0)); });
}

function click(s, el) {
  return m.React.act(async () => {
    for (const fn of s.container.listeners.get("click") || []) fn({ type: "click", target: el, currentTarget: s.container, bubbles: true, cancelable: true, defaultPrevented: false, eventPhase: 3, isTrusted: true, timeStamp: 0, button: 0, preventDefault() {}, stopPropagation() {} });
  });
}

function cards(s) {
  return s.container.querySelectorAll("[data-mind-card]").map((el) => ({
    id: el.getAttribute("data-mind-card"),
    pressed: String(el.getAttribute("aria-pressed")),
    badge: el.querySelector("[data-mind-in-use]")?.textContent ?? null,
  }));
}

function inUse(s) {
  return cards(s).filter((c) => c.pressed === "true");
}

function testLineText(s) {
  return s.container.querySelectorAll("p").map((p) => p.textContent).find((t) => /answered|: “/.test(t)) ?? null;
}

async function mountMind({ session, store, env }) {
  globalThis.__stubSession = session;
  delete process.env.XAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  Object.assign(process.env, env);
  window.localStorage.clear?.();
  if (store) window.localStorage.setItem(KEY, JSON.stringify(store));
  else window.localStorage.removeItem(KEY);
  const S = await m.load("lib/ai/settings.ts");
  S.resetMindStoreForTests();
  const { Route } = await m.load("routes/mind.tsx");
  const s = m.stage();
  await s.render(m.h(Route.options.component));
  await settle();
  return s;
}

async function runTestButton(s) {
  const btn = s.container.querySelectorAll("button").find((b) => b.textContent.trim() === "Test this mind");
  assert.ok(btn, "Test this mind is on the page");
  calls = [];
  await click(s, btn);
  await settle(8);
  return testLineText(s);
}

test("signed in, nothing picked, the house holds the xAI key: xAI Grok is In use and it answers through the AI path", async () => {
  const s = await mountMind({ session: { userId: "keeper-1" }, env: { XAI_API_KEY: XAI_DOUBLE } });
  assert.deepEqual(inUse(s), [{ id: "xai", pressed: "true", badge: "In use" }]);
  assert.equal(cards(s).find((c) => c.id === "local").pressed, "false");
  assert.equal(s.container.querySelector("#mind-guest-note"), null, "no guest note for a keeper");
  const line = await runTestButton(s);
  assert.equal(calls.length, 1, "one call to the stand-in AI");
  assert.equal(calls[0].url, "https://api.x.ai/v1/chat/completions");
  assert.equal(calls[0].auth, `Bearer ${XAI_DOUBLE}`, "the house key double went server-side to xAI");
  assert.equal(calls[0].model, "grok-4.5");
  assert.equal(line, "xAI Grok: “Hello from the grok double.”");
  await s.unmount();
});

test("signed in, nothing picked, the house has no xAI key: House lines is In use and nothing is sent", async () => {
  const s = await mountMind({ session: { userId: "keeper-2" }, env: {} });
  assert.deepEqual(inUse(s), [{ id: "local", pressed: "true", badge: "In use" }]);
  const line = await runTestButton(s);
  assert.equal(calls.length, 0);
  assert.match(line, /^House lines: “.+”$/);
  await s.unmount();
});

test("signed in with OpenAI picked: OpenAI is In use (not Picked), it answers with the OpenAI key double, not xAI", async () => {
  const s = await mountMind({
    session: { userId: "keeper-3" },
    store: { picked: true, default: { plugin: "openai", model: "gpt-4.1-mini" }, voice: "browser", pets: {} },
    env: { XAI_API_KEY: XAI_DOUBLE, OPENAI_API_KEY: OPENAI_DOUBLE },
  });
  assert.deepEqual(inUse(s), [{ id: "openai", pressed: "true", badge: "In use" }]);
  const line = await runTestButton(s);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.openai.com/v1/chat/completions");
  assert.equal(calls[0].auth, `Bearer ${OPENAI_DOUBLE}`);
  assert.equal(calls[0].model, "gpt-4.1-mini");
  assert.equal(line, "OpenAI: “Hello from the gpt double.”");
  await s.unmount();
});

test("signed in, clicking a card makes it the pick and In use at once", async () => {
  const s = await mountMind({ session: { userId: "keeper-4" }, env: { XAI_API_KEY: XAI_DOUBLE, OPENAI_API_KEY: OPENAI_DOUBLE } });
  assert.equal(inUse(s)[0].id, "xai");
  await click(s, s.container.querySelector('[data-mind-card="openai"]'));
  await settle();
  assert.deepEqual(inUse(s), [{ id: "openai", pressed: "true", badge: "In use" }]);
  assert.match(window.localStorage.getItem(KEY), /"picked":true/);
  await s.unmount();
});

test("the same house as a guest: House lines In use, the AI is never called even with the key there", async () => {
  const s = await mountMind({ session: null, env: { XAI_API_KEY: XAI_DOUBLE } });
  assert.deepEqual(inUse(s), [{ id: "local", pressed: "true", badge: "In use" }]);
  const line = await runTestButton(s);
  assert.equal(calls.length, 0);
  assert.match(line, /^House lines: “.+”$/);
  await s.unmount();
});

test("desk talk for a signed-in keeper: the desk's binding goes through the real talk server to the AI", async () => {
  const S = await m.load("lib/ai/settings.ts");
  const { converseWithPet } = await m.load("lib/pets/talk.ts");
  const { talkBody } = await m.load("lib/pets/talk-post.ts");
  const { talkHonesty } = await m.load("lib/pets/talk-net.ts");
  const fresh = { default: { plugin: "local" }, voice: "browser", pets: {}, picked: false };
  const ask = async (mind, session, env) => {
    globalThis.__stubSession = session;
    delete process.env.XAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    Object.assign(process.env, env);
    calls = [];
    return converseWithPet({ data: talkBody({ message: "hi", hunger: 70, mood: 70, energy: 70, name: "Rui", species: "red_panda", speak: false, mind, voice: "none", talkLine: talkHonesty(mind) || undefined }) });
  };
  // Signed in, no pick: the desk sends the signed-in default and the house key answers.
  const signedDefault = S.bindingFor(fresh, "red_panda", true);
  assert.deepEqual(signedDefault, { plugin: "xai", model: "grok-4.5" });
  const a = await ask(signedDefault, { userId: "k" }, { XAI_API_KEY: XAI_DOUBLE });
  assert.deepEqual({ text: a.text, source: a.source }, { text: "Hello from the grok double.", source: "xai" });
  assert.equal(calls[0].auth, `Bearer ${XAI_DOUBLE}`);
  // Signed in, OpenAI picked.
  const picked = S.bindingFor({ ...fresh, picked: true, default: { plugin: "openai", model: "gpt-4.1-mini" } }, "red_panda", true);
  const b = await ask(picked, { userId: "k" }, { XAI_API_KEY: XAI_DOUBLE, OPENAI_API_KEY: OPENAI_DOUBLE });
  assert.equal(b.source, "openai");
  assert.equal(calls[0].url, "https://api.openai.com/v1/chat/completions");
  // A guest sending the same binding still gets House lines; the key is not spent.
  const c = await ask(signedDefault, null, { XAI_API_KEY: XAI_DOUBLE });
  assert.equal(c.source, "local");
  assert.equal(calls.length, 0);
});
