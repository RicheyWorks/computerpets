#!/usr/bin/env python3
"""Apply Soar leftover: spots a mid pane as a reef sky."""
from pathlib import Path
import re

SOAR_SENTENCE = (
    "Soar spots a mid pane as a reef sky: glide onto the mid pane, review the spots, then leave. "
    "Gate still owns mantle. Veil still owns rays. Tube still owns papillae. Scrub still owns station. "
    "Scrape still owns rasps. Paint still owns bars. Wreath still owns tentacles. Ridge still owns valleys. "
    "Ochre still owns reef. This is the leftover after Gate. Ninth leftover of remaining reef/sea after well ten closed. "
    "Next leftover is Hide. Others walk a sill."
)

SPOTS_FUNCS_JS = r'''
  function spotsPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 14;
    const span = Math.max(0, win.width - size - pad * 2);
    // mid pane as a reef sky - glide the spots on the mid glass; she spots, she does not soar/eagle_ray/barrel/kite/manta/rays/mantle/papillae/station/rasps/bars/tentacles/valleys/blush/reef/many/spot; spots is the tell
    // not Kite barrel pane-as-bowl-sky, not Choir mid-center blotter air, not Nimbus lower-mid methane bowl, not Gleam upper-right bright pane, not Drake/Spot/Spark sash lights, not Veil apron reef-ledge rays, not Gate stool mantle dish, not Seven lamp-drop spot, not Hook lamp-post soar
    const x = win.x + pad + span * 0.44;
    const pane = Math.max(72, win.height * 0.36);
    const gripY = win.y + pane;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function spotsFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function spotsOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const glide = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.36) * 1.52;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + glide,
      rot: (toX >= fromX ? 1 : -1) * 2.18 * (1 - ease) + glide * 0.05,
    };
  }

  function spotsPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.22) {
      const s = t / 0.22;
      const ease = s * s * (3 - 2 * s);
      // glide onto the mid pane - take the reef sky; the spots; not Kite barrel, not Choir chord, not Gate mantle, not Seven spot
      return { x: ease * 0.19, lift: ease * 1.28, rot: ease * 4.2 };
    }
    if (t < 0.68) {
      const s = (t - 0.22) / 0.46;
      // review the spots once - the tell; she spots, she does not soar/barrel/rays/mantle/spot; spots is the tell
      const review = Math.sin(s * Math.PI);
      return { x: 0.19 + review * 0.48, lift: 1.28 + review * 0.86, rot: 4.2 + s * 6.8 };
    }
    if (t < 0.88) {
      const s = (t - 0.68) / 0.20;
      const ease = s * s * (3 - 2 * s);
      // remain an eagle ray / glide-hold / review the spots
      return { x: 0.19 + ease * 0.09, lift: 1.28 + ease * 0.24, rot: 4.2 + ease * 1.42 };
    }
    return { x: 0.28, lift: 1.52, rot: 5.62 };
  }

  function spotsHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.16;
    // sit the spots on the mid pane as a reef sky; she spots, she does not soar
    return { x: 0.28, lift: 1.52 + hush, rot: 5.62 };
  }

  function spotsOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const glide = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.28) * 1.38;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + glide,
      rot: (from && from.rot != null ? from.rot : 5.62) * (1 - ease),
    };
  }
'''

