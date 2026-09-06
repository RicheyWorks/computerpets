import pathlib
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# dump chord functions block
start = js.find("function chordPoint")
end = js.find("function ", start + 10)
# find end of chord section - look for next non-chord function after chordOffPath
idx = js.find("function chordPoint")
print("start", idx)
chunk = js[idx:idx+12000]
print(chunk[:12000])
