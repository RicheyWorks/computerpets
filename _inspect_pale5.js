const fs = require("fs");
function hits(file, needles) {
  const lines = fs.readFileSync(file, "utf8").split(/\n/);
  for (let i = 0; i < lines.length; i++) {
    if (needles.some((n) => lines[i].includes(n))) console.log(file.split(/[\\/]/).pop() + ":" + (i+1) + ":" + lines[i].slice(0, 160));
  }
}
hits("web/src/lib/pets/window-play.ts", ["export const SIGNAL", "export type", "PlayKind", 'key === "fiddler_crab"', "signalOn:", "kind === SIGNAL", "function signalPoint", "SIGNAL,"]);
hits("desktop/renderer/window-play.test.cjs", ["ghost_crab", "fiddler_crab", "limpet"]);
hits("web/scripts/window-play.test.mjs", ["ghost_crab", "fiddler_crab", "limpet"]);
hits("desktop/renderer/leftover-house.test.cjs", ["ghost_crab", "limpet", "next leftover"]);
