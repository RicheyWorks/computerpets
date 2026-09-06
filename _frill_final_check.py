import re
h=open("desktop/renderer/leftover-house.test.cjs",encoding="utf-8").read()
print("title has Frill", "Frill leftover shelves" in h)
print("meadow ten closed", "meadow ten closed" in h[:500])
print("next Cap", "next leftover is Cap" in h)
print("Rob seize", 'playFor("robber_fly"), "seize"' in h)
print("oyster shelf", 'playFor("oyster"), "shelf"' in h)
js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
# crude playFor check
m=re.search(r'if \(key === "oyster"\) return (\w+);', js)
print("js oyster", m.group(1) if m else None)
m=re.search(r'if \(key === "robber_fly"\) return (\w+);', js)
print("js robber", m.group(1) if m else None)
print("PR 511 ok")
