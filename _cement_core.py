from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

HEADER_ADD = (
    " Cement stays a sash stile as a stone rim: walk onto the stile, kick the cirri, then leave."
    " Cone still owns clamp. Pale still owns sand. Dam still gnaws."
    " This is the fourth shore leftover."
)

JS_FUNCS = r'''
  function cirriPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const workW = work && work.width ? work.width : 1400;
    const left = win.x + win.width / 2 < workW / 2;
    const stile = Math.max(16, Math.min(size * 0.14, win.width * 0.08));
    const x = left ? win.x + stile : win.x + win.width - size - stile;
    const stone = Math.max(82, win.height * 0.31);
    const gripY = win.y + stone;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 40, maxLift) };
  }

  function cirriFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function cirriOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.81) * 2.3;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 3.7 * (1 - ease) + stride * 0.19,
    };
  }

  function cirriPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.26) {
      const s = t / 0.26;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.3, lift: ease * -1.4, rot: ease * 5.2 };
    }
    if (t < 0.64) {
      const s = (t - 0.26) / 0.38;
      const kick = Math.sin(s * Math.PI);
      return { x: 0.3 + kick * 4.8, lift: -1.4 + kick * 5.6, rot: 5.2 + kick * 12.4 };
    }
    return { x: 0.4, lift: -1.6, rot: 6.1 };
  }

  function cirriHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const stay = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.18;
    return { x: 0.4, lift: -1.6 + stay, rot: 6.1 };
  }

  function cirriOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.63) * 2.4;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 6.1) * (1 - ease),
    };
  }
'''

TS_FUNCS = r'''
export function cirriPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const workW = work && work.width ? work.width : 1400;
  const left = win.x + win.width / 2 < workW / 2;
  const stile = Math.max(16, Math.min(size * 0.14, win.width * 0.08));
  const x = left ? win.x + stile : win.x + win.width - size - stile;
  const stone = Math.max(82, win.height * 0.31);
  const gripY = win.y + stone;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 40, maxLift) };
}

export function cirriFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function cirriOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.81) * 2.3;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 3.7 * (1 - ease) + stride * 0.19,
  };
}

export function cirriPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.26) {
    const s = t / 0.26;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.3, lift: ease * -1.4, rot: ease * 5.2 };
  }
  if (t < 0.64) {
    const s = (t - 0.26) / 0.38;
    const kick = Math.sin(s * Math.PI);
    return { x: 0.3 + kick * 4.8, lift: -1.4 + kick * 5.6, rot: 5.2 + kick * 12.4 };
  }
  return { x: 0.4, lift: -1.6, rot: 6.1 };
}

export function cirriHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const stay = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.18;
  return { x: 0.4, lift: -1.6 + stay, rot: 6.1 };
}

export function cirriOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.63) * 2.4;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 6.1) * (1 - ease),
  };
}
'''

JS_PICK = r'''    if (kind === CIRRI) {
      const hold = cirriPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -55 : 55;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 50 : -50;
      return {
        id: best.id,
        kind,
        side: "stonerim",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "stays",
        spin: "none",
      };
    }
'''

TS_PICK = r'''  if (kind === CIRRI) {
    const hold = cirriPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -55 : 55;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 50 : -50;
    return {
      id: best.id,
      kind,
      side: "stonerim",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "stays",
      spin: "none",
    };
  }
'''

JS_TICK = r'''
    if (next.phase === "cirri-on") {
      const face = cirriFace(target);
      const u = next.t / DUR.cirriOn;
      const pose = cirriOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "cirri", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "cirri") {
      const face = cirriFace(target);
      const pose = cirriPath(Math.min(1, next.t / DUR.cirri));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.cirri) {
        return goPhase(next, "cirri-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "cirri-hold") {
      const face = cirriFace(target);
      const pose = cirriHoldPath(Math.min(1, next.t / DUR.cirriHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.cirriHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = cirriHoldPath(1);
        return goPhase(next, "cirri-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "cirri-off") {
      const u = next.t / DUR.cirriOff;
      const pose = cirriOffPath(Math.min(1, u), next.from, next.to);
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
  if (next.phase === "cirri-on") {
    const face = cirriFace(target);
    const u = next.t / DUR.cirriOn;
    const pose = cirriOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "cirri", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "cirri") {
    const face = cirriFace(target);
    const pose = cirriPath(Math.min(1, next.t / DUR.cirri));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.cirri) {
      return goPhase(next, "cirri-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "cirri-hold") {
    const face = cirriFace(target);
    const pose = cirriHoldPath(Math.min(1, next.t / DUR.cirriHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.cirriHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = cirriHoldPath(1);
      return goPhase(next, "cirri-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "cirri-off") {
    const u = next.t / DUR.cirriOff;
    const pose = cirriOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }
'''

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

