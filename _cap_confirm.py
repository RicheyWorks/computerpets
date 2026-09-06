from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
checks = {
  "oyster->shelf": 'key === "oyster") return SHELF' in js,
  "ladybird->spot": 'key === "ladybird") return SPOT' in js,
  "robber_fly->seize": 'key === "robber_fly") return SEIZE' in js,
  "fly_agaric absent (falls to SILL)": 'key === "fly_agaric"' not in js,
  "cuttlefish->flush": 'key === "cuttlefish") return FLUSH' in js,
}
for k,v in checks.items():
  print(k, v)
print("branch tip", Path(".git/HEAD").read_text().strip())
