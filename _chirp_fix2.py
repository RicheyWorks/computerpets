from pathlib import Path

def load(p):
    raw = Path(p).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text, nl

def save(p, text, nl):
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(p).write_bytes(text.encode("utf-8"))

def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit("MISSING: " + label)
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

# Amplify song pulse so mid-song rot is clearly the tell
OLD = """  function songPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.28) {
      const s = t / 0.28;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.15, lift: ease * 0.55, rot: ease * -3.2 };
    }
    if (t < 0.78) {
      const s = (t - 0.28) / 0.50;
      const pulse = Math.sin(s * Math.PI * 3.2) * 2.4;
      const ease = s * s * (3 - 2 * s);
      return { x: 0.15 + ease * 0.12 + pulse * 0.08, lift: 0.55 + ease * 0.35 + Math.abs(pulse) * 0.12, rot: -3.2 + ease * 8.6 + pulse };
    }
    return { x: 0.27, lift: 0.9, rot: 5.4 };
  }"""

NEW = """  function songPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.28) {
      const s = t / 0.28;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.18, lift: ease * 0.7, rot: ease * -6.4 };
    }
    if (t < 0.78) {
      const s = (t - 0.28) / 0.50;
      const pulse = Math.sin(s * Math.PI * 3.2) * 4.8;
      const ease = s * s * (3 - 2 * s);
      return { x: 0.18 + ease * 0.16 + pulse * 0.1, lift: 0.7 + ease * 0.55 + Math.abs(pulse) * 0.14, rot: -6.4 + ease * 18.2 + pulse };
    }
    return { x: 0.34, lift: 1.25, rot: 11.8 };
  }"""

HOLD_OLD = """  function songHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const night = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.4) * 1.15;
    return { x: 0.27 + night * 0.04, lift: 0.9 + Math.abs(night) * 0.08, rot: 5.4 + night };
  }"""

HOLD_NEW = """  function songHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const night = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.4) * 1.35;
    return { x: 0.34 + night * 0.05, lift: 1.25 + Math.abs(night) * 0.1, rot: 11.8 + night };
  }"""

for p in ["desktop/renderer/window-play.js", "web/src/lib/pets/window-play.ts"]:
    text, nl = load(p)
    # TS uses export function
    old = OLD
    new = NEW
    hold_old = HOLD_OLD
    hold_new = HOLD_NEW
    if p.endswith(".ts"):
        old = old.replace("  function ", "export function ")
        new = new.replace("  function ", "export function ")
        hold_old = hold_old.replace("  function ", "export function ")
        hold_new = hold_new.replace("  function ", "export function ")
    text = must_replace(text, old, new, p + " songPath")
    text = must_replace(text, hold_old, hold_new, p + " songHoldPath")
    # songOffPath default rot
    text = must_replace(text, "from.rot != null ? from.rot : 5.4", "from.rot != null ? from.rot : 11.8", p + " songOff default")
    save(p, text, nl)
    print("ok", p)

# update test hold expectations
cjs, nl = load("desktop/renderer/window-play.test.cjs")
cjs = must_replace(
    cjs,
    '  assert.ok(Math.abs(hold.rot - 5.4) < 2.0, "she holds the night song");\n  assert.ok(Math.abs(hold.x - 0.27) < 0.4, "she stays on the grass dish");\n  assert.ok(hold.lift < 3, "night song on the stool, not a husk burst");\n  const off0 = P.songOffPath(0, { x: dish.x, lift: dish.lift + 0.9, rot: 5.4 }, { x: dish.x + 50, lift: 0 });\n  const offMid = P.songOffPath(0.5, { x: dish.x, lift: dish.lift + 0.9, rot: 5.4 }, { x: dish.x + 50, lift: 0 });\n  const off1 = P.songOffPath(1, { x: dish.x, lift: dish.lift + 0.9, rot: 5.4 }, { x: dish.x + 50, lift: 0 });',
    '  assert.ok(Math.abs(hold.rot - 11.8) < 2.5, "she holds the night song");\n  assert.ok(Math.abs(hold.x - 0.34) < 0.4, "she stays on the grass dish");\n  assert.ok(hold.lift < 4, "night song on the stool, not a husk burst");\n  const off0 = P.songOffPath(0, { x: dish.x, lift: dish.lift + 1.25, rot: 11.8 }, { x: dish.x + 50, lift: 0 });\n  const offMid = P.songOffPath(0.5, { x: dish.x, lift: dish.lift + 1.25, rot: 11.8 }, { x: dish.x + 50, lift: 0 });\n  const off1 = P.songOffPath(1, { x: dish.x, lift: dish.lift + 1.25, rot: 11.8 }, { x: dish.x + 50, lift: 0 });',
    "cjs hold expects",
)
cjs = must_replace(
    cjs,
    '      assert.ok(Math.abs(play.lift - (play.target.holdLift + 0.9)) < 3, "she holds the night song on the stool");',
    '      assert.ok(Math.abs(play.lift - (play.target.holdLift + 1.25)) < 3.5, "she holds the night song on the stool");',
    "cjs hold lift",
)
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("cjs expects ok")
