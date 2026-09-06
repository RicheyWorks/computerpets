from pathlib import Path

def fix(path):
    t = Path(path).read_text(encoding="utf-8")
    start = t.find('test("Hide leftover holes a sash well as a reef hole')
    end = t.find("\n});\n", start)
    if end < 0:
        end = t.find("\r\n});\r\n", start)
    block = t[start:end]
    block2 = block.replace(
        'assert.equal(P.shouldAbort({ phase: "hole" }, { asleep: true, cmd: "sleep" }), true);',
        'assert.equal(P.shouldAbort({ asleep: true, cmd: "sleep" }), true);',
    )
    block2 = block2.replace(
        'assert.equal(P.shouldAbort({ phase: "hole-hold" }, { asleep: false, hidden: false, leaving: false, card: false, cmd: "idle" }), false);',
        'assert.equal(P.shouldAbort({ asleep: false, hidden: false, leaving: false, card: false, cmd: "idle" }), false);',
    )
    if block2 == block:
        raise SystemExit("no shouldAbort fix in " + path)
    Path(path).write_text(t[:start] + block2 + t[end:], encoding="utf-8")
    print("fixed", path)

fix("desktop/renderer/window-play.test.cjs")
fix("web/scripts/window-play.test.mjs")
