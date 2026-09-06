# -*- coding: utf-8 -*-
"""Apply Pact (lichen) plaque leftover — tenth fungi den window-play; closes fungi ten."""
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:220]!r}")
    return text.replace(old, new, 1)

HEADER_OLD = "This is the leftover after Flame. This is the ninth leftover of the fungi den. Others walk a sill. */"
HEADER_NEW = (
    "This is the leftover after Flame. This is the ninth leftover of the fungi den. "
    "Pact plaques a cool stile as bark stone: walk onto the stile, sit the cool bark wood, plaque once, sit the two-kingdom share, then leave. "
    "Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Starter. This is the tenth leftover of the fungi den and closes fungi ten. Others walk a sill. */"
)
HEADER_OLD_TS = "This is the leftover after Flame. This is the ninth leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
HEADER_NEW_TS = (
    "This is the leftover after Flame. This is the ninth leftover of the fungi den. "
    "Pact plaques a cool stile as bark stone: walk onto the stile, sit the cool bark wood, plaque once, sit the two-kingdom share, then leave. "
    "Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Starter. This is the tenth leftover of the fungi den and closes fungi ten. Others walk a sill. Same map as desktop `window-play.js`. */"
)

PLAQUE_FNS = r'''
  function plaquePoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 10;
    const span = Math.max(0, win.width - size - pad * 2);
    // upper cool left stile — bark/stone micro-site for a two-kingdom plaque; not Frill's mid left timber shelf, not Flame's right warm drip, not Starter's lower damp yeast film, not Tun's dry moss-film center, not Ring's mid zones
    const x = win.x + pad + span * 0.08;
    const timber = Math.max(58, win.height * 0.22);
    const gripY = win.y + timber;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 34, maxLift) };
  }

  function plaqueFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function plaqueOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.12) * 0.36;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 0.72 * (1 - ease) + stride * 0.025,
    };
  }

  function plaquePath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.2) {
      const s = t / 0.2;
      const ease = s * s * (3 - 2 * s);
      // take the cool bark wood — slow crust of two kingdoms; lichen, not yeast bloom, not shelf bracket, not drip
      return { x: ease * 0.18, lift: ease * 0.28, rot: ease * -3.1 };
    }
    if (t < 0.55) {
      const s = (t - 0.2) / 0.35;
      const wave = Math.sin(s * Math.PI * 1.15);
      // plaque once — two-kingdom share paints the cool stile; plaque is the tell; not bloom, not drip, not shelf, not crust as guest name, not stain, not paint
      return { x: 0.18 + wave * 1.6, lift: 0.28 + Math.abs(wave) * 1.9, rot: -3.1 + wave * 2.4 };
    }
    if (t < 0.84) {
      const s = (t - 0.55) / 0.29;
      const ease = s * s * (3 - 2 * s);
      // settle the share — thin slow plaque on cool bark stone
      return { x: 0.18 - ease * 0.04, lift: 0.28 - ease * 0.1, rot: -3.1 + ease * 1.4 };
    }
    return { x: 0.14, lift: 0.18, rot: -1.7 };
  }

  function plaqueHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.04;
    // sit the two-kingdom share; the plaque records it
    return { x: 0.14, lift: 0.18 + hush, rot: -1.7 };
  }

  function plaqueOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.16) * 0.5;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -1.7) * (1 - ease),
    };
  }


'''

JS_TICK = r'''
    if (next.phase === "plaque-on") {
      const face = plaqueFace(target);
      const u = next.t / DUR.plaqueOn;
      const pose = plaqueOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "plaque", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "plaque") {
      const face = plaqueFace(target);
      const pose = plaquePath(Math.min(1, next.t / DUR.plaque));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.plaque) {
        return goPhase(next, "plaque-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "plaque-hold") {
      const face = plaqueFace(target);
      const pose = plaqueHoldPath(Math.min(1, next.t / DUR.plaqueHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.plaqueHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = plaqueHoldPath(1);
        return goPhase(next, "plaque-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "plaque-off") {
      const u = next.t / DUR.plaqueOff;
      const pose = plaqueOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

'''

