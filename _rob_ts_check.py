from pathlib import Path
import re
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# PlayTarget type
i = ts.find("export type PlayTarget")
print(ts[i:i+800])
print("====")
print("SEIZE const", "export const SEIZE" in ts or "const SEIZE" in ts)
print("seize in playFor", 'robber_fly") return SEIZE' in ts)
print("grassperch", "grassperch" in ts)
print("seized", '"seized"' in ts)
print("seize-on phase", '"seize-on"' in ts)
print("seizePoint fn", "function seizePoint" in ts)
# DUR keys
print("DUR seize", "seizeOn:" in ts)
