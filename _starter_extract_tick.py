from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find('  if (next.phase === "drip-off")')
j = ts.find('if (next.phase === "sill-hop")', i)
chunk = ts[i:j]
print("FOUND", i, j, len(chunk))
Path("_starter_ts_tick_old.txt").write_text(chunk, encoding="utf-8", newline="\n")
print(repr(chunk))
# also check what comes after sill-hop line start
print("AFTER", repr(ts[j:j+60]))
# JS tick old exact
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find('    if (next.phase === "drip-off")')
j = js.find('    if (next.phase === "sill-hop")', i)
Path("_starter_js_tick_old.txt").write_text(js[i:j], encoding="utf-8", newline="\n")
print("JS tick old len", j-i)
print(repr(js[i:j][:100]), "...", repr(js[i:j][-80:]))
