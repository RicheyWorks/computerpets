from pathlib import Path
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("mantledish count", ts.count("mantledish"))
print("reefledge count", ts.count("reefledge"))
print("sandwell count", ts.count('sandwell'))
print("papillae leave", '"papillaed"' in ts or '"papillae"' in ts)
# find PlayTarget side field full - maybe multiline ended early due to | "leafrim" newline
i=ts.find('export type PlayTarget')
# find side: within first 200 lines of that
chunk=ts[i:i+8000]
# last side literal before leave
import re
sides=re.findall(r'"([a-z]+)"', chunk[chunk.find("side:"):chunk.find("leave?:")])
print("last 20 sides:", sides[-20:])
print("mantledish in sides", "mantledish" in sides)
print("reefledge in sides", "reefledge" in sides)
leaves=re.findall(r'"([a-z]+)"', chunk[chunk.find("leave?:"):chunk.find("spin?:") if "spin?:" in chunk else chunk.find("holdX")])
print("last 20 leaves:", leaves[-20:])
print("mantled in leaves", "mantled" in leaves)
print("rayed in leaves", "rayed" in leaves)
