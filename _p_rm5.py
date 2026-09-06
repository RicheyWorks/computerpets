from pathlib import Path
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
print("Shard entry", "Shard (`silica`" in rm)
print("Shard facets footer", "Shard facets a sash gap" in rm)
for i,l in enumerate(rm.splitlines(),1):
    if "Next leftover" in l or "Silica" in l or "Dusk" in l or "Shard" in l or "Last Updated" in l:
        if "Pact" in l or "Shard" in l or "Last Updated" in l or "Silica" in l or "Dusk" in l:
            print(f"{i}:{l[:240]}")
# pact line tail
for i,l in enumerate(rm.splitlines(),1):
    if l.startswith("- [x] Pact (`lichen`"):
        print("PACT TAIL:", l[-300:])
