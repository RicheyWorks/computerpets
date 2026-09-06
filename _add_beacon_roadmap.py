from pathlib import Path
rm_path = Path("docs/ROADMAP.md")
rm = rm_path.read_text(encoding="utf-8")
if "- [x] Beacon (`magneton`" in rm:
    print("already")
else:
    brine_line = None
    for line in rm.splitlines():
        if "Brine (`halovore`" in line and line.strip().startswith("- [x]"):
            brine_line = line
            break
    if not brine_line:
        raise SystemExit("brine missing")
    beacon_entry = (
        "- [x] Beacon (`magneton` / `beacon`) aligns a real sash parting bead as a ruler line: walk onto the bead "
        "(interior parting bead — vertical thin bead between sash and jamb / pencil-line of the frame a field swimmer aligns; "
        "not Bandit jamb-as-ruler inspect, not Anchor parting-bead pencil hitch, not Stem parting-bead blotter stilt, "
        "not Shift parting-bead aim, not Flux glass field, not Gauss orbit, not Brine salt-dish frost, not Knot paperweight many; "
        "sit the north; align as one name; field swimmer; named: Beacon / magneton. The north is the tell. "
        "Hours: Ruler of a line. Hello: \"Beacon. The north is the tell.\" / \"North is food.\" Play: \"I sat the north.\" / "
        "\"Aligned.\" Temperament catalog Aligned, kind align. Not field as kind (Flux owns field). "
        "Not north as kind. Not inspect (Bandit owns inspect). Not hitch (Anchor owns hitch). Not stilt (Stem owns stilt). "
        "Not frost (Brine owns frost). Same `playFor` door. "
        "No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. "
        "Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
        "Eighth leftover of the far den. Next leftover is Hush (`umbral`). Do not start Hush.\n"
    )
    rm = rm.replace(brine_line + "\n", brine_line + "\n\n" + beacon_entry, 1)
    rm_path.write_text(rm, encoding="utf-8", newline="\n")
    print("added")
print("- [x] Beacon", "- [x] Beacon (`magneton`" in rm_path.read_text(encoding="utf-8"))
