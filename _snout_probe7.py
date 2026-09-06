from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for needle in ['"drill"', " DRILL", "drillOn", "function drill", 'kind === "drill"']:
    print(needle, js.count(needle))
# also check click_beetle sill
h = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
for needle in ["click_beetle", "acorn_weevil", 'playFor("oak")']:
    print(needle, h.count(needle))
# who still sill in meadow - list guests that might be next
import re
# find catalog guests with sill in house after forceps asserts
print("====ARCH====")
arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
j = arch.find("Forceps cercis")
print(repr(arch[j:j+500]) if j>=0 else "no")
j = arch.rfind("2026-09-02")
print("LAST", repr(arch[j:j+450]))
