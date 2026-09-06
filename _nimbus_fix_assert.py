from pathlib import Path
for path in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs"]:
    t = Path(path).read_text(encoding="utf-8")
    old = 'assert.notEqual(P.playFor("silica"), "sill");\n  assert.equal(P.playFor("choir"), "chord");'
    new = 'assert.notEqual(P.playFor("nimbus"), "sill");\n  assert.equal(P.playFor("choir"), "chord");'
    n = t.count(old)
    if n != 1:
        raise SystemExit(f"{path}: expected 1 got {n}")
    Path(path).write_text(t.replace(old, new, 1), encoding="utf-8", newline="\n")
    print(path, "fixed")
