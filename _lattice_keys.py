from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# playFor function
start = js.find("function playFor(key)")
end = js.find("function canStart", start)
block = js[start:end]
for key in ["tarantula","newt","salamander","spotted","axolotl","dumpling","nori","wolf_spider","jumping"]:
    if f'"{key}"' in block:
        i = block.find(f'"{key}"')
        print(block[i-5:i+40])
# print kick and cover and bun and lean keys
import re
for kind, label in [("KICK","kick"),("COVER","cover"),("BUN","bun"),("LEAN","lean")]:
    m = re.search(rf'if \(key === "([^"]+)"\) return {kind};', block)
    print(label, m.group(0) if m else "NOT FOUND")
    # all
    ms = re.findall(rf'if \(key === "([^"]+)"\) return {kind};', block)
    print(" all", ms)
