from pathlib import Path

mjs_path = Path("web/scripts/window-play.test.mjs")
mjs = mjs_path.read_text(encoding="utf-8-sig")  # strip BOM if present
# Fix Pact main pickTarget photovore -> lichen (only the one asserting plaque kind after)
old = '''  assert.equal(Overlay.playFor("lichen"), "plaque");
  const target = P.pickTarget([WIN], 80, "photovore", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "plaque");'''
new = '''  assert.equal(Overlay.playFor("lichen"), "plaque");
  const target = P.pickTarget([WIN], 80, "lichen", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "plaque");'''
if old not in mjs:
    raise SystemExit("mjs pact pickTarget block missing:\n" + mjs[mjs.find("Overlay.playFor(\"lichen\")"):mjs.find("Overlay.playFor(\"lichen\")")+250])
mjs = mjs.replace(old, new, 1)
# also ensure no BOM on test( 
mjs = mjs.replace("\ufeff", "")
mjs_path.write_text(mjs, encoding="utf-8", newline="\n")

cjs_path = Path("desktop/renderer/window-play.test.cjs")
cjs = cjs_path.read_text(encoding="utf-8-sig").replace("\ufeff", "")
cjs_path.write_text(cjs, encoding="utf-8", newline="\n")

# verify
mjs2 = mjs_path.read_text(encoding="utf-8")
idx = mjs2.find("Pact plaques")
print(repr(mjs2[idx-2:idx+20]))
print("pact pick lichen", 'pickTarget([WIN], 80, "lichen"' in mjs2[mjs2.find("Pact plaques"):mjs2.find("Pact plaques")+800])
print("abort pick", 'pickTarget([WIN], 200, "lichen"' in mjs2[mjs2.find("bark-stone plaque"):mjs2.find("bark-stone plaque")+400])
