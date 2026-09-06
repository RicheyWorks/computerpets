from pathlib import Path
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
end=js.find("*/"); print("JS:", js[end-280:end+2])
end=ts.find("*/"); print("TS:", ts[end-280:end+2])
print("js sash", "sash gap as an inkstone" in js, "Shard" in js[:2000])
print("ts sash", "sash gap as an inkstone" in ts, "Shard" in ts[:2000])
print("js facetPoint sash", "left sash gap as an inkstone" in js)
print("ts facetPoint sash", "left sash gap as an inkstone" in ts)
