from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# extract full header comment between /** and */
start = js.find("/**")
end = js.find("*/", start) + 2
print(repr(js[start:end][-800:]))
print("---DUR black---")
i = js.find("blackOn:")
print(repr(js[i:i+90]))
# house lacewing sill count
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("house lacewing sill", house.count('playFor("lacewing"), "sill"'))
print("cjs lacewing sill", Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").count('playFor("lacewing"), "sill"'))
print("mjs lacewing sill", Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8").count('playFor("lacewing"), "sill"'))
# generic pin
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print("cjs lacewing pick", cjs.count('pickTarget([WIN], 80, "lacewing"'))
print("cjs jewelwing pick", cjs.count('pickTarget([WIN], 80, "jewelwing"'))
# jewel refit test marker
i = cjs.find("Jewel's stream-jewel black")
print("jewel refit at", i)
i = cjs.find('test("a moved window refits Jewel')
print("end jewel block find next test after")
# find last jewel test end
