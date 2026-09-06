const { spawnSync } = require("child_process");
const r = spawnSync(process.execPath, ["--test", "web/scripts/window-play.test.mjs"], { encoding: "utf8", cwd: process.cwd(), maxBuffer: 40 * 1024 * 1024 });
const out = (r.stdout || "") + (r.stderr || "");
const lines = out.split(/\r?\n/);
const tail = lines.filter((l) => /^(✔|✖|ℹ)/.test(l) || l.includes("Assertion") || l.includes("Error") || l.includes("fail"));
process.stdout.write(tail.slice(-30).join("\n") + "\n");
process.exit(r.status == null ? 1 : r.status);
