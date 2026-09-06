from pathlib import Path
cat = Path("web/src/lib/pets/catalog.ts").read_text(encoding="utf-8")
for key in ["lacewing", "earwig", "forceps", "jewelwing", "swallowtail"]:
    i = cat.lower().find(key)
    print("===", key, i)
    if i >= 0:
        print(cat[max(0,i-200):i+600])
        print()
