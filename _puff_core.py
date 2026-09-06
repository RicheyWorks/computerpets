# -*- coding: utf-8 -*-
"""Apply Puff (puffball) cloud leftover — seventh fungi den window-play."""
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:200]!r}")
    return text.replace(old, new, 1)

HEADER_OLD = "This is the leftover after Ring. This is the sixth leftover of the fungi den. Others walk a sill. */"
HEADER_NEW = (
    "This is the leftover after Ring. This is the sixth leftover of the fungi den. "
    "Puff clouds a window apron as a spore dish: walk onto the apron, sit the soft mound, cloud once, sit the dish, then leave. "
    "Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. "
    "This is the leftover after Mane. This is the seventh leftover of the fungi den. Others walk a sill. */"
)
HEADER_OLD_TS = "This is the leftover after Ring. This is the sixth leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
HEADER_NEW_TS = (
    "This is the leftover after Ring. This is the sixth leftover of the fungi den. "
    "Puff clouds a window apron as a spore dish: walk onto the apron, sit the soft mound, cloud once, sit the dish, then leave. "
    "Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. "
    "This is the leftover after Mane. This is the seventh leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

CLOUD_FNS = r'''
  function cloudPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 42;
    const span = Math.max(0, win.width - size - pad * 2);
    // window apron as spore dish — soft mound right of Cap's moss cup; not Cap warts, not Vault grass plate, not Vee blotter green, not Lula blotter river, not Floss dust tray, not Pebble casement puff
    const x = win.x + pad + span * 0.66;
    const apron = Math.max(28, Math.min(size * 0.16, win.height * 0.072));
    const gripY = win.y + win.height - apron;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 16, maxLift) };
  }

  function cloudFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function cloudOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.18) * 0.55;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.12 * (1 - ease) + stride * 0.03,
    };
  }

  function cloudPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.2) {
      const s = t / 0.2;
      const ease = s * s * (3 - 2 * s);
      // settle the pearl — young cut; an Amanita can hide; soft mound on the dish
      return { x: ease * 0.16, lift: ease * 0.55, rot: ease * -3.2 };
    }
    if (t < 0.55) {
      const s = (t - 0.2) / 0.35;
      const wave = Math.sin(s * Math.PI * 1.9);
      // cloud once — a puff, then a cloud; not Pebble toad puff, not Floss dust
      return { x: 0.16 + wave * 1.85, lift: 0.55 + Math.abs(wave) * 3.4, rot: -3.2 + wave * 4.8 };
    }
    if (t < 0.82) {
      const s = (t - 0.55) / 0.27;
      const ease = s * s * (3 - 2 * s);
      // remain a burst grammar on the dish — pore kept the pearl
      return { x: 0.16 - ease * 0.04, lift: 0.55 - ease * 0.13, rot: -3.2 + ease * 1.4 };
    }
    return { x: 0.12, lift: 0.42, rot: -1.8 };
  }

  function cloudHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.07;
    // sit the spore dish; the cloud records it
    return { x: 0.12, lift: 0.42 + hush, rot: -1.8 };
  }

  function cloudOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.22) * 0.7;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -1.8) * (1 - ease),
    };
  }


'''

JS_TICK = r'''
    if (next.phase === "cloud-on") {
      const face = cloudFace(target);
      const u = next.t / DUR.cloudOn;
      const pose = cloudOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "cloud", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "cloud") {
      const face = cloudFace(target);
      const pose = cloudPath(Math.min(1, next.t / DUR.cloud));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.cloud) {
        return goPhase(next, "cloud-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "cloud-hold") {
      const face = cloudFace(target);
      const pose = cloudHoldPath(Math.min(1, next.t / DUR.cloudHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.cloudHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = cloudHoldPath(1);
        return goPhase(next, "cloud-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "cloud-off") {
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

'''

TS_CLOUD_FNS = CLOUD_FNS.replace("function ", "export function ").replace("  export function", "export function")
# CLOUD_FNS uses 2-space indent inside IIFE; TS uses no leading indent on export function
TS_CLOUD_FNS = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in CLOUD_FNS.splitlines(True)
).replace("function cloud", "export function cloud")

TS_TICK = "\n".join(
    (line[2:] if line.startswith("  ") else line) for line in JS_TICK.splitlines(True)
)

JS_PICK = r'''
    if (kind === CLOUD) {
      const hold = cloudPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -52 : 52;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 48 : -48;
      return {
        id: best.id,
        kind,
        side: "sporedish",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "clouded",
        spin: "none",
      };
    }

'''

