from pathlib import Path

old = '''  assert.ok(P.canStart({ asleep: false, hidden: false, leaving: false, card: false, cmd: "idle" }));
  assert.equal(P.canStart({ asleep: true, cmd: "sleep" }), false);
  assert.equal(P.shouldAbort({ phase: "spots" }, { asleep: true, cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ phase: "spots-hold" }, { asleep: false, hidden: false, leaving: false, card: false, cmd: "idle" }), false);'''

new = '''  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);'''

for path in [
  Path("desktop/renderer/window-play.test.cjs"),
  Path("web/scripts/window-play.test.mjs"),
]:
  t = path.read_text(encoding="utf-8")
  if old not in t:
    raise SystemExit(f"abort block missing in {path}")
  path.write_text(t.replace(old, new, 1), encoding="utf-8")
  print("fixed", path)
