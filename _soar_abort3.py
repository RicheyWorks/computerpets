from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = cjs.find('test("Gate leftover')
j = cjs.find("shouldAbort", i)
print(cjs[j-80:j+200])
print("====")
# How many shouldAbort two-arg true asserts exist?
import re
for m in re.finditer(r'assert\.equal\(P\.shouldAbort\([^)]+\),\s*true\)', cjs):
  print(m.group(0)[:120])
