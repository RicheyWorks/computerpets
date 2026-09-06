from pathlib import Path

def show(p, markers):
    t = Path(p).read_text(encoding="utf-8")
    if t.startswith("\ufeff"):
        t = t[1:]
    print("===", p)
    for s in markers:
        print(t.count(s), repr(s[:70]))

show("web/src/lib/pets/window-play.ts", [
    'export const GLOW = "glow";\nexport const SILL = "sill";',
    'if (key === "firefly") return GLOW;\n  return SILL;',
    "glowOff: 2.65,\n  sillHop: 0.38,",
    "if (kind === GLOW) return w.width >= 189 && w.height >= 173;\n    return w.width >= 180 && w.height >= 70;",
    'typeof WEEK | typeof GLOW | typeof SILL | typeof IGNORE',
    '  | "glow-off"\n  | "sill-hop"',
    '"milkweedcup" | "lampdusk" | "inkdusk"',
    '"weeded" | "weeked" | "glowed"',
    'leave: "glowed",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {',
    '  if (target.kind === GLOW) {\n    const hold = glowPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {',
    '      if (target.kind === GLOW) {\n        return goPhase(next, "glow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n      }\n      if (target.kind === WRAP) {',
    '  if (next.phase === "sill-hop") {',
    'export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {',
])

# header exact
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
if js.startswith("\ufeff"): js=js[1:]
h = js.split("*/")[0]
print("HEADER_TAIL", repr(h[-280:]))

arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
i = arch.find("2026-09-01 (Spark")
print("ARCH", repr(arch[i:i+420]))
road = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
i = road.find("2026-09-01 (Phase 6 leftover: Spark")
print("ROAD_LAST", repr(road[i:i+420]))
i = road.find("- [x] Spark (`firefly`")
print("ROAD_BULLET_END", repr(road[i:i+200]))
# find end of spark bullet
j = road.find("\n- [x] ", i+10)
print("AFTER_SPARK", repr(road[j:j+80]))
print("NEXT_DART_COUNT", road.count("Next leftover is Dart. Do not start Dart."))

# weekLampDir in js
print("weekLampDir", js.count("function weekLampDir"), js.count("weekLampDir("))
# cjs/mjs pin to move
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print("cjs darner sill", cjs.count('playFor("darner"), "sill"'))
print("cjs pick darner", cjs.count('pickTarget([WIN], 80, "darner"'))
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
print("mjs darner sill", mjs.count('playFor("darner"), "sill"'))
