# abort list, WindowPlayKind, README knurl, header, first test name
js = open(r"desktop\renderer\window-play.js", encoding="utf-8").read()
print("knobs-off in abort", js.count("knobs-off"))
print("castings", "castings" in js)

ts = open(r"web\\src\\lib\\pets\\window-play.ts", encoding="utf-8").read().splitlines()
for i,l in enumerate(ts):
    if "WindowPlayKind" in l:
        print("KIND", i+1, l[:300])
        if len(l) > 300:
            print(" ...", l[-200:])
        break
for i,l in enumerate(ts):
    if "knobsOff: 2.21" in l or "knobsOn:" in l:
        print(f"DUR {i+1}:{l}")

# README
for p in [r"README.md", r"desktop\README.md", r"docs\ARCHITECTURE.md"]:
    lines = open(p, encoding="utf-8").read().splitlines()
    print("====", p, "lines", len(lines))
    for i,l in enumerate(lines):
        if "Knurl" in l or "knobbed" in l or "Heap" in l or "lugworm" in l or "ninth shore" in l or "shore ten" in l:
            print(f"{i+1}:{l[:240]}")
