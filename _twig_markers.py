from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# markers around hawk for next inserts
for n in [
  'if (key === "darner") return HAWK;\n    return SILL;',
  "hawkOff: 2.41,\n    sillHop: 0.38,",
  "if (kind === HAWK) return w.width >= 200 && w.height >= 210;\n    return w.width >= 180 && w.height >= 70;",
  'leave: "hawked",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP)',
  "if (target.kind === HAWK) {\n      const hold = hawkPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY)",
  'if (target.kind === HAWK) {\n          return goPhase(next, "hawk-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP)',
  "HAWK,\n    IGNORE,",
  "hawkOffPath,\n    pickTarget,",
  'if (next.phase === "sill-hop")',
  'const target = P.pickTarget([WIN], 80, "stick", WORK, P.SPRITE);',
  'assert.equal(P.playFor("stick"), "sill");',
]:
    print(n[:60].replace("\n","|"), "COUNT", js.count(n) if "pickTarget" not in n or "stick" not in n else "n/a")
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print("cjs stick sill", cjs.count('assert.equal(P.playFor("stick"), "sill");'))
print("cjs stick pick", cjs.count('pickTarget([WIN], 80, "stick"'))
print("cjs ends", cjs.rstrip()[-40:])
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("house stick sill", 'assert.equal(WP.playFor("stick"), "sill")' in house)
print("house title has Twig", "next leftover is Twig" in house)
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
print("mjs stick sill", mjs.count('assert.equal(P.playFor("stick"), "sill");'))
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for n in [
  'if (key === "darner") return HAWK;\n  return SILL;',
  'export const HAWK = "hawk";\nexport const SILL = "sill";',
  'typeof HAWK | typeof SILL | typeof IGNORE',
  '"hawk-off"\n  | "sill-hop"',
  '"inkdusk" | "preyair"',
  '"glowed" | "hawked"',
]:
    print("ts", n[:50].replace("\n","|"), ts.count(n))
