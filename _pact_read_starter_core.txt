# -*- coding: utf-8 -*-
"""Apply Starter (yeast) bloom leftover — ninth fungi den window-play."""
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:220]!r}")
    return text.replace(old, new, 1)

HEADER_OLD = "This is the leftover after Puff. This is the eighth leftover of the fungi den. Others walk a sill. */"
HEADER_NEW = (
    "This is the leftover after Puff. This is the eighth leftover of the fungi den. "
    "Starter blooms a damp pane as a yeast film: walk onto the pane, sit the warm damp glass, bloom once, sit the soft culture film, then leave. "
    "Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Flame. This is the ninth leftover of the fungi den. Others walk a sill. */"
)
HEADER_OLD_TS = "This is the leftover after Puff. This is the eighth leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
HEADER_NEW_TS = (
    "This is the leftover after Puff. This is the eighth leftover of the fungi den. "
    "Starter blooms a damp pane as a yeast film: walk onto the pane, sit the warm damp glass, bloom once, sit the soft culture film, then leave. "
    "Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Flame. This is the ninth leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

BLOOM_FNS = r'''
  function bloomPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 10;
    const span = Math.max(0, win.width - size - pad * 2);
    // lower damp pane — warm condensation micro-site for yeast film; not Tun's dry moss-film center, not Flame's right stile drip, not Puff's apron cloud, not Frill's left timber shelf
    const x = win.x + pad + span * 0.48;
    const pane = Math.max(72, win.height * 0.58);
    const gripY = win.y + pane;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 34, maxLift) };
  }

  function bloomFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function bloomOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.18) * 0.42;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 0.88 * (1 - ease) + stride * 0.03,
    };
  }

  function bloomPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.18) {
      const s = t / 0.18;
      const ease = s * s * (3 - 2 * s);
      // take the damp glass — soft culture film; yeast, not mold, not bubble foam
      return { x: ease * 0.28, lift: ease * 0.36, rot: ease * -4.2 };
    }
    if (t < 0.52) {
      const s = (t - 0.18) / 0.34;
      const wave = Math.sin(s * Math.PI * 1.35);
      // bloom once — soft film spreads on the warm damp pane; bloom is the tell; not Flame drip, not Tun dry, not foam, not culture
      return { x: 0.28 + wave * 2.4, lift: 0.36 + Math.abs(wave) * 2.8, rot: -4.2 + wave * 3.6 };
    }
    if (t < 0.82) {
      const s = (t - 0.52) / 0.3;
      const ease = s * s * (3 - 2 * s);
      // settle the film — thin soft bloom on the condensation
      return { x: 0.28 - ease * 0.06, lift: 0.36 - ease * 0.12, rot: -4.2 + ease * 1.8 };
    }
    return { x: 0.22, lift: 0.24, rot: -2.4 };
  }

  function bloomHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.055;
    // sit the soft culture film; the bloom records it
    return { x: 0.22, lift: 0.24 + hush, rot: -2.4 };
  }

  function bloomOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.22) * 0.58;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -2.4) * (1 - ease),
    };
  }


'''

JS_TICK = r'''
    if (next.phase === "bloom-on") {
      const face = bloomFace(target);
      const u = next.t / DUR.bloomOn;
      const pose = bloomOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "bloom", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "bloom") {
      const face = bloomFace(target);
      const pose = bloomPath(Math.min(1, next.t / DUR.bloom));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.bloom) {
        return goPhase(next, "bloom-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "bloom-hold") {
      const face = bloomFace(target);
      const pose = bloomHoldPath(Math.min(1, next.t / DUR.bloomHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.bloomHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = bloomHoldPath(1);
        return goPhase(next, "bloom-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "bloom-off") {
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

'''

TS_BLOOM_FNS = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in BLOOM_FNS.splitlines(True)
).replace("function bloom", "export function bloom")

TS_TICK = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in JS_TICK.splitlines(True)
)

JS_PICK = r'''
    if (kind === BLOOM) {
      const hold = bloomPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -48 : 48;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 44 : -44;
      return {
        id: best.id,
        kind,
        side: "yeastfilm",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "bloomed",
        spin: "none",
      };
    }

'''

