from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

HEADER_ADD = (
    " Cone clamps a glass rim as a rock rim: walk onto the rim, clamp the cone, then leave."
    " Pale still owns sand. Wave still owns signal. Lid still owns shut. Whorl still rasps."
    " This is the third shore leftover."
)

JS_FUNCS = r'''
  function clampPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 28;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.16;
    const rim = Math.max(58, size * 0.34);
    const gripY = win.y + rim;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function clampFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function clampOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.68) * 2.1;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 4.4 * (1 - ease) - stride * 0.22,
    };
  }

  function clampPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.28) {
      const s = t / 0.28;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.8, lift: ease * -4.6, rot: ease * -8.4 };
    }
    if (t < 0.62) {
      const s = (t - 0.28) / 0.34;
      const press = Math.sin(s * Math.PI);
      return { x: 0.8, lift: -4.6 - press * 3.2, rot: -8.4 - press * 4.8 };
    }
    return { x: 0.6, lift: -6.8, rot: -11.2 };
  }

  function clampHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const wait = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.22;
    return { x: 0.6, lift: -6.8 + wait, rot: -11.2 };
  }

  function clampOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.56) * 2.2;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -11.2) * (1 - ease),
    };
  }
'''

TS_FUNCS = r'''
export function clampPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 28;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.16;
  const rim = Math.max(58, size * 0.34);
  const gripY = win.y + rim;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 36, maxLift) };
}

export function clampFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function clampOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.68) * 2.1;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 4.4 * (1 - ease) - stride * 0.22,
  };
}

export function clampPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.28) {
    const s = t / 0.28;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.8, lift: ease * -4.6, rot: ease * -8.4 };
  }
  if (t < 0.62) {
    const s = (t - 0.28) / 0.34;
    const press = Math.sin(s * Math.PI);
    return { x: 0.8, lift: -4.6 - press * 3.2, rot: -8.4 - press * 4.8 };
  }
  return { x: 0.6, lift: -6.8, rot: -11.2 };
}

export function clampHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const wait = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.22;
  return { x: 0.6, lift: -6.8 + wait, rot: -11.2 };
}

export function clampOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.56) * 2.2;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : -11.2) * (1 - ease),
  };
}
'''

JS_PICK = r'''    if (kind === CLAMP) {
      const hold = clampPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -52 : 52;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 46 : -46;
      return {
        id: best.id,
        kind,
        side: "rockrim",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "clamps",
        spin: "none",
      };
    }
'''

TS_PICK = r'''  if (kind === CLAMP) {
    const hold = clampPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -52 : 52;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 46 : -46;
    return {
      id: best.id,
      kind,
      side: "rockrim",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "clamps",
      spin: "none",
    };
  }
'''

JS_TICK = r'''
    if (next.phase === "clamp-on") {
      const face = clampFace(target);
      const u = next.t / DUR.clampOn;
      const pose = clampOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "clamp", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "clamp") {
      const face = clampFace(target);
      const pose = clampPath(Math.min(1, next.t / DUR.clamp));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.clamp) {
        return goPhase(next, "clamp-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "clamp-hold") {
      const face = clampFace(target);
      const pose = clampHoldPath(Math.min(1, next.t / DUR.clampHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.clampHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = clampHoldPath(1);
        return goPhase(next, "clamp-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "clamp-off") {
      const u = next.t / DUR.clampOff;
      const pose = clampOffPath(Math.min(1, u), next.from, next.to);
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
  if (next.phase === "clamp-on") {
    const face = clampFace(target);
    const u = next.t / DUR.clampOn;
    const pose = clampOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "clamp", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "clamp") {
    const face = clampFace(target);
    const pose = clampPath(Math.min(1, next.t / DUR.clamp));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.clamp) {
      return goPhase(next, "clamp-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "clamp-hold") {
    const face = clampFace(target);
    const pose = clampHoldPath(Math.min(1, next.t / DUR.clampHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.clampHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = clampHoldPath(1);
      return goPhase(next, "clamp-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "clamp-off") {
    const u = next.t / DUR.clampOff;
    const pose = clampOffPath(Math.min(1, u), next.from, next.to);
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
    t = sub_once(t, "This is the second shore leftover.", "This is the second shore leftover." + HEADER_ADD, "js header")
    t = sub_once(t, '  const SAND = "sand";\n', '  const SAND = "sand";\n  const CLAMP = "clamp";\n', "js CLAMP const")
    t = sub_once(
        t,
        "    sandOff: 1.75,\n",
        "    sandOff: 1.75,\n    clampOn: 2.59,\n    clamp: 1.45,\n    clampHold: 2.91,\n    clampOff: 1.79,\n",
        "js DUR",
    )
    t = sub_once(
        t,
        '    if (key === "ghost_crab") return SAND;\n    return SILL;',
        '    if (key === "ghost_crab") return SAND;\n    if (key === "limpet") return CLAMP;\n    return SILL;',
        "js playFor",
    )
    t = sub_once(
        t,
        "    if (kind === SAND) return w.width >= 192 && w.height >= 158;\n",
        "    if (kind === SAND) return w.width >= 192 && w.height >= 158;\n    if (kind === CLAMP) return w.width >= 184 && w.height >= 178;\n",
        "js size gate",
    )
    t = sub_once(
        t,
        '''        leave: "sands",
        spin: "none",
      };
    }

        if (kind === WRAP) {''',
        '''        leave: "sands",
        spin: "none",
      };
    }
