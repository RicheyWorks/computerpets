from pathlib import Path

def once(t, old, new, label):
    n = t.count(old)
    if n != 1:
        raise SystemExit(f"{label}: {n} | have: " + repr(t[t.find("facetOn:"):t.find("facetOn:")+90] if "facetOn:" in t else ""))
    return t.replace(old, new, 1)

old_js = "    facetOn: 2.79,\n    facet: 2.23,\n    facetHold: 4.81,\n    facetOff: 2.61,"
new_js = "    facetOn: 2.79,\n    facet: 2.32,\n    facetHold: 4.91,\n    facetOff: 2.57,"
old_ts = "  facetOn: 2.79,\n  facet: 2.23,\n  facetHold: 4.81,\n  facetOff: 2.61,"
new_ts = "  facetOn: 2.79,\n  facet: 2.32,\n  facetHold: 4.91,\n  facetOff: 2.57,"
# if ts still has old 2.74 set, try both
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
js = once(js, old_js, new_js, "js dur")
Path("desktop/renderer/window-play.js").write_text(js, encoding="utf-8", newline="\n")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
if old_ts in ts:
    ts = once(ts, old_ts, new_ts, "ts dur")
elif "  facetOn: 2.74," in ts:
    ts = once(ts, "  facetOn: 2.74,\n  facet: 2.23,\n  facetHold: 4.81,\n  facetOff: 2.61,", new_ts, "ts dur74")
elif "  facetOn: 2.71," in ts:
    ts = once(ts, "  facetOn: 2.71,\n  facet: 2.19,\n  facetHold: 4.73,\n  facetOff: 2.57,", new_ts, "ts dur71")
else:
    i=ts.find("facetOn:")
    raise SystemExit("ts dur unknown " + repr(ts[i:i+90]))
Path("web/src/lib/pets/window-play.ts").write_text(ts, encoding="utf-8", newline="\n")
print("dur fixed")

for path in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs"]:
    t = Path(path).read_text(encoding="utf-8")
    start = t.find("Shard facets a sash gap")
    chunk = t[start:start+900]
    if 'assert.notEqual(P.playFor("silica"), "sill")' in chunk:
        print(path, "has silica not sill")
        continue
    needle = '  assert.notEqual(P.playFor("silica"), "cloud");\n  assert.equal(P.playFor("terminator"), "sill");'
    repl = '  assert.notEqual(P.playFor("silica"), "cloud");\n  assert.notEqual(P.playFor("silica"), "sill");\n  assert.equal(P.playFor("terminator"), "sill");'
    if t.count(needle) != 1:
        raise SystemExit(path + " needle " + str(t.count(needle)))
    Path(path).write_text(t.replace(needle, repl, 1), encoding="utf-8", newline="\n")
    print(path, "added silica not sill")
