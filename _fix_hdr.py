from pathlib import Path
def once(t, old, new, label):
    n = t.count(old)
    if n != 1:
        raise SystemExit(f"{label}: {n}")
    return t.replace(old, new, 1)

old = (
    "Silica facets a cool pane as an inkstone: walk onto the pane, sit the inkstone face, facet once, sit the edge, then leave. "
    "Nimbus still owns float. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
)
new = (
    "Shard facets a sash gap as an inkstone: walk into the gap, sit the facet, then leave. "
    "Nimbus still owns float. Mortar still owns daub. Mane still owns teeth. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. "
    "Pebble still owns puff. Floss still owns dust. Tun still owns dry. "
)
for path in ["desktop/renderer/window-play.js", "web/src/lib/pets/window-play.ts"]:
    t = Path(path).read_text(encoding="utf-8")
    if "Shard facets a sash gap" in t:
        print(path, "already Shard sash")
        continue
    if old not in t:
        # show nearby
        i = t.find("facets a")
        print(path, "MISSING old; nearby:", repr(t[i-20:i+180]) if i>=0 else "no facets")
        continue
    t = once(t, old, new, path)
    Path(path).write_text(t, encoding="utf-8", newline="\n")
    print(path, "header fixed")
