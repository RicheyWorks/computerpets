/** Species-true window play. Rui clings and dives. Arc rides the title-bar ridge. Volt coils a window corner. Trace traces a window path. Flux fields the glass. Spark crackles an edge. Others walk a sill. Same map as desktop `window-play.js`. */
import type { DeskWindow } from "@/lib/pets/windows";

export const SPRITE = 176;
export const CLING = "cling-dive";
export const RIDGE = "ridge";
export const COIL = "coil";
export const PATH = "path";
export const FIELD = "field";
export const CRACKLE = "crackle";
export const SILL = "sill";
export const IGNORE = "ignore";
export const WALK_PX = 98;
export const DUR = {
  leap: 0.48,
  cling: 0.55,
  hang: 1.35,
  drop: 0.42,
  dive: 0.72,
  ridgeLeap: 0.5,
  ridgeHold: 1.4,
  ridgeOff: 0.58,
  coilOn: 0.68,
  coilHold: 1.45,
  coilOff: 0.72,
  pathOn: 0.52,
  pathWalk: 2.2,
  pathSit: 0.7,
  pathOff: 0.55,
  fieldOn: 0.76,
  fieldHold: 1.55,
  fieldOff: 0.82,
  crackleOn: 0.32,
  crackleHop: 0.26,
  crackleOff: 0.4,
  sillHop: 0.38,
  sillWalk: 1.55,
  sillDown: 0.36,
  land: 0.18,
};

export type WindowPlayKind = typeof CLING | typeof RIDGE | typeof COIL | typeof PATH | typeof FIELD | typeof CRACKLE | typeof SILL | typeof IGNORE;
export type PlayPhase =
  | "approach"
  | "leap"
  | "cling"
  | "hang"
  | "drop"
  | "dive"
  | "ridge-leap"
  | "ridge-hold"
  | "ridge-off"
  | "coil-on"
  | "coil-hold"
  | "coil-off"
  | "path-on"
  | "path-walk"
  | "path-sit"
  | "path-off"
  | "field-on"
  | "field-hold"
  | "field-off"
  | "crackle-on"
  | "crackle-hop"
  | "crackle-off"
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
  side: "left" | "right" | "top" | "glass";
  holdX: number;
  holdLift: number;
  approachX: number;
  landX: number;
  diveFrom?: "top" | "side";
  spin?: "backflip" | "spin" | "none";
  leave?: "hop" | "slide" | "drop" | "drift";
  sillEndX?: number;
  pathEndX?: number;
  pathEndLift?: number;
  crackleEndX?: number;
  crackleEndLift?: number;
  hopFrom?: number;
  hopTo?: number;
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
  hopIndex?: number;
};

export type PlayFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
  card?: boolean;
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
  if (key === "cyber_dragon") return RIDGE;
  if (key === "volt_dragon") return COIL;
  if (key === "trace_dragon") return PATH;
  if (key === "flux_dragon") return FIELD;
  if (key === "spark_dragon") return CRACKLE;
  return SILL;
}

export function canStart(state: PlayFlags | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving || state.card) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function shouldAbort(state: PlayFlags | undefined) {
  if (!state) return true;
  if (state.asleep || state.hidden || state.leaving || state.card) return true;
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

export function ridgePoint(win: DeskWindow, u: number, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 20;
  const x0 = win.x + pad;
  const x1 = win.x + win.width - size - pad;
  const span = Math.max(0, x1 - x0);
  const x = x0 + span * Math.max(0, Math.min(1, u));
  const lift = gripLift(win.y, work);
  return { x, lift: clamp(lift, 28, work.height - 48) };
}

export function coilPoint(win: DeskWindow, corner: "left" | "right", sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const wrap = size * 0.36;
  const x = corner === "left" ? win.x - wrap : win.x + win.width - size + wrap;
  const lift = gripLift(win.y, work);
  return { x, lift: clamp(lift, 28, work.height - 48), corner };
}

export function cracklePoint(win: DeskWindow, u: number, sprite: number | undefined, work: WorkSpace, side?: "left" | "right") {
  const size = sprite == null ? SPRITE : sprite;
  const wrap = size * 0.28;
  const edge = side === "right" ? "right" : "left";
  const x = edge === "right" ? win.x + win.width - size + wrap : win.x - wrap;
  const topLift = gripLift(win.y, work);
  const botY = win.y + win.height * 0.7;
  const maxLift = work.height - 48;
  const botLift = clamp(gripLift(botY, work), 28, maxLift);
  const t = Math.max(0, Math.min(1, u));
  return {
    x,
    lift: clamp(topLift + (botLift - topLift) * t, 28, maxLift),
    side: edge as "left" | "right",
  };
}

export function fieldPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const insetTop = Math.max(56, size * 0.32);
  const insetBot = Math.max(36, size * 0.18);
  const x = win.x + (win.width - size) / 2;
  const innerH = Math.max(0, win.height - insetTop - insetBot);
  const gripY = win.y + insetTop + innerH * 0.5;
  const lift = gripLift(gripY, work);
  return { x, lift: clamp(lift, 36, work.height - 48) };
}

