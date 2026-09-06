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

rm = Path("docs/ROADMAP.md")
rt = rm.read_text(encoding="utf-8")
old_next = "Next leftover is Horn. Do not start Horn. Horn (chanterelle) is fourth fungi — after Lattice."
new_next = "Horn is done. Fourth leftover of the fungi den done. Next leftover is Ring. Do not start Ring. Ring (turkey_tail) is fifth fungi — after Horn."
rt = alln(rt, old_next, new_next, 44, "roadmap next leftover")

old_foot = "2026-09-02 (Phase 6 leftover: Lattice hollows a sash well as leaf mold; third leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Horn; catalog stays 220; hollow is the tell; Cap still owns warts; Frill still owns shelf; Felt still owns lean; Velvet still owns kick; Dapple still owns cover)"
new_foot = "2026-09-02 (Phase 6 leftover: Horn forks a sash drip as a moss rim; fourth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Ring; catalog stays 220; fork is the tell; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Latch still owns drink; Fan still owns gold; Spark still owns glow; Arc still owns ridge)"
rt = once(rt, old_foot, new_foot, "roadmap footer")

HORN_ITEM = '''- [x] Horn (`chanterelle` / `horn`) forks a real sash drip as a moss rim: walk onto the drip (the sash drip — the same furniture family Latch drinks as a damp blotter; not Latch's drink, not Lattice's sash-well leaf-mold hollow, not Cap's window-apron moss-cup warts, not Frill's sash-stile timber shelf, not Eft's sash-horn moss saucer, not Cone/Jewel/Whorl glass-rim sits; false gills that fork, not the jack-o'-lantern; gold, apricot smell, does not glow; she forks, she does not drink; named: Horn. The fork is the name I keep. Hello: "The ridges fork. Hello." Play: "A flush. Then I am a horn again." / "I win by remaining a fork." Temperament: fragrant.), then leave. One window. Fork is the tell — not Horn's name. Not Lattice's `hollow`. Not Cap's `warts`. Not Frill's `shelf`. Not Latch's `drink`. Not Arc's `ridge`. Not Sepia's `flush`. Not Fan's `gold`. Not Spark's `glow`. playFor("chanterelle") returns `fork` (not `horn`, not `hollow`, not `warts`, not `shelf`, not `ridge`, not `flush`, not `gold`, not `glow`, not `drink`, not `sill`). Lattice (`morel`) still owns `hollow`. Cap (`fly_agaric`) still owns `warts`. Frill (`oyster`) still owns `shelf`. Latch (`leech`) still owns `drink`. Fan (`ginkgo`) still owns `gold`. Spark (`firefly`) still owns `glow`. Arc (`cyber_dragon`) still owns `ridge`. Same `playFor` door. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. No new `/demo` route. Fourth leftover of the fungi den. Meadow ten stays closed. Hive ten stays closed. Shore ten stays closed. Next leftover is Ring. Do not start Ring. Ring (turkey_tail) is fifth fungi — after Horn.

'''

lattice_end = "Catalog stays 220. No new `/demo` route. Third leftover of the fungi den. Meadow ten stays closed. Hive ten stays closed. Shore ten stays closed. Horn is done. Fourth leftover of the fungi den done. Next leftover is Ring. Do not start Ring. Ring (turkey_tail) is fifth fungi — after Horn."
print("lattice_end count", rt.count(lattice_end))
if rt.count(lattice_end) != 1:
    raise SystemExit("lattice_end missing after next-leftover replace")
rt = rt.replace(lattice_end, lattice_end + "\n\n" + HORN_ITEM, 1)

rm.write_text(rt, encoding="utf-8", newline="\n")
print("ok ROADMAP")
print("Do not start Horn remaining", rt.count("Do not start Horn"))
print("Do not start Ring", rt.count("Do not start Ring"))
print("Horn item", rt.count("- [x] Horn (`chanterelle`"))
print("next leftover is Ring", rt.count("next leftover is Ring"))
print("Lattice still hollow", "playFor(\"morel\") returns `hollow`" in rt)
