from pathlib import Path
mjs=Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
cjs=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print("mjs Shard count", mjs.count("Shard facets"))
print("cjs Shard count", cjs.count("Shard facets"))
# extract full mjs shard tests
start=mjs.find('test("Shard facets')
end=mjs.find('test("', start+10)
# find second shard test
start2=mjs.find('test("a moved window refits Shard')
end2=mjs.find('test("', start2+10) if start2>=0 else -1
print("mjs first len", end-start if end>start else None)
print("mjs abort", start2)
# show if mjs has full content like facetHold unique checks
print("mjs DUR.facetOn !== P.DUR.chordOn", "DUR.facetOn !== P.DUR.chordOn" in mjs)
print("cjs DUR.facetOn !== P.DUR.chordOn", "DUR.facetOn !== P.DUR.chordOn" in cjs)
print("mjs inkstone", mjs.count("inkstone"))
print("--- mjs shard region ---")
print(mjs[start:start+2500] if start>=0 else "missing")
