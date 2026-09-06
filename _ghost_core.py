# Ghost leftover core — do not commit
from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

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
            raise SystemExit("%s: expected 1 occurrence, got %d for %r" % (label, count, old[:220]))
        text = text.replace(old, new, 1)
    if not text.endswith("\n"):
        text += "\n"
    path.write_bytes(text.replace("\n", file_nl).encode("utf-8"))
    print("patched", label)

HEADER_OLD = "This is the second leftover of the remaining hive den. Others walk a sill."
HEADER_NEW = (
    "This is the second leftover of the remaining hive den. "
    "Ghost weeks a lamp-side glass as lamp dusk: walk onto the glass, sit the week, then leave. "
    "Night still owns dusk. Moth still owns mount. Milk still owns weed. "
    "This is the third leftover of the remaining hive den. Others walk a sill."
)

JS_FUNCS = r'''
  function weekLampDir(win, work) {
    const workW = work && work.width ? work.width : 1280;
    return win.x + win.width / 2 < workW / 2 ? 1 : -1;
  }

  function weekPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const dir = weekLampDir(win, work);
    const right = dir === 1;
    const glassInset = Math.max(90, size * 0.52);
    const x = right ? win.x + win.width - size - glassInset : win.x + glassInset;
    const duskSit = Math.max(118, win.height * 0.46);
    const gripY = win.y + duskSit;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function weekFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function weekOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.94) * 2.42;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 3.18 * (1 - ease) + stride * 0.14,
    };
  }

  function weekPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.30) {
      const s = t / 0.30;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 1.4, lift: ease * 2.4, rot: ease * 3.1 };
    }
    if (t < 0.74) {
      const s = (t - 0.30) / 0.44;
      const drift = Math.sin(s * Math.PI);
      return { x: 1.4 + drift * 1.8, lift: 2.4 + drift * 3.1, rot: 3.1 + drift * 1.4 };
    }
    return { x: 1.3, lift: 2.5, rot: 4.2 };
  }

  function weekHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.26;
    return { x: 1.3, lift: 2.5 + hush, rot: 4.2 };
  }

  function weekOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.58) * 2.12;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 4.2) * (1 - ease),
    };
  }


'''

print("core header written")

TS_FUNCS = r'''
function weekLampDir(win: DeskWindow, work: WorkSpace) {
  const workW = work && work.width ? work.width : 1280;
  return win.x + win.width / 2 < workW / 2 ? 1 : -1;
}

export function weekPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const dir = weekLampDir(win, work);
  const right = dir === 1;
  const glassInset = Math.max(90, size * 0.52);
  const x = right ? win.x + win.width - size - glassInset : win.x + glassInset;
  const duskSit = Math.max(118, win.height * 0.46);
  const gripY = win.y + duskSit;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 36, maxLift) };
}

export function weekFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function weekOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.94) * 2.42;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 3.18 * (1 - ease) + stride * 0.14,
  };
}

export function weekPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.30) {
    const s = t / 0.30;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 1.4, lift: ease * 2.4, rot: ease * 3.1 };
  }
  if (t < 0.74) {
    const s = (t - 0.30) / 0.44;
    const drift = Math.sin(s * Math.PI);
    return { x: 1.4 + drift * 1.8, lift: 2.4 + drift * 3.1, rot: 3.1 + drift * 1.4 };
  }
  return { x: 1.3, lift: 2.5, rot: 4.2 };
}

export function weekHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.26;
  return { x: 1.3, lift: 2.5 + hush, rot: 4.2 };
}

export function weekOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.58) * 2.12;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : 4.2) * (1 - ease),
  };
}


'''

JS_TICK = r'''
    if (next.phase === "week-on") {
      const face = weekFace(target);
      const u = next.t / DUR.weekOn;
      const pose = weekOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "week", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "week") {
      const face = weekFace(target);
      const pose = weekPath(Math.min(1, next.t / DUR.week));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.week) {
        return goPhase(next, "week-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "week-hold") {
      const face = weekFace(target);
      const pose = weekHoldPath(Math.min(1, next.t / DUR.weekHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.weekHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = weekHoldPath(1);
        return goPhase(next, "week-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "week-off") {
      const u = next.t / DUR.weekOff;
      const pose = weekOffPath(Math.min(1, u), next.from, next.to);
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
  if (next.phase === "week-on") {
    const face = weekFace(target);
    const u = next.t / DUR.weekOn;
    const pose = weekOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "week", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "week") {
    const face = weekFace(target);
    const pose = weekPath(Math.min(1, next.t / DUR.week));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.week) {
      return goPhase(next, "week-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "week-hold") {
    const face = weekFace(target);
    const pose = weekHoldPath(Math.min(1, next.t / DUR.weekHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.weekHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = weekHoldPath(1);
      return goPhase(next, "week-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "week-off") {
    const u = next.t / DUR.weekOff;
    const pose = weekOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

'''

print("funcs loaded")

JS_PICK = r'''
    if (kind === WEEK) {
      const hold = weekPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -63 : 63;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 57 : -57;
      return {
        id: best.id,
        kind,
        side: "lampdusk",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "weeked",
        spin: "none",
      };
    }

'''

