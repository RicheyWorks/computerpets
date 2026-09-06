from pathlib import Path
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("FACET const", 'const FACET' in js)
print("facetOn", 'facetOn' in js)
print("silica return", 'silica") return' in js or "silica') return" in js)
print("Shard facets", "Shard facets" in js)
print("Silica facets", "Silica facets" in js)
# show last 500 of header
end=js.find("*/")
print(js[max(0,end-700):end+2])
