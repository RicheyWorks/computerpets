from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find("leave?:")
semi = ts.find(";", i)
leave = ts[i:semi]
print("seized in leave", '"seized"' in leave)
print("righted in leave", '"righted"' in leave)
# show around righted
j = leave.find("righted")
print(leave[j-80:j+80] if j>=0 else "no")
# side
i2 = ts.find("export type PlayTarget")
j2 = ts.find("holdX:", i2)
side = ts[i2:j2]
print("grassperch in side", "grassperch" in side)
print("barkplate in side", "barkplate" in side)
print(side[-300:])