SPOTS_FUNCS_TS = r'''
export function spotsPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 14;
  const span = Math.max(0, win.width - size - pad * 2);
  // mid pane as a reef sky - glide the spots on the mid glass; she spots, she does not soar/eagle_ray/barrel/kite/manta/rays/mantle/papillae/station/rasps/bars/tentacles/valleys/blush/reef/many/spot; spots is the tell
  // not Kite barrel pane-as-bowl-sky, not Choir mid-center blotter air, not Nimbus lower-mid methane bowl, not Gleam upper-right bright pane, not Drake/Spot/Spark sash lights, not Veil apron reef-ledge rays, not Gate stool mantle dish, not Seven lamp-drop spot, not Hook lamp-post soar
  const x = win.x + pad + span * 0.44;
  const pane = Math.max(72, win.height * 0.36);
  const gripY = win.y + pane;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 36, maxLift) };
}

export function spotsFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function spotsOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const glide = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.36) * 1.52;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + glide,
    rot: (toX >= fromX ? 1 : -1) * 2.18 * (1 - ease) + glide * 0.05,
  };
}

export function spotsPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.22) {
    const s = t / 0.22;
    const ease = s * s * (3 - 2 * s);
    // glide onto the mid pane - take the reef sky; the spots; not Kite barrel, not Choir chord, not Gate mantle, not Seven spot
    return { x: ease * 0.19, lift: ease * 1.28, rot: ease * 4.2 };
  }
  if (t < 0.68) {
    const s = (t - 0.22) / 0.46;
    // review the spots once - the tell; she spots, she does not soar/barrel/rays/mantle/spot; spots is the tell
    const review = Math.sin(s * Math.PI);
    return { x: 0.19 + review * 0.48, lift: 1.28 + review * 0.86, rot: 4.2 + s * 6.8 };
  }
  if (t < 0.88) {
    const s = (t - 0.68) / 0.20;
    const ease = s * s * (3 - 2 * s);
    // remain an eagle ray / glide-hold / review the spots
    return { x: 0.19 + ease * 0.09, lift: 1.28 + ease * 0.24, rot: 4.2 + ease * 1.42 };
  }
  return { x: 0.28, lift: 1.52, rot: 5.62 };
}

export function spotsHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.16;
  // sit the spots on the mid pane as a reef sky; she spots, she does not soar
  return { x: 0.28, lift: 1.52 + hush, rot: 5.62 };
}

export function spotsOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const glide = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.28) * 1.38;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + glide,
    rot: (from && from.rot != null ? from.rot : 5.62) * (1 - ease),
  };
}
'''

SPOTS_PHASE_JS = r'''

    if (next.phase === "spots-on") {
      const face = spotsFace(target);
      const u = next.t / DUR.spotsOn;
      const pose = spotsOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "spots", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "spots") {
      const face = spotsFace(target);
      const pose = spotsPath(Math.min(1, next.t / DUR.spots));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.spots) {
        return goPhase(next, "spots-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "spots-hold") {
      const face = spotsFace(target);
      const pose = spotsHoldPath(Math.min(1, next.t / DUR.spotsHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.spotsHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = spotsHoldPath(1);
        return goPhase(next, "spots-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "spots-off") {
      const u = next.t / DUR.spotsOff;
      const pose = spotsOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }
'''

SPOTS_PHASE_TS = r'''

  if (next.phase === "spots-on") {
    const face = spotsFace(target);
    const u = next.t / DUR.spotsOn;
    const pose = spotsOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "spots", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "spots") {
    const face = spotsFace(target);
    const pose = spotsPath(Math.min(1, next.t / DUR.spots));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.spots) {
      return goPhase(next, "spots-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "spots-hold") {
    const face = spotsFace(target);
    const pose = spotsHoldPath(Math.min(1, next.t / DUR.spotsHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.spotsHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = spotsHoldPath(1);
      return goPhase(next, "spots-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "spots-off") {
    const u = next.t / DUR.spotsOff;
    const pose = spotsOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

'''

SPOTS_PICK_JS = r'''

    if (kind === SPOTS) {
      const hold = spotsPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -58 : 58;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 54 : -54;
      return {
        id: best.id,
        kind,
        side: "reefsky",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "spotted",
        spin: "none",
      };
    }
'''

SPOTS_PICK_TS = r'''

  if (kind === SPOTS) {
    const hold = spotsPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -58 : 58;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 54 : -54;
    return {
      id: best.id,
      kind,
      side: "reefsky",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "spotted",
      spin: "none",
    };
  }
'''

