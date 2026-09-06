from pathlib import Path
p = Path("web/scripts/window-play.test.mjs")
t = p.read_text(encoding="utf-8")
if "walks Puff cloud" in t:
    print("already")
else:
    # find Mane overlay lockstep and append after
    needle = 'the overlay window plate walks Mane teeth the same way'
    i = t.find(needle)
    if i < 0:
        raise SystemExit("mane overlay missing")
    # find end of that test
    j = t.find("});", i)
    end = j + 3
    block = '''

test("the overlay window plate walks Puff cloud the same way", () => {
  assert.equal(Overlay.playFor("puffball"), "cloud");
  assert.equal(P.playFor("puffball"), Overlay.playFor("puffball"));
  const target = Overlay.pickTarget([WIN], 80, "puffball", WORK, Overlay.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "cloud");
  let play = Overlay.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = Overlay.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, Overlay.SPRITE, { cmd: "idle" });
  }
  assert.ok(seen.has("cloud-on"));
  assert.ok(seen.has("cloud"));
  assert.ok(seen.has("cloud-hold"));
  assert.ok(seen.has("cloud-off"));
  assert.equal(play.phase, "done");
});
'''
    t = t[:end] + block + t[end:]
    p.write_text(t, encoding="utf-8", newline="\n")
    print("added overlay lockstep")
