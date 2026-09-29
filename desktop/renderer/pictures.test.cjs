const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const { readFileSync } = fs;
const os = require("node:os");
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
  const check = boot.indexOf('Pictures.picturesSurvey(path.join(__dirname, "renderer"), fs, path.join)');
  const open = boot.indexOf("createWindow();");
  assert.ok(check > 0 && open > check, "the picture check runs before createWindow");
  const gate = boot.slice(check, open);
  assert.match(gate, /const pictures = survey\.state;\n\s+if \(pictures !== "ready"\) \{\n\s+picturesGate = Pictures\.words\(pictures, survey\);/);
  assert.match(gate, /createTray\(\);\s*await learnTrayHost\(\);\s*showPicturesMessage\(\);\s*return;/);
  assert.match(main, /dialog\s*\.showMessageBox\(\{[\s\S]*?message: w\.message,\s*detail: w\.detail,/);
  assert.match(main, /if \(picturesGate\) \{\s*showPicturesMessage\(\);\s*return;\s*\}/, "a second start shows the words again");
  assert.match(main, /function openWebPage\(url\) \{\s*return OpenLink\.openLink\(url, linkDeps\);/, "git-lfs.com goes through the link gate");
  assert.match(main, /if \(r\.response === 0\) openWebPage\(w\.link\);/);
});

/**
 * A real sprites folder in a temp dir: crow and owl have real pictures; `pointers` pets hold a Git LFS pointer in one
 * frame (a pull that stopped partway leaves exactly that). Real pictures here are tiny PNG headers: under 1 KB, so
 * the check really opens them and must still call them pictures.
 */
function spritesFolder(pointers, real = ["crow", "owl"]) {
  const dir = fs.mkdtempSync(join(os.tmpdir(), "cp-pictures-"));
  const renderer = join(dir, "renderer");
  for (const pet of real) {
    fs.mkdirSync(join(renderer, "sprites", pet, "idle"), { recursive: true });
    fs.writeFileSync(join(renderer, "sprites", pet, "idle", "1.png"), PNG);
  }
  for (const pet of pointers) {
    fs.mkdirSync(join(renderer, "sprites", pet, "idle"), { recursive: true });
    fs.mkdirSync(join(renderer, "sprites", pet, "walk"), { recursive: true });
    fs.writeFileSync(join(renderer, "sprites", pet, "idle", "1.png"), PNG);
    fs.writeFileSync(join(renderer, "sprites", pet, "walk", "2.png"), POINTER_FILE);
  }
  return { dir, renderer, done: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

test("a git lfs pull that stopped partway is not ready: the check counts the pets still missing pictures", () => {
  const one = spritesFolder(["fox"]);
  try {
    // Before: only crow/idle/1.png was read, so a crow fetched before the pull stopped said "ready".
    assert.deepEqual(P.picturesSurvey(one.renderer, fs, join), { state: "partial", missing: 1, total: 3 });
    assert.equal(P.picturesState(one.renderer, fs, join), "partial");
  } finally {
    one.done();
  }
  const two = spritesFolder(["fox", "yak"]);
  try {
    assert.deepEqual(P.picturesSurvey(two.renderer, fs, join), { state: "partial", missing: 2, total: 4 });
  } finally {
    two.done();
  }
  const none = spritesFolder([]);
  try {
    assert.deepEqual(P.picturesSurvey(none.renderer, fs, join), { state: "ready", missing: 0, total: 2 });
  } finally {
    none.done();
  }
  const all = spritesFolder(["crow", "owl"], []);
  try {
    assert.equal(P.picturesState(all.renderer, fs, join), "lfs-pointers", "every pet a pointer: this Git has no LFS");
  } finally {
    all.done();
  }
});

test("a partial pull says how many pets are still missing pictures and to run git lfs pull, in plain words", () => {
  const w = P.words("partial", { missing: 12, total: 221 });
  assert.equal(w.message, "Some pet pictures did not download.");
  assert.equal(
    w.detail,
    "12 of 221 pets are still missing their pictures: Git LFS stopped before it fetched them all. In the computerpets folder run git lfs pull, and start ComputerPets again.",
  );
  assert.equal(w.tray, "Some pet pictures did not download");
  assert.equal(P.petsLine(1, 221), "1 of 221 pets is still missing its pictures");
  assert.doesNotMatch(w.detail, /\b(LFS pointer|blob|oid|sha256|smudge|filter)\b/i, "no Git plumbing words");
  assert.deepEqual(P.trayRows(w).map((r) => r.label || r.type), ["Some pet pictures did not download", "How to fix…", "Open git-lfs.com", "separator", "Quit"]);
});

test("the check is cheap enough for every start: every real pet folder in well under a second", () => {
  const renderer = join(__dirname);
  const t = process.hrtime.bigint();
  const got = P.picturesSurvey(renderer, fs, join);
  const ms = Number(process.hrtime.bigint() - t) / 1e6;
  assert.ok(got.total >= 1, "the sprites folder was walked");
  assert.ok(ms < 1500, `took ${ms} ms`);
});

test("desktop.sh and desktop.ps1 look at every pet's folder and say the same count and step", () => {
  const root = join(__dirname, "..", "..");
  const sh = readFileSync(join(root, "desktop.sh"), "utf8").replace(/\r\n/g, "\n");
  const ps1 = readFileSync(join(root, "desktop.ps1"), "utf8").replace(/\r\n/g, "\n");
  assert.ok(sh.includes(`find "$sprites" -type f -name '*.png' -size -1024c -exec grep -l '^version https://git-lfs' {} +`), "one find and one grep, small files only");
  assert.ok(sh.includes('still="$gone of $pets pets are still missing their pictures"'));
  assert.ok(sh.includes('stop_start "$still. Git LFS stopped before it fetched them all. In the computerpets folder run git lfs pull, and run sh desktop.sh again."'));
  assert.ok(ps1.includes("if ($f.Length -ge 1024) { continue }"), "small files only");
  assert.ok(ps1.includes('$still = "$gone of $pets pets are still missing their pictures"'));
  assert.ok(ps1.includes('Stop-Start "$still. Git LFS stopped before it fetched them all. In the computerpets folder run git lfs pull, and run .\\desktop.ps1 again."'));
  // The partial words come before the stop that says to install Git LFS (a partial pull already has it).
  assert.ok(sh.indexOf('[ "$seen" != partial ] || stop_start') < sh.indexOf('[ "$seen" = ready ] || [ "$lfs" = no ] || stop_start'));
  assert.ok(ps1.search(/if \(\$seen -eq "partial"\) \{\n\s+Stop-Start/) < ps1.search(/if \(\$seen -ne "ready"\) \{\n\s+Stop-Start/));
});

// The PowerShell scan itself, run from desktop.ps1's own text on a partial folder (no script file is written: the
// function goes to PowerShell on stdin). Windows always has powershell; elsewhere it runs when pwsh is installed.
const PS = process.platform === "win32" ? "powershell" : spawnSync("pwsh", ["-v"], { encoding: "utf8" }).status === 0 ? "pwsh" : "";
test("desktop.ps1's picture scan counts a partial pull on a real folder", { skip: PS ? false : "no PowerShell here" }, () => {
  const ps1 = readFileSync(join(__dirname, "..", "..", "desktop.ps1"), "utf8").replace(/\r\n/g, "\n");
  const from = ps1.indexOf('$sprites = "renderer\\sprites"');
  const fnAt = ps1.indexOf("function Get-Pictures {", from);
  const indent = ps1.slice(ps1.lastIndexOf("\n", fnAt) + 1, fnAt);
  const to = ps1.indexOf(`\n${indent}}\n`, fnAt) + indent.length;
  assert.ok(from > 0 && fnAt > from && to > fnAt, "desktop.ps1 has the scan");
  let scan = ps1.slice(from, to + 2);
  if (process.platform !== "win32") scan = scan.replace(/\\/g, "/");
  const run = (dir) => {
    // -EncodedCommand (the script text as UTF-16LE base64) keeps the lines whole. Windows PowerShell 5.1 read
    // from stdin line by line lost the script-scope counts the function sets, and quoting a multi-line
    // -Command argument is fragile.
    const text = `Set-Location '${dir}'\n${scan}\n$seen = Get-Pictures\nWrite-Output "$seen $gone $pets"\n`;
    const out = spawnSync(PS, ["-NoProfile", "-EncodedCommand", Buffer.from(text, "utf16le").toString("base64")], {
      encoding: "utf8",
      timeout: 60_000,
    });
    return (out.stdout || "").trim().split(/\r?\n/).pop();
  };
  const one = spritesFolder(["fox"]);
  const all = spritesFolder(["crow", "owl"], []);
  const none = spritesFolder([]);
  try {
    // desktop.ps1 runs in the desktop folder, where renderer\sprites is.
    assert.equal(run(one.dir), "partial 1 3");
    assert.equal(run(all.dir), "lfs-pointers 2 2");
    assert.equal(run(none.dir), "ready 0 2");
  } finally {
    one.done();
    all.done();
    none.done();
  }
});
