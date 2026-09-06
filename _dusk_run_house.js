const { spawnSync } = require("node:child_process");
const r = spawnSync(process.execPath, ["--test", "desktop/renderer/leftover-house.test.cjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  stdio: "pipe",
});
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
process.exit(r.status == null ? 1 : r.status);