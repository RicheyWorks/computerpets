from pathlib import Path

def extract_from(text, start_marker):
    start = text.find(start_marker)
    if start < 0:
        raise SystemExit("missing " + start_marker)
    abort = text.find('test("a moved window refits Shard', start)
    if abort < 0:
        raise SystemExit("missing abort")
    end = text.find("\n});\n", abort)
    if end < 0:
        raise SystemExit("missing end")
    return start, end + len("\n});\n")

cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
cs, ce = extract_from(cjs, 'test("Shard facets a sash gap')
ms, me = extract_from(mjs, 'test("Shard facets a sash gap')
block = cjs[cs:ce]
print("replacing mjs", me-ms, "with", len(block))
# ensure silica not sill in block
if 'notEqual(P.playFor("silica"), "sill")' not in block:
    block = block.replace(
        '  assert.notEqual(P.playFor("silica"), "cloud");\n  assert.equal(P.playFor("terminator"), "sill");',
        '  assert.notEqual(P.playFor("silica"), "cloud");\n  assert.notEqual(P.playFor("silica"), "sill");\n  assert.equal(P.playFor("terminator"), "sill");',
        1,
    )
    print("patched block with silica not sill")
mjs2 = mjs[:ms] + block + mjs[me:]
Path("web/scripts/window-play.test.mjs").write_text(mjs2, encoding="utf-8", newline="\n")
# also ensure cjs has it
if 'notEqual(P.playFor("silica"), "sill")' not in cjs[cs:ce]:
    cjs = cjs.replace(
        '  assert.notEqual(P.playFor("silica"), "cloud");\n  assert.equal(P.playFor("terminator"), "sill");\n  assert.equal(P.playFor("nimbus"), "float");',
        '  assert.notEqual(P.playFor("silica"), "cloud");\n  assert.notEqual(P.playFor("silica"), "sill");\n  assert.equal(P.playFor("terminator"), "sill");\n  assert.equal(P.playFor("nimbus"), "float");',
        1,
    )
    Path("desktop/renderer/window-play.test.cjs").write_text(cjs, encoding="utf-8", newline="\n")
    print("cjs also patched")
# verify
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
for name,t in [("cjs",cjs),("mjs",mjs)]:
    s=t.find('test("Shard facets')
    chunk=t[s:s+1000]
    print(name, "mason", "mason_bee" in chunk, "silica!sill", 'notEqual(P.playFor("silica"), "sill")' in chunk)
