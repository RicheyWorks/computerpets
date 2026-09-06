import re, pathlib
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
kinds = sorted(set(re.findall(r"kind:\s*'([a-z_]+)'", js)))
print("KINDS", len(kinds))
print("\n".join(kinds))
print("--- counts ---")
for pat in ["yeast", "bloom", "lichen", "pact", "flame", "puffball", "chicken_of_woods", "fly_agaric"]:
    print(pat, js.count(pat))
