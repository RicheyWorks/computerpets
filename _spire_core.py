from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
HEADER_ADD = (ROOT / "_spire_header.txt").read_text(encoding="utf-8")
JS_FUNCS = (ROOT / "_spire_js_funcs.txt").read_text(encoding="utf-8")
TS_FUNCS = (ROOT / "_spire_ts_funcs.txt").read_text(encoding="utf-8")
JS_PICK = (ROOT / "_spire_js_pick.txt").read_text(encoding="utf-8")
TS_PICK = (ROOT / "_spire_ts_pick.txt").read_text(encoding="utf-8")
JS_TICK = (ROOT / "_spire_js_tick.txt").read_text(encoding="utf-8")
TS_TICK = (ROOT / "_spire_ts_tick.txt").read_text(encoding="utf-8")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

def patch_js():
    p = ROOT / "desktop" / "renderer" / "window-play.js"
    t = p.read_text(encoding="utf-8")
    t = sub_once(t, "This is the fifth shore leftover.", "This is the fifth shore leftover." + HEADER_ADD, "js header")
    t = sub_once(t, '  const EIGHT = "eight";\n', '  const EIGHT = "eight";\n  const ROCK = "rock";\n', "js ROCK const")
    t = sub_once(
        t,
        "    eightOff: 1.93,\n",
        "    eightOff: 1.93,\n    rockOn: 2.80,\n    rock: 1.66,\n    rockHold: 3.14,\n    rockOff: 2.00,\n",
        "js DUR",
    )
    t = sub_once(
        t,
        '    if (key === "chiton") return EIGHT;\n    return SILL;',
        '    if (key === "chiton") return EIGHT;\n    if (key === "periwinkle") return ROCK;\n    return SILL;',
        "js playFor",
    )
    t = sub_once(
        t,
        "    if (kind === EIGHT) return w.width >= 195 && w.height >= 193;\n",
        "    if (kind === EIGHT) return w.width >= 195 && w.height >= 193;\n    if (kind === ROCK) return w.width >= 182 && w.height >= 216;\n",
        "js size gate",
    )
    t = sub_once(
        t,
        '''        leave: "plated",
        spin: "none",
      };
    }

        if (kind === WRAP) {''',
        '''        leave: "plated",
        spin: "none",
      };
    }
''' + JS_PICK + '''
        if (kind === WRAP) {''',
        "js pickTarget",
    )
    t = sub_once(
        t,
        '''    if (target.kind === EIGHT) {
      const hold = eightPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
        '''    if (target.kind === EIGHT) {
      const hold = eightPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === ROCK) {
      const hold = rockPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
        "js refit",
    )
    t = sub_once(
        t,
        '''        if (target.kind === EIGHT) {
          return goPhase(next, "eight-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
        '''        if (target.kind === EIGHT) {
          return goPhase(next, "eight-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === ROCK) {
          return goPhase(next, "rock-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
        "js goPhase",
    )
    t = sub_once(
        t,
        "  function beginPlay(target, petX) {",
        JS_FUNCS + "\n  function beginPlay(target, petX) {",
        "js funcs",
    )
    t = sub_once(
        t,
        '''    if (next.phase === "sill-hop") {''',
        JS_TICK + '''
    if (next.phase === "sill-hop") {''',
        "js tick",
    )
    t = sub_once(t, "    EIGHT,\n    IGNORE,", "    EIGHT,\n    ROCK,\n    IGNORE,", "js export ROCK")
    t = sub_once(
        t,
        '''    eightOffPath,
    pickTarget,''',
        '''    eightOffPath,
    rockPoint,
    rockFace,
    rockOnPath,
    rockPath,
    rockHoldPath,
    rockOffPath,
    pickTarget,''',
        "js export funcs",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched js")

def patch_ts():
    p = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"
    t = p.read_text(encoding="utf-8")
    t = sub_once(t, "This is the fifth shore leftover.", "This is the fifth shore leftover." + HEADER_ADD, "ts header")
    t = sub_once(t, 'export const EIGHT = "eight";\n', 'export const EIGHT = "eight";\nexport const ROCK = "rock";\n', "ts ROCK const")
    t = sub_once(
        t,
        "  eightOff: 1.93,\n",
        "  eightOff: 1.93,\n  rockOn: 2.80,\n  rock: 1.66,\n  rockHold: 3.14,\n  rockOff: 2.00,\n",
        "ts DUR",
    )
    t = sub_once(
        t,
        "typeof EIGHT | typeof SILL | typeof IGNORE;",
        "typeof EIGHT | typeof ROCK | typeof SILL | typeof IGNORE;",
        "ts kind type",
    )
    t = sub_once(
        t,
        '  | "eight-off"\n  | "sill-hop"',
        '  | "eight-off"\n  | "rock-on"\n  | "rock"\n  | "rock-hold"\n  | "rock-off"\n  | "sill-hop"',
        "ts PlayPhase",
    )
    t = sub_once(
        t,
        '  if (key === "chiton") return EIGHT;\n  return SILL;',
        '  if (key === "chiton") return EIGHT;\n  if (key === "periwinkle") return ROCK;\n  return SILL;',
        "ts playFor",
    )
    t = sub_once(
        t,
        "  if (kind === EIGHT) return w.width >= 195 && w.height >= 193;\n",
        "  if (kind === EIGHT) return w.width >= 195 && w.height >= 193;\n  if (kind === ROCK) return w.width >= 182 && w.height >= 216;\n",
        "ts size gate",
    )
    t = sub_once(
        t,
        '''      leave: "plated",
      spin: "none",
    };
  }
  if (kind === WRAP) {''',
        '''      leave: "plated",
      spin: "none",
    };
  }
''' + TS_PICK + '''  if (kind === WRAP) {''',
        "ts pickTarget",
    )
    t = sub_once(
        t,
        '''  if (target.kind === EIGHT) {
    const hold = eightPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        '''  if (target.kind === EIGHT) {
    const hold = eightPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === ROCK) {
    const hold = rockPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        "ts refit",
    )
    t = sub_once(
        t,
        '''      if (target.kind === EIGHT) {
        return goPhase(next, "eight-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
        '''      if (target.kind === EIGHT) {
        return goPhase(next, "eight-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === ROCK) {
        return goPhase(next, "rock-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
        "ts goPhase",
    )
    t = sub_once(
        t,
        "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        TS_FUNCS + "\nexport function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        "ts funcs",
    )
    t = sub_once(
        t,
        '''  if (next.phase === "sill-hop") {''',
        TS_TICK + '''
  if (next.phase === "sill-hop") {''',
        "ts tick",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched ts")

if __name__ == "__main__":
    patch_js()
    patch_ts()
    print("core ok")
