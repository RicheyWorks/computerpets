from pathlib import Path
import re
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
# find fungi / cellar / Pact / Starter / next
for i, line in enumerate(rm.splitlines()):
    if any(k in line for k in ["Pact", "Starter", "lichen", "yeast", "fungi", "cellar", "next leftover", "generic-sill", "sill pin"]):
        print(f"{i+1}:{line[:200]}")
print("--- ARCH last updated ---")
arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
for line in arch.splitlines():
    if "Last Updated" in line:
        print(line[:300])
        break
print("--- README snippet ---")
readme = Path("README.md").read_text(encoding="utf-8")
idx = readme.find("Starter blooms")
print(readme[idx:idx+500] if idx>=0 else "no starter")
print("--- house next ---")
h = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
for line in h.splitlines():
    if "next leftover" in line or "lichen" in line or "Pact" in line or "yeast" in line:
        print(line[:220])
