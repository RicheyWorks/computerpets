# -*- coding: utf-8 -*-
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\n%r" % (label, n, old[:220]))
    return text.replace(old, new, 1)

HUSH_SENT = "Hush cools a lamp-side pane as a lamp shadow: walk into the shadow, sit the cool, then leave. Beacon still owns align."
ARCA_SENT = (
    "Hush cools a lamp-side pane as a lamp shadow: walk into the shadow, sit the cool, then leave. "
    "Arca waits a window stool as a damp blotter: walk onto the stool, sit the wait, then leave. "
    "Hush still owns cool. Ochre still owns reef. Latch still owns drink. Lula still owns loop. Brood still owns emerge. "
    "Beacon still owns align."
)

for f in ["README.md", "desktop/README.md"]:
    p = Path(f)
    t = p.read_text(encoding="utf-8")
    t = once(t, HUSH_SENT, ARCA_SENT, f + " narrative")
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched", f)

# ARCHITECTURE last updated
arch = Path("docs/ARCHITECTURE.md")
t = arch.read_text(encoding="utf-8")
old = "| **Last Updated** | 2026-09-02 (Hush cools a lamp-side pane as a lamp shadow; ninth leftover of the far den done;"
new = "| **Last Updated** | 2026-09-02 (Arca waits a window stool as a damp blotter; tenth leftover of the far den done and closes far ten; Hush leftover still cools a lamp-side pane as a lamp shadow; ninth leftover of the far den done;"
t = once(t, old, new, "arch last updated")
arch.write_text(t, encoding="utf-8", newline="\n")
print("arch ok")

# ROADMAP
rm = Path("docs/ROADMAP.md")
t = rm.read_text(encoding="utf-8")
t = once(
    t,
    "Ninth leftover of the far den. Next leftover is Arca (`cyst`). Do not start Arca.",
    "Ninth leftover of the far den. Arca leftover done (closes far ten).",
    "roadmap hush next",
)
arca_entry = (
    "- [x] Arca (`cyst` / `arca`) waits a real window stool as a damp blotter: walk onto the stool (interior stool — papers damp a traveling cyst waits; not Ochre pane reef, not Latch drip drink, not Lula apron loop, not Felt lean blotter-felt, not Brood emerge soil husk, not Vein damp saucer unfurl, not Brine salt-dish frost, not Knot paperweight many, not Hush lamp-shadow cool; sit the wait; wait as one name; sealed cyst; named: Arca / cyst. The wait is the tell. Hours: Wait of a blotter. Hello: \"Arca. The wait is the tell.\" Play: \"A wake. Review the wait.\" / \"I win by remaining a cyst.\" Temperament catalog Waiting, kind wait. Not reef (Ochre owns reef). Not drink (Latch owns drink). Not loop (Lula owns loop). Not emerge (Brood owns emerge). Not cool (Hush owns cool). Not frost (Brine owns frost). Not many (Knot owns many). Same `playFor` door. No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Tenth leftover of the far den — closes far ten. Next leftover is Boot (`paramecium`). Do not start Boot.\n"
)
# insert after Hush line (line with umbral / hush)
hush_line_end = "Arca leftover done (closes far ten).\n"
if hush_line_end not in t:
    raise SystemExit("hush end marker missing after patch")
# Hush line ends with that now; add blank line + arca after the hush bullet
# Find the hush bullet that now ends with our marker
idx = t.find(hush_line_end)
# after hush line there may be blank then Beacon
insert_at = idx + len(hush_line_end)
t = t[:insert_at] + "\n" + arca_entry + t[insert_at:]
print("inserted arca roadmap")

old = "**Last Updated:** 2026-09-02 (Phase 6 leftover: Hush cools a lamp-side pane as a lamp shadow; ninth leftover of the far den done;"
new = "**Last Updated:** 2026-09-02 (Phase 6 leftover: Arca waits a window stool as a damp blotter; tenth leftover of the far den done and closes far ten; Hush leftover still cools a lamp-side pane as a lamp shadow; ninth leftover of the far den done;"
t = once(t, old, new, "roadmap last updated")
rm.write_text(t, encoding="utf-8", newline="\n")
print("roadmap ok")
