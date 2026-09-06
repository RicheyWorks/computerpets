from pathlib import Path
src = Path("_hide_apply.py").read_text(encoding="utf-8")
# revert playFor to 2-space
src = src.replace(
    "ts = _rep(ts, '    if (key === \"eagle_ray\") return SPOTS;\\n    return SILL;', '    if (key === \"eagle_ray\") return SPOTS;\\n    if (key === \"grouper\") return HOLE;\\n    return SILL;')",
    "ts = _rep(ts, '  if (key === \"eagle_ray\") return SPOTS;\\n  return SILL;', '  if (key === \"eagle_ray\") return SPOTS;\\n  if (key === \"grouper\") return HOLE;\\n  return SILL;')",
)
Path("_hide_apply.py").write_text(src, encoding="utf-8")
print("reverted playFor to 2-space")
# also check size still 4-space
assert '    if (kind === SPOTS) return w.width >= 203' in src
import importlib.util
spec = importlib.util.spec_from_file_location("hide", "_hide_apply.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
mod.patch_ts(Path("web/src/lib/pets/window-play.ts"))
mod.patch_tests_cjs(Path("desktop/renderer/window-play.test.cjs"))
mod.patch_tests_mjs(Path("web/scripts/window-play.test.mjs"))
mod.patch_house(Path("desktop/renderer/leftover-house.test.cjs"))
mod.patch_docs()
print("REMAINING DONE")
