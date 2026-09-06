# -*- coding: utf-8 -*-
"""Apply Cap warts leftover to window-play.ts (lockstep with JS)."""
from pathlib import Path

def load(p):
    raw = Path(p).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text, nl

def save(p, text, nl):
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(p).write_bytes(text.encode("utf-8"))

def mr(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s count=%s" % (label, n))
    return text.replace(old, new, 1)

HEADER_OLD = (
    " Frill shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave. "
    "Rob still owns seize. Fan still owns gold. Felt still owns lean. Cape still owns fold. Mast still owns seed. Auger still owns bore. Vein still owns unfurl. "
    "This is the first leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

HEADER_NEW = (
    " Frill shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave. "
    "Rob still owns seize. Fan still owns gold. Felt still owns lean. Cape still owns fold. Mast still owns seed. Auger still owns bore. Vein still owns unfurl. "
    "This is the first leftover of the fungi den. "
    "Cap warts a window apron as a moss cup: walk onto the apron, sit, wart once, sit the cup, then leave. "
    "Frill still owns shelf. Seven still owns spot. Sepia still owns flush. Rob still owns seize. Slip still owns ring. "
    "This is the second leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

WARTS_FNS = r'''
export function wartsPoint(win: WindowBounds, sprite = SPRITE, work?: WorkSpace): PlayPoint {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 34;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.38;
  const apron = Math.max(24, Math.min(size * 0.14, win.height * 0.065));
  const gripY = win.y + win.height - apron;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 16, maxLift) };
}

export function wartsFace(target: PlayTarget): number {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function wartsOnPath(u: number, from: PlayPoint, to: PlayPoint): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.38) * 0.68;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 1.28 * (1 - ease) + stride * 0.04,
  };
}

export function wartsPath(u: number): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.18) {
    const s = t / 0.18;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.35, lift: ease * 1.15, rot: ease * -5.4 };
  }
  if (t < 0.52) {
    const s = (t - 0.18) / 0.34;
    const wave = Math.sin(s * Math.PI * 2.15);
    return { x: 0.35 + wave * 2.4, lift: 1.15 + Math.abs(wave) * 2.85, rot: -5.4 + wave * 3.6 };
  }
  if (t < 0.78) {
    const s = (t - 0.52) / 0.26;
    const ease = s * s * (3 - 2 * s);
    return { x: 0.35 - ease * 0.12, lift: 1.15 - ease * 0.48, rot: -5.4 + ease * 2.8 };
  }
  return { x: 0.23, lift: 0.67, rot: -2.6 };
}

export function wartsHoldPath(u: number): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.08;
  return { x: 0.23, lift: 0.67 + hush, rot: -2.6 };
}

export function wartsOffPath(u: number, from: PlayPoint & { rot?: number }, to: PlayPoint): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.32) * 0.82;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : -2.6) * (1 - ease),
  };
}

'''

WARTS_PHASES = r'''
  if (next.phase === "warts-on") {
    const face = wartsFace(target);
    const u = next.t / DUR.wartsOn;
    const pose = wartsOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "warts", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "warts") {
    const face = wartsFace(target);
    const pose = wartsPath(Math.min(1, next.t / DUR.warts));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.warts) {
      return goPhase(next, "warts-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "warts-hold") {
    const face = wartsFace(target);
    const pose = wartsHoldPath(Math.min(1, next.t / DUR.wartsHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.wartsHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = wartsHoldPath(1);
      return goPhase(next, "warts-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "warts-off") {
    const u = next.t / DUR.wartsOff;
    const pose = wartsOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }
'''

text, nl = load("web/src/lib/pets/window-play.ts")
text = mr(text, HEADER_OLD, HEADER_NEW, "header")
text = mr(
    text,
    'export const SHELF = "shelf";\nexport const SILL = "sill";',
    'export const SHELF = "shelf";\nexport const WARTS = "warts";\nexport const SILL = "sill";',
    "const",
)
text = mr(
    text,
    'typeof RIGHT | typeof SEIZE | typeof SHELF | typeof SILL | typeof IGNORE;',
    'typeof RIGHT | typeof SEIZE | typeof SHELF | typeof WARTS | typeof SILL | typeof IGNORE;',
    "PlayKind",
)
text = mr(
    text,
    '  | "shelf-on"\n  | "shelf"\n  | "shelf-hold"\n  | "shelf-off"\n  | "sill-hop"',
    '  | "shelf-on"\n  | "shelf"\n  | "shelf-hold"\n  | "shelf-off"\n  | "warts-on"\n  | "warts"\n  | "warts-hold"\n  | "warts-off"\n  | "sill-hop"',
    "PlayPhase",
)
text = mr(
    text,
    "  shelfOn: 2.72,\n  shelf: 2.05,\n  shelfHold: 4.35,\n  shelfOff: 2.62,",
    "  shelfOn: 2.72,\n  shelf: 2.05,\n  shelfHold: 4.35,\n  shelfOff: 2.62,\n  wartsOn: 2.64,\n  warts: 1.88,\n  wartsHold: 4.18,\n  wartsOff: 2.55,",
    "DUR",
)
text = mr(
    text,
    '  if (key === "oyster") return SHELF;\n  return SILL;',
    '  if (key === "oyster") return SHELF;\n  if (key === "fly_agaric") return WARTS;\n  return SILL;',
    "playFor",
)
text = mr(
    text,
    "  if (kind === SHELF) return w.width >= 188 && w.height >= 204;",
    "  if (kind === SHELF) return w.width >= 188 && w.height >= 204;\n  if (kind === WARTS) return w.width >= 186 && w.height >= 148;",
    "gate",
)

shelf_pick = '''  if (kind === SHELF) {
    const hold = shelfPoint(best, size, work);
    const approachOff = hold.x < workW / 2 ? -28 : 28;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 32 : -32;
    return {
      id: best.id,
      kind,
      side: "timbershelf",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "shelved",
      spin: "none",
    };
  }'''
warts_pick = shelf_pick + '''

  if (kind === WARTS) {
    const hold = wartsPoint(best, size, work);
    const approachOff = hold.x < workW / 2 ? -30 : 30;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 30 : -30;
    return {
      id: best.id,
      kind,
      side: "mosscup",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "warted",
      spin: "none",
    };
  }'''
text = mr(text, shelf_pick, warts_pick, "pick")

shelf_refit = '''  if (target.kind === SHELF) {
    const hold = shelfPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }'''
warts_refit = shelf_refit + '''

  if (target.kind === WARTS) {
    const hold = wartsPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }'''
text = mr(text, shelf_refit, warts_refit, "refit")

text = mr(
    text,
    "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
    WARTS_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
    "fns",
)

shelf_approach = '''      if (target.kind === SHELF) {
        return goPhase(next, "shelf-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }'''
warts_approach = shelf_approach + '''

      if (target.kind === WARTS) {
        return goPhase(next, "warts-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }'''
text = mr(text, shelf_approach, warts_approach, "approach")

shelf_off = '''  if (next.phase === "shelf-off") {
    const u = next.t / DUR.shelfOff;
    const pose = shelfOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }'''
text = mr(text, shelf_off, shelf_off + "\n" + WARTS_PHASES, "phases")

if "timbershelf" not in text.split("export type PlayTarget")[1][:2500]:
    text = mr(text, '| "grassperch"', '| "grassperch" | "timbershelf" | "mosscup"', "side union")
elif "mosscup" not in text:
    if '| "grassperch" | "timbershelf"' in text:
        text = mr(text, '| "grassperch" | "timbershelf"', '| "grassperch" | "timbershelf" | "mosscup"', "side union mosscup")
    else:
        text = mr(text, '| "grassperch"', '| "grassperch" | "mosscup"', "side union mosscup only")

if '"shelved"' not in text.split("leave?:")[1][:1800]:
    text = mr(text, '| "laced" | "seized"', '| "laced" | "seized" | "shelved" | "warted"', "leave union")
elif '"warted"' not in text:
    text = mr(text, '| "laced" | "seized"', '| "laced" | "seized" | "warted"', "leave union warted")

save("web/src/lib/pets/window-play.ts", text, nl)
print("ok ts")
