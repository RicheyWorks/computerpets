from pathlib import Path
t = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
i = t.find("- [x] Frill")
print(t[i:i+1800][-400:] if i>=0 else "NO FRILL")
print("\n==== COUNT next leftover is Lattice ====", t.count("Next leftover is Lattice"))
print("count Do not start Lattice", t.count("Do not start Lattice"))
