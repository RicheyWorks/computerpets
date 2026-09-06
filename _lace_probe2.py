from pathlib import Path
rooms = Path("web/src/lib/pets/rooms.ts").read_text(encoding="utf-8")
i = rooms.find("MEADOW_KEYS")
print(rooms[i:i+800])
print("---")
# also catalog lacewing
for p in ["web/src/lib/pets/catalog.ts", "web/src/lib/pets/kinds.ts", "web/src/lib/pets/living.ts"]:
    t = Path(p).read_text(encoding="utf-8") if Path(p).exists() else ""
    print(p, "exists", Path(p).exists(), "len", len(t))
