from pathlib import Path
import re

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD:{old[:220]!r}")
    return text.replace(old, new, 1)

mjs_path = Path("web/scripts/window-play.test.mjs")
mjs = mjs_path.read_text(encoding="utf-8")
idx = mjs.find("other guests do not clone Rui")
chunk_end = mjs.find("});", idx) + 3
chunk = mjs[idx:chunk_end]
needle = 'pickTarget([WIN], 80, "silica", WORK, P.SPRITE)'
repl = 'pickTarget([WIN], 80, "terminator", WORK, P.SPRITE)'
if needle in chunk:
    mjs = mjs[:idx] + chunk.replace(needle, repl, 1) + mjs[chunk_end:]
    mjs_path.write_text(mjs, encoding="utf-8", newline="\n")
    print("mjs other-guests fixed")
elif "terminator" in chunk:
    print("mjs other-guests ok")
else:
    print("mjs chunk", chunk[chunk.find("pickTarget"):chunk.find("pickTarget")+90])

arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
if "Shard facets a sash gap" in arch and "next leftover is Dusk" in arch:
    print("arch already")
else:
    m = re.search(r"\| \*\*Last Updated\*\* \| 2026-09-02 \([^)]+\) \|", arch)
    if not m:
        raise SystemExit("arch last updated missing")
    old = m.group(0)
    new = (
        "| **Last Updated** | 2026-09-02 (Shard facets a sash gap as an inkstone; fourth leftover of the far den done; "
        "Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; "
        "Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; "
        "Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; "
        "Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; "
        "meadow ten closed; hive ten closed; shore ten is closed; next leftover is Dusk; catalog stays 220; "
        "facet is the tell; Nimbus still owns float; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; "
        "Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; "
        "Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; "
        "Pebble still owns puff; Floss still owns dust; Tun still owns dry) |"
    )
    arch = once(arch, old, new, "arch")
    Path("docs/ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")
    print("arch updated")

rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
nimbus_line = None
for line in rm.splitlines():
    if "Nimbus (`nimbus`" in line and line.strip().startswith("- [x]"):
        nimbus_line = line
        break
if not nimbus_line:
    raise SystemExit("nimbus roadmap line missing")
shard_entry = (
    "- [x] Shard (`silica` / `shard`) facets a real sash gap as an inkstone: walk into the gap "
    "(left sash gap as an inkstone face a living crystal facets; not Mortar left inkstone-cell daub, "
    "not Mane right wood-wound teeth, not Nimbus methane-bowl mid pane, not Choir blotter air, not Gleam lamp glass; "
    "sharp facet; living crystal; one mineral guest; named: Shard / Silica. The facet is the tell. "
    "Hours: Edge of a treaty. Hello: \"I faceted. That was hello.\" Play: \"A facet. Review the stone.\" / "
    "\"I win by remaining a crystal.\" Temperament: cool. Not silica as kind. Not shard as kind. Not daub. Not teeth. "
    "Not float. Not plane. Not edge. Same `playFor` door. No new `/demo` route. Sleep, hide, leave, rest, the keeper card, "
    "and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
    "Fourth leftover of the far den. Next leftover is Dusk (`terminator`). Do not start Dusk.\n"
)
if "Shard (`silica`" not in rm and "Silica (`silica`" not in rm:
    rm = rm.replace(nimbus_line + "\n", nimbus_line + "\n\n" + shard_entry, 1)
    print("roadmap entry added")
else:
    print("roadmap entry exists")

moved = rm.count("Next leftover is Silica (`silica`). Do not start Silica.")
rm = rm.replace(
    "Next leftover is Silica (`silica`). Do not start Silica.",
    "Next leftover was Silica (`silica`); Shard facets. Next leftover is Dusk (`terminator`). Do not start Dusk.",
)
print("roadmap next pins", moved)

m = re.search(r"\*\*Last Updated:\*\* 2026-09-02 \(Phase 6 leftover: [^)]+\)", rm)
if not m:
    raise SystemExit("roadmap footer missing")
old = m.group(0)
if "Shard facets a sash gap" not in old:
    new = (
        "**Last Updated:** 2026-09-02 (Phase 6 leftover: Shard facets a sash gap as an inkstone; fourth leftover of the far den done; "
        "Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; "
        "Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; "
        "Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; "
        "Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; "
        "meadow ten closed; hive ten closed; shore ten is closed; next leftover is Dusk; catalog stays 220; "
        "facet is the tell; Nimbus still owns float; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; "
        "Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; "
        "Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; "
        "Pebble still owns puff; Floss still owns dust; Tun still owns dry)"
    )
    rm = once(rm, old, new, "roadmap footer")
    print("roadmap footer updated")
else:
    print("roadmap footer already")
Path("docs/ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")

for p in ["README.md", "desktop/README.md"]:
    text = Path(p).read_text(encoding="utf-8")
    if "Shard facets a sash gap as an inkstone" in text:
        print(p, "already")
        continue
    old = (
        "Nimbus floats a mid pane as a methane bowl: walk onto the pane, sit the methane-bowl membrane, float once, sit the cold, then leave. "
        "Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. "
        "Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
        "Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    )
    new = (
        "Shard facets a sash gap as an inkstone: walk into the gap, sit the facet, then leave. "
        "Nimbus still owns float. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. "
        "Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
        "Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    )
    text = once(text, old, new, p)
    Path(p).write_text(text, encoding="utf-8", newline="\n")
    print(p, "updated")
print("docs done")
