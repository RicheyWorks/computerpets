
const P = require("./desktop/renderer/window-play.js");
console.log("playFor", P.playFor("swallowtail"));
console.log("TAILS", P.TAILS);
console.log("DUR", P.DUR.tailsOn, P.DUR.tails, P.DUR.tailsHold, P.DUR.tailsOff);
console.log("leaf", P.DUR.leaf, "jump", P.DUR.jump);
const WORK = { width: 1400, height: 800, floorLift: 0 };
const WIN = { id: "hw", x: 360, y: 80, width: 640, height: 420 };
const t = P.pickTarget([WIN], 80, "swallowtail", WORK, P.SPRITE);
console.log("target", t && t.kind, t && t.side, t && t.leave);
let play = P.beginPlay(t, t.approachX);
const seen = new Set();
for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
  seen.add(play.phase + ":" + play.anim);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
}
console.log([...seen].filter(s => s.startsWith("tails")).join(" | "));
console.log("done", play.phase);
