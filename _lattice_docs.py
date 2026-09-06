from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD: {old[:200]!r}")
    return text.replace(old, new, 1)

def alln(text, old, new, expected, label):
    n = text.count(old)
    if n != expected:
        raise SystemExit(f"{label}: expected {expected}, got {n}\nOLD: {old[:160]!r}")
    return text.replace(old, new)

README_OLD = "Cap warts a window apron as a moss cup: walk onto the apron, sit, wart once, sit the cup, then leave. Other guests walk a sill."
README_NEW = "Lattice hollows a sash well as leaf mold: walk into the well, sit the hollow, then leave. Cap still owns warts. Frill still owns shelf. Felt still owns lean. Other guests walk a sill."

for p in ["README.md", "desktop/README.md"]:
    t = Path(p).read_text(encoding="utf-8")
    t = once(t, README_OLD, README_NEW, p)
    Path(p).write_text(t, encoding="utf-8", newline="\n")
    print("ok", p)

arch = Path("docs/ARCHITECTURE.md")
at = arch.read_text(encoding="utf-8")
old_arch = "2026-09-02 (Cap warts a window apron as a moss cup; second leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Lattice; catalog stays 220; warts is the tell; Frill still owns shelf; Seven still owns spot; Sepia still owns flush; Rob still owns seize; Slip still owns ring)"
new_arch = "2026-09-02 (Lattice hollows a sash well as leaf mold; third leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Horn; catalog stays 220; hollow is the tell; Cap still owns warts; Frill still owns shelf; Felt still owns lean; Velvet still owns kick; Dapple still owns cover)"
at = once(at, old_arch, new_arch, "arch")
arch.write_text(at, encoding="utf-8", newline="\n")
print("ok ARCHITECTURE")

rm = Path("docs/ROADMAP.md")
rt = rm.read_text(encoding="utf-8")
rt = alln(
    rt,
    "Next leftover is Lattice. Do not start Lattice. Lattice (morel) is third fungi — after Cap.",
    "Lattice is done. Third leftover of the fungi den done. Next leftover is Horn. Do not start Horn. Horn (chanterelle) is fourth fungi — after Lattice.",
    43,
    "roadmap next leftover",
)
rt = once(
    rt,
    "Cap is done. Second leftover of the fungi den done. Lattice is done. Third leftover of the fungi den done. Next leftover is Horn.",
    "Cap is done. Second leftover of the fungi den done. Lattice is done. Third leftover of the fungi den done. Next leftover is Horn.",
    "roadmap progress noop-check",
)
# last updated footer
old_foot = "2026-09-02 (Phase 6 leftover: Cap warts a window apron as a moss cup; second leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Lattice; catalog stays 220; warts is the tell; Frill still owns shelf; Seven still owns spot; Sepia still owns flush; Rob still owns seize; Slip still owns ring)"
new_foot = "2026-09-02 (Phase 6 leftover: Lattice hollows a sash well as leaf mold; third leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Horn; catalog stays 220; hollow is the tell; Cap still owns warts; Frill still owns shelf; Felt still owns lean; Velvet still owns kick; Dapple still owns cover)"
rt = once(rt, old_foot, new_foot, "roadmap footer")

LATTICE_ITEM = '''- [x] Lattice (`morel` / `lattice`) hollows a real sash well as leaf mold: walk into the well (the sash well — the same furniture family Velvet kicks as a silk burrow and Nori buns as an inkwell hide; not Velvet's kick, not Nori's bun, not Dapple's window-well cover, not Cap's window-apron moss-cup warts, not Frill's sash-stile timber shelf, not Felt's meeting-rail lean; a hollow honeycomb, not a false morel; she hollows, she does not kick, bun, cover, or wart; named: Lattice. The hollow is the tell. Hello: "I am hollow. Hello." Play: "A lean. Review the lattice." Temperament: seasonal.), then leave. One window. Hollow is the tell — not Lattice's name. Not Felt's `lean`. Not Cap's `warts`. Not Frill's `shelf`. Not Dapple's `cover`. Not Velvet's `kick`. playFor("morel") returns `hollow` (not `lattice`, not `lean`, not `warts`, not `shelf`, not `cover`, not `kick`, not `sill`). Cap (`fly_agaric`) still owns `warts`. Frill (`oyster`) still owns `shelf`. Felt (`moss`) still owns `lean`. Dapple (`salamander`) still owns `cover`. Velvet (`tarantula`) still owns `kick`. Dart (`darner`) still owns `hawk`. Same `playFor` door. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. No new `/demo` route. Third leftover of the fungi den. Meadow ten stays closed. Hive ten stays closed. Shore ten stays closed. Next leftover is Horn. Do not start Horn. Horn (chanterelle) is fourth fungi — after Lattice.

'''

# insert Lattice item after Cap item. Cap item currently ends with the replaced next leftover sentence then a blank line then Spark.
cap_end = "Catalog stays 220. No new `/demo` route. Second leftover of the fungi den. Meadow ten stays closed. Hive ten stays closed. Shore ten stays closed. Lattice is done. Third leftover of the fungi den done. Next leftover is Horn. Do not start Horn. Horn (chanterelle) is fourth fungi — after Lattice."
if rt.count(cap_end) != 1:
    raise SystemExit(f"cap_end count {rt.count(cap_end)}")
rt = rt.replace(cap_end, cap_end + "\n\n" + LATTICE_ITEM, 1)

# progress header: add Lattice is done if not already in the Link-list header
# The 43-replace already changed the progress header's Next leftover sentence.
# It currently says: "Cap is done. Second leftover of the fungi den done. Lattice is done. Third leftover of the fungi den done. Next leftover is Horn."
# Wait - the original was "Cap is done. Second leftover of the fungi den done. Next leftover is Lattice. Do not start Lattice. Lattice (morel) is third fungi — after Cap."
# After replace: "Cap is done. Second leftover of the fungi den done. Lattice is done. Third leftover of the fungi den done. Next leftover is Horn. Do not start Horn. Horn (chanterelle) is fourth fungi — after Lattice."
# That's correct for the progress header!

rm.write_text(rt, encoding="utf-8", newline="\n")
print("ok ROADMAP")
print("Do not start Lattice remaining", rt.count("Do not start Lattice"))
print("Do not start Horn", rt.count("Do not start Horn"))
print("Lattice item", rt.count("- [x] Lattice (`morel`"))
