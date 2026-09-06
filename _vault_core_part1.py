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
    "Blade leafs a sash horn as a leaf rim: walk onto the horn, sit the leaf, still the green, then leave. "
    "Chirp still owns song. Twig still owns freeze. Seven still owns spot. Fold still owns pray. Disc still owns snip. Vein still owns unfurl. Grin still owns still. "
    "This is the second leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Vault jumps a window apron as a grass plate: walk onto the apron, sit, vault once, sit the plate, then leave. "
    "Blade still owns leaf. Chirp still owns song. Hop still owns spring. Leap still owns pounce. Hook still owns soar. "
    "This is the third leftover of the meadow den."
)

JUMP_FNS = r'''
  function jumpPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 36;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.58;
    const apron = Math.max(28, Math.min(size * 0.16, win.height * 0.08));
    const gripY = win.y + win.height - apron;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 16, maxLift - 6) };
  }

  function jumpFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function jumpOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.96) * 1.34;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 2.42 * (1 - ease) + stride * 0.11,
    };
  }

  function jumpPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.22) {
      const s = t / 0.22;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.18, lift: ease * 0.45, rot: ease * -4.6 };
    }
    if (t < 0.58) {
      const s = (t - 0.22) / 0.36;
      const vault = Math.sin(s * Math.PI);
      return { x: 0.18 + vault * 3.4, lift: 0.45 + vault * 14.2, rot: -4.6 + vault * 22.8 };
    }
    if (t < 0.82) {
      const s = (t - 0.58) / 0.24;
      const ease = s * s * (3 - 2 * s);
      return { x: 3.58 - ease * 3.2, lift: 14.65 - ease * 13.85, rot: 18.2 - ease * 22.6 };
    }
    return { x: 0.38, lift: 0.8, rot: -4.4 };
  }

  function jumpHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const plate = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.12;
    return { x: 0.38, lift: 0.8 + plate, rot: -4.4 };
  }

  function jumpOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.68) * 1.36;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -4.4) * (1 - ease),
    };
  }

'''

JUMP_PHASES = r'''
    if (next.phase === "jump-on") {
      const face = jumpFace(target);
      const u = next.t / DUR.jumpOn;
      const pose = jumpOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "jump", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "jump") {
      const face = jumpFace(target);
      const pose = jumpPath(Math.min(1, next.t / DUR.jump));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.jump) {
        return goPhase(next, "jump-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "jump-hold") {
      const face = jumpFace(target);
      const pose = jumpHoldPath(Math.min(1, next.t / DUR.jumpHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.jumpHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = jumpHoldPath(1);
        return goPhase(next, "jump-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "jump-off") {
      const u = next.t / DUR.jumpOff;
      const pose = jumpOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

'''

js, nl = load("desktop/renderer/window-play.js")
js = must_replace(js, HEADER, HEADER_NEW, "js header")
js = must_replace(
    js,
    '  const LEAF = "leaf";\n  const SILL = "sill";',
    '  const LEAF = "leaf";\n  const JUMP = "jump";\n  const SILL = "sill";',
    "js JUMP const",
)
js = must_replace(
    js,
    "    leafOff: 2.41,\n    sillHop: 0.38,",
    "    leafOff: 2.41,\n    jumpOn: 2.58,\n    jump: 2.14,\n    jumpHold: 3.72,\n    jumpOff: 2.26,\n    sillHop: 0.38,",
    "js DUR",
)
js = must_replace(
    js,
    '    if (key === "katydid") return LEAF;\n    return SILL;',
    '    if (key === "katydid") return LEAF;\n    if (key === "grasshopper") return JUMP;\n    return SILL;',
    "js playFor",
)
js = must_replace(
    js,
    "    if (kind === LEAF) return w.width >= 184 && w.height >= 148;\n    return w.width >= 180 && w.height >= 70;",
    "    if (kind === LEAF) return w.width >= 184 && w.height >= 148;\n    if (kind === JUMP) return w.width >= 188 && w.height >= 152;\n    return w.width >= 180 && w.height >= 70;",
    "js size gate",
)

PICK = '''    if (kind === LEAF) {
      const hold = leafPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -42 : 42;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 36 : -36;
      return {
        id: best.id,
        kind,
        side: "leafrim",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "leafed",
        spin: "none",
      };
    }



        if (kind === WRAP) {'''

PICK_NEW = '''    if (kind === LEAF) {
      const hold = leafPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -42 : 42;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 36 : -36;
      return {
        id: best.id,
        kind,
        side: "leafrim",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "leafed",
        spin: "none",
      };
    }

    if (kind === JUMP) {
      const hold = jumpPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -44 : 44;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 38 : -38;
      return {
        id: best.id,
        kind,
        side: "grassplate",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "vaulted",
        spin: "none",
      };
    }



        if (kind === WRAP) {'''

js = must_replace(js, PICK, PICK_NEW, "js pick JUMP")

REFIT_OLD = '''    if (target.kind === LEAF) {
      const hold = leafPoint(win, sprite, work);
'''
# need unique - check following lines. Use larger context from file.
idx = js.find("    if (target.kind === LEAF) {\n      const hold = leafPoint(win, sprite, work);")
if idx < 0:
    raise SystemExit("MISSING refit LEAF")
# find the block end - next "if (target.kind" or similar after return
# Insert JUMP refit after LEAF refit block. Locate second occurrence carefully.
parts = []
search = "    if (target.kind === LEAF) {\n      const hold = leafPoint(win, sprite, work);"
count = js.count(search)
print("LEAF refit/start count", count)

# For refitTarget - typically one. For approach goPhase - another with different body.
# Handle goPhase first:
GO_OLD = '''        if (target.kind === LEAF) {
          return goPhase(next, "leaf-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
'''
GO_NEW = '''        if (target.kind === LEAF) {
          return goPhase(next, "leaf-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === JUMP) {
          return goPhase(next, "jump-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
'''
# Careful - GO_OLD might need closing brace. Read actual.
