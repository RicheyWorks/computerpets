/** Species-true window play. Rui clings and dives. Others walk a sill. Same map as desktop `window-play.js`. */
import type { DeskWindow } from "@/lib/pets/windows";

export const SPRITE = 176;
export const CLING = "cling-dive";
export const SILL = "sill";
export const IGNORE = "ignore";
export const WALK_PX = 98;
export const DUR = {
  leap: 0.48,
  cling: 0.55,
  hang: 1.35,
  drop: 0.42,
  dive: 0.72,
  sillHop: 0.38,
  sillWalk: 1.55,
  sillDown: 0.36,
  land: 0.18,
};

export type WindowPlayKind = typeof CLING | typeof SILL | typeof IGNORE;
export type PlayPhase =
  | "approach"
  | "leap"
  | "cling"
  | "hang"
  | "drop"
  | "dive"
  | "sill-hop"
  | "sill-walk"
  | "sill-down"
  | "land"
  | "done";
export type PlayAnim = "idle" | "walk" | "sit" | "play";
export type PlayPoint = { x: number; lift: number; side?: "left" | "right" | "top" };
export type WorkSpace = { width: number; height: number; floorLift?: number };

export type PlayTarget = {
  id: string;
  kind: WindowPlayKind;
  side: "left" | "right" | "top";
  holdX: number;
  holdLift: number;
  approachX: number;
  landX: number;
  diveFrom?: "top" | "side";
  spin?: "backflip" | "spin" | "none";
  sillEndX?: number;
};

export type WindowPlay = {
  phase: PlayPhase;
  t: number;
  target: PlayTarget;
  x: number;
  lift: number;
  rot: number;
  anim: PlayAnim;
  facing: 1 | -1;
  from: PlayPoint;
  to: PlayPoint;
  abort?: boolean;
};

export type PlayFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function playFor(key: string | undefined): WindowPlayKind {
  if (key === "red_panda") return CLING;
  return SILL;
}