''' + JS_PICK + '''
        if (kind === WRAP) {''',
        "js pickTarget",
    )
    t = sub_once(
        t,
        '''    if (target.kind === SAND) {
      const hold = sandPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
        '''    if (target.kind === SAND) {
      const hold = sandPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === CLAMP) {
      const hold = clampPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
        "js refit",
    )
    t = sub_once(
        t,
        '''        if (target.kind === SAND) {
          return goPhase(next, "sand-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
        '''        if (target.kind === SAND) {
          return goPhase(next, "sand-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === CLAMP) {
          return goPhase(next, "clamp-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
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
    t = sub_once(t, "    SAND,\n    IGNORE,", "    SAND,\n    CLAMP,\n    IGNORE,", "js export CLAMP")
    t = sub_once(
        t,
        '''    sandOffPath,
    pickTarget,''',
        '''    sandOffPath,
    clampPoint,
    clampFace,
    clampOnPath,
    clampPath,
    clampHoldPath,
    clampOffPath,
    pickTarget,''',
        "js export funcs",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched js")

def patch_ts():
    p = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"
    t = p.read_text(encoding="utf-8")
    t = sub_once(t, "This is the second shore leftover.", "This is the second shore leftover." + HEADER_ADD, "ts header")
    t = sub_once(t, 'export const SAND = "sand";\n', 'export const SAND = "sand";\nexport const CLAMP = "clamp";\n', "ts CLAMP const")
    t = sub_once(
        t,
        "  sandOff: 1.75,\n",
        "  sandOff: 1.75,\n  clampOn: 2.59,\n  clamp: 1.45,\n  clampHold: 2.91,\n  clampOff: 1.79,\n",
        "ts DUR",
    )
    t = sub_once(
        t,
        "typeof SAND | typeof SILL | typeof IGNORE;",
        "typeof SAND | typeof CLAMP | typeof SILL | typeof IGNORE;",
        "ts kind type",
    )
    t = sub_once(
        t,
        '  if (key === "ghost_crab") return SAND;\n  return SILL;',
        '  if (key === "ghost_crab") return SAND;\n  if (key === "limpet") return CLAMP;\n  return SILL;',
        "ts playFor",
    )
    t = sub_once(
        t,
        "  if (kind === SAND) return w.width >= 192 && w.height >= 158;\n",
        "  if (kind === SAND) return w.width >= 192 && w.height >= 158;\n  if (kind === CLAMP) return w.width >= 184 && w.height >= 178;\n",
        "ts size gate",
    )
    t = sub_once(
        t,
        '''      leave: "sands",
      spin: "none",
    };
  }
  if (kind === WRAP) {''',
        '''      leave: "sands",
      spin: "none",
    };
  }
''' + TS_PICK + '''  if (kind === WRAP) {''',
        "ts pickTarget",
    )
    t = sub_once(
        t,
        '''  if (target.kind === SAND) {
    const hold = sandPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        '''  if (target.kind === SAND) {
    const hold = sandPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === CLAMP) {
    const hold = clampPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        "ts refit",
    )
    t = sub_once(
        t,
        '''      if (target.kind === SAND) {
        return goPhase(next, "sand-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
        '''      if (target.kind === SAND) {
        return goPhase(next, "sand-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === CLAMP) {
        return goPhase(next, "clamp-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
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
