from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for key in ["maidenhair", "tuatara", "leafcutter", "stick", "ladybird", "mantis"]:
    i = js.find(f'if (key === "{key}")')
    print(key, repr(js[i:i+60]) if i>=0 else "MISSING")
for d in ["prayOn", "freezeOn", "spotOn", "snipOn", "unfurlOn", "stillOn", "leafOn", "songOn"]:
    print(d, f"{d}:" in js or f"{d}:" in js)
# check Vein/Grin play kinds via search
import re
for m in re.finditer(r'if \(key === "(maidenhair|tuatara|fern|leafcutter)"\) return ([A-Z_]+);', js):
    print("play", m.group(1), m.group(2))
