from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
HEADER_ADD = (ROOT / "_mail_header.txt").read_text(encoding="utf-8")
JS_FUNCS = (ROOT / "_mail_js_funcs.txt").read_text(encoding="utf-8")
TS_FUNCS = (ROOT / "_mail_ts_funcs.txt").read_text(encoding="utf-8")
JS_PICK = (ROOT / "_mail_js_pick.txt").read_text(encoding="utf-8")
TS_PICK = (ROOT / "_mail_ts_pick.txt").read_text(encoding="utf-8")
JS_TICK = (ROOT / "_mail_js_tick.txt").read_text(encoding="utf-8")
TS_TICK = (ROOT / "_mail_ts_tick.txt").read_text(encoding="utf-8")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

def patch_js():
    p = ROOT / "desktop" / "renderer" / "window-play.js"
    t = p.read_text(encoding="utf-8")
    t = sub_once(t, "This is the fourth shore leftover.", "This is the fourth shore leftover." + HEADER_ADD, "js header")
    t = sub_once(t, '  const CIRRI = "cirri";\n', '  const CIRRI = "cirri";\n  const EIGHT = "eight";\n', "js EIGHT const")
    t = sub_once(
        t,
        "    cirriOff: 1.86,\n",
        "    cirriOff: 1.86,\n    eightOn: 2.73,\n    eight: 1.59,\n    eightHold: 3.06,\n    eightOff: 1.93,\n",
        "js DUR",
    )
    t = sub_once(
        t,
        '    if (key === "barnacle") return CIRRI;\n    return SILL;',
        '    if (key === "barnacle") return CIRRI;\n    if (key === "chiton") return EIGHT;\n    return SILL;',
        "js playFor",
    )
    t = sub_once(
        t,
        "    if (kind === CIRRI) return w.width >= 191 && w.height >= 216;\n",
        "    if (kind === CIRRI) return w.width >= 191 && w.height >= 216;\n    if (kind === EIGHT) return w.width >= 195 && w.height >= 193;\n",
        "js size gate",
    )
    t = sub_once(
        t,
        '''        leave: "stays",
        spin: "none",
      };
    }

        if (kind === WRAP) {''',
        '''        leave: "stays",
        spin: "none",
      };
    }
''' + JS_PICK + '''
        if (kind === WRAP) {''',
        "js pickTarget",
    )
    t = sub_once(
        t,
        '''    if (target.kind === CIRRI) {
      const hold = cirriPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
        '''    if (target.kind === CIRRI) {
      const hold = cirriPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === EIGHT) {
      const hold = eightPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
        "js refit",
    )
    t = sub_once(
        t,
        '''        if (target.kind === CIRRI) {
          return goPhase(next, "cirri-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
        '''        if (target.kind === CIRRI) {
          return goPhase(next, "cirri-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === EIGHT) {
          return goPhase(next, "eight-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
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
    t = sub_once(t, "    CIRRI,\n    IGNORE,", "    CIRRI,\n    EIGHT,\n    IGNORE,", "js export EIGHT")
    t = sub_once(
        t,
        '''    cirriOffPath,
    pickTarget,''',
        '''    cirriOffPath,
    eightPoint,
    eightFace,
    eightOnPath,
    eightPath,
    eightHoldPath,
    eightOffPath,
    pickTarget,''',
        "js export funcs",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched js")

def patch_ts():
    p = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"
    t = p.read_text(encoding="utf-8")
    t = sub_once(t, "This is the fourth shore leftover.", "This is the fourth shore leftover." + HEADER_ADD, "ts header")
    t = sub_once(t, 'export const CIRRI = "cirri";\n', 'export const CIRRI = "cirri";\nexport const EIGHT = "eight";\n', "ts EIGHT const")
    t = sub_once(
        t,
        "  cirriOff: 1.86,\n",
        "  cirriOff: 1.86,\n  eightOn: 2.73,\n  eight: 1.59,\n  eightHold: 3.06,\n  eightOff: 1.93,\n",
        "ts DUR",
    )
    t = sub_once(
        t,
        "typeof CIRRI | typeof SILL | typeof IGNORE;",
        "typeof CIRRI | typeof EIGHT | typeof SILL | typeof IGNORE;",
        "ts kind type",
    )
    t = sub_once(
        t,
        '  | "sand-off"\n  | "sill-hop"',
        '  | "sand-off"\n  | "eight-on"\n  | "eight"\n  | "eight-hold"\n  | "eight-off"\n  | "sill-hop"',
        "ts PlayPhase",
    )
    t = sub_once(
        t,
        '  if (key === "barnacle") return CIRRI;\n  return SILL;',
        '  if (key === "barnacle") return CIRRI;\n  if (key === "chiton") return EIGHT;\n  return SILL;',
        "ts playFor",
    )
    t = sub_once(
        t,
        "  if (kind === CIRRI) return w.width >= 191 && w.height >= 216;\n",
        "  if (kind === CIRRI) return w.width >= 191 && w.height >= 216;\n  if (kind === EIGHT) return w.width >= 195 && w.height >= 193;\n",
        "ts size gate",
    )
    t = sub_once(
        t,
        '''      leave: "stays",
      spin: "none",
    };
  }
  if (kind === WRAP) {''',
        '''      leave: "stays",
      spin: "none",
    };
  }
''' + TS_PICK + '''  if (kind === WRAP) {''',
        "ts pickTarget",
    )
    t = sub_once(
        t,
        '''  if (target.kind === CIRRI) {
    const hold = cirriPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        '''  if (target.kind === CIRRI) {
    const hold = cirriPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === EIGHT) {
    const hold = eightPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        "ts refit",
    )
    t = sub_once(
        t,
        '''      if (target.kind === CIRRI) {
        return goPhase(next, "cirri-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
        '''      if (target.kind === CIRRI) {
        return goPhase(next, "cirri-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === EIGHT) {
        return goPhase(next, "eight-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
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
