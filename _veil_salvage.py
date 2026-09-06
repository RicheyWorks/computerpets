from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("  function finsPoint")
if i < 0:
    i = js.find("function finsPoint")
j = js.find("  function beginPlay", i)
Path("_veil_fins_salvage.js").write_text(js[i:j], encoding="utf-8")
print("salvaged", j-i, "chars from", i)
# also salvage pick/approach/phase/dur/const pieces
chunks = []
for label, start, end in [
    ("const", "const FINS", "const SILL"),
    ("dur", "finsOn:", "sillHop:"),
    ("playfor", 'if (key === "lionfish")', "return SILL"),
]:
    a = js.find(start)
    b = js.find(end, a)
    chunks.append(f"// {label}\n{js[a:b+len(end)]}\n")
Path("_veil_fins_wiring.txt").write_text("\n".join(chunks), encoding="utf-8")
print("wiring saved")
print(Path("_veil_fins_salvage.js").read_text(encoding="utf-8")[:800])
