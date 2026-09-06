const { spawnSync } = require("child_process");
const r = spawnSync(process.execPath, ["--test", "desktop/renderer/leftover-house.test.cjs"], { stdio: "inherit", cwd: process.cwd() });
process.exit(r.status == null ? 1 : r.status);
