from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
Path("_choir_js_head.txt").write_text(js[: js.find("*/") + 2], encoding="utf-8")
Path("_choir_ts_head.txt").write_text(ts[: ts.find("*/") + 2], encoding="utf-8")
i = js.find('side: "lampglass"')
Path("_choir_js_after_pick.txt").write_text(js[i : i + 500], encoding="utf-8")
j = js.find('if (next.phase === "sill-hop")')
Path("_choir_js_before_sill.txt").write_text(js[j - 250 : j + 80], encoding="utf-8")
# thirst-off end for tick insert
k = js.find('if (next.phase === "thirst-off")')
# find closing of that block - next phase if
n = js.find('if (next.phase === "sill-hop")', k)
Path("_choir_js_tick_tail.txt").write_text(js[n - 300 : n + 40], encoding="utf-8")
# exports
e = js.find("thirstOffPath")
Path("_choir_js_exports.txt").write_text(js[e - 120 : e + 200], encoding="utf-8")
# ts similar
i = ts.find('side: "lampglass"')
Path("_choir_ts_after_pick.txt").write_text(ts[i : i + 500], encoding="utf-8")
n = ts.find('if (next.phase === "sill-hop")')
Path("_choir_ts_before_sill.txt").write_text(ts[n - 400 : n + 80], encoding="utf-8")
print("ok", "Gleam" in js[:800], "Others walk" in js[:2500])
print(Path("_choir_js_head.txt").read_text(encoding="utf-8")[-500:])