SOAR_TEST = r'''

test("Soar leftover spots a mid pane as a reef sky: glide onto the mid pane, review the spots, then leave", () => {
  const WIN_B = { id: "pw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("eagle_ray"), "spots");
  assert.equal(P.SPOTS, "spots");
  assert.notEqual(P.playFor("eagle_ray"), "soar");
  assert.notEqual(P.playFor("eagle_ray"), "eagle_ray");
  assert.notEqual(P.playFor("eagle_ray"), "Soar");
  assert.notEqual(P.playFor("eagle_ray"), "barrel");
  assert.notEqual(P.playFor("eagle_ray"), "kite");
  assert.notEqual(P.playFor("eagle_ray"), "manta");
  assert.notEqual(P.playFor("eagle_ray"), "rays");
  assert.notEqual(P.playFor("eagle_ray"), "mantle");
  assert.notEqual(P.playFor("eagle_ray"), "papillae");
  assert.notEqual(P.playFor("eagle_ray"), "station");
  assert.notEqual(P.playFor("eagle_ray"), "rasps");
  assert.notEqual(P.playFor("eagle_ray"), "bars");
  assert.notEqual(P.playFor("eagle_ray"), "tentacles");
  assert.notEqual(P.playFor("eagle_ray"), "valleys");
  assert.notEqual(P.playFor("eagle_ray"), "blush");
  assert.notEqual(P.playFor("eagle_ray"), "reef");
  assert.notEqual(P.playFor("eagle_ray"), "many");
  assert.notEqual(P.playFor("eagle_ray"), "spot");
  assert.notEqual(P.playFor("eagle_ray"), "sill");
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
  assert.equal(P.playFor("grouper"), "sill");
  const target = P.pickTarget([WIN], 80, "eagle_ray", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "spots");
  assert.equal(target.side, "reefsky");
  assert.equal(target.leave, "spotted");
  assert.notEqual(target.kind, "soar");
  assert.notEqual(target.kind, "spot");
  assert.notEqual(target.kind, "barrel");
  assert.notEqual(target.kind, "rays");
  assert.notEqual(target.kind, "mantle");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "it spots a mid pane as a reef sky");
  assert.ok(P.DUR.spotsHold > P.DUR.spots * 1.2, "the hold is the sit; spots is the tell");
  assert.ok(P.DUR.spotsOn > 1.0, "a glide onto the mid pane, not a cling");
  assert.ok(P.DUR.spotsOn !== P.DUR.mantleOn);
  assert.ok(P.DUR.spotsOn !== P.DUR.raysOn);
  assert.ok(P.DUR.spotsOn !== P.DUR.papillaeOn);
  assert.ok(P.DUR.spotsOn !== P.DUR.stationOn);
  assert.ok(P.DUR.spotsOn !== P.DUR.raspsOn);
  assert.ok(P.DUR.spotsOn !== P.DUR.barsOn);
  assert.ok(P.DUR.spotsOn !== P.DUR.tentaclesOn);
  assert.ok(P.DUR.spotsOn !== P.DUR.valleysOn);
  assert.ok(P.DUR.spotsOn !== P.DUR.blushOn);
  assert.ok(P.DUR.spotsOn !== P.DUR.reefOn);
  assert.ok(P.DUR.spotsOn !== P.DUR.sillHop);
  assert.ok(P.DUR.spots !== P.DUR.mantle);
  assert.ok(P.DUR.spots !== P.DUR.rays);
  assert.ok(P.DUR.spotsHold !== P.DUR.mantleHold);
  assert.ok(P.DUR.spotsOff !== P.DUR.mantleOff);
  const spots = P.spotsPoint(WIN, P.SPRITE, WORK);
  const mantle = P.mantlePoint(WIN, P.SPRITE, WORK);
  const rays = P.raysPoint(WIN, P.SPRITE, WORK);
  const papillae = P.papillaePoint(WIN, P.SPRITE, WORK);
  const station = P.stationPoint(WIN, P.SPRITE, WORK);
  const rasps = P.raspsPoint(WIN, P.SPRITE, WORK);
  const bars = P.barsPoint(WIN, P.SPRITE, WORK);
  const tentacles = P.tentaclesPoint(WIN, P.SPRITE, WORK);
  const valleys = P.valleysPoint(WIN, P.SPRITE, WORK);
  const blush = P.blushPoint(WIN, P.SPRITE, WORK);
  const tumble = P.tumblePoint(WIN, P.SPRITE, WORK);
  const trumpet = P.trumpetPoint(WIN, P.SPRITE, WORK);
  const many = P.manyPoint(WIN, P.SPRITE, WORK);
  const frost = P.frostPoint(WIN, P.SPRITE, WORK);
  const reef = P.reefPoint(WIN, P.SPRITE, WORK);
  const chord = P.chordPoint(WIN, P.SPRITE, WORK);
  const floatPt = P.floatPoint(WIN, P.SPRITE, WORK);
  const thirst = P.thirstPoint(WIN, P.SPRITE, WORK);
  const spot = P.spotPoint(WIN, P.SPRITE, WORK);
  assert.ok(spots.lift > 8, "the mid pane as a reef sky, not the floor");
  assert.ok(Math.abs(spots.x - mantle.x) > 8 || Math.abs(spots.lift - mantle.lift) > 1, "not Gate stool mantle dish");
  assert.ok(Math.abs(spots.x - rays.x) > 8 || Math.abs(spots.lift - rays.lift) > 1, "not Veil apron reef-ledge rays");
  assert.ok(Math.abs(spots.x - papillae.x) > 8 || Math.abs(spots.lift - papillae.lift) > 1, "not Tube sand-well papillae");
  assert.ok(Math.abs(spots.x - station.x) > 8 || Math.abs(spots.lift - station.lift) > 1, "not Scrub station-dish station");
  assert.ok(Math.abs(spots.x - rasps.x) > 8 || Math.abs(spots.lift - rasps.lift) > 1, "not Scrape rock-plate rasps");
  assert.ok(Math.abs(spots.x - bars.x) > 8 || Math.abs(spots.lift - bars.lift) > 1, "not Paint wreath-cup bars");
  assert.ok(Math.abs(spots.x - tentacles.x) > 8 || Math.abs(spots.lift - tentacles.lift) > 1, "not Wreath column-dish tentacles");
  assert.ok(Math.abs(spots.x - valleys.x) > 8 || Math.abs(spots.lift - valleys.lift) > 1, "not Ridge boulder-dish valleys");
  assert.ok(Math.abs(spots.x - blush.x) > 8 || Math.abs(spots.lift - blush.lift) > 1, "not Rose salt-pan blush");
  assert.ok(Math.abs(spots.x - tumble.x) > 8 || Math.abs(spots.lift - tumble.lift) > 1, "not Rod broth-cup tumble");
  assert.ok(Math.abs(spots.x - trumpet.x) > 8 || Math.abs(spots.lift - trumpet.lift) > 1, "not Bell trumpet-rim trumpet");
  assert.ok(Math.abs(spots.x - many.x) > 8 || Math.abs(spots.lift - many.lift) > 1, "not Knot paperweight many");
  assert.ok(Math.abs(spots.x - frost.x) > 8 || Math.abs(spots.lift - frost.lift) > 1, "not Brine salt-dish frost");
  assert.ok(Math.abs(spots.x - reef.x) > 8 || Math.abs(spots.lift - reef.lift) > 1, "not Ochre damp-blotter reef");
  assert.ok(Math.abs(spots.x - chord.x) > 8 || Math.abs(spots.lift - chord.lift) > 1, "not Choir mid-center blotter air");
  assert.ok(Math.abs(spots.x - floatPt.x) > 8 || Math.abs(spots.lift - floatPt.lift) > 1, "not Nimbus lower-mid methane bowl");
  assert.ok(Math.abs(spots.x - thirst.x) > 8 || Math.abs(spots.lift - thirst.lift) > 1, "not Gleam upper-right bright pane");
  assert.ok(Math.abs(spots.x - spot.x) > 8 || Math.abs(spots.lift - spot.lift) > 1, "not Seven lamp-drop spot");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "eagle_ray", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real mid pane, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 80 }], 80, "eagle_ray", WORK, P.SPRITE);
  assert.equal(short, null, "a real mid pane, not a short pane");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 203, height: 175 }], 80, "eagle_ray", WORK, P.SPRITE);
  assert.equal(thin, null, "a real mid pane, not a shorter reef sky");
  const okSpots = P.pickTarget([{ id: "spots", x: 200, y: 80, width: 203, height: 176 }], 80, "eagle_ray", WORK, P.SPRITE);
  assert.ok(okSpots, "a real mid pane as a reef sky");
  const shortW = P.pickTarget([{ id: "shortW", x: 200, y: 80, width: 202, height: 176 }], 80, "eagle_ray", WORK, P.SPRITE);
  assert.equal(shortW, null, "a real mid pane, not a thinner reef sky");
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
  const mid = P.spotsPath(0.5);
  assert.ok(mid.lift > 1.0, "review the spots once");
  const hold = P.spotsHoldPath(0.5);
  assert.ok(hold.lift >= 1.4, "remain an eagle ray on the reef sky");
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
  assert.ok(phases.includes("spots-on"), "glide onto the mid pane");
  assert.ok(phases.includes("spots"), "review the spots");
  assert.ok(phases.includes("spots-hold"), "remain an eagle ray");
  assert.ok(phases.includes("spots-off"), "leave the reef sky");
  assert.equal(play.phase, "done");
  const far = P.pickTarget([WIN_B], 40, "eagle_ray", WORK, P.SPRITE);
  assert.ok(far);
  assert.equal(far.kind, "spots");
  assert.ok(P.canStart({ asleep: false, hidden: false, leaving: false, card: false, cmd: "idle" }));
  assert.equal(P.canStart({ asleep: true, cmd: "sleep" }), false);
  assert.equal(P.shouldAbort({ phase: "spots" }, { asleep: true, cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ phase: "spots-hold" }, { asleep: false, hidden: false, leaving: false, card: false, cmd: "idle" }), false);
  play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "spots"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "spots");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "spots");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved reef sky");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "spots-off");
  assert.equal(play.abort, true);
});
'''


