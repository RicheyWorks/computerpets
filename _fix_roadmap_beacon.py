from pathlib import Path
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
print("x Beacon", "- [x] Beacon" in rm)
print("count Next leftover was Beacon", rm.count("Next leftover was Beacon"))
print("count Do not start Hush", rm.count("Do not start Hush"))
print("count Do not start Beacon", rm.count("Do not start Beacon"))
for i,l in enumerate(rm.splitlines(),1):
    if l.strip().startswith("- [x]") and ("Brine" in l or "Beacon" in l):
        print(i, l[:180])
    if "Do not start Hush" in l or ("Next leftover" in l and ("Beacon" in l or "Hush" in l) and i > 420 and i < 440):
        print(i, l[:180])
