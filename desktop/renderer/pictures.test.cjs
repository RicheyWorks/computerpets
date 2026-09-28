const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const P = require("./pictures.js");

// The overlay started straight from `npm start` (no desktop.sh / desktop.ps1) must still say when the
// pet pictures are Git LFS pointers, instead of opening a glass of invisible pets.
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, 0, 0, 0, 1, 0, 0, 0, 1]);
const POINTER_FILE = Buffer.from(
  "version https://git-lfs.github.com/spec/v1\noid sha256:0000000000000000000000000000000000000000000000000000000000000000\nsize 4242\n",
);

function fakeIo(files) {
  return {
    readFileSync(file) {
      if (!(file in files)) {
        const err = new Error("ENOENT");
        err.code = "ENOENT";
        throw err;
      }
      return files[file];
    },
  };
}

const DIR = join("x", "renderer");
const CROW = join(DIR, "sprites", "crow", "idle", "1.png");

test("picturesState: a real PNG is ready, an LFS pointer is lfs-pointers, no file is missing", () => {
  assert.equal(P.picturesState(DIR, fakeIo({ [CROW]: PNG }), join), "ready");
  assert.equal(P.picturesState(DIR, fakeIo({ [CROW]: POINTER_FILE }), join), "lfs-pointers");
  assert.equal(P.picturesState(DIR, fakeIo({}), join), "missing");
});

test("the overlay checks the same picture as desktop.sh, desktop.ps1 and the harness", () => {
  assert.deepEqual(P.PICTURE, ["sprites", "crow", "idle", "1.png"]);
  assert.equal(P.POINTER, "version https://git-lfs");
  const harness = readFileSync(join(__dirname, "..", "..", "client", "computerpets_client", "app_harness.py"), "utf8");
  assert.ok(harness.includes('LAUNCH_PICTURE = ("desktop", "renderer", "sprites", "crow", "idle", "1.png")'));
});

test("the words give the same Git LFS steps as the start scripts, in plain words", () => {
  const root = join(__dirname, "..", "..");
  for (const script of ["desktop.sh", "desktop.ps1"]) {
    const src = readFileSync(join(root, script), "utf8");
    assert.ok(src.includes(P.STEPS), `${script} carries the same steps`);
  }
  const w = P.words("lfs-pointers");
  assert.equal(w.message, "The pet pictures did not download.");
  assert.equal(
    w.detail,
    "They come through Git LFS, which this Git does not have yet. Install Git LFS from https://git-lfs.com, then in the computerpets folder run git lfs install and then git lfs pull, and start ComputerPets again.",
  );
  assert.equal(w.link, "https://git-lfs.com");
  const gone = P.words("missing");
  assert.match(gone.detail, /^The pet pictures are not in this copy of ComputerPets\. Install Git LFS/);
  for (const text of [w.message, w.detail, gone.detail]) {
    assert.doesNotMatch(text, /\b(LFS pointer|blob|oid|sha256|smudge|filter)\b/i, "no Git plumbing words");
  }
});

test("tray rows while pictures are missing: say it, how to fix, open git-lfs.com, quit", () => {
  const rows = P.trayRows(P.words("lfs-pointers"));
  assert.deepEqual(
    rows.map((r) => r.label || r.type),
    ["Pet pictures did not download", "How to fix…", "Open git-lfs.com", "separator", "Quit"],
  );
  assert.equal(rows[0].enabled, false);
  assert.deepEqual(rows.filter((r) => r.action).map((r) => r.action), ["explain", "link", "quit"]);
});

test("main.cjs checks the pictures before it opens the overlay window, and shows the words", () => {
  const main = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
  assert.ok(main.includes('const Pictures = require("./renderer/pictures.js");'));
  const boot = main.slice(main.indexOf("function bootDesk()"));
  const check = boot.indexOf('Pictures.picturesState(path.join(__dirname, "renderer"), fs, path.join)');
  const open = boot.indexOf("createWindow();");
  assert.ok(check > 0 && open > check, "the picture check runs before createWindow");
  const gate = boot.slice(check, open);
  assert.match(gate, /if \(pictures !== "ready"\)/);
  assert.match(gate, /createTray\(\);\s*showPicturesMessage\(\);\s*return;/);
  assert.match(main, /dialog\s*\.showMessageBox\(\{[\s\S]*?message: w\.message,\s*detail: w\.detail,/);
  assert.match(main, /if \(picturesGate\) \{\s*showPicturesMessage\(\);\s*return;\s*\}/, "a second start shows the words again");
  assert.match(main, /function openWebPage\(url\) \{\s*return OpenLink\.openLink\(url, linkDeps\);/, "git-lfs.com goes through the link gate");
  assert.match(main, /if \(r\.response === 0\) openWebPage\(w\.link\);/);
});
