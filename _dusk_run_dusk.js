const { spawnSync } = require("node:child_process");
const r = spawnSync(process.execPath, ["--test", "--test-name-pattern", "lamp-edge|lamp-edge rim", "desktop/renderer/window-play.test.cjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  stdio: "pipe",
});
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
process.exit(r.status == null ? 1 : r.status);