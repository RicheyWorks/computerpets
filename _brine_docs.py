# -*- coding: utf-8 -*-
from pathlib import Path
import re

HERE = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\nOLD START: %r" % (label, n, old[:240]))
    return text.replace(old, new, 1)

README_OLD = (
    "Knot manys a window stool as a paperweight: walk onto the stool, sit the colony, then leave. "
    "Dusk still owns rim. Snap still owns count. Night still owns dusk. Shard still owns facet. Nimbus still owns float."
)
README_NEW = (
    "Brine frosts a window stool as a salt dish: walk onto the stool, sit the frost, then leave. "
    "Knot still owns many. Tun still owns dry. Sheen still owns lick. Dusk still owns rim. Snap still owns count."
)

for p in ["README.md", "desktop/README.md"]:
    text = (HERE / p).read_text(encoding="utf-8")
    text = once(text, README_OLD, README_NEW, p)
    (HERE / p).write_text(text, encoding="utf-8", newline="\n")
    print(p, "updated")

arch = (HERE / "docs" / "ARCHITECTURE.md").read_text(encoding="utf-8")
m = re.search(r"\| \*\*Last Updated\*\* \| 2026-09-02 \([^)]+\) \|", arch)
if not m:
    raise SystemExit("arch last updated missing")
old = m.group(0)
new = (
    "| **Last Updated** | 2026-09-02 (Brine frosts a window stool as a salt dish; seventh leftover of the far den done; "
    "Knot leftover still manys a window stool as a paperweight; sixth leftover of the far den done; "
    "Dusk leftover still rims a lamp-side stile as a lamp-edge; fifth leftover of the far den done; "
    "Shard leftover still facets a sash gap as an inkstone; fourth leftover of the far den done; "
    "Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; "
    "Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; "
    "Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; "
    "Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; "
    "meadow ten closed; hive ten closed; shore ten is closed; next leftover is Beacon; catalog stays 220; "
    "frost is the tell; Knot still owns many; Tun still owns dry; Sheen still owns lick; Dusk still owns rim; Snap still owns count; Night still owns dusk; Shard still owns facet; Nimbus still owns float; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; "
    "Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; "
    "Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; "
    "Pebble still owns puff; Floss still owns dust) |"
)
arch = once(arch, old, new, "arch")
(HERE / "docs" / "ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")
print("arch updated")

rm = (HERE / "docs" / "ROADMAP.md").read_text(encoding="utf-8")
knot_line = None
for line in rm.splitlines():
    if "Knot (`nexus`" in line and line.strip().startswith("- [x]"):
        knot_line = line
        break
if not knot_line:
    raise SystemExit("knot roadmap line missing")
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
if "Brine (`halovore`" not in rm:
    rm = rm.replace(knot_line + "\n", knot_line + "\n\n" + brine_entry, 1)
    print("roadmap entry added")
else:
    print("roadmap entry exists")

n = rm.count("Next leftover is Brine (`halovore`). Do not start Brine.")
rm = rm.replace(
    "Next leftover is Brine (`halovore`). Do not start Brine.",
    "Next leftover was Brine (`halovore`); Brine frosts. Next leftover is Beacon (`magneton`). Do not start Beacon.",
)
print("roadmap next pins", n)
# also update Knot's "Next leftover is Brine" inside its entry if still present as Do not start
n2 = rm.count("Next leftover is Brine (`halovore`). Do not start Brine.")
print("remaining brine do-not-start", n2)

m = re.search(r"\*\*Last Updated:\*\* 2026-09-02 \(Phase 6 leftover: [^)]+\)", rm)
if not m:
    raise SystemExit("roadmap footer missing")
old = m.group(0)
new = (
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Brine frosts a window stool as a salt dish; seventh leftover of the far den done; "
    "Knot leftover still manys a window stool as a paperweight; sixth leftover of the far den done; "
    "Dusk leftover still rims a lamp-side stile as a lamp-edge; fifth leftover of the far den done; "
    "Shard leftover still facets a sash gap as an inkstone; fourth leftover of the far den done; "
    "Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; "
    "Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; "
    "Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; "
    "Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; "
    "meadow ten closed; hive ten closed; shore ten is closed; next leftover is Beacon; catalog stays 220; "
    "frost is the tell; Knot still owns many; Tun still owns dry; Sheen still owns lick; Dusk still owns rim; Snap still owns count; Night still owns dusk; Shard still owns facet; Nimbus still owns float; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; "
    "Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; "
    "Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; "
    "Pebble still owns puff; Floss still owns dust)"
)
rm = once(rm, old, new, "roadmap footer")
(HERE / "docs" / "ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")
print("roadmap updated")
