for p in [r"README.md", r"desktop\README.md"]:
    lines = open(p, encoding="utf-8").read().splitlines()
    print("====", p)
    for i,l in enumerate(lines):
        if any(k in l for k in ["Knurl", "Heap", "leftover", "shore", "lugworm", "window play", "Species-true"]):
            print(f"{i+1}:{l[:500]}")
            print("---")

arch = open(r"docs\ARCHITECTURE.md", encoding="utf-8").read().splitlines()
print("==== ARCHITECTURE leftover bits")
for i,l in enumerate(arch):
    if any(k in l for k in ["Knurl", "Heap", "ninth shore", "leftover", "lugworm", "Last Updated"]):
        print(f"{i+1}:{l[:400]}")
        print("---")
