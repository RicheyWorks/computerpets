const { readFileSync } = require("node:fs");

// Source-text checks read repo files as text. A Windows checkout with
// core.autocrlf=true has CRLF on disk, while Linux and Mac have LF, so a
// check that spans a line break can miss (or pass on nothing) only on Windows.
// Fold CRLF to LF so every source check means the same on every machine.
/** @param {string} file */
function readSource(file) {
  return readFileSync(file, "utf8").replace(/\r\n/g, "\n");
}

module.exports = { readSource };