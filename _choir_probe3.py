from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find playFor properly by brace matching from function playFor
idx = js.find("function playFor(")
assert idx >= 0
i = js.find("{", idx)
depth = 0
for j in range(i, len(js)):
    if js[j] == "{": depth += 1
    elif js[j] == "}":
        depth -= 1
        if depth == 0:
            body = js[idx:j+1]
            break
Path("_choir_playfor.txt").write_text(body, encoding="utf-8")
print("playFor lines", body.count("\n")+1)
print(body[-800])
# thirst-related function names
for m in re.finditer(r"function\s+(\w*[Tt]hirst\w*)", js):
    print("fn", m.group(1), "at", m.start())
for m in re.finditer(r"function\s+(\w*[Pp]laque\w*)", js):
    print("fn", m.group(1), "at", m.start())
# exports
for m in re.finditer(r"playFor|THIRST|thirstPoint|tickThirst|pickThirst", js):
    pass
print("THIRST exports nearby module.exports:")
exp = js.rfind("module.exports")
print(js[exp:exp+2500][:2000])
