#!/usr/bin/env python3
"""Apply Gate leftover: mantles a window stool as a mantle dish."""
from pathlib import Path
import re

GATE_SENTENCE = (
    "Gate mantles a window stool as a mantle dish: walk onto the stool, open the mantle, then leave. "
    "Veil still owns rays. Tube still owns papillae. Scrub still owns station. Scrape still owns rasps. "
    "Paint still owns bars. Wreath still owns tentacles. Ridge still owns valleys. Ochre still owns reef. "
    "This is the leftover after Veil. Eighth leftover of remaining reef/sea after well ten closed. "
    "Next leftover is Soar. Others walk a sill."
)

MANTLE_FUNCS_JS = r'''
  function mantlePoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 31;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.72;
    // window stool as a mantle dish - sit the mantle on the stool; she mantles, she does not gate/giant_clam/rays/papillae/station/rasps/bars/tentacles/valleys/blush/reef/many/soar; mantle is the tell
    // not Veil apron reef-ledge rays, not Tube sand-well papillae, not Scrub sash-well station, not Scrape rock-plate rasps, not Paint wreath-cup bars, not Wreath column-dish tentacles, not Ridge boulder-dish valleys, not Rose salt-pan blush, not Ochre damp-blotter reef, not Knot paperweight many, not Knurl wrack dish, not Chirp grass dish, not Chamber rise, not Cone clamp, not Disk open, not Cup lid, not Hook soar
    const mantle = Math.max(40, size * 0.22);
    const gripY = win.y + win.height - mantle;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 20, maxLift) };
  }

  function mantleFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function mantleOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.48) * 1.64;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 2.42 * (1 - ease) + stride * 0.06,
    };
  }

  function mantlePath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.24) {
      const s = t / 0.24;
      const ease = s * s * (3 - 2 * s);
      // walk onto the stool - take the mantle dish; the mantle; not Veil rays, not Tube papillae, not Ridge valleys, not Disk open
      return { x: ease * 0.17, lift: ease * 1.34, rot: ease * 4.8 };
    }
    if (t < 0.70) {
      const s = (t - 0.24) / 0.46;
      // open/review the mantle once - the tell; she mantles, she does not rays/papillae/valleys/open/rise/clamp/soar; mantle is the tell
      const open = Math.sin(s * Math.PI);
      return { x: 0.17 + open * 0.42, lift: 1.34 + open * 0.78, rot: 4.8 + s * 7.4 };
    }
    if (t < 0.90) {
      const s = (t - 0.70) / 0.20;
      const ease = s * s * (3 - 2 * s);
      // remain a giant clam / hold / review the mantle
      return { x: 0.17 + ease * 0.08, lift: 1.34 + ease * 0.22, rot: 4.8 + ease * 1.55 };
    }
    return { x: 0.25, lift: 1.56, rot: 6.35 };
  }

  function mantleHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.14;
    // sit the mantle on the window stool as a mantle dish; she mantles, she does not rays
    return { x: 0.25, lift: 1.56 + hush, rot: 6.35 };
  }

  function mantleOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.31) * 1.42;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 6.35) * (1 - ease),
    };
  }
'''

