import pathlib, re
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = pathlib.Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for word in ["float","hover","loft","waft","buoy","plume","veil","bowl","cold","gas","sack","bob","linger","suspend","vapor","balloon","bladder","lift","pool","bilge","treaty"]:
    in_js = f'"{word}"' in js or f"'{word}'" in js
    # also as const value
    print(word, "js", in_js, "ts", f'"{word}"' in ts)
# dump Choir implementation anchors from choir scripts
print("--- choir header snippet ---")
i = js.find("Choir chords")
print(js[i:i+600])
print("--- CHORD handlers ---")
# find chord-related function names
for m in re.finditer(r"function\s+(\w*[Cc]hord\w*)", js):
    print(m.group(1), m.start())
for m in re.finditer(r"function\s+(\w*[Bb]lotter\w*)", js):
    print(m.group(1), m.start())
