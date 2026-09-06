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
    "Chirp songs a window stool as a grass dish: walk onto the stool, sit the song, hold the night, then leave. "
    "Brood still owns emerge. Gecko still owns chirp. Swing still owns sing. Drum still owns drum. Hum still owns drone. Thrum still owns forage. "
    "This is the first leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Blade leafs a sash horn as a leaf rim: walk onto the horn, sit the leaf, still the green, then leave. "
    "Chirp still owns song. Twig still owns freeze. Seven still owns spot. Fold still owns pray. Disc still owns snip. Vein still owns unfurl. Grin still owns still. "
    "This is the second leftover of the meadow den."
)

ts, nl = load("web/src/lib/pets/window-play.ts")
ts = must_replace(ts, HEADER, HEADER_NEW, "ts header")
ts = must_replace(
    ts,
    'export const SONG = "song";\nexport const SILL = "sill";',
    'export const SONG = "song";\nexport const LEAF = "leaf";\nexport const SILL = "sill";',
    "ts LEAF const",
)
ts = must_replace(
    ts,
    "  songOff: 2.34,\n  sillHop: 0.38,",
    "  songOff: 2.34,\n  leafOn: 2.72,\n  leaf: 2.28,\n  leafHold: 3.96,\n  leafOff: 2.41,\n  sillHop: 0.38,",
    "ts DUR",
)
ts = must_replace(
    ts,
    '  if (key === "field_cricket") return SONG;\n  return SILL;',
    '  if (key === "field_cricket") return SONG;\n  if (key === "katydid") return LEAF;\n  return SILL;',
    "ts playFor",
)
ts = must_replace(
    ts,
    "    if (kind === SONG) return w.width >= 190 && w.height >= 156;\n    return w.width >= 180 && w.height >= 70;",
    "    if (kind === SONG) return w.width >= 190 && w.height >= 156;\n    if (kind === LEAF) return w.width >= 184 && w.height >= 148;\n    return w.width >= 180 && w.height >= 70;",
    "ts size gate",
)
ts = must_replace(
    ts,
    "typeof PRAY | typeof EMERGE | typeof SONG | typeof SILL | typeof IGNORE",
    "typeof PRAY | typeof EMERGE | typeof SONG | typeof LEAF | typeof SILL | typeof IGNORE",
    "ts WindowPlayKind",
)
ts = must_replace(
    ts,
    '  | "song-off"\n  | "sill-hop"',
    '  | "song-off"\n  | "leaf-on"\n  | "leaf"\n  | "leaf-hold"\n  | "leaf-off"\n  | "sill-hop"',
    "ts PlayPhase",
)
ts = must_replace(ts, '"greenhinge" | "soilhusk" | "grassdish"', '"greenhinge" | "soilhusk" | "grassdish" | "leafrim"', "ts side")
ts = must_replace(ts, '"prayed" | "emerged" | "sung"', '"prayed" | "emerged" | "sung" | "leafed"', "ts leave")
ts = must_replace(
    ts,
    '      leave: "sung",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {',
    '      leave: "sung",\n      spin: "none",\n    };\n  }\n\n  if (kind === LEAF) {\n    const hold = leafPoint(best, size, work);\n    const approachOff = hold.x < workW / 2 ? -42 : 42;\n    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n    const away = hold.x < workW / 2 ? 36 : -36;\n    return {\n      id: best.id,\n      kind,\n      side: "leafrim",\n      holdX: hold.x,\n      holdLift: hold.lift,\n      approachX,\n      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n      leave: "leafed",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {',
    "ts pickTarget",
)
ts = must_replace(
    ts,
    "  if (target.kind === SONG) {\n    const hold = songPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
    "  if (target.kind === SONG) {\n    const hold = songPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === LEAF) {\n    const hold = leafPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
    "ts refit",
)
ts = must_replace(
    ts,
    '      if (target.kind === SONG) {\n        return goPhase(next, "song-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    '      if (target.kind === SONG) {\n        return goPhase(next, "song-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === LEAF) {\n        return goPhase(next, "leaf-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    "ts approach",
)

LEAF_FUNCS_TS = """
export function leafPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 26;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.62;
  const horn = Math.max(88, win.height * 0.36);
  const gripY = win.y + win.height - horn;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 24, maxLift - 6) };
}

export function leafFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function leafOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.88) * 1.22;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 2.28 * (1 - ease) + stride * 0.07,
  };
}

export function leafPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.34) {
    const s = t / 0.34;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.22, lift: ease * 1.15, rot: ease * -6.4 };
  }
  if (t < 0.72) {
    const s = (t - 0.34) / 0.38;
    const ease = s * s * (3 - 2 * s);
    return { x: 0.22 - ease * 0.08, lift: 1.15 - ease * 0.35, rot: -6.4 + ease * -2.8 };
  }
  return { x: 0.14, lift: 0.8, rot: -9.2 };
}

export function leafHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const still = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.06;
  return { x: 0.14, lift: 0.8 + still, rot: -9.2 };
}

export function leafOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.74) * 1.28;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : -9.2) * (1 - ease),
  };
}


"""

ts = must_replace(
    ts,
    "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
    LEAF_FUNCS_TS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
    "ts leaf funcs",
)

TICK_TS = """
  if (next.phase === "leaf-on") {
    const face = leafFace(target);
    const u = next.t / DUR.leafOn;
    const pose = leafOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "leaf", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "leaf") {
    const face = leafFace(target);
    const pose = leafPath(Math.min(1, next.t / DUR.leaf));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.leaf) {
      return goPhase(next, "leaf-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "leaf-hold") {
    const face = leafFace(target);
    const pose = leafHoldPath(Math.min(1, next.t / DUR.leafHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.leafHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = leafHoldPath(1);
      return goPhase(next, "leaf-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "leaf-off") {
    const u = next.t / DUR.leafOff;
    const pose = leafOffPath(Math.min(1, u), next.from, next.to);
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
