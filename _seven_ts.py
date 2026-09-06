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
    "Column nests a sash stile as a timber gallery: walk onto the stile, sit the nest, then leave. "
    "Auger still owns bore. Dam still owns gnaw. Bank still owns dig. Twig still owns freeze. Dart still owns hawk. "
    "This is the seventh leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Seven spots a window-box leaf as a leaf dish: walk onto the leaf, sit the spot, then leave. "
    "Haste still owns hunt. Disc still owns snip. Thrum still owns forage. Sip still owns sip. Comb still owns waggle. "
    "This is the eighth leftover of the remaining hive den."
)

ts, nl = load("web/src/lib/pets/window-play.ts")
ts = must_replace(ts, HEADER, HEADER_NEW, "ts header")
ts = must_replace(
    ts,
    'export const NEST = "nest";\nexport const SILL = "sill";',
    'export const NEST = "nest";\nexport const SPOT = "spot";\nexport const SILL = "sill";',
    "ts SPOT const",
)
ts = must_replace(
    ts,
    "  nestOff: 2.18,\n  sillHop: 0.38,",
    "  nestOff: 2.18,\n  spotOn: 3.12,\n  spot: 2.44,\n  spotHold: 3.78,\n  spotOff: 2.28,\n  sillHop: 0.38,",
    "ts DUR",
)
ts = must_replace(
    ts,
    '  if (key === "carpenter_ant") return NEST;\n  return SILL;',
    '  if (key === "carpenter_ant") return NEST;\n  if (key === "ladybird") return SPOT;\n  return SILL;',
    "ts playFor",
)
ts = must_replace(
    ts,
    "    if (kind === NEST) return w.width >= 188 && w.height >= 200;\n    return w.width >= 180 && w.height >= 70;",
    "    if (kind === NEST) return w.width >= 188 && w.height >= 200;\n    if (kind === SPOT) return w.width >= 186 && w.height >= 170;\n    return w.width >= 180 && w.height >= 70;",
    "ts size gate",
)
ts = must_replace(
    ts,
    "typeof FREEZE | typeof NEST | typeof SILL | typeof IGNORE",
    "typeof FREEZE | typeof NEST | typeof SPOT | typeof SILL | typeof IGNORE",
    "ts WindowPlayKind",
)
ts = must_replace(
    ts,
    '  | "nest-off"\n  | "sill-hop"',
    '  | "nest-off"\n  | "spot-on"\n  | "spot"\n  | "spot-hold"\n  | "spot-off"\n  | "sill-hop"',
    "ts PlayPhase",
)
ts = must_replace(ts, '"pencilstem" | "timbergallery"', '"pencilstem" | "timbergallery" | "leafdish"', "ts side")
# leafdish may already be in the union earlier - check if double
if ts.count('| "leafdish"') > 1 or '"leafdish" | "leafdish"' in ts or 'timbergallery" | "leafdish"' in ts and '"leafdish"' in ts.split("side:")[1].split(";")[0] and ts.split("side:")[1].split(";")[0].count('"leafdish"') > 1:
    # fix duplicate if we created one - leafdish already exists in union
    pass
ts = must_replace(ts, '"froze" | "nested"', '"froze" | "nested" | "spotted"', "ts leave")
ts = must_replace(
    ts,
    '      leave: "nested",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {',
    '      leave: "nested",\n      spin: "none",\n    };\n  }\n\n  if (kind === SPOT) {\n    const hold = spotPoint(best, size, work);\n    const approachOff = hold.x < workW / 2 ? -46 : 46;\n    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n    const away = hold.x < workW / 2 ? 38 : -38;\n    return {\n      id: best.id,\n      kind,\n      side: "leafdish",\n      holdX: hold.x,\n      holdLift: hold.lift,\n      approachX,\n      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n      leave: "spotted",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {',
    "ts pickTarget",
)
ts = must_replace(
    ts,
    "  if (target.kind === NEST) {\n    const hold = nestPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
    "  if (target.kind === NEST) {\n    const hold = nestPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === SPOT) {\n    const hold = spotPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
    "ts refit",
)
ts = must_replace(
    ts,
    '      if (target.kind === NEST) {\n        return goPhase(next, "nest-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    '      if (target.kind === NEST) {\n        return goPhase(next, "nest-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === SPOT) {\n        return goPhase(next, "spot-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    "ts approach",
)

SPOT_FUNCS_TS = """
export function spotPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 36;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.24;
  const leaf = Math.max(28, size * 0.18);
  const gripY = win.y + win.height - leaf;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 16, maxLift) };
}

export function spotFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function spotOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.24) * 1.18;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 4.08 * (1 - ease) + stride * 0.16,
  };
}

export function spotPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.32) {
    const s = t / 0.32;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 2.1, lift: ease * 1.4, rot: ease * 8.6 };
  }
  if (t < 0.68) {
    const s = (t - 0.32) / 0.36;
    const ease = s * s * (3 - 2 * s);
    const nibble = Math.sin(s * Math.PI * 3.2) * 0.7;
    return { x: 2.1 + nibble, lift: 1.4 - ease * 0.5, rot: 8.6 + ease * 4.2 };
  }
  return { x: 1.8, lift: 0.9, rot: 12.8 };
}

export function spotHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const count = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.4) * 0.18;
  return { x: 1.8 + count, lift: 0.9, rot: 12.8 };
}

export function spotOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.02) * 1.52;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : 12.8) * (1 - ease),
  };
}


"""

ts = must_replace(
    ts,
    "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
    SPOT_FUNCS_TS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
    "ts spot funcs",
)

TICK_TS = '''
  if (next.phase === "spot-on") {
    const face = spotFace(target);
    const u = next.t / DUR.spotOn;
    const pose = spotOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "spot", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "spot") {
    const face = spotFace(target);
    const pose = spotPath(Math.min(1, next.t / DUR.spot));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.spot) {
      return goPhase(next, "spot-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "spot-hold") {
    const face = spotFace(target);
    const pose = spotHoldPath(Math.min(1, next.t / DUR.spotHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.spotHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = spotHoldPath(1);
      return goPhase(next, "spot-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "spot-off") {
    const u = next.t / DUR.spotOff;
    const pose = spotOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

'''

ts = must_replace(ts, '  if (next.phase === "sill-hop") {', TICK_TS + '  if (next.phase === "sill-hop") {', "ts tick")

# Deduplicate leafdish in side union if we doubled it
side_line_start = ts.find('side: "left"')
if side_line_start > 0:
    side_line_end = ts.find(";", side_line_start)
    side_chunk = ts[side_line_start:side_line_end]
    if side_chunk.count('"leafdish"') > 1:
        # remove the trailing | "leafdish" we just added after timbergallery
        ts = must_replace(ts, '"timbergallery" | "leafdish"', '"timbergallery"', "dedupe leafdish")

save("web/src/lib/pets/window-play.ts", ts, nl)
print("ts ok")
print("leafdish count in side:", ts[ts.find('side: "left"'):ts.find(';', ts.find('side: "left"'))].count('"leafdish"'))
