from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:160]!r}")
    return text.replace(old, new, 1)

def insert_after(text, marker, addition, label):
    n = text.count(marker)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 marker, got {n}\nMARKER: {marker[:160]!r}")
    i = text.find(marker) + len(marker)
    return text[:i] + addition + text[i:]

HEADER_OLD = "This is the second leftover of the fungi den. Others walk a sill. */"
HEADER_NEW = (
    "This is the second leftover of the fungi den. Lattice hollows a sash well as leaf mold: walk into the well, sit the hollow, then leave. "
    "Cap still owns warts. Frill still owns shelf. Felt still owns lean. This is the leftover after Cap. This is the third leftover of the fungi den. Others walk a sill. */"
)

JS_HOLLOW_FNS = r'''
  function hollowPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 36;
    const span = Math.max(0, win.width - size - pad * 2);
    // sash well as leaf mold — walk into the well; not Velvet silk-burrow kick, not Nori inkwell bun, not Dapple window-well cover, not Cap apron warts
    const x = win.x + pad + span * 0.44;
    const fromTop = Math.max(win.height * 0.76, Math.min(win.height * 0.84, win.height - 50));
    const gripY = win.y + fromTop;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function hollowFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function hollowOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.22) * 0.74;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.62 * (1 - ease) + stride * 0.05,
    };
  }

  function hollowPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.2) {
      const s = t / 0.2;
      const ease = s * s * (3 - 2 * s);
      // sink the honeycomb — a hollow, not a false morel; hollow is the tell
      return { x: ease * 0.22, lift: -ease * 2.55, rot: ease * 3.8 };
    }
    if (t < 0.55) {
      const s = (t - 0.2) / 0.35;
      const wave = Math.sin(s * Math.PI * 1.85);
      // sit the hollow — pits of the lattice, not Velvet kick, not Nori bun, not Cap warts
      return { x: 0.22 + wave * 0.85, lift: -2.55 + Math.abs(wave) * 0.42, rot: 3.8 + wave * 1.7 };
    }
    if (t < 0.8) {
      const s = (t - 0.55) / 0.25;
      const ease = s * s * (3 - 2 * s);
      return { x: 0.22 - ease * 0.08, lift: -2.55 + ease * 0.38, rot: 3.8 - ease * 1.15 };
    }
    return { x: 0.14, lift: -2.17, rot: 2.65 };
  }

  function hollowHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.07;
    // sit the hollow in the sash well as leaf mold
    return { x: 0.14, lift: -2.17 + hush, rot: 2.65 };
  }

  function hollowOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.18) * 0.7;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 2.65) * (1 - ease),
    };
  }

'''

TS_HOLLOW_FNS = r'''
export function hollowPoint(win: WindowBounds, sprite = SPRITE, work?: WorkSpace): PlayPoint {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 36;
  const span = Math.max(0, win.width - size - pad * 2);
  // sash well as leaf mold — walk into the well; not Velvet silk-burrow kick, not Nori inkwell bun, not Dapple window-well cover, not Cap apron warts
  const x = win.x + pad + span * 0.44;
  const fromTop = Math.max(win.height * 0.76, Math.min(win.height * 0.84, win.height - 50));
  const gripY = win.y + fromTop;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 36, maxLift) };
}

export function hollowFace(target: PlayTarget): number {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function hollowOnPath(u: number, from: PlayPoint, to: PlayPoint): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.22) * 0.74;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 1.62 * (1 - ease) + stride * 0.05,
  };
}

export function hollowPath(u: number): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.2) {
    const s = t / 0.2;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.22, lift: -ease * 2.55, rot: ease * 3.8 };
  }
  if (t < 0.55) {
    const s = (t - 0.2) / 0.35;
    const wave = Math.sin(s * Math.PI * 1.85);
    return { x: 0.22 + wave * 0.85, lift: -2.55 + Math.abs(wave) * 0.42, rot: 3.8 + wave * 1.7 };
  }
  if (t < 0.8) {
    const s = (t - 0.55) / 0.25;
    const ease = s * s * (3 - 2 * s);
    return { x: 0.22 - ease * 0.08, lift: -2.55 + ease * 0.38, rot: 3.8 - ease * 1.15 };
  }
  return { x: 0.14, lift: -2.17, rot: 2.65 };
}

export function hollowHoldPath(u: number): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.07;
  return { x: 0.14, lift: -2.17 + hush, rot: 2.65 };
}

export function hollowOffPath(u: number, from: PlayPoint & { rot?: number }, to: PlayPoint): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.18) * 0.7;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : 2.65) * (1 - ease),
  };
}

'''

