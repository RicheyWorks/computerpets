from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("JS Gleam header lines:")
for i,line in enumerate(js.splitlines()[:25],1):
    if any(k in line for k in ("leftover","Gleam","thirst","Others walk","far den","Pact")):
        print(i, line[:240])
print("\nAnchors JS/TS counts:")
checks = [
 'const THIRST = "thirst";',
 'export const THIRST = "thirst";',
 'if (key === "photovore") return THIRST;',
 "thirstOff:",
 "kind === THIRST",
 '"thirst-on"',
 "lampglass",
 "thirsted",
 'const SILL = "sill";',
 'export const SILL = "sill";',
 "Others walk a sill",
]
for c in checks:
    print(repr(c), "js", js.count(c), "ts", ts.count(c))
kinds = set(re.findall(r'=\s*"(\w+)"\s*;', js))
for k in ["chord","tone","overtone","thrum","peal","swell","sustain","resonate","hum","chorus","choir","pitch","vibrate","sound"]:
    print("kind", k, "USED" if k in kinds else "FREE")
# current thirst anchors for patching after
# find playFor end
idx = js.find('if (key === "photovore") return THIRST;')
print("playFor photovore context:\n", js[idx-80:idx+120])
idx = js.find('const THIRST = "thirst";')
print("const context:\n", js[idx-60:idx+80])
idx = js.find("thirstOff:")
print("dur context:\n", js[idx-40:idx+80])
