from pathlib import Path

def once(t, old, new, label):
    n = t.count(old)
    if n != 1:
        raise SystemExit(f"{label}: {n}")
    return t.replace(old, new, 1)

old_js = "    facetOn: 2.74,\n    facet: 2.23,\n    facetHold: 4.81,\n    facetOff: 2.61,"
new_js = "    facetOn: 2.79,\n    facet: 2.32,\n    facetHold: 4.91,\n    facetOff: 2.57,"
old_ts = "  facetOn: 2.74,\n  facet: 2.23,\n  facetHold: 4.81,\n  facetOff: 2.61,"
new_ts = "  facetOn: 2.79,\n  facet: 2.32,\n  facetHold: 4.91,\n  facetOff: 2.57,"

js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
js = once(js, old_js, new_js, "js dur")
Path("desktop/renderer/window-play.js").write_text(js, encoding="utf-8", newline="\n")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
ts = once(ts, old_ts, new_ts, "ts dur")
Path("web/src/lib/pets/window-play.ts").write_text(ts, encoding="utf-8", newline="\n")
print("dur updated")

# restore notEqual silica sill in Shard tests if missing
for path in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs"]:
    t = Path(path).read_text(encoding="utf-8")
    needle = '  assert.notEqual(P.playFor("silica"), "cloud");\n  assert.equal(P.playFor("terminator"), "sill");'
    repl = '  assert.notEqual(P.playFor("silica"), "cloud");\n  assert.notEqual(P.playFor("silica"), "sill");\n  assert.equal(P.playFor("terminator"), "sill");'
    if 'assert.notEqual(P.playFor("silica"), "sill")' in t[t.find("Shard facets"):t.find("Shard facets")+800]:
        print(path, "silica not sill already")
    elif needle in t:
        t = once(t, needle, repl, path+" silica sill")
        Path(path).write_text(t, encoding="utf-8", newline="\n")
        print(path, "added silica not sill")
    else:
        print(path, "WARN no needle")
