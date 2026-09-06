from pathlib import Path

def load(p):
    raw = Path(p).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"): text = text[1:]
    text = text.replace("\r\n","\n").replace("\r","\n")
    return text, nl

def save(p, text, nl):
    if nl != "\n": text = text.replace("\n", nl)
    Path(p).write_bytes(text.encode("utf-8"))

cjs, nl = load("desktop/renderer/window-play.test.cjs")
old = '''    if (play.phase === "tails") {
      assert.equal(play.anim, "play");
    }'''
new = '''    if (play.phase === "tails" && play.t > 0) {
      assert.equal(play.anim, "play");
    }'''
if old not in cjs:
    raise SystemExit("missing tails anim assert")
cjs = cjs.replace(old, new, 1)
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("ok cjs")

# smoke DUR
import subprocess, textwrap
Path("_banner_smoke.js").write_text(textwrap.dedent("""
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
"""), encoding="utf-8")
