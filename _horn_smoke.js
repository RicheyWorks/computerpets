const P = require("./desktop/renderer/window-play.js");
const checks = [
  ["chanterelle", "fork"],
  ["morel", "hollow"],
  ["fly_agaric", "warts"],
  ["oyster", "shelf"],
  ["leech", "drink"],
  ["ginkgo", "gold"],
  ["firefly", "glow"],
  ["cyber_dragon", "ridge"],
  ["turkey_tail", "sill"],
  ["moss", "lean"],
];
for (const [k, v] of checks) {
  const got = P.playFor(k);
  if (got !== v) {
    console.log("FAIL", k, "got", got, "want", v);
    process.exitCode = 1;
  } else {
    console.log("ok", k, v);
  }
}
console.log("FORK", P.FORK, "HOLLOW", P.HOLLOW, "WARTS", P.WARTS, "SHELF", P.SHELF, "DRINK", P.DRINK, "GOLD", P.GOLD, "GLOW", P.GLOW, "RIDGE", P.RIDGE);
console.log("forkPoint", typeof P.forkPoint, "drinkPoint", typeof P.drinkPoint);
const WIN = { id: "hw", x: 360, y: 80, width: 640, height: 420 };
const WORK = { width: 1400, height: 800, floorLift: 0 };
const t = P.pickTarget([WIN], 80, "chanterelle", WORK, P.SPRITE);
console.log("target", t && t.kind, t && t.side, t && t.leave);