export function canStart(state: PlayFlags | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function shouldAbort(state: PlayFlags | undefined) {
  if (!state) return true;
  if (state.asleep || state.hidden || state.leaving) return true;
  const cmd = String(state.cmd || "");
  return (
    cmd === "sleep" ||
    cmd === "leave" ||
    cmd === "hide" ||
    cmd === "rest" ||
    cmd === "seek" ||
    cmd === "eat" ||
    cmd === "play" ||
    cmd === "talk" ||
    cmd === "enter"
  );
}

export function nextPlayWait(justFinished: boolean, rand?: number) {
  const roll = rand == null ? Math.random() : rand;
  return justFinished ? 18 + roll * 10 : 7 + roll * 8;
}

function gripLift(gripY: number, work: WorkSpace) {
  const floor = work.floorLift || 0;
  return work.height - floor - gripY;
}

export function sideHold(win: DeskWindow, side: "left" | "right", sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const x = side === "left" ? win.x - size * 0.38 : win.x + win.width - size * 0.62;
  const gripY = win.y + Math.max(40, win.height * 0.38);
  const lift = gripLift(gripY, work);
  return { x, lift: clamp(lift, 36, work.height - 48), side };
}

export function sillPoint(win: DeskWindow, u: number, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 16;
  const x0 = win.x + pad;
  const x1 = win.x + win.width - size - pad;
  const span = Math.max(0, x1 - x0);
  const x = x0 + span * Math.max(0, Math.min(1, u));
  const lift = gripLift(win.y + 8, work);
  return { x, lift: clamp(lift, 20, work.height - 48) };
}

function pickSide(win: DeskWindow, petX: number, sprite: number, workW: number): "left" | "right" {
  const petMid = petX + sprite / 2;
  const leftRoom = win.x > 20;
  const rightRoom = win.x + win.width < workW - 20;
  if (leftRoom && rightRoom) {
    return Math.abs(petMid - win.x) <= Math.abs(petMid - (win.x + win.width)) ? "left" : "right";
  }
  if (rightRoom && !leftRoom) return "right";
  if (leftRoom && !rightRoom) return "left";
  return petMid < workW / 2 ? "left" : "right";
}

export function pickTarget(
  windows: DeskWindow[] | undefined,
  petX: number,
  key: string,
  work: WorkSpace,
  sprite?: number,
  opts?: { rand?: number; side?: "left" | "right"; diveFrom?: "top" | "side"; spin?: "backflip" | "spin" },
): PlayTarget | null {
  const kind = playFor(key);
  if (kind === IGNORE) return null;
  const size = sprite == null ? SPRITE : sprite;
  const workW = work.width;
  const list = Array.isArray(windows) ? windows : [];
  const usable = list.filter((w) => {
    if (!w) return false;
    if (kind === CLING) return w.height >= 160 && w.width >= 100;
    return w.width >= 180 && w.height >= 70;
  });
  if (!usable.length) return null;
  let best = usable[0]!;
  let bestDist = Infinity;
  for (const w of usable) {
    const mid = w.x + w.width / 2;
    const d = Math.abs(mid - (petX + size / 2));
    if (d < bestDist) {
      best = w;
      bestDist = d;
    }
  }
  const roll = opts?.rand ?? Math.random();
  if (kind === CLING) {
    const side = opts?.side || pickSide(best, petX, size, workW);
    const hold = sideHold(best, side, size, work);
    const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
    const away = side === "left" ? -86 : 86;
    return {
      id: best.id,
      kind,
      side,
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      diveFrom: opts?.diveFrom ?? (roll < 0.42 ? "top" : "side"),
      spin: opts?.spin ?? (roll < 0.5 ? "backflip" : "spin"),
    };
  }
  const start = sillPoint(best, 0.12, size, work);
  const end = sillPoint(best, 0.88, size, work);
  return {
    id: best.id,
    kind,
    side: "top",
    holdX: start.x,
    holdLift: start.lift,
    approachX: clamp(start.x, 8, Math.max(8, workW - size - 8)),
    landX: clamp(end.x, 8, Math.max(8, workW - size - 8)),
    sillEndX: end.x,
    spin: "none",
  };
}

export function refitTarget(target: PlayTarget, win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  if (target.kind === CLING && (target.side === "left" || target.side === "right")) {
    const hold = sideHold(win, target.side, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  const start = sillPoint(win, 0.12, sprite, work);
  const end = sillPoint(win, 0.88, sprite, work);
  return { ...target, holdX: start.x, holdLift: start.lift, sillEndX: end.x };
}

export function divePath(u: number, from: PlayPoint, to: PlayPoint, spin?: PlayTarget["spin"]) {
  const t = Math.max(0, Math.min(1, u));
  const ease = smoothstep(t);
  const out = from.side === "left" ? -1 : 1;
  const fromX = from.x ?? 0;
  const toX = to.x ?? fromX;
  const fromLift = from.lift ?? 0;
  const toLift = to.lift ?? 0;
  const arc = 34 + Math.abs(fromLift - toLift) * 0.1;
  const turns = spin === "backflip" ? -360 : spin === "none" ? 0 : 360;
  return {
    x: fromX + (toX - fromX) * ease + out * 64 * Math.sin(t * Math.PI),
    lift: fromLift * (1 - ease) + toLift * ease + Math.sin(t * Math.PI) * arc,
    rot: turns * t,
  };
}

export function leapPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const ease = smoothstep(t);
  const fromX = from.x ?? 0;
  const toX = to.x ?? fromX;
  const fromLift = from.lift ?? 0;
  const toLift = to.lift ?? 0;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + Math.sin(t * Math.PI) * 22,
    rot: (toX >= fromX ? 1 : -1) * 16 * Math.sin(t * Math.PI),
  };
}

export function dropPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const ease = t * t;
  const fromX = from.x ?? 0;
  const toX = to.x ?? fromX;
  const fromLift = from.lift ?? 0;
  const toLift = to.lift ?? 0;
  return {
    x: fromX + (toX - fromX) * smoothstep(t),
    lift: fromLift + (toLift - fromLift) * ease,
    rot: 0,
  };
}

export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {
  if (!target) return null;
  const x = petX == null ? target.approachX : petX;
  return {
    phase: "approach",
    t: 0,
    target,
    x,
    lift: 0,
    rot: 0,
    anim: "walk",
    facing: target.approachX >= x ? 1 : -1,
    from: { x, lift: 0 },
    to: { x: target.approachX, lift: 0 },
  };
}

function goPhase(play: WindowPlay, phase: PlayPhase, from: PlayPoint, to: PlayPoint, anim: PlayAnim, facing: 1 | -1): WindowPlay {
  return {
    ...play,
    phase,
    t: 0,
    from,
    to,
    anim,
    facing,
    x: from.x,
    lift: from.lift,
    rot: 0,
  };
}

