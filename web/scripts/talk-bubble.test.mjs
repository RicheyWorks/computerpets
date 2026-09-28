// Talk with no AI: the keeper's typed words show back, the pet's answer stays up long enough to read
// (about 4 s plus a little per word, 12 s at most) and closes on a click. A called guest's line waits
// instead of covering the answer. The overlay uses the same hold rule and closes its bubble on a click.
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { pathToFileURL } from "node:url";
import { mountSetup } from "./mount-setup.mjs";

const WEB = join(import.meta.dirname, "..");
const RENDERER = join(WEB, "..", "desktop", "renderer");
const B = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "talk-bubble.ts")).href);
let m;

before(async () => {
  m = await mountSetup();
});

function overlayMind() {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  const window = { localStorage: storage, sessionStorage: storage, addEventListener() {}, location: { protocol: "file:" } };
  window.window = window;
  vm.runInContext(readFileSync(join(RENDERER, "mind.js"), "utf8"), vm.createContext(window));
  return window.PetMind;
}

test("the answer stays about 4 s plus 0.3 s a word, never past 12 s", () => {
  assert.equal(B.replyHoldMs(""), 4000);
  assert.equal(B.replyHoldMs("Say that again, closer to my ear tufts."), 4000 + 8 * 300);
  assert.equal(B.replyHoldMs("word ".repeat(32)), 12000);
  assert.ok(B.replyHoldMs("Say that again, closer to my ear tufts.") > 2200 + 39 * 55 - 1000, "no shorter than a quick read");
});

test("the overlay holds its talk bubble by the same rule", () => {
  const M = overlayMind();
  for (const text of ["", "Hi.", "Say that again, closer to my ear tufts.", "I sat. You were already here.", "word ".repeat(40)]) {
    assert.equal(M.replyHoldMs(text), B.replyHoldMs(text), text);
  }
});

test("the keeper's own words read back plainly", () => {
  assert.equal(B.heardLine("hello rui"), "You said: “hello rui”");
  assert.equal(B.heardLine("   "), "");
});

test("LivingPet: with a close handler the bubble is a button a click closes; without one it lets clicks through", async () => {
  const { LivingPet } = await m.load("components/desk/living-pet.tsx");
  const cat = (await m.load("lib/pets/living.ts")).livingByKey("cat");
  let closed = 0;
  const s = m.stage();
  await s.render(m.h(LivingPet, { kind: "cat", sprites: cat.sprites, windows: [], speech: "I sat. You were already here.", onSpeechClose: () => closed++ }));
  const open = s.container.querySelector('[data-speech="open"]');
  assert.ok(open, "the bubble is open");
  assert.match(open.getAttribute("class"), /pointer-events-auto/);
  const btn = s.container.querySelector("[data-speech-close]");
  assert.ok(btn, "the words sit in a button");
  assert.equal(btn.tagName.toLowerCase(), "button");
  await m.React.act(async () => {
    for (const fn of s.container.listeners.get("click") || []) fn({ type: "click", target: btn, currentTarget: s.container, bubbles: true, cancelable: true, defaultPrevented: false, eventPhase: 3, isTrusted: true, timeStamp: 0, preventDefault() {}, stopPropagation() {} });
  });
  assert.equal(closed, 1);
  await s.render(m.h(LivingPet, { kind: "cat", sprites: cat.sprites, windows: [], speech: "Hi." }));
  assert.equal(s.container.querySelector("[data-speech-close]"), null);
  assert.match(s.container.querySelector('[data-speech="open"]').getAttribute("class"), /pointer-events-none/);
  s.unmount?.();
});

test("the desk room wires the hold, the guest wait, the echo and the close", () => {
  const room = readFileSync(join(WEB, "src", "components", "desk", "companion-room.tsx"), "utf8");
  assert.match(room, /setTalkProblem\(null\);\n      sayReply\(res\.text\);/);
  assert.match(room, /sayReply\(message \? kind\.listenLine\(\) : kind\.ambientLine\(stats\)\);/);
  assert.equal((room.match(/onSong=\{guestSay\}/g) || []).length, 2);
  assert.doesNotMatch(room, /onSong=\{say\}/);
  assert.match(room, /if \(performance\.now\(\) < replyUntil\.current\) return;/);
  assert.match(room, /onSpeechClose=\{closeSpeech\}/);
  assert.match(room, /setHeard\(msg\);\n\s+void talk\(msg\);/);
  assert.match(room, /<p data-talk-echo[^>]*>\n\s+\{heardLine\(heard\)\}/);
  assert.doesNotMatch(room, /2200 \+ res\.text\.length \* 55/);
});

test("the overlay bubble holds a talk answer by the rule and closes on a click while open", () => {
  const pet = readFileSync(join(RENDERER, "pet.js"), "utf8");
  const html = readFileSync(join(RENDERER, "index.html"), "utf8");
  const css = readFileSync(join(RENDERER, "styles.css"), "utf8");
  assert.match(pet, /say\(reply\.text, replyHold\(reply\.text\)\);/);
  assert.match(pet, /say\(fallback, replyHold\(fallback\)\);/);
  assert.match(pet, /bubble\.addEventListener\("click", \(\) => \{\n\s+speechUntil = 0;\n\s+bubble\.classList\.remove\("open"\);/);
  assert.match(html, /<div id="bubble" data-hit title="Click to close">/);
  assert.match(css, /#bubble \{[^}]*pointer-events: none;/);
  assert.match(css, /#bubble\.open \{\n  opacity: 1;\n  pointer-events: auto;/);
});
