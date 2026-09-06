import re
t=open("web/src/lib/pets/meadow.ts",encoding="utf-8").read()
keys=re.findall(r'key:\s*"([^"]+)"', t)
slugs=re.findall(r'slug:\s*"([^"]+)"', t)
names=re.findall(r'^\s*name:\s*"([^"]+)"', t, re.M)
print("count",len(keys))
for i,(k,s,n) in enumerate(zip(keys,slugs,names),1):
    print(f"{i}. {n} ({k}/{s})")

# which of these still sill in playFor
js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
# crude: extract playFor function body
m=re.search(r"function playFor\(key\) \{([\s\S]*?)\n  \}", js)
body=m.group(1) if m else ""
# find returns
mapped={}
for km in re.finditer(r'if \(key === "([^"]+)"\) return ([A-Z_]+);', body):
    mapped[km.group(1)]=km.group(2)
print("---playFor meadow---")
for k,s,n in zip(keys,slugs,names):
    print(n, k, "->", mapped.get(k, "SILL/fallthrough"))
