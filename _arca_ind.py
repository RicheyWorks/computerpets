from pathlib import Path
# show more context around size in both
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for label,t in [("js",js),("ts",ts)]:
    i=t.find("kind === COOL) return w.width")
    print(label, repr(t[i-20:i+160]))
# also check ts header and playFor patterns for indent
i=ts.find('key === "umbral"')
print("playFor", repr(ts[i-30:i+80]))
i=ts.find('leave: "cooled"')
print("leave cooled", repr(ts[i-80:i+120]))
