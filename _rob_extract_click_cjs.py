from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
start = cjs.find('test("Click rights a window stool')
print("start", start)
# find end of this test - next test after Click
end = cjs.find('\ntest("', start + 10)
print("end", end)
Path("_click_cjs_extracted.txt").write_text(cjs[start:end], encoding="utf-8")
print("len", end-start)
print(cjs[start:start+2000])
