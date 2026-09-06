#!/usr/bin/env python3
"""Apply Hide leftover: holes a sash well as a reef hole."""
from pathlib import Path
import re

HIDE_SENTENCE = (
    "Hide holes a sash well as a reef hole: walk into the sash well, review the hole, then leave. "
    "Soar still owns spots. Gate still owns mantle. Veil still owns rays. Tube still owns papillae. Scrub still owns station. "
    "Scrape still owns rasps. Paint still owns bars. Wreath still owns tentacles. Ridge still owns valleys. "
    "Ochre still owns reef. This is the leftover after Soar. Tenth leftover of remaining reef/sea after well ten closed. "
    "Reef/sea leftovers closed. Next leftover none. No generic-sill pin remains."
)

HOLE_FUNCS_JS = r'''
  function holePoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 32;
    const span = Math.max(0, win.width - size - pad * 2);
    // sash well as a reef hole - sit the hole on the well; she holes, she does not hide/grouper/gape/door/bill/lance/soar/spots/mantle/rays/papillae/station/go/silver/blush/hollow/kick; hole is the tell
    // not Scrub station-dish station, not Rose salt-pan blush, not Lattice leaf-mold hollow, not Velvet silk-burrow kick, not Tube sand-well papillae, not Silver bank-hole go, not Soar mid-pane reef sky, not Gate stool mantle dish, not Nori inkwell bun
    const x = win.x + pad + span * 0.28;
    const fromTop = Math.max(win.height * 0.68, Math.min(win.height * 0.76, win.height - 58));
    const gripY = win.y + fromTop;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 32, maxLift) };
  }

  function holeFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function holeOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.36) * 1.52;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 2.18 * (1 - ease) + stride * 0.05,
    };
  }

  function holePath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.22) {
      const s = t / 0.22;
      const ease = s * s * (3 - 2 * s);
      // walk into the sash well - take the reef hole; the spots; not Kite barrel, not Choir chord, not Gate mantle, not Seven spot
      return { x: ease * 0.19, lift: ease * 1.28, rot: ease * 4.2 };
    }
    if (t < 0.68) {
      const s = (t - 0.22) / 0.46;
      // review the hole once - the tell; she holes, she does not hide/barrel/rays/mantle/spot; hole is the tell
      const review = Math.sin(s * Math.PI);
      return { x: 0.19 + review * 0.48, lift: 1.28 + review * 0.86, rot: 4.2 + s * 6.8 };
    }
    if (t < 0.88) {
      const s = (t - 0.68) / 0.20;
      const ease = s * s * (3 - 2 * s);
      // remain a grouper / hold the hide / review the hole
      return { x: 0.19 + ease * 0.09, lift: 1.28 + ease * 0.24, rot: 4.2 + ease * 1.42 };
    }
    return { x: 0.28, lift: 1.52, rot: 5.62 };
  }

  function holeHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.16;
    // sit the hole on the sash well as a reef hole; she holes, she does not hide
    return { x: 0.28, lift: 1.52 + hush, rot: 5.62 };
  }

  function holeOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.28) * 1.38;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 5.62) * (1 - ease),
    };
  }
'''

HOLE_FUNCS_TS = r'''
export function holePoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 32;
  const span = Math.max(0, win.width - size - pad * 2);
  // sash well as a reef hole - sit the hole on the well; she holes, she does not hide/grouper/gape/door/bill/lance/soar/spots/mantle/rays/papillae/station/go/silver/blush/hollow/kick; hole is the tell
  // not Scrub station-dish station, not Rose salt-pan blush, not Lattice leaf-mold hollow, not Velvet silk-burrow kick, not Tube sand-well papillae, not Silver bank-hole go, not Soar mid-pane reef sky, not Gate stool mantle dish, not Nori inkwell bun
  const x = win.x + pad + span * 0.28;
  const fromTop = Math.max(win.height * 0.68, Math.min(win.height * 0.76, win.height - 58));
  const gripY = win.y + fromTop;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 32, maxLift) };
}

export function holeFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function holeOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.36) * 1.52;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 2.18 * (1 - ease) + stride * 0.05,
  };
}

export function holePath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.22) {
    const s = t / 0.22;
    const ease = s * s * (3 - 2 * s);
    // walk into the sash well - take the reef hole; the spots; not Kite barrel, not Choir chord, not Gate mantle, not Seven spot
    return { x: ease * 0.19, lift: ease * 1.28, rot: ease * 4.2 };
  }
  if (t < 0.68) {
    const s = (t - 0.22) / 0.46;
    // review the hole once - the tell; she holes, she does not hide/barrel/rays/mantle/spot; hole is the tell
    const review = Math.sin(s * Math.PI);
    return { x: 0.19 + review * 0.48, lift: 1.28 + review * 0.86, rot: 4.2 + s * 6.8 };
  }
  if (t < 0.88) {
    const s = (t - 0.68) / 0.20;
    const ease = s * s * (3 - 2 * s);
    // remain a grouper / hold the hide / review the hole
    return { x: 0.19 + ease * 0.09, lift: 1.28 + ease * 0.24, rot: 4.2 + ease * 1.42 };
  }
  return { x: 0.28, lift: 1.52, rot: 5.62 };
}

export function holeHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.16;
  // sit the hole on the sash well as a reef hole; she holes, she does not hide
  return { x: 0.28, lift: 1.52 + hush, rot: 5.62 };
}

export function holeOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.28) * 1.38;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : 5.62) * (1 - ease),
  };
}
'''

