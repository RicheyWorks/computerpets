# -*- coding: utf-8 -*-
from pathlib import Path
import re

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

def mr(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s count=%s" % (label, n))
    return text.replace(old, new, 1)

OLD_NEXT = "Next leftover is Cap. Do not start Cap. Cap (fly agaric) is second fungi — after Frill."
NEW_NEXT = "Cap is done. Second leftover of the fungi den done. Next leftover is Lattice. Do not start Lattice. Lattice (morel) is third fungi — after Cap."
OLD_CHAIN = "Frill is done. First leftover of the fungi den done. Next leftover is Cap. Do not start Cap. Cap (fly agaric) is second fungi — after Frill."
NEW_CHAIN = "Frill is done. First leftover of the fungi den done. Cap is done. Second leftover of the fungi den done. Next leftover is Lattice. Do not start Lattice. Lattice (morel) is third fungi — after Cap."

rm, rnl = load("docs/ROADMAP.md")
n_chain = rm.count(OLD_CHAIN)
print("roadmap chain", n_chain)
if n_chain:
    rm = rm.replace(OLD_CHAIN, NEW_CHAIN)
n_next = rm.count(OLD_NEXT)
print("roadmap next leftover Cap remaining", n_next)
if n_next:
    rm = rm.replace(OLD_NEXT, NEW_NEXT)

cap_bullet = (
    "\n\n- [x] Cap (`fly_agaric` / `cap`) warts a real window apron as a moss cup: walk onto the apron (the apron under the sill — the same furniture family Vee honks as a blotter green, Lula loops as a blotter river, and Clasp grips as a blotter hem; not Vee's honk, not Lula's loop, not Clasp's grip, not Vault's apron grass-plate jump, not Frill's sash-stile timber shelf; white gills, skirt, volva; a warning not lunch; the red is the tell; spots/warts; trade with roots; cup kept my red; she warts, she does not honk, loop, or grip; named: Cap. Warts first. Hello: \"I warned. That was hello.\" Play: \"A wart. The cup kept my red.\" Temperament: plain.), then leave. One window. Warts is the tell — not Frill's `shelf`. Not Seven's `spot`. Not Sepia's `flush`. Not Rob's `seize`. Not Slip's `ring`. Not Vee's `honk`. Not Lula's `loop`. Not Clasp's `grip`. playFor(\"fly_agaric\") returns `warts` (not `cap`, not `fly_agaric`, not `shelf`, not `spot`, not `spots`, not `ring`, not `flush`, not `red`, not `seize`, not `toadstool`, not `honk`, not `loop`, not `grip`, not `sill`). Frill (`oyster`) still owns `shelf`. Seven (`ladybird`) still owns `spot`. Sepia (`cuttlefish`) still owns `flush`. Rob (`robber_fly`) still owns `seize`. Slip (`caecilian`) still owns `ring`. Same `playFor` door. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. No new `/demo` route. Second leftover of the fungi den. Meadow ten stays closed. Hive ten stays closed. Shore ten stays closed. Next leftover is Lattice. Do not start Lattice. Lattice (morel) is third fungi — after Cap."
)

frill_start = "- [x] Frill (`oyster` / `frill`) shelves a real sash stile as a timber shelf:"
idx = rm.find(frill_start)
if idx < 0:
    raise SystemExit("no frill roadmap line")
end = rm.find("\n\n- [x] Spark sits the fifth cyber", idx)
if end < 0:
    end = rm.find("\n- [x] Spark sits the fifth cyber", idx)
if end < 0:
    raise SystemExit("no spark after frill")
# insert after the Frill bullet (end currently points at blank+spark)
rm = rm[:end] + cap_bullet + rm[end:]

rm = mr(
    rm,
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Frill shelves a sash stile as a timber shelf; first leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Cap; catalog stays 220; shelf is the tell; Rob still owns seize; Fan still owns gold; Felt still owns lean; Cape still owns fold; Mast still owns seed; Auger still owns bore)",
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Cap warts a window apron as a moss cup; second leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Lattice; catalog stays 220; warts is the tell; Frill still owns shelf; Seven still owns spot; Sepia still owns flush; Rob still owns seize; Slip still owns ring)",
    "roadmap last updated",
)
save("docs/ROADMAP.md", rm, rnl)
print("ok roadmap")

arch, anl = load("docs/ARCHITECTURE.md")
m = re.search(r"2026-09-02 \(Frill shelves.*?\)", arch)
if not m:
    i = arch.find("2026-09")
    print(repr(arch[i:i+400]) if i>=0 else None)
    raise SystemExit("arch date line missing")
arch = arch[:m.start()] + "2026-09-02 (Cap warts a window apron as a moss cup; second leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Lattice; catalog stays 220; warts is the tell; Frill still owns shelf; Seven still owns spot; Sepia still owns flush; Rob still owns seize; Slip still owns ring)" + arch[m.end():]
save("docs/ARCHITECTURE.md", arch, anl)
print("ok arch")

for path in ["README.md", "desktop/README.md"]:
    text, tnl = load(path)
    old = "This is the ninth leftover of the meadow den. Other guests walk a sill."
    new = "This is the ninth leftover of the meadow den. Cap warts a window apron as a moss cup: walk onto the apron, sit, wart once, sit the cup, then leave. Other guests walk a sill."
    if old in text:
        n = text.count(old)
        print(path, "ninth leftover hits", n)
        text = text.replace(old, new, 1)
        save(path, text, tnl)
        print("ok", path)
    elif "Cap warts a window apron as a moss cup" in text:
        print("already", path)
    else:
        print("warn", path)

Path("_cap_pr_body.md").write_text(
    "## Summary\n"
    "- Cap (fly_agaric / cap) warts a window apron as a moss cup: walk onto the apron, sit, wart once, sit the cup, then leave. playFor(fly_agaric) returns `warts`.\n"
    "- White gills, skirt, volva; a warning not lunch; the red is the tell; spots/warts; trade with roots; cup kept my red. Not cap. Not shelf. Not spot. Not ring. Not flush. Not seize. Frill still owns shelf. Seven still owns spot. Sepia still owns flush. Rob still owns seize. Slip still owns ring.\n"
    "- Same apron family as Vee honk / Lula loop / Clasp grip; she warts, she does not honk, loop, or grip. Second leftover of the fungi den. Catalog stays 220. No new pets. No new /demo route. Next leftover is Lattice (morel). Do not start Lattice.\n"
    "\n"
    "## Test plan\n"
    "- [x] node --test desktop/renderer/window-play.test.cjs desktop/renderer/leftover-house.test.cjs\n"
    "- [x] node --experimental-strip-types --test web/scripts/window-play.test.mjs\n"
    "- [ ] Overlay sit: Cap warts the window apron (same playFor door; no new /demo route)\n",
    encoding="utf-8",
)
print("ok pr body")
