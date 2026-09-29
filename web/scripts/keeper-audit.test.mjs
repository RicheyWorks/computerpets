import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Fresh-clone keeper audit (September 2026): what a new keeper reads first,
// followed literally from a shallow clone on Linux and Windows PowerShell.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const startSrc = readFileSync(join(repo, "docs/START-HERE.md"), "utf8");
const readmeSrc = readFileSync(join(repo, "README.md"), "utf8");

function section(src, heading) {
  const at = src.indexOf(`\n## ${heading}\n`);
  assert.ok(at >= 0, `missing section ${heading}`);
  const next = src.indexOf("\n## ", at + 4);
  return src.slice(at, next < 0 ? undefined : next);
}

test("a fresh web npm install leaves the tracked lock alone (lock matches package.json)", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
  // npm rewrites the whole lock when the names differ; the dirty file then
  // blocks a keeper's next git pull.
  assert.equal(lock.name, pkg.name);
  assert.equal(lock.packages[""].name, pkg.name);
  // eslint's own ajv 6 is nested under eslint, not hoisted over ajv 8.
  assert.ok(lock.packages["node_modules/eslint/node_modules/ajv"], "eslint ajv nested");
});

test("npm ci works with npm 10 (Node 22, the README's floor) and npm 11 (Node 24)", () => {
  // nitro's unstorage has an optional peer lru-cache ^11. With babel's lru-cache 5 hoisted, npm 10 wants a
  // nested copy under nitro ("Missing: lru-cache@11.5.3 from lock file") and npm 11 prunes it, so no lock
  // could satisfy both. lru-cache 11 as a dev dependency hoists 11 and nests babel's 5: both npm take it.
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
  assert.equal(pkg.devDependencies["lru-cache"], "^11.2.6");
  assert.equal(lock.packages[""].devDependencies["lru-cache"], "^11.2.6");
  assert.match(lock.packages["node_modules/lru-cache"].version, /^11\./);
  assert.match(lock.packages["node_modules/@babel/helper-compilation-targets/node_modules/lru-cache"].version, /^5\./);
  assert.equal(lock.packages["node_modules/nitro/node_modules/lru-cache"], undefined);
});

test("the Linux start copies the pets and checks Node before sh desktop.sh", () => {
  const linux = section(startSrc, "Linux");
  const clone = linux.indexOf("git clone https://github.com/RicheyWorks/computerpets");
  const start = linux.indexOf("sh desktop.sh\n");
  assert.ok(clone > 0 && start > clone, "clone comes before the start");
  assert.match(linux, /version 22 or newer/);
  assert.match(linux, /node -v/);
  assert.match(linux, /still missing their pictures/);
  assert.match(linux, /git lfs pull/);
});

test("a partial git lfs pull is named on every start page", () => {
  assert.match(section(startSrc, "What if nothing walks"), /still missing their pictures[\s\S]*git lfs pull/);
  assert.match(section(startSrc, "Mac"), /still missing their pictures/);
  assert.match(readmeSrc, /some pets are still missing their pictures, type `git lfs pull`/);
});

test("new keepers are told not to force the npm audit fix or touch the builders' notes", () => {
  assert.match(startSrc, /Do not type that\. It swaps in a different Electron/);
  assert.match(startSrc, /odd names that start with `_`\. Those are the builders' notes\. Leave them alone\./);
});

test("the blotter has Mac and Linux lines and names the Linux screen pieces", () => {
  // The PowerShell blotter section stays PowerShell only; Mac and Linux get their own short section after it.
  assert.ok(startSrc.indexOf("\n## Blotter (optional)\n") < startSrc.indexOf("\n## Blotter on Mac or Linux\n"));
  const blotter = section(startSrc, "Blotter on Mac or Linux");
  assert.match(blotter, /python3 -m venv \.venv\n\. \.venv\/bin\/activate\npython -m pip install -e \.\npython -m computerpets_client/);
  assert.match(blotter, /sudo apt install/);
});
