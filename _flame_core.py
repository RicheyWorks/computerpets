# -*- coding: utf-8 -*-
"""Apply Flame (chicken_of_woods) drip leftover — eighth fungi den window-play."""
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:220]!r}")
    return text.replace(old, new, 1)

HEADER_OLD = "This is the leftover after Mane. This is the seventh leftover of the fungi den. Others walk a sill. */"
HEADER_NEW = (
    "This is the leftover after Mane. This is the seventh leftover of the fungi den. "
    "Flame drips a sash stile as warm wood: walk onto the stile, sit the bright bracket, drip once, sit the warm wood, then leave. "
    "Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. "
    "This is the leftover after Puff. This is the eighth leftover of the fungi den. Others walk a sill. */"
)
HEADER_OLD_TS = "This is the leftover after Mane. This is the seventh leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
HEADER_NEW_TS = (
    "This is the leftover after Mane. This is the seventh leftover of the fungi den. "
    "Flame drips a sash stile as warm wood: walk onto the stile, sit the bright bracket, drip once, sit the warm wood, then leave. "
    "Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. "
    "This is the leftover after Puff. This is the eighth leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

DRIP_FNS = r'''
  function dripPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 9;
    const span = Math.max(0, win.width - size - pad * 2);
    // right sash stile — warm wood for sulfur brackets; not Frill's left timber shelf, not Ring's mid zones, not Auger's bore, not Drum's upper drum stile
    const x = win.x + pad + span * 0.94;
    const timber = Math.max(88, win.height * 0.36);
    const gripY = win.y + timber;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 34, maxLift) };
  }

  function dripFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function dripOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.34) * 0.64;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.22 * (1 - ease) + stride * 0.04,
    };
  }

  function dripPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.17) {
      const s = t / 0.17;
      const ease = s * s * (3 - 2 * s);
      // take the warm wood — bright sulfur shelves; chicken of the woods, not oyster
      return { x: ease * 0.42, lift: ease * 0.48, rot: ease * -6.4 };
    }
    if (t < 0.5) {
      const s = (t - 0.17) / 0.33;
      const wave = Math.sin(s * Math.PI * 1.7);
      // drip once — cascading brackets down the stile; drip is the tell; not Frill shelf, not Fan gold
      return { x: 0.42 + wave * 3.6, lift: 0.48 + Math.abs(wave) * 4.1, rot: -6.4 + wave * 5.2 };
    }
    if (t < 0.8) {
      const s = (t - 0.5) / 0.3;
      const ease = s * s * (3 - 2 * s);
      // settle the cascade — overlapping warm shelves on the grain
      return { x: 0.42 - ease * 0.08, lift: 0.48 - ease * 0.16, rot: -6.4 + ease * 2.6 };
    }
    return { x: 0.34, lift: 0.32, rot: -3.8 };
  }

  function dripHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.075;
    // sit the warm wood; the drip records it
    return { x: 0.34, lift: 0.32 + hush, rot: -3.8 };
  }

  function dripOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.28) * 0.74;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -3.8) * (1 - ease),
    };
  }


'''

JS_TICK = r'''
    if (next.phase === "drip-on") {
      const face = dripFace(target);
      const u = next.t / DUR.dripOn;
      const pose = dripOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "drip", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "drip") {
      const face = dripFace(target);
      const pose = dripPath(Math.min(1, next.t / DUR.drip));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.drip) {
        return goPhase(next, "drip-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "drip-hold") {
      const face = dripFace(target);
      const pose = dripHoldPath(Math.min(1, next.t / DUR.dripHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.dripHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = dripHoldPath(1);
        return goPhase(next, "drip-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "drip-off") {
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

'''

TS_DRIP_FNS = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in DRIP_FNS.splitlines(True)
).replace("function drip", "export function drip")

TS_TICK = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in JS_TICK.splitlines(True)
)

JS_PICK = r'''
    if (kind === DRIP) {
      const hold = dripPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -52 : 52;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 48 : -48;
      return {
        id: best.id,
        kind,
        side: "warmwood",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "dripped",
        spin: "none",
      };
    }

'''

