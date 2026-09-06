const { spawnSync } = require("child_process");
const r = spawnSync(process.execPath, ["--test", "--test-name-pattern", "Pale|Wave|Scud", "web/scripts/window-play.test.mjs"], { encoding: "utf8", cwd: process.cwd(), maxBuffer: 20 * 1024 * 1024 });
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
process.exit(r.status == null ? 1 : r.status);
