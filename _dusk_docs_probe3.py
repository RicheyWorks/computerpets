from pathlib import Path
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
print("Dusk leftover checkbox", "- [x] Dusk (`terminator`" in rm)
print("Dusk rims a real", "rims a real lamp-side stile" in rm)
# show shard and following 8 lines
lines = rm.splitlines()
for i, ln in enumerate(lines):
    if "Shard (`silica`" in ln and ln.strip().startswith("- [x]"):
        for j in range(i, min(i+6, len(lines))):
            print(j, lines[j][:160])
        break
print("--- footer start ---")
for ln in lines:
    if ln.startswith("**Last Updated:**"):
        print(ln[:220])