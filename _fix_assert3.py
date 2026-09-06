from pathlib import Path
t=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i2=t.find('Shard facets a sash gap')
print(t[i2:i2+1200])
