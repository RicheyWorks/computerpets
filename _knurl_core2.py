from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1 occurrence, found %d" % (label, n))
    return text.replace(old, new, 1)

PICK_JS = '''    if (kind === SPINES) {
      const hold = spinesPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -80 : 80;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 73 : -73;
      return {
        id: best.id,
        kind,
        side: "tidepool",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "spined",
        spin: "none",
      };
    }
'''

PICK_JS_NEW = PICK_JS + '''
    if (kind === KNOBS) {
      const hold = knobsPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -74 : 74;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 71 : -71;
      return {
        id: best.id,
        kind,
        side: "wrackdish",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "knobbed",
        spin: "none",
      };
    }
'''

PICK_TS = '''  if (kind === SPINES) {
    const hold = spinesPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -80 : 80;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 73 : -73;
    return {
      id: best.id,
      kind,
      side: "tidepool",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "spined",
      spin: "none",
    };
  }
'''

PICK_TS_NEW = PICK_TS + '''
  if (kind === KNOBS) {
    const hold = knobsPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -74 : 74;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 71 : -71;
    return {
      id: best.id,
      kind,
      side: "wrackdish",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "knobbed",
      spin: "none",
    };
  }
'''

def patch_js():
    p = ROOT / "desktop" / "renderer" / "window-play.js"
    t = p.read_text(encoding="utf-8")
    t = sub_once(t, PICK_JS, PICK_JS_NEW, "js pick")
    t = sub_once(
        t,
        '''    if (target.kind === SPINES) {
      const hold = spinesPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
        '''    if (target.kind === SPINES) {
      const hold = spinesPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === KNOBS) {
      const hold = knobsPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
        "js refit",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("js pick/refit ok")

def patch_ts():
    p = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        '  if (key === "sea_urchin") return SPINES;\n  return SILL;',
        '  if (key === "sea_urchin") return SPINES;\n  if (key === "knobbed_whelk") return KNOBS;\n  return SILL;',
        "ts playFor",
    )
    t = sub_once(
        t,
        "  if (kind === SPINES) return w.width >= 178 && w.height >= 162;",
        "  if (kind === SPINES) return w.width >= 178 && w.height >= 162;\n  if (kind === KNOBS) return w.width >= 193 && w.height >= 160;",
        "ts size",
    )
    t = sub_once(t, PICK_TS, PICK_TS_NEW, "ts pick")
    t = sub_once(
        t,
        '''  if (target.kind === SPINES) {
    const hold = spinesPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        '''  if (target.kind === SPINES) {
    const hold = spinesPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === KNOBS) {
    const hold = knobsPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        "ts refit",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("ts pick/refit/playFor ok")

if __name__ == "__main__":
    patch_js()
    patch_ts()
    print("part2 done")
