from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def load(p):
    return (ROOT / p).read_text(encoding="utf-8")

def save(p, text):
    (ROOT / p).write_text(text, encoding="utf-8", newline="\n")

def must_replace(text, old, new, n=None):
    count = text.count(old)
    if n is None:
        if count < 1:
            raise SystemExit(f"missing marker: {old[:80]!r}")
    elif count != n:
        raise SystemExit(f"{old[:80]!r} expected {n}, found {count}")
    return text.replace(old, new)

WAVE_SENT = "Wave signals a sill pan as a marsh dish: walk onto the pan, signal the big claw, then leave. Scud still owns side. Pinch still owns the claw. Tenant still owns knob. This opens shore ten. "

readme = load("README.md")
readme = must_replace(readme,
    "This closes log ten. Other guests walk a sill.",
    "This closes log ten. " + WAVE_SENT + "Other guests walk a sill.",
    n=1)
save("README.md", readme)
print("README ok")

desk = load("desktop/README.md")
desk = must_replace(desk,
    "This closes log ten. Other guests walk a sill.",
    "This closes log ten. " + WAVE_SENT + "Other guests walk a sill.",
    n=1)
save("desktop/README.md", desk)
print("desktop README ok")

arch = load("docs/ARCHITECTURE.md")
arch = must_replace(arch,
    "2026-09-01 (Scud sides a window well as a side pool; tenth log leftover done; log ten closed; next leftover is Wave; catalog stays 220; side is the tell; Thread still owns thrash; Armor still owns roll; Silver still owns go; Wick still owns thread; Half still owns split; Tun still owns dry)",
    "2026-09-01 (Wave signals a sill pan as a marsh dish; first shore leftover done; this opens shore ten; next leftover is Pale; catalog stays 220; signal is the tell; Scud still owns side; Thread still owns thrash; Armor still owns roll; Pinch still owns claw; Tenant still owns knob; Gale still owns run)",
    n=1)
save("docs/ARCHITECTURE.md", arch)
print("ARCHITECTURE ok")

road = load("docs/ROADMAP.md")
road = must_replace(road,
    "Next leftover is Wave. Do not start Wave.",
    "Wave is done. First shore leftover done. This opens shore ten. Next leftover is Pale. Do not start Pale.")
WAVE_ITEM = '''- [x] Wave (`fiddler_crab` / `wave`) signals a real window sill pan as a marsh dish: walk onto the pan (the dish — the same furniture family Jaw shows as a brackish dish, Wash rinses as a wash bowl, and Spoon paddles as a current dish, not Jaw's show, not Wash's rinse, not Spoon's paddle, not Scud's window-well side, not Pinch's sill-wash claw, not Tenant's sash-lift knob), signal the big claw (the tell — a signal, not a pinch of lunch; not Tenant; not Pinch; named: Wave. The signal is the tell. Hours: "Inside the marsh." Hello: "I waved. Hello." Visitor: "I waved. Then I left the marsh." Ambient: "I sit. Then I wave. Then I sit." Temperament: signaling.), then leave. One window. The signal is the tell — not Jaw's `show`. Not Wash's `rinse`. Not Spoon's `paddle`. Not Scud's `side`. Not Pinch's `claw`. Not Tenant's `knob`. Not Gale's `run`. playFor("fiddler_crab") returns `signal` (not `wave`, not `side`, not `scud`, not `claw`). Scud (`amphipod`) still owns `side`. Thread (`nematode`) still owns `thrash`. Wick (`ferret`) still owns `thread`. Armor (`pillbug`) still owns `roll`. Pinch (`crayfish`) still owns `claw`. Tenant (`hermit_crab`) still owns `knob`. Gale (`solifuge`) still owns `run`. Same `playFor` door. `/demo/wave` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. First shore leftover. This opens shore ten. Next leftover is Pale. Do not start Pale.
'''
road = must_replace(road,
    "- [x] Scud (`amphipod` / `scud`)",
    WAVE_ITEM + "- [x] Scud (`amphipod` / `scud`)",
    n=1)
road = must_replace(road,
    "**Last Updated:** 2026-09-01 (Phase 6 leftover: Scud sides a window well as a side pool; tenth log leftover done; log ten closed; next leftover is Wave; catalog stays 220; side is the tell; Thread still owns thrash; Armor still owns roll; Silver still owns go; Wick still owns thread)",
    "**Last Updated:** 2026-09-01 (Phase 6 leftover: Wave signals a sill pan as a marsh dish; first shore leftover done; this opens shore ten; next leftover is Pale; catalog stays 220; signal is the tell; Scud still owns side; Thread still owns thrash; Armor still owns roll; Pinch still owns claw; Tenant still owns knob; Gale still owns run)",
    n=1)
save("docs/ROADMAP.md", road)
print("ROADMAP ok")
