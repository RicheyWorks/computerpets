const assert = require("node:assert/strict");
const { existsSync, openSync, readSync, closeSync, readdirSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

// The overlay's pet pictures are stored with Git LFS (.gitattributes). A Git without LFS, common on
// Mac and Linux, copies small text pointers instead of PNGs, and every pet on the glass is invisible.
// desktop.ps1 / desktop.sh stop with plain Git LFS words; this test says the same thing to a builder.
const SPRITES = join(__dirname, "sprites");
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const POINTER = "version https://git-lfs";

function head(file, n) {
  const fd = openSync(file, "r");
  try {
    const buf = Buffer.alloc(n);
    const got = readSync(fd, buf, 0, n, 0);
    return buf.subarray(0, got);
  } finally {
    closeSync(fd);
  }
}

test("overlay pet pictures are real PNGs, not Git LFS pointers", () => {
  assert.ok(existsSync(SPRITES), "desktop/renderer/sprites is missing: the copy of the repo is not whole");
  const keys = readdirSync(SPRITES, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  assert.equal(keys.length, 221);
  const pointers = [];
  const notPng = [];
  for (const key of keys) {
    const file = join(SPRITES, key, "idle", "1.png");
    assert.ok(existsSync(file), `${key}/idle/1.png is missing`);
    const bytes = head(file, 23);
    if (bytes.toString("latin1") === POINTER) pointers.push(key);
    else if (!bytes.subarray(0, 8).equals(PNG)) notPng.push(key);
  }
  assert.deepEqual(
    pointers,
    [],
    `${pointers.length} pictures are Git LFS pointers, not PNGs. Install Git LFS (https://git-lfs.com), then run git lfs install and git lfs pull.`,
  );
  assert.deepEqual(notPng, [], "every idle picture starts like a PNG");
});

test("the start scripts check the same picture the harness reads", () => {
  const { readFileSync } = require("node:fs");
  const root = join(__dirname, "..", "..");
  for (const script of ["desktop.ps1", "desktop.sh"]) {
    const src = readFileSync(join(root, script), "utf8");
    assert.match(src, /renderer[\\/]+sprites[\\/]+crow[\\/]+idle[\\/]+1\.png/, script);
    assert.match(src, new RegExp(POINTER.replace(/[./]/g, "\\$&")), script);
  }
});
