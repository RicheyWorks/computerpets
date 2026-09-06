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
    "Dart hawks a lamp-side air as prey air: walk into the air, sit the hawk, then leave. "
    "Hook still owns soar. Haste still owns hunt. Spark the firefly still owns glow. "
    "This is the fifth leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Twig freezes a sash muntin as a pencil stem: walk onto the muntin, sit the freeze, then leave. "
    "Still still owns creep. Hang still owns reach. Stem still owns stilt. Anchor still owns hitch. "
    "This is the sixth leftover of the remaining hive den."
)

ts, nl = load("web/src/lib/pets/window-play.ts")
ts = must_replace(ts, HEADER, HEADER_NEW, "ts header")
ts = must_replace(ts, 'export const HAWK = "hawk";\nexport const SILL = "sill";', 'export const HAWK = "hawk";\nexport const FREEZE = "freeze";\nexport const SILL = "sill";', "ts FREEZE const")
ts = must_replace(ts, "  hawkOff: 2.41,\n  sillHop: 0.38,", "  hawkOff: 2.41,\n  freezeOn: 3.56,\n  freeze: 4.18,\n  freezeHold: 3.92,\n  freezeOff: 2.74,\n  sillHop: 0.38,", "ts DUR")
ts = must_replace(ts, '  if (key === "darner") return HAWK;\n  return SILL;', '  if (key === "darner") return HAWK;\n  if (key === "stick") return FREEZE;\n  return SILL;', "ts playFor")
ts = must_replace(ts, "    if (kind === HAWK) return w.width >= 200 && w.height >= 210;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === HAWK) return w.width >= 200 && w.height >= 210;\n    if (kind === FREEZE) return w.width >= 196 && w.height >= 188;\n    return w.width >= 180 && w.height >= 70;", "ts size gate")
ts = must_replace(ts, "typeof HAWK | typeof SILL | typeof IGNORE", "typeof HAWK | typeof FREEZE | typeof SILL | typeof IGNORE", "ts WindowPlayKind")
ts = must_replace(
    ts,
    '  | "hawk-off"\n  | "sill-hop"',
    '  | "hawk-off"\n  | "freeze-on"\n  | "freeze"\n  | "freeze-hold"\n  | "freeze-off"\n  | "sill-hop"',
    "ts PlayPhase",
)
ts = must_replace(ts, '"inkdusk" | "preyair"', '"inkdusk" | "preyair" | "pencilstem"', "ts side")
ts = must_replace(ts, '"glowed" | "hawked"', '"glowed" | "hawked" | "froze"', "ts leave")
ts = must_replace(
    ts,
    '      leave: "hawked",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {',
    '      leave: "hawked",\n      spin: "none",\n    };\n  }\n\n  if (kind === FREEZE) {\n    const hold = freezePoint(best, size, work);\n    const approachOff = hold.x < workW / 2 ? -52 : 52;\n    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n    const away = hold.x < workW / 2 ? 44 : -44;\n    return {\n      id: best.id,\n      kind,\n      side: "pencilstem",\n      holdX: hold.x,\n      holdLift: hold.lift,\n      approachX,\n      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n      leave: "froze",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {',
    "ts pickTarget",
)
ts = must_replace(
    ts,
    "  if (target.kind === HAWK) {\n    const hold = hawkPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
    "  if (target.kind === HAWK) {\n    const hold = hawkPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === FREEZE) {\n    const hold = freezePoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
    "ts refit",
)
ts = must_replace(
    ts,
    '      if (target.kind === HAWK) {\n        return goPhase(next, "hawk-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    '      if (target.kind === HAWK) {\n        return goPhase(next, "hawk-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === FREEZE) {\n        return goPhase(next, "freeze-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    "ts approach",
)

FREEZE_FUNCS_TS = """
export function freezePoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const span = Math.max(0, win.width - size);
  const x = win.x + span * 0.68;
  const muntin = Math.max(52, win.height * 0.28);
  const gripY = win.y + muntin + win.height * 0.22;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 36, maxLift) };
}

export function freezeFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function freezeOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.72) * 1.86;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 2.42 * (1 - ease) + stride * 0.08,
  };
}

export function freezePath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.30) {
    const s = t / 0.30;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.9, lift: ease * 3.4, rot: ease * -16.8 };
  }
  if (t < 0.58) {
    const s = (t - 0.30) / 0.28;
    const ease = s * s * (3 - 2 * s);
    return { x: 0.9 - ease * 0.5, lift: 3.4 - ease * 0.6, rot: -16.8 + ease * -7.2 };
  }
  return { x: 0.4, lift: 2.8, rot: -24 };
}

export function freezeHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.08;
  return { x: 0.4, lift: 2.8 + hush, rot: -24 };
}

export function freezeOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.64) * 2.12;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : -24) * (1 - ease),
  };
}


"""

ts = must_replace(ts, "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", FREEZE_FUNCS_TS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", "ts freeze funcs")

TICK_TS = '''
  if (next.phase === "freeze-on") {
    const face = freezeFace(target);
    const u = next.t / DUR.freezeOn;
    const pose = freezeOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "freeze", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "freeze") {
    const face = freezeFace(target);
    const pose = freezePath(Math.min(1, next.t / DUR.freeze));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.freeze) {
      return goPhase(next, "freeze-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "freeze-hold") {
    const face = freezeFace(target);
    const pose = freezeHoldPath(Math.min(1, next.t / DUR.freezeHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.freezeHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = freezeHoldPath(1);
      return goPhase(next, "freeze-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "freeze-off") {
    const u = next.t / DUR.freezeOff;
    const pose = freezeOffPath(Math.min(1, u), next.from, next.to);
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
