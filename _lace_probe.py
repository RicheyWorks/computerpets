from pathlib import Path
rooms = Path("web/src/lib/pets/rooms.ts").read_text(encoding="utf-8")
i = rooms.find('id: "meadow"')
print("meadow idx", i)
print(rooms[i:i+3000] if i >= 0 else "NO MEADOW")
