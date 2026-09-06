const { spawnSync } = require("node:child_process");
const path = require("node:path");
const r = spawnSync(process.execPath, ["--test", path.join(__dirname, "desktop/renderer/leftover-house.test.cjs")], {
  cwd: __dirname,
  stdio: "inherit",
  env: process.env,
});
process.exit(r.status == null ? 1 : r.status);
