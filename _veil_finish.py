from pathlib import Path
import importlib.util
spec = importlib.util.spec_from_file_location("veil", "_veil_apply.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

# Reset TS to clean main baseline content via git show
import subprocess
ts_clean = subprocess.check_output(["git", "show", "HEAD:web/src/lib/pets/window-play.ts"], text=True)
Path("web/src/lib/pets/window-play.ts").write_text(ts_clean, encoding="utf-8")
# Also reset tests/docs/readme to clean then patch
for f in [
    "desktop/renderer/window-play.test.cjs",
    "web/scripts/window-play.test.mjs",
    "desktop/renderer/leftover-house.test.cjs",
    "README.md",
    "desktop/README.md",
    "docs/ARCHITECTURE.md",
    "docs/ROADMAP.md",
]:
    data = subprocess.check_output(["git", "show", f"HEAD:{f}"], text=True)
    Path(f).write_text(data, encoding="utf-8")

# JS already has RAYS — leave it
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
assert "const RAYS" in js and "raysPoint" in js

mod.patch_ts(Path("web/src/lib/pets/window-play.ts"))
mod.patch_tests_cjs(Path("desktop/renderer/window-play.test.cjs"))
mod.patch_tests_mjs(Path("web/scripts/window-play.test.mjs"))
mod.patch_house(Path("desktop/renderer/leftover-house.test.cjs"))
mod.patch_docs()

# verify
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
assert "export const RAYS" in ts
assert "kind === RAYS) return w.width >= 187" in ts
assert "rays-on" in ts
assert "export function raysPoint" in ts
assert 'key === "lionfish") return RAYS' in ts
print("finish ok")
