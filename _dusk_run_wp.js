const { spawnSync } = require("node:child_process");
function run(args, label) {
  console.log("==== " + label);
  const r = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "pipe",
  });
  const out = (r.stdout || "") + (r.stderr || "");
  const lines = out.split(/\r?\n/);
  for (const ln of lines) {
    if (ln.startsWith("not ok") || ln.startsWith("# fail") || ln.includes("AssertionError") || ln.includes("Error [") || ln.startsWith("✖") || ln.startsWith("✔ Dusk") || ln.startsWith("✔ Shard") || ln.includes("fail ") || ln.includes("pass ") || ln.includes("tests ") || ln.includes("duration_ms") || ln.includes("info ") || ln.includes("# tests") || ln.includes("# pass") || ln.includes("# fail")) {
      console.log(ln);
    }
  }
  if (r.status !== 0) {
    const failBits = lines.filter((ln) => /fail|Error|not ok|✖/.test(ln)).slice(0, 80);
    console.log(failBits.join("\n"));
  }
  console.log("status", r.status);
  return r.status;
}
const a = run(["--test", "--test-name-pattern", "Dusk leftover|Shard facets|moved window refits Dusk|moved window refits Shard", "desktop/renderer/window-play.test.cjs"], "cjs dusk+shard");
const b = run(["--test", "--test-name-pattern", "Dusk leftover|Shard facets|moved window refits Dusk|moved window refits Shard", "web/scripts/window-play.test.mjs"], "mjs dusk+shard");
process.exit((a || 0) || (b || 0));