TS_PICK = r'''
  if (kind === CLOUD) {
    const hold = cloudPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -52 : 52;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 48 : -48;
    return {
      id: best.id,
      kind,
      side: "sporedish",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "clouded",
      spin: "none",
    };
  }

'''

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(t, '  const TEETH = "teeth";\n  const SILL = "sill";', '  const TEETH = "teeth";\n  const CLOUD = "cloud";\n  const SILL = "sill";', "js const")
    t = once(t, "    teethOff: 2.49,\n    sillHop:", "    teethOff: 2.49,\n    cloudOn: 2.61,\n    cloud: 1.94,\n    cloudHold: 4.24,\n    cloudOff: 2.52,\n    sillHop:", "js dur")
    t = once(t, '    if (key === "lions_mane") return TEETH;\n    return SILL;', '    if (key === "lions_mane") return TEETH;\n    if (key === "puffball") return CLOUD;\n    return SILL;', "js playFor")
    t = once(t, "    if (kind === TEETH) return w.width >= 186 && w.height >= 196;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === TEETH) return w.width >= 186 && w.height >= 196;\n    if (kind === CLOUD) return w.width >= 184 && w.height >= 150;\n    return w.width >= 180 && w.height >= 70;", "js size")
    t = once(t, '''        leave: "bearded",
        spin: "none",
      };
    }


        if (kind === WRAP) {''',
             '''        leave: "bearded",
        spin: "none",
      };
    }
''' + JS_PICK + '''
        if (kind === WRAP) {''', "js pick")
    t = once(t, '''    if (target.kind === TEETH) {
      const hold = teethPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
             '''    if (target.kind === TEETH) {
      const hold = teethPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === CLOUD) {
      const hold = cloudPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''', "js refit")
    t = once(t, '''        if (target.kind === TEETH) {
          return goPhase(next, "teeth-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
             '''        if (target.kind === TEETH) {
          return goPhase(next, "teeth-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === CLOUD) {
          return goPhase(next, "cloud-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''', "js approach")
    t = once(t, "  function beginPlay(target, petX) {", CLOUD_FNS + "  function beginPlay(target, petX) {", "js fns")
    t = once(t, '''    if (next.phase === "teeth-off") {
      const u = next.t / DUR.teethOff;
      const pose = teethOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "sill-hop") {''',
             '''    if (next.phase === "teeth-off") {
      const u = next.t / DUR.teethOff;
      const pose = teethOffPath(Math.min(1, u), next.from, next.to);
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
    t = once(t, "    TEETH,\n    IGNORE,", "    TEETH,\n    CLOUD,\n    IGNORE,", "js export kind")
    t = once(t, "    teethOffPath,\n    pickTarget,", "    teethOffPath,\n    cloudPoint,\n    cloudFace,\n    cloudOnPath,\n    cloudPath,\n    cloudHoldPath,\n    cloudOffPath,\n    pickTarget,", "js export fns")
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(t, 'export const TEETH = "teeth";\nexport const SILL = "sill";', 'export const TEETH = "teeth";\nexport const CLOUD = "cloud";\nexport const SILL = "sill";', "ts const")
    t = once(t, "  teethOff: 2.49,\n  sillHop:", "  teethOff: 2.49,\n  cloudOn: 2.61,\n  cloud: 1.94,\n  cloudHold: 4.24,\n  cloudOff: 2.52,\n  sillHop:", "ts dur")
    t = once(t, "typeof TEETH | typeof SILL | typeof IGNORE;", "typeof TEETH | typeof CLOUD | typeof SILL | typeof IGNORE;", "ts kind")
    t = once(t, '  | "teeth-off"\n  | "sill-hop"', '  | "teeth-off"\n  | "cloud-on"\n  | "cloud"\n  | "cloud-hold"\n  | "cloud-off"\n  | "sill-hop"', "ts phase")
    t = once(t, '| "woodgrain" | "woodwound";', '| "woodgrain" | "woodwound" | "sporedish";', "ts side")
    t = once(t, '| "zoned" | "bearded";', '| "zoned" | "bearded" | "clouded";', "ts leave")
    t = once(t, '  if (key === "lions_mane") return TEETH;\n  return SILL;', '  if (key === "lions_mane") return TEETH;\n  if (key === "puffball") return CLOUD;\n  return SILL;', "ts playFor")
    t = once(t, "  if (kind === TEETH) return w.width >= 186 && w.height >= 196;\n    return w.width >= 180 && w.height >= 70;", "  if (kind === TEETH) return w.width >= 186 && w.height >= 196;\n  if (kind === CLOUD) return w.width >= 184 && w.height >= 150;\n    return w.width >= 180 && w.height >= 70;", "ts size")
    t = once(t, '''      leave: "bearded",
      spin: "none",
    };
  }


  if (kind === WRAP) {''',
             '''      leave: "bearded",
      spin: "none",
    };
  }
''' + TS_PICK + '''
  if (kind === WRAP) {''', "ts pick")
    t = once(t, '''  if (target.kind === TEETH) {
    const hold = teethPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
             '''  if (target.kind === TEETH) {
    const hold = teethPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === CLOUD) {
    const hold = cloudPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''', "ts refit")
    t = once(t, '''      if (target.kind === TEETH) {
        return goPhase(next, "teeth-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
             '''      if (target.kind === TEETH) {
        return goPhase(next, "teeth-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === CLOUD) {
        return goPhase(next, "cloud-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''', "ts approach")
    t = once(t, "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", TS_CLOUD_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {", "ts fns")
    t = once(t, '''  if (next.phase === "teeth-off") {
    const u = next.t / DUR.teethOff;
    const pose = teethOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "sill-hop") {''',
             '''  if (next.phase === "teeth-off") {
    const u = next.t / DUR.teethOff;
    const pose = teethOffPath(Math.min(1, u), next.from, next.to);
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
print("CLOUD", 'const CLOUD' in js2, "export const CLOUD" in ts2)
print("puffball", 'key === "puffball") return CLOUD' in js2, 'key === "puffball") return CLOUD' in ts2)
print("sporedish", js2.count("sporedish"), ts2.count("sporedish"))
