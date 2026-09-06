from pathlib import Path

def load(p):
    raw = Path(p).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text, nl

def save(p, text, nl):
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(p).write_bytes(text.encode("utf-8"))

def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit("MISSING: " + label)
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

# Fix DUR in js + ts
for p in ["desktop/renderer/window-play.js", "web/src/lib/pets/window-play.ts"]:
    text, nl = load(p)
    text = must_replace(text, "blackOn: 2.72,", "blackOn: 2.78,", p + " blackOn")
    # also ensure black values stay distinct
    save(p, text, nl)
    print("dur ok", p)

ABORT_NEW = '''test("a moved window refits Jewel's stream-jewel black; sleep, card, and hide abort; Jewel never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "jewelwing", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "black"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "black");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "black");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved glass rim");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "black-off");
  assert.equal(play.abort, true);
});
'''

ABORT_MJS = '''test("a moved window refits Jewel's stream-jewel black; sleep, card, and hide abort", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "jewelwing", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "black"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "black");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "black");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "black-off");
  assert.equal(play.abort, true);
});
'''

cjs, nl = load("desktop/renderer/window-play.test.cjs")
cjs = cjs.replace("\ufeff", "")
# also fix DUR assert leafOn if still comparing - blackOn now 2.78 so ok
# replace abort test block
start = cjs.find('test("a moved window refits Jewel\'s stream-jewel black; sleep, card, and hide abort; Jewel never starts asleep"')
if start < 0:
    raise SystemExit("no jewel abort cjs")
end = cjs.find("assert.equal(play.abort, true);\n});", start)
if end < 0:
    raise SystemExit("no jewel abort end cjs")
end = end + len("assert.equal(play.abort, true);\n});")
cjs = cjs[:start] + ABORT_NEW + cjs[end:]
# also fix blackOn !== leafOn is fine now; ensure DUR.blackOn !== P.DUR.leafOn still in main test
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("ok cjs")

mjs, mnl = load("web/scripts/window-play.test.mjs")
mjs = mjs.replace("\ufeff", "")
start = mjs.find('test("a moved window refits Jewel\'s stream-jewel black; sleep, card, and hide abort"')
if start < 0:
    raise SystemExit("no jewel abort mjs")
# find end of this test - next test is demo
end = mjs.find('test("the demo window plate walks Jewel black the same way"', start)
if end < 0:
    raise SystemExit("no jewel demo after abort")
mjs = mjs[:start] + ABORT_MJS + "\n" + mjs[end:]
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("ok mjs")

# update helper snippets without BOM for future
Path("_jewel_cjs_tests.txt").write_bytes(Path("_jewel_cjs_tests.txt").read_bytes().replace(b"\xef\xbb\xbf", b""))
Path("_jewel_mjs_tests.txt").write_bytes(Path("_jewel_mjs_tests.txt").read_bytes().replace(b"\xef\xbb\xbf", b""))
print("stripped snippet bom")
