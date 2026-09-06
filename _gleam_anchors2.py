from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find fungi ten / Pact header snippet near end of comment
m = re.search(r"Pact plaques.{0,400}?Others walk a sill\.[^*]*\*/", js)
print("JS header end match:")
print(m.group(0) if m else "NONE")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
m2 = re.search(r"Pact plaques.{0,400}?Others walk a sill\.[^*]*\*/", ts)
print("\nTS header end match:")
print(m2.group(0) if m2 else "NONE")

# README sentences
for p in ["README.md","desktop/README.md"]:
    t=Path(p).read_text(encoding="utf-8")
    i=t.find("Pact plaques")
    print(f"\n{p} pact idx", i)
    if i>=0: print(t[i:i+450])

# house asserts block
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
i=house.find('playFor("lichen")')
print("\nHOUSE lichen ctx:")
print(house[i-80:i+500])
print("\nnext leftover:", [l for l in house.splitlines() if "next leftover" in l][:3])

# far den next after photovore
far=Path("web/src/lib/pets/far.ts").read_text(encoding="utf-8")
keys=re.findall(r'key: "(\w+)"', far)
print("far keys", keys)
slugs=re.findall(r'slug: "(\w+)"', far)
names=re.findall(r'name: "(\w+)"', far)
print("far slugs", slugs)
print("far names", names)

# hours for photovore
print("hours photovore lines from earlier known")
# traits
