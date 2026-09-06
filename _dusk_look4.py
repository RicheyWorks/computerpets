from pathlib import Path
for name in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs"]:
    t = Path(name).read_text(encoding="utf-8")
    print("====", name)
    print("dusk leftover tests", t.count('test("Dusk leftover rims'))
    print("dusk refit tests", t.count('test("a moved window refits Dusk'))
    i = t.find('test("Dusk leftover rims')
    print("idx", i)
    if i>=0:
        print(t[i:i+180])
    print("test( count", t.count("test("))