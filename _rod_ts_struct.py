from pathlib import Path
ts_path = Path("web/src/lib/pets/window-play.ts")
ts = ts_path.read_text(encoding="utf-8")
i = ts.find('side: "trumpetrim"')
print("TS pick region:")
print(repr(ts[i:i+550]))
print("====")
i = ts.find('side: "brothcup"')
print(repr(ts[i:i+220]) if i>=0 else "NO BROTHCUP")