HOLE_PHASE_JS = r'''

    if (next.phase === "hole-on") {
      const face = holeFace(target);
      const u = next.t / DUR.holeOn;
      const pose = holeOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "hole", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "hole") {
      const face = holeFace(target);
      const pose = holePath(Math.min(1, next.t / DUR.hole));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.hole) {
        return goPhase(next, "hole-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "hole-hold") {
      const face = holeFace(target);
      const pose = holeHoldPath(Math.min(1, next.t / DUR.holeHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.holeHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = holeHoldPath(1);
        return goPhase(next, "hole-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "hole-off") {
      const u = next.t / DUR.holeOff;
      const pose = holeOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }
'''

HOLE_PHASE_TS = r'''

  if (next.phase === "hole-on") {
    const face = holeFace(target);
    const u = next.t / DUR.holeOn;
    const pose = holeOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "hole", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "hole") {
    const face = holeFace(target);
    const pose = holePath(Math.min(1, next.t / DUR.hole));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.hole) {
      return goPhase(next, "hole-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "hole-hold") {
    const face = holeFace(target);
    const pose = holeHoldPath(Math.min(1, next.t / DUR.holeHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.holeHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = holeHoldPath(1);
      return goPhase(next, "hole-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "hole-off") {
    const u = next.t / DUR.holeOff;
    const pose = holeOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

'''

HOLE_PICK_JS = r'''

    if (kind === HOLE) {
      const hold = holePoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -58 : 58;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 54 : -54;
      return {
        id: best.id,
        kind,
        side: "reefhole",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "holed",
        spin: "none",
      };
    }
'''

HOLE_PICK_TS = r'''

  if (kind === HOLE) {
    const hold = holePoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -58 : 58;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 54 : -54;
    return {
      id: best.id,
      kind,
      side: "reefhole",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "holed",
      spin: "none",
    };
  }
'''

