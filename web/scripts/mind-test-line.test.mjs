// "Test this mind" on /mind says who really answered, in plain words. It used to print the raw reply source
// ("local: …"), so a guest who picked xAI Grok (the page's first pick) could not tell house lines answered, or why.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const WEB = join(import.meta.dirname, "..");
const { mindTestLine } = await import(pathToFileURL(join(WEB, "src", "lib", "ai", "test-line.ts")).href);
const { bindTalkSpend } = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "talk-spend.ts")).href);
const grok = { name: "xAI Grok", local: false };
const line = "Say that again, closer to my ear tufts.";

test("house lines picked: says house lines, not the raw source", () => {
  assert.equal(mindTestLine({ source: "local", text: line }, { name: "House lines", local: true }, false), `House lines: “${line}”`);
});

test("a guest who picked an online AI hears why house lines answered", () => {
  // A guest's talk never reaches an online AI (same rule the talk post uses).
  assert.equal(bindTalkSpend({ mind: { plugin: "xai" }, signedIn: false }, { XAI_API_KEY: "x" }).mind.plugin, "local");
  const said = mindTestLine({ source: "local", text: line }, grok, false);
  assert.equal(said, `House lines answered: “${line}” xAI Grok only answers for a signed-in keeper, so pets use house lines until you sign in.`);
  assert.doesNotMatch(said, /^local:/);
});

test("a signed-in keeper whose AI did not answer is told so; a real answer names the AI", () => {
  assert.equal(
    mindTestLine({ source: "local", text: line }, grok, true),
    `House lines answered: “${line}” xAI Grok did not answer. For builders, below, names the server key it needs.`,
  );
  assert.equal(mindTestLine({ source: "xai", text: "Hi. I am Rui." }, grok, true), "xAI Grok: “Hi. I am Rui.”");
});

test("the /mind page uses the plain line, not `${res.source}: ${res.text}`", () => {
  const page = readFileSync(join(WEB, "src", "routes", "mind.tsx"), "utf8");
  assert.match(page, /setTestLine\(mindTestLine\(res, \{ name: picked\.name, local: picked\.kind === "local" \}, signedIn\)\);/);
  assert.doesNotMatch(page, /\$\{res\.source\}: \$\{res\.text\}/);
  assert.match(page, /For builders/);
});
