from pathlib import Path
js = Path(r"C:\Users\730ri\projects\ComputerPets\desktop\renderer\window-play.js").read_text(encoding="utf-8")
for n in ["function knobPoint", "function huntPoint", "function raspPoint", "knobOn:", "huntOn:", "raspOn:", "buryOn:", "rollOn:", "bandOn:", "KNOBS", "knobsPoint", "knobs-on"]:
    print(n, js.count(n))
