const { spawnSync } = require("node:child_process");
function run(pattern, file) {
  console.log("PATTERN", pattern, file);
  const r = spawnSync(process.execPath, ["--test", "--test-name-pattern", pattern, file], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "pipe",
  });
  process.stdout.write(r.stdout || "");
  process.stderr.write(r.stderr || "");
  console.log("status", r.status);
  return r.status;
}
let st = 0;
st = run("Dusk leftover rims", "desktop/renderer/window-play.test.cjs") || st;
st = run("refits Dusk", "desktop/renderer/window-play.test.cjs") || st;
st = run("Dusk leftover rims", "web/scripts/window-play.test.mjs") || st;
st = run("refits Dusk", "web/scripts/window-play.test.mjs") || st;
process.exit(st);