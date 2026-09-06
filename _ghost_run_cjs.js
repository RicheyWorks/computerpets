const { spawnSync } = require("node:child_process");
const r = spawnSync(process.execPath, ["--test", "--test-name-pattern", "Ghost|other guests do not clone|Milk weeds a window-box|Comb leftover|Milk leftover", "desktop/renderer/window-play.test.cjs", "desktop/renderer/leftover-house.test.cjs"], { encoding: "utf8", cwd: process.cwd() });
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
process.exit(r.status == null ? 1 : r.status);
