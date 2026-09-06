from pathlib import Path
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for i,l in enumerate(rm.splitlines(),1):
    if any(x in l for x in ["Gleam (", "Choir (", "Nimbus (", "Silica", "float", "chord", "thirst", "far den", "Next leftover"]):
        if l.strip().startswith("-") or "Last Updated" in l or "Next leftover" in l:
            print(i, l[:200])
# show end of far den section around 400-441
for i,l in enumerate(rm.splitlines()[400:442],401):
    print(f"{i}|{l[:160]}")
