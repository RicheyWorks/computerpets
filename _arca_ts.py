from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# full quiet fns from quietLampDir through quietOffPath end
start = js.find("  function quietLampDir")
end = js.find("  function wrapPoint")  # maybe wrong
# find what follows quietOffPath
end = js.find("\n  function ", js.find("function quietOffPath")+10)
fns = js[start:end]
Path("wait_fns_template.txt").write_text(fns, encoding="utf-8")
print("fns len", len(fns))
print(fns[:500])
print("...END...")
print(fns[-300:])

ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# PlayPhase end with quiet
i = ts.find("quiet-on")
print("\nPlayPhase quiet context:")
print(ts[i-80:i+200])
i = ts.find("lampshadow")
print("\nside:", ts[i-60:i+80])
i = ts.find("quieted")
print("\nleave:", ts[i-60:i+80])
# quiet DUR in ts
i = ts.find("quietOn")
print("\ndur ts:", ts[i-40:i+120])
# export quiet in ts?
print("export quietPoint", "export function quietPoint" in ts)
print("umbral ts", ts.count("umbral"))
