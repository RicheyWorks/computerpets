from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = cjs.find('test("Soar leftover')
print(cjs[i:i+200])
# find shouldAbort in soar test
j = cjs.find("shouldAbort", i)
print("soar shouldAbort:", cjs[j-20:j+200])
# also check canStart export
