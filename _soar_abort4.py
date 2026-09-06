from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = cjs.find('test("Gate leftover mantles')
j = cjs.find("shouldAbort", i)
# print all shouldAbort in Gate test until next test or Soar
end = cjs.find('test("Soar leftover', i)
chunk = cjs[i:end]
for line in chunk.splitlines():
  if "shouldAbort" in line or "canStart" in line:
    print(line.strip())
print("====SOAR====")
i = cjs.find('test("Soar leftover spots')
for line in cjs[i:].splitlines():
  if "shouldAbort" in line or "canStart" in line:
    print(line.strip())
