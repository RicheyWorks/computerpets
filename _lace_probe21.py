from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = cjs.find('test("a moved window refits Jewel\'s stream-jewel black')
print(cjs[i:i+2200])
print("====LACE====")
i = cjs.find('test("a moved window refits Lace\'s leaf-dish net')
print(cjs[i:i+1800])
