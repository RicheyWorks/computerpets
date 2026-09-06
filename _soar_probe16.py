from pathlib import Path
for p in ["web/scripts/window-play.test.mjs","desktop/renderer/window-play.test.cjs"]:
  t=Path(p).read_text(encoding="utf-8")
  print(p, t[:400])
# gate_apply - did it patch side union?
g=Path("_gate_apply.py").read_text(encoding="utf-8")
print("mantledish in apply", "mantledish" in g)
print("stationdish" in g, "side union" in g.lower())
# veil apply
v=Path("_veil_apply.py").read_text(encoding="utf-8") if Path("_veil_apply.py").exists() else ""
print("veil reefledge type patch", "reefledge" in v and "stationdish" in v)
