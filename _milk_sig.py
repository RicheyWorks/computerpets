from pathlib import Path
js = Path(r"C:\Users\730ri\projects\ComputerPets\desktop\renderer\window-play.js").read_text(encoding="utf-8")
for name in ["goldPoint", "sipPoint", "wrapPoint", "snipPoint", "foragePoint", "wagglePoint", "mouthPoint", "billPoint", "weedPoint"]:
    i = js.find("function "+name)
    print(name, "idx", i)
    if i>=0:
        print(" ", js[i:i+120].replace("\n"," | "))