MANTLE_FUNCS_TS = r'''
export function mantlePoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 31;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.72;
  // window stool as a mantle dish - sit the mantle on the stool; she mantles, she does not gate/giant_clam/rays/papillae/station/rasps/bars/tentacles/valleys/blush/reef/many/soar; mantle is the tell
  // not Veil apron reef-ledge rays, not Tube sand-well papillae, not Scrub sash-well station, not Scrape rock-plate rasps, not Paint wreath-cup bars, not Wreath column-dish tentacles, not Ridge boulder-dish valleys, not Rose salt-pan blush, not Ochre damp-blotter reef, not Knot paperweight many, not Knurl wrack dish, not Chirp grass dish, not Chamber rise, not Cone clamp, not Disk open, not Cup lid, not Hook soar
  const mantle = Math.max(40, size * 0.22);
  const gripY = win.y + win.height - mantle;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 20, maxLift) };
}

export function mantleFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function mantleOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.48) * 1.64;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 2.42 * (1 - ease) + stride * 0.06,
  };
}

export function mantlePath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.24) {
    const s = t / 0.24;
    const ease = s * s * (3 - 2 * s);
    // walk onto the stool - take the mantle dish; the mantle; not Veil rays, not Tube papillae, not Ridge valleys, not Disk open
    return { x: ease * 0.17, lift: ease * 1.34, rot: ease * 4.8 };
  }
  if (t < 0.70) {
    const s = (t - 0.24) / 0.46;
    // open/review the mantle once - the tell; she mantles, she does not rays/papillae/valleys/open/rise/clamp/soar; mantle is the tell
    const open = Math.sin(s * Math.PI);
    return { x: 0.17 + open * 0.42, lift: 1.34 + open * 0.78, rot: 4.8 + s * 7.4 };
  }
  if (t < 0.90) {
    const s = (t - 0.70) / 0.20;
    const ease = s * s * (3 - 2 * s);
    // remain a giant clam / hold / review the mantle
    return { x: 0.17 + ease * 0.08, lift: 1.34 + ease * 0.22, rot: 4.8 + ease * 1.55 };
  }
  return { x: 0.25, lift: 1.56, rot: 6.35 };
}

export function mantleHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.14;
  // sit the mantle on the window stool as a mantle dish; she mantles, she does not rays
  return { x: 0.25, lift: 1.56 + hush, rot: 6.35 };
}

export function mantleOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.31) * 1.42;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : 6.35) * (1 - ease),
  };
}
'''

MANTLE_PHASE_JS = r'''

    if (next.phase === "mantle-on") {
      const face = mantleFace(target);
      const u = next.t / DUR.mantleOn;
      const pose = mantleOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "mantle", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "mantle") {
      const face = mantleFace(target);
      const pose = mantlePath(Math.min(1, next.t / DUR.mantle));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.mantle) {
        return goPhase(next, "mantle-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "mantle-hold") {
      const face = mantleFace(target);
      const pose = mantleHoldPath(Math.min(1, next.t / DUR.mantleHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.mantleHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = mantleHoldPath(1);
        return goPhase(next, "mantle-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "mantle-off") {
      const u = next.t / DUR.mantleOff;
      const pose = mantleOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }
'''

MANTLE_PHASE_TS = r'''

  if (next.phase === "mantle-on") {
    const face = mantleFace(target);
    const u = next.t / DUR.mantleOn;
    const pose = mantleOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "mantle", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "mantle") {
    const face = mantleFace(target);
    const pose = mantlePath(Math.min(1, next.t / DUR.mantle));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.mantle) {
      return goPhase(next, "mantle-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "mantle-hold") {
    const face = mantleFace(target);
    const pose = mantleHoldPath(Math.min(1, next.t / DUR.mantleHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.mantleHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = mantleHoldPath(1);
      return goPhase(next, "mantle-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "mantle-off") {
    const u = next.t / DUR.mantleOff;
    const pose = mantleOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

'''

MANTLE_PICK_JS = r'''

    if (kind === MANTLE) {
      const hold = mantlePoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -56 : 56;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 52 : -52;
      return {
        id: best.id,
        kind,
        side: "mantledish",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "mantled",
        spin: "none",
      };
    }
'''

MANTLE_PICK_TS = r'''

  if (kind === MANTLE) {
    const hold = mantlePoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -56 : 56;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 52 : -52;
    return {
      id: best.id,
      kind,
      side: "mantledish",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "mantled",
      spin: "none",
    };
  }
'''

