from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find playFor keys for reef drink loop emerge
for kind, needle in [("REEF","return REEF"),("DRINK","return DRINK"),("LOOP","return LOOP"),("EMERGE","return EMERGE"),("LEAN","return LEAN")]:
    i=js.find(needle)
    # walk back to key ===
    chunk=js[max(0,i-80):i+20]
    print(kind, chunk.replace("\n"," "))

house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
lines=house.splitlines()
print("title line len", len(lines[18]))
print(lines[18][:250])
print("...")
print(lines[18][-120:])
print("already Arca in title?", "Arca leftover" in lines[18])
print("cyst sill left", house.count('playFor("cyst"), "sill"'))
print("paramecium", house.count("paramecium"))
