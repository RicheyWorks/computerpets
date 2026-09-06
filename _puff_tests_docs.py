# -*- coding: utf-8 -*-
from pathlib import Path
import re

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:220]!r}")
    return text.replace(old, new, 1)

CJS_TEST = r'''
test("Puff clouds a window apron as a spore dish: walk onto the apron, sit the soft mound, cloud once, sit the dish, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("puffball"), "cloud");
  assert.equal(P.CLOUD, "cloud");
  assert.notEqual(P.playFor("puffball"), "puff");
  assert.notEqual(P.playFor("puffball"), "dust");
  assert.notEqual(P.playFor("puffball"), "warts");
  assert.notEqual(P.playFor("puffball"), "teeth");
  assert.notEqual(P.playFor("puffball"), "zones");
  assert.notEqual(P.playFor("puffball"), "fork");
  assert.notEqual(P.playFor("puffball"), "hollow");
  assert.notEqual(P.playFor("puffball"), "shelf");
  assert.notEqual(P.playFor("puffball"), "burst");
  assert.notEqual(P.playFor("puffball"), "spore");
  assert.notEqual(P.playFor("puffball"), "pearl");
  assert.notEqual(P.playFor("puffball"), "sill");
  assert.equal(P.playFor("toad"), "puff");
  assert.equal(P.PUFF, "puff");
  assert.equal(P.playFor("chinchilla"), "dust");
  assert.equal(P.DUST, "dust");
  assert.equal(P.playFor("lions_mane"), "teeth");
  assert.equal(P.TEETH, "teeth");
  assert.equal(P.playFor("turkey_tail"), "zones");
  assert.equal(P.playFor("chanterelle"), "fork");
  assert.equal(P.playFor("morel"), "hollow");
  assert.equal(P.playFor("fly_agaric"), "warts");
  assert.equal(P.playFor("oyster"), "shelf");
  assert.equal(P.playFor("chicken_of_woods"), "sill");
  const target = P.pickTarget([WIN], 80, "puffball", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "cloud");
  assert.equal(target.side, "sporedish");
  assert.equal(target.leave, "clouded");
  assert.notEqual(target.kind, "puff");
  assert.notEqual(target.kind, "dust");
  assert.notEqual(target.kind, "warts");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift >= 0, "she clouds a window apron as a spore dish");
  assert.ok(P.DUR.cloudHold > P.DUR.cloud * 1.2, "the hold is the sit; cloud is the tell");
  assert.ok(P.DUR.cloudOn > 1.0, "a walk onto the apron, not a puff");
  assert.ok(P.DUR.cloudOn !== P.DUR.puffOn);
  assert.ok(P.DUR.cloudOn !== P.DUR.dustOn);
  assert.ok(P.DUR.cloudOn !== P.DUR.wartsOn);
  assert.ok(P.DUR.cloudOn !== P.DUR.teethOn);
  assert.ok(P.DUR.cloudOn !== P.DUR.sillHop);
  assert.ok(P.DUR.cloud !== P.DUR.puff);
  assert.ok(P.DUR.cloud !== P.DUR.dust);
  assert.ok(P.DUR.cloud !== P.DUR.warts);
  assert.ok(P.DUR.cloudHold !== P.DUR.wartsHold);
  assert.ok(P.DUR.cloudOff !== P.DUR.puffOff);
  const dish = P.cloudPoint(WIN, P.SPRITE, WORK);
  const cup = P.wartsPoint(WIN, P.SPRITE, WORK);
  const leaf = P.puffPoint(WIN, P.SPRITE, WORK);
  const tray = P.dustPoint(WIN, P.SPRITE, WORK);
  const plate = P.jumpPoint(WIN, P.SPRITE, WORK);
  const green = P.honkPoint(WIN, P.SPRITE, WORK);
  const wound = P.teethPoint(WIN, P.SPRITE, WORK);
  assert.ok(dish.lift >= 0, "the window apron as a spore dish, not the sky");
  assert.ok(Math.abs(dish.x - cup.x) > 12 || Math.abs(dish.lift - cup.lift) > 1, "not Cap's moss-cup warts");
  assert.ok(Math.abs(dish.x - leaf.x) > 12 || Math.abs(dish.lift - leaf.lift) > 1, "not Pebble's casement-leaf puff");
  assert.ok(Math.abs(dish.x - tray.x) > 12 || Math.abs(dish.lift - tray.lift) > 1, "not Floss's dust-tray dust");
  assert.ok(Math.abs(dish.x - plate.x) > 8 || Math.abs(dish.lift - plate.lift) > 1, "not Vault's grass-plate jump");
  assert.ok(Math.abs(dish.x - green.x) > 8 || Math.abs(dish.lift - green.lift) > 1, "not Vee's blotter-green honk");
  assert.ok(Math.abs(dish.x - wound.x) > 12 || Math.abs(dish.lift - wound.lift) > 1, "not Mane's wood-wound teeth");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "puffball", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window apron, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 182, height: 148 }], 80, "puffball", WORK, P.SPRITE);
  assert.equal(short, null, "a real spore dish, not a thinner apron");
  const okCloud = P.pickTarget([{ id: "cloud", x: 200, y: 80, width: 184, height: 150 }], 80, "puffball", WORK, P.SPRITE);
  assert.ok(okCloud, "a real window apron as a spore dish");
  const wartsOk = P.pickTarget([{ id: "warts", x: 200, y: 80, width: 186, height: 148 }], 80, "fly_agaric", WORK, P.SPRITE);
  assert.ok(wartsOk, "Cap still takes a moss cup");
  const walkOn = P.cloudOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  const wartsOn = P.wartsOnPath(0.25, { x: 40, lift: 0 }, { x: dish.x, lift: dish.lift });
  assert.ok(walkOn.lift >= 0, "she walks onto the apron as a spore dish");
  assert.ok(walkOn.rot !== wartsOn.rot, "a walk onto the apron, not Cap warts");
  const cloudPose = P.cloudPath(0.3);
  const wartsPose = P.wartsPath(0.3);
  const puffPose = P.puffPath(0.3);
  const dustPose = P.dustPath ? P.dustPath(0.3) : { rot: 999 };
  assert.ok(Math.abs(cloudPose.lift) > 0.4 || Math.abs(cloudPose.rot) > 1, "she clouds once; cloud is the tell");
  assert.ok(cloudPose.rot !== wartsPose.rot, "cloud, not warts");
  assert.ok(cloudPose.rot !== puffPose.rot, "cloud, not puff");
  const hold = P.cloudHoldPath(0.5);
  assert.ok(Math.abs(hold.rot + 1.8) < 0.2, "she holds the sit on the dish");
  assert.ok(Math.abs(hold.x - 0.12) < 0.05, "she stays on the spore dish");
  assert.ok(hold.lift < 1.2, "sit on the apron, not a cloud peak");
  const off0 = P.cloudOffPath(0, { x: dish.x, lift: dish.lift + 0.42, rot: -1.8 }, { x: dish.x + 50, lift: 0 });
  const offMid = P.cloudOffPath(0.5, { x: dish.x, lift: dish.lift + 0.42, rot: -1.8 }, { x: dish.x + 50, lift: 0 });
  const off1 = P.cloudOffPath(1, { x: dish.x, lift: dish.lift + 0.42, rot: -1.8 }, { x: dish.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - dish.x) < 2);
  assert.ok(Math.abs(offMid.x - dish.x) > 8, "a walk leave off the spore dish");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "warts");
    assert.notEqual(play.phase, "puff");
    assert.notEqual(play.phase, "dust");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "cloud") {
      assert.ok(play.lift !== undefined, "she clouds on the window apron");
    }
  }
  assert.ok(seen.has("cloud-on"));
  assert.ok(seen.has("cloud"));
  assert.ok(seen.has("cloud-hold"));
  assert.ok(seen.has("cloud-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Puff's spore-dish cloud; sleep, card, and hide abort; Puff never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "puffball", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "cloud"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "cloud");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "cloud");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved spore dish");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "cloud-off");
  assert.equal(play.abort, true);
});
'''

