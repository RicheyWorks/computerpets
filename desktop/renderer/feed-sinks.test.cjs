/**
 * Feed words (news, Wikipedia, weather places, coin and NFT names, radio stations, GPU
 * names) must reach the overlay as text, never as markup. The overlay builds its plates
 * with createElement and textContent. This check keeps HTML sinks out of the renderer so
 * a feed title like <img src=x onerror=...> can never become an element.
 */
const assert = require("node:assert/strict");
const { readdirSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

const SINKS = [
  [/\.innerHTML\s*[+]?=/, "innerHTML ="],
  [/\.outerHTML\s*[+]?=/, "outerHTML ="],
  [/\binsertAdjacentHTML\s*\(/, "insertAdjacentHTML("],
  [/\bdocument\.write(ln)?\s*\(/, "document.write("],
  [/\bcreateContextualFragment\s*\(/, "createContextualFragment("],
  [/\bDOMParser\b/, "DOMParser"],
];

function renderers() {
  return readdirSync(__dirname)
    .filter((name) => /\.(js|cjs)$/.test(name) && !/\.test\.cjs$/.test(name))
    .map((name) => ({ name, src: readFileSync(join(__dirname, name), "utf8") }));
}

test("no overlay renderer script writes HTML (feed plates build elements with text)", () => {
  const files = renderers();
  assert.ok(files.some((f) => f.name === "desk-house.js"));
  assert.ok(files.some((f) => f.name === "pet.js"));
  const hits = [];
  for (const { name, src } of files) {
    src.split(/\r?\n/).forEach((line, i) => {
      for (const [re, label] of SINKS) if (re.test(line)) hits.push(`${name}:${i + 1} ${label}`);
    });
  }
  assert.deepEqual(hits, []);
});

test("desk-house paints feed words through text nodes and links only web pages", () => {
  const src = readFileSync(join(__dirname, "desk-house.js"), "utf8");
  assert.match(src, /function el\(tag, props, kids\)/);
  assert.match(src, /node\.textContent = String\(value\)/);
  assert.match(src, /function webLink\(url\)/);
  assert.match(src, /\^https\?:/);
  const H = require("./desk-house.js");
  assert.equal(H.webLink("https://news.example.test/a"), "https://news.example.test/a");
  for (const bad of ["javascript:alert(1)", "data:text/html,x", "./Tilcayo", ""]) assert.equal(H.webLink(bad), "", bad);
  // No markup is built from template strings in the plate painters.
  assert.doesNotMatch(src, /`<(p|li|ul|a|button|strong|span|h4)\b/);
});