HIDE_TEST = r'''

test("Hide leftover holes a sash well as a reef hole: walk into the sash well, review the hole, then leave", () => {
  const WIN_B = { id: "pw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("grouper"), "hole");
  assert.equal(P.HOLE, "hole");
  assert.equal(P.playFor("eagle_ray"), "spots");
  assert.equal(P.SPOTS, "spots");
  assert.notEqual(P.playFor("grouper"), "hide");
  assert.notEqual(P.playFor("grouper"), "Hide");
  assert.notEqual(P.playFor("grouper"), "grouper");
  assert.notEqual(P.playFor("grouper"), "gape");
  assert.notEqual(P.playFor("grouper"), "door");
  assert.notEqual(P.playFor("grouper"), "bill");
  assert.notEqual(P.playFor("grouper"), "lance");
  assert.notEqual(P.playFor("grouper"), "spots");
  assert.notEqual(P.playFor("grouper"), "mantle");
  assert.notEqual(P.playFor("grouper"), "rays");
  assert.notEqual(P.playFor("grouper"), "papillae");
  assert.notEqual(P.playFor("grouper"), "station");
  assert.notEqual(P.playFor("grouper"), "go");
  assert.notEqual(P.playFor("grouper"), "blush");
  assert.notEqual(P.playFor("grouper"), "hollow");
  assert.notEqual(P.playFor("grouper"), "kick");
  assert.notEqual(P.playFor("grouper"), "soar");
  assert.notEqual(P.playFor("grouper"), "eagle_ray");
  assert.notEqual(P.playFor("grouper"), "Soar");
  assert.notEqual(P.playFor("grouper"), "barrel");
  assert.notEqual(P.playFor("grouper"), "kite");
  assert.notEqual(P.playFor("grouper"), "manta");
  assert.notEqual(P.playFor("grouper"), "rays");
  assert.notEqual(P.playFor("grouper"), "mantle");
  assert.notEqual(P.playFor("grouper"), "papillae");
  assert.notEqual(P.playFor("grouper"), "station");
  assert.notEqual(P.playFor("grouper"), "rasps");
  assert.notEqual(P.playFor("grouper"), "bars");
  assert.notEqual(P.playFor("grouper"), "tentacles");
  assert.notEqual(P.playFor("grouper"), "valleys");
  assert.notEqual(P.playFor("grouper"), "blush");
  assert.notEqual(P.playFor("grouper"), "reef");
  assert.notEqual(P.playFor("grouper"), "many");
  assert.notEqual(P.playFor("grouper"), "spot");
  assert.notEqual(P.playFor("grouper"), "sill");
  assert.equal(P.playFor("giant_clam"), "mantle");
  assert.equal(P.MANTLE, "mantle");
  assert.equal(P.playFor("lionfish"), "rays");
  assert.equal(P.RAYS, "rays");
  assert.equal(P.playFor("sea_cucumber"), "papillae");
  assert.equal(P.PAPILLAE, "papillae");
  assert.equal(P.playFor("cleaner_shrimp"), "station");
  assert.equal(P.STATION, "station");
  assert.equal(P.playFor("parrotfish"), "rasps");
  assert.equal(P.RASPS, "rasps");
  assert.equal(P.playFor("clownfish"), "bars");
  assert.equal(P.BARS, "bars");
  assert.equal(P.playFor("anemone"), "tentacles");
  assert.equal(P.TENTACLES, "tentacles");
  assert.equal(P.playFor("brain_coral"), "valleys");
  assert.equal(P.VALLEYS, "valleys");
  assert.equal(P.playFor("haloarchaea"), "blush");
  assert.equal(P.BLUSH, "blush");
  assert.equal(P.playFor("sea_star"), "reef");
  assert.equal(P.REEF, "reef");
  assert.equal(P.playFor("nexus"), "many");
  assert.equal(P.MANY, "many");
  assert.equal(P.playFor("ladybird"), "spot");
  assert.equal(P.SPOT, "spot");
  assert.equal(P.playFor("red_tail"), "soar");
  assert.equal(P.SOAR, "soar");
  assert.equal(P.playFor("manta"), "barrel");
  assert.equal(P.BARREL, "barrel");
  assert.equal(P.playFor("__sill_fallthrough__"), "sill");
  const target = P.pickTarget([WIN], 80, "grouper", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "hole");
  assert.equal(target.side, "reefhole");
  assert.equal(target.leave, "holed");
  assert.notEqual(target.kind, "soar");
  assert.notEqual(target.kind, "spot");
  assert.notEqual(target.kind, "barrel");
  assert.notEqual(target.kind, "rays");
  assert.notEqual(target.kind, "mantle");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "it holes a sash well as a reef hole");
  assert.ok(P.DUR.holeHold > P.DUR.hole * 1.2, "the hold is the sit; hole is the tell");
  assert.ok(P.DUR.holeOn > 1.0, "a walk into the sash well, not a cling");
  assert.ok(P.DUR.holeOn !== P.DUR.mantleOn);
  assert.ok(P.DUR.holeOn !== P.DUR.spotsOn);
  assert.ok(P.DUR.holeOn !== P.DUR.stationOn);
  assert.ok(P.DUR.holeOn !== P.DUR.blushOn);
  assert.ok(P.DUR.holeOn !== P.DUR.raysOn);
  assert.ok(P.DUR.holeOn !== P.DUR.papillaeOn);
  assert.ok(P.DUR.holeOn !== P.DUR.stationOn);
  assert.ok(P.DUR.holeOn !== P.DUR.raspsOn);
  assert.ok(P.DUR.holeOn !== P.DUR.barsOn);
  assert.ok(P.DUR.holeOn !== P.DUR.tentaclesOn);
  assert.ok(P.DUR.holeOn !== P.DUR.valleysOn);
  assert.ok(P.DUR.holeOn !== P.DUR.blushOn);
  assert.ok(P.DUR.holeOn !== P.DUR.reefOn);
  assert.ok(P.DUR.holeOn !== P.DUR.sillHop);
  assert.ok(P.DUR.hole !== P.DUR.mantle);
  assert.ok(P.DUR.hole !== P.DUR.rays);
  assert.ok(P.DUR.holeHold !== P.DUR.mantleHold);
  assert.ok(P.DUR.holeOff !== P.DUR.mantleOff);
  const hole = P.holePoint(WIN, P.SPRITE, WORK);
  const mantle = P.mantlePoint(WIN, P.SPRITE, WORK);
  const rays = P.raysPoint(WIN, P.SPRITE, WORK);
  const papillae = P.papillaePoint(WIN, P.SPRITE, WORK);
  const station = P.stationPoint(WIN, P.SPRITE, WORK);
  const rasps = P.raspsPoint(WIN, P.SPRITE, WORK);
  const bars = P.barsPoint(WIN, P.SPRITE, WORK);
  const tentacles = P.tentaclesPoint(WIN, P.SPRITE, WORK);
  const valleys = P.valleysPoint(WIN, P.SPRITE, WORK);
  const blush = P.blushPoint(WIN, P.SPRITE, WORK);
  const hollow = P.hollowPoint(WIN, P.SPRITE, WORK);
  const kick = P.kickPoint(WIN, P.SPRITE, WORK);
  const goPt = P.goPoint(WIN, P.SPRITE, WORK);
  const spots = P.spotsPoint(WIN, P.SPRITE, WORK);
  const tumble = P.tumblePoint(WIN, P.SPRITE, WORK);
  const trumpet = P.trumpetPoint(WIN, P.SPRITE, WORK);
  const many = P.manyPoint(WIN, P.SPRITE, WORK);
  const frost = P.frostPoint(WIN, P.SPRITE, WORK);
  const reef = P.reefPoint(WIN, P.SPRITE, WORK);
  const chord = P.chordPoint(WIN, P.SPRITE, WORK);
  const floatPt = P.floatPoint(WIN, P.SPRITE, WORK);
  const thirst = P.thirstPoint(WIN, P.SPRITE, WORK);
  const spot = P.spotPoint(WIN, P.SPRITE, WORK);
  assert.ok(hole.lift > 8, "the sash well as a reef hole, not the floor");
  assert.ok(Math.abs(hole.x - mantle.x) > 8 || Math.abs(hole.lift - mantle.lift) > 1, "not Gate stool mantle dish");
  assert.ok(Math.abs(hole.x - rays.x) > 8 || Math.abs(hole.lift - rays.lift) > 1, "not Veil apron reef-ledge rays");
  assert.ok(Math.abs(hole.x - papillae.x) > 8 || Math.abs(hole.lift - papillae.lift) > 1, "not Tube sand-well papillae");
  assert.ok(Math.abs(hole.x - station.x) > 8 || Math.abs(hole.lift - station.lift) > 1, "not Scrub station-dish station");
  assert.ok(Math.abs(hole.x - rasps.x) > 8 || Math.abs(hole.lift - rasps.lift) > 1, "not Scrape rock-plate rasps");
  assert.ok(Math.abs(hole.x - bars.x) > 8 || Math.abs(hole.lift - bars.lift) > 1, "not Paint wreath-cup bars");
  assert.ok(Math.abs(hole.x - tentacles.x) > 8 || Math.abs(hole.lift - tentacles.lift) > 1, "not Wreath column-dish tentacles");
  assert.ok(Math.abs(hole.x - valleys.x) > 8 || Math.abs(hole.lift - valleys.lift) > 1, "not Ridge boulder-dish valleys");
  assert.ok(Math.abs(hole.x - blush.x) > 8 || Math.abs(hole.lift - blush.lift) > 1, "not Rose salt-pan blush");
  assert.ok(Math.abs(hole.x - hollow.x) > 8 || Math.abs(hole.lift - hollow.lift) > 1, "not Lattice leaf-mold hollow");
  assert.ok(Math.abs(hole.x - kick.x) > 8 || Math.abs(hole.lift - kick.lift) > 1, "not Velvet silk-burrow kick");
  assert.ok(Math.abs(hole.x - goPt.x) > 8 || Math.abs(hole.lift - goPt.lift) > 1, "not Silver bank-hole go");
  assert.ok(Math.abs(hole.x - spots.x) > 8 || Math.abs(hole.lift - spots.lift) > 1, "not Soar mid-pane reef sky");
  assert.ok(Math.abs(hole.x - tumble.x) > 8 || Math.abs(hole.lift - tumble.lift) > 1, "not Rod broth-cup tumble");
  assert.ok(Math.abs(hole.x - trumpet.x) > 8 || Math.abs(hole.lift - trumpet.lift) > 1, "not Bell trumpet-rim trumpet");
  assert.ok(Math.abs(hole.x - many.x) > 8 || Math.abs(hole.lift - many.lift) > 1, "not Knot paperweight many");
  assert.ok(Math.abs(hole.x - frost.x) > 8 || Math.abs(hole.lift - frost.lift) > 1, "not Brine salt-dish frost");
  assert.ok(Math.abs(hole.x - reef.x) > 8 || Math.abs(hole.lift - reef.lift) > 1, "not Ochre damp-blotter reef");
  assert.ok(Math.abs(hole.x - chord.x) > 8 || Math.abs(hole.lift - chord.lift) > 1, "not Choir mid-center blotter air");
  assert.ok(Math.abs(hole.x - floatPt.x) > 8 || Math.abs(hole.lift - floatPt.lift) > 1, "not Nimbus lower-mid methane bowl");
  assert.ok(Math.abs(hole.x - thirst.x) > 8 || Math.abs(hole.lift - thirst.lift) > 1, "not Gleam upper-right bright pane");
  assert.ok(Math.abs(hole.x - spot.x) > 8 || Math.abs(hole.lift - spot.lift) > 1, "not Seven lamp-drop spot");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "grouper", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real sash well, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 80 }], 80, "grouper", WORK, P.SPRITE);
  assert.equal(short, null, "a real sash well, not a short pane");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 205, height: 177 }], 80, "grouper", WORK, P.SPRITE);
  assert.equal(thin, null, "a real sash well, not a shorter reef hole");
  const okHole = P.pickTarget([{ id: "hole", x: 200, y: 80, width: 205, height: 178 }], 80, "grouper", WORK, P.SPRITE);
  assert.ok(okHole, "a real sash well as a reef hole");
  const shortW = P.pickTarget([{ id: "shortW", x: 200, y: 80, width: 204, height: 178 }], 80, "grouper", WORK, P.SPRITE);
  assert.equal(shortW, null, "a real sash well, not a thinner reef hole");
  const gateOk = P.pickTarget([{ id: "gate", x: 200, y: 80, width: 201, height: 174 }], 80, "giant_clam", WORK, P.SPRITE);
  assert.ok(gateOk, "Gate still takes a window stool");
  const veilOk = P.pickTarget([{ id: "veil", x: 200, y: 80, width: 187, height: 192 }], 80, "lionfish", WORK, P.SPRITE);
  assert.ok(veilOk, "Veil still takes a window apron");
  const tubeOk = P.pickTarget([{ id: "tube", x: 200, y: 80, width: 189, height: 200 }], 80, "sea_cucumber", WORK, P.SPRITE);
  assert.ok(tubeOk, "Tube still takes a window well");
  const scrubOk = P.pickTarget([{ id: "scrub", x: 200, y: 80, width: 191, height: 206 }], 80, "cleaner_shrimp", WORK, P.SPRITE);
  assert.ok(scrubOk, "Scrub still takes a sash well");
  const scrapeOk = P.pickTarget([{ id: "scrape", x: 200, y: 80, width: 193, height: 188 }], 80, "parrotfish", WORK, P.SPRITE);
  assert.ok(scrapeOk, "Scrape still takes a sill pan");
  const paintOk = P.pickTarget([{ id: "paint", x: 200, y: 80, width: 195, height: 176 }], 80, "clownfish", WORK, P.SPRITE);
  assert.ok(paintOk, "Paint still takes a sash pocket");
  const wreathOk = P.pickTarget([{ id: "wreath", x: 200, y: 80, width: 197, height: 182 }], 80, "anemone", WORK, P.SPRITE);
  assert.ok(wreathOk, "Wreath still takes a sash stile");
  const ridgeOk = P.pickTarget([{ id: "ridge", x: 200, y: 80, width: 199, height: 170 }], 80, "brain_coral", WORK, P.SPRITE);
  assert.ok(ridgeOk, "Ridge still takes a window stool boulder dish");
  const mid = P.holePath(0.5);
  assert.ok(mid.lift > 1.0, "review the hole once");
  const hold = P.holeHoldPath(0.5);
  assert.ok(hold.lift >= 1.4, "remain a grouper on the reef hole");
  let play = P.beginPlay(target, target.approachX - 40);
  assert.equal(play.phase, "approach");
  for (let i = 0; i < 1200 && play.phase !== "done"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "done");
  play = P.beginPlay(target, target.approachX);
  const phases = [];
  for (let i = 0; i < 1200 && play.phase !== "done"; i++) {
    if (!phases.length || phases[phases.length - 1] !== play.phase) phases.push(play.phase);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.ok(phases.includes("hole-on"), "walk into the sash well");
  assert.ok(phases.includes("hole"), "review the hole");
  assert.ok(phases.includes("hole-hold"), "remain a grouper");
  assert.ok(phases.includes("hole-off"), "leave the reef hole");
  assert.equal(play.phase, "done");
  const far = P.pickTarget([WIN_B], 40, "grouper", WORK, P.SPRITE);
  assert.ok(far);
  assert.equal(far.kind, "hole");
  assert.ok(P.canStart({ asleep: false, hidden: false, leaving: false, card: false, cmd: "idle" }));
  assert.equal(P.canStart({ asleep: true, cmd: "sleep" }), false);
  assert.equal(P.shouldAbort({ phase: "spots" }, { asleep: true, cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ phase: "hole-hold" }, { asleep: false, hidden: false, leaving: false, card: false, cmd: "idle" }), false);
  play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "spots"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "spots");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "spots");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved reef hole");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "hole-off");
  assert.equal(play.abort, true);
});
'''

