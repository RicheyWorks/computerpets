#!/usr/bin/env python3
"""Probe Gate leftover anchors on current main (after Veil)."""
from pathlib import Path
import re

js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for name in ["chirpPoint", "knurlPoint", "manyPoint", "frostPoint", "valleysPoint", "raysPoint"]:
    i = js.find("function " + name)
    print("====", name, i)
    if i >= 0:
        print(js[i:i+450])

for f in ["docs/ARCHITECTURE.md", "docs/ROADMAP.md"]:
    t = Path(f).read_text(encoding="utf-8")
    for line in t.splitlines():
        if "Last Updated" in line or ("Veil" in line and "lionfish" in line):
            print(f, ":", line[:220])

for f in ["README.md", "desktop/README.md"]:
    t = Path(f).read_text(encoding="utf-8")
    i = t.find("Veil rays")
    print(f, "veil idx", i, repr(t[i:i+140]) if i >= 0 else "missing")

cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print("cjs giant_clam", cjs.count("giant_clam"), "eagle_ray", cjs.count("eagle_ray"))
# generic sill clone test context
for m in re.finditer(r'.{80}giant_clam.{80}', cjs):
    print("CTX:", m.group(0).replace("\n"," "))

house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("house Next leftover", "Next leftover is Gate" in house, "Next leftover is Soar" in house)
idx = house.find('assert.equal(WP.playFor("giant_clam")')
print(house[idx:idx+120] if idx>=0 else "no giant_clam assert")
idx = house.find('assert.equal(WP.playFor("lionfish")')
print(house[idx:idx+200] if idx>=0 else "no lionfish")

# markers for insert after RAYS
for needle in [
    'const RAYS = "rays";\n  const SILL',
    'if (key === "lionfish") return RAYS;\n    return SILL;',
    'if (kind === RAYS) return w.width >= 187 && w.height >= 192;\n    return w.width',
    'leave: "rayed"',
    'function beginPlay(target, petX)',
    'target.kind === RAYS) {\n          return goPhase(next, "rays-on"',
    'if (next.phase === "rays-off")',
    'if (next.phase === "sill-hop")',
    'PAPILLAE,\n    RAYS,\n    SILL,',
    'raysOffPath,\n    pickTarget,',
]:
    print("JS MARKER", needle[:50], "->", js.find(needle))

ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for needle in [
    'export const RAYS = "rays";\nexport const SILL',
    'if (key === "lionfish") return RAYS;\n  return SILL;',
    'leave: "rayed"',
    'export function beginPlay',
    'if (next.phase === "rays-off")',
    'if (next.phase === "sill-hop")',
    'typeof RAYS',
]:
    print("TS MARKER", needle[:50], "->", ts.find(needle))
