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

def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit("MISSING: " + label)
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

HEADER = (
    "Ghost weeks a lamp-side glass as lamp dusk: walk onto the glass, sit the week, then leave. "
    "Night still owns dusk. Moth still owns mount. Milk still owns weed. "
    "This is the third leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Spark the firefly glows a lower sash light as ink dusk: walk onto the light, sit the glow, then leave. "
    "The dragon Spark still crackles an edge. Wink still owns flash. Ghost still owns week. "
    "This is the fourth leftover of the remaining hive den."
)

ts, nl = load("web/src/lib/pets/window-play.ts")
ts = must_replace(ts, HEADER, HEADER_NEW, "ts header")
ts = must_replace(ts, 'export const WEEK = "week";\nexport const SILL = "sill";', 'export const WEEK = "week";\nexport const GLOW = "glow";\nexport const SILL = "sill";', "ts GLOW const")
ts = must_replace(ts, "  weekOff: 2.58,\n  sillHop: 0.38,", "  weekOff: 2.58,\n  glowOn: 3.48,\n  glow: 2.26,\n  glowHold: 3.91,\n  glowOff: 2.65,\n  sillHop: 0.38,", "ts DUR")
ts = must_replace(ts, '  if (key === "luna") return WEEK;\n  return SILL;', '  if (key === "luna") return WEEK;\n  if (key === "firefly") return GLOW;\n  return SILL;', "ts playFor")
ts = must_replace(ts, "    if (kind === WEEK) return w.width >= 200 && w.height >= 200;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === WEEK) return w.width >= 200 && w.height >= 200;\n    if (kind === GLOW) return w.width >= 189 && w.height >= 173;\n    return w.width >= 180 && w.height >= 70;", "ts size gate")
ts = must_replace(ts, "typeof WEEK | typeof SILL | typeof IGNORE", "typeof WEEK | typeof GLOW | typeof SILL | typeof IGNORE", "ts WindowPlayKind")
ts = must_replace(
    ts,
    '  | "week-off"\n  | "sill-hop"',
    '  | "week-off"\n  | "glow-on"\n  | "glow"\n  | "glow-hold"\n  | "glow-off"\n  | "sill-hop"',
    "ts PlayPhase",
)
ts = must_replace(ts, '"milkweedcup" | "lampdusk"', '"milkweedcup" | "lampdusk" | "inkdusk"', "ts side")
ts = must_replace(ts, '"weeded" | "weeked"', '"weeded" | "weeked" | "glowed"', "ts leave")
ts = must_replace(
    ts,
    '      leave: "weeked",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {',
    '      leave: "weeked",\n      spin: "none",\n    };\n  }\n\n  if (kind === GLOW) {\n    const hold = glowPoint(best, size, work);\n    const approachOff = hold.x < workW / 2 ? -55 : 55;\n    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n    const away = hold.x < workW / 2 ? 46 : -46;\n    return {\n      id: best.id,\n      kind,\n      side: "inkdusk",\n      holdX: hold.x,\n      holdLift: hold.lift,\n      approachX,\n      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n      leave: "glowed",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {',
    "ts pickTarget",
)
ts = must_replace(
    ts,
    "  if (target.kind === WEEK) {\n    const hold = weekPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
    "  if (target.kind === WEEK) {\n    const hold = weekPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === GLOW) {\n    const hold = glowPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
    "ts refit",
)
ts = must_replace(
    ts,
    '      if (target.kind === WEEK) {\n        return goPhase(next, "week-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    '      if (target.kind === WEEK) {\n        return goPhase(next, "week-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === GLOW) {\n        return goPhase(next, "glow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    "ts approach",
)

GLOW_FUNCS_TS = """
export function glowPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 34;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.49;
  const dusk = Math.max(92, win.height * 0.58);
  const gripY = win.y + dusk;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 28, maxLift) };
}

export function glowFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function glowOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.16) * 2.68;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 2.74 * (1 - ease) + stride * 0.11,
  };
}

export function glowPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.28) {
    const s = t / 0.28;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.7, lift: ease * 7.2, rot: ease * 2.6 };
  }
  if (t < 0.52) {
    const s = (t - 0.28) / 0.24;
    const ease = s * s * (3 - 2 * s);
    return { x: 0.7, lift: 7.2 - ease * 3.4, rot: 2.6 };
  }
  if (t < 0.80) {
    const s = (t - 0.52) / 0.28;
    const flash = Math.sin(s * Math.PI);
    return { x: 0.7 + flash * 0.4, lift: 3.8 + flash * 5.6, rot: 2.6 + flash * 1.2 };
  }
  return { x: 0.9, lift: 4.4, rot: 3.2 };
}

export function glowHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.34;
  return { x: 0.9, lift: 4.4 + hush, rot: 3.2 };
}

export function glowOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.72) * 2.28;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : 3.2) * (1 - ease),
  };
}


"""

ts = must_replace(ts, "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", GLOW_FUNCS_TS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", "ts glow funcs")

TICK_TS = '''
  if (next.phase === "glow-on") {
    const face = glowFace(target);
    const u = next.t / DUR.glowOn;
    const pose = glowOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "glow", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "glow") {
    const face = glowFace(target);
    const pose = glowPath(Math.min(1, next.t / DUR.glow));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.glow) {
      return goPhase(next, "glow-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "glow-hold") {
    const face = glowFace(target);
    const pose = glowHoldPath(Math.min(1, next.t / DUR.glowHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.glowHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = glowHoldPath(1);
      return goPhase(next, "glow-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "glow-off") {
    const u = next.t / DUR.glowOff;
    const pose = glowOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

'''

ts = must_replace(ts, '  if (next.phase === "sill-hop") {', TICK_TS + '  if (next.phase === "sill-hop") {', "ts tick")
save("web/src/lib/pets/window-play.ts", ts, nl)
print("ts ok")
