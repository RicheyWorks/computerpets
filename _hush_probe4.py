from pathlib import Path

# Find Hush / Arca / next leftover in roadmap
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for i, line in enumerate(rm.splitlines()):
    if any(k in line for k in ["Hush", "Arca", "umbral", "cyst", "Heat Shadow", "next leftover", "Next leftover", "[ ]", "Quiet", "quiet"]):
        if "Hush" in line or "Arca" in line or "umbral" in line or "cyst" in line or "Heat Shadow" in line or "Next leftover" in line or "next leftover" in line or ("[ ]" in line and ("far" in line.lower() or "window" in line.lower())):
            print(f"RM{i+1}:{line[:240]}")

# last updated block
for i, line in enumerate(rm.splitlines()):
    if "Last Updated" in line or "Hush" in line or "Beacon" in line and "aligns" in line:
        print(f"RM2-{i+1}:{line[:300]}")

# loom kind
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for needle in ['loom', 'web', '"week"', 'ghost', 'luna', 'terminator', 'photovore', 'fan', 'autumn']:
    pass
import re
# find playFor entries near end
m = re.search(r'function playFor\(key\) \{([\s\S]*?)\n  \}', js)
pf = m.group(1) if m else ""
Path("_playfor_snip.txt").write_text(pf, encoding="utf-8")
print("playFor len", len(pf))
# kinds used
kinds = re.findall(r'const ([A-Z_]+) = "([^"]+)";', js[:40000])
print("kind count", len(kinds))
# check if quiet exists
print("quiet in kinds", any(v=="quiet" for _,v in kinds))
print("quiet string count", js.count('"quiet"'))
# loom
for i, line in enumerate(pf.splitlines()):
    if "loom" in line.lower() or "web" in line or "luna" in line or "ghost" in line or "magneton" in line or "umbral" in line:
        print("PF:", line)