def patch_header(text, is_ts=False):
    old = "Next leftover is Hide. Others walk a sill."
    if old not in text:
        raise SystemExit("header Next leftover is Hide not found")
    if is_ts:
        old_ts = "Next leftover is Hide. Others walk a sill. Same map as desktop `window-play.js`."
        if old_ts in text:
            return text.replace(old_ts, HIDE_SENTENCE + " Same map as desktop `window-play.js`.", 1)
    return text.replace(old, HIDE_SENTENCE, 1)

def _has(text, s):
    return s in text or s.replace('\n', '\r\n') in text

def _rep(text, old, new, count=1):
    if old in text:
        return text.replace(old, new, count)
    old2 = old.replace('\n', '\r\n')
    new2 = new.replace('\n', '\r\n')
    if old2 in text:
        return text.replace(old2, new2, count)
    raise SystemExit("missing marker: " + old[:80])

def patch_js(path):
    js = path.read_text(encoding='utf-8')
    js = patch_header(js, False)
    if "const HOLE =" in js:
        raise SystemExit("HOLE already in JS")
    js = _rep(js, '  const SPOTS = "spots";\n  const SILL = "sill";', '  const SPOTS = "spots";\n  const HOLE = "hole";\n  const SILL = "sill";')
    js = _rep(js, "    spotsOff: 3.02,\n    sillHop: 0.38,", "    spotsOff: 3.02,\n    holeOn: 3.31,\n    hole: 2.95,\n    holeHold: 5.87,\n    holeOff: 3.07,\n    sillHop: 0.38,")
    js = _rep(js, '    if (key === "eagle_ray") return SPOTS;\n    return SILL;', '    if (key === "eagle_ray") return SPOTS;\n    if (key === "grouper") return HOLE;\n    return SILL;')
    js = _rep(js, "    if (kind === SPOTS) return w.width >= 203 && w.height >= 176;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === SPOTS) return w.width >= 203 && w.height >= 176;\n    if (kind === HOLE) return w.width >= 205 && w.height >= 178;\n    return w.width >= 180 && w.height >= 70;")
    marker = '        leave: "spotted",\n        spin: "none",\n      };\n    }\n    if (kind === WRAP) {'
    js = _rep(js, marker, '        leave: "spotted",\n        spin: "none",\n      };\n    }\n' + HOLE_PICK_JS + '    if (kind === WRAP) {')
    js = _rep(js, "    if (target.kind === SPOTS) {\n      const hold = spotsPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {", "    if (target.kind === SPOTS) {\n      const hold = spotsPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === HOLE) {\n      const hold = holePoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {")
    if "function beginPlay(target, petX)" not in js:
        raise SystemExit("beginPlay missing")
    js = js.replace("  function beginPlay(target, petX)", HOLE_FUNCS_JS + "\n  function beginPlay(target, petX)", 1)
    js = _rep(js, '        if (target.kind === SPOTS) {\n          return goPhase(next, "spots-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {', '        if (target.kind === SPOTS) {\n          return goPhase(next, "spots-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === HOLE) {\n          return goPhase(next, "hole-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {')
    idx = js.find('if (next.phase === "spots-off")')
    if idx < 0: raise SystemExit('spots-off missing')
    idx2 = js.find('if (next.phase === "sill-hop")', idx)
    if idx2 < 0: raise SystemExit('sill-hop missing')
    phase = HOLE_PHASE_JS
    if '\r\n' in js[idx:idx2]: phase = HOLE_PHASE_JS.replace('\n', '\r\n')
    js = js[:idx2] + phase + ("\r\n" if "\r\n" in js[idx:idx2] else "\n") + js[idx2:]
    try:
        js = _rep(js, "    SPOTS,\n    SILL,", "    SPOTS,\n    HOLE,\n    SILL,")
    except SystemExit:
        js = _rep(js, "    SPOTS,\r\n    SILL,", "    SPOTS,\r\n    HOLE,\r\n    SILL,")
    js = _rep(js, "    spotsOffPath,\n    pickTarget,", "    spotsOffPath,\n    holePoint,\n    holeFace,\n    holeOnPath,\n    holePath,\n    holeHoldPath,\n    holeOffPath,\n    pickTarget,")
    path.write_text(js, encoding='utf-8')
    print("patched JS")