GATE_TEST = r'''

test("Gate leftover mantles a window stool as a mantle dish: walk onto the stool, open the mantle, then leave", () => {
  const WIN_B = { id: "pw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("giant_clam"), "mantle");
  assert.equal(P.MANTLE, "mantle");
  assert.notEqual(P.playFor("giant_clam"), "gate");
  assert.notEqual(P.playFor("giant_clam"), "giant_clam");
  assert.notEqual(P.playFor("giant_clam"), "open");
  assert.notEqual(P.playFor("giant_clam"), "rise");
  assert.notEqual(P.playFor("giant_clam"), "clamp");
  assert.notEqual(P.playFor("giant_clam"), "lid");
  assert.notEqual(P.playFor("giant_clam"), "rays");
  assert.notEqual(P.playFor("giant_clam"), "papillae");
  assert.notEqual(P.playFor("giant_clam"), "station");
  assert.notEqual(P.playFor("giant_clam"), "rasps");
  assert.notEqual(P.playFor("giant_clam"), "bars");
  assert.notEqual(P.playFor("giant_clam"), "tentacles");
  assert.notEqual(P.playFor("giant_clam"), "valleys");
  assert.notEqual(P.playFor("giant_clam"), "blush");
  assert.notEqual(P.playFor("giant_clam"), "reef");
  assert.notEqual(P.playFor("giant_clam"), "many");
  assert.notEqual(P.playFor("giant_clam"), "soar");
  assert.notEqual(P.playFor("giant_clam"), "sill");
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
  assert.equal(P.playFor("halovore"), "frost");
  assert.equal(P.FROST, "frost");
  assert.equal(P.playFor("terminator"), "rim");
  assert.equal(P.RIM, "rim");
  assert.equal(P.playFor("ladybird"), "spot");
  assert.equal(P.SPOT, "spot");
  assert.equal(P.playFor("eagle_ray"), "sill");
  const target = P.pickTarget([WIN], 80, "giant_clam", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "mantle");
  assert.equal(target.side, "mantledish");
  assert.equal(target.leave, "mantled");
  assert.notEqual(target.kind, "rays");
  assert.notEqual(target.kind, "papillae");
  assert.notEqual(target.kind, "station");
  assert.notEqual(target.kind, "rasps");
  assert.notEqual(target.kind, "bars");
  assert.notEqual(target.kind, "tentacles");
  assert.notEqual(target.kind, "valleys");
  assert.notEqual(target.kind, "reef");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "it mantles a window stool as a mantle dish");
  assert.ok(P.DUR.mantleHold > P.DUR.mantle * 1.2, "the hold is the sit; mantle is the tell");
  assert.ok(P.DUR.mantleOn > 1.0, "a walk onto the stool, not a cling");
  assert.ok(P.DUR.mantleOn !== P.DUR.raysOn);
  assert.ok(P.DUR.mantleOn !== P.DUR.papillaeOn);
  assert.ok(P.DUR.mantleOn !== P.DUR.stationOn);
  assert.ok(P.DUR.mantleOn !== P.DUR.raspsOn);
  assert.ok(P.DUR.mantleOn !== P.DUR.barsOn);
  assert.ok(P.DUR.mantleOn !== P.DUR.tentaclesOn);
  assert.ok(P.DUR.mantleOn !== P.DUR.valleysOn);
  assert.ok(P.DUR.mantleOn !== P.DUR.blushOn);
  assert.ok(P.DUR.mantleOn !== P.DUR.reefOn);
  assert.ok(P.DUR.mantleOn !== P.DUR.sillHop);
  assert.ok(P.DUR.mantle !== P.DUR.rays);
  assert.ok(P.DUR.mantle !== P.DUR.papillae);
  assert.ok(P.DUR.mantleHold !== P.DUR.raysHold);
  assert.ok(P.DUR.mantleOff !== P.DUR.raysOff);
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
  const two = P.twoPoint(WIN, P.SPRITE, WORK);
  assert.ok(mantle.lift > 8, "the window stool as a mantle dish, not the sky");
  assert.ok(Math.abs(mantle.x - rays.x) > 8 || Math.abs(mantle.lift - rays.lift) > 1, "not Veil apron reef-ledge rays");
  assert.ok(Math.abs(mantle.x - papillae.x) > 8 || Math.abs(mantle.lift - papillae.lift) > 1, "not Tube sand-well papillae");
  assert.ok(Math.abs(mantle.x - station.x) > 8 || Math.abs(mantle.lift - station.lift) > 1, "not Scrub station-dish station");
  assert.ok(Math.abs(mantle.x - rasps.x) > 8 || Math.abs(mantle.lift - rasps.lift) > 1, "not Scrape rock-plate rasps");
  assert.ok(Math.abs(mantle.x - bars.x) > 8 || Math.abs(mantle.lift - bars.lift) > 1, "not Paint wreath-cup bars");
  assert.ok(Math.abs(mantle.x - tentacles.x) > 8 || Math.abs(mantle.lift - tentacles.lift) > 1, "not Wreath column-dish tentacles");
  assert.ok(Math.abs(mantle.x - valleys.x) > 8 || Math.abs(mantle.lift - valleys.lift) > 1, "not Ridge boulder-dish valleys");
  assert.ok(Math.abs(mantle.x - blush.x) > 8 || Math.abs(mantle.lift - blush.lift) > 1, "not Rose salt-pan blush");
  assert.ok(Math.abs(mantle.x - tumble.x) > 8 || Math.abs(mantle.lift - tumble.lift) > 1, "not Rod broth-cup tumble");
  assert.ok(Math.abs(mantle.x - trumpet.x) > 8 || Math.abs(mantle.lift - trumpet.lift) > 1, "not Bell trumpet-rim trumpet");
  assert.ok(Math.abs(mantle.x - many.x) > 8 || Math.abs(mantle.lift - many.lift) > 1, "not Knot paperweight many");
  assert.ok(Math.abs(mantle.x - frost.x) > 8 || Math.abs(mantle.lift - frost.lift) > 1, "not Brine salt-dish frost");
  assert.ok(Math.abs(mantle.x - reef.x) > 8 || Math.abs(mantle.lift - reef.lift) > 1, "not Ochre damp-blotter reef");
  assert.ok(Math.abs(mantle.x - two.x) > 8 || Math.abs(mantle.lift - two.lift) > 1, "not Spin wet-plate two");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "giant_clam", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window stool, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 80 }], 80, "giant_clam", WORK, P.SPRITE);
  assert.equal(short, null, "a real window stool, not a short pane");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 201, height: 173 }], 80, "giant_clam", WORK, P.SPRITE);
  assert.equal(thin, null, "a real window stool, not a shorter stool");
  const okMantle = P.pickTarget([{ id: "mantle", x: 200, y: 80, width: 201, height: 174 }], 80, "giant_clam", WORK, P.SPRITE);
  assert.ok(okMantle, "a real window stool as a mantle dish");
  const shortW = P.pickTarget([{ id: "shortW", x: 200, y: 80, width: 200, height: 174 }], 80, "giant_clam", WORK, P.SPRITE);
  assert.equal(shortW, null, "a real window stool, not a thinner stool");
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
  const mid = P.mantlePath(0.5);
  assert.ok(mid.lift > 1.0, "open/review the mantle once");
  const hold = P.mantleHoldPath(0.5);
  assert.ok(hold.lift >= 1.4, "remain a giant clam on the mantle dish");
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
  assert.ok(phases.includes("mantle-on"), "walk onto the stool");
  assert.ok(phases.includes("mantle"), "open/review the mantle");
  assert.ok(phases.includes("mantle-hold"), "remain a giant clam");
  assert.ok(phases.includes("mantle-off"), "leave the mantle dish");
  assert.equal(play.phase, "done");
  const far = P.pickTarget([WIN_B], 40, "giant_clam", WORK, P.SPRITE);
  assert.ok(far);
  assert.equal(far.kind, "mantle");
  assert.ok(P.canStart({ asleep: false, hidden: false, leaving: false, card: false, cmd: "idle" }));
  assert.equal(P.canStart({ asleep: true, cmd: "sleep" }), false);
  assert.equal(P.shouldAbort({ phase: "mantle" }, { asleep: true, cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ phase: "mantle-hold" }, { asleep: false, hidden: false, leaving: false, card: false, cmd: "idle" }), false);
  play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "mantle"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "mantle");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "mantle");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved mantle dish");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "mantle-off");
  assert.equal(play.abort, true);
});
'''

