from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d" % (label, n))
    return text.replace(old, new, 1)

rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
shard_line = None
for line in rm.splitlines():
    if "Shard (`silica`" in line and line.strip().startswith("- [x]"):
        shard_line = line
        break
if not shard_line:
    raise SystemExit("no shard line")
dusk_entry = (
    "- [x] Dusk (`terminator` / `dusk`) rims a real lamp-side stile as a lamp-edge: walk onto the stile "
    "(lamp-side stile as a lamp-edge a twilight walker rims; not Night's lamp-side stile dusk run, "
    "not Penny's dock-shade flare, not Swing's lamp-arm sing, not Ghost's lamp-side glass week, "
    "not Gleam's bright pane lamp glass, not Shard's sash-gap inkstone, not Miso's top ledge; "
    "thin rim; twilight walker; one rim-bound guest; named: Dusk / terminator. The rim is the tell. "
    "Hours: Rim of a treaty. Hello: \"I kept the rim. Hello.\" Play: \"An edge. Review the country.\" / "
    "\"I win by remaining a rim.\" Temperament: rim-bound. Not dusk as kind (Night/walleye owns dusk). "
    "Not week. Not creep. Not facet. Not float. Not terminator as kind. Not ledge. Same `playFor` door. "
    "No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. "
    "Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
    "Fifth leftover of the far den. Next leftover is Knot (`nexus`). Do not start Knot.\n"
)
if "rims a real lamp-side stile" in rm:
    print("already")
else:
    rm = once(rm, shard_line + "\n", shard_line + "\n\n" + dusk_entry, "insert dusk")
    Path("docs/ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")
    print("inserted")