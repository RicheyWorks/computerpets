import re, json
text=open(r"desktop/renderer/window-play.js",encoding="utf-8").read()
kinds=set(re.findall(r'const [A-Z_]+ = "([^"]+)"', text))
cands=["cloud","burst","pearl","pore","spore","spores","smoke","powder","mist","plume","blow","pop","sack","gleba","ostiole","mound","soft","dust","puff","dish","bloom","duff","sporepuff"]
for c in cands:
  print(c, "TAKEN" if c in kinds else "FREE")
chunk=text.split("function playFor")[1].split("return SILL")[0]
print("puffball in playFor:", "puffball" in chunk)
r=json.load(open(r"desktop/renderer/roster.json",encoding="utf-8"))
keys=[g["key"] for g in r]
idx=keys.index("oyster")
print("fungi cellar order:")
for i in range(idx, min(idx+12,len(r))):
  g=r[i]
  print(i, g.get("slug"), g["key"], g["name"])
