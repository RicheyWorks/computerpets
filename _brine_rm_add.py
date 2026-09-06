# -*- coding: utf-8 -*-
from pathlib import Path

HERE = Path(r"C:\Users\730ri\projects\ComputerPets")
rm_path = HERE / "docs" / "ROADMAP.md"
rm = rm_path.read_text(encoding="utf-8")
if "- [x] Brine (`halovore`" in rm:
    print("already has brine x")
else:
    knot_marker = None
    for line in rm.splitlines():
        if "Knot (`nexus` / `knot`)" in line and line.strip().startswith("- [x]"):
            knot_marker = line
            break
    if not knot_marker:
        raise SystemExit("knot line missing")
    brine_entry = (
        "- [x] Brine (`halovore` / `brine`) frosts a real window stool as a salt dish: walk onto the stool "
        "(window stool as a salt dish a salt-drinker frosts; not Sheen salt-glass lick, "
        "not Tun dry moss-film, not Pale dry-sand, not Knot paperweight many, "
        "not Bank sand-bank dig, not Cache oak-dish bury, not Well bog-cup sill pan, not Ledger sand-tray plow; "
        "sit the frost; frost as one name; salt-drinker; named: Brine / halovore. The frost is the tell. "
        "Hours: Salt of a dish. Hello: \"I drank. The frost stays.\" / \"Water is optional.\" Play: \"A frost of waste.\" / "
        "\"The frost is the tell.\" Temperament catalog Dry, kind frost. Not dry as kind (Tun/tardigrade owns dry). "
        "Not lick (Sheen owns lick). Not many (Knot owns many). Not sand. Not dig. Same `playFor` door. "
        "No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. "
        "Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
        "Seventh leftover of the far den. Next leftover is Beacon (`magneton`). Do not start Beacon.\n"
    )
    # Insert after the Knot line (which may be followed by blank)
    if knot_marker + "\n\n" in rm:
        rm = rm.replace(knot_marker + "\n\n", knot_marker + "\n\n" + brine_entry + "\n", 1)
    else:
        rm = rm.replace(knot_marker + "\n", knot_marker + "\n\n" + brine_entry, 1)
    rm_path.write_text(rm, encoding="utf-8", newline="\n")
    print("brine entry added")
print("has brine x", "- [x] Brine (`halovore`" in rm_path.read_text(encoding="utf-8"))