def patch_ts(path):
    ts = path.read_text(encoding='utf-8')
    ts = patch_header(ts, True)
    if "export const HOLE =" in ts or "const HOLE =" in ts:
        raise SystemExit("HOLE already in TS")
    ts = _rep(ts, 'export const SPOTS = "spots";\nexport const SILL = "sill";', 'export const SPOTS = "spots";\nexport const HOLE = "hole";\nexport const SILL = "sill";')
    ts = _rep(ts, "  spotsOff: 3.02,\n  sillHop: 0.38,", "  spotsOff: 3.02,\n  holeOn: 3.31,\n  hole: 2.95,\n  holeHold: 5.87,\n  holeOff: 3.07,\n  sillHop: 0.38,")
    if "typeof HOLE" not in ts:
        ts = _rep(ts, "typeof SPOTS | typeof SILL", "typeof SPOTS | typeof HOLE | typeof SILL")
    if '"reefhole"' not in ts:
        ts = _rep(ts, '| "reefsky";', '| "reefsky" | "reefhole";')
    if '"holed"' not in ts:
        # append after stationed if present, else after spotted
        if '| "stationed";' in ts or '| "stationed";'.replace("\n","\r\n") in ts:
            ts = _rep(ts, '| "stationed";', '| "stationed" | "holed";')
        elif '"spotted"' in ts:
            ts = ts.replace('"spotted"', '"spotted" | "holed"', 1)
        else:
            raise SystemExit("leave union marker missing")
    ts = _rep(ts, '  if (key === "eagle_ray") return SPOTS;\n  return SILL;', '  if (key === "eagle_ray") return SPOTS;\n  if (key === "grouper") return HOLE;\n  return SILL;')
    ts = _rep(ts, "    if (kind === SPOTS) return w.width >= 203 && w.height >= 176;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === SPOTS) return w.width >= 203 && w.height >= 176;\n    if (kind === HOLE) return w.width >= 205 && w.height >= 178;\n    return w.width >= 180 && w.height >= 70;")
    marker = '      leave: "spotted",\n      spin: "none",\n    };\n  }\n\n  if (kind === PRAY) {'
    ts = _rep(ts, marker, '      leave: "spotted",\n      spin: "none",\n    };\n  }\n' + HOLE_PICK_TS + '\n  if (kind === PRAY) {')
    ts = _rep(ts, "  if (target.kind === SPOTS) {\n    const hold = spotsPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {", "  if (target.kind === SPOTS) {\n    const hold = spotsPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === HOLE) {\n    const hold = holePoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {")
    idx2 = ts.find("export function spotsOffPath")
    if idx2 < 0: raise SystemExit('TS spotsOffPath missing')
    idx = ts.find("export function beginPlay", idx2)
    if idx < 0: raise SystemExit('TS beginPlay missing')
    ts = ts[:idx] + HOLE_FUNCS_TS + ('\r\n' if '\r\n' in ts[idx2:idx] else '\n') + ts[idx:]
    ts = _rep(ts, '      if (target.kind === SPOTS) {\n        return goPhase(next, "spots-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {', '      if (target.kind === SPOTS) {\n        return goPhase(next, "spots-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === HOLE) {\n        return goPhase(next, "hole-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {')
    idx = ts.find('if (next.phase === "spots-off")')
    if idx < 0: raise SystemExit('TS spots-off missing')
    idx2 = ts.find('if (next.phase === "sill-hop")', idx)
    if idx2 < 0: raise SystemExit('TS sill-hop missing')
    phase = HOLE_PHASE_TS
    if '\r\n' in ts[idx:idx2]: phase = HOLE_PHASE_TS.replace('\n', '\r\n')
    ts = ts[:idx2] + phase + ts[idx2:]
    path.write_text(ts, encoding='utf-8')
    print("patched TS")