def patch_header(text, is_ts=False):
    old = "Next leftover is Gate. Others walk a sill."
    if old not in text:
        raise SystemExit("header Next leftover is Gate not found")
    if is_ts:
        old_ts = "Next leftover is Gate. Others walk a sill. Same map as desktop `window-play.js`."
        if old_ts in text:
            return text.replace(old_ts, GATE_SENTENCE + " Same map as desktop `window-play.js`.", 1)
    return text.replace(old, GATE_SENTENCE, 1)

def patch_js(path):
    js = path.read_text(encoding="utf-8")
    js = patch_header(js, False)
    if "const MANTLE" in js:
        raise SystemExit("MANTLE already in JS")
    js = js.replace('  const RAYS = "rays";\n  const SILL = "sill";',
                    '  const RAYS = "rays";\n  const MANTLE = "mantle";\n  const SILL = "sill";', 1)
    js = js.replace(
        "    raysOff: 3.05,\n    sillHop: 0.38,",
        "    raysOff: 3.05,\n    mantleOn: 3.11,\n    mantle: 2.84,\n    mantleHold: 5.92,\n    mantleOff: 3.04,\n    sillHop: 0.38,",
        1,
    )
    js = js.replace(
        '    if (key === "lionfish") return RAYS;\n    return SILL;',
        '    if (key === "lionfish") return RAYS;\n    if (key === "giant_clam") return MANTLE;\n    return SILL;',
        1,
    )
    js = js.replace(
        "    if (kind === RAYS) return w.width >= 187 && w.height >= 192;\n    return w.width >= 180 && w.height >= 70;",
        "    if (kind === RAYS) return w.width >= 187 && w.height >= 192;\n    if (kind === MANTLE) return w.width >= 201 && w.height >= 174;\n    return w.width >= 180 && w.height >= 70;",
        1,
    )
    marker = '        leave: "rayed",\n        spin: "none",\n      };\n    }\n    if (kind === WRAP) {'
    if marker not in js:
        raise SystemExit("pickTarget RAYS marker missing")
    js = js.replace(marker, '        leave: "rayed",\n        spin: "none",\n      };\n    }\n' + MANTLE_PICK_JS + '    if (kind === WRAP) {', 1)
    js = js.replace(
        "    if (target.kind === RAYS) {\n      const hold = raysPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
        "    if (target.kind === RAYS) {\n      const hold = raysPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === MANTLE) {\n      const hold = mantlePoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
        1,
    )
    if "function beginPlay(target, petX)" not in js:
        raise SystemExit("beginPlay missing")
    js = js.replace("  function beginPlay(target, petX)", MANTLE_FUNCS_JS + "\n  function beginPlay(target, petX)", 1)
    js = js.replace(
        '        if (target.kind === RAYS) {\n          return goPhase(next, "rays-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
        '        if (target.kind === RAYS) {\n          return goPhase(next, "rays-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === MANTLE) {\n          return goPhase(next, "mantle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
        1,
    )
    idx = js.find('    if (next.phase === "rays-off")')
    if idx < 0:
        raise SystemExit("rays-off phase missing")
    idx2 = js.find('    if (next.phase === "sill-hop") {', idx)
    if idx2 < 0:
        raise SystemExit("sill-hop after rays-off missing")
    js = js[:idx2] + MANTLE_PHASE_JS + "\n" + js[idx2:]
    js = js.replace("    RAYS,\n    SILL,", "    RAYS,\n    MANTLE,\n    SILL,", 1)
    js = js.replace(
        "    raysOffPath,\n    pickTarget,",
        "    raysOffPath,\n    mantlePoint,\n    mantleFace,\n    mantleOnPath,\n    mantlePath,\n    mantleHoldPath,\n    mantleOffPath,\n    pickTarget,",
        1,
    )
    path.write_text(js, encoding="utf-8")
    print("patched JS")

