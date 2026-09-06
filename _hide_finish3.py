from pathlib import Path
import importlib.util

src = Path("_hide_apply.py").read_text(encoding="utf-8")

# Fix TS pickTarget marker: WRAP -> PRAY (SPOTS is followed by PRAY in current tree)
src = src.replace(
    """marker = '      leave: "spotted",\\n      spin: "none",\\n    };\\n  }\\n  if (kind === WRAP) {'
    ts = _rep(ts, marker, '      leave: "spotted",\\n      spin: "none",\\n    };\\n  }\\n' + HOLE_PICK_TS + '  if (kind === WRAP) {')""",
    """marker = '      leave: "spotted",\\n      spin: "none",\\n    };\\n  }\\n\\n  if (kind === PRAY) {'
    ts = _rep(ts, marker, '      leave: "spotted",\\n      spin: "none",\\n    };\\n  }\\n' + HOLE_PICK_TS + '\\n  if (kind === PRAY) {')""",
)

# Fix approach indent to 6 spaces and WRAP stays
src = src.replace(
    """ts = _rep(ts, '    if (target.kind === SPOTS) {\\n      return goPhase(next, "spots-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\\n    }\\n    if (target.kind === WRAP) {', '    if (target.kind === SPOTS) {\\n      return goPhase(next, "spots-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\\n    }\\n    if (target.kind === HOLE) {\\n      return goPhase(next, "hole-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\\n    }\\n    if (target.kind === WRAP) {')""",
    """ts = _rep(ts, '      if (target.kind === SPOTS) {\\n        return goPhase(next, "spots-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\\n      }\\n      if (target.kind === WRAP) {', '      if (target.kind === SPOTS) {\\n        return goPhase(next, "spots-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\\n      }\\n      if (target.kind === HOLE) {\\n        return goPhase(next, "hole-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\\n      }\\n      if (target.kind === WRAP) {')""",
)

Path("_hide_apply.py").write_text(src, encoding="utf-8")
print("markers updated")

# Also check JS pickTarget - was WRAP correct for JS?
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find('leave: "spotted"')
print("JS after spotted:", repr(js[i:i+120]))
i = js.find('leave: "holed"')
print("JS holed present", i>=0)

spec = importlib.util.spec_from_file_location("hide", "_hide_apply.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
mod.patch_ts(Path("web/src/lib/pets/window-play.ts"))
print("TS ok")
mod.patch_tests_cjs(Path("desktop/renderer/window-play.test.cjs"))
print("cjs ok")
mod.patch_tests_mjs(Path("web/scripts/window-play.test.mjs"))
print("mjs ok")
mod.patch_house(Path("desktop/renderer/leftover-house.test.cjs"))
print("house ok")
mod.patch_docs()
print("docs ok")
print("ALL REMAINING DONE")
