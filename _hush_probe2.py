from pathlib import Path

# leftover house test - find Beacon/Hush/umbral/sill
for path in [
    "desktop/renderer/leftover-house.test.cjs",
    "desktop/renderer/window-play.test.cjs",
    "web/scripts/window-play.test.mjs",
    "web/src/lib/pets/window-play.ts",
]:
    t = Path(path).read_text(encoding="utf-8")
    hits = []
    for i, line in enumerate(t.splitlines()):
        low = line.lower()
        if any(k in low for k in ["umbral", "hush", "beacon", "magneton", "arca", "cyst", "sill pin", "generic", "next leftover", "far den"]):
            hits.append((i+1, line[:220]))
    print("====", path, "hits", len(hits))
    for ln, line in hits[-40:]:
        print(f"{ln}:{line}")
    print()