def patch_tests_cjs(path):
    t = path.read_text(encoding='utf-8')
    old = '''test("other guests do not clone Rui's cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "grouper", WORK, P.SPRITE);'''
    new = '''test("unknown keys still walk a sill and hop down (no catalog generic-sill pin after Hide)", () => {\n  assert.equal(P.playFor("grouper"), "hole");\n  assert.equal(P.playFor("__sill_fallthrough__"), "sill");\n  const target = P.pickTarget([WIN], 80, "__sill_fallthrough__", WORK, P.SPRITE);'''
    t = _rep(t, old, new)
    t = t.replace('assert.equal(P.playFor("grouper"), "sill");', 'assert.equal(P.playFor("grouper"), "hole");')
    if 'test("Hide leftover holes' in t:
        raise SystemExit("Hide test already in cjs")
    t = t.rstrip() + "\n" + HIDE_TEST + "\n"
    path.write_text(t, encoding='utf-8')
    print("patched cjs tests")

def patch_tests_mjs(path):
    t = path.read_text(encoding='utf-8')
    t = t.replace('assert.equal(P.playFor("grouper"), "sill");', 'assert.equal(P.playFor("grouper"), "hole");')
    if 'test("Hide leftover holes' in t:
        raise SystemExit("Hide test already in mjs")
    t = t.rstrip() + "\n" + HIDE_TEST + "\n"
    path.write_text(t, encoding='utf-8')
    print("patched mjs tests")

