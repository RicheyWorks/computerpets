from pathlib import Path
old = '  assert.notEqual(P.playFor("silica"), "cloud");\n  assert.equal(P.playFor("terminator"), "sill");\n  assert.equal(P.playFor("nimbus"), "float");'
new = '  assert.notEqual(P.playFor("silica"), "cloud");\n  assert.notEqual(P.playFor("silica"), "sill");\n  assert.equal(P.playFor("terminator"), "sill");\n  assert.equal(P.playFor("nimbus"), "float");'
for path in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs"]:
    t = Path(path).read_text(encoding="utf-8")
    n = t.count(old)
    if n != 1:
        raise SystemExit(f"{path}: {n}")
    Path(path).write_text(t.replace(old, new, 1), encoding="utf-8", newline="\n")
    print(path, "ok")
