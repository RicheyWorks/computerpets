from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:180]!r}")
    return text.replace(old, new, 1)

HEADER_OLD = "This is the leftover after Cap. This is the third leftover of the fungi den. Others walk a sill. */"
HEADER_NEW = (
    "This is the leftover after Cap. This is the third leftover of the fungi den. "
    "Horn forks a sash drip as a moss rim: walk onto the drip, sit the fork, then leave. "
    "Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Latch still drinks the drip as blotter. "
    "This is the leftover after Lattice. This is the fourth leftover of the fungi den. Others walk a sill. */"
)

JS_FORK_FNS = r'''
  function forkPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 34;
    const span = Math.max(0, win.width - size - pad * 2);
    // sash drip as moss rim — walk onto the drip, sit the fork; not Latch drink blotter, not Lattice sash-well hollow, not Cap apron warts, not Frill stile shelf, not Eft sash-horn moss saucer, not Cone/Jewel/Whorl glass rim
    const x = win.x + pad + span * 0.28;
    const drip = Math.max(64, win.height * 0.15);
    const gripY = win.y + win.height - drip;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift) };
  }

  function forkFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function forkOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.28) * 0.68;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.48 * (1 - ease) + stride * 0.06,
    };
  }

  function forkPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.22) {
      const s = t / 0.22;
      const ease = s * s * (3 - 2 * s);
      // sit the moss rim — a gold vase, not a drink
      return { x: ease * 0.28, lift: -ease * 1.15, rot: ease * -4.2 };
    }
    if (t < 0.58) {
      const s = (t - 0.22) / 0.36;
      const wave = Math.sin(s * Math.PI * 2.15);
      // sit the fork — false gills that fork; not the jack-o'-lantern; not Latch drink
      return { x: 0.28 + wave * 1.15, lift: -1.15 + Math.abs(wave) * 0.55, rot: -4.2 + wave * 8.6 };
    }
    if (t < 0.82) {
      const s = (t - 0.58) / 0.24;
      const ease = s * s * (3 - 2 * s);
      // a flush, then a horn again — remain a fork
      return { x: 0.28 - ease * 0.1, lift: -1.15 + ease * 0.42, rot: -4.2 + ease * 6.4 };
    }
    return { x: 0.18, lift: -0.73, rot: 2.2 };
  }

  function forkHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.09;
    // sit the fork on the sash drip as a moss rim
    return { x: 0.18, lift: -0.73 + hush, rot: 2.2 };
  }

  function forkOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.14) * 0.66;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 2.2) * (1 - ease),
    };
  }

'''

TS_FORK_FNS = r'''
export function forkPoint(win: WindowBounds, sprite = SPRITE, work?: WorkSpace): PlayPoint {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 34;
  const span = Math.max(0, win.width - size - pad * 2);
  // sash drip as moss rim — walk onto the drip, sit the fork; not Latch drink blotter, not Lattice sash-well hollow, not Cap apron warts, not Frill stile shelf, not Eft sash-horn moss saucer, not Cone/Jewel/Whorl glass rim
  const x = win.x + pad + span * 0.28;
  const drip = Math.max(64, win.height * 0.15);
  const gripY = win.y + win.height - drip;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 28, maxLift) };
}

export function forkFace(target: PlayTarget): number {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function forkOnPath(u: number, from: PlayPoint, to: PlayPoint): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.28) * 0.68;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 1.48 * (1 - ease) + stride * 0.06,
  };
}

export function forkPath(u: number): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.22) {
    const s = t / 0.22;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.28, lift: -ease * 1.15, rot: ease * -4.2 };
  }
  if (t < 0.58) {
    const s = (t - 0.22) / 0.36;
    const wave = Math.sin(s * Math.PI * 2.15);
    return { x: 0.28 + wave * 1.15, lift: -1.15 + Math.abs(wave) * 0.55, rot: -4.2 + wave * 8.6 };
  }
  if (t < 0.82) {
    const s = (t - 0.58) / 0.24;
    const ease = s * s * (3 - 2 * s);
    return { x: 0.28 - ease * 0.1, lift: -1.15 + ease * 0.42, rot: -4.2 + ease * 6.4 };
  }
  return { x: 0.18, lift: -0.73, rot: 2.2 };
}

export function forkHoldPath(u: number): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.09;
  return { x: 0.18, lift: -0.73 + hush, rot: 2.2 };
}

export function forkOffPath(u: number, from: PlayPoint & { rot?: number }, to: PlayPoint): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.14) * 0.66;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : 2.2) * (1 - ease),
  };
}

'''

