from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
lines = cjs.splitlines()
for i in range(35040, 35080):
    print(f"{i+1}:{lines[i]}")
print("---")
# also check if choir sill remaining
print("choir sill count", cjs.count('playFor("choir"), "sill"'))
print("playFor choir chord", cjs.count('playFor("choir"), "chord"'))
# fix other guests test
old = 'const target = P.pickTarget([WIN], 80, "choir", WORK, P.SPRITE);'
print("other guests choir picks", cjs.count(old))
