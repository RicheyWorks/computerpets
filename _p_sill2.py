from pathlib import Path
t=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
start=t.find('test("Shard facets')
print("\n".join(t[start:start+1100].splitlines()[1:40]))