def patch_house(path):
    t = path.read_text(encoding='utf-8')
    old_prefix = 'test("Soar leftover spots a mid pane as a reef sky; ninth leftover of remaining reef/sea after well ten closed;'
    if old_prefix not in t:
        raise SystemExit('house test title missing')
    t = t.replace(
        'test("Soar leftover spots a mid pane as a reef sky; ninth leftover of remaining reef/sea after well ten closed;',
        'test("Hide leftover holes a sash well as a reef hole; tenth leftover of remaining reef/sea after well ten closed; reef/sea leftovers closed; next leftover none; Soar leftover still spots a mid pane as a reef sky; ninth leftover of remaining reef/sea after well ten closed;',
        1,
    )
    t = t.replace('next leftover is Hide', 'next leftover none; reef/sea leftovers closed; no generic-sill pin remains')
    t = t.replace('Next leftover is Hide', 'Next leftover none; reef/sea leftovers closed; no generic-sill pin remains')
    block = (
        '  assert.equal(WP.playFor("grouper"), "hole");\n'
        '  assert.equal(WP.HOLE, "hole");\n'
        '  assert.notEqual(WP.playFor("grouper"), "hide");\n'
        '  assert.notEqual(WP.playFor("grouper"), "Hide");\n'
        '  assert.notEqual(WP.playFor("grouper"), "grouper");\n'
        '  assert.notEqual(WP.playFor("grouper"), "gape");\n'
        '  assert.notEqual(WP.playFor("grouper"), "door");\n'
        '  assert.notEqual(WP.playFor("grouper"), "bill");\n'
        '  assert.notEqual(WP.playFor("grouper"), "lance");\n'
        '  assert.notEqual(WP.playFor("grouper"), "spots");\n'
        '  assert.notEqual(WP.playFor("grouper"), "mantle");\n'
        '  assert.notEqual(WP.playFor("grouper"), "rays");\n'
        '  assert.notEqual(WP.playFor("grouper"), "papillae");\n'
        '  assert.notEqual(WP.playFor("grouper"), "station");\n'
        '  assert.notEqual(WP.playFor("grouper"), "go");\n'
        '  assert.notEqual(WP.playFor("grouper"), "blush");\n'
        '  assert.notEqual(WP.playFor("grouper"), "hollow");\n'
        '  assert.notEqual(WP.playFor("grouper"), "kick");\n'
        '  assert.notEqual(WP.playFor("grouper"), "soar");\n'
        '  assert.notEqual(WP.playFor("grouper"), "sill");\n'
        '  assert.equal(WP.playFor("eagle_ray"), "spots");\n'
        '  assert.equal(WP.SPOTS, "spots");\n'
        '  assert.equal(WP.playFor("giant_clam"), "mantle");\n'
        '  assert.equal(WP.MANTLE, "mantle");\n'
        '  assert.equal(WP.playFor("lionfish"), "rays");\n'
        '  assert.equal(WP.RAYS, "rays");\n'
        '  assert.equal(WP.playFor("sea_cucumber"), "papillae");\n'
        '  assert.equal(WP.PAPILLAE, "papillae");\n'
        '  assert.equal(WP.playFor("cleaner_shrimp"), "station");\n'
        '  assert.equal(WP.playFor("parrotfish"), "rasps");\n'
        '  assert.equal(WP.playFor("nexus"), "many");\n'
        '  assert.equal(WP.playFor("ladybird"), "spot");\n'
        '  assert.equal(WP.playFor("red_tail"), "soar");\n'
        '  assert.equal(WP.playFor("__sill_fallthrough__"), "sill");\n'
        '});'
    )
    t = _rep(t, '  assert.equal(WP.playFor("grouper"), "sill");\n});', block)
    path.write_text(t, encoding='utf-8')
    print("patched house test")

