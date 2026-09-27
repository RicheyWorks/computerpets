import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const completeSrc = readFileSync(join(root, "src/lib/ai/complete.ts"), "utf8");
const overlaySrc = readFileSync(join(repo, "desktop/renderer/mind.js"), "utf8");
const SECRET = "gem-key/with?and=&equals";

function geminiSlice(src, token) {
  const start = src.indexOf(token);
  assert.notEqual(start, -1, token);
  return src.slice(start, start + 1200);
}

test("gemini sources do not put the plugin key on the query string", () => {
  for (const [label, src, token] of [
    ["overlay", overlaySrc, 'p.kind === "gemini"'],
    ["house", completeSrc, "async function gemini"],
  ]) {
    const slice = geminiSlice(src, token);
    assert.doesNotMatch(slice, /\?key=/, label);
    assert.doesNotMatch(slice, /[?&]key=/, label);
    assert.doesNotMatch(slice, /searchParams/, label);
    assert.doesNotMatch(slice, /encodeURIComponent\(key\)/, label);
    assert.doesNotMatch(slice, /encodeURIComponent\(binding\.apiKey\)/, label);
    assert.match(slice, /x-goog-api-key/, label);
    assert.doesNotMatch(slice, /localhost:8080/, label);
    assert.doesNotMatch(slice, /\/api\/pets/, label);
  }
  const openai = geminiSlice(completeSrc, "async function openaiCompat");
  const anthropic = geminiSlice(completeSrc, "async function anthropic");
  const custom = geminiSlice(completeSrc, "async function custom");
  assert.match(openai, /Authorization/);
  assert.match(anthropic, /x-api-key/);
  assert.match(custom, /Authorization/);
  for (const slice of [openai, anthropic, custom]) {
    assert.doesNotMatch(slice, /\?key=/);
    assert.doesNotMatch(slice, /[?&]key=/);
  }
});

