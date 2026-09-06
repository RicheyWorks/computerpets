from pathlib import Path
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find soar and hunt playFor
import re
for m in re.finditer(r'if \(key === "([^"]+)"\) return (SOAR|HUNT|SIP);', js):
    print(m.group(0))
# insects for hook/haste
ins=Path("web/src/lib/pets/insects.ts").read_text(encoding="utf-8")
for name in ["Hook","Haste","Sip"]:
    i=ins.find(f'name: "{name}"')
    print(name, repr(ins[i-80:i+120]))
