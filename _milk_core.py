# Milk leftover core — do not commit
from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def patch(path, reps, label):
    raw = path.read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    for old, new in reps:
        count = text.count(old)
        if count != 1:
            raise SystemExit("%s: expected 1 occurrence, got %d for %r" % (label, count, old[:180]))
        text = text.replace(old, new, 1)
    path.write_bytes(text.replace("\n", "\n").replace("\n", nl).encode("utf-8") if False else text.replace("\n", nl).encode("utf-8") if "\r\n" not in text else text.encode("utf-8"))
    # normalize: work on \n internally; write original nl
    print("patched", label)

def patch2(path, reps, label):
    raw = path.read_bytes()
    file_nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n")
    for old, new in reps:
        count = text.count(old)
        if count != 1:
            raise SystemExit("%s: expected 1 occurrence, got %d for %r" % (label, count, old[:200]))
        text = text.replace(old, new, 1)
    if not text.endswith("\n"):
        text += "\n"
    path.write_bytes(text.replace("\n", file_nl).encode("utf-8"))
    print("patched", label)

HEADER_OLD = (
    "This is the first leftover of the remaining hive den. Shore ten is closed. Others walk a sill."
)
HEADER_NEW = (
    "This is the first leftover of the remaining hive den. Shore ten is closed. "
    "Milk weeds a window-box as a milkweed cup: walk onto the box, sit the weed, then leave. "
    "Comb still owns waggle. Sip still owns sip. Fan still owns gold. "
    "This is the second leftover of the remaining hive den. Others walk a sill."
)

JS_FUNCS = r'''
  function weedPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 40;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.58;
    const cup = Math.max(18, size * 0.11);
    const gripY = win.y + win.height + cup;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 12, maxLift) };
  }

  function weedFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function weedOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.88) * 2.28;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 3.55 * (1 - ease) + stride * 0.17,
    };
  }

  function weedPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.24) {
      const s = t / 0.24;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.5, lift: ease * 1.6, rot: ease * 5.8 };
    }
    if (t < 0.70) {
      const s = (t - 0.24) / 0.46;
      const lift = Math.sin(s * Math.PI);
      return { x: 0.5 + lift * 0.8, lift: 1.6 + lift * 4.8, rot: 5.8 + lift * 3.4 };
    }
    return { x: 0.4, lift: 1.8, rot: 6.6 };
  }

  function weedHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.24;
    return { x: 0.4, lift: 1.8 + hush, rot: 6.6 };
  }

  function weedOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.66) * 2.04;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 6.6) * (1 - ease),
    };
  }


'''

TS_FUNCS = r'''
export function weedPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 40;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.58;
  const cup = Math.max(18, size * 0.11);
  const gripY = win.y + win.height + cup;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 12, maxLift) };
}

export function weedFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function weedOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.88) * 2.28;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 3.55 * (1 - ease) + stride * 0.17,
  };
}

export function weedPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.24) {
    const s = t / 0.24;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.5, lift: ease * 1.6, rot: ease * 5.8 };
  }
  if (t < 0.70) {
    const s = (t - 0.24) / 0.46;
    const lift = Math.sin(s * Math.PI);
    return { x: 0.5 + lift * 0.8, lift: 1.6 + lift * 4.8, rot: 5.8 + lift * 3.4 };
  }
  return { x: 0.4, lift: 1.8, rot: 6.6 };
}

export function weedHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.24;
  return { x: 0.4, lift: 1.8 + hush, rot: 6.6 };
}

export function weedOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.66) * 2.04;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 6.6) * (1 - ease),
  };
}

'''

JS_TICK = r'''
    if (next.phase === "weed-on") {
      const face = weedFace(target);
      const u = next.t / DUR.weedOn;
      const pose = weedOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "weed", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "weed") {
      const face = weedFace(target);
      const pose = weedPath(Math.min(1, next.t / DUR.weed));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.weed) {
        return goPhase(next, "weed-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "weed-hold") {
      const face = weedFace(target);
      const pose = weedHoldPath(Math.min(1, next.t / DUR.weedHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.weedHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = weedHoldPath(1);
        return goPhase(next, "weed-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "weed-off") {
      const u = next.t / DUR.weedOff;
      const pose = weedOffPath(Math.min(1, u), next.from, next.to);
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
  if (next.phase === "weed-on") {
    const face = weedFace(target);
    const u = next.t / DUR.weedOn;
    const pose = weedOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "weed", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "weed") {
    const face = weedFace(target);
    const pose = weedPath(Math.min(1, next.t / DUR.weed));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.weed) {
      return goPhase(next, "weed-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "weed-hold") {
    const face = weedFace(target);
    const pose = weedHoldPath(Math.min(1, next.t / DUR.weedHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.weedHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = weedHoldPath(1);
      return goPhase(next, "weed-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: next.to && next.to.x != null ? next.to.x : target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "weed-off") {
    const u = next.t / DUR.weedOff;
    const pose = weedOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

'''

# Fix TS_TICK weed-hold to match Comb (landX, not next.to)
TS_TICK = TS_TICK.replace(
    '{ x: next.to && next.to.x != null ? next.to.x : target.landX, lift: 0 }, "walk", leaveFace);',
    '{ x: target.landX, lift: 0 }, "walk", leaveFace);',
)

JS_PICK = r'''
    if (kind === WEED) {
      const hold = weedPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -66 : 66;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 60 : -60;
      return {
        id: best.id,
        kind,
        side: "milkweedcup",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "weeded",
        spin: "none",
      };
    }

'''

