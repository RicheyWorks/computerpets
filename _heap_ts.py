from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, found {n}\nMARKER={old[:240]!r}")
    return text.replace(old, new, 1)

HEADER_ADD = (
    "Heap castings a window foot as wet sand: walk onto the foot, sit the castings, then leave. "
    "Cast still owns band. Latch still owns drink. Knurl still owns knobs. "
    "This is the tenth shore leftover and closes shore ten. "
)

CASTINGS_FUNCS_TS = r'''
export function castingsPoint(win: DeskWindow, sprite: number | undefined, _work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 22;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.62;
  return { x, lift: 0 };
}

export function castingsFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function castingsOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.77) * 1.85;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: 0,
    rot: (toX >= fromX ? 1 : -1) * 3.55 * (1 - ease) + stride * 0.21,
  };
}

export function castingsPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.32) {
    const s = t / 0.32;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.28, lift: ease * -2.2, rot: ease * 3.8 };
  }
  if (t < 0.78) {
    const s = (t - 0.32) / 0.46;
    const pulse = Math.sin(s * Math.PI);
    return { x: 0.28 + pulse * 0.55, lift: -2.2 - pulse * 1.6, rot: 3.8 + pulse * 2.4 };
  }
  return { x: 0.38, lift: -2.8, rot: 5.4 };
}

export function castingsHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.17;
  return { x: 0.38, lift: -2.8 + hush, rot: 5.4 };
}

export function castingsOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.63) * 1.72;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 5.4) * (1 - ease),
  };
}


'''

TICK_TS = r'''
  if (next.phase === "castings-on") {
    const face = castingsFace(target);
    const u = next.t / DUR.castingsOn;
    const pose = castingsOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "castings", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "castings") {
    const face = castingsFace(target);
    const pose = castingsPath(Math.min(1, next.t / DUR.castings));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.castings) {
      return goPhase(next, "castings-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "castings-hold") {
    const face = castingsFace(target);
    const pose = castingsHoldPath(Math.min(1, next.t / DUR.castingsHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.castingsHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = castingsHoldPath(1);
      return goPhase(next, "castings-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "castings-off") {
    const u = next.t / DUR.castingsOff;
    const pose = castingsOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }


'''

PICK_TS = '''  if (kind === CASTINGS) {
    const hold = castingsPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -66 : 66;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 60 : -60;
    return {
      id: best.id,
      kind,
      side: "wetsand",
      holdX: hold.x,
      holdLift: 0,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "heaped",
      spin: "none",
    };
  }

'''

p = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"
t = p.read_text(encoding="utf-8")
t = once(t,
    "This is the ninth shore leftover. Others walk a sill. Same map as desktop `window-play.js`. */",
    "This is the ninth shore leftover. " + HEADER_ADD + "Others walk a sill. Same map as desktop `window-play.js`. */",
    "ts header")
t = once(t,
    'export const KNOBS = "knobs";\nexport const SILL = "sill";',
    'export const KNOBS = "knobs";\nexport const CASTINGS = "castings";\nexport const SILL = "sill";',
    "ts const")
t = once(t,
    "  knobsOff: 2.21,\n  sillHop: 0.38,",
    "  knobsOff: 2.21,\n  castingsOn: 3.08,\n  castings: 1.94,\n  castingsHold: 3.46,\n  castingsOff: 2.28,\n  sillHop: 0.38,",
    "ts dur")
t = once(t,
    "typeof SPINES | typeof KNOBS | typeof SILL | typeof IGNORE;",
    "typeof SPINES | typeof KNOBS | typeof CASTINGS | typeof SILL | typeof IGNORE;",
    "ts kind union")
t = once(t,
    '  | "knobs-on"\n  | "knobs"\n  | "knobs-hold"\n  | "knobs-off"\n  | "sill-hop"',
    '  | "knobs-on"\n  | "knobs"\n  | "knobs-hold"\n  | "knobs-off"\n  | "castings-on"\n  | "castings"\n  | "castings-hold"\n  | "castings-off"\n  | "sill-hop"',
    "ts phase union")
t = once(t,
    '  if (key === "knobbed_whelk") return KNOBS;\n  return SILL;',
    '  if (key === "knobbed_whelk") return KNOBS;\n  if (key === "lugworm") return CASTINGS;\n  return SILL;',
    "ts playFor")
t = once(t,
    "  if (kind === KNOBS) return w.width >= 193 && w.height >= 160;\n    return w.width >= 180 && w.height >= 70;",
    "  if (kind === KNOBS) return w.width >= 193 && w.height >= 160;\n  if (kind === CASTINGS) return w.width >= 160 && w.height >= 70;\n    return w.width >= 180 && w.height >= 70;",
    "ts size")
t = once(t,
    '      leave: "knobbed",\n      spin: "none",\n    };\n  }\n\n  if (kind === WRAP) {',
    '      leave: "knobbed",\n      spin: "none",\n    };\n  }\n\n' + PICK_TS + '  if (kind === WRAP) {',
    "ts pick")
t = once(t,
    "  if (target.kind === KNOBS) {\n    const hold = knobsPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
    "  if (target.kind === KNOBS) {\n    const hold = knobsPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === CASTINGS) {\n    const hold = castingsPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
    "ts refit")
t = once(t,
    '      if (target.kind === KNOBS) {\n        return goPhase(next, "knobs-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    '      if (target.kind === KNOBS) {\n        return goPhase(next, "knobs-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === CASTINGS) {\n        return goPhase(next, "castings-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    "ts begin")
t = once(t,
    "    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 11.2) * (1 - ease),\n  };\n}\n\n\nexport function beginPlay(",
    "    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 11.2) * (1 - ease),\n  };\n}\n\n" + CASTINGS_FUNCS_TS + "export function beginPlay(",
    "ts funcs")
t = once(t,
    '    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n    return next;\n  }\n\n\n  if (next.phase === "sill-hop") {',
    '    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n    return next;\n  }\n\n' + TICK_TS + '  if (next.phase === "sill-hop") {',
    "ts tick")
p.write_text(t, encoding="utf-8", newline="\n")
print("patched window-play.ts", p.stat().st_size)
