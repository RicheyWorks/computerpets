const { spawnSync } = require("node:child_process");
function run(file) {
  console.log("====", file);
  const r = spawnSync(process.execPath, ["--test", file], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "pipe",
  });
  const out = (r.stdout || "") + (r.stderr || "");
  const lines = out.split(/\r?\n/);
  const fails = lines.filter((ln) => ln.includes("fail") || ln.startsWith("not ok") || ln.includes("AssertionError") || ln.startsWith("✖") || ln.includes("Error ["));
  const summary = lines.filter((ln) => /^ℹ /.test(ln) || /^# /.test(ln) || ln.startsWith("tests ") || ln.includes("duration_ms"));
  for (const ln of summary) console.log(ln);
  if (r.status !== 0) {
    console.log("--- fails ---");
    console.log(fails.slice(0, 60).join("\n"));
    const err = lines.filter((ln) => ln.includes("AssertionError") || ln.includes("error:") || ln.includes("failed"));
    console.log(err.slice(0, 40).join("\n"));
  }
  console.log("status", r.status);
  return r.status || 0;
}
const a = run("desktop/renderer/window-play.test.cjs");
const b = run("web/scripts/window-play.test.mjs");
process.exit(a || b);