MJS_TEST = r'''
test("Puff clouds a window apron as a spore dish: walk onto the apron, sit the soft mound, cloud once, sit the dish, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("puffball"), "cloud");
  assert.equal(P.CLOUD, "cloud");
  assert.notEqual(P.playFor("puffball"), "puff");
  assert.notEqual(P.playFor("puffball"), "dust");
  assert.notEqual(P.playFor("puffball"), "warts");
  assert.notEqual(P.playFor("puffball"), "sill");
  assert.equal(P.playFor("toad"), "puff");
  assert.equal(P.playFor("lions_mane"), "teeth");
  assert.equal(P.playFor("chicken_of_woods"), "sill");
  assert.equal(Overlay.playFor("puffball"), "cloud");
  const target = P.pickTarget([WIN], 80, "puffball", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "cloud");
  assert.equal(target.side, "sporedish");
  assert.equal(target.leave, "clouded");
  assert.ok(target.holdLift >= 0);
  assert.ok(P.DUR.cloudHold > P.DUR.cloud * 1.2);
  assert.ok(P.DUR.cloudOn !== P.DUR.wartsOn);
  assert.ok(P.DUR.cloud !== P.DUR.puff);
  const dish = P.cloudPoint(WIN, P.SPRITE, WORK);
  const cup = P.wartsPoint(WIN, P.SPRITE, WORK);
  assert.ok(Math.abs(dish.x - cup.x) > 12 || Math.abs(dish.lift - cup.lift) > 1);
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "puffball", WORK, P.SPRITE);
  assert.equal(tiny, null);
  const okCloud = P.pickTarget([{ id: "cloud", x: 200, y: 80, width: 184, height: 150 }], 80, "puffball", WORK, P.SPRITE);
  assert.ok(okCloud);
  const cloudPose = P.cloudPath(0.3);
  assert.ok(Math.abs(cloudPose.lift) > 0.4 || Math.abs(cloudPose.rot) > 1);
  const hold = P.cloudHoldPath(0.5);
  assert.ok(Math.abs(hold.rot + 1.8) < 0.2);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "warts");
    assert.notEqual(play.phase, "puff");
  }
  assert.ok(seen.has("cloud-on"));
  assert.ok(seen.has("cloud"));
  assert.ok(seen.has("cloud-hold"));
  assert.ok(seen.has("cloud-off"));
  assert.equal(play.phase, "done");
});

test("a moved window refits Puff's spore-dish cloud; sleep, card, and hide abort", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  const target = P.pickTarget([WIN], 200, "puffball", WORK, P.SPRITE);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "cloud"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "cloud");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "cloud");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "cloud-off");
  assert.equal(play.abort, true);
});
'''

