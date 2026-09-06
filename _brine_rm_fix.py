from pathlib import Path
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
print("has brine x entry", "- [x] Brine" in rm)
print("has brine unchecked", "- [ ] Brine" in rm)
lines = rm.splitlines()
for i, l in enumerate(lines):
    if "Knot (`nexus`" in l and l.strip().startswith("- [x]"):
        print("KNOT", i)
        for j in range(i, min(i + 8, len(lines))):
            print(j, lines[j][:160])
        break
print("Beacon", rm.count("Beacon"))
print("Do not start Beacon", rm.count("Do not start Beacon"))
print("Do not start Brine", rm.count("Do not start Brine"))
print("Brine frosts", rm.count("Brine frosts"))
idx = rm.find("**Last Updated:**")
print(rm[idx:idx+280])