TS_PICK = r'''
  if (kind === WEED) {
    const hold = weedPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -66 : 66;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 60 : -60;
    return {
      id: best.id,
      kind,
      side: "milkweedcup",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "weeded",
      spin: "none",
    };
  }

'''

js = ROOT / "desktop" / "renderer" / "window-play.js"
ts = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"

patch2(js, [
    (HEADER_OLD, HEADER_NEW),
    ('  const WAGGLE = "waggle";\n  const SILL = "sill";',
     '  const WAGGLE = "waggle";\n  const WEED = "weed";\n  const SILL = "sill";'),
    ("    waggleOff: 2.35,\n    sillHop: 0.38,",
     "    waggleOff: 2.35,\n    weedOn: 3.22,\n    weed: 2.08,\n    weedHold: 3.62,\n    weedOff: 2.42,\n    sillHop: 0.38,"),
    ('    if (key === "honeybee") return WAGGLE;\n    return SILL;',
     '    if (key === "honeybee") return WAGGLE;\n    if (key === "monarch") return WEED;\n    return SILL;'),
    ("    if (kind === WAGGLE) return w.width >= 190 && w.height >= 184;\n    return w.width >= 180 && w.height >= 70;",
     "    if (kind === WAGGLE) return w.width >= 190 && w.height >= 184;\n    if (kind === WEED) return w.width >= 193 && w.height >= 169;\n    return w.width >= 180 && w.height >= 70;"),
    ('''    if (kind === WAGGLE) {
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
''',
     '''    if (kind === WAGGLE) {
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
''' + JS_PICK),
    ('''    if (target.kind === WAGGLE) {
      const hold = wagglePoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
     '''    if (target.kind === WAGGLE) {
      const hold = wagglePoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === WEED) {
      const hold = weedPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {'''),
    ('''        if (target.kind === WAGGLE) {
          return goPhase(next, "waggle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
     '''        if (target.kind === WAGGLE) {
          return goPhase(next, "waggle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WEED) {
          return goPhase(next, "weed-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {'''),
    ("  function beginPlay(target, petX) {", JS_FUNCS + "  function beginPlay(target, petX) {"),
    ('    if (next.phase === "sill-hop") {', JS_TICK + '    if (next.phase === "sill-hop") {'),
    ("    WAGGLE,\n    IGNORE,", "    WAGGLE,\n    WEED,\n    IGNORE,"),
    ("    waggleOffPath,\n    pickTarget,", "    waggleOffPath,\n    weedPoint,\n    weedFace,\n    weedOnPath,\n    weedPath,\n    weedHoldPath,\n    weedOffPath,\n    pickTarget,"),
], "window-play.js")

patch2(ts, [
    (HEADER_OLD, HEADER_NEW),
    ('export const WAGGLE = "waggle";\nexport const SILL = "sill";',
     'export const WAGGLE = "waggle";\nexport const WEED = "weed";\nexport const SILL = "sill";'),
    ("  waggleOff: 2.35,\n  sillHop: 0.38,",
     "  waggleOff: 2.35,\n  weedOn: 3.22,\n  weed: 2.08,\n  weedHold: 3.62,\n  weedOff: 2.42,\n  sillHop: 0.38,"),
    ("typeof CASTINGS | typeof WAGGLE | typeof SILL | typeof IGNORE;",
     "typeof CASTINGS | typeof WAGGLE | typeof WEED | typeof SILL | typeof IGNORE;"),
    ('  | "waggle-on"\n  | "waggle"\n  | "waggle-hold"\n  | "waggle-off"\n  | "sill-hop"',
     '  | "waggle-on"\n  | "waggle"\n  | "waggle-hold"\n  | "waggle-off"\n  | "weed-on"\n  | "weed"\n  | "weed-hold"\n  | "weed-off"\n  | "sill-hop"'),
    ('| "sandplate" | "tidepool" | "wrackdish";',
     '| "sandplate" | "tidepool" | "wrackdish" | "wetsand" | "waxdish" | "milkweedcup";'),
    ('| "flats" | "spined" | "knobbed";',
     '| "flats" | "spined" | "knobbed" | "heaped" | "waggled" | "weeded";'),
    ('  if (key === "honeybee") return WAGGLE;\n  return SILL;',
     '  if (key === "honeybee") return WAGGLE;\n  if (key === "monarch") return WEED;\n  return SILL;'),
    ("    if (kind === WAGGLE) return w.width >= 190 && w.height >= 184;\n    return w.width >= 180 && w.height >= 70;",
     "    if (kind === WAGGLE) return w.width >= 190 && w.height >= 184;\n    if (kind === WEED) return w.width >= 193 && w.height >= 169;\n    return w.width >= 180 && w.height >= 70;"),
    ('''  if (kind === WAGGLE) {
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
''',
     '''  if (kind === WAGGLE) {
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
''' + TS_PICK),
    ('''  if (target.kind === WAGGLE) {
    const hold = wagglePoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
     '''  if (target.kind === WAGGLE) {
    const hold = wagglePoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === WEED) {
    const hold = weedPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {'''),
    ('''      if (target.kind === WAGGLE) {
        return goPhase(next, "waggle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
     '''      if (target.kind === WAGGLE) {
        return goPhase(next, "waggle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WEED) {
        return goPhase(next, "weed-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {'''),
    ("export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
     TS_FUNCS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {"),
    ('  if (next.phase === "sill-hop") {', TS_TICK + '  if (next.phase === "sill-hop") {'),
], "window-play.ts")

print("core ok")
