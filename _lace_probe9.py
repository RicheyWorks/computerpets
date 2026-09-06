from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for name in ["tailsPoint", "songPoint", "weedPoint", "jumpPoint"]:
    i = js.find("function " + name)
    print("===", name)
    print(js[i:i+420])
    print()
# BLACK pick / go / refit exact
i = js.find('if (kind === BLACK)')
print("=== BLACK pick ===")
print(js[i:i+550])
i = js.find('if (target.kind === BLACK)')
print("=== BLACK refit first ===")
print(js[i:i+220])
# exports end
i = js.find("blackOffPath")
print("=== exports area ===")
print(js[i:i+200])
