import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { readSource } from "./test-source.mjs";
import { isSecretModel, scrubSecretModel, scrubSecretQueryString } from "../src/lib/ai/secret-query.mjs";
import { assertSafeMindUrl, pluginRequestUrl, sanitizeModel } from "../src/lib/ai/safe-url.ts";

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

test("a pasted secret in the model field is dropped and a normal model id stays", () => {
  const token = "AbCdEfGh1234567890IjKlMnOp1234567890";
  const secrets = [
    TOKEN,
    `key=${TOKEN}`,
    `api_key=${TOKEN}`,
    `api-key=${MIXED}`,
    `gemini-2.5-flash?key=${TOKEN}`,
    `gpt-4o&token=${TOKEN}`,
    `claude-sonnet-4-5%3Fkey%3D${TOKEN}`,
    token,
    `models/${TOKEN}`,
  ];
  for (const secret of secrets) {
    assert.equal(isSecretModel(secret), true, secret);
    assert.equal(scrubSecretModel(secret), "", secret);
    assert.equal(scrubSecretModel(secret, "gemini-2.5-flash"), "gemini-2.5-flash", secret);
    assert.equal(sanitizeModel(secret, "gemini-2.5-flash"), "gemini-2.5-flash", secret);
    assert.equal(sanitizeModel(secret, "gpt-4.1-mini").includes(TOKEN), false, secret);
  }
  const kept = [
    "gemini-2.5-flash",
    "gpt-4o",
    "gpt-4.1-mini",
    "claude-sonnet-4-5",
    "claude-haiku-4-5",
    "claude-opus-4-5",
    "grok-4.5",
    "llama-3.3-70b-versatile",
    "llama3.2",
    "mistral-small-latest",
    "deepseek-chat",
    "local-model",
    "default",
    "x-ai/grok-4.5",
    "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    "accounts/fireworks/models/llama-v3p1-70b-instruct",
    "anthropic/claude-sonnet-4.5",
    "qwen2.5",
  ];
  for (const model of kept) {
    assert.equal(isSecretModel(model), false, model);
    assert.equal(scrubSecretModel(model), model, model);
    assert.equal(sanitizeModel(model, "gpt-4.1-mini"), model, model);
  }
  assert.equal(scrubSecretModel("  gemini-2.5-flash  "), "gemini-2.5-flash");
  assert.equal(scrubSecretModel(""), "");
  assert.equal(sanitizeModel(undefined, "gemini-2.5-flash"), "gemini-2.5-flash");
});

test("overlay and disk scrub stay in lockstep with the shared helper", () => {
  const shared = readSource(join(root, "src/lib/ai/secret-query.mjs"));
  const disk = readSource(join(repo, "desktop/mind-secret.cjs"));
  const overlay = readSource(join(repo, "desktop/renderer/mind.js"));
  const helper = (src) => {
    let start = src.indexOf("function secretNameSource");
    start = src.lastIndexOf("\n", start) + 1;
    const endName = src.indexOf("function scrubSecretModel");
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
