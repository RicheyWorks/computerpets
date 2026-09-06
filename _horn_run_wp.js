const { spawnSync } = require("node:child_process");
const path = require("node:path");
const files = process.argv.slice(2);
const r = spawnSync(
  process.execPath,
  ["--test", "--test-name-pattern", "Horn forks|Horn leftover|Horn's sash-drip|Horn fork|Lattice hollows|Cap warts|Frill shelves", ...files],
  { cwd: path.join(__dirname), stdio: "inherit", env: process.env }
);
process.exit(r.status == null ? 1 : r.status);
