const { spawnSync } = require("node:child_process");
const path = require("node:path");
const file = process.argv[2];
const r = spawnSync(process.execPath, ["--test", file], {
  cwd: path.join(__dirname),
  stdio: "inherit",
  env: process.env,
});
process.exit(r.status == null ? 1 : r.status);
