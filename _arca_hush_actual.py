from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = cjs.find('test("Hush leftover')
print(cjs[i:i+800])
print("====")
# frost DUR and size for reference
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for i,line in enumerate(js.splitlines(),1):
    if "frostOn" in line or "frostHold" in line or 'kind === FROST) return w' in line:
        print(f"{i}:{line}")
# extract coolPath for once pattern
start=js.find("  function coolPath")
end=js.find("\n  function ", start+10)
print("coolPath:")
print(js[start:end])
