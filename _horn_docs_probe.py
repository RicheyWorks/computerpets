from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD: {old[:220]!r}")
    return text.replace(old, new, 1)

def alln(text, old, new, expected, label):
    n = text.count(old)
    if n != expected:
        raise SystemExit(f"{label}: expected {expected}, got {n}\nOLD: {old[:180]!r}")
    return text.replace(old, new)

README_OLD = "Lattice hollows a sash well as leaf mold: walk into the well, sit the hollow, then leave. Cap still owns warts. Frill still owns shelf. Felt still owns lean. Other guests walk a sill."
README_NEW = "Horn forks a sash drip as a moss rim: walk onto the drip, sit the fork, then leave. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Latch still drinks the drip as blotter. Other guests walk a sill."

for p in ["README.md", "desktop/README.md"]:
    t = Path(p).read_text(encoding="utf-8")
    print(p, "old count", t.count(README_OLD))
    t = once(t, README_OLD, README_NEW, p)
    Path(p).write_text(t, encoding="utf-8", newline="\n")
    print("ok", p)

arch = Path("docs/ARCHITECTURE.md")
at = arch.read_text(encoding="utf-8")
old_arch = "2026-09-02 (Lattice hollows a sash well as leaf mold; third leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Horn; catalog stays 220; hollow is the tell; Cap still owns warts; Frill still owns shelf; Felt still owns lean; Velvet still owns kick; Dapple still owns cover)"
new_arch = "2026-09-02 (Horn forks a sash drip as a moss rim; fourth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Ring; catalog stays 220; fork is the tell; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Latch still owns drink; Fan still owns gold; Spark still owns glow; Arc still owns ridge)"
print("arch old", at.count(old_arch))
at = once(at, old_arch, new_arch, "arch")
arch.write_text(at, encoding="utf-8", newline="\n")
print("ok ARCHITECTURE")

rm = Path("docs/ROADMAP.md")
rt = rm.read_text(encoding="utf-8")
old_next = "Next leftover is Horn. Do not start Horn. Horn (chanterelle) is fourth fungi — after Lattice."
new_next = "Horn is done. Fourth leftover of the fungi den done. Next leftover is Ring. Do not start Ring. Ring (turkey_tail) is fifth fungi — after Horn."
print("roadmap next leftover count", rt.count(old_next))
