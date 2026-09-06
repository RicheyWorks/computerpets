const { spawnSync } = require("node:child_process");
function run(args, label) {
  console.log("===", label);
  const r = spawnSync(process.execPath, ["--test", ...args], { encoding: "utf8", cwd: process.cwd() });
  const out = (r.stdout || "") + (r.stderr || "");
  const lines = out.split(/\r?\n/);
  const keep = lines.filter((l) => /^(✔|✖|ℹ|#|not ok|ok |  AssertionError|failing tests|tests |suites |pass |fail |cancelled |skipped |todo |duration_ms|test at )/.test(l) || l.includes("AssertionError") || l.includes("Error"));
  // print summary tail plus failures
  const failIdx = lines.findIndex((l) => l.includes("failing tests"));
  if (failIdx >= 0) {
    console.log(lines.slice(failIdx).join("\n"));
  } else {
    console.log(lines.filter((l) => l.startsWith("ℹ") || l.startsWith("✖") || l.startsWith("✔ Ghost") || l.startsWith("✔ Milk") || l.startsWith("✔ Comb") || l.startsWith("✔ other")).slice(-20).join("\n"));
    console.log(lines.filter((l) => l.startsWith("ℹ ")).join("\n"));
  }
  return r.status;
}
let status = 0;
status = run(["desktop/renderer/leftover-house.test.cjs"], "leftover-house") || status;
status = run(["desktop/renderer/window-play.test.cjs"], "window-play.cjs") || status;
status = run(["web/scripts/window-play.test.mjs"], "window-play.mjs") || status;
process.exit(status == null ? 1 : status);
