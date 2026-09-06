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

OLD_DUR = "    netOn: 2.58,\n    net: 2.68,\n    netHold: 3.82,\n    netOff: 2.48,"
NEW_DUR = "    netOn: 2.54,\n    net: 2.62,\n    netHold: 3.88,\n    netOff: 2.46,"
OLD_DUR_TS = "  netOn: 2.58,\n  net: 2.68,\n  netHold: 3.82,\n  netOff: 2.48,"
NEW_DUR_TS = "  netOn: 2.54,\n  net: 2.62,\n  netHold: 3.88,\n  netOff: 2.46,"

js, nl = load("desktop/renderer/window-play.js")
js = must_replace(js, OLD_DUR, NEW_DUR, "js DUR")
save("desktop/renderer/window-play.js", js, nl)
print("ok js dur")

ts, nl = load("web/src/lib/pets/window-play.ts")
ts = must_replace(ts, OLD_DUR_TS, NEW_DUR_TS, "ts DUR")
save("web/src/lib/pets/window-play.ts", ts, nl)
print("ok ts dur")

# also update core/ts templates for consistency
for p in ["_lace_core.py", "_lace_ts.py"]:
    t = Path(p).read_text(encoding="utf-8")
    t2 = t.replace("netOn: 2.58", "netOn: 2.54").replace("net: 2.68", "net: 2.62").replace("netHold: 3.82", "netHold: 3.88").replace("netOff: 2.48", "netOff: 2.46")
    Path(p).write_text(t2, encoding="utf-8")

CJS_ABORT = '''test("a moved window refits Lace's leaf-dish net; sleep, card, and hide abort; Lace never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "lacewing", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "net"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "net");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "net");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved window stool");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "net-off");
  assert.equal(play.abort, true);
});
'''

MJS_ABORT = '''test("a moved window refits Lace's leaf-dish net; sleep, card, and hide abort", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "lacewing", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "net"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "net");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "net");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "net-off");
  assert.equal(play.abort, true);
});
'''

cjs, nl = load("desktop/renderer/window-play.test.cjs")
start = cjs.find('test("a moved window refits Lace\'s leaf-dish net; sleep, card, and hide abort; Lace never starts asleep"')
if start < 0:
    raise SystemExit("no lace cjs abort")
end = cjs.find("\ntest(", start + 10)
if end < 0:
    end = cjs.find("\n\ntest(", start + 10)
# find end of this test - next test after lace abort might be something else, or end of lace block
# lace abort is last of lace cjs tests - look for closing });
# Better: find exact old body
old_start_marker = 'test("a moved window refits Lace\'s leaf-dish net; sleep, card, and hide abort; Lace never starts asleep"'
idx = cjs.find(old_start_marker)
# find matching end - the hide abort line
end_marker = '  assert.equal(play.abort, true);\n});'
# there may be multiple; find the one after idx for lace
# lace test ends with hide abort
sub = cjs[idx:]
# old lace abort ends with assert.equal(play.abort, true);\n}); after hide
# Find the last assert.equal(play.abort in this test
# Simpler: replace from test( to the }); that closes it by counting
# Use unique old opening + unique end pattern from our written test
old_end = sub.find('  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "hide" });\n  assert.equal(play.abort, true);\n});')
if old_end < 0:
    raise SystemExit("MISSING lace cjs abort end")
old_end = old_end + len('  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "hide" });\n  assert.equal(play.abort, true);\n});')
cjs = cjs[:idx] + CJS_ABORT + sub[old_end:]
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("ok cjs abort")

mjs, mnl = load("web/scripts/window-play.test.mjs")
idx = mjs.find('test("a moved window refits Lace\'s leaf-dish net; sleep, card, and hide abort"')
if idx < 0:
    raise SystemExit("no lace mjs abort")
sub = mjs[idx:]
old_end = sub.find('  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "hide" });\n  assert.equal(play.abort, true);\n});')
if old_end < 0:
    raise SystemExit("MISSING lace mjs abort end")
old_end = old_end + len('  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "hide" });\n  assert.equal(play.abort, true);\n});')
mjs = mjs[:idx] + MJS_ABORT + sub[old_end:]
save("web/scripts/window-play.test.mjs", mjs, mnl)
print("ok mjs abort")
