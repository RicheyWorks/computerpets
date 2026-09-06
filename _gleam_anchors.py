from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# headers
print("JS HEADER:")
print(js[:800])
print("\nTS HEADER:")
print(ts[:900])
# anchors that Gleam patches need
checks = [
 'const PLAQUE = "plaque";\n  const SILL = "sill";',
 'export const PLAQUE = "plaque";\nexport const SILL = "sill";',
 "plaqueOff: 2.59,\n    sillHop:",
 "plaqueOff: 2.59,\n  sillHop:",
 'if (key === "lichen") return PLAQUE;\n    return SILL;',
 'if (key === "lichen") return PLAQUE;\n  return SILL;',
 "if (kind === PLAQUE) return w.width >= 188 && w.height >= 168;\n    return w.width >= 180 && w.height >= 70;",
 'leave: "plaqued"',
 "function beginPlay(target, petX)",
 "export function beginPlay",
 'next.phase === "plaque-off"',
 'next.phase === "sill-hop"',
 "PLAQUE,\n    IGNORE,",
 "plaqueOffPath,\n    pickTarget,",
 'typeof PLAQUE | typeof SILL',
 '"plaque-off"',
 '"barkstone"',
 '"plaqued"',
]
for c in checks:
    print(repr(c[:60]), "JS", js.count(c), "TS", ts.count(c))
# house/docs pins
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("\nHOUSE title line:")
for line in house.splitlines()[:25]:
    if "test(" in line or "next leftover" in line or "Gleam" in line or "photovore" in line:
        print(line[:220])
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for i,line in enumerate(rm.splitlines(),1):
    if "Pact" in line or "Gleam" in line or "photovore" in line or "Last Updated" in line and i>400:
        print(f"RM{i}:{line[:200]}")
