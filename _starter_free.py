from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for w in ["bloom","film","ferment","proof","brew","haze","glaze","damp","soft","mother","yeast","starter","culture","foam","scum","paste","knead","leaven","colony","mat"]:
    in_js = bool(re.search(rf'=\s*"{w}"|=== "{w}"|kind:\s*"{w}"', js))
    in_ts = bool(re.search(rf'=\s*"{w}"|=== "{w}"|kind:\s*"{w}"', ts))
    print(f"{w}: js={in_js} ts={in_ts}")

# yeast catalog slug
for p in Path(".").rglob("*"):
    if p.is_file() and p.suffix in {".js",".ts",".json",".md",".cjs",".mjs"} and "node_modules" not in str(p):
        t = p.read_text(encoding="utf-8", errors="ignore")
        if "yeast" in t.lower() or "starter" in t.lower() and "Starter" in t:
            if "yeast" in t:
                print("file with yeast:", p)
