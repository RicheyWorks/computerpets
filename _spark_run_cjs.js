const { spawnSync } = require("node:child_process");
const r = spawnSync(process.execPath, ["--test", "--test-name-pattern=Spark the firefly|ink-dusk glow", "desktop/renderer/window-play.test.cjs"], { encoding: "utf8", cwd: process.cwd() });
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
process.exit(r.status ?? 1);
