const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const { join } = require("node:path");
const { test } = require("node:test");

// The start scripts' "pieces" check. After the three-line start (cd desktop; npm install; npm start) the pieces were
// complete, but -Check / --check said "unfinished": only the start script's own stamp counted as a finished install.
// npm writes node_modules/.package-lock.json last, when an install finishes, so that counts too. And since Electron
// 42, npm install no longer downloads Electron itself (it comes the first time Electron runs), so the pieces are
// ready only once node_modules/electron/path.txt names an Electron that is really there.
const ROOT = join(__dirname, "..", "..");
const ps1 = fs.readFileSync(join(ROOT, "desktop.ps1"), "utf8").replace(/\r\n/g, "\n");
const sh = fs.readFileSync(join(ROOT, "desktop.sh"), "utf8").replace(/\r\n/g, "\n");

/** A desktop folder: package.json, and node_modules pieces as asked. Times are seconds ago. */
function desk(o) {
  const dir = fs.mkdtempSync(join(os.tmpdir(), "cp-pieces-"));
  const at = (file, ago) => {
    const t = new Date(Date.now() - ago * 1000);
    fs.utimesSync(file, t, t);
  };
  fs.writeFileSync(join(dir, "package.json"), "{}");
  at(join(dir, "package.json"), o.packageAgo ?? 60);
  const el = join(dir, "node_modules", "electron");
  if (o.electronPackage) {
    fs.mkdirSync(el, { recursive: true });
    fs.writeFileSync(join(el, "package.json"), "{}");
  }
  for (const [name, ago] of [[".package-lock.json", o.finishedAgo], [".computerpets-installed", o.stampAgo]]) {
    if (ago == null) continue;
    fs.writeFileSync(join(dir, "node_modules", name), "done");
    at(join(dir, "node_modules", name), ago);
  }
  const exe = process.platform === "win32" ? "electron.exe" : "electron";
  if (o.pathTxt) fs.writeFileSync(join(el, "path.txt"), exe);
  if (o.binary) {
    fs.mkdirSync(join(el, "dist"), { recursive: true });
    fs.writeFileSync(join(el, "dist", exe), "");
  }
  return { dir, done: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

/** Every state, in the order a keeper meets them. */
const CASES = [
  ["a fresh clone", {}, "missing"],
  ["npm install closed halfway", { electronPackage: true }, "unfinished"],
  ["a pull brought a newer package.json", { electronPackage: true, finishedAgo: 120 }, "changed"],
  ["npm install finished, Electron not downloaded yet (before the first npm start)", { electronPackage: true, finishedAgo: 10 }, "unfinished"],
  ["path.txt left by a download that stopped", { electronPackage: true, finishedAgo: 10, pathTxt: true }, "unfinished"],
  ["the three-line start: npm install, then npm start fetched Electron (no stamp)", { electronPackage: true, finishedAgo: 10, pathTxt: true, binary: true }, "ready"],
  ["the start script's own run (stamp)", { electronPackage: true, stampAgo: 5, pathTxt: true, binary: true }, "ready"],
  ["stamp older than package.json, npm's record newer", { electronPackage: true, stampAgo: 120, finishedAgo: 5, pathTxt: true, binary: true }, "ready"],
];

test("both scripts read npm's own finished record and Electron's own path, not only the stamp", () => {
  for (const src of [ps1, sh]) {
    assert.match(src, /node_modules[\\/]\.package-lock\.json/);
    assert.match(src, /node_modules[\\/]\.computerpets-installed/);
    assert.match(src, /node_modules[\\/]electron[\\/]dist/);
    assert.match(src, /node node_modules[\\/]electron[\\/]install\.js/, "the start gets Electron itself right after npm install");
    assert.match(src, /Getting Electron, the overlay piece \(about 100 MB\)\. Leave this window open\./);
    assert.doesNotMatch(src, /npm rebuild electron/, "npm rebuild runs no download since Electron 42");
  }
});

// The sh check itself, cut from desktop.sh and run in each folder.
const SH = spawnSync("sh", ["-c", "true"]).status === 0 ? "sh" : "";
test("desktop.sh's pieces check on real folders", { skip: SH ? false : "no sh here" }, () => {
  const from = sh.indexOf("electron=node_modules/electron/path.txt");
  const to = sh.indexOf("\n}\n", sh.indexOf("pieces() {")) + 3;
  assert.ok(from > 0 && to > from, "desktop.sh has the pieces check");
  const text = sh.slice(from, to);
  for (const [name, o, want] of CASES) {
    const d = desk(o);
    try {
      const out = spawnSync(SH, ["-c", `${text}\npieces`], { cwd: d.dir, encoding: "utf8" });
      assert.equal((out.stdout || "").trim(), want, `${name}: ${out.stderr}`);
    } finally {
      d.done();
    }
  }
});

// The PowerShell check itself, cut from desktop.ps1 (no script file is written: it goes as -EncodedCommand).
const PS = process.platform === "win32" ? "powershell" : spawnSync("pwsh", ["-v"], { encoding: "utf8" }).status === 0 ? "pwsh" : "";
test("desktop.ps1's pieces check on real folders", { skip: PS ? false : "no PowerShell here" }, () => {
  const from = ps1.indexOf('$electron = "node_modules\\electron\\path.txt"');
  const fnAt = ps1.indexOf("function Get-Pieces {", from);
  const indent = ps1.slice(ps1.lastIndexOf("\n", fnAt) + 1, fnAt);
  const to = ps1.indexOf(`\n${indent}}\n`, fnAt) + indent.length + 2;
  assert.ok(from > 0 && fnAt > from && to > fnAt, "desktop.ps1 has the pieces check");
  let text = ps1.slice(from, to);
  if (process.platform !== "win32") text = text.replace(/\\/g, "/");
  for (const [name, o, want] of CASES) {
    const d = desk(o);
    try {
      const script = `Set-StrictMode -Version Latest\nSet-Location '${d.dir}'\n${text}\nWrite-Output "pieces=$(Get-Pieces)"\n`;
      const out = spawnSync(PS, ["-NoProfile", "-EncodedCommand", Buffer.from(script, "utf16le").toString("base64")], { encoding: "utf8", timeout: 60_000 });
      const got = ((out.stdout || "").match(/pieces=(\w+)/) || [])[1];
      assert.equal(got, want, `${name}: ${out.stdout}${out.stderr}`);
    } finally {
      d.done();
    }
  }
});
