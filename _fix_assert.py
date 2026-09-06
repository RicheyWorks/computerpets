from pathlib import Path
for path in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs"]:
    t = Path(path).read_text(encoding="utf-8")
    old = '  assert.notEqual(P.playFor("terminator"), "sill");\n  assert.equal(P.playFor("nimbus"), "float");'
    new = '  assert.notEqual(P.playFor("silica"), "sill");\n  assert.equal(P.playFor("nimbus"), "float");'
    n = t.count(old)
    if n != 1:
        raise SystemExit(f"{path}: {n}")
    t = t.replace(old, new, 1)
    Path(path).write_text(t, encoding="utf-8", newline="\n")
    print(path, "fixed")
