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

def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit("MISSING: " + label)
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

HEADER = (
    "Brood emerges a window foot as a soil husk: walk onto the foot, sit, burst, sit the husk, then leave. "
    "Heap still owns castings. Hop still owns spring. Lid still owns shut. Prowl still owns carry. "
    "Fold still owns pray. Seven still owns spot. Drum still owns drum. Hum still owns drone. Thrum still owns forage. "
    "This is the tenth leftover of the remaining hive den and closes hive ten."
)
HEADER_NEW = HEADER + (
    " Chirp songs a window stool as a grass dish: walk onto the stool, sit the song, hold the night, then leave. "
    "Brood still owns emerge. Gecko still owns chirp. Swing still owns sing. Drum still owns drum. Hum still owns drone. Thrum still owns forage. "
    "This is the first leftover of the meadow den."
)

ts, nl = load("web/src/lib/pets/window-play.ts")
ts = must_replace(ts, HEADER, HEADER_NEW, "ts header")
ts = must_replace(
    ts,
    'export const EMERGE = "emerge";\nexport const SILL = "sill";',
    'export const EMERGE = "emerge";\nexport const SONG = "song";\nexport const SILL = "sill";',
    "ts SONG const",
)
ts = must_replace(
    ts,
    "  emergeOff: 2.51,\n  sillHop: 0.38,",
    "  emergeOff: 2.51,\n  songOn: 2.88,\n  song: 2.16,\n  songHold: 3.52,\n  songOff: 2.34,\n  sillHop: 0.38,",
    "ts DUR",
)
ts = must_replace(
    ts,
    '  if (key === "cicada") return EMERGE;\n  return SILL;',
    '  if (key === "cicada") return EMERGE;\n  if (key === "field_cricket") return SONG;\n  return SILL;',
    "ts playFor",
)
ts = must_replace(
    ts,
    "    if (kind === EMERGE) return w.width >= 168 && w.height >= 74;\n    return w.width >= 180 && w.height >= 70;",
    "    if (kind === EMERGE) return w.width >= 168 && w.height >= 74;\n    if (kind === SONG) return w.width >= 190 && w.height >= 156;\n    return w.width >= 180 && w.height >= 70;",
    "ts size gate",
)
ts = must_replace(
    ts,
    "typeof PRAY | typeof EMERGE | typeof SILL | typeof IGNORE",
    "typeof PRAY | typeof EMERGE | typeof SONG | typeof SILL | typeof IGNORE",
    "ts WindowPlayKind",
)
ts = must_replace(
    ts,
    '  | "emerge-off"\n  | "sill-hop"',
    '  | "emerge-off"\n  | "song-on"\n  | "song"\n  | "song-hold"\n  | "song-off"\n  | "sill-hop"',
    "ts PlayPhase",
)
ts = must_replace(ts, '"greenhinge" | "soilhusk"', '"greenhinge" | "soilhusk" | "grassdish"', "ts side")
ts = must_replace(ts, '"prayed" | "emerged"', '"prayed" | "emerged" | "sung"', "ts leave")
ts = must_replace(
    ts,
    '      leave: "emerged",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {',
    '      leave: "emerged",\n      spin: "none",\n    };\n  }\n\n  if (kind === SONG) {\n    const hold = songPoint(best, size, work);\n    const approachOff = hold.x < workW / 2 ? -44 : 44;\n    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n    const away = hold.x < workW / 2 ? 38 : -38;\n    return {\n      id: best.id,\n      kind,\n      side: "grassdish",\n      holdX: hold.x,\n      holdLift: hold.lift,\n      approachX,\n      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n      leave: "sung",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {',
    "ts pickTarget",
)
ts = must_replace(
    ts,
    "  if (target.kind === EMERGE) {\n    const hold = emergePoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
    "  if (target.kind === EMERGE) {\n    const hold = emergePoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === SONG) {\n    const hold = songPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
    "ts refit",
)
ts = must_replace(
    ts,
    '      if (target.kind === EMERGE) {\n        return goPhase(next, "emerge-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    '      if (target.kind === EMERGE) {\n        return goPhase(next, "emerge-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === SONG) {\n        return goPhase(next, "song-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    "ts approach",
)

SONG_FUNCS_TS = """
export function songPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 30;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.41;
  const stool = Math.max(16, size * 0.10);
  const gripY = win.y + win.height - stool;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 18, maxLift - 8) };
}

export function songFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function songOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.05) * 1.05;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 2.15 * (1 - ease) + stride * 0.09,
  };
}

export function songPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.28) {
    const s = t / 0.28;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.15, lift: ease * 0.55, rot: ease * -3.2 };
  }
  if (t < 0.78) {
    const s = (t - 0.28) / 0.50;
    const pulse = Math.sin(s * Math.PI * 3.2) * 2.4;
    const ease = s * s * (3 - 2 * s);
    return { x: 0.15 + ease * 0.12 + pulse * 0.08, lift: 0.55 + ease * 0.35 + Math.abs(pulse) * 0.12, rot: -3.2 + ease * 8.6 + pulse };
  }
  return { x: 0.27, lift: 0.9, rot: 5.4 };
}

export function songHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const night = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.4) * 1.15;
  return { x: 0.27 + night * 0.04, lift: 0.9 + Math.abs(night) * 0.08, rot: 5.4 + night };
}

export function songOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.82) * 1.18;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : 5.4) * (1 - ease),
  };
}


"""

ts = must_replace(
    ts,
    "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
    SONG_FUNCS_TS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
    "ts song funcs",
)

TICK_TS = """
  if (next.phase === "song-on") {
    const face = songFace(target);
    const u = next.t / DUR.songOn;
    const pose = songOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "song", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "song") {
    const face = songFace(target);
    const pose = songPath(Math.min(1, next.t / DUR.song));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.song) {
      return goPhase(next, "song-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "song-hold") {
    const face = songFace(target);
    const pose = songHoldPath(Math.min(1, next.t / DUR.songHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.songHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = songHoldPath(1);
      return goPhase(next, "song-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "song-off") {
    const u = next.t / DUR.songOff;
    const pose = songOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

"""

ts = must_replace(ts, '  if (next.phase === "sill-hop") {', TICK_TS + '  if (next.phase === "sill-hop") {', "ts tick")
save("web/src/lib/pets/window-play.ts", ts, nl)
print("ts ok")