JS_TICK = r'''
    if (next.phase === "hollow-on") {
      const face = hollowFace(target);
      const u = next.t / DUR.hollowOn;
      const pose = hollowOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "hollow", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "hollow") {
      const face = hollowFace(target);
      const pose = hollowPath(Math.min(1, next.t / DUR.hollow));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.hollow) {
        return goPhase(next, "hollow-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "hollow-hold") {
      const face = hollowFace(target);
      const pose = hollowHoldPath(Math.min(1, next.t / DUR.hollowHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.hollowHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = hollowHoldPath(1);
        return goPhase(next, "hollow-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "hollow-off") {
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

'''

TS_TICK = r'''
  if (next.phase === "hollow-on") {
    const face = hollowFace(target);
    const u = next.t / DUR.hollowOn;
    const pose = hollowOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "hollow", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "hollow") {
    const face = hollowFace(target);
    const pose = hollowPath(Math.min(1, next.t / DUR.hollow));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.hollow) {
      return goPhase(next, "hollow-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "hollow-hold") {
    const face = hollowFace(target);
    const pose = hollowHoldPath(Math.min(1, next.t / DUR.hollowHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.hollowHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = hollowHoldPath(1);
      return goPhase(next, "hollow-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "hollow-off") {
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

'''

JS_PICK = r'''
    if (kind === HOLLOW) {
      const hold = hollowPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -70 : 70;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 66 : -66;
      return {
        id: best.id,
        kind,
        side: "leafmold",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "hollowed",
        spin: "none",
      };
    }

'''

