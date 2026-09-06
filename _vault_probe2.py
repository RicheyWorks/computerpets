js = open("desktop/renderer/window-play.js", encoding="utf-8").read().splitlines()
# print LEAF refit blocks with context
for i,l in enumerate(js):
    if "target.kind === LEAF" in l:
        print("====", i+1)
        for j in range(i, min(i+12, len(js))):
            print(js[j])
        print()
# leaf functions end marker
for i,l in enumerate(js):
    if l.startswith("  function leafOffPath"):
        for j in range(i, i+20):
            print(f"{j+1}:{js[j]}")
        break
