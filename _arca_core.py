# -*- coding: utf-8 -*-
from pathlib import Path

HERE = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\nOLD START: %r" % (label, n, old[:320]))
    return text.replace(old, new, 1)

def strip_bom(s):
    if s.startswith("\ufeff"):
        s = s.lstrip("\ufeff")
    return s

HEADER_OLD = (
    "This is the leftover after Beacon. This is the ninth leftover of the far den. Others walk a sill. */"
)
HEADER_NEW = (
    "This is the leftover after Beacon. This is the ninth leftover of the far den. "
    "Arca waits a window stool as a damp blotter: walk onto the stool, sit the wait, then leave. "
    "Hush still owns cool. Ochre still owns reef. Latch still owns drink. Lula still owns loop. Brood still owns emerge. "
    "Felt still owns lean. Vein still owns unfurl. Brine still owns frost. Knot still owns many. "
    "This is the leftover after Hush. This is the tenth leftover of the far den and closes far ten. Others walk a sill. */"
)
HEADER_OLD_TS = (
    "This is the leftover after Beacon. This is the ninth leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)
HEADER_NEW_TS = (
    "This is the leftover after Beacon. This is the ninth leftover of the far den. "
    "Arca waits a window stool as a damp blotter: walk onto the stool, sit the wait, then leave. "
    "Hush still owns cool. Ochre still owns reef. Latch still owns drink. Lula still owns loop. Brood still owns emerge. "
    "Felt still owns lean. Vein still owns unfurl. Brine still owns frost. Knot still owns many. "
    "This is the leftover after Hush. This is the tenth leftover of the far den and closes far ten. Others walk a sill. Same map as desktop `window-play.js`. */"
)

WAIT_FNS = strip_bom((HERE / "wait_fns.js").read_text(encoding="utf-8"))
if not WAIT_FNS.endswith("\n"):
    WAIT_FNS += "\n"
JS_TICK = strip_bom((HERE / "js_tick_arca.js").read_text(encoding="utf-8"))
if not JS_TICK.endswith("\n"):
    JS_TICK += "\n"
JS_PICK = strip_bom((HERE / "js_pick_arca.js").read_text(encoding="utf-8"))
if not JS_PICK.endswith("\n"):
    JS_PICK += "\n"

# TS pick: same as JS but no leading indent change needed beyond what's in file
TS_PICK = JS_PICK  # used with once into TS which has same indent style for pick

TS_WAIT_FNS = "\n".join(
    (("export " + line[2:]) if line.startswith("  function ") else (line[2:] if line.startswith("  ") else line))
    for line in WAIT_FNS.splitlines(True)
)
TS_WAIT_FNS = TS_WAIT_FNS.replace(
    "export function waitPoint(win, sprite, work)",
    "export function waitPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace)",
)
TS_WAIT_FNS = TS_WAIT_FNS.replace(
    "export function waitFace(target)",
    "export function waitFace(target: PlayTarget)",
)
TS_WAIT_FNS = TS_WAIT_FNS.replace(
    "export function waitOnPath(u, from, to)",
    "export function waitOnPath(u: number, from: PlayPoint, to: PlayPoint)",
)
TS_WAIT_FNS = TS_WAIT_FNS.replace(
    "export function waitPath(u)",
    "export function waitPath(u: number)",
)
TS_WAIT_FNS = TS_WAIT_FNS.replace(
    "export function waitHoldPath(u)",
    "export function waitHoldPath(u: number)",
)
TS_WAIT_FNS = TS_WAIT_FNS.replace(
    "export function waitOffPath(u, from, to)",
    "export function waitOffPath(u: number, from: PlayPoint, to: PlayPoint)",
)
if not TS_WAIT_FNS.endswith("\n"):
    TS_WAIT_FNS += "\n"

TS_TICK = "\n".join(
    (line[2:] if line.startswith("    ") else (line[2:] if line.startswith("  ") else line))
    for line in JS_TICK.splitlines(True)
)
if not TS_TICK.endswith("\n"):
    TS_TICK += "\n"

def patch_js(t):
    t = once(t, HEADER_OLD, HEADER_NEW, "js header")
    t = once(
        t,
        '  const COOL = "cool";\n  const SILL = "sill";',
        '  const COOL = "cool";\n  const WAIT = "wait";\n  const SILL = "sill";',
        "js const",
    )
    t = once(
        t,
        "    coolOff: 2.90,\n    sillHop:",
        "    coolOff: 2.90,\n    waitOn: 3.10,\n    wait: 2.60,\n    waitHold: 5.40,\n    waitOff: 2.92,\n    sillHop:",
        "js dur",
    )
    t = once(
        t,
        '    if (key === "umbral") return COOL;\n    return SILL;',
        '    if (key === "umbral") return COOL;\n    if (key === "cyst") return WAIT;\n    return SILL;',
        "js playFor",
    )
    t = once(
        t,
        "    if (kind === COOL) return w.width >= 198 && w.height >= 188;\n    return w.width >= 180 && w.height >= 70;",
        "    if (kind === COOL) return w.width >= 198 && w.height >= 188;\n    if (kind === WAIT) return w.width >= 196 && w.height >= 164;\n    return w.width >= 180 && w.height >= 70;",
        "js size",
    )
    old_pick = (
        '        leave: "cooled",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        '        if (kind === WRAP) {'
    )
    new_pick = (
        '        leave: "cooled",\n'
        '        spin: "none",\n'
        '      };\n'
        '    }\n'
        '\n'
        + JS_PICK
        + '        if (kind === WRAP) {'
    )
    t = once(t, old_pick, new_pick, "js pick")
    t = once(
        t,
        '    if (target.kind === COOL) {\n'
        '      const hold = coolPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {',
        '    if (target.kind === COOL) {\n'
        '      const hold = coolPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === WAIT) {\n'
        '      const hold = waitPoint(win, sprite, work);\n'
        '      return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '    }\n'
        '    if (target.kind === BURY) {',
        "js refit",
    )
    t = once(
        t,
        '        if (target.kind === COOL) {\n'
        '          return goPhase(next, "cool-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {',
        '        if (target.kind === COOL) {\n'
        '          return goPhase(next, "cool-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WAIT) {\n'
        '          return goPhase(next, "wait-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '        }\n'
        '        if (target.kind === WRAP) {',
        "js land",
    )
    # insert wait fns after coolOffPath
    cool_off_end_marker = None
    # find coolOffPath function end - next function after coolOffPath
    i = t.find("  function coolOffPath")
    if i < 0:
        raise SystemExit("coolOffPath missing")
    j = t.find("\n  function ", i + 10)
    fn_block = t[i:j]
    t = once(t, fn_block, fn_block + WAIT_FNS, "js wait fns")
    # tick before sill-hop
    t = once(
        t,
        '    if (next.phase === "sill-hop") {',
        JS_TICK + '    if (next.phase === "sill-hop") {',
        "js tick",
    )
    t = once(
        t,
        "    COOL,\n    SILL,",
        "    COOL,\n    WAIT,\n    SILL,",
        "js export const",
    )
    t = once(
        t,
        "    coolOffPath,\n    pickTarget,",
        "    coolOffPath,\n    waitPoint,\n    waitFace,\n    waitOnPath,\n    waitPath,\n    waitHoldPath,\n    waitOffPath,\n    pickTarget,",
        "js export fns",
    )
    return t

