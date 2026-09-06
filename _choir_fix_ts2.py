from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find("lampglass")
# find type definition - search backwards for |
start = ts.rfind("|", 0, i) - 80
print("SIDE UNION AREA:")
print(ts[max(0,i-200):i+80])
print("\nLEAVE UNION AREA:")
i = ts.find('"thirsted"')
# first occurrence in type
print(ts[max(0,i-200):i+80])
print("\nPHASE AREA:")
i = ts.find('"thirst-off"')
print(ts[max(0,i-120):i+100])
