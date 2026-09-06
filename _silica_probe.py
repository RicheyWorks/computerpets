import re
js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
kinds=re.findall(r'const ([A-Z_]+) = "([a-z]+)"', js)
seen=set()
for a,b in kinds:
    if b in seen: continue
    seen.add(b)
    print(f"{a}={b}")
print("TOTAL_UNIQUE", len(seen))
print("--- playFor ---")
# find playFor function roughly
idx=js.find("function playFor(")
print(js[idx:idx+2500])
