import { spawnSync } from "node:child_process";

// Tests that run a repo Python script need a real Python 3.
// Linux and Mac ship python3. Windows usually has python or the py launcher,
// and its "python3" can be a Store stub that only prints an install hint.
// So each candidate is run once, and only one that really answers as Python 3 is used.
const CANDIDATES = [
  ["python3", []],
  ["python", []],
  ["py", ["-3"]],
];

let found;

/** @returns {{ cmd: string, args: string[] }} */
export function python3() {
  if (found) return found;
  for (const [cmd, args] of CANDIDATES) {
    const probe = spawnSync(cmd, [...args, "-c", "import sys; sys.exit(0 if sys.version_info[0] == 3 else 1)"], {
      encoding: "utf8",
      windowsHide: true,
    });
    if (probe.status === 0) {
      found = { cmd, args };
      return found;
    }
  }
  throw new Error("no Python 3 found: tried python3, python, and py -3");
}