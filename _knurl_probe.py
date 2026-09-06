from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1 occurrence, found %d" % (label, n))
    return text.replace(old, new, 1)

p = ROOT / "web" / "scripts" / "window-play.test.mjs"
t = p.read_text(encoding="utf-8")
print("mjs knobbed_whelk count", t.count("knobbed_whelk"))
print("mjs lugworm count", t.count("lugworm"))
# print nearby context for knobbed_whelk
idx = 0
while True:
    i = t.find("knobbed_whelk", idx)
    if i < 0:
        break
    print("---", i, "---")
    print(t[max(0,i-80):i+80].replace("\n", " | "))
    idx = i + 1
