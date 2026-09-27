#!/usr/bin/env node
// Type-check web/ and hold the line on known tsc output.
//
// The web tree has a known backlog of `tsc --noEmit` output. This does not
// pretend it is zero. It counts the lines tsc prints and compares them with
// web/tsc-baseline.txt: more lines fail, fewer lines pass with a note so the
// baseline can be lowered. Used by scripts/test-all.ps1, scripts/test-all.sh,
// and the CI web job.
//
//   node scripts/tsc-baseline.mjs            check against the baseline
//   node scripts/tsc-baseline.mjs --update   write the current count as the baseline
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const baselineFile = join(web, "tsc-baseline.txt");
const tsc = join(web, "node_modules", "typescript", "bin", "tsc");

if (!existsSync(tsc)) {
  console.error("tsc: typescript is not installed. Run `npm ci` in web/ first.");
  process.exit(2);
}

const run = spawnSync(process.execPath, [tsc, "--noEmit", "--pretty", "false"], {
  cwd: web,
  encoding: "utf8",
  maxBuffer: 256 * 1024 * 1024,
});
if (run.error) {
  console.error(`tsc: could not run: ${run.error.message}`);
  process.exit(2);
}
const lines = `${run.stdout || ""}${run.stderr || ""}`.split(/\r?\n/).filter((line) => line.length > 0);
const count = lines.length;
const errors = lines.filter((line) => /error TS\d+:/.test(line)).length;

if (process.argv.includes("--update")) {
  writeFileSync(baselineFile, `${count}\n`);
  console.log(`tsc: ${count} lines (${errors} errors). Wrote web/tsc-baseline.txt.`);
  process.exit(0);
}

const baseline = Number.parseInt(readFileSync(baselineFile, "utf8").trim(), 10);
if (!Number.isInteger(baseline) || baseline < 0) {
  console.error("tsc: web/tsc-baseline.txt must hold one whole number.");
  process.exit(2);
}

if (count > baseline) {
  console.log("Last 40 lines of tsc output (the new ones may be anywhere; see the full run):");
  console.log(lines.slice(-40).join("\n"));
  console.error(`tsc: ${count} lines (${errors} errors), baseline ${baseline}. ${count - baseline} new line(s). FAIL`);
  process.exit(1);
}
if (count < baseline) {
  console.log(
    `tsc: ${count} lines (${errors} errors), baseline ${baseline}. ${baseline - count} fewer. PASS. ` +
      "Lower the baseline with `node scripts/tsc-baseline.mjs --update`."
  );
} else {
  console.log(`tsc: ${count} lines (${errors} errors), baseline ${baseline}. PASS`);
}