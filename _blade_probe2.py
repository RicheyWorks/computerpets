from pathlib import Path
r = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
marker = "- [x] Chirp (`field_cricket` / `chirp`)"
idx = r.find(marker)
print("idx", idx)
nl = r.find("\n", idx)
print("line len", nl - idx)
print("TAIL:", r[idx:nl][-550:])
print("AFTER:", repr(r[nl:nl+120]))
# also get house title full and house katydid block
h = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
for line in h.splitlines():
    if "Chirp leftover songs" in line:
        print("HOUSE FULL LEN", len(line))
        Path("_blade_house_title.txt").write_text(line, encoding="utf-8")
        break
# get chirp asserts block end
i = h.find('assert.equal(WP.playFor("field_cricket"), "song");')
print("house song block:", repr(h[i:i+700]))
