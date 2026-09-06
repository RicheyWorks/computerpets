from pathlib import Path
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for name in ["reefPoint","drinkPoint","loopPoint","emergePoint","reefPath","reefOn","drinkOn","loopOn","emergeOn","WAIT","waitPoint"]:
    print(name, name in js)
# exports
for name in ["reefPoint","drinkPoint","loopPoint","emergePoint","waitPoint","WAIT"]:
    # near end api
    print("export", name, js.rfind(name))
