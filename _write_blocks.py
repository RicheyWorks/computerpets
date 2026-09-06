from pathlib import Path

CJS = r'''
test("Shard facets a sash gap as an inkstone: walk into the gap, sit the facet, then leave", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("silica"), "facet");
  assert.equal(P.FACET, "facet");
  assert.notEqual(P.playFor("silica"), "shard");
  assert.notEqual(P.playFor("silica"), "silica");
  assert.notEqual(P.playFor("silica"), "float");
  assert.notEqual(P.playFor("silica"), "daub");
  assert.notEqual(P.playFor("silica"), "teeth");
  assert.notEqual(P.playFor("silica"), "plane");
  assert.notEqual(P.playFor("silica"), "edge");
  assert.notEqual(P.playFor("silica"), "chord");
  assert.notEqual(P.playFor("silica"), "thirst");
  assert.notEqual(P.playFor("silica"), "plaque");
  assert.notEqual(P.playFor("silica"), "bloom");
  assert.notEqual(P.playFor("silica"), "drip");
  assert.notEqual(P.playFor("silica"), "cloud");
  assert.notEqual(P.playFor("silica"), "sill");
  assert.equal(P.playFor("nimbus"), "float");
  assert.equal(P.FLOAT, "float");
  assert.equal(P.playFor("mason_bee"), "daub");
  assert.equal(P.DAUB, "daub");
  assert.equal(P.playFor("lions_mane"), "teeth");
  assert.equal(P.TEETH, "teeth");
  assert.equal(P.playFor("choir"), "chord");
  assert.equal(P.CHORD, "chord");
  assert.equal(P.playFor("photovore"), "thirst");
  assert.equal(P.THIRST, "thirst");
  assert.equal(P.playFor("lichen"), "plaque");
  assert.equal(P.PLAQUE, "plaque");
  assert.equal(P.playFor("yeast"), "bloom");
  assert.equal(P.BLOOM, "bloom");
  assert.equal(P.playFor("chicken_of_woods"), "drip");
  assert.equal(P.DRIP, "drip");
  assert.equal(P.playFor("puffball"), "cloud");
  assert.equal(P.CLOUD, "cloud");
  assert.equal(P.playFor("terminator"), "sill");
  const target = P.pickTarget([WIN], 80, "silica", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "facet");
  assert.equal(target.side, "inkstone");
  assert.equal(target.leave, "faceted");
  assert.notEqual(target.kind, "daub");
  assert.notEqual(target.kind, "teeth");
  assert.notEqual(target.kind, "float");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift >= 0, "it facets a sash gap as an inkstone");
  assert.ok(P.DUR.facetHold > P.DUR.facet * 1.2, "the hold is the sit; facet is the tell");
  assert.ok(P.DUR.facetOn > 1.0, "a walk into the gap, not a cling");
  assert.ok(P.DUR.facetOn !== P.DUR.floatOn);
  assert.ok(P.DUR.facetOn !== P.DUR.daubOn);
  assert.ok(P.DUR.facetOn !== P.DUR.teethOn);
  assert.ok(P.DUR.facetOn !== P.DUR.chordOn);
  assert.ok(P.DUR.facetOn !== P.DUR.thirstOn);
  assert.ok(P.DUR.facetOn !== P.DUR.sillHop);
  assert.ok(P.DUR.facet !== P.DUR.float);
  assert.ok(P.DUR.facet !== P.DUR.daub);
  assert.ok(P.DUR.facetHold !== P.DUR.floatHold);
  assert.ok(P.DUR.facetOff !== P.DUR.floatOff);
  const ink = P.facetPoint(WIN, P.SPRITE, WORK);
  const bowl = P.floatPoint(WIN, P.SPRITE, WORK);
  const cell = P.daubPoint(WIN, P.SPRITE, WORK);
  const wound = P.teethPoint(WIN, P.SPRITE, WORK);
  const air = P.chordPoint(WIN, P.SPRITE, WORK);
  const glass = P.thirstPoint(WIN, P.SPRITE, WORK);
  assert.ok(ink.lift >= 0, "the sash gap as an inkstone, not the sky");
  assert.ok(Math.abs(ink.x - cell.x) > 0.5 || Math.abs(ink.lift - cell.lift) > 1, "not Mortar's inkstone-cell daub");
  assert.ok(Math.abs(ink.x - wound.x) > 12 || Math.abs(ink.lift - wound.lift) > 1, "not Mane's wood-wound teeth");
  assert.ok(Math.abs(ink.x - bowl.x) > 12 || Math.abs(ink.lift - bowl.lift) > 1, "not Nimbus methane bowl");
  assert.ok(Math.abs(ink.x - air.x) > 8 || Math.abs(ink.lift - air.lift) > 1, "not Choir blotter air");
  assert.ok(Math.abs(ink.x - glass.x) > 12 || Math.abs(ink.lift - glass.lift) > 1, "not Gleam lamp glass");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "silica", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real sash gap, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 186, height: 196 }], 80, "silica", WORK, P.SPRITE);
  assert.equal(short, null, "a real sash-gap inkstone, not a thinner frame");
  const okFacet = P.pickTarget([{ id: "facet", x: 200, y: 80, width: 188, height: 198 }], 80, "silica", WORK, P.SPRITE);
  assert.ok(okFacet, "a real sash gap as an inkstone");
  const daubOk = P.pickTarget([{ id: "daub", x: 200, y: 80, width: 184, height: 194 }], 80, "mason_bee", WORK, P.SPRITE);
  assert.ok(daubOk, "Mortar still takes a sash-gap cell");
  const teethOk = P.pickTarget([{ id: "teeth", x: 200, y: 80, width: 186, height: 196 }], 80, "lions_mane", WORK, P.SPRITE);
  assert.ok(teethOk, "Mane still takes a sash-gap wood wound");
  const floatOk = P.pickTarget([{ id: "float", x: 200, y: 80, width: 194, height: 174 }], 80, "nimbus", WORK, P.SPRITE);
  assert.ok(floatOk, "Nimbus still takes a methane-bowl pane");
  const walkOn = P.facetOnPath(0.25, { x: 40, lift: 0 }, { x: ink.x, lift: ink.lift });
  const daubOn = P.daubOnPath(0.25, { x: 40, lift: 0 }, { x: ink.x, lift: ink.lift });
  assert.ok(walkOn.lift >= 0, "it walks into the sash gap as an inkstone");
  assert.ok(walkOn.rot !== daubOn.rot, "a walk into the gap, not Mortar daub");
  const facetPose = P.facetPath(0.3);
  const daubPose = P.daubPath(0.3);
  const teethPose = P.teethPath(0.3);
  const floatPose = P.floatPath(0.3);
  assert.ok(Math.abs(facetPose.lift) > 0.2 || Math.abs(facetPose.rot) > 0.8, "it facets once; facet is the tell");
  assert.ok(facetPose.rot !== daubPose.rot, "facet, not daub");
  assert.ok(facetPose.rot !== teethPose.rot, "facet, not teeth");
  assert.ok(facetPose.rot !== floatPose.rot, "facet, not float");
  const hold = P.facetHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 1.7) < 0.2, "it holds the sit on the inkstone");
  assert.ok(Math.abs(hold.x - 0.16) < 0.05, "it stays on the facet");
  assert.ok(hold.lift < 0, "sit in the gap, not a pane float");
  const off0 = P.facetOffPath(0, { x: ink.x, lift: ink.lift - 1.03, rot: 1.7 }, { x: ink.x + 50, lift: 0 });
  const offMid = P.facetOffPath(0.5, { x: ink.x, lift: ink.lift - 1.03, rot: 1.7 }, { x: ink.x + 50, lift: 0 });
  const off1 = P.facetOffPath(1, { x: ink.x, lift: ink.lift - 1.03, rot: 1.7 }, { x: ink.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - ink.x) < 2);
  assert.ok(Math.abs(offMid.x - ink.x) > 8, "a walk leave off the inkstone");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "daub");
    assert.notEqual(play.phase, "teeth");
    assert.notEqual(play.phase, "float");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "facet") {
      assert.ok(play.lift !== undefined, "it facets on the sash gap");
    }
  }
  assert.ok(seen.has("facet-on"));
  assert.ok(seen.has("facet"));
  assert.ok(seen.has("facet-hold"));
  assert.ok(seen.has("facet-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Shard's inkstone facet; sleep, card, and hide abort; Shard never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "silica", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "facet"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "facet");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "facet");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved inkstone");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "facet-off");
  assert.equal(play.abort, true);
});
'''

Path("_shard_cjs_block.txt").write_text(CJS, encoding="utf-8", newline="\n")
Path("_shard_mjs_block.txt").write_text(CJS, encoding="utf-8", newline="\n")
print("blocks written", len(CJS))
