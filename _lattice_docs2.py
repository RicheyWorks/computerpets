from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD: {old[:220]!r}")
    return text.replace(old, new, 1)

def alln(text, old, new, expected, label):
    n = text.count(old)
    if n != expected:
        raise SystemExit(f"{label}: expected {expected}, got {n}")
    return text.replace(old, new)

rm = Path("docs/ROADMAP.md")
rt = rm.read_text(encoding="utf-8")
print("already replaced?", rt.count("Do not start Horn"), "lattice next remaining", rt.count("Do not start Lattice"))

rt = alln(
    rt,
    "Next leftover is Lattice. Do not start Lattice. Lattice (morel) is third fungi — after Cap.",
    "Lattice is done. Third leftover of the fungi den done. Next leftover is Horn. Do not start Horn. Horn (chanterelle) is fourth fungi — after Lattice.",
    43,
    "roadmap next leftover",
)

old_foot = "2026-09-02 (Phase 6 leftover: Cap warts a window apron as a moss cup; second leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Lattice; catalog stays 220; warts is the tell; Frill still owns shelf; Seven still owns spot; Sepia still owns flush; Rob still owns seize; Slip still owns ring)"
new_foot = "2026-09-02 (Phase 6 leftover: Lattice hollows a sash well as leaf mold; third leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Horn; catalog stays 220; hollow is the tell; Cap still owns warts; Frill still owns shelf; Felt still owns lean; Velvet still owns kick; Dapple still owns cover)"
rt = once(rt, old_foot, new_foot, "roadmap footer")

LATTICE_ITEM = '''- [x] Lattice (`morel` / `lattice`) hollows a real sash well as leaf mold: walk into the well (the sash well — the same furniture family Velvet kicks as a silk burrow and Nori buns as an inkwell hide; not Velvet's kick, not Nori's bun, not Dapple's window-well cover, not Cap's window-apron moss-cup warts, not Frill's sash-stile timber shelf, not Felt's meeting-rail lean; a hollow honeycomb, not a false morel; she hollows, she does not kick, bun, cover, or wart; named: Lattice. The hollow is the tell. Hello: "I am hollow. Hello." Play: "A lean. Review the lattice." Temperament: seasonal.), then leave. One window. Hollow is the tell — not Lattice's name. Not Felt's `lean`. Not Cap's `warts`. Not Frill's `shelf`. Not Dapple's `cover`. Not Velvet's `kick`. playFor("morel") returns `hollow` (not `lattice`, not `lean`, not `warts`, not `shelf`, not `cover`, not `kick`, not `sill`). Cap (`fly_agaric`) still owns `warts`. Frill (`oyster`) still owns `shelf`. Felt (`moss`) still owns `lean`. Dapple (`salamander`) still owns `cover`. Velvet (`tarantula`) still owns `kick`. Dart (`darner`) still owns `hawk`. Same `playFor` door. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. No new `/demo` route. Third leftover of the fungi den. Meadow ten stays closed. Hive ten stays closed. Shore ten stays closed. Next leftover is Horn. Do not start Horn. Horn (chanterelle) is fourth fungi — after Lattice.

'''

cap_end = "Catalog stays 220. No new `/demo` route. Second leftover of the fungi den. Meadow ten stays closed. Hive ten stays closed. Shore ten stays closed. Lattice is done. Third leftover of the fungi den done. Next leftover is Horn. Do not start Horn. Horn (chanterelle) is fourth fungi — after Lattice."
print("cap_end count", rt.count(cap_end))
rt = once(rt, cap_end, cap_end + "\n\n" + LATTICE_ITEM, "insert lattice item")

rm.write_text(rt, encoding="utf-8", newline="\n")
print("ok ROADMAP")
print("Do not start Lattice remaining", rt.count("Do not start Lattice"))
print("Do not start Horn", rt.count("Do not start Horn"))
print("Lattice checkbox", rt.count("- [x] Lattice (`morel`"))
print("next leftover is Horn footer", "next leftover is Horn" in rt)
