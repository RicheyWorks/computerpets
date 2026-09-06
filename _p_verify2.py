from pathlib import Path
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
hdr=js[:js.find("*/")+2]
print("Shard" in hdr, "Silica" in hdr)
i=hdr.find("sash gap")
print(hdr[i-80:i+200] if i>=0 else "no sash in hdr")
i2=hdr.find("facets")
print("facets ctx", hdr[i2-40:i2+120] if i2>=0 else None)
