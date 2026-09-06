from pathlib import Path
for p in ["README.md","desktop/README.md","docs/ARCHITECTURE.md","docs/ROADMAP.md"]:
    t = Path(p).read_text(encoding="utf-8")
    for needle in ["Cap warts", "next leftover", "Lattice", "morel", "warts", "fungi den"]:
        i = t.find(needle)
        print(f"\n=== {p} :: {needle} idx={i} ===")
        if i >= 0:
            print(repr(t[max(0,i-180):i+280]))
