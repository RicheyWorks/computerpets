from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
needle = 'next.phase === "cloud-off"'
print("count", ts.count(needle))
i = ts.find(needle)
print(repr(ts[i:i+550]))
