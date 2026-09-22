import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { scrubSecretQueryString } from "../src/lib/ai/secret-query.mjs";
import { assertSafeMindUrl, pluginRequestUrl } from "../src/lib/ai/safe-url.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const TOKEN = "sk-test-PASTEDKEY0123456789";
const MIXED = "pasted-key-VALUE-should-not-ride";

test("userinfo is dropped and the host and path stay", () => {
  assert.equal(scrubSecretQueryString(`https://${TOKEN}@example.test/v1`), "https://example.test/v1");
  assert.equal(
    scrubSecretQueryString(`https://user:${TOKEN}@example.test/v1?alt=sse`),
    "https://example.test/v1?alt=sse",
  );
  assert.equal(scrubSecretQueryString(`https://${MIXED}:secret@api.example.test/v1beta`), "https://api.example.test/v1beta");
  assert.equal(scrubSecretQueryString("https://api.x.ai/v1").includes("@"), false);
});

test("a token-shaped path segment and /key/ value are dropped", () => {
  assert.equal(scrubSecretQueryString(`https://example.test/v1/key/${TOKEN}`), "https://example.test/v1");
  assert.equal(scrubSecretQueryString(`https://example.test/v1/api_key/${MIXED}`), "https://example.test/v1");
  assert.equal(scrubSecretQueryString(`https://example.test/v1/api-key/${MIXED}/chat`), "https://example.test/v1/chat");
  assert.equal(scrubSecretQueryString(`https://example.test/v1/${TOKEN}/models`), "https://example.test/v1/models");
  assert.equal(
    scrubSecretQueryString(`https://example.test/v1/key=${TOKEN}`),
    "https://example.test/v1",
  );
  assert.equal(
    scrubSecretQueryString(`https://example.test/v1/models/gemini-2.5-flash%3Fkey%3D${TOKEN}`),
    "https://example.test/v1/models/gemini-2.5-flash",
  );
  assert.equal(scrubSecretQueryString(`https://example.test/v1?key=${TOKEN}&alt=sse#key=${TOKEN}`), "https://example.test/v1?alt=sse");
});

test("a version, a model path, oauth token, and a uuid stay", () => {
  const kept = [
    "https://api.x.ai/v1",
    "https://generativelanguage.googleapis.com/v1beta",
    "https://api.fireworks.ai/inference/v1",
    "https://api.together.xyz/v1",
    "http://127.0.0.1:11434",
    "http://127.0.0.1:8787/mind",
    "https://example.test/v1/models/gemini-2.5-flash",
    "https://example.test/v1/models/meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    "https://example.test/v1/llama-3.3-70b-versatile",
    "https://example.test/oauth/token",
    "https://example.test/v1/chat/completions",
    "https://example.test/v1/auth/login",
    "https://example.test/v1?alt=sse#room",
    "https://api.anthropic.com",
    "https://example.test/v1/550e8400-e29b-41d4-a716-446655440000/items",
    "https://example.test/v1/key/gemini-2.5-flash",
  ];
  for (const url of kept) {
    assert.equal(scrubSecretQueryString(url), url, url);
  }
});

test("a non-URL loses a secret assignment and keeps the rest", () => {
  assert.equal(scrubSecretQueryString(`not a url?key=${TOKEN}`), "not a url");
  assert.equal(scrubSecretQueryString(`not a url?api_key=${TOKEN}&alt=sse`), "not a url?alt=sse");
  assert.equal(scrubSecretQueryString(`not a url?api-key=${MIXED}`), "not a url");
  assert.equal(scrubSecretQueryString(`hooks.example token=${TOKEN}`), "hooks.example");
  assert.equal(scrubSecretQueryString(`client_secret=${TOKEN}`), "");
  assert.equal(scrubSecretQueryString("not a url"), "not a url");
  assert.equal(scrubSecretQueryString("keyboard=keep"), "keyboard=keep");
  assert.equal(scrubSecretQueryString("ollama-local"), "ollama-local");
});

test("the plugin fetch drops userinfo and a path key before the call", () => {
  const base = assertSafeMindUrl(`https://user:${TOKEN}@example.test/v1/key/${TOKEN}?alt=sse`, {
    presetId: "openai",
    kind: "openai",
  });
  assert.equal(base.includes(TOKEN), false);
  assert.equal(base.includes("@"), false);
  const joined = pluginRequestUrl(base, "/chat/completions");
  assert.equal(joined, "https://example.test/v1/chat/completions?alt=sse");

  const local = assertSafeMindUrl(`http://user:${TOKEN}@127.0.0.1:11434`, {
    presetId: "ollama",
    kind: "ollama",
  });
  assert.equal(local, "http://127.0.0.1:11434");
  assert.equal(local.includes(TOKEN), false);

  const modelPath = pluginRequestUrl("https://example.test/v1beta", "/models/gemini-2.5-flash:generateContent");
  assert.equal(modelPath, "https://example.test/v1beta/models/gemini-2.5-flash:generateContent");
  assert.throws(
    () => assertSafeMindUrl(`https://user:${TOKEN}@169.254.169.254/latest`, { presetId: "custom", kind: "custom" }),
    (err) => err instanceof Error && err.message === "private host" && !err.message.includes(TOKEN),
  );
});

test("overlay and disk scrub stay in lockstep with the shared helper", () => {
  const shared = readFileSync(join(root, "src/lib/ai/secret-query.mjs"), "utf8");
  const disk = readFileSync(join(repo, "desktop/mind-secret.cjs"), "utf8");
  const overlay = readFileSync(join(repo, "desktop/renderer/mind.js"), "utf8");
  const helper = (src) => {
    let start = src.indexOf("function secretNameSource");
    start = src.lastIndexOf("\n", start) + 1;
    const endName = src.indexOf("function scrubSecretQueryString");
    const after = src.slice(endName);
    let depth = 0;
    let end = -1;
    for (let i = after.indexOf("{"); i < after.length; i += 1) {
      if (after[i] === "{") depth += 1;
      else if (after[i] === "}") {
        depth -= 1;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    const lines = src.slice(start, endName + end).replace(/export function /g, "function ").split("\n");
    const min = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)[0].length));
    return lines.map((line) => line.slice(min)).join("\n").trim();
  };
  assert.equal(helper(disk), helper(shared));
  assert.equal(helper(overlay), helper(shared));
  assert.match(shared, /SECRET_QUERY_NAMES/);
  assert.doesNotMatch(disk, /export function/);
});
