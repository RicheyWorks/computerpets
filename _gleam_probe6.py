import re
from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
vals = set(re.findall(r'const [A-Z_]+ = "([a-z_]+)";', js))
candidates = ["lamp","thirst","soak","bathe","beam","ray","quench","lumen","photon","patch","bright","glass","pane","wavelength","imbibe","guzzle","siphon","treaty","flare","glow","gleam","sun","drink","sip","warm","flash","dusk","kindle","foam","culture","crust","stain","frill","paint"]
for c in candidates:
    print(f"{c}: {'USED' if c in vals else 'FREE'}")

# read full plaquePath + plaquePoints / plaque target pick
i = js.find("function plaquePath")
print("\n=== full plaquePath ===")
print(js[i:i+1200])
# plaque target in pickTarget
i = js.find("function plaque")
print("\nfunctions starting plaque:")
for m in re.finditer(r'function (plaque\w*)', js):
    print(m.group(1), m.start())
