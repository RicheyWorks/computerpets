from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for label, src in [("JS", js), ("TS", ts)]:
    print("====", label)
    for c in ['HOLE = "hole"', "holeOn: 3.31", 'key === "grouper"', "kind === HOLE", 'side: "reefhole"', 'leave: "holed"', "function holePoint", "hole-on", "Hide holes a sash well", "holePoint,"]:
        # TS uses export function holePoint
        ok = c in src or (c=="function holePoint" and "function holePoint" in src) or (c=="holePoint," and ("holePoint," in src or "holePoint\n" in src))
        if c == "holePoint," and label=="TS":
            ok = "holePoint" in src and "export function holePoint" in src
        print(("OK" if ok else "MISS"), c)
    i = src.find('leave: "holed"')
    print("holed ctx", repr(src[max(0,i-100):i+80]))
# check JS doesn't have broken WRAP insertion far away
print("count reefhole JS", js.count("reefhole"), "TS", ts.count("reefhole"))
print("playFor", __import__("desktop.renderer.window-play", fromlist=["x"]) if False else "")
WP = __import__("importlib").import_module("noop") if False else None
import importlib.util
spec = importlib.util.spec_from_file_location("WP", "desktop/renderer/window-play.js")
WP = importlib.util.module_from_spec(spec); spec.loader.exec_module(WP)
print("playFor grouper", WP.playFor("grouper"))
print("playFor eagle_ray", WP.playFor("eagle_ray"))
print("playFor fallthrough", WP.playFor("__sill_fallthrough__"))
