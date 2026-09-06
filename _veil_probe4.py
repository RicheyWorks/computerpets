from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# dump all fins-related snippets for salvage
import re
# find finsPoint if any
for name in ["finsPoint", "function fins", "const FINS", "finsOn:", "reefledge", "lionfish"]:
    print(name, js.count(name))
# extract between papillaeOffPath end and beginPlay - maybe fins was inserted
i = js.find("function papillaeOffPath")
j = js.find("function beginPlay", i)
print("between papillaeOff and beginPlay len", j-i)
print(js[i:j][-500:])
# exports area
k = js.find("papillaeOffPath,")
print("exports around papillae:")
print(js[k:k+250])
# approach wiring
i = js.find("target.kind === PAPILLAE")
print("approach after papillae:")
print(js[i:i+350])
# phase after papillae-off
i = js.find('next.phase === "papillae-off"')
print("phase after papillae-off:")
print(js[i:i+800])
