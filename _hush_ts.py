from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# find PlayPhase type
i = ts.find("export type PlayPhase")
print(ts[i:i+1200] if i>=0 else "no PlayPhase")
print("====")
i2 = ts.find("export type PlaySide")
print(ts[i2:i2+400] if i2>=0 else "no PlaySide")
print("====")
i3 = ts.find("export type LeaveKind")
if i3<0: i3 = ts.find("leave:")
# find Leave union
import re
m = re.search(r'type Leave\w* =([\s\S]{0,800}?);', ts)
print("Leave", m.group(0)[:500] if m else "no")
# PlayKind
m = re.search(r'export type PlayKind =([\s\S]{0,600}?);', ts)
print("PlayKind tail", m.group(0)[-300:] if m else "no")
# DUR align values
i = ts.find("alignOn:")
print("DUR", ts[i-80:i+120])
