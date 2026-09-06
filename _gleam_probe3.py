js = open("desktop/renderer/window-play.js", encoding="utf-8").read()
# PLAQUE constant area
i = js.find("const PLAQUE")
print("=== PLAQUE const area ===")
print(js[i-200:i+400])
print("\n=== plaquePath ===")
i = js.find("function plaquePath")
print(js[i:i+800])
print("\n=== plaque in tick / phase ===")
# find plaque handling near yeast bloom pattern
for needle in ['kind === PLAQUE', 'kind === "plaque"', "case PLAQUE", "=== PLAQUE", "plaquePath(", "BLOOM)", "plaque)"]:
    idxs=[]
    start=0
    while True:
        j=js.find(needle, start)
        if j<0: break
        idxs.append(j); start=j+1
    print(needle, idxs[:12])
