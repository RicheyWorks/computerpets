# -*- coding: utf-8 -*-
from pathlib import Path
import re
HERE = Path(__file__).resolve().parent
def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:240]!r}")
    return text.replace(old, new, 1)
HEADER_OLD_TS = (
    "This is the leftover after Choir. This is the third leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)
HEADER_NEW_TS = (
    "This is the leftover after Choir. This is the third leftover of the far den. "
    "Shard facets a sash gap as an inkstone: walk into the gap, sit the facet, then leave. "
    "Nimbus still owns float. Mortar still owns daub. Mane still owns teeth. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
    "This is the leftover after Nimbus. This is the fourth leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */"
)
FACET_FNS = (HERE / "facet_fns.js").read_text(encoding="utf-8").lstrip("\ufeff")
if not FACET_FNS.endswith("\n"):
    FACET_FNS += "\n"
JS_TICK = (HERE / "js_tick_silica.js").read_text(encoding="utf-8").lstrip("\ufeff")
TS_PICK = (HERE / "ts_pick_silica.js").read_text(encoding="utf-8").lstrip("\ufeff")
TS_FACET_FNS = "\n".join((line[2:] if line.startswith("  ") else line) for line in FACET_FNS.splitlines(True)).replace("function facet", "export function facet")
if not TS_FACET_FNS.endswith("\n"):
    TS_FACET_FNS += "\n"
TS_TICK_NORMAL = "\n".join((line[2:] if line.startswith("  ") else line) for line in JS_TICK.splitlines(True))
if not TS_TICK_NORMAL.endswith("\n"):
    TS_TICK_NORMAL += "\n"
print("blobs ok", len(TS_FACET_FNS), len(TS_TICK_NORMAL), len(TS_PICK))

ts_path = Path("web/src/lib/pets/window-play.ts")
t = ts_path.read_text(encoding="utf-8")
if 'export const FACET = "facet"' in t:
    raise SystemExit("TS already partially patched")
t = once(t, HEADER_OLD_TS, HEADER_NEW_TS, "ts header")
t = once(t, 'export const FLOAT = "float";\nexport const SILL = "sill";', 'export const FLOAT = "float";\nexport const FACET = "facet";\nexport const SILL = "sill";', "ts const")
t = once(t, "  floatOff: 2.68,\n  sillHop:", "  floatOff: 2.68,\n  facetOn: 2.71,\n  facet: 2.19,\n  facetHold: 4.73,\n  facetOff: 2.57,\n  sillHop:", "ts dur")
t = once(t, "typeof FLOAT | typeof SILL | typeof IGNORE;", "typeof FLOAT | typeof FACET | typeof SILL | typeof IGNORE;", "ts kind")
t = once(t, '  | "float-off"\n  | "sill-hop"', '  | "float-off"\n  | "facet-on"\n  | "facet"\n  | "facet-hold"\n  | "facet-off"\n  | "sill-hop"', "ts phase")
t = once(t, '| "barkstone" | "lampglass" | "blotterair" | "methanebowl";', '| "barkstone" | "lampglass" | "blotterair" | "methanebowl" | "inkstone";', "ts side")
t = once(t, '| "plaqued" | "thirsted" | "chorded" | "floated";', '| "plaqued" | "thirsted" | "chorded" | "floated" | "faceted";', "ts leave")
t = once(t, '  if (key === "nimbus") return FLOAT;\n  return SILL;', '  if (key === "nimbus") return FLOAT;\n  if (key === "silica") return FACET;\n  return SILL;', "ts playFor")
t = once(t, "  if (kind === FLOAT) return w.width >= 194 && w.height >= 174;\n    return w.width >= 180 && w.height >= 70;", "  if (kind === FLOAT) return w.width >= 194 && w.height >= 174;\n  if (kind === FACET) return w.width >= 188 && w.height >= 198;\n    return w.width >= 180 && w.height >= 70;", "ts size")
old_pick = '      leave: "floated",\n      spin: "none",\n    };\n  }\n\n  if (kind === WRAP) {'
new_pick = '      leave: "floated",\n      spin: "none",\n    };\n  }\n' + TS_PICK + '  if (kind === WRAP) {'
t = once(t, old_pick, new_pick, "ts pick")
old_refit = '  if (target.kind === FLOAT) {\n    const hold = floatPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {'
new_refit = '  if (target.kind === FLOAT) {\n    const hold = floatPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === FACET) {\n    const hold = facetPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {'
t = once(t, old_refit, new_refit, "ts refit")
old_app = '      if (target.kind === FLOAT) {\n        return goPhase(next, "float-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {'
new_app = '      if (target.kind === FLOAT) {\n        return goPhase(next, "float-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === FACET) {\n        return goPhase(next, "facet-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {'
t = once(t, old_app, new_app, "ts approach")
t = once(t, "export function beginPlay(target: PlayTarget | null | undefined, petX: number)", TS_FACET_FNS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number)", "ts fns")
pat = re.compile(r'(  if \(next\.phase === "float-off"\) \{[\s\S]*?return next;\s*\n  \}\n)(\n*)(  if \(next\.phase === "sill-hop"\) \{)')
matches = list(pat.finditer(t))
print("tick matches", len(matches))
if not matches:
    raise SystemExit("ts tick regex failed")
m = matches[-1]
t = t[: m.start()] + m.group(1) + "\n" + TS_TICK_NORMAL + m.group(3) + t[m.end() :]
ts_path.write_text(t, encoding="utf-8", newline="\n")
print("ts patched")
print("ok", 'export const FACET = "facet"' in t, 'phase === "facet-on"' in t, 'silica") return FACET' in t)
