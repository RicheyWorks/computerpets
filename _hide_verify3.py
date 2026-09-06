from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find function pickTarget
i = js.find("function pickTarget")
print("pickTarget at", i)
# find all kind === HOLE and kind === SPOTS within pickTarget until next function
# crude: from pickTarget to function refitTarget or similar
j = js.find("\n  function ", i+10)
print("next function at", j, js[j:j+40])
body = js[i:j]
print("SPOTS in pick", body.count("kind === SPOTS"))
print("HOLE in pick", body.count("kind === HOLE"))
print("PRAY in pick", body.count("kind === PRAY"))
print("WRAP in pick", body.count("kind === WRAP"))
# show around HOLE in pick
k = body.find("kind === HOLE")
print("HOLE in pick body", k, repr(body[k-100:k+150]) if k>=0 else None)
# smoke pickTarget
WP = require = __import__("importlib").util.spec_from_file_location
import importlib.util
spec = importlib.util.spec_from_file_location("wp", "desktop/renderer/window-play.js")
# use node instead