def patch_ts(path):
    ts = path.read_text(encoding="utf-8")
    ts = patch_header(ts, True)
    if "export const MANTLE" in ts:
        raise SystemExit("MANTLE already in TS")
    ts = ts.replace('export const RAYS = "rays";\nexport const SILL = "sill";',
                    'export const RAYS = "rays";\nexport const MANTLE = "mantle";\nexport const SILL = "sill";', 1)
    ts = ts.replace(
        "  raysOff: 3.05,\n  sillHop: 0.38,",
        "  raysOff: 3.05,\n  mantleOn: 3.11,\n  mantle: 2.84,\n  mantleHold: 5.92,\n  mantleOff: 3.04,\n  sillHop: 0.38,",
        1,
    )
    if "typeof RAYS" in ts and "typeof MANTLE" not in ts:
        ts = ts.replace("typeof RAYS |", "typeof RAYS | typeof MANTLE |", 1)
        if "typeof MANTLE" not in ts:
            ts = ts.replace("| typeof RAYS | typeof SILL", "| typeof RAYS | typeof MANTLE | typeof SILL", 1)
            ts = ts.replace("| typeof RAYS | typeof IGNORE", "| typeof RAYS | typeof MANTLE | typeof IGNORE", 1)
            ts = ts.replace("| typeof RAYS;", "| typeof RAYS | typeof MANTLE;", 1)
    ts = ts.replace(
        '  if (key === "lionfish") return RAYS;\n  return SILL;',
        '  if (key === "lionfish") return RAYS;\n  if (key === "giant_clam") return MANTLE;\n  return SILL;',
        1,
    )
    old_size = "    if (kind === RAYS) return w.width >= 187 && w.height >= 192;\n    return w.width >= 180 && w.height >= 70;"
    new_size = "    if (kind === RAYS) return w.width >= 187 && w.height >= 192;\n    if (kind === MANTLE) return w.width >= 201 && w.height >= 174;\n    return w.width >= 180 && w.height >= 70;"
    if old_size not in ts:
        raise SystemExit("TS size gate marker missing")
    ts = ts.replace(old_size, new_size, 1)
    marker = '      leave: "rayed",\n      spin: "none",\n    };\n  }\n  if (kind === WRAP) {'
    if marker not in ts:
        raise SystemExit("TS pickTarget marker missing")
    ts = ts.replace(marker, '      leave: "rayed",\n      spin: "none",\n    };\n  }\n' + MANTLE_PICK_TS + '  if (kind === WRAP) {', 1)
    ts = ts.replace(
        "  if (target.kind === RAYS) {\n    const hold = raysPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
        "  if (target.kind === RAYS) {\n    const hold = raysPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === MANTLE) {\n    const hold = mantlePoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
        1,
    )
    idx2 = ts.find("export function raysOffPath")
    if idx2 < 0:
        raise SystemExit("TS raysOffPath missing")
    idx = ts.find("export function beginPlay", idx2)
    if idx < 0:
        raise SystemExit("TS beginPlay missing")
    ts = ts[:idx] + MANTLE_FUNCS_TS + "\n" + ts[idx:]
    ts = ts.replace(
        '    if (target.kind === RAYS) {\n      return goPhase(next, "rays-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n    }\n    if (target.kind === WRAP) {',
        '    if (target.kind === RAYS) {\n      return goPhase(next, "rays-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n    }\n    if (target.kind === MANTLE) {\n      return goPhase(next, "mantle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n    }\n    if (target.kind === WRAP) {',
        1,
    )
    idx = ts.find('  if (next.phase === "rays-off")')
    if idx < 0:
        raise SystemExit("TS rays-off missing")
    idx2 = ts.find('  if (next.phase === "sill-hop") {', idx)
    if idx2 < 0:
        raise SystemExit("TS sill-hop missing")
    ts = ts[:idx2] + MANTLE_PHASE_TS + ts[idx2:]
    path.write_text(ts, encoding="utf-8")
    print("patched TS")

