from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find('| "right-on"')
print("right-on", i)
print(ts[i-300:i+400] if i>=0 else "missing")
# also PlayPhase end
i2 = ts.find('export type PlayPhase')
print(ts[i2:i2+2500][:2000])
