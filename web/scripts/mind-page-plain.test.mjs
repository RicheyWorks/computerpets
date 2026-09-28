import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { MIND_WORDS } from "../src/lib/ai/mind-words.ts";

// The Minds screens in plain words: the web /mind page top is for a kid, builder material is folded
// away under "For builders", and the AI picker, the model box, and the key box read the same on the
// web desk, the overlay Settings window, and the Python client.
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const read = (...p) => readFileSync(join(root, ...p), "utf8").replace(/\r\n/g, "\n");
const page = read("web", "src", "routes", "mind.tsx");
const settings = read("desktop", "renderer", "settings.html");
const mindsPy = read("client", "computerpets_client", "minds.py");
const pyWord = (name) => (mindsPy.match(new RegExp(`^${name} = "([^"]*)"$`, "m")) || [])[1];

const BUILDER_WORDS = ["Plugin bus", "Any mind. Same house.", "Fourteen plugins", "OpenAI-compatible", "Write a plugin", "POST /mind", "envKey"];

test("the /mind top is plain; builder words sit only in the folded For builders section", () => {
  const foldAt = page.indexOf('<details id="mind-builders"');
  assert.ok(foldAt > 0, "a For builders fold exists");
  const fold = page.slice(foldAt, page.indexOf("</details>", foldAt));
  assert.match(fold, /<summary[^>]*>For builders<\/summary>/);
  assert.doesNotMatch(page.slice(foldAt, page.indexOf(">", foldAt)), /\bopen\b/, "the fold starts closed");
  const top = page.slice(page.indexOf("return ("), foldAt);
  for (const w of BUILDER_WORDS) {
    assert.equal(top.includes(w), false, `"${w}" is not above the fold`);
    assert.ok(fold.includes(w), `"${w}" is still there for builders`);
  }
  assert.match(fold, /<code>\{selected\.envKey\}<\/code>/, "the server key name is kept for builders");
  const header = page.slice(page.indexOf("<header"), page.indexOf("</header>"));
  assert.match(header, /\{MIND_WORDS\.intro\}/);
  assert.match(header, /<h1[^>]*>Minds<\/h1>/);
  const plainLine = (header.match(/id="mind-how"[^>]*>\s*([^<]+?)\s*</) || [])[1] || "";
  assert.ok(plainLine && plainLine.split(/(?<=\.)\s+/).every((s) => s.split(/\s+/).length <= 12), `short sentences: ${plainLine}`);
  assert.doesNotMatch(page, /content: "Plug any AI into the house\. One contract, fourteen plugins\."/);
});

