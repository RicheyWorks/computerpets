# Comb leftover core patcher — do not commit
from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

HEADER_OLD = "This is the tenth shore leftover and closes shore ten. Others walk a sill"
HEADER_NEW = (
    "This is the tenth shore leftover and closes shore ten. "
    "Comb waggles a sill pan as a wax dish: walk onto the pan, dance the waggle, then leave. "
    "Hum still owns drone. Keep still owns lay. Wax still owns draw. Heap still owns castings. "
    "This is the first leftover of the remaining hive den. Shore ten is closed. Others walk a sill"
)

JS_FUNCS = r'''
  function wagglePoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 48;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.58;
    const pan = Math.max(68, size * 0.38);
    const gripY = win.y + win.height - pan;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift) };
  }

  function waggleFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function waggleOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.14) * 2.62;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 4.35 * (1 - ease) + stride * 0.19,
    };
  }

  function wagglePath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.20) {
      const s = t / 0.20;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.9, lift: ease * 3.1, rot: ease * 14.6 };
    }
    if (t < 0.84) {
      const s = (t - 0.20) / 0.64;
      const wag = Math.sin(s * Math.PI * 2.8);
      const loop = Math.sin(s * Math.PI * 1.4);
      return { x: 0.9 + wag * 4.2, lift: 3.1 + Math.abs(loop) * 2.2, rot: 14.6 + wag * 5.8 };
    }
    return { x: 0.7, lift: 3.3, rot: 15.2 };
  }

  function waggleHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.22;
    return { x: 0.7, lift: 3.3 + hush, rot: 15.2 };
  }

  function waggleOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.71) * 2.08;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 15.2) * (1 - ease),
    };
  }


'''

TS_FUNCS = r'''
export function wagglePoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 48;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.58;
  const pan = Math.max(68, size * 0.38);
  const gripY = win.y + win.height - pan;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 28, maxLift) };
}

export function waggleFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function waggleOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.14) * 2.62;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 4.35 * (1 - ease) + stride * 0.19,
  };
}

export function wagglePath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.20) {
    const s = t / 0.20;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.9, lift: ease * 3.1, rot: ease * 14.6 };
  }
  if (t < 0.84) {
    const s = (t - 0.20) / 0.64;
    const wag = Math.sin(s * Math.PI * 2.8);
    const loop = Math.sin(s * Math.PI * 1.4);
    return { x: 0.9 + wag * 4.2, lift: 3.1 + Math.abs(loop) * 2.2, rot: 14.6 + wag * 5.8 };
  }
  return { x: 0.7, lift: 3.3, rot: 15.2 };
}

export function waggleHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.22;
  return { x: 0.7, lift: 3.3 + hush, rot: 15.2 };
}

export function waggleOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.71) * 2.08;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 15.2) * (1 - ease),
  };
}


'''

JS_TICK = r'''
    if (next.phase === "waggle-on") {
      const face = waggleFace(target);
      const u = next.t / DUR.waggleOn;
      const pose = waggleOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "waggle", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "waggle") {
      const face = waggleFace(target);
      const pose = wagglePath(Math.min(1, next.t / DUR.waggle));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.waggle) {
        return goPhase(next, "waggle-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "waggle-hold") {
      const face = waggleFace(target);
      const pose = waggleHoldPath(Math.min(1, next.t / DUR.waggleHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.waggleHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = waggleHoldPath(1);
        return goPhase(next, "waggle-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "waggle-off") {
      const u = next.t / DUR.waggleOff;
      const pose = waggleOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }


'''

TS_TICK = r'''
  if (next.phase === "waggle-on") {
    const face = waggleFace(target);
    const u = next.t / DUR.waggleOn;
    const pose = waggleOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "waggle", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "waggle") {
    const face = waggleFace(target);
    const pose = wagglePath(Math.min(1, next.t / DUR.waggle));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.waggle) {
      return goPhase(next, "waggle-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "waggle-hold") {
    const face = waggleFace(target);
    const pose = waggleHoldPath(Math.min(1, next.t / DUR.waggleHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.waggleHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = waggleHoldPath(1);
      return goPhase(next, "waggle-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "waggle-off") {
    const u = next.t / DUR.waggleOff;
    const pose = waggleOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }


'''

JS_PICK = r'''
    if (kind === WAGGLE) {
      const hold = wagglePoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -70 : 70;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 64 : -64;
      return {
        id: best.id,
        kind,
        side: "waxdish",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "waggled",
        spin: "none",
      };
    }

'''

TS_PICK = r'''
  if (kind === WAGGLE) {
    const hold = wagglePoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -70 : 70;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 64 : -64;
    return {
      id: best.id,
      kind,
      side: "waxdish",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "waggled",
      spin: "none",
    };
  }

'''

def patch(path: Path, reps, label):
    raw = path.read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    for old, new in reps:
        count = text.count(old)
        if count != 1:
            raise SystemExit(f"{label}: expected 1 occurrence of marker, got {count}: {old[:80]!r}")
        text = text.replace(old, new, 1)
    out = text.replace("\n", nl)
    path.write_bytes(out.encode("utf-8"))
    print(f"patched {label}")

js = ROOT / "desktop" / "renderer" / "window-play.js"
ts = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"

patch(js, [
    (HEADER_OLD, HEADER_NEW),
    ('  const CASTINGS = "castings";\n  const SILL = "sill";',
     '  const CASTINGS = "castings";\n  const WAGGLE = "waggle";\n  const SILL = "sill";'),
    ("    castingsOff: 2.28,\n    sillHop: 0.38,",
     "    castingsOff: 2.28,\n    waggleOn: 3.15,\n    waggle: 2.01,\n    waggleHold: 3.54,\n    waggleOff: 2.35,\n    sillHop: 0.38,"),
    ('    if (key === "lugworm") return CASTINGS;\n    return SILL;',
     '    if (key === "lugworm") return CASTINGS;\n    if (key === "honeybee") return WAGGLE;\n    return SILL;'),
    ("    if (kind === CASTINGS) return w.width >= 160 && w.height >= 70;\n    return w.width >= 180 && w.height >= 70;",
     "    if (kind === CASTINGS) return w.width >= 160 && w.height >= 70;\n    if (kind === WAGGLE) return w.width >= 190 && w.height >= 184;\n    return w.width >= 180 && w.height >= 70;"),
    ('''    if (kind === CASTINGS) {
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
''',
     '''    if (kind === CASTINGS) {
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
''' + JS_PICK),
    ('''    if (target.kind === CASTINGS) {
      const hold = castingsPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
     '''    if (target.kind === CASTINGS) {
      const hold = castingsPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === WAGGLE) {
      const hold = wagglePoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {'''),
    ("        if (target.kind === CASTINGS) {\n          return goPhase(next, \"castings-on\", { x: dest, lift: 0 }, { x: \n",
     "        if (target.kind === CASTINGS) {\n          return goPhase(next, \"castings-on\", { x: dest, lift: 0 }, { x: \n"),  # placeholder, handled below
], "js-partial")
print("js first pass markers ok so far")