def patch_tests_cjs(path):
    t = path.read_text(encoding="utf-8")
    # move generic-sill pin giant_clam -> eagle_ray (first pickTarget occurrence)
    t = t.replace(
        'const target = P.pickTarget([WIN], 80, "giant_clam", WORK, P.SPRITE);',
        'const target = P.pickTarget([WIN], 80, "eagle_ray", WORK, P.SPRITE);',
        1,
    )
    # Veil leftover test sill pin
    if 'assert.equal(P.playFor("giant_clam"), "sill");' in t:
        t = t.replace('assert.equal(P.playFor("giant_clam"), "sill");', 'assert.equal(P.playFor("eagle_ray"), "sill");', 1)
    if 'test("Gate leftover mantles' in t:
        raise SystemExit("Gate test already in cjs")
    t = t.rstrip() + "\n" + GATE_TEST + "\n"
    path.write_text(t, encoding="utf-8")
    print("patched cjs tests")

def patch_tests_mjs(path):
    t = path.read_text(encoding="utf-8")
    if 'pickTarget([WIN], 80, "giant_clam"' in t:
        t = t.replace(
            'const target = P.pickTarget([WIN], 80, "giant_clam", WORK, P.SPRITE);',
            'const target = P.pickTarget([WIN], 80, "eagle_ray", WORK, P.SPRITE);',
            1,
        )
    if 'assert.equal(P.playFor("giant_clam"), "sill");' in t:
        t = t.replace('assert.equal(P.playFor("giant_clam"), "sill");', 'assert.equal(P.playFor("eagle_ray"), "sill");', 1)
    if 'test("Gate leftover mantles' in t:
        raise SystemExit("Gate test already in mjs")
    t = t.rstrip() + "\n" + GATE_TEST + "\n"
    path.write_text(t, encoding="utf-8")
    print("patched mjs tests")