TS_PLAQUE_FNS = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in PLAQUE_FNS.splitlines(True)
).replace("function plaque", "export function plaque")

TS_TICK = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in JS_TICK.splitlines(True)
)

JS_PICK = r'''
    if (kind === PLAQUE) {
      const hold = plaquePoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -48 : 48;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 44 : -44;
      return {
        id: best.id,
        kind,
        side: "barkstone",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "plaqued",
        spin: "none",
      };
    }

'''

TS_PICK = r'''
  if (kind === PLAQUE) {
    const hold = plaquePoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -48 : 48;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 44 : -44;
    return {
      id: best.id,
      kind,
      side: "barkstone",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "plaqued",
      spin: "none",
    };
  }

'''

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(t, '  const BLOOM = "bloom";\n  const SILL = "sill";', '  const BLOOM = "bloom";\n  const PLAQUE = "plaque";\n  const SILL = "sill";', "js const")
    t = once(t, "    bloomOff: 2.53,\n    sillHop:", "    bloomOff: 2.53,\n    plaqueOn: 2.74,\n    plaque: 2.22,\n    plaqueHold: 4.68,\n    plaqueOff: 2.59,\n    sillHop:", "js dur")
    t = once(t, '    if (key === "yeast") return BLOOM;\n    return SILL;', '    if (key === "yeast") return BLOOM;\n    if (key === "lichen") return PLAQUE;\n    return SILL;', "js playFor")
    t = once(t, "    if (kind === BLOOM) return w.width >= 186 && w.height >= 156;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === BLOOM) return w.width >= 186 && w.height >= 156;\n    if (kind === PLAQUE) return w.width >= 188 && w.height >= 168;\n    return w.width >= 180 && w.height >= 70;", "js size")
    t = once(t, '''        leave: "bloomed",
        spin: "none",
      };
    }


        if (kind === WRAP) {''',
             '''        leave: "bloomed",
        spin: "none",
      };
    }
''' + JS_PICK + '''
        if (kind === WRAP) {''', "js pick")
    t = once(t, '''    if (target.kind === BLOOM) {
      const hold = bloomPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
             '''    if (target.kind === BLOOM) {
      const hold = bloomPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === PLAQUE) {
      const hold = plaquePoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''', "js refit")
    t = once(t, '''        if (target.kind === BLOOM) {
          return goPhase(next, "bloom-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
             '''        if (target.kind === BLOOM) {
          return goPhase(next, "bloom-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === PLAQUE) {
          return goPhase(next, "plaque-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''', "js approach")
    t = once(t, "  function beginPlay(target, petX) {", PLAQUE_FNS + "  function beginPlay(target, petX) {", "js fns")
    t = once(t, '''    if (next.phase === "bloom-off") {
      const u = next.t / DUR.bloomOff;
      const pose = bloomOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }


    if (next.phase === "sill-hop") {''',
             '''    if (next.phase === "bloom-off") {
      const u = next.t / DUR.bloomOff;
      const pose = bloomOffPath(Math.min(1, u), next.from, next.to);
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
    t = once(t, "    BLOOM,\n    IGNORE,", "    BLOOM,\n    PLAQUE,\n    IGNORE,", "js export kind")
    t = once(t, "    bloomOffPath,\n    pickTarget,", "    bloomOffPath,\n    plaquePoint,\n    plaqueFace,\n    plaqueOnPath,\n    plaquePath,\n    plaqueHoldPath,\n    plaqueOffPath,\n    pickTarget,", "js export fns")
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(t, 'export const BLOOM = "bloom";\nexport const SILL = "sill";', 'export const BLOOM = "bloom";\nexport const PLAQUE = "plaque";\nexport const SILL = "sill";', "ts const")
    t = once(t, "  bloomOff: 2.53,\n  sillHop:", "  bloomOff: 2.53,\n  plaqueOn: 2.74,\n  plaque: 2.22,\n  plaqueHold: 4.68,\n  plaqueOff: 2.59,\n  sillHop:", "ts dur")
    t = once(t, "typeof BLOOM | typeof SILL | typeof IGNORE;", "typeof BLOOM | typeof PLAQUE | typeof SILL | typeof IGNORE;", "ts kind")
    t = once(t, '  | "bloom-off"\n  | "sill-hop"', '  | "bloom-off"\n  | "plaque-on"\n  | "plaque"\n  | "plaque-hold"\n  | "plaque-off"\n  | "sill-hop"', "ts phase")
    t = once(t, '| "sporedish" | "warmwood" | "yeastfilm";', '| "sporedish" | "warmwood" | "yeastfilm" | "barkstone";', "ts side")
    t = once(t, '| "clouded" | "dripped" | "bloomed";', '| "clouded" | "dripped" | "bloomed" | "plaqued";', "ts leave")
    t = once(t, '  if (key === "yeast") return BLOOM;\n  return SILL;', '  if (key === "yeast") return BLOOM;\n  if (key === "lichen") return PLAQUE;\n  return SILL;', "ts playFor")
    t = once(t, "  if (kind === BLOOM) return w.width >= 186 && w.height >= 156;\n    return w.width >= 180 && w.height >= 70;", "  if (kind === BLOOM) return w.width >= 186 && w.height >= 156;\n  if (kind === PLAQUE) return w.width >= 188 && w.height >= 168;\n    return w.width >= 180 && w.height >= 70;", "ts size")
    t = once(t, '''      leave: "bloomed",
      spin: "none",
    };
  }


  if (kind === WRAP) {''',
             '''      leave: "bloomed",
      spin: "none",
    };
  }
''' + TS_PICK + '''
  if (kind === WRAP) {''', "ts pick")
    t = once(t, '''  if (target.kind === BLOOM) {
    const hold = bloomPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
             '''  if (target.kind === BLOOM) {
    const hold = bloomPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === PLAQUE) {
    const hold = plaquePoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''', "ts refit")
    t = once(t, '''      if (target.kind === BLOOM) {
        return goPhase(next, "bloom-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
             '''      if (target.kind === BLOOM) {
        return goPhase(next, "bloom-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === PLAQUE) {
        return goPhase(next, "plaque-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''', "ts approach")
    t = once(t, "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", TS_PLAQUE_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", "ts fns")
    tick_old = '  if (next.phase === "bloom-off") {\n\n    const u = next.t / DUR.bloomOff;\n\n    const pose = bloomOffPath(Math.min(1, u), next.from, next.to);\n\n    next.x = pose.x;\n\n    next.lift = pose.lift;\n\n    next.rot = pose.rot;\n\n    next.anim = "walk";\n\n    next.facing = target.landX >= target.holdX ? 1 : -1;\n\n    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n\n    return next;\n\n  }\n\n\n'
    t = once(t, tick_old + '  if (next.phase === "sill-hop") {',
             tick_old + TS_TICK + '  if (next.phase === "sill-hop") {', "ts tick")
    return t

js_path = Path("desktop/renderer/window-play.js")
ts_path = Path("web/src/lib/pets/window-play.ts")
js = js_path.read_text(encoding="utf-8")
ts = ts_path.read_text(encoding="utf-8")
js2 = patch_js(js)
ts2 = patch_ts(ts)
js_path.write_text(js2, encoding="utf-8", newline="\n")
ts_path.write_text(ts2, encoding="utf-8", newline="\n")
print("JS", len(js), "->", len(js2), "delta", len(js2) - len(js))
print("TS", len(ts), "->", len(ts2), "delta", len(ts2) - len(ts))
print("PLAQUE", 'const PLAQUE' in js2, "export const PLAQUE" in ts2)
print("lichen", 'key === "lichen") return PLAQUE' in js2, 'key === "lichen") return PLAQUE' in ts2)
print("barkstone", js2.count("barkstone"), ts2.count("barkstone"))
print("closes fungi", "closes fungi ten" in js2)