def patch_header(text, is_ts=False):
    old = "Next leftover is Soar. Others walk a sill."
    if old not in text:
        raise SystemExit("header Next leftover is Soar not found")
    if is_ts:
        old_ts = "Next leftover is Soar. Others walk a sill. Same map as desktop `window-play.js`."
        if old_ts in text:
            return text.replace(old_ts, SOAR_SENTENCE + " Same map as desktop `window-play.js`.", 1)
    return text.replace(old, SOAR_SENTENCE, 1)


def patch_js(path):
    js = path.read_text(encoding="utf-8")
    js = patch_header(js, False)
    if "const SPOTS" in js:
        raise SystemExit("SPOTS already in JS")
    js = js.replace(
        '  const MANTLE = "mantle";\n  const SILL = "sill";',
        '  const MANTLE = "mantle";\n  const SPOTS = "spots";\n  const SILL = "sill";',
        1,
    )
    js = js.replace(
        "    mantleOff: 3.03,\n    sillHop: 0.38,",
        "    mantleOff: 3.03,\n    spotsOn: 3.09,\n    spots: 2.73,\n    spotsHold: 5.81,\n    spotsOff: 2.97,\n    sillHop: 0.38,",
        1,
    )
    js = js.replace(
        '    if (key === "giant_clam") return MANTLE;\n    return SILL;',
        '    if (key === "giant_clam") return MANTLE;\n    if (key === "eagle_ray") return SPOTS;\n    return SILL;',
        1,
    )
    js = js.replace(
        "    if (kind === MANTLE) return w.width >= 201 && w.height >= 174;\n    return w.width >= 180 && w.height >= 70;",
        "    if (kind === MANTLE) return w.width >= 201 && w.height >= 174;\n    if (kind === SPOTS) return w.width >= 203 && w.height >= 176;\n    return w.width >= 180 && w.height >= 70;",
        1,
    )
    marker = '        leave: "mantled",\n        spin: "none",\n      };\n    }\n    if (kind === WRAP) {'
    if marker not in js:
        raise SystemExit("pickTarget MANTLE marker missing")
    js = js.replace(
        marker,
        '        leave: "mantled",\n        spin: "none",\n      };\n    }\n' + SPOTS_PICK_JS + '    if (kind === WRAP) {',
        1,
    )
    js = js.replace(
        "    if (target.kind === MANTLE) {\n      const hold = mantlePoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
        "    if (target.kind === MANTLE) {\n      const hold = mantlePoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === SPOTS) {\n      const hold = spotsPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
        1,
    )
    if "function beginPlay(target, petX)" not in js:
        raise SystemExit("beginPlay missing")
    js = js.replace("  function beginPlay(target, petX)", SPOTS_FUNCS_JS + "\n  function beginPlay(target, petX)", 1)
    js = js.replace(
        '        if (target.kind === MANTLE) {\n          return goPhase(next, "mantle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
        '        if (target.kind === MANTLE) {\n          return goPhase(next, "mantle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === SPOTS) {\n          return goPhase(next, "spots-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
        1,
    )
    idx = js.find('    if (next.phase === "mantle-off")')
    if idx < 0:
        raise SystemExit("mantle-off phase missing")
    idx2 = js.find('    if (next.phase === "sill-hop") {', idx)
    if idx2 < 0:
        raise SystemExit("sill-hop after mantle-off missing")
    js = js[:idx2] + SPOTS_PHASE_JS + "\n" + js[idx2:]
    js = js.replace("    MANTLE,\n    SILL,", "    MANTLE,\n    SPOTS,\n    SILL,", 1)
    js = js.replace(
        "    mantleOffPath,\n    pickTarget,",
        "    mantleOffPath,\n    spotsPoint,\n    spotsFace,\n    spotsOnPath,\n    spotsPath,\n    spotsHoldPath,\n    spotsOffPath,\n    pickTarget,",
        1,
    )
    path.write_text(js, encoding="utf-8")
    print("patched JS")


