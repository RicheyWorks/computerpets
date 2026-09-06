# -*- coding: utf-8 -*-
from pathlib import Path

src = Path("_frill_core.py").read_text(encoding="utf-8")
warts = Path("_cap_warts_fns.js").read_text(encoding="utf-8")
if not warts.endswith("\n"):
    warts += "\n"

# Replace docstring
src = src.replace(
    "Apply Frill shelf leftover across window-play.js (mirror Rob #510).",
    "Apply Cap warts leftover across window-play.js (mirror Frill #511).",
)

# Replace HEADER blocks by finding markers
i0 = src.find("HEADER_OLD_TAIL = (")
i1 = src.find("SHELF_FNS = r'''")
if i0 < 0 or i1 < 0:
    raise SystemExit("header markers missing")

header = (
    "HEADER_OLD_TAIL = (\n"
    '    " Frill shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave. "\n'
    '    "Rob still owns seize. Fan still owns gold. Felt still owns lean. Cape still owns fold. Mast still owns seed. Auger still owns bore. Vein still owns unfurl. "\n'
    '    "This is the first leftover of the fungi den. Others walk a sill. */"\n'
    ")\n"
    "\n"
    "HEADER_NEW_TAIL = (\n"
    '    " Frill shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave. "\n'
    '    "Rob still owns seize. Fan still owns gold. Felt still owns lean. Cape still owns fold. Mast still owns seed. Auger still owns bore. Vein still owns unfurl. "\n'
    '    "This is the first leftover of the fungi den. "\n'
    '    "Cap warts a window apron as a moss cup: walk onto the apron, sit, wart once, sit the cup, then leave. "\n'
    '    "Frill still owns shelf. Seven still owns spot. Sepia still owns flush. Rob still owns seize. Slip still owns ring. "\n'
    '    "This is the second leftover of the fungi den. Others walk a sill. */"\n'
    ")\n"
    "\n"
)

i2 = src.find("'''", i1 + 10)
if i2 < 0:
    raise SystemExit("SHELF_FNS end missing")
i2 = i2 + 3  # after closing '''

fns_block = "WARTS_FNS = r'''\n" + warts + "'''\n"

src = src[:i0] + header + fns_block + src[i2:]

# Now patch the patch_js() body: Frill mirrored Rob; Cap mirrors Frill.
# Simple token swaps where unique enough, then fix the remaining Frill-specific anchors.

pairs = [
    ('SHELF_FNS + "  function beginPlay', 'WARTS_FNS + "  function beginPlay'),
    ('"js shelf fns"', '"js warts fns"'),
    ('"js SHELF const"', '"js WARTS const"'),
    ('"js DUR shelf"', '"js DUR warts"'),
    ('"js playFor oyster"', '"js playFor fly_agaric"'),
    ('"js pickTarget SHELF"', '"js pickTarget WARTS"'),
    ('"js refit SHELF"', '"js refit WARTS"'),
    ('"js approach SHELF"', '"js approach WARTS"'),
    ('"js shelf phases"', '"js warts phases"'),
    ('"js SHELF export const"', '"js WARTS export const"'),
    ('"js shelf fn exports"', '"js warts fn exports"'),
]
for a, b in pairs:
    if a not in src:
        raise SystemExit("missing pair " + a)
    src = src.replace(a, b)

Path("_cap_core_wip.py").write_text(src, encoding="utf-8")
print("wip lines", len(src.splitlines()))
print("has WARTS_FNS", "WARTS_FNS" in src)
print("has wartsPoint", "wartsPoint" in src)
print("still SHELF_FNS", "SHELF_FNS" in src)
