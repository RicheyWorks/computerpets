from pathlib import Path
import re
rpath = Path("docs/ROADMAP.md")
r = rpath.read_text(encoding="utf-8")
lines = r.splitlines()
tube_idx = None
for i, line in enumerate(lines):
    if "sea_cucumber" in line and "papillaes" in line:
        tube_idx = i
        break
if tube_idx is None:
    raise SystemExit("Tube missing")
veil_line = (
    "- [x] Veil (lionfish / veil) rays a real window apron as a reef ledge: walk onto the apron "
    "(window apron - she rays; The fins are the tell / Review the rays). "
    "Catalog stays 220. Gate now mantles; next leftover is Soar (eagle_ray). Do not start Soar."
)
# restore house-voice with backticks via chr
bt = chr(96)
veil_line = (
    "- [x] Veil (" + bt + "lionfish" + bt + " / " + bt + "veil" + bt + ") rays a real window apron as a reef ledge: walk onto the apron "
    "(window apron - she rays, she does not veil/lionfish/papillae/station/rasps/bars/tentacles/valleys/reef/many/soar; "
    "a red lionfish; not Tube sand-well papillae, not Scrub station-dish station, not Scrape rock-plate rasps, "
    "not Paint wreath-cup bars, not Wreath column-dish tentacles, not Ridge boulder-dish valleys, not Ochre damp-blotter reef, "
    "not Cap moss-cup warts, not Hook lamp-post soar; The fins are the tell / Review the rays). "
    "Catalog stays 220. Gate now mantles; next leftover is Soar (" + bt + "eagle_ray" + bt + "). Do not start Soar."
)
gate_line = (
    "- [x] Gate (" + bt + "giant_clam" + bt + " / " + bt + "gate" + bt + ") mantles a real window stool as a mantle dish: walk onto the stool "
    "(window stool - she mantles, she does not gate/giant_clam/open/rise/clamp/lid/rays/papillae/station/rasps/bars/tentacles/valleys/blush/reef/many/soar; "
    "a giant clam; not Veil apron reef-ledge rays, not Tube sand-well papillae, not Scrub station-dish station, not Scrape rock-plate rasps, "
    "not Paint wreath-cup bars, not Wreath column-dish tentacles, not Ridge boulder-dish valleys, not Rose salt-pan blush, not Ochre damp-blotter reef, "
    "not Knot paperweight many, not Chamber rise, not Cone clamp, not Disk open, not Cup lid, not Hook soar; The mantle is the tell / Review the mantle). "
    "Catalog stays 220. Next leftover is Soar (" + bt + "eagle_ray" + bt + "). Do not start Soar."
)
insert_after = tube_idx
extra = []
joined = "\n".join(lines)
if "lionfish" not in joined or "rays a real window apron" not in joined:
    extra.append(veil_line)
if "giant_clam" not in joined or "mantles a real window stool" not in joined:
    extra.append(gate_line)
for j, e in enumerate(extra):
    lines.insert(insert_after + 1 + j, e)
r = "\n".join(lines) + ("\n" if r.endswith("\n") else "")
r = re.sub(
    r"\*\*Last Updated:\*\* 2026-09-02 \([^)]+\)",
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Gate leftover mantles a window stool as a mantle dish; eighth leftover of remaining reef/sea after well ten closed; Veil leftover still rays; catalog 220)",
    r,
    count=1,
)
rpath.write_text(r, encoding="utf-8")
print("roadmap patched, extra", len(extra))

for readme in [Path("README.md"), Path("desktop/README.md")]:
    txt = readme.read_text(encoding="utf-8")
    if "Gate mantles" in txt:
        print(str(readme), "already")
        continue
    needle = "Veil rays a window apron as a reef ledge."
    if needle not in txt:
        raise SystemExit("missing needle in " + str(readme))
    txt = txt.replace(needle, "Gate mantles a window stool as a mantle dish. " + needle, 1)
    readme.write_text(txt, encoding="utf-8")
    print(str(readme), "patched")