def patch_ts(path):
    ts = path.read_text(encoding="utf-8")
    ts = patch_header(ts, True)
    if "export const SPOTS" in ts:
        raise SystemExit("SPOTS already in TS")
    ts = ts.replace(
        'export const MANTLE = "mantle";\nexport const SILL = "sill";',
        'export const MANTLE = "mantle";\nexport const SPOTS = "spots";\nexport const SILL = "sill";',
        1,
    )
    ts = ts.replace(
        "  mantleOff: 3.03,\n  sillHop: 0.38,",
        "  mantleOff: 3.03,\n  spotsOn: 3.09,\n  spots: 2.73,\n  spotsHold: 5.81,\n  spotsOff: 2.97,\n  sillHop: 0.38,",
        1,
    )
    if "typeof MANTLE" in ts and "typeof SPOTS" not in ts:
        ts = ts.replace("typeof MANTLE | typeof SILL", "typeof MANTLE | typeof SPOTS | typeof SILL", 1)
        ts = ts.replace("typeof MANTLE | typeof IGNORE", "typeof MANTLE | typeof SPOTS | typeof IGNORE", 1)
        ts = ts.replace("typeof MANTLE;", "typeof MANTLE | typeof SPOTS;", 1)
    # side union: add reefsky after stationdish
    if '| "reefsky"' not in ts and '| "stationdish"' in ts:
        ts = ts.replace('| "stationdish"', '| "stationdish" | "reefsky"', 1)
    ts = ts.replace(
        '  if (key === "giant_clam") return MANTLE;\n  return SILL;',
        '  if (key === "giant_clam") return MANTLE;\n  if (key === "eagle_ray") return SPOTS;\n  return SILL;',
        1,
    )
    old_size = "    if (kind === MANTLE) return w.width >= 201 && w.height >= 174;\n    return w.width >= 180 && w.height >= 70;"
    new_size = "    if (kind === MANTLE) return w.width >= 201 && w.height >= 174;\n    if (kind === SPOTS) return w.width >= 203 && w.height >= 176;\n    return w.width >= 180 && w.height >= 70;"
    if old_size not in ts:
        raise SystemExit("TS size gate marker missing")
    ts = ts.replace(old_size, new_size, 1)
    marker = '      leave: "mantled",\n      spin: "none",\n    };\n  }\n  if (kind === WRAP) {'
    if marker not in ts:
        raise SystemExit("TS pickTarget marker missing")
    ts = ts.replace(
        marker,
        '      leave: "mantled",\n      spin: "none",\n    };\n  }\n' + SPOTS_PICK_TS + '  if (kind === WRAP) {',
        1,
    )
    ts = ts.replace(
        "  if (target.kind === MANTLE) {\n    const hold = mantlePoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
        "  if (target.kind === MANTLE) {\n    const hold = mantlePoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === SPOTS) {\n    const hold = spotsPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
        1,
    )
    idx2 = ts.find("export function mantleOffPath")
    if idx2 < 0:
        raise SystemExit("TS mantleOffPath missing")
    idx = ts.find("export function beginPlay", idx2)
    if idx < 0:
        raise SystemExit("TS beginPlay missing")
    ts = ts[:idx] + SPOTS_FUNCS_TS + "\n" + ts[idx:]
    ts = ts.replace(
        '    if (target.kind === MANTLE) {\n      return goPhase(next, "mantle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n    }\n    if (target.kind === WRAP) {',
        '    if (target.kind === MANTLE) {\n      return goPhase(next, "mantle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n    }\n    if (target.kind === SPOTS) {\n      return goPhase(next, "spots-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n    }\n    if (target.kind === WRAP) {',
        1,
    )
    idx = ts.find('  if (next.phase === "mantle-off")')
    if idx < 0:
        raise SystemExit("TS mantle-off missing")
    idx2 = ts.find('  if (next.phase === "sill-hop") {', idx)
    if idx2 < 0:
        raise SystemExit("TS sill-hop missing")
    ts = ts[:idx2] + SPOTS_PHASE_TS + ts[idx2:]
    path.write_text(ts, encoding="utf-8")
    print("patched TS")


