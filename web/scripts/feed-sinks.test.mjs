/**
 * The web desk renders feed words (news, Wikipedia, weather places, coin and NFT names,
 * radio stations) as React children, which React escapes. This keeps raw-HTML escape
 * hatches out of web/src so a feed title can never become markup.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SINKS = [
  [/dangerouslySetInnerHTML/, "dangerouslySetInnerHTML"],
  [/\.innerHTML\s*[+]?=/, "innerHTML ="],
  [/\.outerHTML\s*[+]?=/, "outerHTML ="],
  [/\binsertAdjacentHTML\s*\(/, "insertAdjacentHTML("],
  [/\bdocument\.write(ln)?\s*\(/, "document.write("],
  [/\bcreateContextualFragment\s*\(/, "createContextualFragment("],
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(name)) out.push(path);
  }
  return out;
}

test("web/src has no raw-HTML sink, so feed words render as escaped text", () => {
  const files = walk(join(root, "src"));
  assert.ok(files.some((f) => f.endsWith(join("desk", "desk-plates.tsx"))));
  const hits = [];
  for (const file of files) {
    readFileSync(file, "utf8")
      .split(/\r?\n/)
      .forEach((line, i) => {
        for (const [re, label] of SINKS) if (re.test(line)) hits.push(`${relative(root, file)}:${i + 1} ${label}`);
      });
  }
  assert.deepEqual(hits, []);
});

test("the web news plate links only a real headline URL and shows the rest as text", () => {
  const plates = readFileSync(join(root, "src/components/desk/desk-plates.tsx"), "utf8");
  assert.match(plates, /\{item\.url \? \(/);
  assert.match(plates, /\) : fav\.url \? \(/);
});
