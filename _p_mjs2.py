from pathlib import Path
t=Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
start=t.find("Shard facets a sash gap")
print(repr(t[start:start+850]))
