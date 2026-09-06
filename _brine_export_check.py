from pathlib import Path
t = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find module.exports block end-ish
idx = t.rfind("module.exports")
if idx < 0:
    idx = t.rfind("return {")
chunk = t[idx:idx+2500]
for name in ["DRY", "LICK", "FROST", "MANY", "dryPoint", "lickPoint", "frostPoint", "frostPath", "frostHoldPath", "frostOffPath", "frostOnPath", "frostFace"]:
    print(name, name in chunk or ("    %s," % name) in t)
# playFor brine
print("halovore frost", 'if (key === "halovore") return FROST;' in t)
print("header has Brine", "Brine frosts" in t[:5000] or "Brine frosts" in t)
print("FROST const", 'const FROST = "frost"' in t)
