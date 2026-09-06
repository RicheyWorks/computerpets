from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for label, t in [("JS", js), ("TS", ts)]:
    i = t.find('phase === "drip-off"')
    j = t.find('phase === "sill-hop"', i)
    chunk = t[i-20:j+50]
    # count newlines style
    print(label, "chunk len", len(chunk))
    print(label, "double-nl count", chunk.count("\n\n"))
    print(label, "repr end:", repr(chunk[-80:]))
    print(label, "repr start:", repr(chunk[:80]))
    # Is the whole TS file double-spaced?
print("TS file sample around playFor chicken:")
i = ts.find('chicken_of_woods')
print(repr(ts[i-30:i+80]))
print("JS same:")
i = js.find('chicken_of_woods')
print(repr(js[i-30:i+80]))
# Check if TS uses \r\n and we're seeing weirdness
print("JS CRLF", js.count("\r\n"), "LF", js.count("\n")-js.count("\r\n"))
print("TS CRLF", ts.count("\r\n"), "LF", ts.count("\n")-ts.count("\r\n"))