def patch_house(path):
    t = path.read_text(encoding="utf-8")
    old_prefix = 'test("Veil leftover rays a window apron as a reef ledge; seventh leftover of remaining reef/sea after well ten closed;'
    if old_prefix not in t:
        raise SystemExit("house test title missing")
    t = t.replace(
        'test("Veil leftover rays a window apron as a reef ledge; seventh leftover of remaining reef/sea after well ten closed;',
        'test("Gate leftover mantles a window stool as a mantle dish; eighth leftover of remaining reef/sea after well ten closed; Veil leftover still rays a window apron as a reef ledge; seventh leftover of remaining reef/sea after well ten closed;',
        1,
    )
    t = t.replace("Next leftover is Gate", "Next leftover is Soar")
    t = t.replace("next leftover is Gate", "next leftover is Soar")
    t = t.replace("next leftover is Veil", "next leftover is Soar")
    block = '''  assert.equal(WP.playFor("giant_clam"), "mantle");
  assert.equal(WP.MANTLE, "mantle");
  assert.notEqual(WP.playFor("giant_clam"), "gate");
  assert.notEqual(WP.playFor("giant_clam"), "giant_clam");
  assert.notEqual(WP.playFor("giant_clam"), "open");
  assert.notEqual(WP.playFor("giant_clam"), "rise");
  assert.notEqual(WP.playFor("giant_clam"), "clamp");
  assert.notEqual(WP.playFor("giant_clam"), "lid");
  assert.notEqual(WP.playFor("giant_clam"), "rays");
  assert.notEqual(WP.playFor("giant_clam"), "papillae");
  assert.notEqual(WP.playFor("giant_clam"), "station");
  assert.notEqual(WP.playFor("giant_clam"), "rasps");
  assert.notEqual(WP.playFor("giant_clam"), "bars");
  assert.notEqual(WP.playFor("giant_clam"), "tentacles");
  assert.notEqual(WP.playFor("giant_clam"), "valleys");
  assert.notEqual(WP.playFor("giant_clam"), "blush");
  assert.notEqual(WP.playFor("giant_clam"), "reef");
  assert.notEqual(WP.playFor("giant_clam"), "many");
  assert.notEqual(WP.playFor("giant_clam"), "soar");
  assert.notEqual(WP.playFor("giant_clam"), "sill");
  assert.equal(WP.playFor("lionfish"), "rays");
  assert.equal(WP.RAYS, "rays");
  assert.equal(WP.playFor("sea_cucumber"), "papillae");
  assert.equal(WP.PAPILLAE, "papillae");
  assert.equal(WP.playFor("cleaner_shrimp"), "station");
  assert.equal(WP.playFor("parrotfish"), "rasps");
  assert.equal(WP.playFor("nexus"), "many");
  assert.equal(WP.playFor("eagle_ray"), "sill");
});'''
    old = '''  assert.equal(WP.playFor("giant_clam"), "sill");
});'''
    if old not in t:
        raise SystemExit("house giant_clam sill pin missing")
    t = t.replace(old, block, 1)
    path.write_text(t, encoding="utf-8")
    print("patched house test")

