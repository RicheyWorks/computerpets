mjs=open("web/scripts/window-play.test.mjs",encoding="utf-8").read()
for key in ["katydid", "leafrim", "leaf-rim", "Blade", "field_cricket", "grasshopper", "leafHold"]:
  print(key, mjs.count(key))
# find last few tests
tests=[i for i,l in enumerate(mjs.splitlines()) if l.startswith("test(")]
print("test count", len(tests))
for i in tests[-5:]:
  print(i+1, mjs.splitlines()[i][:160])
