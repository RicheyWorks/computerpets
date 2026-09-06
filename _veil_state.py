from pathlib import Path
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for label,t in [("JS",js),("TS",ts)]:
    print(label, "const RAYS", "const RAYS" in t or "export const RAYS" in t, "const FINS", "const FINS" in t or "export const FINS" in t)
    print("  raysPoint", "raysPoint" in t, "finsPoint", "finsPoint" in t, "reefledge", "reefledge" in t)
    print("  lionfish->", "lionfish\") return" in t or "lionfish') return" in t)
