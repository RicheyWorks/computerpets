from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

CONE_ROADMAP = (
    "- [x] Cone (`limpet` / `cone`) clamps a real glass rim as a rock rim: walk onto the rim "
    "(the rim — the same furniture family Whorl rasps as her own house, not Whorl's rasp, not Lid's "
    "window-foot shut, not Pale's window-stool sand, not Wave's sill-pan signal), clamp the cone "
    "(the tell — she clamps; a common limpet; not Lid; not Cement; named: Cone. The clamp is the tell. "
    "Hours: On the rim. Hello: \"I clamped. Hello.\" Visitor: \"I clamped. Then I left the rim.\" "
    "Ambient: \"I sit. Then I clamp. Then I sit.\" Temperament: clamping.), then leave. One window. "
    "The clamp is the tell — not Whorl's `rasp`. Not Lid's `shut`. Not Pale's `sand`. Not Wave's `signal`. "
    "Not Scud's `side`. Not Tenant's `knob`. Not Clasp's `grip`. playFor(\"limpet\") returns `clamp` "
    "(not `cone`, not `sand`, not `shut`, not `rasp`). Pale (`ghost_crab`) still owns `sand`. "
    "Wave (`fiddler_crab`) still owns `signal`. Lid (`box_turtle`) still owns `shut`. "
    "Whorl (`pond_snail`) still owns `rasp`. Tenant (`hermit_crab`) still owns `knob`. Same `playFor` door. "
    "`/demo/cone` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. "
    "Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
    "Third shore leftover. Next leftover is Cement. Do not start Cement.\n"
)

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

def sub_all(text, old, new, label):
    n = text.count(old)
    if n == 0:
        raise SystemExit(f"{label}: found 0")
    print(f"{label}: {n}")
    return text.replace(old, new)

# ARCHITECTURE last-updated cell
p = ROOT / "docs" / "ARCHITECTURE.md"
t = p.read_text(encoding="utf-8")
old = "2026-09-01 (Pale sands a window stool as dry sand; second shore leftover done; next leftover is Cone; catalog stays 220; sand is the tell; Wave still owns signal; Scud still owns side; Gale still owns run; Tun still owns dry; Tenant still owns knob; Ledger still owns plow)"
new = "2026-09-01 (Cone clamps a glass rim as a rock rim; third shore leftover done; next leftover is Cement; catalog stays 220; clamp is the tell; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Tenant still owns knob)"
t = sub_once(t, old, new, "architecture last updated")
p.write_text(t, encoding="utf-8", newline="\n")
print("patched architecture")

# ROADMAP
p = ROOT / "docs" / "ROADMAP.md"
t = p.read_text(encoding="utf-8")
t = sub_all(
    t,
    "Pale is done. Second shore leftover done. Next leftover is Cone. Do not start Cone.",
    "Pale is done. Second shore leftover done. Cone is done. Third shore leftover done. Next leftover is Cement. Do not start Cement.",
    "roadmap next leftover",
)
t = sub_once(
    t,
    "Catalog stays 220. Second shore leftover. Next leftover is Cone. Do not start Cone.",
    "Catalog stays 220. Second shore leftover. Cone is done. Third shore leftover done. Next leftover is Cement. Do not start Cement.\n" + CONE_ROADMAP,
    "roadmap Pale item + Cone item",
)
t = sub_once(
    t,
    "**Last Updated:** 2026-09-01 (Phase 6 leftover: Pale sands a window stool as dry sand; second shore leftover done; next leftover is Cone; catalog stays 220; sand is the tell; Wave still owns signal; Scud still owns side; Gale still owns run; Tun still owns dry; Tenant still owns knob; Ledger still owns plow)",
    "**Last Updated:** 2026-09-01 (Phase 6 leftover: Cone clamps a glass rim as a rock rim; third shore leftover done; next leftover is Cement; catalog stays 220; clamp is the tell; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Tenant still owns knob)",
    "roadmap last updated",
)
if "Next leftover is Cone." in t:
    raise SystemExit("roadmap still names Cone as next leftover")
p.write_text(t, encoding="utf-8", newline="\n")
print("patched roadmap")

# fix tautological shutOn pin
p = ROOT / "desktop" / "renderer" / "window-play.test.cjs"
t = p.read_text(encoding="utf-8")
t = t.replace(
    'assert.equal(P.DUR.shutOn, P.DUR.shutOn, "Lid shut durations stay");',
    'assert.equal(P.DUR.shutOn, 1.47, "Lid shut durations stay");',
)
p.write_text(t, encoding="utf-8", newline="\n")
print("fixed shutOn pin")
print("docs ok")
