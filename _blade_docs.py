from pathlib import Path

def load(p):
    raw = Path(p).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text, nl

def save(p, text, nl):
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(p).write_bytes(text.encode("utf-8"))

def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit("MISSING: " + label + " in current")
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

HEADER = (
    "Chirp songs a window stool as a grass dish: walk onto the stool, sit the song, hold the night, then leave. "
    "Brood still owns emerge. Gecko still owns chirp. Swing still owns sing. Drum still owns drum. Hum still owns drone. Thrum still owns forage. "
    "This is the first leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Blade leafs a sash horn as a leaf rim: walk onto the horn, sit the leaf, still the green, then leave. "
    "Chirp still owns song. Twig still owns freeze. Seven still owns spot. Fold still owns pray. Disc still owns snip. Vein still owns unfurl. Grin still owns still. "
    "This is the second leftover of the meadow den."
)

LAST_OLD = (
    "2026-09-01 (Chirp songs a window stool as a grass dish; first leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Blade; catalog stays 220; song is the tell; "
    "Brood still owns emerge; gecko still owns chirp; Swing still owns sing; Drum still owns drum; "
    "Hum still owns drone; Thrum still owns forage)"
)
LAST_NEW = (
    "2026-09-01 (Blade leafs a sash horn as a leaf rim; second leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Vault; catalog stays 220; leaf is the tell; "
    "Chirp still owns song; Twig still owns freeze; Seven still owns spot; Fold still owns pray; "
    "Disc still owns snip; Vein still owns unfurl; Grin still owns still; gecko still owns chirp)"
)

ROADMAP_LAST_OLD = (
    "2026-09-01 (Phase 6 leftover: Chirp songs a window stool as a grass dish; first leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Blade; catalog stays 220; song is the tell; "
    "Brood still owns emerge; gecko still owns chirp; Swing still owns sing; Drum still owns drum; "
    "Hum still owns drone; Thrum still owns forage)"
)
ROADMAP_LAST_NEW = (
    "2026-09-01 (Phase 6 leftover: Blade leafs a sash horn as a leaf rim; second leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Vault; catalog stays 220; leaf is the tell; "
    "Chirp still owns song; Twig still owns freeze; Seven still owns spot; Fold still owns pray; "
    "Disc still owns snip; Vein still owns unfurl; Grin still owns still; gecko still owns chirp)"
)

BLADE_DONE = (
    "Blade is done. Second leftover of the meadow den done. Hive ten stays closed. Shore ten stays closed. "
    "Next leftover is Vault. Do not start Vault."
)

for p in ["README.md", "desktop/README.md"]:
    text, nl = load(p)
    text = must_replace(text, HEADER, HEADER_NEW, p + " header")
    save(p, text, nl)
    print("ok", p)

arch, nl = load("docs/ARCHITECTURE.md")
arch = must_replace(arch, LAST_OLD, LAST_NEW, "arch last")
save("docs/ARCHITECTURE.md", arch, nl)
print("ok arch")

road, nl = load("docs/ROADMAP.md")
n = road.count("Next leftover is Blade. Do not start Blade.")
if n < 1:
    raise SystemExit("no next leftover Blade in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Blade. Do not start Blade.",
    BLADE_DONE,
)

road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

BLADE_BULLET = (
    "\n- [x] Blade (`katydid` / `blade`) leafs a real sash horn as a leaf rim: walk onto the horn "
    "(the meeting-rail / sash horn — the same furniture family Blush stones as a pink desert rock and Eft trails as a moss saucer, "
    "not Chirp's window-stool grass-dish song, not Twig's sash-muntin pencil-stem freeze, not Seven's window-box leaf dish spot, "
    "not Fold's window-box stem green-hinge pray, not Disc's window-box leaf foliage snip, not Vein's sash-pocket unfurl, not Grin's still; "
    "the leaf is the tell; she sits then stills then sits; wings are leaves; she is not a grasshopper; named: Blade. Leaf first. "
    "Hello: \"I sat the leaf. Hello.\" Play: \"A still. Review the leaf.\" Temperament: leafed.), then leave. One window. "
    "The leaf is the tell — not Chirp's `song`. Not Twig's `freeze`. Not Seven's `spot`. Not Fold's `pray`. Not Disc's `snip`. Not Grin's `still`. Not Pad's `chirp`. "
    "playFor(\"katydid\") returns `leaf` (not `blade`, not `still`, not `vault`, not `song`, not `chirp`, not `sing`, not `hop`, not `leap`, not `emerge`, not `freeze`, not `pray`, not `spot`, not `sill`). "
    "Chirp (`field_cricket`) still owns `song`. Twig (`stick`) still owns `freeze`. Seven (`ladybird`) still owns `spot`. "
    "Fold (`mantis`) still owns `pray`. Disc (`leafcutter`) still owns `snip`. Vein (`maidenhair`) still owns `unfurl`. Grin (`tuatara`) still owns `still`. Gecko (`gecko`) still owns `chirp`. "
    "Same `playFor` door. `/demo/blade` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Second leftover of the meadow den. Hive ten stays closed. Shore ten stays closed. Next leftover is Vault. Do not start Vault.\n"
)

marker = "- [x] Chirp (`field_cricket` / `chirp`) songs a real window stool as a grass dish"
if marker not in road:
    raise SystemExit("MISSING chirp bullet")
idx = road.find(marker)
end = road.find("\n- [x] ", idx + 10)
if end < 0:
    raise SystemExit("MISSING bullet after chirp")
road = road[:end] + BLADE_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "blade-done-replaced-count-was", n)
