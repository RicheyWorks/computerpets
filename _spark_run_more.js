const { spawnSync } = require("node:child_process");
function run(args) {
  const r = spawnSync(process.execPath, args, { encoding: "utf8", cwd: process.cwd() });
  process.stdout.write(r.stdout || "");
  process.stderr.write(r.stderr || "");
  return r.status ?? 1;
}
let code = run(["--test", "desktop/renderer/leftover-house.test.cjs"]);
if (code !== 0) process.exit(code);
code = run(["--test", "--test-name-pattern=Spark the firefly", "web/scripts/window-play.test.mjs"]);
process.exit(code);