def patch_ts(t):
    t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
    t = once(
        t,
        '  | "cool-on"\n  | "cool"\n  | "cool-hold"\n  | "cool-off"\n  | "sill-hop"',
        '  | "cool-on"\n  | "cool"\n  | "cool-hold"\n  | "cool-off"\n  | "wait-on"\n  | "wait"\n  | "wait-hold"\n  | "wait-off"\n  | "sill-hop"',
        "ts phase",
    )
    t = once(
        t,
        '| "rulerline" | "lampshadow";',
        '| "rulerline" | "lampshadow" | "dampblotter";',
        "ts side",
    )
    t = once(
        t,
        '| "aligned" | "cooled";',
        '| "aligned" | "cooled" | "waited";',
        "ts leave",
    )
    # kind type / const
    t = once(
        t,
        'export const COOL = "cool";\nexport const SILL = "sill";',
        'export const COOL = "cool";\nexport const WAIT = "wait";\nexport const SILL = "sill";',
        "ts const",
    )
    # PlayKind union if separate
    if '| "cool" | "sill"' in t:
        t = once(t, '| "cool" | "sill"', '| "cool" | "wait" | "sill"', "ts kind union")
    elif '"cool" | "sill"' in t:
        t = once(t, '"cool" | "sill"', '"cool" | "wait" | "sill"', "ts kind union2")
    t = once(
        t,
        "  coolOff: 2.90,\n  sillHop:",
        "  coolOff: 2.90,\n  waitOn: 3.10,\n  wait: 2.60,\n  waitHold: 5.40,\n  waitOff: 2.92,\n  sillHop:",
        "ts dur",
    )
    t = once(
        t,
        '  if (key === "umbral") return COOL;\n  return SILL;',
        '  if (key === "umbral") return COOL;\n  if (key === "cyst") return WAIT;\n  return SILL;',
        "ts playFor",
    )
    t = once(
        t,
        "  if (kind === COOL) return w.width >= 198 && w.height >= 188;\n    return w.width >= 180 && w.height >= 70;",
        "  if (kind === COOL) return w.width >= 198 && w.height >= 188;\n  if (kind === WAIT) return w.width >= 196 && w.height >= 164;\n    return w.width >= 180 && w.height >= 70;",
        "ts size",
    )
    # pick - TS may use different indent (2 spaces for body)
    # Look at cool pick in TS
    old_pick_ts = (
        '      leave: "cooled",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        '  if (kind === WRAP) {'
    )
    # Convert JS_PICK (4-space body under if) to TS (2-space)
    ts_pick_lines = []
    for line in JS_PICK.splitlines(True):
        if line.startswith("    "):
            ts_pick_lines.append(line[2:])
        else:
            ts_pick_lines.append(line)
    TS_PICK_BODY = "".join(ts_pick_lines)
    new_pick_ts = (
        '      leave: "cooled",\n'
        '      spin: "none",\n'
        '    };\n'
        '  }\n'
        '\n'
        + TS_PICK_BODY
        + '  if (kind === WRAP) {'
    )
    t = once(t, old_pick_ts, new_pick_ts, "ts pick")
    t = once(
        t,
        '  if (target.kind === COOL) {\n'
        '    const hold = coolPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {',
        '  if (target.kind === COOL) {\n'
        '    const hold = coolPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === WAIT) {\n'
        '    const hold = waitPoint(win, sprite, work);\n'
        '    return { ...target, holdX: hold.x, holdLift: hold.lift };\n'
        '  }\n'
        '  if (target.kind === BURY) {',
        "ts refit",
    )
    t = once(
        t,
        '      if (target.kind === COOL) {\n'
        '        return goPhase(next, "cool-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {',
        '      if (target.kind === COOL) {\n'
        '        return goPhase(next, "cool-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WAIT) {\n'
        '        return goPhase(next, "wait-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n'
        '      }\n'
        '      if (target.kind === WRAP) {',
        "ts land",
    )
    # insert wait fns after coolOffPath export
    i = t.find("export function coolOffPath")
    if i < 0:
        raise SystemExit("ts coolOffPath missing")
    j = t.find("\nexport function ", i + 10)
    fn_block = t[i:j]
    t = once(t, fn_block, fn_block + TS_WAIT_FNS, "ts wait fns")
    # tick before sill-hop
    t = once(
        t,
        '  if (next.phase === "sill-hop") {',
        TS_TICK + '  if (next.phase === "sill-hop") {',
        "ts tick",
    )
    return t

def main():
    js_path = HERE / "desktop/renderer/window-play.js"
    ts_path = HERE / "web/src/lib/pets/window-play.ts"
    js = js_path.read_text(encoding="utf-8")
    ts = ts_path.read_text(encoding="utf-8")
    js2 = patch_js(js)
    ts2 = patch_ts(ts)
    js_path.write_text(js2, encoding="utf-8", newline="\n")
    ts_path.write_text(ts2, encoding="utf-8", newline="\n")
    print("patched js+ts")
    print("cyst wait", 'if (key === "cyst") return WAIT;' in js2)
    print("WAIT const", 'const WAIT = "wait"' in js2)
    print("ts WAIT", 'export const WAIT = "wait"' in ts2)
    print("dampblotter", js2.count("dampblotter"), ts2.count("dampblotter"))

if __name__ == "__main__":
    main()
