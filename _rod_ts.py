# -*- coding: utf-8 -*-
from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

ROD_HEADER = (
    "Rod tumbles a sill pan as a broth cup: walk onto the pan, sit the tumble, then leave. "
    "Bell still owns trumpet. Spin still owns two. Hold still owns holdfast. "
    "Starter still owns bloom. Gale still owns run. "
    "This is the leftover after Bell. This is the ninth leftover of the well den. "
    "Next leftover is Rose. Others walk a sill."
)
OLD_NEXT = "Next leftover is Rod. Others walk a sill."

TUMBLE_FNS = '''
export function tumblePoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 48;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.42;
  // sill pan as a broth cup — sit the tumble on the pan; she tumbles, she does not run/bloom/trumpet/two/holdfast; tumble is the tell
  // not Gale dry-dish run, not Starter yeast-film bloom, not Bell trumpet-rim trumpet, not Spin wet-plate two, not Hold cold-hold holdfast, not Orb green-bowl sphere, not Well bog-cup fill
  const pan = Math.max(68, size * 0.38);
  const gripY = win.y + win.height - pan;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 28, maxLift) };
}

export function tumbleFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function tumbleOnPath(u: number, from: PlayPoint, to: PlayPoint) {
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
    rot: (toX >= fromX ? 1 : -1) * 3.22 * (1 - ease) + stride * 0.08,
  };
}

export function tumblePath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.28) {
    const s = t / 0.28;
    const ease = s * s * (3 - 2 * s);
    // walk onto the pan — take the broth cup; the tumble; not Gale run, not Starter bloom, not Bell trumpet
    return { x: ease * 0.28, lift: ease * 1.8, rot: ease * 5.6 };
  }
  if (t < 0.72) {
    const s = (t - 0.28) / 0.44;
    // sit the tumble once — reverse / reorient (chemotaxis); she tumbles, she does not run/bloom/trumpet; tumble is the tell
    const flare = Math.sin(s * Math.PI);
    return { x: 0.28 + flare * 1.05, lift: 1.8 + flare * 0.85, rot: 5.6 + s * 26 };
  }
  if (t < 0.90) {
    const s = (t - 0.72) / 0.18;
    const ease = s * s * (3 - 2 * s);
    // remain a rod / review the broth
    return { x: 0.28 + ease * 0.08, lift: 1.8 + ease * 0.28, rot: 5.6 + ease * 7.0 };
  }
  return { x: 0.36, lift: 2.08, rot: 12.6 };
}

export function tumbleHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.34;
  // sit the tumble on the sill pan as a broth cup; she tumbles, she does not run
  return { x: 0.36, lift: 2.08 + hush, rot: 12.6 };
}

export function tumbleOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.48) * 1.76;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : 12.6) * (1 - ease),
  };
}

'''

TUMBLE_PHASES = '''
  if (next.phase === "tumble-on") {
    const face = tumbleFace(target);
    const u = next.t / DUR.tumbleOn;
    const pose = tumbleOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "tumble", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "tumble") {
    const face = tumbleFace(target);
    const pose = tumblePath(Math.min(1, next.t / DUR.tumble));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.tumble) {
      return goPhase(next, "tumble-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "tumble-hold") {
    const face = tumbleFace(target);
    const pose = tumbleHoldPath(Math.min(1, next.t / DUR.tumbleHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.tumbleHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = tumbleHoldPath(1);
      return goPhase(next, "tumble-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "tumble-off") {
    const u = next.t / DUR.tumbleOff;
    const pose = tumbleOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }
'''

PICK = '''  if (kind === TUMBLE) {
    const hold = tumblePoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -66 : 66;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 60 : -60;
    return {
      id: best.id,
      kind,
      side: "brothcup",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "tumbled",
      spin: "none",
    };
  }
'''

path = ROOT / "web/src/lib/pets/window-play.ts"
text = path.read_text(encoding="utf-8")
assert "TUMBLE" not in text

assert OLD_NEXT in text
text = text.replace(OLD_NEXT, ROD_HEADER, 1)

old = 'export const TRUMPET = "trumpet";\n'
new = 'export const TRUMPET = "trumpet";\nexport const TUMBLE = "tumble";\n'
assert old in text
text = text.replace(old, new, 1)

old = "  trumpetOff: 3.14,\n"
new = "  trumpetOff: 3.14,\n  tumbleOn: 3.18,\n  tumble: 2.96,\n  tumbleHold: 5.72,\n  tumbleOff: 3.08,\n"
assert old in text
text = text.replace(old, new, 1)

old = '  if (key === "stentor") return TRUMPET;\n'
new = '  if (key === "stentor") return TRUMPET;\n  if (key === "coli") return TUMBLE;\n'
assert old in text
text = text.replace(old, new, 1)

old = "  if (kind === TRUMPET) return w.width >= 184 && w.height >= 178;\n"
new = "  if (kind === TRUMPET) return w.width >= 184 && w.height >= 178;\n  if (kind === TUMBLE) return w.width >= 192 && w.height >= 186;\n"
assert old in text
text = text.replace(old, new, 1)

old = "typeof TRUMPET | typeof SILL | typeof IGNORE;"
new = "typeof TRUMPET | typeof TUMBLE | typeof SILL | typeof IGNORE;"
assert old in text
text = text.replace(old, new, 1)

old = '| "trumpetrim";'
new = '| "trumpetrim" | "brothcup";'
assert old in text
text = text.replace(old, new, 1)

old = '| "trumpeted";'
new = '| "trumpeted" | "tumbled";'
assert old in text
text = text.replace(old, new, 1)

old = '| "trumpet-off"\n  | "sill-hop"'
new = '| "trumpet-off"\n  | "tumble-on"\n  | "tumble"\n  | "tumble-hold"\n  | "tumble-off"\n  | "sill-hop"'
assert old in text
text = text.replace(old, new, 1)

marker = '      leave: "trumpeted",\n      spin: "none",\n    };\n  }\n'
assert marker in text
text = text.replace(marker, marker + PICK, 1)

marker = (
    "  if (target.kind === TRUMPET) {\n"
    "    const hold = trumpetPoint(win, sprite, work);\n"
    "    return { ...target, holdX: hold.x, holdLift: hold.lift };\n"
    "  }\n"
)
refit = (
    "  if (target.kind === TUMBLE) {\n"
    "    const hold = tumblePoint(win, sprite, work);\n"
    "    return { ...target, holdX: hold.x, holdLift: hold.lift };\n"
    "  }\n"
)
assert marker in text
text = text.replace(marker, marker + refit, 1)

# insert functions before beginPlay after trumpetOffPath
marker = "\nexport function beginPlay("
i = text.find("export function trumpetOffPath")
assert i >= 0
j = text.find(marker, i)
assert j > i
text = text[:j] + "\n" + TUMBLE_FNS + text[j:]

approach_marker = (
    '      if (target.kind === TRUMPET) {\n'
    '        return goPhase(next, "trumpet-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
    '      }\n'
)
approach = (
    '      if (target.kind === TUMBLE) {\n'
    '        return goPhase(next, "tumble-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
    '      }\n'
)
assert approach_marker in text
text = text.replace(approach_marker, approach_marker + approach, 1)

# phases before sill-hop after trumpet-off
idx = text.find('next.phase === "trumpet-off")')
assert idx > 0
sill = text.find('  if (next.phase === "sill-hop") {', idx)
assert sill > idx
text = text[:sill] + TUMBLE_PHASES + "\n" + text[sill:]

path.write_text(text, encoding="utf-8", newline="\n")
print("TS patched", "tumblePoint" in text, 'coli") return TUMBLE' in text)