TS_PICK = r'''
  if (kind === HOLLOW) {
    const hold = hollowPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -70 : 70;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 66 : -66;
    return {
      id: best.id,
      kind,
      side: "leafmold",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "hollowed",
      spin: "none",
    };
  }

'''

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(t, '  const WARTS = "warts";\n  const SILL = "sill";', '  const WARTS = "warts";\n  const HOLLOW = "hollow";\n  const SILL = "sill";', "js const")
    t = once(t, "    wartsOff: 2.55,\n    sillHop:", "    wartsOff: 2.55,\n    hollowOn: 2.51,\n    hollow: 1.79,\n    hollowHold: 4.02,\n    hollowOff: 2.44,\n    sillHop:", "js dur")
    t = once(t, '    if (key === "fly_agaric") return WARTS;\n    return SILL;', '    if (key === "fly_agaric") return WARTS;\n    if (key === "morel") return HOLLOW;\n    return SILL;', "js playFor")
    t = once(t, "    if (kind === WARTS) return w.width >= 186 && w.height >= 148;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === WARTS) return w.width >= 186 && w.height >= 148;\n    if (kind === HOLLOW) return w.width >= 180 && w.height >= 200;\n    return w.width >= 180 && w.height >= 70;", "js size")
    t = once(t, '        leave: "warted",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
             '        leave: "warted",\n        spin: "none",\n      };\n    }\n' + JS_PICK + '\n        if (kind === WRAP) {', "js pick")
    t = once(t, '''    if (target.kind === WARTS) {
      const hold = wartsPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
             '''    if (target.kind === WARTS) {
      const hold = wartsPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === HOLLOW) {
      const hold = hollowPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''', "js refit")
    t = once(t, '''        if (target.kind === WARTS) {
          return goPhase(next, "warts-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
             '''        if (target.kind === WARTS) {
          return goPhase(next, "warts-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === HOLLOW) {
          return goPhase(next, "hollow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''', "js approach")
    t = once(t, "  function beginPlay(target, petX) {", JS_HOLLOW_FNS + "  function beginPlay(target, petX) {", "js fns")
    t = insert_after(t, '      const pose = wartsOffPath(Math.min(1, u), next.from, next.to);\n      next.x = pose.x;\n      next.lift = pose.lift;\n      next.rot = pose.rot;\n      next.anim = "walk";\n      next.facing = target.landX >= target.holdX ? 1 : -1;\n      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n      return next;\n    }',
                     "\n" + JS_TICK, "js tick")
    t = once(t, "    WARTS,\n    IGNORE,", "    WARTS,\n    HOLLOW,\n    IGNORE,", "js export kind")
    t = once(t, "    wartsOffPath,\n    pickTarget,", "    wartsOffPath,\n    hollowPoint,\n    hollowFace,\n    hollowOnPath,\n    hollowPath,\n    hollowHoldPath,\n    hollowOffPath,\n    pickTarget,", "js export fns")
    return t

def patch_ts(t):
    t = once(t, "This is the second leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */", "This is the second leftover of the fungi den. Lattice hollows a sash well as leaf mold: walk into the well, sit the hollow, then leave. Cap still owns warts. Frill still owns shelf. Felt still owns lean. This is the leftover after Cap. This is the third leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */", "ts header")
    t = once(t, 'export const WARTS = "warts";\nexport const SILL = "sill";', 'export const WARTS = "warts";\nexport const HOLLOW = "hollow";\nexport const SILL = "sill";', "ts const")
    t = once(t, "  wartsOff: 2.55,\n  sillHop:", "  wartsOff: 2.55,\n  hollowOn: 2.51,\n  hollow: 1.79,\n  hollowHold: 4.02,\n  hollowOff: 2.44,\n  sillHop:", "ts dur")
    t = once(t, ' | typeof SHELF | typeof WARTS | typeof SILL | typeof IGNORE;', ' | typeof SHELF | typeof WARTS | typeof HOLLOW | typeof SILL | typeof IGNORE;', "ts kind")
    t = once(t, '  | "warts-off"\n  | "sill-hop"', '  | "warts-off"\n  | "hollow-on"\n  | "hollow"\n  | "hollow-hold"\n  | "hollow-off"\n  | "sill-hop"', "ts phase")
    t = once(t, ' | "grassperch" | "timbershelf" | "mosscup";', ' | "grassperch" | "timbershelf" | "mosscup" | "leafmold";', "ts side")
    t = once(t, ' | "seized" | "shelved" | "warted";', ' | "seized" | "shelved" | "warted" | "hollowed";', "ts leave")
    t = once(t, '  if (key === "fly_agaric") return WARTS;\n  return SILL;', '  if (key === "fly_agaric") return WARTS;\n  if (key === "morel") return HOLLOW;\n  return SILL;', "ts playFor")
    t = once(t, "  if (kind === WARTS) return w.width >= 186 && w.height >= 148;\n    return w.width >= 180 && w.height >= 70;", "  if (kind === WARTS) return w.width >= 186 && w.height >= 148;\n  if (kind === HOLLOW) return w.width >= 180 && w.height >= 200;\n    return w.width >= 180 && w.height >= 70;", "ts size")
    t = once(t, '      leave: "warted",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {',
             '      leave: "warted",\n      spin: "none",\n    };\n  }\n' + TS_PICK + '\n  if (kind === WRAP) {', "ts pick")
    t = once(t, '''  if (target.kind === WARTS) {
    const hold = wartsPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
             '''  if (target.kind === WARTS) {
    const hold = wartsPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === HOLLOW) {
    const hold = hollowPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''', "ts refit")
    t = once(t, '''      if (target.kind === WARTS) {
        return goPhase(next, "warts-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
             '''      if (target.kind === WARTS) {
        return goPhase(next, "warts-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === HOLLOW) {
        return goPhase(next, "hollow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''', "ts approach")
    t = once(t, "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", TS_HOLLOW_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", "ts fns")
    t = insert_after(t, '    const pose = wartsOffPath(Math.min(1, u), next.from, next.to);\n    next.x = pose.x;\n    next.lift = pose.lift;\n    next.rot = pose.rot;\n    next.anim = "walk";\n    next.facing = target.landX >= target.holdX ? 1 : -1;\n    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n    return next;\n  }',
                     "\n" + TS_TICK, "ts tick")
    return t

js_path = Path("desktop/renderer/window-play.js")
ts_path = Path("web/src/lib/pets/window-play.ts")
js = js_path.read_text(encoding="utf-8")
ts = ts_path.read_text(encoding="utf-8")
js2 = patch_js(js)
ts2 = patch_ts(ts)
if "const HOLLOW" not in js2:
    raise SystemExit("js missing HOLLOW")
if 'if (key === "morel") return HOLLOW' not in js2:
    raise SystemExit("js missing morel playFor")
if "hollow-on" not in js2 or "hollow-hold" not in js2:
    raise SystemExit("js missing tick phases")
js_path.write_text(js2, encoding="utf-8", newline="\n")
ts_path.write_text(ts2, encoding="utf-8", newline="\n")
print("OK JS", len(js2)-len(js), "TS", len(ts2)-len(ts))
print("leafmold", js2.count("leafmold"), ts2.count("leafmold"))
print("HOLLOW export", "HOLLOW," in js2)