test("the key box placeholder is plain; no server variable name in a box", () => {
  assert.equal(MIND_WORDS.keyPlaceholder, "Paste your key here");
  assert.match(page, /placeholder=\{MIND_WORDS\.keyPlaceholder\}/);
  assert.doesNotMatch(page, /on the server` : "optional"/);
  assert.ok(settings.includes(`<input id="key" type="password" autocomplete="off" placeholder="${MIND_WORDS.keyPlaceholder}" />`));
  assert.equal(pyWord("KEY_PLACEHOLDER"), MIND_WORDS.keyPlaceholder);
});

test("Which AI and the model box read the same on the web, the overlay, and the Python client", () => {
  assert.equal(MIND_WORDS.which, "Which AI");
  assert.equal(MIND_WORDS.model, "AI model name");
  assert.match(MIND_WORDS.modelHelp, /^Which version of that AI answers\./);
  for (const [k, py] of [["which", "WHICH_LABEL"], ["model", "MODEL_LABEL"], ["modelHelp", "MODEL_HELP"]]) {
    assert.equal(pyWord(py), MIND_WORDS[k], `${py} matches MIND_WORDS.${k}`);
  }
  assert.ok(settings.includes(`<label for="plugin">${MIND_WORDS.which}</label>`));
  assert.ok(settings.includes(`<label for="model">${MIND_WORDS.model}</label>`));
  assert.ok(settings.includes(`<p class="hint" id="modelHelp">${MIND_WORDS.modelHelp}</p>`));
  assert.match(page, /label=\{MIND_WORDS\.model\} hint=\{MIND_WORDS\.modelHelp\}/);
  assert.match(page, /<h2 id="mind-which"[^>]*>\s*\{MIND_WORDS\.which\}/);
  assert.match(page, /<Field label=\{MIND_WORDS\.which\}>/);
  assert.match(mindsPy, /\{"id": "model", "label": MODEL_LABEL, "help": MODEL_HELP\}/);
  assert.doesNotMatch(page, /label="(Model|Model override|Mind|Companion)"/);
  assert.doesNotMatch(settings, /<label[^>]*>(Plugin|Model)<\/label>/);
});

test("the overlay Minds words say key and settings file, not plugin key or mind.json", () => {
  const minds = settings.slice(settings.indexOf('<h1 id="mindsSection">'), settings.indexOf('<h2 id="unlockSection">'));
  const text = minds.replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(text, /plugin key|mind\.json|\bPlugin\b/);
  const script = settings.slice(settings.indexOf("function paintKey("), settings.indexOf("paintKey(s.keyKept);"));
  const said = [...script.matchAll(/textContent = "([^"]*)"/g)].map((m) => m[1]);
  assert.equal(said.length, 6, "one line for each way the key can be kept");
  for (const line of said) assert.doesNotMatch(line, /plugin key|mind\.json|OS secret store/, line);
  const saveErr = (settings.match(/mindErr\.textContent = "(Not saved\.[^"]*)"/) || [])[1] || "";
  assert.match(saveErr, /^Not saved\. The settings file could not be written/);
});

test("the AI cards and voice buttons on /mind use plain words, not plugin shapes", async () => {
  const { MIND_PRESETS, VOICE_PRESETS } = await import("../src/lib/ai/catalog.ts");
  const { presetTag } = await import("../src/lib/ai/mind-words.ts");
  assert.equal(MIND_PRESETS.length, 14, "all fourteen AIs are still there");
  const jargon = /OpenAI-compatible|OpenAI shape|generateContent|via the official API|POST|plugin|roster|La Plateforme|\bTTS\b|speechSynthesis|endpoint/;
  for (const p of MIND_PRESETS) {
    assert.doesNotMatch(p.blurb, jargon, `${p.id}: ${p.blurb}`);
    assert.ok(p.blurb.split(/\s+/).length <= 12, `${p.id} blurb is short`);
    assert.ok(["No AI", "Needs a key", "No key needed", "On this computer", "Your own address"].includes(presetTag(p)), `${p.id} tag`);
  }
  for (const v of VOICE_PRESETS) {
    assert.doesNotMatch(`${v.name} ${v.blurb}`, jargon, v.id);
  }
  assert.equal(presetTag(MIND_PRESETS.find((p) => p.id === "local")), "No AI");
  assert.equal(presetTag(MIND_PRESETS.find((p) => p.id === "xai")), "Needs a key");
  assert.equal(presetTag(MIND_PRESETS.find((p) => p.id === "ollama")), "On this computer");
  assert.equal(presetTag(MIND_PRESETS.find((p) => p.id === "lmstudio")), "On this computer");
  assert.equal(presetTag(MIND_PRESETS.find((p) => p.id === "custom")), "Your own address");
  assert.match(page, /\{presetTag\(preset\)\}/);
  assert.doesNotMatch(page, />\{preset\.kind\}</, "the card no longer shows the plugin kind");
});

test("Use for all pets and Same as all pets read the same on the web, the overlay, and the Python client", () => {
  assert.equal(MIND_WORDS.allPets, "Use for all pets");
  assert.equal(MIND_WORDS.sameAsAll, "Same as all pets");
  assert.equal(pyWord("ALL_PETS_LABEL"), MIND_WORDS.allPets);
  assert.equal(pyWord("SAME_AS_ALL_LABEL"), MIND_WORDS.sameAsAll);
  assert.ok(settings.includes(`<button id="save" type="button">${MIND_WORDS.allPets}</button>`));
  assert.match(page, /<h2 id="mind-all-pets"[^>]*>\{MIND_WORDS\.allPets\}<\/h2>/);
  assert.match(page, /<option value="inherit">\{MIND_WORDS\.sameAsAll\} \(\{selected\.name\}\)<\/option>/);
  for (const src of [page, settings]) assert.doesNotMatch(src, /[Hh]ouse default\b(?! or give)/, "no house default left outside the builder line");
});

test("an AI card shows only its tag, name, and blurb; the model ids sit in For builders", () => {
  const cardsAt = page.indexOf("{MIND_PRESETS.map((preset) => {");
  const card = page.slice(cardsAt, page.indexOf("</section>", cardsAt));
  assert.ok(cardsAt > 0);
  assert.doesNotMatch(card, /defaultModel|font-mono/, "no model id on a card");
  assert.match(card, /\{presetTag\(preset\)\}/);
  assert.match(card, /\{preset\.name\}/);
  assert.match(card, /\{preset\.blurb\}/);
  const foldAt = page.indexOf('<details id="mind-builders"');
  const fold = page.slice(foldAt, page.indexOf("</details>", foldAt));
  assert.match(fold, /<ul id="mind-model-ids"/);
  assert.match(fold, /\{p\.name\}: <code className="font-mono text-xs">\{p\.defaultModel\}<\/code>/);
  assert.doesNotMatch(page.slice(0, foldAt), /defaultModel\}<\/p>/);
});
