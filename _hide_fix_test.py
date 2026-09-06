from pathlib import Path

def fix(path):
    t = Path(path).read_text(encoding="utf-8")
    start = t.find('test("Hide leftover holes a sash well as a reef hole')
    if start < 0:
        raise SystemExit("Hide test missing in " + path)
    end = t.find("\n});\n", start)
    if end < 0:
        end = t.find("\r\n});\r\n", start)
    block = t[start:end]
    orig = block
    # Fix shouldAbort / refit section that still says spots for Hide's own play
    block = block.replace(
        'assert.equal(P.shouldAbort({ phase: "spots" }, { asleep: true, cmd: "sleep" }), true);',
        'assert.equal(P.shouldAbort({ phase: "hole" }, { asleep: true, cmd: "sleep" }), true);',
    )
    block = block.replace(
        'for (let i = 0; i < 900 && play.phase !== "spots"; i++) {',
        'for (let i = 0; i < 900 && play.phase !== "hole"; i++) {',
    )
    block = block.replace(
        'assert.equal(play.phase, "spots");\n  const beforeX = play.target.holdX;',
        'assert.equal(play.phase, "hole");\n  const beforeX = play.target.holdX;',
    )
    block = block.replace(
        'assert.equal(play.phase, "spots");\n  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved reef hole");',
        'assert.equal(play.phase, "hole");\n  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved reef hole");',
    )
    # CRLF variants
    block = block.replace(
        'assert.equal(play.phase, "spots");\r\n  const beforeX = play.target.holdX;',
        'assert.equal(play.phase, "hole");\r\n  const beforeX = play.target.holdX;',
    )
    block = block.replace(
        'assert.equal(play.phase, "spots");\r\n  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved reef hole");',
        'assert.equal(play.phase, "hole");\r\n  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved reef hole");',
    )
    if block == orig:
        # show leftover spots in block
        print(path, "no change; spots leftovers:")
        for line in block.splitlines():
            if "spots" in line:
                print(" ", line.strip()[:120])
    else:
        t = t[:start] + block + t[end:]
        Path(path).write_text(t, encoding="utf-8")
        print(path, "fixed")

fix("desktop/renderer/window-play.test.cjs")
fix("web/scripts/window-play.test.mjs")
