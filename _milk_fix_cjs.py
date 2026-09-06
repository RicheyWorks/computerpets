from pathlib import Path
p = Path(r"C:\Users\730ri\projects\ComputerPets\desktop\renderer\window-play.test.cjs")
raw = p.read_bytes()
nl = "\r\n" if b"\r\n" in raw else "\n"
text = raw.decode("utf-8").replace("\r\n", "\n")
old = '''  assert.equal(P.playFor("hummingbird"), "sip");
  assert.equal(P.SIP, "sip");
  assert.equal(P.playFor("kinkajou"), "wrap");
  assert.equal(P.WRAP, "wrap");
'''
new = '''  assert.equal(P.playFor("hummingbird"), "sip");
  assert.equal(P.playFor("kinkajou"), "wrap");
'''
n = text.count(old)
if n != 1:
    raise SystemExit("expected 1, got %d" % n)
text = text.replace(old, new, 1)
p.write_bytes(text.replace("\n", nl).encode("utf-8"))
print("fixed SIP/WRAP const asserts")