TS_PICK = r'''
  if (kind === WEEK) {
    const hold = weekPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -63 : 63;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 57 : -57;
    return {
      id: best.id,
      kind,
      side: "lampdusk",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "weeked",
      spin: "none",
    };
  }

'''

js = ROOT / "desktop" / "renderer" / "window-play.js"
ts = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"

patch2(js, [
    (HEADER_OLD, HEADER_NEW),
    ('  const WEED = "weed";\n  const SILL = "sill";',
     '  const WEED = "weed";\n  const WEEK = "week";\n  const SILL = "sill";'),
    ("    weedOff: 2.42,\n    sillHop: 0.38,",
     "    weedOff: 2.42,\n    weekOn: 3.41,\n    week: 2.19,\n    weekHold: 3.84,\n    weekOff: 2.58,\n    sillHop: 0.38,"),
    ('    if (key === "monarch") return WEED;\n    return SILL;',
     '    if (key === "monarch") return WEED;\n    if (key === "luna") return WEEK;\n    return SILL;'),
    ("    if (kind === WEED) return w.width >= 193 && w.height >= 169;\n    return w.width >= 180 && w.height >= 70;",
     "    if (kind === WEED) return w.width >= 193 && w.height >= 169;\n    if (kind === WEEK) return w.width >= 200 && w.height >= 200;\n    return w.width >= 180 && w.height >= 70;"),
    ('''    if (kind === WEED) {
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
''',
     '''    if (kind === WEED) {
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
''' + JS_PICK),
    ('''    if (target.kind === WEED) {
      const hold = weedPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
     '''    if (target.kind === WEED) {
      const hold = weedPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === WEEK) {
      const hold = weekPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {'''),
    ('''        if (target.kind === WEED) {
          return goPhase(next, "weed-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
     '''        if (target.kind === WEED) {
          return goPhase(next, "weed-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WEEK) {
          return goPhase(next, "week-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {'''),
    ("  function beginPlay(target, petX) {", JS_FUNCS + "  function beginPlay(target, petX) {"),
    ('    if (next.phase === "sill-hop") {', JS_TICK + '    if (next.phase === "sill-hop") {'),
    ("    WEED,\n    IGNORE,", "    WEED,\n    WEEK,\n    IGNORE,"),
    ("    weedOffPath,\n    pickTarget,", "    weedOffPath,\n    weekPoint,\n    weekFace,\n    weekOnPath,\n    weekPath,\n    weekHoldPath,\n    weekOffPath,\n    pickTarget,"),
], "window-play.js")

print("js ok")

patch2(ts, [
    (HEADER_OLD, HEADER_NEW),
    ('export const WEED = "weed";\nexport const SILL = "sill";',
     'export const WEED = "weed";\nexport const WEEK = "week";\nexport const SILL = "sill";'),
    ("  weedOff: 2.42,\n  sillHop: 0.38,",
     "  weedOff: 2.42,\n  weekOn: 3.41,\n  week: 2.19,\n  weekHold: 3.84,\n  weekOff: 2.58,\n  sillHop: 0.38,"),
    ("typeof CASTINGS | typeof WAGGLE | typeof WEED | typeof SILL | typeof IGNORE;",
     "typeof CASTINGS | typeof WAGGLE | typeof WEED | typeof WEEK | typeof SILL | typeof IGNORE;"),
    ('  | "weed-on"\n  | "weed"\n  | "weed-hold"\n  | "weed-off"\n  | "sill-hop"',
     '  | "weed-on"\n  | "weed"\n  | "weed-hold"\n  | "weed-off"\n  | "week-on"\n  | "week"\n  | "week-hold"\n  | "week-off"\n  | "sill-hop"'),
    ('| "wetsand" | "waxdish" | "milkweedcup";',
     '| "wetsand" | "waxdish" | "milkweedcup" | "lampdusk";'),
    ('| "heaped" | "waggled" | "weeded";',
     '| "heaped" | "waggled" | "weeded" | "weeked";'),
    ('  if (key === "monarch") return WEED;\n  return SILL;',
     '  if (key === "monarch") return WEED;\n  if (key === "luna") return WEEK;\n  return SILL;'),
    ("    if (kind === WEED) return w.width >= 193 && w.height >= 169;\n    return w.width >= 180 && w.height >= 70;",
     "    if (kind === WEED) return w.width >= 193 && w.height >= 169;\n    if (kind === WEEK) return w.width >= 200 && w.height >= 200;\n    return w.width >= 180 && w.height >= 70;"),
    ('''  if (kind === WEED) {
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
''',
     '''  if (kind === WEED) {
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
''' + TS_PICK),
    ('''  if (target.kind === WEED) {
    const hold = weedPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
     '''  if (target.kind === WEED) {
    const hold = weedPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === WEEK) {
    const hold = weekPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {'''),
    ('''      if (target.kind === WEED) {
        return goPhase(next, "weed-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
     '''      if (target.kind === WEED) {
        return goPhase(next, "weed-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WEEK) {
        return goPhase(next, "week-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {'''),
    ("export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
     TS_FUNCS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {"),
    ('  if (next.phase === "sill-hop") {', TS_TICK + '  if (next.phase === "sill-hop") {'),
], "window-play.ts")

print("core ok")