def patch_tests_cjs(path):
    t = path.read_text(encoding="utf-8")
    t = t.replace(
        'const target = P.pickTarget([WIN], 80, "eagle_ray", WORK, P.SPRITE);',
        'const target = P.pickTarget([WIN], 80, "grouper", WORK, P.SPRITE);',
        1,
    )
    t = t.replace('assert.equal(P.playFor("eagle_ray"), "sill");', 'assert.equal(P.playFor("grouper"), "sill");')
    if 'test("Soar leftover spots' in t:
        raise SystemExit("Soar test already in cjs")
    t = t.rstrip() + "\n" + SOAR_TEST + "\n"
    path.write_text(t, encoding="utf-8")
    print("patched cjs tests")


def patch_tests_mjs(path):
    t = path.read_text(encoding="utf-8")
    t = t.replace('assert.equal(P.playFor("eagle_ray"), "sill");', 'assert.equal(P.playFor("grouper"), "sill");')
    if 'test("Soar leftover spots' in t:
        raise SystemExit("Soar test already in mjs")
    t = t.rstrip() + "\n" + SOAR_TEST + "\n"
    path.write_text(t, encoding="utf-8")
    print("patched mjs tests")


def patch_house(path):
    t = path.read_text(encoding="utf-8")
    old_prefix = 'test("Gate leftover mantles a window stool as a mantle dish; eighth leftover of remaining reef/sea after well ten closed;'
    if old_prefix not in t:
        raise SystemExit("house test title missing")
    t = t.replace(
        'test("Gate leftover mantles a window stool as a mantle dish; eighth leftover of remaining reef/sea after well ten closed;',
        'test("Soar leftover spots a mid pane as a reef sky; ninth leftover of remaining reef/sea after well ten closed; Gate leftover still mantles a window stool as a mantle dish; eighth leftover of remaining reef/sea after well ten closed;',
        1,
    )
    t = t.replace("next leftover is Soar", "next leftover is Hide")
    t = t.replace("Next leftover is Soar", "Next leftover is Hide")
    block = '''  assert.equal(WP.playFor("eagle_ray"), "spots");
  assert.equal(WP.SPOTS, "spots");
  assert.notEqual(WP.playFor("eagle_ray"), "soar");
  assert.notEqual(WP.playFor("eagle_ray"), "eagle_ray");
  assert.notEqual(WP.playFor("eagle_ray"), "Soar");
  assert.notEqual(WP.playFor("eagle_ray"), "barrel");
  assert.notEqual(WP.playFor("eagle_ray"), "kite");
  assert.notEqual(WP.playFor("eagle_ray"), "manta");
  assert.notEqual(WP.playFor("eagle_ray"), "rays");
  assert.notEqual(WP.playFor("eagle_ray"), "mantle");
  assert.notEqual(WP.playFor("eagle_ray"), "papillae");
  assert.notEqual(WP.playFor("eagle_ray"), "station");
  assert.notEqual(WP.playFor("eagle_ray"), "rasps");
  assert.notEqual(WP.playFor("eagle_ray"), "bars");
  assert.notEqual(WP.playFor("eagle_ray"), "tentacles");
  assert.notEqual(WP.playFor("eagle_ray"), "valleys");
  assert.notEqual(WP.playFor("eagle_ray"), "blush");
  assert.notEqual(WP.playFor("eagle_ray"), "reef");
  assert.notEqual(WP.playFor("eagle_ray"), "many");
  assert.notEqual(WP.playFor("eagle_ray"), "spot");
  assert.notEqual(WP.playFor("eagle_ray"), "sill");
  assert.equal(WP.playFor("giant_clam"), "mantle");
  assert.equal(WP.MANTLE, "mantle");
  assert.equal(WP.playFor("lionfish"), "rays");
  assert.equal(WP.RAYS, "rays");
  assert.equal(WP.playFor("sea_cucumber"), "papillae");
  assert.equal(WP.PAPILLAE, "papillae");
  assert.equal(WP.playFor("cleaner_shrimp"), "station");
  assert.equal(WP.playFor("parrotfish"), "rasps");
  assert.equal(WP.playFor("nexus"), "many");
  assert.equal(WP.playFor("ladybird"), "spot");
  assert.equal(WP.playFor("red_tail"), "soar");
  assert.equal(WP.playFor("grouper"), "sill");
});'''
    old = '''  assert.equal(WP.playFor("eagle_ray"), "sill");
});'''
    if old not in t:
        raise SystemExit("house eagle_ray sill pin missing")
    t = t.replace(old, block, 1)
    path.write_text(t, encoding="utf-8")
    print("patched house test")


