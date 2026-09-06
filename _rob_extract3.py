from pathlib import Path
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
idxs = []
i = 0
while True:
    j = mjs.find('test("Click', i)
    if j < 0:
        j = mjs.find('test("a moved window refits Click', i)
    if j < 0:
        j = mjs.find('test("the demo window plate walks Click', i)
    if j < 0:
        break
    idxs.append(j)
    i = j + 10
print("idxs", idxs)
# extract consecutive click tests
start = min(idxs) if idxs else -1
pos = start
blocks = []
while pos >= 0:
    title_end = mjs.find('"', pos+6)
    title = mjs[pos+6:title_end]
    if "Click" not in title and "click" not in title:
        break
    end = mjs.find('\ntest("', pos+10)
    if end < 0:
        end = len(mjs)
    blocks.append(mjs[pos:end])
    print("TITLE:", title)
    pos = end + 1
Path("_click_mjs_block.txt").write_text("\n".join(blocks), encoding="utf-8")
print("blocks", len(blocks), "len", sum(len(b) for b in blocks))

# leftover-house Click changes from git
import subprocess
diff = subprocess.check_output(["git","show","3c9546a9","-U0","--","desktop/renderer/leftover-house.test.cjs"], text=True, encoding="utf-8")
Path("_click_house.diff").write_text(diff, encoding="utf-8")
print("house diff lines", len(diff.splitlines()))