TS_PICK = r'''
  if (kind === BLOOM) {
    const hold = bloomPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -48 : 48;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 44 : -44;
    return {
      id: best.id,
      kind,
      side: "yeastfilm",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "bloomed",
      spin: "none",
    };
  }

'''

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(t, '  const DRIP = "drip";\n  const SILL = "sill";', '  const DRIP = "drip";\n  const BLOOM = "bloom";\n  const SILL = "sill";', "js const")
    t = once(t, "    dripOff: 2.48,\n    sillHop:", "    dripOff: 2.48,\n    bloomOn: 2.61,\n    bloom: 2.08,\n    bloomHold: 4.44,\n    bloomOff: 2.53,\n    sillHop:", "js dur")
    t = once(t, '    if (key === "chicken_of_woods") return DRIP;\n    return SILL;', '    if (key === "chicken_of_woods") return DRIP;\n    if (key === "yeast") return BLOOM;\n    return SILL;', "js playFor")
    t = once(t, "    if (kind === DRIP) return w.width >= 192 && w.height >= 210;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === DRIP) return w.width >= 192 && w.height >= 210;\n    if (kind === BLOOM) return w.width >= 186 && w.height >= 156;\n    return w.width >= 180 && w.height >= 70;", "js size")
    t = once(t, '''        leave: "dripped",
        spin: "none",
      };
    }


        if (kind === WRAP) {''',
             '''        leave: "dripped",
        spin: "none",
      };
    }
''' + JS_PICK + '''
        if (kind === WRAP) {''', "js pick")
    t = once(t, '''    if (target.kind === DRIP) {
      const hold = dripPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
             '''    if (target.kind === DRIP) {
      const hold = dripPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BLOOM) {
      const hold = bloomPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''', "js refit")
    t = once(t, '''        if (target.kind === DRIP) {
          return goPhase(next, "drip-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
             '''        if (target.kind === DRIP) {
          return goPhase(next, "drip-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === BLOOM) {
          return goPhase(next, "bloom-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''', "js approach")
    t = once(t, "  function beginPlay(target, petX) {", BLOOM_FNS + "  function beginPlay(target, petX) {", "js fns")
    t = once(t, '''    if (next.phase === "drip-off") {
      const u = next.t / DUR.dripOff;
      const pose = dripOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }


    if (next.phase === "sill-hop") {''',
             '''    if (next.phase === "drip-off") {
      const u = next.t / DUR.dripOff;
      const pose = dripOffPath(Math.min(1, u), next.from, next.to);
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
    t = once(t, "    DRIP,\n    IGNORE,", "    DRIP,\n    BLOOM,\n    IGNORE,", "js export kind")
    t = once(t, "    dripOffPath,\n    pickTarget,", "    dripOffPath,\n    bloomPoint,\n    bloomFace,\n    bloomOnPath,\n    bloomPath,\n    bloomHoldPath,\n    bloomOffPath,\n    pickTarget,", "js export fns")
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(t, 'export const DRIP = "drip";\nexport const SILL = "sill";', 'export const DRIP = "drip";\nexport const BLOOM = "bloom";\nexport const SILL = "sill";', "ts const")
    t = once(t, "  dripOff: 2.48,\n  sillHop:", "  dripOff: 2.48,\n  bloomOn: 2.61,\n  bloom: 2.08,\n  bloomHold: 4.44,\n  bloomOff: 2.53,\n  sillHop:", "ts dur")
    t = once(t, "typeof DRIP | typeof SILL | typeof IGNORE;", "typeof DRIP | typeof BLOOM | typeof SILL | typeof IGNORE;", "ts kind")
    t = once(t, '  | "drip-off"\n  | "sill-hop"', '  | "drip-off"\n  | "bloom-on"\n  | "bloom"\n  | "bloom-hold"\n  | "bloom-off"\n  | "sill-hop"', "ts phase")
    t = once(t, '| "sporedish" | "warmwood";', '| "sporedish" | "warmwood" | "yeastfilm";', "ts side")
    t = once(t, '| "clouded" | "dripped";', '| "clouded" | "dripped" | "bloomed";', "ts leave")
    t = once(t, '  if (key === "chicken_of_woods") return DRIP;\n  return SILL;', '  if (key === "chicken_of_woods") return DRIP;\n  if (key === "yeast") return BLOOM;\n  return SILL;', "ts playFor")
    t = once(t, "  if (kind === DRIP) return w.width >= 192 && w.height >= 210;\n    return w.width >= 180 && w.height >= 70;", "  if (kind === DRIP) return w.width >= 192 && w.height >= 210;\n  if (kind === BLOOM) return w.width >= 186 && w.height >= 156;\n    return w.width >= 180 && w.height >= 70;", "ts size")
    t = once(t, '''      leave: "dripped",
      spin: "none",
    };
  }


  if (kind === WRAP) {''',
             '''      leave: "dripped",
      spin: "none",
    };
  }
''' + TS_PICK + '''
  if (kind === WRAP) {''', "ts pick")
    t = once(t, '''  if (target.kind === DRIP) {
    const hold = dripPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
             '''  if (target.kind === DRIP) {
    const hold = dripPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BLOOM) {
    const hold = bloomPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''', "ts refit")
    t = once(t, '''      if (target.kind === DRIP) {
        return goPhase(next, "drip-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
             '''      if (target.kind === DRIP) {
        return goPhase(next, "drip-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === BLOOM) {
        return goPhase(next, "bloom-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''', "ts approach")
    t = once(t, "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", TS_BLOOM_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", "ts fns")
    tick_old = '  if (next.phase === "drip-off") {\n\n    const u = next.t / DUR.dripOff;\n\n    const pose = dripOffPath(Math.min(1, u), next.from, next.to);\n\n    next.x = pose.x;\n\n    next.lift = pose.lift;\n\n    next.rot = pose.rot;\n\n    next.anim = "walk";\n\n    next.facing = target.landX >= target.holdX ? 1 : -1;\n\n    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n\n    return next;\n\n  }\n\n\n'
    t = once(t, tick_old + 'if (next.phase === "sill-hop") {',
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
print("BLOOM", 'const BLOOM' in js2, "export const BLOOM" in ts2)
print("yeast", 'key === "yeast") return BLOOM' in js2, 'key === "yeast") return BLOOM' in ts2)
print("yeastfilm", js2.count("yeastfilm"), ts2.count("yeastfilm"))
