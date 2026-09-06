from pathlib import Path
t=Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
start=t.find('test("Shard facets')
print("\n".join(t[start:start+1100].splitlines()[1:35]))
print("--- counts ---")
print("cloud then terminator", t.count('notEqual(P.playFor("silica"), "cloud");\n  assert.equal(P.playFor("terminator")'))
print("mason", "mason_bee" in t[start:start+2000])
