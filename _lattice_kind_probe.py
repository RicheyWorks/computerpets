from pathlib import Path
t = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("typeof WARTS", t.find("typeof WARTS"))
print("typeof SHELF", t.find("typeof SHELF"))
i3 = t.find("export type WindowPlayKind")
print("WindowPlayKind", i3)
print(t[i3:i3+600] if i3>=0 else "NO")
# also PlayKind
print("export type PlayKind", t.find("export type PlayKind"))