JS_TICK = r'''
    if (next.phase === "fork-on") {
      const face = forkFace(target);
      const u = next.t / DUR.forkOn;
      const pose = forkOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "fork", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "fork") {
      const face = forkFace(target);
      const pose = forkPath(Math.min(1, next.t / DUR.fork));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.fork) {
        return goPhase(next, "fork-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "fork-hold") {
      const face = forkFace(target);
      const pose = forkHoldPath(Math.min(1, next.t / DUR.forkHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.forkHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = forkHoldPath(1);
        return goPhase(next, "fork-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "fork-off") {
      const u = next.t / DUR.forkOff;
      const pose = forkOffPath(Math.min(1, u), next.from, next.to);
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
  if (next.phase === "fork-on") {
    const face = forkFace(target);
    const u = next.t / DUR.forkOn;
    const pose = forkOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "fork", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "fork") {
    const face = forkFace(target);
    const pose = forkPath(Math.min(1, next.t / DUR.fork));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.fork) {
      return goPhase(next, "fork-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "fork-hold") {
    const face = forkFace(target);
    const pose = forkHoldPath(Math.min(1, next.t / DUR.forkHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.forkHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = forkHoldPath(1);
      return goPhase(next, "fork-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "fork-off") {
    const u = next.t / DUR.forkOff;
    const pose = forkOffPath(Math.min(1, u), next.from, next.to);
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
    if (kind === FORK) {
      const hold = forkPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -62 : 62;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 52 : -52;
      return {
        id: best.id,
        kind,
        side: "mossrim",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "forked",
        spin: "none",
      };
    }

'''