export function abortToFloor(play: WindowPlay, pet: PlayPoint, _work?: WorkSpace): WindowPlay {
  const x = pet.x;
  const lift = pet.lift || 0;
  if (lift < 10) {
    return { ...play, phase: "done", t: 0, x, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  return goPhase({ ...play, abort: true }, "drop", { x, lift }, { x, lift: 0 }, "play", play.facing);
}

function findWin(windows: DeskWindow[] | undefined, id: string | undefined) {
  if (!id || !Array.isArray(windows)) return null;
  return windows.find((w) => w && w.id === id) || null;
}

export function stepPlay(
  play: WindowPlay,
  dt: number,
  _pet: PlayPoint,
  windows: DeskWindow[] | undefined,
  work: WorkSpace,
  sprite?: number,
  flags?: PlayFlags,
): WindowPlay {
  if (!play || play.phase === "done") return play;
  const size = sprite == null ? SPRITE : sprite;
  const life = flags || {};
  if (shouldAbort(life) && play.phase !== "drop" && play.phase !== "dive" && play.phase !== "land") {
    return abortToFloor(play, { x: play.x, lift: play.lift }, work);
  }
  let next: WindowPlay = { ...play, t: play.t + Math.max(0, dt) };
  const win = findWin(windows, next.target.id);
  if (win && next.phase !== "dive" && next.phase !== "drop" && next.phase !== "land") {
    next = { ...next, target: refitTarget(next.target, win, size, work) };
  } else if (!win && next.phase !== "dive" && next.phase !== "drop" && next.phase !== "land" && next.phase !== "approach") {
    return abortToFloor(next, { x: next.x, lift: next.lift }, work);
  }

  const target = next.target;
  if (next.phase === "approach") {
    const dest = target.approachX;
    const dir: 1 | -1 = dest >= next.x ? 1 : -1;
    next.facing = dir;
    next.anim = "walk";
    next.x += dir * WALK_PX * dt;
    next.lift = 0;
    next.rot = 0;
    if ((dir === 1 && next.x >= dest) || (dir === -1 && next.x <= dest)) {
      next.x = dest;
      if (target.kind === CLING) {
        return goPhase(next, "leap", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
      }
      return goPhase(next, "sill-hop", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
    }
    return next;
  }

  if (next.phase === "leap") {
    const u = next.t / DUR.leap;
    const pose = leapPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "play";
    next.facing = target.side === "left" ? 1 : -1;
    if (u >= 1) return goPhase(next, "cling", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", next.facing);
    return next;
  }

  if (next.phase === "cling") {
    next.x = target.holdX;
    next.lift = target.holdLift;
    next.rot = 0;
    next.anim = "sit";
    next.facing = target.side === "left" ? 1 : -1;
    if (next.t >= DUR.cling) {
      return goPhase(next, "hang", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", next.facing);
    }
    return next;
  }

  if (next.phase === "hang") {
    next.x = target.holdX;
    next.lift = target.holdLift;
    next.rot = 0;
    next.anim = "play";
    if (next.t >= DUR.hang) {
      const leave = target.diveFrom === "top"
        ? { x: target.holdX, lift: target.holdLift + 18 }
        : { x: target.holdX, lift: target.holdLift };
      const land = { x: target.landX, lift: 0, side: target.side };
      if (target.kind === CLING) {
        return goPhase(next, "dive", leave, land, "play", next.facing);
      }
      return goPhase(next, "drop", leave, land, "play", next.facing);
    }
    return next;
  }

  if (next.phase === "dive") {
    const u = next.t / DUR.dive;
    const pose = divePath(Math.min(1, u), { ...next.from, side: target.side }, next.to, target.spin);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "play";
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "drop") {
    const u = next.t / DUR.drop;
    const pose = dropPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = 0;
    next.anim = "play";
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "sill-hop") {
    const u = next.t / DUR.sillHop;
    const pose = leapPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "play";
    if (u >= 1) {
      const end = target.sillEndX ?? target.landX;
      return goPhase(next, "sill-walk", { x: target.holdX, lift: target.holdLift }, { x: end, lift: target.holdLift }, "walk", end >= target.holdX ? 1 : -1);
    }
    return next;
  }

  if (next.phase === "sill-walk") {
    const dest = target.sillEndX ?? target.landX;
    const dir: 1 | -1 = dest >= next.x ? 1 : -1;
    next.facing = dir;
    next.anim = "walk";
    next.x += dir * (WALK_PX * 0.72) * dt;
    next.lift = target.holdLift;
    next.rot = 0;
    if ((dir === 1 && next.x >= dest) || (dir === -1 && next.x <= dest) || next.t >= DUR.sillWalk) {
      next.x = dest;
      return goPhase(next, "sill-down", { x: dest, lift: target.holdLift }, { x: dest, lift: 0 }, "play", dir);
    }
    return next;
  }

  if (next.phase === "sill-down") {
    const u = next.t / DUR.sillDown;
    const pose = dropPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = 0;
    next.anim = "play";
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "land") {
    next.x = next.to.x;
    next.lift = 0;
    next.rot = 0;
    next.anim = "idle";
    if (next.t >= DUR.land) return { ...next, phase: "done" };
    return next;
  }

  return next;
}
