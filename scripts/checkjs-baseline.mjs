#!/usr/bin/env node
// Type-check the desktop overlay JavaScript and hold the line on known tsc errors.
//
// desktop/ is plain JavaScript (renderer, main, presence, license). tsc with checkJs reads it using
// desktop/tsconfig.checkjs.json and web's TypeScript (desktop has no TypeScript of its own). This counts
// the errors and compares them with desktop/checkjs-baseline.txt: more errors fail, fewer pass with a
// note so the baseline can be lowered. Used by scripts/test-all.ps1 and scripts/test-all.sh.
//
//   node scripts/checkjs-baseline.mjs            check against the baseline
//   node scripts/checkjs-baseline.mjs --update   write the current count as the baseline
//   node scripts/checkjs-baseline.mjs --list     also print every error line
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const desktop = join(root, "desktop");
const config = join(desktop, "tsconfig.checkjs.json");
const baselineFile = join(desktop, "checkjs-baseline.txt");
const tsc = join(root, "web", "node_modules", "typescript", "bin", "tsc");

if (!existsSync(tsc)) {
  console.error("checkjs: typescript is not installed. Run `npm ci` in web/ first (desktop uses web's TypeScript).");
  process.exit(2);
}

const run = spawnSync(process.execPath, [tsc, "-p", config, "--pretty", "false"], {
  cwd: desktop,
  encoding: "utf8",
  maxBuffer: 256 * 1024 * 1024,
});
if (run.error) {
  console.error(`checkjs: could not run tsc: ${run.error.message}`);
  process.exit(2);
}
const lines = `${run.stdout || ""}${run.stderr || ""}`.split(/\r?\n/).filter((line) => line.length > 0);
const errorLines = lines.filter((line) => /error TS\d+:/.test(line));
const errors = errorLines.length;
const files = new Set(errorLines.map((line) => line.replace(/\(\d+,\d+\).*$/, ""))).size;
if (run.status !== 0 && errors === 0) {
  console.log(lines.slice(-20).join("\n"));
  console.error("checkjs: tsc failed without error lines (bad config?). FAIL");
  process.exit(2);
}
if (process.argv.includes("--list")) console.log(errorLines.join("\n"));

if (process.argv.includes("--update")) {
  writeFileSync(baselineFile, `${errors}\n`);
  console.log(`checkjs: ${errors} errors in ${files} files. Wrote desktop/checkjs-baseline.txt.`);
  process.exit(0);
}

const baseline = Number.parseInt(readFileSync(baselineFile, "utf8").trim(), 10);
if (!Number.isInteger(baseline) || baseline < 0) {
  console.error("checkjs: desktop/checkjs-baseline.txt must hold one whole number.");
  process.exit(2);
}

if (errors > baseline) {
  console.log("Last 40 error lines (the new ones may be anywhere; run with --list for all):");
  console.log(errorLines.slice(-40).join("\n"));
  console.error(`checkjs: ${errors} errors in ${files} files, baseline ${baseline}. ${errors - baseline} new error(s). FAIL`);
  process.exit(1);
}
if (errors < baseline) {
  console.log(
    `checkjs: ${errors} errors in ${files} files, baseline ${baseline}. ${baseline - errors} fewer. PASS. ` +
      "Lower the baseline with `node scripts/checkjs-baseline.mjs --update`."
  );
} else {
  console.log(`checkjs: ${errors} errors in ${files} files, baseline ${baseline}. PASS`);
}
