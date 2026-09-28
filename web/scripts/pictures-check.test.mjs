import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import {
  PORTRAIT,
  POINTER,
  STEPS,
  picturesCheckPlugin,
  portraitsState,
  portraitsWords,
} from "./pictures-check.mjs";

const ROOT = join(import.meta.dirname, "..", "..");
const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0xff, 0xdb, 0, 0x43]);
const POINTER_FILE = Buffer.from("version https://git-lfs.github.com/spec/v1\noid sha256:00\nsize 4242\n");
const DIR = join("x", "public");
const CROW = join(DIR, "pets", "crow.jpg");

function fakeIo(files) {
  return {
    readFileSync(file) {
      if (!(file in files)) throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      return files[file];
    },
  };
}

test("portraits: real JPG is ready, a Git LFS pointer is lfs-pointers, no file is missing", () => {
  assert.deepEqual(PORTRAIT, ["pets", "crow.jpg"]);
  assert.equal(portraitsState(DIR, fakeIo({ [CROW]: JPG })), "ready");
  assert.equal(portraitsState(DIR, fakeIo({ [CROW]: POINTER_FILE })), "lfs-pointers");
  assert.equal(portraitsState(DIR, fakeIo({})), "missing");
});

test("the portraits the site serves are stored with Git LFS, so the check is about a real risk", () => {
  const attrs = readFileSync(join(ROOT, ".gitattributes"), "utf8");
  assert.match(attrs, /^web\/public\/pets\/\*\* filter=lfs/m);
  const catalog = readFileSync(join(ROOT, "web", "src", "lib", "pets", "catalog.ts"), "utf8");
  assert.ok(catalog.includes("return `/pets/${key}.jpg`;"), "the site serves /pets/<key>.jpg");
});

test("the dev server words carry the same Git LFS steps as the overlay and the start scripts", () => {
  assert.equal(POINTER, "version https://git-lfs");
  assert.equal(portraitsWords("ready"), "");
  assert.equal(
    portraitsWords("lfs-pointers"),
    "The pet portraits did not download. They come through Git LFS, which this Git does not have yet. Install Git LFS from https://git-lfs.com, then in the computerpets folder run git lfs install and then git lfs pull, and run npm run dev again.",
  );
  assert.match(portraitsWords("missing"), /^The pet portraits are not in this copy of ComputerPets\. Install Git LFS/);
  const overlay = readFileSync(join(ROOT, "desktop", "renderer", "pictures.js"), "utf8");
  for (const src of [overlay, readFileSync(join(ROOT, "desktop.sh"), "utf8"), readFileSync(join(ROOT, "desktop.ps1"), "utf8")]) {
    assert.ok(src.includes(STEPS));
  }
});

test("the vite plugin warns once with the plain line, and stays quiet when the portraits are real", () => {
  const said = [];
  const logger = { warn: (line) => said.push(line) };
  const bad = picturesCheckPlugin(DIR, fakeIo({ [CROW]: POINTER_FILE }));
  bad.configResolved({ logger });
  bad.configResolved({ logger });
  assert.equal(said.length, 1);
  assert.ok(said[0].includes("[computerpets] The pet portraits did not download."));
  const good = picturesCheckPlugin(DIR, fakeIo({ [CROW]: JPG }));
  good.configResolved({ logger });
  assert.equal(said.length, 1);
});

test("vite.config.ts runs the pictures check first", () => {
  const vite = readFileSync(join(ROOT, "web", "vite.config.ts"), "utf8");
  assert.ok(vite.includes('import { picturesCheckPlugin } from "./scripts/pictures-check.mjs";'));
  assert.match(vite, /plugins: \[\s*\/\/[^\n]*\n\s*picturesCheckPlugin\(\),/);
});

test("the real portraits in this checkout are ready (a Git without LFS fails here with the steps)", () => {
  const state = portraitsState();
  assert.equal(state, "ready", portraitsWords(state));
});