export function pathPoint(win: DeskWindow, u: number, sprite: number | undefined, work: WorkSpace, side?: "left" | "right" | "top") {
  const size = sprite == null ? SPRITE : sprite;
  const t = Math.max(0, Math.min(1, u));
  const startSide: "left" | "right" = side === "right" ? "right" : "left";
  const farSide: "left" | "right" = startSide === "left" ? "right" : "left";
  const near = sideHold(win, startSide, size, work);
  const far = sideHold(win, farSide, size, work);
  const topLift = ridgePoint(win, 0.5, size, work).lift;
  const lowY = win.y + win.height * 0.72;
  const lowLift = clamp(gripLift(lowY, work), 28, work.height - 48);
  const a = { x: near.x, lift: lowLift };
  const b = { x: near.x, lift: topLift };
  const c = { x: far.x, lift: topLift };
  const d = { x: far.x, lift: lowLift };
  let from = a;
  let to = b;
  let s = t * 3;
  if (t >= 2 / 3) {
    from = c;
    to = d;
    s = (t - 2 / 3) * 3;
  } else if (t >= 1 / 3) {
    from = b;
    to = c;
    s = (t - 1 / 3) * 3;
  }
  return {
    x: from.x + (to.x - from.x) * s,
    lift: from.lift + (to.lift - from.lift) * s,
    side: startSide,
  };
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
    opts?: { rand?: number; side?: "left" | "right"; diveFrom?: "top" | "side"; spin?: "backflip" | "spin"; leave?: "hop" | "slide" | "drop" | "drift"; hopFrom?: 0 | 1 },
): PlayTarget | null {
  const kind = playFor(key);
  if (kind === IGNORE) return null;
  const size = sprite == null ? SPRITE : sprite;
  const workW = work.width;
  const list = Array.isArray(windows) ? windows : [];
  const usable = list.filter((w) => {
    if (!w) return false;
    if (kind === CLING) return w.height >= 160 && w.width >= 100;
    if (kind === RIDGE) return w.width >= 160 && w.height >= 80;
    if (kind === COIL) return w.width >= 140 && w.height >= 140;
    if (kind === PATH) return w.width >= 180 && w.height >= 160;
    if (kind === FIELD) return w.width >= 220 && w.height >= 200;
    if (kind === CRACKLE) return w.width >= 100 && w.height >= 180;
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
  if (kind === RIDGE) {
    const hold = ridgePoint(best, 0.5, size, work);
    const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
    const leave = opts?.leave ?? (roll < 0.5 ? "hop" : "slide");
    const away = hold.x < workW / 2 ? 88 : -88;
    return {
      id: best.id,
      kind,
      side: "top",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave,
      spin: "none",
    };
  }
  if (kind === COIL) {
    const corner = opts?.side || pickSide(best, petX, size, workW);
    const hold = coilPoint(best, corner, size, work);
    const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
    const away = corner === "left" ? -90 : 90;
    return {
      id: best.id,
      kind,
      side: corner,
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      spin: "none",
    };
  }
  if (kind === PATH) {
    const startSide = opts?.side || pickSide(best, petX, size, workW);
    const start = pathPoint(best, 0, size, work, startSide);
    const end = pathPoint(best, 1, size, work, startSide);
    const approachX = clamp(start.x, 8, Math.max(8, workW - size - 8));
    const leave = opts?.leave ?? (roll < 0.5 ? "hop" : "drop");
    const away = startSide === "left" ? 88 : -88;
    return {
      id: best.id,
      kind,
      side: startSide,
      holdX: start.x,
      holdLift: start.lift,
      approachX,
      landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
      pathEndX: end.x,
      pathEndLift: end.lift,
      leave,
      spin: "none",
    };
  }
  if (kind === FIELD) {
    const hold = fieldPoint(best, size, work);
    const approachX = clamp(hold.x, 8, Math.max(8, workW - size - 8));
    const leave = opts?.leave ?? (roll < 0.5 ? "drift" : "drop");
    const away = hold.x < workW / 2 ? 88 : -88;
    return {
      id: best.id,
      kind,
      side: "glass",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave,
      spin: "none",
    };
  }
  if (kind === CRACKLE) {
    const edge = opts?.side || pickSide(best, petX, size, workW);
    const startU = opts && (opts.hopFrom === 0 || opts.hopFrom === 1) ? opts.hopFrom : roll < 0.5 ? 0 : 1;
    const endU = startU === 0 ? 1 : 0;
    const start = cracklePoint(best, startU, size, work, edge);
    const end = cracklePoint(best, endU, size, work, edge);
    const approachX = clamp(start.x, 8, Math.max(8, workW - size - 8));
    const leave = opts?.leave === "hop" || opts?.leave === "drop" ? opts.leave : roll < 0.5 ? "hop" : "drop";
    const away = edge === "left" ? -88 : 88;
    return {
      id: best.id,
      kind,
      side: edge,
      holdX: start.x,
      holdLift: start.lift,
      approachX,
      landX: clamp(end.x + away, 8, Math.max(8, workW - size - 8)),
      crackleEndX: end.x,
      crackleEndLift: end.lift,
      hopFrom: startU,
      hopTo: endU,
      leave,
      spin: "none",
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
  if (target.kind === RIDGE) {
    const hold = ridgePoint(win, 0.5, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === COIL && (target.side === "left" || target.side === "right")) {
    const hold = coilPoint(win, target.side, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === PATH) {
    const startSide = target.side === "right" ? "right" : "left";
    const start = pathPoint(win, 0, sprite, work, startSide);
    const end = pathPoint(win, 1, sprite, work, startSide);
    return { ...target, holdX: start.x, holdLift: start.lift, pathEndX: end.x, pathEndLift: end.lift };
  }
  if (target.kind === FIELD) {
    const hold = fieldPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === CRACKLE) {
    const start = cracklePoint(win, target.hopFrom != null ? target.hopFrom : 0, sprite, work, target.side === "right" ? "right" : "left");
    const end = cracklePoint(win, target.hopTo != null ? target.hopTo : 1, sprite, work, target.side === "right" ? "right" : "left");
    return { ...target, holdX: start.x, holdLift: start.lift, crackleEndX: end.x, crackleEndLift: end.lift };
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

export function coilOnPath(u: number, from: PlayPoint, to: PlayPoint, side?: PlayPoint["side"]) {
  const t = Math.max(0, Math.min(1, u));
  const ease = smoothstep(t);
  const out = side === "left" ? -1 : 1;
  const fromX = from.x ?? 0;
  const toX = to.x ?? fromX;
  const fromLift = from.lift ?? 0;
  const toLift = to.lift ?? 0;
  return {
    x: fromX + (toX - fromX) * ease + out * 40 * Math.sin(t * Math.PI),
    lift: fromLift + (toLift - fromLift) * ease + Math.sin(t * Math.PI) * 26,
    rot: out * -58 * Math.sin(t * Math.PI),
  };
}

export function coilOffPath(u: number, from: PlayPoint, to: PlayPoint, side?: PlayPoint["side"]) {
  const t = Math.max(0, Math.min(1, u));
  const ease = smoothstep(t);
  const out = side === "left" ? -1 : 1;
  const fromX = from.x ?? 0;
  const toX = to.x ?? fromX;
  const fromLift = from.lift ?? 0;
  const toLift = to.lift ?? 0;
  return {
    x: fromX + (toX - fromX) * ease + out * 36 * Math.sin(t * Math.PI),
    lift: fromLift + (toLift - fromLift) * (t * t),
    rot: out * 48 * Math.sin(t * Math.PI),
  };
}

export function fieldOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const ease = smoothstep(t);
  const fromX = from.x ?? 0;
  const toX = to.x ?? fromX;
  const fromLift = from.lift ?? 0;
  const toLift = to.lift ?? 0;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + Math.sin(t * Math.PI) * 10,
    rot: 0,
  };
}

export function driftOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const ease = smoothstep(t);
  const fromX = from.x ?? 0;
  const toX = to.x ?? fromX;
  const fromLift = from.lift ?? 0;
  const toLift = to.lift ?? 0;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * (t * t * 0.55 + ease * 0.45),
    rot: 0,
  };
}

export function slideOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from.x ?? 0;
  const toX = to.x ?? fromX;
  const fromLift = from.lift ?? 0;
  const toLift = to.lift ?? 0;
  if (t < 0.38) {
    const s = t / 0.38;
    return {
      x: fromX + (toX - fromX) * 0.42 * smoothstep(s),
      lift: fromLift,
      rot: 0,
    };
  }
  const s = (t - 0.38) / 0.62;
  const midX = fromX + (toX - fromX) * 0.42;
  return {
    x: midX + (toX - midX) * smoothstep(s),
    lift: fromLift + (toLift - fromLift) * (s * s),
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
  if (shouldAbort(life) && play.phase !== "drop" && play.phase !== "dive" && play.phase !== "land" && play.phase !== "ridge-off" && play.phase !== "coil-off" && play.phase !== "path-off" && play.phase !== "field-off" && play.phase !== "crackle-off") {
    return abortToFloor(play, { x: play.x, lift: play.lift }, work);
  }
  let next: WindowPlay = { ...play, t: play.t + Math.max(0, dt) };
  const win = findWin(windows, next.target.id);
  if (win && next.phase !== "dive" && next.phase !== "drop" && next.phase !== "land" && next.phase !== "ridge-off" && next.phase !== "coil-off" && next.phase !== "path-off" && next.phase !== "field-off" && next.phase !== "crackle-off") {
    next = { ...next, target: refitTarget(next.target, win, size, work) };
  } else if (!win && next.phase !== "dive" && next.phase !== "drop" && next.phase !== "land" && next.phase !== "approach" && next.phase !== "ridge-off" && next.phase !== "coil-off" && next.phase !== "path-off" && next.phase !== "field-off" && next.phase !== "crackle-off") {
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
      if (target.kind === RIDGE) {
        return goPhase(next, "ridge-leap", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
      }
      if (target.kind === COIL) {
        return goPhase(next, "coil-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
      }
      if (target.kind === PATH) {
        return goPhase(next, "path-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
      }
      if (target.kind === FIELD) {
        return goPhase(next, "field-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
      }
      if (target.kind === CRACKLE) {
        return goPhase(next, "crackle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "play", dir);
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

  if (next.phase === "ridge-leap") {
    const u = next.t / DUR.ridgeLeap;
    const pose = leapPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "play";
    if (u >= 1) {
      const face: 1 | -1 = target.landX >= target.holdX ? 1 : -1;
      return goPhase(next, "ridge-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "ridge-hold") {
    next.x = target.holdX;
    next.lift = target.holdLift;
    next.rot = 0;
    next.anim = "sit";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (next.t >= DUR.ridgeHold) {
      const land = { x: target.landX, lift: 0 };
      return goPhase(next, "ridge-off", { x: target.holdX, lift: target.holdLift }, land, "play", next.facing);
    }
    return next;
  }

  if (next.phase === "ridge-off") {
    const u = next.t / DUR.ridgeOff;
    const pose = target.leave === "slide"
      ? slideOffPath(Math.min(1, u), next.from, next.to)
      : leapPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = target.leave === "slide" ? 0 : pose.rot;
    next.anim = "play";
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "coil-on") {
    const u = next.t / DUR.coilOn;
    const pose = coilOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift }, target.side);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "play";
    next.facing = target.side === "left" ? 1 : -1;
    if (u >= 1) {
      return goPhase(next, "coil-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", next.facing);
    }
    return next;
  }

  if (next.phase === "coil-hold") {
    next.x = target.holdX;
    next.lift = target.holdLift;
    next.rot = 0;
    next.anim = "sit";
    next.facing = target.side === "left" ? 1 : -1;
    if (next.t >= DUR.coilHold) {
      const land = { x: target.landX, lift: 0 };
      return goPhase(next, "coil-off", { x: target.holdX, lift: target.holdLift }, land, "play", next.facing);
    }
    return next;
  }

  if (next.phase === "coil-off") {
    const u = next.t / DUR.coilOff;
    const pose = coilOffPath(Math.min(1, u), next.from, next.to, target.side);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "play";
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "path-on") {
    const u = next.t / DUR.pathOn;
    const pose = leapPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "play";
    next.facing = target.side === "left" ? 1 : -1;
    if (u >= 1) {
      const face: 1 | -1 = target.side === "left" ? 1 : -1;
      return goPhase(next, "path-walk", { x: target.holdX, lift: target.holdLift }, { x: target.pathEndX ?? target.holdX, lift: target.pathEndLift ?? target.holdLift }, "walk", face);
    }
    return next;
  }

  if (next.phase === "path-walk") {
    if (!win) return abortToFloor(next, { x: next.x, lift: next.lift }, work);
    const u = Math.min(1, next.t / DUR.pathWalk);
    const startSide = target.side === "right" ? "right" : "left";
    const pose = pathPoint(win, u, size, work, startSide);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = 0;
    next.anim = "walk";
    if (u < 2 / 3) next.facing = target.side === "left" ? 1 : -1;
    else next.facing = target.side === "left" ? -1 : 1;
    if (u >= 1) {
      const endX = target.pathEndX ?? pose.x;
      const endLift = target.pathEndLift ?? pose.lift;
      return goPhase(next, "path-sit", { x: endX, lift: endLift }, { x: endX, lift: endLift }, "sit", next.facing);
    }
    return next;
  }

  if (next.phase === "path-sit") {
    const sitX = target.pathEndX ?? target.holdX;
    const sitLift = target.pathEndLift ?? target.holdLift;
    next.x = sitX;
    next.lift = sitLift;
    next.rot = 0;
    next.anim = "sit";
    next.facing = target.side === "left" ? -1 : 1;
    if (next.t >= DUR.pathSit) {
      const land = { x: target.landX, lift: 0 };
      return goPhase(next, "path-off", { x: sitX, lift: sitLift }, land, "play", next.facing);
    }
    return next;
  }

  if (next.phase === "path-off") {
    const u = next.t / DUR.pathOff;
    const pose = target.leave === "drop"
      ? dropPath(Math.min(1, u), next.from, next.to)
      : leapPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = target.leave === "drop" ? 0 : pose.rot;
    next.anim = "play";
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "field-on") {
    const u = next.t / DUR.fieldOn;
    const pose = fieldOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = 0;
    next.anim = "play";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) {
      return goPhase(next, "field-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", next.facing);
    }
    return next;
  }

  if (next.phase === "field-hold") {
    next.x = target.holdX;
    next.lift = target.holdLift;
    next.rot = 0;
    next.anim = "sit";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (next.t >= DUR.fieldHold) {
      const land = { x: target.landX, lift: 0 };
      return goPhase(next, "field-off", { x: target.holdX, lift: target.holdLift }, land, "play", next.facing);
    }
    return next;
  }

  if (next.phase === "field-off") {
    const u = next.t / DUR.fieldOff;
    const pose = target.leave === "drop"
      ? dropPath(Math.min(1, u), next.from, next.to)
      : driftOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = 0;
    next.anim = "play";
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "crackle-on") {
    const u = next.t / DUR.crackleOn;
    const pose = leapPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "play";
    next.facing = target.side === "left" ? 1 : -1;
    if (u >= 1) {
      return { ...goPhase(next, "crackle-hop", { x: target.holdX, lift: target.holdLift }, { x: target.crackleEndX ?? target.holdX, lift: target.crackleEndLift ?? target.holdLift }, "play", next.facing), hopIndex: 0 };
    }
    return next;
  }

  if (next.phase === "crackle-hop") {
    if (!win) return abortToFloor(next, { x: next.x, lift: next.lift }, work);
    const hops = 3;
    const idx = next.hopIndex || 0;
    const startU = target.hopFrom != null ? target.hopFrom : 0;
    const endU = target.hopTo != null ? target.hopTo : 1;
    const fromU = startU + (endU - startU) * (idx / hops);
    const toU = startU + (endU - startU) * ((idx + 1) / hops);
    const from = cracklePoint(win, fromU, size, work, target.side === "right" ? "right" : "left");
    const to = cracklePoint(win, toU, size, work, target.side === "right" ? "right" : "left");
    const u = next.t / DUR.crackleHop;
    const pose = leapPath(Math.min(1, u), from, to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * 0.35;
    next.anim = idx % 2 === 0 ? "play" : "idle";
    next.facing = target.side === "left" ? 1 : -1;
    if (u >= 1) {
      if (idx + 1 >= hops) {
        const endX = target.crackleEndX != null ? target.crackleEndX : to.x;
        const endLift = target.crackleEndLift != null ? target.crackleEndLift : to.lift;
        return goPhase(next, "crackle-off", { x: endX, lift: endLift }, { x: target.landX, lift: 0 }, "play", next.facing);
      }
      return { ...goPhase(next, "crackle-hop", to, to, idx % 2 === 0 ? "idle" : "play", next.facing), hopIndex: idx + 1 };
    }
    return next;
  }

  if (next.phase === "crackle-off") {
    const u = next.t / DUR.crackleOff;
    const pose = target.leave === "drop"
      ? dropPath(Math.min(1, u), next.from, next.to)
      : leapPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = target.leave === "drop" ? 0 : pose.rot;
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
