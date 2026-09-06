const { spawnSync } = require("child_process");
const r = spawnSync(process.execPath, ["--test", "desktop/renderer/window-play.test.cjs"], { encoding: "utf8", cwd: process.cwd(), maxBuffer: 40 * 1024 * 1024 });
const out = (r.stdout || "") + (r.stderr || "");
const lines = out.split(/\r?\n/);
const keep = lines.filter((l) => /^(✔|✖|ℹ|#|not ok|ok |fail|tests |  )/i.test(l) || l.includes("fail") || l.includes("Error") || l.includes("Assertion"));
process.stdout.write(keep.slice(-80).join("\n") + "\n");
if (r.status !== 0) {
  const err = lines.filter((l) => l.includes("AssertionError") || l.includes("✖") || l.includes("not ok") || l.includes("fail"));
  process.stdout.write("FAILURES:\n" + err.slice(0, 40).join("\n") + "\n");
}
process.exit(r.status == null ? 1 : r.status);