TS_PICK = r'''
  if (kind === FORK) {
    const hold = forkPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -62 : 62;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 52 : -52;
    return {
      id: best.id,
      kind,
      side: "mossrim",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "forked",
      spin: "none",
    };
  }

'''

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(t, '  const HOLLOW = "hollow";\n  const SILL = "sill";', '  const HOLLOW = "hollow";\n  const FORK = "fork";\n  const SILL = "sill";', "js const")
    t = once(t, "    hollowOff: 2.44,\n    sillHop:", "    hollowOff: 2.44,\n    forkOn: 2.47,\n    fork: 1.83,\n    forkHold: 4.11,\n    forkOff: 2.39,\n    sillHop:", "js dur")
    t = once(t, '    if (key === "morel") return HOLLOW;\n    return SILL;', '    if (key === "morel") return HOLLOW;\n    if (key === "chanterelle") return FORK;\n    return SILL;', "js playFor")
    t = once(t, "    if (kind === HOLLOW) return w.width >= 180 && w.height >= 200;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === HOLLOW) return w.width >= 180 && w.height >= 200;\n    if (kind === FORK) return w.width >= 194 && w.height >= 176;\n    return w.width >= 180 && w.height >= 70;", "js size")
    t = once(t, '''        leave: "hollowed",
        spin: "none",
      };
    }


        if (kind === WRAP) {''',
             '''        leave: "hollowed",
        spin: "none",
      };
    }
''' + JS_PICK + '''
        if (kind === WRAP) {''', "js pick")
    t = once(t, '''    if (target.kind === HOLLOW) {
      const hold = hollowPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
             '''    if (target.kind === HOLLOW) {
      const hold = hollowPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === FORK) {
      const hold = forkPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''', "js refit")
    t = once(t, '''        if (target.kind === HOLLOW) {
          return goPhase(next, "hollow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
             '''        if (target.kind === HOLLOW) {
          return goPhase(next, "hollow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === FORK) {
          return goPhase(next, "fork-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''', "js approach")
    t = once(t, "  function beginPlay(target, petX) {", JS_FORK_FNS + "  function beginPlay(target, petX) {", "js fns")
    t = once(t, '''    if (next.phase === "hollow-off") {
      const u = next.t / DUR.hollowOff;
      const pose = hollowOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }




    if (next.phase === "sill-hop") {''',
             '''    if (next.phase === "hollow-off") {
      const u = next.t / DUR.hollowOff;
      const pose = hollowOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }
''' + JS_TICK + '''
    if (next.phase === "sill-hop") {''', "js tick")
    t = once(t, "    HOLLOW,\n    IGNORE,", "    HOLLOW,\n    FORK,\n    IGNORE,", "js export kind")
    t = once(t, "    hollowOffPath,\n    pickTarget,", "    hollowOffPath,\n    forkPoint,\n    forkFace,\n    forkOnPath,\n    forkPath,\n    forkHoldPath,\n    forkOffPath,\n    pickTarget,", "js export fns")
    return t

HEADER_OLD_TS = "This is the leftover after Cap. This is the third leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
HEADER_NEW_TS = (
    "This is the leftover after Cap. This is the third leftover of the fungi den. "
    "Horn forks a sash drip as a moss rim: walk onto the drip, sit the fork, then leave. "
    "Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Latch still drinks the drip as blotter. "
    "This is the leftover after Lattice. This is the fourth leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(t, 'export const HOLLOW = "hollow";\nexport const SILL = "sill";', 'export const HOLLOW = "hollow";\nexport const FORK = "fork";\nexport const SILL = "sill";', "ts const")
    t = once(t, "  hollowOff: 2.44,\n  sillHop:", "  hollowOff: 2.44,\n  forkOn: 2.47,\n  fork: 1.83,\n  forkHold: 4.11,\n  forkOff: 2.39,\n  sillHop:", "ts dur")
    t = once(t, ' | typeof SHELF | typeof WARTS | typeof HOLLOW | typeof SILL | typeof IGNORE;', ' | typeof SHELF | typeof WARTS | typeof HOLLOW | typeof FORK | typeof SILL | typeof IGNORE;', "ts kind")
    t = once(t, '  | "hollow-off"\n  | "sill-hop"', '  | "hollow-off"\n  | "fork-on"\n  | "fork"\n  | "fork-hold"\n  | "fork-off"\n  | "sill-hop"', "ts phase")
    t = once(t, ' | "grassperch" | "timbershelf" | "mosscup" | "leafmold";', ' | "grassperch" | "timbershelf" | "mosscup" | "leafmold" | "mossrim";', "ts side")
    t = once(t, ' | "laced" | "seized" | "shelved" | "warted" | "hollowed";', ' | "laced" | "seized" | "shelved" | "warted" | "hollowed" | "forked";', "ts leave")
    t = once(t, '  if (key === "morel") return HOLLOW;\n  return SILL;', '  if (key === "morel") return HOLLOW;\n  if (key === "chanterelle") return FORK;\n  return SILL;', "ts playFor")
    t = once(t, "  if (kind === HOLLOW) return w.width >= 180 && w.height >= 200;\n    return w.width >= 180 && w.height >= 70;", "  if (kind === HOLLOW) return w.width >= 180 && w.height >= 200;\n  if (kind === FORK) return w.width >= 194 && w.height >= 176;\n    return w.width >= 180 && w.height >= 70;", "ts size")
    t = once(t, '''      leave: "hollowed",
      spin: "none",
    };
  }


  if (kind === WRAP) {''',
             '''      leave: "hollowed",
      spin: "none",
    };
  }
''' + TS_PICK + '''
  if (kind === WRAP) {''', "ts pick")
    t = once(t, '''  if (target.kind === HOLLOW) {
    const hold = hollowPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
             '''  if (target.kind === HOLLOW) {
    const hold = hollowPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === FORK) {
    const hold = forkPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''', "ts refit")
    t = once(t, '''      if (target.kind === HOLLOW) {
        return goPhase(next, "hollow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
             '''      if (target.kind === HOLLOW) {
        return goPhase(next, "hollow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === FORK) {
        return goPhase(next, "fork-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''', "ts approach")
    t = once(t, "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", TS_FORK_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", "ts fns")
    t = once(t, '''  if (next.phase === "hollow-off") {
    const u = next.t / DUR.hollowOff;
    const pose = hollowOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }




  if (next.phase === "sill-hop") {''',
             '''  if (next.phase === "hollow-off") {
    const u = next.t / DUR.hollowOff;
    const pose = hollowOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }
''' + TS_TICK + '''
  if (next.phase === "sill-hop") {''', "ts tick")
    return t

js_path = Path("desktop/renderer/window-play.js")
ts_path = Path("web/src/lib/pets/window-play.ts")
js = js_path.read_text(encoding="utf-8")
ts = ts_path.read_text(encoding="utf-8")
js2 = patch_js(js)
ts2 = patch_ts(ts)
js_path.write_text(js2, encoding="utf-8", newline="\n")
ts_path.write_text(ts2, encoding="utf-8", newline="\n")
print("JS", len(js), "->", len(js2), "delta", len(js2)-len(js))
print("TS", len(ts), "->", len(ts2), "delta", len(ts2)-len(ts))
print("FORK js", 'const FORK' in js2, "ts", "export const FORK" in ts2)
print("chanterelle js", 'key === "chanterelle") return FORK' in js2)
print("mossrim", js2.count("mossrim"), ts2.count("mossrim"))
print("playFor morel still hollow", 'key === "morel") return HOLLOW' in js2, 'key === "morel") return HOLLOW' in ts2)
