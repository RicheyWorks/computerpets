from pathlib import Path

def extract_shard_tests(text):
    start = text.find('test("Shard facets a sash gap')
    if start < 0:
        raise SystemExit("no shard start")
    # include abort test too
    abort = text.find('test("a moved window refits Shard', start)
    if abort < 0:
        raise SystemExit("no abort")
    # end after abort test closing });
    end = text.find("\n});\n", abort)
    if end < 0:
        raise SystemExit("no end")
    end = end + len("\n});\n")
    return text[start:end]

cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
block = extract_shard_tests(cjs)
old = extract_shard_tests(mjs)
print("cjs block", len(block), "mjs old", len(old))
if old not in mjs:
    raise SystemExit("old block missing exact")
mjs2 = mjs.replace(old, block, 1)
Path("web/scripts/window-play.test.mjs").write_text(mjs2, encoding="utf-8", newline="\n")
print("mjs replaced with cjs shard tests")
print("has silica not sill", 'notEqual(P.playFor("silica"), "sill")' in extract_shard_tests(mjs2))
print("has mason_bee", "mason_bee" in extract_shard_tests(mjs2))
