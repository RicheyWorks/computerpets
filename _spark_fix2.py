from pathlib import Path
p = Path("desktop/renderer/window-play.test.cjs")
raw = p.read_bytes()
nl = "\r\n" if b"\r\n" in raw else "\n"
text = raw.decode("utf-8").replace("\r\n", "\n").replace("\r", "\n")
old = '  assert.equal(P.playFor("anole"), "flash");\n  assert.equal(P.FLASH, "flash");\n'
new = '  assert.equal(P.playFor("anole"), "flash");\n'
if old not in text:
    raise SystemExit("missing FLASH assert")
text = text.replace(old, new, 1)
if nl != "\n":
    text = text.replace("\n", nl)
p.write_bytes(text.encode("utf-8"))
print("fixed")
