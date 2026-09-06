from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find('export type PlayTarget')
# find end of side field
j = ts.find("holdX:", i)
side = ts[i:j]
print("barkplate in side", "barkplate" in side)
print("acorncup", "acorncup" in side)
print("grassperch", "grassperch" in side)
print("tail of side union:")
print(side[-500:])
# leave field
k = ts.find("leave?:", i)
print("leave field:")
print(ts[k:k+1200])
