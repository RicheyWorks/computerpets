from pathlib import Path
p=Path("_shard_core.py").read_text(encoding="utf-8")
print("Shard facets" in p, "Silica facets" in p, "sash gap" in p, "cool pane" in p)
# show HEADER_NEW
i=p.find("HEADER_NEW =")
print(p[i:i+500])
