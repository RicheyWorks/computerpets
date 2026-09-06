const fs = require("fs");
const lines = fs.readFileSync("desktop/renderer/window-play.js", "utf8").split(/\n/);
const needles = ["const SIGNAL", "const PLOW", "const STORE", "const DIG", "const BURY", "const RUN", "const SAND", "kind === PLOW", "kind === STORE", "kind === DIG", "kind === BURY", "kind === RUN", "kind === SAND", '=== "sand"', "function plowPoint", "function storePoint", "function buryPoint", "function digPoint", "function runPoint", "function sprayPoint"];
for (let i = 0; i < lines.length; i++) {
  if (needles.some((n) => lines[i].includes(n))) {
    console.log((i + 1) + ":" + lines[i].slice(0, 180));
  }
}
