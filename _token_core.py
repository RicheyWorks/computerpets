from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
JS_FUNCS = (ROOT / "_token_js_funcs.txt").read_text(encoding="utf-8-sig")
TS_FUNCS = (ROOT / "_token_ts_funcs.txt").read_text(encoding="utf-8-sig")
JS_PICK = (ROOT / "_token_js_pick.txt").read_text(encoding="utf-8-sig")
TS_PICK = (ROOT / "_token_ts_pick.txt").read_text(encoding="utf-8-sig")
JS_TICK = (ROOT / "_token_js_tick.txt").read_text(encoding="utf-8-sig")
TS_TICK = (ROOT / "_token_ts_tick.txt").read_text(encoding="utf-8-sig")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

def patch_js():
    p = ROOT / "desktop" / "renderer" / "window-play.js"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "This is the sixth shore leftover. Others walk a sill.",
        "This is the sixth shore leftover. Token flats a sill pan as a sand plate: walk onto the pan, sit the flat, then leave. Cache still owns bury. Pale still owns sand. Spire still owns rock. This is the seventh shore leftover. Others walk a sill.",
        "js header",
    )
    t = sub_once(t, '  const ROCK = "rock";\n', '  const ROCK = "rock";\n  const FLAT = "flat";\n', "js FLAT const")
    t = sub_once(
        t,
        "    rockOff: 2.00,\n",
        "    rockOff: 2.00,\n    flatOn: 2.87,\n    flat: 1.73,\n    flatHold: 3.22,\n    flatOff: 2.07,\n",
        "js DUR",
    )
    t = sub_once(
        t,
        '    if (key === "periwinkle") return ROCK;\n    return SILL;',
        '    if (key === "periwinkle") return ROCK;\n    if (key === "sand_dollar") return FLAT;\n    return SILL;',
        "js playFor",
    )
    t = sub_once(
        t,
        "    if (kind === ROCK) return w.width >= 182 && w.height >= 216;\n",
        "    if (kind === ROCK) return w.width >= 182 && w.height >= 216;\n    if (kind === FLAT) return w.width >= 190 && w.height >= 184;\n",
        "js size gate",
    )
    t = sub_once(
        t,
        '''        leave: "grazed",
        spin: "none",
      };
    }

        if (kind === WRAP) {''',
        '''        leave: "grazed",
        spin: "none",
      };
    }
''' + JS_PICK + '''        if (kind === WRAP) {''',
        "js pickTarget",
    )
    t = sub_once(
        t,
        '''    if (target.kind === ROCK) {
      const hold = rockPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
        '''    if (target.kind === ROCK) {
      const hold = rockPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === FLAT) {
      const hold = flatPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
        "js refit",
    )
    t = sub_once(
        t,
        '''        if (target.kind === ROCK) {
          return goPhase(next, "rock-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
        '''        if (target.kind === ROCK) {
          return goPhase(next, "rock-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === FLAT) {
          return goPhase(next, "flat-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
        "js goPhase",
    )
    t = sub_once(
        t,
        "  function beginPlay(target, petX) {",
        JS_FUNCS + "  function beginPlay(target, petX) {",
        "js funcs",
    )
    t = sub_once(
        t,
        '''    if (next.phase === "sill-hop") {''',
        JS_TICK + '''    if (next.phase === "sill-hop") {''',
        "js tick",
    )
    t = sub_once(
        t,
        "    ROCK,\n    IGNORE,",
        "    ROCK,\n    FLAT,\n    IGNORE,",
        "js api const",
    )
    t = sub_once(
        t,
        '''    rockHoldPath,
    rockOffPath,
    pickTarget,''',
        '''    rockHoldPath,
    rockOffPath,
    flatPoint,
    flatFace,
    flatOnPath,
    flatPath,
    flatHoldPath,
    flatOffPath,
    pickTarget,''',
        "js api funcs",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched js")

def patch_ts():
    p = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "This is the sixth shore leftover. Others walk a sill. Same map as desktop `window-play.js`.",
        "This is the sixth shore leftover. Token flats a sill pan as a sand plate: walk onto the pan, sit the flat, then leave. Cache still owns bury. Pale still owns sand. Spire still owns rock. This is the seventh shore leftover. Others walk a sill. Same map as desktop `window-play.js`.",
        "ts header",
    )
    t = sub_once(t, 'export const ROCK = "rock";\n', 'export const ROCK = "rock";\nexport const FLAT = "flat";\n', "ts FLAT const")
    t = sub_once(
        t,
        "  rockOff: 2.00,\n",
        "  rockOff: 2.00,\n  flatOn: 2.87,\n  flat: 1.73,\n  flatHold: 3.22,\n  flatOff: 2.07,\n",
        "ts DUR",
    )
    t = sub_once(
        t,
        "typeof EIGHT | typeof ROCK | typeof SILL | typeof IGNORE;",
        "typeof EIGHT | typeof ROCK | typeof FLAT | typeof SILL | typeof IGNORE;",
        "ts kind union",
    )
    t = sub_once(
        t,
        '''  | "rock-on"
  | "rock"
  | "rock-hold"
  | "rock-off"
  | "sill-hop"''',
        '''  | "rock-on"
  | "rock"
  | "rock-hold"
  | "rock-off"
  | "flat-on"
  | "flat"
  | "flat-hold"
  | "flat-off"
  | "sill-hop"''',
        "ts phases",
    )
    t = sub_once(
        t,
        '| "sidepool";',
        '| "sidepool" | "sandplate";',
        "ts side",
    )
    t = sub_once(
        t,
        '| "sides";',
        '| "sides" | "flats";',
        "ts leave",
    )
    t = sub_once(
        t,
        '  if (key === "periwinkle") return ROCK;\n  return SILL;',
        '  if (key === "periwinkle") return ROCK;\n  if (key === "sand_dollar") return FLAT;\n  return SILL;',
        "ts playFor",
    )
    t = sub_once(
        t,
        "  if (kind === ROCK) return w.width >= 182 && w.height >= 216;\n",
        "  if (kind === ROCK) return w.width >= 182 && w.height >= 216;\n  if (kind === FLAT) return w.width >= 190 && w.height >= 184;\n",
        "ts size gate",
    )
    t = sub_once(
        t,
        '''      leave: "grazed",
      spin: "none",
    };
  }
  if (kind === WRAP) {''',
        '''      leave: "grazed",
      spin: "none",
    };
  }
''' + TS_PICK + '''
  if (kind === WRAP) {''',
        "ts pickTarget",
    )
    t = sub_once(
        t,
        '''  if (target.kind === ROCK) {
    const hold = rockPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        '''  if (target.kind === ROCK) {
    const hold = rockPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === FLAT) {
    const hold = flatPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        "ts refit",
    )
    t = sub_once(
        t,
        '''      if (target.kind === ROCK) {
        return goPhase(next, "rock-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
        '''      if (target.kind === ROCK) {
        return goPhase(next, "rock-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === FLAT) {
        return goPhase(next, "flat-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
        "ts goPhase",
    )
    t = sub_once(
        t,
        "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        TS_FUNCS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
        "ts funcs",
    )
    t = sub_once(
        t,
        '''  if (next.phase === "sill-hop") {''',
        TS_TICK + '''  if (next.phase === "sill-hop") {''',
        "ts tick",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched ts")

if __name__ == "__main__":
    patch_js()
    patch_ts()
    print("core ok")
