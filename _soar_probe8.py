from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# pickTarget after mantle
i = js.find('leave: "mantled"')
print(js[i:i+280])
# refit
i = js.find("if (target.kind === MANTLE)")
# find mantlePoint in refit
i = js.find("const hold = mantlePoint(win, sprite, work)")
print("refit:", js[i-60:i+180])
# beginPlay insert
i = js.find("function beginPlay(target, petX)")
print("beginPlay prev:", js[i-80:i+40])
# TS pick and typeof
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find('leave: "mantled"')
print("TS pick:", ts[i:i+250])
i = ts.find("typeof MANTLE | typeof SILL")
print("TS union:", ts[i-40:i+60] if i>=0 else "alt")
if i<0:
  i=ts.find("typeof MANTLE")
  print(ts[i-60:i+80])
# house title start
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
i=house.find('test("Gate leftover')
# find semicolon near start for prepend pattern
print("HOUSE TITLE START:", house[i:i+120])
print("next leftover is Soar idx in title area", house.find("next leftover is Soar", i))
print(house[house.find("next leftover is Soar")-20:house.find("next leftover is Soar")+60])
