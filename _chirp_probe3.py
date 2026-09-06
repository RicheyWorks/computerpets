import re
js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
# Swing sing related
for pat in ["SING","sing","swing","robin","pileated","DRUM","drone","FORAGE","THRU"]:
    pass
# find SING constant and singPoint
for m in re.finditer(r".{0,40}SING.{0,80}", js):
    s=m.group(0).replace("\n"," ")
    if "sing" in s.lower() or "SING" in s:
        print(s[:160])
print("---")
# extract singPoint and pickTarget side for SING
m=re.search(r"function singPoint\([\s\S]*?\n  \}", js)
if m: print(m.group(0)[:500])
print("---side---")
for m in re.finditer(r'kind === SING[\s\S]{0,400}', js):
    print(m.group(0)[:400]); print("---")
# DUR sing
m=re.search(r"singOn:.*\n.*\n.*\n.*", js)
print(m.group(0) if m else "no")
# chirp gecko side
m=re.search(r'kind === CHIRP[\s\S]{0,350}', js)
print("CHIRP block", m.group(0)[:350] if m else None)
