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

old = '''test("the demo window plate walks Vault jump the same way", () => {
  assert.equal(P.playFor("grasshopper"), "jump");
  assert.equal(Overlay.playFor("grasshopper"), "jump");
  assert.match(demoSrc, /grasshopper/);
  assert.match(livingSrc, /playFor\\(/);
  const target = P.pickTarget([WIN], 80, "grasshopper", WORK, P.SPRITE);
  assert.equal(target.kind, "jump");
  assert.equal(target.side, "grassplate");
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.ok(seen.has("jump"));
  assert.equal(play.phase, "done");
});
'''

new = '''test("the demo window plate walks Vault jump the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/meadow.ts"), "utf8"), /key: "grasshopper"[\\s\\S]{0,80}slug: "vault"/);
  assert.equal(P.playFor("grasshopper"), "jump");
  const target = P.pickTarget([WIN], 80, "grasshopper", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "jump");
  assert.equal(target.side, "grassplate");
  assert.equal(target.leave, "vaulted");
  assert.equal(Overlay.playFor("grasshopper"), "jump");
  assert.equal(P.JUMP, "jump");
  assert.equal(Overlay.JUMP, "jump");
  assert.notEqual(P.playFor("grasshopper"), "vault");
  assert.notEqual(P.playFor("grasshopper"), "hop");
  assert.notEqual(P.playFor("grasshopper"), "leap");
  assert.notEqual(P.playFor("grasshopper"), "spring");
  assert.notEqual(P.playFor("grasshopper"), "pounce");
  assert.notEqual(P.playFor("grasshopper"), "soar");
  assert.notEqual(P.playFor("grasshopper"), "leaf");
  assert.notEqual(P.playFor("grasshopper"), "song");
  assert.notEqual(P.playFor("grasshopper"), "sill");
  assert.equal(P.playFor("katydid"), "leaf");
  assert.equal(Overlay.playFor("katydid"), "leaf");
  assert.equal(P.playFor("field_cricket"), "song");
  assert.equal(Overlay.playFor("field_cricket"), "song");
  assert.equal(P.playFor("swallowtail"), "sill");
  assert.equal(P.DUR.jumpOn, Overlay.DUR.jumpOn);
  assert.equal(P.DUR.jump, Overlay.DUR.jump);
  assert.equal(P.DUR.jumpHold, Overlay.DUR.jumpHold);
  assert.equal(P.DUR.jumpOff, Overlay.DUR.jumpOff);
  assert.ok(P.DUR.jumpOn !== Overlay.DUR.leafOn);
  assert.ok(P.DUR.jumpOn !== Overlay.DUR.songOn);
  assert.ok(P.DUR.jumpOn !== Overlay.DUR.springOn);
  const plate = P.jumpPoint(WIN, 176, WORK);
  const deskPlate = Overlay.jumpPoint(WIN, Overlay.SPRITE, WORK);
  assert.ok(Math.abs(plate.x - deskPlate.x) < 2);
  assert.ok(Math.abs(plate.lift - deskPlate.lift) < 2);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    assert.notEqual(play.phase, "leaf");
    assert.notEqual(play.phase, "song");
    assert.notEqual(play.phase, "spring");
  }
  assert.ok(seen.has("jump-on"));
  assert.ok(seen.has("jump"));
  assert.ok(seen.has("jump-hold"));
  assert.ok(seen.has("jump-off"));
  assert.equal(play.phase, "done");
});
'''

mjs, nl = load("web/scripts/window-play.test.mjs")
if old not in mjs:
    # try find and show
    i = mjs.find('demo window plate walks Vault jump')
    print("idx", i)
    print(repr(mjs[i:i+500]))
    raise SystemExit("old not found")
mjs = mjs.replace(old, new, 1)
save("web/scripts/window-play.test.mjs", mjs, nl)
print("ok")
