from pathlib import Path
import re
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for pat in ["PlayKind", "export type Kind", 'kind: "', "typeof COOL", "typeof WAIT"]:
    print(pat, ts.find(pat))
# find cool in type unions
for m in re.finditer(r'.{0,40}"cool".{0,40}', ts):
    s=m.group(0)
    if "COOL" not in s and "cool-" not in s and "coolOn" not in s and "coolOff" not in s and "coolHold" not in s and "cooled" not in s and "coolPoint" not in s:
        print("UNION?", s)
# typeof chain
m=re.search(r'type PlayKind\s*=\s*([\s\S]{0,500}?);', ts)
print("PlayKind", m.group(0)[:400] if m else None)
m=re.search(r'export type PlayKind[\s\S]{0,400}', ts)
print("export PlayKind", m.group(0)[:400] if m else None)