def patch_docs():
    arch = Path("docs/ARCHITECTURE.md")
    a = arch.read_text(encoding="utf-8")
    a = re.sub(
        r"(\| \*\*Last Updated\*\* \| )2026-09-02 \([^)]+\)",
        r"\g<1>2026-09-02 (Hide leftover holes a sash well as a reef hole; tenth leftover of remaining reef/sea after well ten closed; reef/sea leftovers closed; next leftover none; Soar leftover still spots; catalog 220)",
        a,
        count=1,
    )
    arch.write_text(a, encoding="utf-8")

    road = Path("docs/ROADMAP.md")
    r = road.read_text(encoding="utf-8")
    gate_line = None
    for line in r.splitlines():
        if "Gate (`giant_clam`" in line and "mantle" in line:
            gate_line = line
            break
    if not gate_line:
        raise SystemExit("Gate roadmap line missing")
    hide_line = (
        "- [x] Hide (`grouper` / `hide`) holes a real sash well as a reef hole: walk into the sash well "
        "(sash well - she holes, she does not hide/grouper/gape/door/bill/lance/soar/spots/mantle/rays/papillae/station/go/silver/blush/hollow/kick; "
        "a Nassau grouper; not Scrub sash-well station dish, not Rose sash-well salt pan, not Lattice sash-well leaf mold, not Velvet sash-well silk burrow, "
        "not Tube window-well sand well, not Silver window-well bank hole, not Soar mid-pane reef sky, not Gate stool mantle dish, not Door sash-jamb gape, not Lance window-box bill; "
        "The hole is the tell / Review the hole). Catalog stays 220. Reef/sea leftovers closed. Next leftover none. No generic-sill pin remains."
    )
    if "Hide (`grouper`" not in r:
        if "Soar (`eagle_ray`" in r:
            soar_line = next(line for line in r.splitlines() if "Soar (`eagle_ray`" in line)
            r = r.replace(soar_line, soar_line + "\n" + hide_line, 1)
        else:
            soar_line = (
                "- [x] Soar (`eagle_ray` / `soar`) spots a real mid pane as a reef sky: glide onto the mid pane "
                "(mid pane - she spots; The spots are the tell / Review the spots). Catalog stays 220. Hide now holes; reef/sea leftovers closed. Next leftover none."
            )
            r = r.replace(gate_line, gate_line + "\n" + soar_line + "\n" + hide_line, 1)
    r = r.replace(
        "Catalog stays 220. Soar now spots; next leftover is Hide (`grouper`). Do not start Hide.",
        "Catalog stays 220. Hide now holes; reef/sea leftovers closed. Next leftover none. No generic-sill pin remains.",
        1,
    )
    r = re.sub(
        r"\*\*Last Updated:\*\* 2026-09-02 \([^)]+\)",
        "**Last Updated:** 2026-09-02 (Phase 6 leftover: Hide leftover holes a sash well as a reef hole; tenth leftover of remaining reef/sea after well ten closed; reef/sea leftovers closed; next leftover none; catalog 220)",
        r,
        count=1,
    )
    road.write_text(r, encoding="utf-8")

    for readme in [Path("README.md"), Path("desktop/README.md")]:
        txt = readme.read_text(encoding="utf-8")
        if "Hide holes" in txt:
            continue
        needle = "Soar spots a mid pane as a reef sky."
        if needle not in txt:
            raise SystemExit("Soar README needle missing in %s" % readme)
        txt = txt.replace(needle, "Hide holes a sash well as a reef hole. " + needle, 1)
        readme.write_text(txt, encoding="utf-8")
    print("patched docs")


def main():
    patch_js(Path('desktop/renderer/window-play.js'))
    patch_ts(Path('web/src/lib/pets/window-play.ts'))
    patch_tests_cjs(Path('desktop/renderer/window-play.test.cjs'))
    patch_tests_mjs(Path('web/scripts/window-play.test.mjs'))
    patch_house(Path('desktop/renderer/leftover-house.test.cjs'))
    patch_docs()
    print("DONE")

if __name__ == "__main__":
    main()
