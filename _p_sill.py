from pathlib import Path
for path in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs"]:
    t=Path(path).read_text(encoding="utf-8")
    start=t.find('test("Shard facets')
    chunk=t[start:start+900]
    print(path)
    print("silica not sill", 'notEqual(P.playFor("silica"), "sill")' in chunk)
    # show cloud/terminator lines
    for line in chunk.splitlines():
        if "cloud" in line or "terminator" in line or 'silica"), "sill"' in line:
            print(" ", line)
