from pathlib import Path
t=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i=t.find('assert.notEqual(P.playFor("terminator"), "sill")')
print("count", t.count('assert.notEqual(P.playFor("terminator"), "sill")'))
print(repr(t[i:i+120]))
# also in Shard test specifically
i2=t.find('Shard facets a sash gap')
chunk=t[i2:i2+900]
print("---chunk---")
print(chunk[:700])