def patch_docs():
    arch = Path("docs/ARCHITECTURE.md")
    a = arch.read_text(encoding="utf-8")
    a = re.sub(
        r"(\| \*\*Last Updated\*\* \| )2026-09-02 \([^)]+\)",
        r"\g<1>2026-09-02 (Soar leftover spots a mid pane as a reef sky; ninth leftover of remaining reef/sea after well ten closed; Gate leftover still mantles a window stool as a mantle dish; catalog 220)",
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
    soar_line = (
        "- [x] Soar (`eagle_ray` / `soar`) spots a real mid pane as a reef sky: glide onto the mid pane "
        "(mid pane - she spots, she does not soar/eagle_ray/barrel/kite/manta/rays/mantle/papillae/station/rasps/bars/tentacles/valleys/blush/reef/many/spot; "
        "an eagle ray; not Kite barrel pane-as-bowl-sky, not Choir mid-center blotter air, not Nimbus lower-mid methane bowl, not Gleam upper-right bright pane, "
        "not Drake/Spot/Spark sash lights, not Veil apron reef-ledge rays, not Gate stool mantle dish, not Tube sand-well papillae, not Scrub station-dish station, "
        "not Scrape rock-plate rasps, not Paint wreath-cup bars, not Wreath column-dish tentacles, not Ridge boulder-dish valleys, not Rose salt-pan blush, "
        "not Ochre damp-blotter reef, not Knot paperweight many, not Seven lamp-drop spot, not Hook lamp-post soar; The spots are the tell / Review the spots). "
        "Catalog stays 220. Next leftover is Hide (`grouper`). Do not start Hide."
    )
    if "Soar (`eagle_ray`" not in r:
        r = r.replace(gate_line, gate_line + "\n" + soar_line, 1)
    r = r.replace(
        "Catalog stays 220. Next leftover is Soar (`eagle_ray`). Do not start Soar.",
        "Catalog stays 220. Soar now spots; next leftover is Hide (`grouper`). Do not start Hide.",
        1,
    )
    r = re.sub(
        r"\*\*Last Updated:\*\* 2026-09-02 \([^)]+\)",
        "**Last Updated:** 2026-09-02 (Phase 6 leftover: Soar leftover spots a mid pane as a reef sky; ninth leftover of remaining reef/sea after well ten closed; Gate leftover still mantles; catalog 220)",
        r,
        count=1,
    )
    road.write_text(r, encoding="utf-8")

    for readme in [Path("README.md"), Path("desktop/README.md")]:
        txt = readme.read_text(encoding="utf-8")
        if "Soar spots" in txt:
            continue
        needle = "Gate mantles a window stool as a mantle dish."
        if needle in txt:
            txt = txt.replace(needle, "Soar spots a mid pane as a reef sky. " + needle, 1)
        else:
            raise SystemExit("Gate README needle missing in %s" % readme)
        readme.write_text(txt, encoding="utf-8")
    print("patched docs")


def main():
    patch_js(Path("desktop/renderer/window-play.js"))
    patch_ts(Path("web/src/lib/pets/window-play.ts"))
    patch_tests_cjs(Path("desktop/renderer/window-play.test.cjs"))
    patch_tests_mjs(Path("web/scripts/window-play.test.mjs"))
    patch_house(Path("desktop/renderer/leftover-house.test.cjs"))
    patch_docs()
    print("DONE")


if __name__ == "__main__":
    main()
