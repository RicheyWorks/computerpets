from pathlib import Path
# show end of Gate test for abort/refit pattern
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = cjs.find('test("Gate leftover mantles')
end = cjs.find('test("Soar leftover', i)
chunk = cjs[i:end]
# last 60 lines of Gate test
lines = chunk.splitlines()
for line in lines[-70:]:
  print(line)
