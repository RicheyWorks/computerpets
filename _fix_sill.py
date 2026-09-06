from pathlib import Path
p = Path("desktop/renderer/window-play.test.cjs")
b = p.read_bytes()
crlf = b"\r\n" in b
t = b.decode("utf-8").replace("\r\n", "\n")
old = '''test("other guests do not clone Rui's cling — they walk a sill and hop down", () => {
  const target = P.pickTarget([WIN], 80, "amphipod", WORK, P.SPRITE);'''
new = '''test("other guests do not clone Rui's cling — they walk a sill and hop down", () => {
  const target = P.pickTarget([WIN], 80, "fiddler_crab", WORK, P.SPRITE);'''
n = t.count(old)
if n != 1:
    raise SystemExit(f"expected 1, found {n}")
t = t.replace(old, new, 1)
if crlf:
    t = t.replace("\n", "\r\n")
p.write_bytes(t.encode("utf-8"))
print("fixed generic sill guest")
