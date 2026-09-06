path = "desktop/renderer/window-play.js"
text = open(path, encoding="utf-8").read().splitlines()
for i, l in enumerate(text):
    if "apron" in l.lower() and ("function" in l or "side:" in l or "Point" in l):
        print(f"{i+1}:{l.strip()[:140]}")
start = next(i for i, l in enumerate(text) if l.startswith("  function springPoint"))
print("==== springPoint ====")
for j in range(start, start + 25):
    print(f"{j+1}:{text[j]}")
for i, l in enumerate(text):
    if "LEAF," in l or "leafPoint," in l or "leafOffPath," in l:
        print(f"EXP {i+1}:{l}")
    if "target.kind === LEAF" in l:
        print(f"RET {i+1}:{l.strip()}")
    if 'phase === "leaf-off"' in l:
        print("leaf-off phase", i+1)
    if "leaf-on" in l and "goPhase" in l:
        print("leaf-on go", i+1, l.strip()[:120])
