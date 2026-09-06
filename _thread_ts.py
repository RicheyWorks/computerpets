from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
p = ROOT / "web/src/lib/pets/window-play.ts"
text = p.read_text(encoding="utf-8")

def sub_once(old, new, label):
    global text
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, found {n}\nOLD: {old[:140]!r}")
    text = text.replace(old, new, 1)
    print("ok", label)

HEADER_OLD = (
    "Half splits a meeting-rail underside as a stream stone: walk onto the underside, sit the split (she halves), then leave. "
    "Tun still owns dry. Hop still owns spring. This is the eighth log leftover."
)
HEADER_NEW = (
    HEADER_OLD
    + " Thread thrashes a glazing rebate as a soil film: walk into the rebate, thrash the round, then leave. "
    + "Wick still owns thread. Half still owns split. Tun still owns dry. This is the ninth log leftover."
)
sub_once(HEADER_OLD, HEADER_NEW, "header")

sub_once(
'''export const SPLIT = "split";
export const SILL = "sill";''',
'''export const SPLIT = "split";
export const THRASH = "thrash";
export const SILL = "sill";''',
"const")

sub_once(
'''  splitOff: 1.59,
  sillHop: 0.38,''',
'''  splitOff: 1.59,
  thrashOn: 2.31,
  thrash: 1.21,
  thrashHold: 2.59,
  thrashOff: 1.63,
  sillHop: 0.38,''',
"DUR")

sub_once(
"typeof DRY | typeof SPLIT | typeof SILL",
"typeof DRY | typeof SPLIT | typeof THRASH | typeof SILL",
"kind union")

sub_once(
'''  | "split-off"
  | "sill-hop"''',
'''  | "split-off"
  | "thrash-on"
  | "thrash"
  | "thrash-hold"
  | "thrash-off"
  | "sill-hop"''',
"phases")

sub_once(
'| "wetwood" | "mossfilm";',
'| "wetwood" | "mossfilm" | "streamstone" | "soilfilm";',
"side")

sub_once(
'| "headglue" | "film";',
'| "headglue" | "film" | "round";',
"leave")

sub_once(
'''  if (key === "planarian") return SPLIT;
  return SILL;''',
'''  if (key === "planarian") return SPLIT;
  if (key === "nematode") return THRASH;
  return SILL;''',
"playFor")

sub_once(
'''  if (kind === SPLIT) return w.width >= 193 && w.height >= 200;
    return w.width >= 180 && w.height >= 70;''',
'''  if (kind === SPLIT) return w.width >= 193 && w.height >= 200;
  if (kind === THRASH) return w.width >= 192 && w.height >= 198;
    return w.width >= 180 && w.height >= 70;''',
"size")

sub_once(
'''      leave: "stone",
      spin: "none",
    };
  }
  if (kind === WRAP) {''',
'''      leave: "stone",
      spin: "none",
    };
  }
  if (kind === THRASH) {
    const hold = thrashPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -70 : 70;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 63 : -63;
    return {
      id: best.id,
      kind,
      side: "soilfilm",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "round",
      spin: "none",
    };
  }
  if (kind === WRAP) {''',
"pick")

sub_once(
'''  if (target.kind === SPLIT) {
    const hold = splitPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
'''  if (target.kind === SPLIT) {
    const hold = splitPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === THRASH) {
    const hold = thrashPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
"refit")

sub_once(
'''export function splitOffPath(u: number, from: PlayPoint, to: PlayPoint) {''',
'''export function thrashPoint(win: DeskWindow, sprite?: number, work?: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 38;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.78;
  const rebate = Math.max(148, win.height * 0.61);
  const gripY = win.y + rebate;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 36, maxLift) };
}

export function thrashFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function thrashOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const wriggle = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 4.6) * 1.7;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + wriggle,
    rot: (toX >= fromX ? 1 : -1) * 6.2 * (1 - ease) + wriggle * 0.55,
  };
}

export function thrashPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.22) {
    const s = t / 0.22;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.35, lift: ease * 0.45, rot: ease * 5.6 };
  }
  if (t < 0.84) {
    const s = (t - 0.22) / 0.62;
    const wave = Math.sin(s * Math.PI * 3.2);
    return { x: 0.35 + wave * 5.4, lift: 0.45 + Math.abs(wave) * 0.85, rot: 5.6 + wave * 16.8 };
  }
  return { x: 0.35, lift: 0.5, rot: 4.8 };
}

export function thrashHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const wait = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.18;
  return { x: 0.35, lift: 0.5 + wait, rot: 4.8 };
}

export function thrashOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease,
    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 4.8) * (1 - ease),
  };
}

export function splitOffPath(u: number, from: PlayPoint, to: PlayPoint) {''',
"funcs")

sub_once(
'''      if (target.kind === SPLIT) {
        return goPhase(next, "split-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
'''      if (target.kind === SPLIT) {
        return goPhase(next, "split-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === THRASH) {
        return goPhase(next, "thrash-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
"goPhase")

sub_once(
'''  if (next.phase === "split-off") {
    const u = next.t / DUR.splitOff;
    const pose = splitOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "sill-hop") {''',
'''  if (next.phase === "split-off") {
    const u = next.t / DUR.splitOff;
    const pose = splitOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "thrash-on") {
    const face = thrashFace(target);
    const u = next.t / DUR.thrashOn;
    const pose = thrashOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "thrash", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "thrash") {
    const face = thrashFace(target);
    const pose = thrashPath(Math.min(1, next.t / DUR.thrash));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.thrash) {
      return goPhase(next, "thrash-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "thrash-hold") {
    const face = thrashFace(target);
    const pose = thrashHoldPath(Math.min(1, next.t / DUR.thrashHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.thrashHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = thrashHoldPath(1);
      return goPhase(next, "thrash-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "thrash-off") {
    const u = next.t / DUR.thrashOff;
    const pose = thrashOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "sill-hop") {''',
"ticks")

p.write_text(text, encoding="utf-8")
print("patched TS")
