const { spawnSync } = require("node:child_process");
const r = spawnSync(process.execPath, ["--test", "--test-name-pattern", "Ghost week|Milk weed|Comb waggle", "web/scripts/window-play.test.mjs"], { encoding: "utf8", cwd: process.cwd() });
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
process.exit(r.status == null ? 1 : r.status);