def patch_docs():
    arch = Path("docs/ARCHITECTURE.md")
    a = arch.read_text(encoding="utf-8")
    a = re.sub(
        r"(\| \*\*Last Updated\*\* \| )2026-09-02 \([^)]+\)",
        r"\g<1>2026-09-02 (Gate leftover mantles a window stool as a mantle dish; eighth leftover of remaining reef/sea after well ten closed; Veil leftover still rays a window apron as a reef ledge; catalog 220)",
        a,
        count=1,
    )
    arch.write_text(a, encoding="utf-8")

    road = Path("docs/ROADMAP.md")
    r = road.read_text(encoding="utf-8")
    veil_line = None
    for line in r.splitlines():
        if "Veil (`lionfish`" in line and "rays" in line:
            veil_line = line
            break
    if not veil_line:
        raise SystemExit("Veil roadmap line missing")
    gate_line = (
        "- [x] Gate (`giant_clam` / `gate`) mantles a real window stool as a mantle dish: walk onto the stool "
        "(window stool - she mantles, she does not gate/giant_clam/open/rise/clamp/lid/rays/papillae/station/rasps/bars/tentacles/valleys/blush/reef/many/soar; "
        "a giant clam; not Veil apron reef-ledge rays, not Tube sand-well papillae, not Scrub station-dish station, not Scrape rock-plate rasps, "
        "not Paint wreath-cup bars, not Wreath column-dish tentacles, not Ridge boulder-dish valleys, not Rose salt-pan blush, not Ochre damp-blotter reef, "
        "not Knot paperweight many, not Chamber rise, not Cone clamp, not Disk open, not Cup lid, not Hook soar; The mantle is the tell / Review the mantle). "
        "Catalog stays 220. Next leftover is Soar (`eagle_ray`). Do not start Soar."
    )
    if "Gate (`giant_clam`" not in r:
        r = r.replace(veil_line, veil_line + "\n" + gate_line, 1)
    r = r.replace(
        "Catalog stays 220. Next leftover is Gate (`giant_clam`). Do not start Gate.",
        "Catalog stays 220. Gate now mantles; next leftover is Soar (`eagle_ray`). Do not start Soar.",
        1,
    )
    r = re.sub(
        r"\*\*Last Updated:\*\* 2026-09-02 \([^)]+\)",
        "**Last Updated:** 2026-09-02 (Phase 6 leftover: Gate leftover mantles a window stool as a mantle dish; eighth leftover of remaining reef/sea after well ten closed; Veil leftover still rays; catalog 220)",
        r,
        count=1,
    )
    road.write_text(r, encoding="utf-8")

    for readme in [Path("README.md"), Path("desktop/README.md")]:
        txt = readme.read_text(encoding="utf-8")
        if "Gate mantles" in txt:
            continue
        needle = "Veil rays a window apron as a reef ledge."
        if needle in txt:
            txt = txt.replace(needle, "Gate mantles a window stool as a mantle dish. " + needle, 1)
        else:
            raise SystemExit("Veil README needle missing in %s" % readme)
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

