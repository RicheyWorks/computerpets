from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: {n}")
    return text.replace(old, new, 1)

# old values
old_js = "    floatOn: 2.74,\n    float: 2.22,\n    floatHold: 4.64,\n    floatOff: 2.64,\n"
new_js = "    floatOn: 2.77,\n    float: 2.26,\n    floatHold: 4.69,\n    floatOff: 2.68,\n"
old_ts = "  floatOn: 2.74,\n  float: 2.22,\n  floatHold: 4.64,\n  floatOff: 2.64,\n"
new_ts = "  floatOn: 2.77,\n  float: 2.26,\n  floatHold: 4.69,\n  floatOff: 2.68,\n"

js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
js = once(js, old_js, new_js, "js dur")
ts = once(ts, old_ts, new_ts, "ts dur")
Path("desktop/renderer/window-play.js").write_text(js, encoding="utf-8", newline="\n")
Path("web/src/lib/pets/window-play.ts").write_text(ts, encoding="utf-8", newline="\n")
print("durs updated")