TS_PICK = r'''
  if (kind === DRIP) {
    const hold = dripPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -52 : 52;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 48 : -48;
    return {
      id: best.id,
      kind,
      side: "warmwood",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "dripped",
      spin: "none",
    };
  }

'''

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(t, '  const CLOUD = "cloud";\n  const SILL = "sill";', '  const CLOUD = "cloud";\n  const DRIP = "drip";\n  const SILL = "sill";', "js const")
    t = once(t, "    cloudOff: 2.52,\n    sillHop:", "    cloudOff: 2.52,\n    dripOn: 2.58,\n    drip: 1.97,\n    dripHold: 4.31,\n    dripOff: 2.48,\n    sillHop:", "js dur")
    t = once(t, '    if (key === "puffball") return CLOUD;\n    return SILL;', '    if (key === "puffball") return CLOUD;\n    if (key === "chicken_of_woods") return DRIP;\n    return SILL;', "js playFor")
    t = once(t, "    if (kind === CLOUD) return w.width >= 184 && w.height >= 150;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === CLOUD) return w.width >= 184 && w.height >= 150;\n    if (kind === DRIP) return w.width >= 192 && w.height >= 210;\n    return w.width >= 180 && w.height >= 70;", "js size")
    t = once(t, '''        leave: "clouded",
        spin: "none",
      };
    }


        if (kind === WRAP) {''',
             '''        leave: "clouded",
        spin: "none",
      };
    }
''' + JS_PICK + '''
        if (kind === WRAP) {''', "js pick")
    t = once(t, '''    if (target.kind === CLOUD) {
      const hold = cloudPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
             '''    if (target.kind === CLOUD) {
      const hold = cloudPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === DRIP) {
      const hold = dripPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''', "js refit")
    t = once(t, '''        if (target.kind === CLOUD) {
          return goPhase(next, "cloud-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
             '''        if (target.kind === CLOUD) {
          return goPhase(next, "cloud-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === DRIP) {
          return goPhase(next, "drip-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''', "js approach")
    t = once(t, "  function beginPlay(target, petX) {", DRIP_FNS + "  function beginPlay(target, petX) {", "js fns")
    t = once(t, '''    if (next.phase === "cloud-off") {
      const u = next.t / DUR.cloudOff;
      const pose = cloudOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }


    if (next.phase === "sill-hop") {''',
             '''    if (next.phase === "cloud-off") {
      const u = next.t / DUR.cloudOff;
      const pose = cloudOffPath(Math.min(1, u), next.from, next.to);
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
    t = once(t, "    CLOUD,\n    IGNORE,", "    CLOUD,\n    DRIP,\n    IGNORE,", "js export kind")
    t = once(t, "    cloudOffPath,\n    pickTarget,", "    cloudOffPath,\n    dripPoint,\n    dripFace,\n    dripOnPath,\n    dripPath,\n    dripHoldPath,\n    dripOffPath,\n    pickTarget,", "js export fns")
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(t, 'export const CLOUD = "cloud";\nexport const SILL = "sill";', 'export const CLOUD = "cloud";\nexport const DRIP = "drip";\nexport const SILL = "sill";', "ts const")
    t = once(t, "  cloudOff: 2.52,\n  sillHop:", "  cloudOff: 2.52,\n  dripOn: 2.58,\n  drip: 1.97,\n  dripHold: 4.31,\n  dripOff: 2.48,\n  sillHop:", "ts dur")
    t = once(t, "typeof CLOUD | typeof SILL | typeof IGNORE;", "typeof CLOUD | typeof DRIP | typeof SILL | typeof IGNORE;", "ts kind")
    t = once(t, '  | "cloud-off"\n  | "sill-hop"', '  | "cloud-off"\n  | "drip-on"\n  | "drip"\n  | "drip-hold"\n  | "drip-off"\n  | "sill-hop"', "ts phase")
    t = once(t, '| "woodwound" | "sporedish";', '| "woodwound" | "sporedish" | "warmwood";', "ts side")
    t = once(t, '| "bearded" | "clouded";', '| "bearded" | "clouded" | "dripped";', "ts leave")
    t = once(t, '  if (key === "puffball") return CLOUD;\n  return SILL;', '  if (key === "puffball") return CLOUD;\n  if (key === "chicken_of_woods") return DRIP;\n  return SILL;', "ts playFor")
    t = once(t, "  if (kind === CLOUD) return w.width >= 184 && w.height >= 150;\n    return w.width >= 180 && w.height >= 70;", "  if (kind === CLOUD) return w.width >= 184 && w.height >= 150;\n  if (kind === DRIP) return w.width >= 192 && w.height >= 210;\n    return w.width >= 180 && w.height >= 70;", "ts size")
    t = once(t, '''      leave: "clouded",
      spin: "none",
    };
  }


  if (kind === WRAP) {''',
             '''      leave: "clouded",
      spin: "none",
    };
  }
''' + TS_PICK + '''
  if (kind === WRAP) {''', "ts pick")
    t = once(t, '''  if (target.kind === CLOUD) {
    const hold = cloudPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
             '''  if (target.kind === CLOUD) {
    const hold = cloudPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === DRIP) {
    const hold = dripPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''', "ts refit")
    t = once(t, '''      if (target.kind === CLOUD) {
        return goPhase(next, "cloud-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
             '''      if (target.kind === CLOUD) {
        return goPhase(next, "cloud-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === DRIP) {
        return goPhase(next, "drip-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''', "ts approach")
    t = once(t, "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", TS_DRIP_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", "ts fns")
    t = once(t, '''  if (next.phase === "cloud-off") {
    const u = next.t / DUR.cloudOff;
    const pose = cloudOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }


  if (next.phase === "sill-hop") {''',
             '''  if (next.phase === "cloud-off") {
    const u = next.t / DUR.cloudOff;
    const pose = cloudOffPath(Math.min(1, u), next.from, next.to);
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
print("JS", len(js), "->", len(js2), "delta", len(js2) - len(js))
print("TS", len(ts), "->", len(ts2), "delta", len(ts2) - len(ts))
print("DRIP", 'const DRIP' in js2, "export const DRIP" in ts2)
print("chicken", 'key === "chicken_of_woods") return DRIP' in js2, 'key === "chicken_of_woods") return DRIP' in ts2)
print("warmwood", js2.count("warmwood"), ts2.count("warmwood"))
