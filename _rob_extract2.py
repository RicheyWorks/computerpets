from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
# all Click-related tests
idxs = []
i = 0
while True:
    j = cjs.find('test("Click', i)
    if j < 0:
        j = cjs.find("test('Click", i)
    if j < 0:
        break
    idxs.append(j)
    i = j + 10
print("Click tests at", idxs)
# extract from first Click rights to before next non-click guest major section... 
# Better: extract from Click rights through last Click-related until Snout-style pattern of consecutive tests
start = cjs.find('test("Click rights a window stool')
# find all tests that mention Click or click_beetle after start until we hit a test that doesn't
pos = start
blocks = []
while pos >= 0 and pos < len(cjs):
    if not (cjs.startswith('test("Click', pos) or cjs.startswith('test("a moved window refits Click', pos) or cjs.startswith('test("the demo window plate walks Click', pos) or 'click_beetle' in cjs[pos:pos+120]):
        # check title
        title_end = cjs.find('"', pos+6)
        title = cjs[pos+6:title_end]
        if "Click" not in title and "click" not in title.lower():
            break
    end = cjs.find('\ntest("', pos+10)
    if end < 0:
        end = len(cjs)
    blocks.append(cjs[pos:end])
    pos = end + 1
print("blocks", len(blocks))
for b in blocks:
    print("TITLE:", b[6:b.find('"',6)])
Path("_click_cjs_block.txt").write_text("\n".join(blocks), encoding="utf-8")
print("total len", sum(len(b) for b in blocks))
