const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const { join, resolve } = require("node:path");
const { test } = require("node:test");

// .\desktop.ps1 ran Set-Location into desktop\ and left the keeper's PowerShell there. Every "run .\desktop.ps1
// again" it prints (a stop, the -Check next line) then said .\desktop.ps1 was not recognized in that same window,
// and START-HERE's cd web went looking for desktop\web. Seen following the steps literally in a fresh clone on
// BLACKBEARD. The window now stays in the computerpets folder, however the script ends.
const ROOT = resolve(__dirname, "..", "..");
const ps1 = readFileSync(join(ROOT, "desktop.ps1"), "utf8").replace(/\r\n/g, "\n");

test("desktop.ps1 goes into desktop\\ for its work and always comes back out", () => {
  assert.doesNotMatch(ps1, /Set-Location/, "no one-way Set-Location");
  assert.match(ps1, /\nPush-Location \$PSScriptRoot\\desktop\ntry \{\n/);
  assert.match(ps1, /\n\} finally \{\n {2}Pop-Location\n\}\n$/, "the whole script sits inside try / finally");
  // Every way out is inside the try: the stops, -Check, and the end after npm start.
  const body = ps1.slice(ps1.indexOf("try {\n"), ps1.lastIndexOf("} finally {"));
  for (const way of ["exit 1", "exit 0", "exit $LASTEXITCODE"]) assert.ok(body.includes(way), way);
});

// The real script, run the way a keeper runs it (in the same PowerShell session, from the computerpets folder).
// -Check changes nothing. Windows always has powershell; elsewhere it runs when pwsh is installed.
const PS = process.platform === "win32" ? "powershell" : spawnSync("pwsh", ["-v"], { encoding: "utf8" }).status === 0 ? "pwsh" : "";
test("after .\\desktop.ps1 -Check the same window is still in the computerpets folder", { skip: PS ? false : "no PowerShell here" }, () => {
  // One -Command line, not stdin: Windows PowerShell 5.1 printed nothing for several stdin lines.
  const start = process.platform === "win32" ? ".\\desktop.ps1" : "./desktop.ps1";
  const line = `Set-Location '${ROOT}'; & ${start} -Check | Out-Null; Write-Output "at: $((Get-Location).Path)"`;
  const out = spawnSync(PS, ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", line], {
    encoding: "utf8",
    timeout: 120_000,
  });
  const at = ((out.stdout || "").match(/^at: (.+)$/m) || [])[1];
  assert.equal(resolve(String(at).trim()).toLowerCase(), ROOT.toLowerCase(), out.stdout + out.stderr);
});