def patch_js():
    p = ROOT / "desktop" / "renderer" / "window-play.js"
    t = p.read_text(encoding="utf-8")
    t = sub_once(t, "This is the third shore leftover.", "This is the third shore leftover." + HEADER_ADD, "js header")
    t = sub_once(t, '  const CLAMP = "clamp";\n', '  const CLAMP = "clamp";\n  const CIRRI = "cirri";\n', "js CIRRI const")
    t = sub_once(
        t,
        "    clampOff: 1.79,\n",
        "    clampOff: 1.79,\n    cirriOn: 2.66,\n    cirri: 1.52,\n    cirriHold: 2.98,\n    cirriOff: 1.86,\n",
        "js DUR",
    )
    t = sub_once(
        t,
        '    if (key === "limpet") return CLAMP;\n    return SILL;',
        '    if (key === "limpet") return CLAMP;\n    if (key === "barnacle") return CIRRI;\n    return SILL;',
        "js playFor",
    )
    t = sub_once(
        t,
        "    if (kind === CLAMP) return w.width >= 184 && w.height >= 178;\n",
        "    if (kind === CLAMP) return w.width >= 184 && w.height >= 178;\n    if (kind === CIRRI) return w.width >= 191 && w.height >= 216;\n",
        "js size gate",
    )
    t = sub_once(
        t,
        '''        leave: "clamps",
        spin: "none",
      };
    }

        if (kind === WRAP) {''',
        '''        leave: "clamps",
        spin: "none",
      };
    }
''' + JS_PICK + '''
        if (kind === WRAP) {''',
        "js pickTarget",
    )
    t = sub_once(
        t,
        '''    if (target.kind === CLAMP) {
      const hold = clampPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
        '''    if (target.kind === CLAMP) {
      const hold = clampPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === CIRRI) {
      const hold = cirriPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
        "js refit",
    )
    t = sub_once(
        t,
        '''        if (target.kind === CLAMP) {
          return goPhase(next, "clamp-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
        '''        if (target.kind === CLAMP) {
          return goPhase(next, "clamp-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === CIRRI) {
          return goPhase(next, "cirri-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
        "js goPhase",
    )
    t = sub_once(
        t,
        "  function beginPlay(target, petX) {",
        JS_FUNCS + "\n  function beginPlay(target, petX) {",
        "js funcs",
    )
    t = sub_once(
        t,
        '''    if (next.phase === "sill-hop") {''',
        JS_TICK + '''
    if (next.phase === "sill-hop") {''',
        "js tick",
    )
    t = sub_once(t, "    CLAMP,\n    IGNORE,", "    CLAMP,\n    CIRRI,\n    IGNORE,", "js export CIRRI")
    t = sub_once(
        t,
        '''    clampOffPath,
    pickTarget,''',
        '''    clampOffPath,
    cirriPoint,
    cirriFace,
    cirriOnPath,
    cirriPath,
    cirriHoldPath,
    cirriOffPath,
    pickTarget,''',
        "js export funcs",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched js")

def patch_ts():
    p = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"
    t = p.read_text(encoding="utf-8")
    t = sub_once(t, "This is the third shore leftover.", "This is the third shore leftover." + HEADER_ADD, "ts header")
    t = sub_once(t, 'export const CLAMP = "clamp";\n', 'export const CLAMP = "clamp";\nexport const CIRRI = "cirri";\n', "ts CIRRI const")
    t = sub_once(
        t,
        "  clampOff: 1.79,\n",
        "  clampOff: 1.79,\n  cirriOn: 2.66,\n  cirri: 1.52,\n  cirriHold: 2.98,\n  cirriOff: 1.86,\n",
        "ts DUR",
    )
    t = sub_once(
        t,
        "typeof CLAMP | typeof SILL | typeof IGNORE;",
        "typeof CLAMP | typeof CIRRI | typeof SILL | typeof IGNORE;",
        "ts kind type",
    )
    t = sub_once(
        t,
        '  if (key === "limpet") return CLAMP;\n  return SILL;',
        '  if (key === "limpet") return CLAMP;\n  if (key === "barnacle") return CIRRI;\n  return SILL;',
        "ts playFor",
    )
    t = sub_once(
        t,
        "  if (kind === CLAMP) return w.width >= 184 && w.height >= 178;\n",
        "  if (kind === CLAMP) return w.width >= 184 && w.height >= 178;\n  if (kind === CIRRI) return w.width >= 191 && w.height >= 216;\n",
        "ts size gate",
    )
    t = sub_once(
        t,
        '''      leave: "clamps",
      spin: "none",
    };
  }
  if (kind === WRAP) {''',
        '''      leave: "clamps",
      spin: "none",
    };
  }
''' + TS_PICK + '''  if (kind === WRAP) {''',
        "ts pickTarget",
    )
    t = sub_once(
        t,
        '''  if (target.kind === CLAMP) {
    const hold = clampPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        '''  if (target.kind === CLAMP) {
    const hold = clampPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === CIRRI) {
    const hold = cirriPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        "ts refit",
    )
    t = sub_once(
        t,
        '''      if (target.kind === CLAMP) {
        return goPhase(next, "clamp-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
        '''      if (target.kind === CLAMP) {
        return goPhase(next, "clamp-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === CIRRI) {
        return goPhase(next, "cirri-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
        "ts goPhase",
    )
    t = sub_once(
        t,
        "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        TS_FUNCS + "\nexport function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        "ts funcs",
    )
    t = sub_once(
        t,
        '''  if (next.phase === "sill-hop") {''',
        TS_TICK + '''
  if (next.phase === "sill-hop") {''',
        "ts tick",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched ts")

if __name__ == "__main__":
    patch_js()
    patch_ts()
    print("core ok")