test("house gemini request does not include the key in the URL", () => {
  const dir = mkdtempSync(join(tmpdir(), "gem-key-"));
  const src = join(root, "src");
  try {
    writeFileSync(
      join(dir, "hook.mjs"),
      `import { pathToFileURL, fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";
const src = ${JSON.stringify(src)};
function withExt(file) {
  if (existsSync(file)) return file;
  if (existsSync(file + ".ts")) return file + ".ts";
  if (existsSync(file + ".tsx")) return file + ".tsx";
  if (existsSync(file + ".js")) return file + ".js";
  return file + ".ts";
}
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    return { url: pathToFileURL(withExt(join(src, specifier.slice(2)))).href, shortCircuit: true };
  }
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL && !/\\.[a-z0-9]+$/i.test(specifier)) {
    const parent = fileURLToPath(context.parentURL);
    return { url: pathToFileURL(withExt(join(dirname(parent), specifier))).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
`,
    );
    writeFileSync(
      join(dir, "register.mjs"),
      `import { register } from "node:module";
import { pathToFileURL } from "node:url";
register("./hook.mjs", pathToFileURL(${JSON.stringify(join(dir, "register.mjs"))}).href);
`,
    );
    writeFileSync(
      join(dir, "run.mjs"),
      `const { runMind } = await import(${JSON.stringify(pathToFileURL(join(root, "src/lib/ai/complete.ts")).href)});
const SECRET = ${JSON.stringify(SECRET)};
const seen = [];
globalThis.fetch = async (url, init) => {
  seen.push({ url: String(url), headers: init && init.headers, body: init && init.body });
  if (String(url).includes("chat/completions")) {
    return { ok: true, json: async () => ({ choices: [{ message: { content: "openai hi" } }] }) };
  }
  return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: "hi there" }] } }] }) };
};
const ctx = {
  name: "Moth",
  species: "red_panda",
  speciesLabel: "red panda",
  systemPrompt: "be small",
  hunger: 10,
  mood: 10,
  energy: 10,
  hygiene: 10,
  message: "hello",
};
const PASTED = "pasted-key-VALUE-should-not-ride";
const PASTED_API = "pasted-api-key-VALUE-should-not-ride";
const MODEL_BIT = "model-query-VALUE-should-not-ride";
function pasted(originPath) {
  return originPath + "?key=" + PASTED + "&api_key=" + PASTED_API + "&api-key=" + PASTED + "&access_token=" + PASTED + "&token=" + PASTED + "&alt=sse#key=" + PASTED;
}
const reply = await runMind(ctx, { plugin: "google", apiKey: SECRET, model: "gemini-2.5-flash", baseUrl: "https://example.test/v1beta" });
const dirty = await runMind(ctx, {
  plugin: "google",
  apiKey: SECRET,
  model: "gemini-2.0-flash?key=" + MODEL_BIT + "&api_key=" + PASTED_API,
  baseUrl: pasted("https://example.test/v1beta"),
});
const openai = await runMind(ctx, {
  plugin: "openai",
  apiKey: SECRET,
  model: "gpt-4.1-mini?key=" + MODEL_BIT,
  baseUrl: pasted("https://api.example.test/v1"),
});
process.stdout.write(JSON.stringify({ reply, dirty, openai, seen, PASTED, PASTED_API, MODEL_BIT }));
`,
    );
    const res = spawnSync(
      process.execPath,
      ["--experimental-strip-types", "--import", pathToFileURL(join(dir, "register.mjs")).href, join(dir, "run.mjs")],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(res.status, 0, res.stderr || res.stdout);
    const out = JSON.parse(res.stdout);
    assert.equal(out.seen.length, 3);
    const url = new URL(out.seen[0].url);
    assert.equal(out.reply.text, "hi there");
    assert.equal(out.reply.source, "google");
    assert.equal(url.origin, "https://example.test");
    assert.equal(url.pathname, "/v1beta/models/gemini-2.5-flash:generateContent");
    assert.equal(url.search, "");
    assert.equal(url.searchParams.has("key"), false);
    assert.equal(out.seen[0].url.includes(SECRET), false);
    assert.equal(out.seen[0].url.includes(encodeURIComponent(SECRET)), false);
    assert.equal(out.seen[0].headers["x-goog-api-key"], SECRET);
    assert.equal(String(out.seen[0].body).includes(SECRET), false);
    assert.equal(out.seen[0].url.includes("localhost"), false);
    assert.equal(out.seen[0].url.includes("/api/pets"), false);

    const dirtyUrl = new URL(out.seen[1].url);
    assert.equal(out.dirty.text, "hi there");
    assert.equal(out.dirty.source, "google");
    assert.equal(dirtyUrl.origin, "https://example.test");
    assert.equal(dirtyUrl.pathname, "/v1beta/models/gemini-2.5-flash:generateContent");
    assert.equal(dirtyUrl.searchParams.get("alt"), "sse");
    assert.equal(dirtyUrl.hash, "");
    for (const name of ["key", "api_key", "api-key", "access_token", "token"]) {
      assert.equal(dirtyUrl.searchParams.has(name), false, name);
    }
    for (const secret of [SECRET, out.PASTED, out.PASTED_API, out.MODEL_BIT]) {
      assert.equal(out.seen[1].url.includes(secret), false, secret);
      assert.equal(out.seen[1].url.includes(encodeURIComponent(secret)), false, secret);
      assert.equal(String(out.seen[1].body).includes(secret), false, secret);
    }
    assert.equal(out.seen[1].headers["x-goog-api-key"], SECRET);
    assert.equal(String(out.seen[1].body).includes("gemini-2.0-flash?"), false);
    assert.equal(out.seen[1].url.includes("localhost"), false);
    assert.equal(out.seen[1].url.includes("/api/pets"), false);

    const openaiUrl = new URL(out.seen[2].url);
    assert.equal(out.openai.text, "openai hi");
    assert.equal(out.openai.source, "openai");
    assert.equal(openaiUrl.origin, "https://api.example.test");
    assert.equal(openaiUrl.pathname, "/v1/chat/completions");
    assert.equal(openaiUrl.searchParams.get("alt"), "sse");
    assert.equal(openaiUrl.searchParams.has("key"), false);
    assert.equal(openaiUrl.searchParams.has("api_key"), false);
    assert.equal(openaiUrl.hash, "");
    for (const secret of [SECRET, out.PASTED, out.PASTED_API, out.MODEL_BIT]) {
      assert.equal(out.seen[2].url.includes(secret), false, secret);
    }
    assert.equal(out.seen[2].headers.Authorization, `Bearer ${SECRET}`);
    assert.match(String(out.seen[2].body), /gpt-4\.1-mini/);
    assert.equal(String(out.seen[2].body).includes(out.MODEL_BIT), false);
    assert.equal(out.seen[2].url.includes("/api/pets"), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