# Append tests after Mane abort test block end
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
marker = 'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved sash gap");\n  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "teeth-off");\n  assert.equal(play.abort, true);\n});'
if cjs.count(marker) != 1:
    raise SystemExit(f"cjs mane abort marker {cjs.count(marker)}")
cjs = cjs.replace(marker, marker + "\n" + CJS_TEST, 1)
# shift sill pin asserts
cjs = once(cjs, 'assert.equal(P.playFor("puffball"), "sill");', 'assert.equal(P.playFor("puffball"), "cloud");\n  assert.equal(P.playFor("chicken_of_woods"), "sill");', "cjs sill pin first")
# There may be multiple puffball===sill - replace all remaining carefully
remaining = cjs.count('assert.equal(P.playFor("puffball"), "sill");')
print("remaining puffball sill in cjs", remaining)
cjs = cjs.replace('assert.equal(P.playFor("puffball"), "sill");', 'assert.equal(P.playFor("chicken_of_woods"), "sill");')
Path("desktop/renderer/window-play.test.cjs").write_text(cjs, encoding="utf-8", newline="\n")

mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
# find Mane abort end similarly or Cap-style append after last Mane test
m_end = 'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved sash gap");'
# mjs may be shorter
idxs = [m.start() for m in re.finditer(r'test\("a moved window refits Mane', mjs)]
print("mjs mane abort tests", len(idxs))
# append before final closing or after last test - use Overlay mane equality block end
marker2 = None
for cand in [
'''  assert.equal(play.phase, "teeth");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "teeth");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "teeth-off");
  assert.equal(play.abort, true);
});''',
]:
    if mjs.count(cand) == 1:
        marker2 = cand
        break
if not marker2:
    # dump nearby
    i = mjs.find("refits Mane")
    raise SystemExit("mjs mane abort missing near " + repr(mjs[i:i+500]))
mjs = mjs.replace(marker2, marker2 + "\n" + MJS_TEST, 1)
mjs = mjs.replace('assert.equal(P.playFor("puffball"), "sill");', 'assert.equal(P.playFor("chicken_of_woods"), "sill");')
Path("web/scripts/window-play.test.mjs").write_text(mjs, encoding="utf-8", newline="\n")
print("cjs/mjs tests appended")
