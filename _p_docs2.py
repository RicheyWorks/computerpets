from pathlib import Path
for p in ["README.md","desktop/README.md"]:
    t=Path(p).read_text(encoding="utf-8")
    for i,l in enumerate(t.splitlines(),1):
        if "floats a mid pane" in l or "Nimbus" in l:
            print(f"{p}:{i}:{l[:240]}")
arch=Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
for i,l in enumerate(arch.splitlines(),1):
    if "Last Updated" in l or "next leftover is Silica" in l:
        print(f"ARCH:{i}:{l[:300]}")
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for i,l in enumerate(rm.splitlines(),1):
    if "Nimbus" in l or "Silica" in l or "Shard" in l or "Last Updated" in l:
        print(f"RM:{i}:{l[:220]}")
# leave union
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for line in ts.splitlines():
    if "floated" in line and "chorded" in line:
        print("LEAVE:", line[:300])
